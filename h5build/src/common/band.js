/**
 * 智能手环（血压款）—— 埃微 iwown 设备对云 数据桥接
 *
 * 后端接收服务：/workspace/band-server（Node.js，默认端口 8091）
 *  - /pb/upload 等 6 个路径接收手环 4G 直传数据（埃微自定义二进制 + protobuf）
 *  - /api/devices 供 H5 查询最新心率/血压/步数
 *
 * 本模块：后端地址配置 + 拉取/绑定封装。只展示后端真实上报的数据，
 * 未收到数据时返回 null，由页面显示占位符（--）。
 */

// 后端接收服务：H5 页面由 band-server(8091) 同源托管，API 使用相对路径，
// 这样无论从本地预览、内网穿透公网地址还是手机访问，都能正确请求到本服务
export const BAND_SERVER = ''

export function bandApi(path) {
  return BAND_SERVER + path
}

// 从后端拉取手环最新状态（心率 hr / 收缩压 sbp / 舒张压 dbp / 步数 steps / 电量 battery / 时间戳 ts）
// 后端不可达或尚无上报数据时 resolve(null)，由页面显示 "--"，不做模拟兜底
// URL 附加时间戳 + 后端 no-store，双保险绕过浏览器 HTTP 缓存，保证每次轮询都是最新数据
export function fetchBandLatest(deviceid) {
  return new Promise((resolve) => {
    uni.request({
      url: bandApi('/api/devices/' + deviceid) + '?_t=' + Date.now(),
      method: 'GET',
      timeout: 5000,
      success(res) {
        if (res.statusCode === 200 && res.data && res.data.code === 0) {
          const latest = res.data.data && res.data.data.latest
          if (
            latest &&
            (latest.hr != null ||
              latest.sbp != null ||
              latest.steps != null ||
              latest.spo2 != null ||
              latest.ecgSamples != null ||
              latest.sleep != null ||
              latest.bodyTemp != null ||
              latest.skinTemp != null ||
              latest.stress != null)
          ) {
            resolve(latest)
            return
          }
        }
        resolve(null)
      },
      fail() {
        resolve(null)
      }
    })
  })
}

// 拉取当前公网上报地址（隧道重启后 lhr.life 域名会变化，后端返回最新一条）
// 后端不可达或未配置隧道时 resolve(null)，页面显示占位符；同样加时间戳防缓存
export function fetchBandAddress() {
  return new Promise((resolve) => {
    uni.request({
      url: bandApi('/api/address') + '?_t=' + Date.now(),
      method: 'GET',
      timeout: 5000,
      success(res) {
        if (res.statusCode === 200 && res.data && res.data.code === 0 && res.data.data) {
          resolve(res.data.data)
        } else {
          resolve(null)
        }
      },
      fail() {
        resolve(null)
      }
    })
  })
}

// 发送消息到手环（后端转发 entservice 指令下发，见 server.js /api/band/message）
// title ≤15 字节，description ≤240 字节；成功 resolve(null)，失败 resolve(错误信息)
export function sendBandMessage(deviceid, title, description) {
  return new Promise((resolve) => {
    uni.request({
      url: bandApi('/api/band/message'),
      method: 'POST',
      data: { device_id: deviceid, title: title, description: description },
      timeout: 15000,
      success(res) {
        if (res.statusCode === 200 && res.data && res.data.code === 0) {
          resolve(null)
        } else {
          resolve((res.data && res.data.message) || '发送失败(' + (res.statusCode || '') + ')')
        }
      },
      fail() {
        resolve('无法连接消息服务')
      }
    })
  })
}

// 把手环设备注册到后端（绑定 deviceid 与用户）
export function bindBandDevice(deviceid, name) {
  return new Promise((resolve) => {
    uni.request({
      url: bandApi('/api/devices'),
      method: 'POST',
      data: { deviceid: deviceid, name: name },
      timeout: 5000,
      success(res) {
        if (res.statusCode === 200 && res.data && res.data.code === 0) {
          resolve(res.data.data)
        } else {
          resolve(null)
        }
      },
      fail() {
        resolve(null)
      }
    })
  })
}

// 解绑手环设备（从后端设备库移除）
export function unbindBandDevice(deviceid) {
  return new Promise((resolve) => {
    if (!deviceid) {
      resolve(null)
      return
    }
    uni.request({
      url: bandApi('/api/devices/' + encodeURIComponent(deviceid)),
      method: 'DELETE',
      timeout: 5000,
      success(res) {
        if (res.statusCode === 200 && res.data && res.data.code === 0) {
          resolve(true)
        } else {
          resolve(false)
        }
      },
      fail() {
        resolve(false)
      }
    })
  })
}

