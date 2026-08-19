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
              latest.sleep != null)
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
