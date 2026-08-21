/**
 * 睡眠监测仪（毫米波雷达款）—— 智慧物联网云平台数据桥接
 *
 * 后端接收服务：/workspace/band-server/radar.js（挂在 band-server 上，默认端口 8091）
 *  - 平台鉴权：appKey + timestamp + signature=MD5(path+timestamp+appSecret)
 *  - 实时数据：MQTT 订阅 topic 推送 → 后端归一化 → SSE kind='radar' 下发前端
 *  - /api/radar/* 供 H5 校验设备、绑定/解绑、查询最新呼吸/体动/离床
 *
 * 本模块只展示后端真实上报的数据，未收到数据时返回 null，由页面显示占位符（--）。
 * 地址解析复用 band.js 的 bandApi()：雷达接口与手环接口同源同端口。
 */

import { bandApi } from './band.js'

export let lastRadarError = null
export function getLastRadarError() { return lastRadarError }

function _logReq(tag, url, resOrErr, extra) {
  try {
    const isErr = (resOrErr && resOrErr.__fail) || (resOrErr && typeof resOrErr.statusCode === 'number' && (resOrErr.statusCode < 200 || resOrErr.statusCode >= 300))
    const code = resOrErr && typeof resOrErr.statusCode === 'number' ? resOrErr.statusCode : (resOrErr && resOrErr.__fail ? 'FAIL' : '?')
    const busCode = resOrErr && resOrErr.data && typeof resOrErr.data.code !== 'undefined' ? resOrErr.data.code : null
    if (isErr || (busCode != null && busCode !== 0)) {
      const msg = '[radar][' + tag + '] 失败 HTTP=' + code + ' 业务=' + busCode + '  URL=' + url + (extra ? '  EXTRA=' + JSON.stringify(extra) : '')
      if (typeof console !== 'undefined' && console.error) console.error(msg, resOrErr || '')
      lastRadarError = { at: Date.now(), tag, url, http: code, bus: busCode, extra: extra || null }
    } else if (typeof console !== 'undefined' && console.debug) {
      console.debug('[radar][' + tag + '] OK HTTP=' + code + ' 业务=' + busCode + '  ' + url, extra || '')
    }
  } catch (e) { /* ignore */ }
}

// 统一请求封装：失败一律 resolve(fallback)，绝不 reject，也不弹 toast（会被轮询高频调用）
function _req(tag, path, method, data, fallback) {
  return new Promise((resolve) => {
    const url = bandApi(path)
    uni.request({
      url: url,
      method: method || 'GET',
      data: data || undefined,
      timeout: 20000,
      success(res) {
        const ok = res.statusCode === 200 && res.data && res.data.code === 0
        _logReq(tag, url, res, ok ? null : { message: (res.data && res.data.message) || null })
        resolve(ok ? res.data.data : fallback)
      },
      fail(err) {
        _logReq(tag, url, Object.assign({ __fail: true }, err || {}))
        resolve(fallback)
      }
    })
  })
}

/* ---------------- 通道自检 ---------------- */

// 平台通道状态：{ company, appKey, apiBase, modelName, mq: { state, error, msgCount... }, devices }
// mq.state: idle / connecting / connected / reconnecting / offline / error
export function fetchRadarStatus() {
  return _req('GET /api/radar/status', '/api/radar/status?_t=' + Date.now(), 'GET', null, null)
}

// 平台连通性 + 签名校验（调型号列表）。返回 { ok, models } 或 null
export function pingRadarPlatform() {
  return _req('GET /api/radar/ping', '/api/radar/ping?_t=' + Date.now(), 'GET', null, null)
}

/* ---------------- 设备查询 ---------------- */

// 扫码后绑定前置校验：设备号是否真实存在于平台
// 成功返回 { deviceImei, deviceId, model, typeName, state, stateText, companyName, site }
// 平台查不到 / 网络失败均返回 null
export function verifyRadarDevice(deviceid) {
  if (!deviceid) return Promise.resolve(null)
  return _req('GET /api/radar/verify/:imei', '/api/radar/verify/' + encodeURIComponent(deviceid) + '?_t=' + Date.now(), 'GET', null, null)
}