// 批量拉取多个 deviceid 的最新状态（给设备列表页用）
// 返回 { [deviceid]: latestSnapshot | null }
export function fetchBandLatestBatch(deviceids) {
  return new Promise((resolve) => {
    const ids = Array.isArray(deviceids) ? deviceids.filter(Boolean) : []
    if (ids.length === 0) {
      resolve({})
      return
    }
    const out = {}
    let remain = ids.length
    ids.forEach((id) => {
      uni.request({
        url: bandApi('/api/devices/' + id) + '?_t=' + Date.now(),
        method: 'GET',
        timeout: 5000,
        success(res) {
          if (res.statusCode === 200 && res.data && res.data.code === 0 && res.data.data && res.data.data.latest) {
            out[id] = res.data.data.latest
          } else {
            out[id] = null
          }
        },
        fail() {
          out[id] = null
        },
        complete() {
          remain--
          if (remain <= 0) resolve(out)
        }
      })
    })
    // 兜底超时 8s
    setTimeout(() => {
      ids.forEach((id) => {
        if (!(id in out)) out[id] = null
      })
      if (remain > 0) {
        remain = 0
        resolve(out)
      }
    }, 8000)
  })
}

/* ---------------- SSE 实时事件订阅（手环主动上报 → 前端即时感知） ---------------- */
// 返回一个 { close(), isOpen() } 对象；
// 用法：
//   const sub = subscribeEvents({
//     deviceid: '86xxx..', // 可选，仅收该设备
//     kinds: ['pb','alarm','sos','status','deviceinfo','calllog','device_bind','device_unbind'],
//     onOpen: () => {},
//     onClose: () => {},
//     onEvent: ({ kind, ts, id, payload }) => {},
//     onError: (err) => {}
//   })
// 页面离开时 sub.close()
export function subscribeEvents({ deviceid, kinds, onOpen, onClose, onEvent, onError } = {}) {
  const opts = { deviceid: deviceid || null, kinds: kinds || [], onOpen, onClose, onEvent, onError }
  let es = null
  let closed = false
  let manual = false
  let lastTs = 0

  function buildUrl() {
    const query = []
    if (opts.deviceid) query.push('deviceid=' + encodeURIComponent(opts.deviceid))
    if (opts.kinds && opts.kinds.length) query.push('kinds=' + encodeURIComponent(opts.kinds.join(',')))
    if (lastTs) query.push('since=' + lastTs)
    return bandApi('/api/events/stream') + (query.length ? '?' + query.join('&') : '')
  }

  function fireOpen() { opts.onOpen && opts.onOpen() }
  function fireClose() { opts.onClose && opts.onClose() }
  function fireError(err) { opts.onError && opts.onError(err) }
  function fireEvent(evt) {
    if (!evt) return
    try {
      if (evt.ts && Number(evt.ts) > lastTs) lastTs = Number(evt.ts)
    } catch (e) {}
    opts.onEvent && opts.onEvent(evt)
  }

  function start() {
    if (closed) return
    if (typeof EventSource !== 'undefined') {
      // H5 / 支持 EventSource 的平台
      try {
        es = new EventSource(buildUrl(), { withCredentials: false })
      } catch (e) {
        fireError(e && e.message ? e.message : String(e))
        scheduleReconnect()
        return
      }
      es.onopen = () => { fireOpen() }
      es.onerror = (e) => {
        if (closed) return
        fireError(e && e.message ? e.message : 'sse error')
        // EventSource 自身会自动重连，只需关闭 & 重建以追加 since
        try { es && es.close() } catch (_e) {}
        scheduleReconnect()
      }
      es.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data)
          fireEvent(data)
        } catch (e) {
          fireError('parse sse message failed: ' + String(e))
        }
      }
      // 同时监听有名字的事件（后端 event: 对应事件名）
      const KINDS_EXPECTED = ['pb','alarm','sos','calllog','deviceinfo','status','device_bind','device_unbind']
      KINDS_EXPECTED.forEach((k) => {
        es.addEventListener(k, (ev) => {
          try {
            const data = JSON.parse(ev.data)
            fireEvent(Object.assign({ kind: k }, data))
          } catch (e) {}
        })
      })
      return
    }
    // 兜底：uni-app 小程序/APP 环境没有 EventSource，用 uni.request 长轮询（15 秒 + 立即再拉 + since）
    manual = true
    longPollOnce()
  }

  let reconnectTimer = null
  function scheduleReconnect() {
    if (closed) return
    clearTimeout(reconnectTimer)
    reconnectTimer = setTimeout(start, 3000)
  }

  let lpTimer = null
  function longPollOnce() {
    if (closed) return
    clearTimeout(lpTimer)
    let done = false
    const req = uni.request({
      url: buildUrl(),
      method: 'GET',
      // 允许长连接：超时 60s，服务端保持
      timeout: 60000,
      header: { Accept: 'text/event-stream' },
      success(res) {
        if (done) return
        done = true
        if (res && typeof res.data === 'string') {
          // 解析 SSE 文本事件块
          const blocks = String(res.data).split(/\n\n/)
          blocks.forEach((blk) => {
            const lines = blk.split(/\n/)
            let kind = null
            let id = null
            let dataStr = ''
            lines.forEach((l) => {
              if (l.indexOf('event:') === 0) kind = l.slice(6).trim()
              else if (l.indexOf('id:') === 0) id = l.slice(3).trim()
              else if (l.indexOf('data:') === 0) dataStr += l.slice(5)
            })
            if (!dataStr) return
            try {
              const d = JSON.parse(dataStr)
              fireEvent(Object.assign({ kind: kind || d.kind || null, id: id || d.id || null }, d))
            } catch (e) {}
          })
        }
        fireOpen()
        // 立刻再拉下一条（since 已更新）
        lpTimer = setTimeout(longPollOnce, 800)
      },
      fail(err) {
        if (done) return
        done = true
        fireError(err && err.errMsg ? err.errMsg : 'long poll error')
        scheduleReconnect()
      }
    })
    // 防阻塞：最多 55 秒强制认为请求结束
    setTimeout(() => {
      if (done) return
      done = true
      try { req && req.abort && req.abort() } catch (e) {}
      lpTimer = setTimeout(longPollOnce, 300)
    }, 55000)
  }

  start()
  return {
    close() {
      closed = true
      clearTimeout(reconnectTimer)
      clearTimeout(lpTimer)
      if (es) {
        try { es.close() } catch (e) {}
        es = null
      }
      fireClose()
    },
    isOpen() {
      if (manual) return !closed
      return !!es && es.readyState === 1
    }
  }
}

