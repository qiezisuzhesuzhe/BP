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

// 判断响应体是否确实来自本项目的 JSON 接口。
// 典型陷阱：H5 dev server 的 SPA history fallback 会对未代理的 /api/* 返回 200 + index.html，
// 若把它当成"接口正常答复"，业务层会误以为"平台明确说查不到该设备"。
function _isApiEnvelope(data) {
  if (!data) return false
  if (typeof data === 'string') return false // HTML / 纯文本一律视为非接口响应
  return typeof data === 'object' && typeof data.code !== 'undefined'
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
        const envelope = _isApiEnvelope(res.data)
        const ok = res.statusCode === 200 && envelope && res.data.code === 0
        _logReq(tag, url, res, ok ? null : { message: (envelope && res.data.message) || (envelope ? null : '响应不是接口 JSON（可能未配置接口代理）') })
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

// verifyRadarDevice 的增强版：把"平台明确答复不是雷达"和"后端/网络不可达"区分开。
// 前者可以放心回落到手环，后者必须交给用户确认设备类型，否则会把雷达误判成手环。
// 返回 Promise<{ reachable: boolean, device: object|null }>
export function verifyRadarDeviceEx(deviceid) {
  if (!deviceid) return Promise.resolve({ reachable: false, device: null })
  const tag = 'GET /api/radar/verify/:imei'
  const path = '/api/radar/verify/' + encodeURIComponent(deviceid) + '?_t=' + Date.now()
  return new Promise((resolve) => {
    const url = bandApi(path)
    uni.request({
      url: url,
      method: 'GET',
      timeout: 20000,
      success(res) {
        const envelope = _isApiEnvelope(res.data)
        const ok = res.statusCode === 200 && envelope && res.data.code === 0
        _logReq(tag, url, res, ok ? null : { message: (envelope && res.data.message) || (envelope ? null : '响应不是接口 JSON（可能未配置接口代理）') })
        if (ok) {
          resolve({ reachable: true, device: res.data.data || null })
          return
        }
        // 后端答复了但业务失败：404 / 业务码非 0 视为"平台确认查不到该雷达"，属于可信结论；
        // 5xx 属于服务端自身异常，不能当作结论；
        // 拿不到接口信封（返回 HTML 等）说明请求根本没到 band-server，同样不可信。
        const serverBroke = res.statusCode >= 500 || !envelope
        resolve({ reachable: !serverBroke, device: null })
      },
      fail(err) {
        // 连不上对接后端（未启动 / 跨域 / 断网）：结论不可信
        _logReq(tag, url, Object.assign({ __fail: true }, err || {}))
        resolve({ reachable: false, device: null })
      }
    })
  })
}

// 本地已绑定的雷达设备列表（不含 history）
export function listRadarDevices() {
  return _req('GET /api/radar/devices', '/api/radar/devices?_t=' + Date.now(), 'GET', null, [])
}

// 单台雷达完整记录：{ deviceid, name, model, latest, attrs, state, stateText, site, lastSeen }
// refresh=true 时后端会回平台同步一次基础信息（受每秒 1 次限流保护，略慢），
// 且在 MQTT 离线时后端会在本地合成一条新的心率/呼吸数据，让前端演示时能看到实时变化。
export function fetchRadarRecord(deviceid, refresh) {
  if (!deviceid) return Promise.resolve(null)
  // 默认带 refresh=1：让每次拉取都能触发后端的数据合成/同步，避免永远停在历史快照
  let path = '/api/radar/devices/' + encodeURIComponent(deviceid) + '?_t=' + Date.now()
  if (refresh !== false) path += '&refresh=1'
  return _req('GET /api/radar/devices/:imei', path, 'GET', null, null)
}

// 只取最新快照（给设备列表页用）
// 返回 { ...latest, lastSeen }：把后端"最后一次访问时间"一起带过来，供列表页在没有生命体征数据时兜底判定在线
export function fetchRadarLatest(deviceid) {
  return fetchRadarRecord(deviceid).then((rec) => {
    if (!rec) return null
    const latest = rec.latest ? Object.assign({}, rec.latest) : {}
    if (rec.lastSeen != null) latest.lastSeen = rec.lastSeen
    return latest
  })
}

// 批量拉取多台雷达最新快照，返回 { [deviceid]: latest+lastSeen | null }
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

// bindRadarDevice 的增强版：把失败原因带回页面，便于弹层给出对症提示。
// 返回 Promise<{ ok, record, reachable, message }>
//  - ok=true：绑定成功，record 为设备记录
//  - ok=false 且 reachable=true：对接后端答复了，但平台拒绝（设备号不存在 / 未注册），message 为后端原文
//  - ok=false 且 reachable=false：请求没到后端（未启动 / 未配代理 / 断网 / 5xx），结论不可信
export function bindRadarDeviceEx(deviceid, name) {
  if (!deviceid) return Promise.resolve({ ok: false, record: null, reachable: false, message: '缺少设备号' })
  const tag = 'POST /api/radar/devices'
  const path = '/api/radar/devices'
  return new Promise((resolve) => {
    const url = bandApi(path)
    uni.request({
      url: url,
      method: 'POST',
      data: { deviceid: deviceid, name: name || '' },
      timeout: 20000,
      success(res) {
        const envelope = _isApiEnvelope(res.data)
        const ok = res.statusCode === 200 && envelope && res.data.code === 0
        const message = envelope ? (res.data.message || null) : '响应不是接口 JSON（可能未配置接口代理）'
        _logReq(tag, url, res, ok ? null : { message: message })
        if (ok) {
          resolve({ ok: true, record: res.data.data || null, reachable: true, message: null })
          return
        }
        const serverBroke = res.statusCode >= 500 || !envelope
        resolve({ ok: false, record: null, reachable: !serverBroke, message: message })
      },
      fail(err) {
        _logReq(tag, url, Object.assign({ __fail: true }, err || {}))
        resolve({ ok: false, record: null, reachable: false, message: (err && err.errMsg) || '网络请求失败' })
      }
    })
  })
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

// 心率评估（成人静息 60-100 bpm）：返回 { level, text }
export function heartRateLevel(hr) {
  const v = Number(hr)
  if (!isFinite(v) || v <= 0) return { level: 'unknown', text: '' }
  if (v < 60) return { level: 'low', text: '偏慢' }
  if (v <= 100) return { level: 'normal', text: '正常' }
  if (v <= 120) return { level: 'high', text: '偏快' }
  return { level: 'danger', text: '过快' }
}

// 异常挣扎检测：struggleAlert > 0 视为有挣扎预警
// 返回 { count, active, level, text }
export function radarStruggleAlert(latest) {
  if (!latest) return { count: 0, active: false, level: 'normal', text: '无' }
  const c = Number(latest.struggleAlert) || 0
  if (c <= 0) return { count: 0, active: false, level: 'normal', text: '无' }
  if (c <= 2) return { count: c, active: true, level: 'warning', text: '偶发' }
  if (c <= 5) return { count: c, active: true, level: 'high', text: '频繁' }
  return { count: c, active: true, level: 'danger', text: '剧烈' }
}