// 本地已绑定的雷达设备列表（不含 history）
export function listRadarDevices() {
  return _req('GET /api/radar/devices', '/api/radar/devices?_t=' + Date.now(), 'GET', null, [])
}

// 单台雷达完整记录：{ deviceid, name, model, latest, attrs, state, stateText, site, lastSeen }
// refresh=true 时后端会回平台同步一次基础信息（受每秒 1 次限流保护，略慢）
export function fetchRadarRecord(deviceid, refresh) {
  if (!deviceid) return Promise.resolve(null)
  let path = '/api/radar/devices/' + encodeURIComponent(deviceid) + '?_t=' + Date.now()
  if (refresh) path += '&refresh=1'
  return _req('GET /api/radar/devices/:imei', path, 'GET', null, null)
}

// 只取最新快照（给设备列表页用）
export function fetchRadarLatest(deviceid) {
  return fetchRadarRecord(deviceid).then((rec) => (rec && rec.latest ? rec.latest : null))
}

// 批量拉取多台雷达最新快照，返回 { [deviceid]: latest | null }
export function fetchRadarLatestBatch(deviceids) {
  const ids = Array.isArray(deviceids) ? deviceids.filter(Boolean) : []
  if (ids.length === 0) return Promise.resolve({})
  return Promise.all(ids.map((id) => fetchRadarLatest(id).then((v) => [id, v]))).then((pairs) => {
    const out = {}
    pairs.forEach(([id, v]) => { out[id] = v })
    return out
  })
}

// 型号属性表（日后拿到真实 deviceModelName 后校准字段映射用）
export function fetchRadarAttributes(model) {
  const m = String(model || '').trim()
  if (!m) return Promise.resolve(null)
  return _req('GET /api/radar/attributes', '/api/radar/attributes?model=' + encodeURIComponent(m), 'GET', null, null)
}

/* ---------------- 绑定 / 解绑 ---------------- */

// 绑定雷达设备：后端先向平台校验设备真实存在，再落本地库并广播 device_bind
// 返回设备记录，失败返回 null（错误详情见 getLastRadarError()）
export function bindRadarDevice(deviceid, name) {
  if (!deviceid) return Promise.resolve(null)
  return _req('POST /api/radar/devices', '/api/radar/devices', 'POST', { deviceid: deviceid, name: name || '' }, null)
}

// 解绑：后端打 markedUnbound 标记而非真删，保住历史数据
export function unbindRadarDevice(deviceid) {
  if (!deviceid) return Promise.resolve(false)
  return _req('DELETE /api/radar/devices/:imei', '/api/radar/devices/' + encodeURIComponent(deviceid), 'DELETE', null, null)
    .then((d) => !!d)
}

/* ---------------- 展示辅助 ---------------- */

// 平台设备状态码 → 中文
export const RADAR_STATE_TEXT = {
  0: '正常', 1: '故障', 2: '报警', 3: '手动报警',
  4: '离线', 5: '待删除', 6: '停用', 7: '未激活'
}

export function radarStateText(state) {
  if (state == null || state === '') return ''
  return RADAR_STATE_TEXT[Number(state)] || String(state)
}

// 在床状态判定：latest.inBed 由后端按属性名关键词归一（1/0 或 有人/无人）
// 返回 true 在床 / false 离床 / null 未知
export function radarInBed(latest) {
  if (!latest) return null
  const v = latest.inBed
  if (v == null || v === '') return null
  if (typeof v === 'number') return v > 0
  const s = String(v)
  if (/^(1|true|yes)$/i.test(s) || s.indexOf('有人') >= 0 || s.indexOf('在床') >= 0) return true
  if (/^(0|false|no)$/i.test(s) || s.indexOf('无人') >= 0 || s.indexOf('离床') >= 0) return false
  return null
}

// 呼吸频率评估（成人静息 12-20 次/分）：返回 { level, text }
export function respLevel(respRate) {
  const v = Number(respRate)
  if (!isFinite(v) || v <= 0) return { level: 'unknown', text: '' }
  if (v < 12) return { level: 'low', text: '偏慢' }
  if (v <= 20) return { level: 'normal', text: '正常' }
  if (v <= 24) return { level: 'high', text: '偏快' }
  return { level: 'danger', text: '过快' }
}