// 从二维码文本中宽容提取设备号（IMEI/deviceid），兼容多种厂商二维码格式
export function extractDeviceId(text) {
  const raw = String(text || '').trim()
  if (!raw) return ''
  // 1) 参数形式：imei/deviceid/device_id/sn/serial = 值
  const p = raw.match(/(?:imei|device[_-]?id|device_id|sn|serial)\s*[=:"'：\s]\s*([A-Za-z0-9]{8,20})/i)
  if (p) return p[1]
  // 2) JSON 键值形式
  const j = raw.match(/["']?(?:imei|device[_-]?id|device_id|sn|serial)["']?\s*[:=]\s*["']?([A-Za-z0-9]{8,20})/i)
  if (j) return j[1]
  // 3) 任意位置出现的 15 位连续数字（IMEI）
  const d15 = raw.match(/(?:^|[^\d])(\d{15})(?:[^\d]|$)/)
  if (d15) return d15[1]
  // 3.5) 去除空格/横线后的连续数字（如 "86 0132 0608 7222 3"）
  const compact = raw.replace(/[\s-]/g, '')
  const d15c = compact.match(/(?:^|[^\d])(\d{15})(?:[^\d]|$)/)
  if (d15c) return d15c[1]
  // 4) 兜底：10~20 位连续数字
  const d = raw.match(/(?:^|[^\d])(\d{10,20})(?:[^\d]|$)/)
  if (d) return d[1]
  return ''
}

// 血压状态分级
export function bpLevel(sbp, dbp) {
  if (sbp == null || dbp == null) return { key: 'none', label: '--', color: '#94a3b8' }
  if (sbp >= 140 || dbp >= 90) return { key: 'high', label: '偏高', color: '#f15533' }
  if (sbp >= 120 || dbp >= 80) return { key: 'normal-h', label: '正常偏高', color: '#f2994a' }
  return { key: 'normal', label: '正常', color: '#27ae60' }
}
