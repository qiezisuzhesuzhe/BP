/**
 * 睡眠监测仪 - 毫米波雷达款 —— 智慧物联网云平台对接模块
 *
 * 平台文档：《智慧物联网云平台应用开放api接口文档 v4.8》
 * 单位名称：叁陆伍智慧（北京）医疗科技有限公司
 *
 * 与手环（设备直连本服务上报二进制）不同，雷达走「云对云」：
 *   1) 主动查询：HTTP 调 webapi.nbiotyun.com，Header 三件套鉴权
 *      appKey / timestamp(ms) / signature = MD5(path + timestamp + appSecret)
 *      ⚠️ 平台两条硬约束（文档 7.1 错误码）：
 *         - iot.common.TimestampOverTime：签名时间戳不得超过当前时间 3s，签名必须现算现用不可缓存
 *         - iot.common.tokenLimit：每秒只能访问一次，故所有请求走串行队列 + 最小间隔
 *   2) 被动接收：订阅平台消息队列 topic，拿设备事件上报（对应文档 2.1.1 字段结构）
 *      推送报文里的实时数据是 items[{attrName,value}] / body.attrList[{attrCode,attrName,attrValue,unit}]
 *      这种「通用属性数组」，不是固定字段，因此这里做关键词自适应映射，未知属性原样透传。
 */
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const { execFile } = require('child_process')

/* ---------------- 配置 ---------------- */
const CFG = {
  apiBase: process.env.RADAR_API_BASE || 'https://webapi.nbiotyun.com',
  appKey: process.env.RADAR_APP_KEY || 'JgA5IzxI',
  appSecret: process.env.RADAR_APP_SECRET || '11dc6d9857597cf3cf613348acf1fb5c1a9bc717',
  company: process.env.RADAR_COMPANY || '叁陆伍智慧（北京）医疗科技有限公司',
  mqUrl: process.env.RADAR_MQ_URL || 'openapi-mq.nbiotyun.com:9092',
  mqTopic: process.env.RADAR_MQ_TOPIC || 'b2f09d516e07a955e771b87435bb66ed',
  mqUser: process.env.RADAR_MQ_USER || '',
  mqPass: process.env.RADAR_MQ_PASS || '',
  // 设备型号名称：平台侧 deviceModelName，用于查属性表 / 过滤设备列表。
  // 目前未知，留空则不做型号过滤，属性走通用映射。
  modelName: process.env.RADAR_MODEL_NAME || '',
  // HTTP 回调 token：平台配置推送 URL 时会用此 token 做签名校验（MD5 排序拼接）
  // 留空则跳过校验，返回 nonce 即可
  httpPushToken: process.env.RADAR_HTTP_TOKEN || 'yguvogy8g976t79gy9'
}

const DATA_DIR = path.join(__dirname, 'data')
const RADAR_DB = path.join(DATA_DIR, 'radar.json')

function loadDB() {
  try {
    return JSON.parse(fs.readFileSync(RADAR_DB, 'utf8'))
  } catch (e) {
    return { devices: {} }
  }
}
function saveDB(db) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(RADAR_DB, JSON.stringify(db, null, 2))
}
let rdb = loadDB()

function touchDev(imei) {
  if (!rdb.devices[imei]) {
    rdb.devices[imei] = {
      deviceid: imei,
      name: '睡眠监测仪 - 毫米波雷达款',
      model: CFG.modelName || '',
      typeKey: 'radar',
      firstSeen: Date.now(),
      latest: {},
      attrs: [],
      history: []
    }
  }
  const d = rdb.devices[imei]
  d.lastSeen = Date.now()
  return d
}

/* ---------------- 鉴权签名 ---------------- */
// signature = MD5(path + timestamp + appSecret)，path 含 query，如 /api/v1/dev/get?a=1
function signHeaders(pathWithQuery) {
  const ts = String(Date.now())
  const sig = crypto.createHash('md5').update(pathWithQuery + ts + CFG.appSecret).digest('hex')
  return ['appKey:' + CFG.appKey, 'timestamp:' + ts, 'signature:' + sig]
}

/* ---------------- 串行请求队列（平台限流：每秒 1 次） ---------------- */
const MIN_GAP_MS = 1100
let _lastCallAt = 0
let _chain = Promise.resolve()

function _rawCall(pathWithQuery, method, body) {
  return new Promise((resolve, reject) => {
    const url = CFG.apiBase + pathWithQuery
    const args = ['-s', '--max-time', '20', '-X', method, url, '-H', 'Content-Type:application/json;charset=UTF-8']
    for (const h of signHeaders(pathWithQuery)) args.push('-H', h)
    if (body != null) args.push('-d', JSON.stringify(body))
    execFile('curl', args, { maxBuffer: 4 * 1024 * 1024 }, (err, stdout) => {
      if (err) return reject(new Error('平台请求失败: ' + err.message))
      const text = String(stdout || '')
      try {
        resolve(JSON.parse(text))
      } catch (e) {
        reject(new Error('平台响应非 JSON: ' + text.slice(0, 200)))
      }
    })
  })
}

// 所有平台调用都必须经此入口：串行 + 最小间隔，规避 iot.common.tokenLimit
function apiCall(pathWithQuery, method, body) {
  const run = async () => {
    const wait = _lastCallAt + MIN_GAP_MS - Date.now()
    if (wait > 0) await new Promise((r) => setTimeout(r, wait))
    _lastCallAt = Date.now()
    const res = await _rawCall(pathWithQuery, method || 'POST', body)
    if (res && res.code && res.code !== 'OK') {
      const e = new Error(res.message && typeof res.message === 'string' ? res.message : res.code)
      e.platformCode = res.code
      throw e
    }
    return res && res.message !== undefined ? res.message : res
  }
  _chain = _chain.then(run, run)
  return _chain
}

/* ---------------- 平台接口封装 ---------------- */
// 3.1.2 查询单个设备
function apiGetDevice(imei) {
  return apiCall('/api/v1/dev/get', 'POST', { deviceImei: String(imei), fullFlag: 1 })
}
// 3.1.1 设备列表
function apiListDevices(pageNum, pageSize) {
  const body = { pageNum: pageNum || 1, pageSize: pageSize || 50, fullFlag: 1 }
  if (CFG.modelName) body.deviceModelName = CFG.modelName
  return apiCall('/api/v1/dev/getList', 'POST', body)
}
// 3.7.2 属性列表（拿到该型号真实属性名，用于精确映射）
function apiListAttributes(modelName) {
  return apiCall('/api/v1/attribute/getList', 'POST', { deviceModelName: modelName || CFG.modelName })
}
// 3.1.8 型号列表
function apiListModels() {
  return apiCall('/api/v1/dev/model', 'GET')
}

/* ---------------- 通用属性自适应映射 ---------------- */
// 平台把所有实时值塞进 attrList/items，属性名由型号决定。这里按关键词归一到前端字段，
// 命中不了的原样保留在 attrs 数组里展示，保证「拿到真实型号前也不丢数据」。
const ATTR_RULES = [
  { key: 'respRate', unit: '次/分', kw: ['呼吸', 'respRate'] },
  { key: 'heartRate', unit: 'bpm', kw: ['心率', '心跳', 'heartRate'] },
  { key: 'bodyMove', unit: '次', kw: ['体动', '翻身', '动作', 'bodyMove'] },
  { key: 'bedOff', unit: '次', kw: ['离床', 'bedOff'] },
  { key: 'inBed', unit: '', kw: ['在床', '有人', '人体存在', '存在', 'inBed', 'presence'] },
  { key: 'sleepScore', unit: '分', kw: ['睡眠评分', '睡眠得分', '评分', 'sleepScore'] },
  { key: 'stay', unit: 'h', kw: ['床内时长', '在床时长', '睡眠时长', 'stay'] },
  { key: 'battery', unit: '%', kw: ['电量', '电池', 'battery'] },
  { key: 'signal', unit: '', kw: ['信号', 'signal'] },
  { key: 'fall', unit: '', kw: ['跌倒', '摔倒', 'fall'] },
  { key: 'struggleAlert', unit: '', kw: ['异常挣扎', '挣扎', '挣扎预警', 'abnormal', 'struggle'] },
  { key: 'sleepDuration', unit: 'h', kw: ['睡眠时长', 'sleepDuration'] },
  { key: 'deepSleep', unit: '', kw: ['深睡', '深睡眠', 'deepSleep', 'deep_sleep'] },
  { key: 'lightSleep', unit: '', kw: ['浅睡', '浅睡眠', 'lightSleep', 'light_sleep'] },
  { key: 'awakeSleep', unit: '', kw: ['清醒次数', '清醒时长', 'awakeSleep', 'awake_duration', 'wake_duration'] },
  { key: 'sleepTotal', unit: '', kw: ['总睡眠', '总睡眠时长', 'sleepTotal', 'sleep_total'] }
]

function matchAttrKey(attrName) {
  const n = String(attrName || '')
  for (const r of ATTR_RULES) {
    for (const k of r.kw) if (n.includes(k)) return r.key
  }
  return null
}

// 数值抽取：平台 value 可能带单位，如 "28.5℃" / "16次/分"
function pickNumber(v) {
  const m = String(v == null ? '' : v).match(/-?\d+(?:\.\d+)?/)
  return m ? Number(m[0]) : null
}

// 判断在床值是否为真值（兼容数字/字符串）
function _isTruthy(v) {
  if (v == null || v === '') return false
  if (typeof v === 'number') return v > 0
  const s = String(v)
  return /^(1|true|yes)$/i.test(s) || s.indexOf('有人') >= 0 || s.indexOf('在床') >= 0
}

// 把一条推送报文归一化成 { imei, ts, latest, attrs, event, deviceState }
function normalizePush(msg) {
  const imei = String(msg.imei || msg.deviceImei || (msg.body && msg.body.deviceImei) || '').trim()
  if (!imei) return null
  const body = msg.body || {}
  // 两种承载：2.1.1 推送用 items[{attrName,value}]；3.7.3 用 body.attrList[{attrName,attrValue,unit}]
  const rawList = []
  if (Array.isArray(msg.items)) {
    for (const it of msg.items) rawList.push({ name: it.attrName, value: it.value, unit: '' })
  }
  if (Array.isArray(body.attrList)) {
    for (const it of body.attrList) rawList.push({ name: it.attrName, value: it.attrValue, unit: it.unit || '' })
  }
  if (Array.isArray(msg.attrList)) {
    for (const it of msg.attrList) rawList.push({ name: it.attrName, value: it.attrValue, unit: it.unit || '' })
  }

  const latest = {}
  const attrs = []
  for (const it of rawList) {
    const num = pickNumber(it.value)
    const key = matchAttrKey(it.name)
    if (key) latest[key] = num == null ? it.value : num
    attrs.push({ name: it.name, value: it.value, unit: it.unit, key: key || '' })
  }

  const tsRaw = msg.timestamp || msg.signTime || Date.now()
  // 平台 timestamp 有 10 位(秒) 与 13 位(毫秒) 两种写法
  let ts = Number(tsRaw)
  if (!ts || isNaN(ts)) ts = Date.now()
  else if (String(Math.trunc(ts)).length <= 10) ts = ts * 1000

  return {
    imei,
    ts,
    latest,
    attrs,
    event: body.eventName || msg.eventName || '',
    eventCode: body.eventCode || msg.eventCode || '',
    deviceState: msg.deviceState == null ? null : Number(msg.deviceState),
    dataType: msg.dataType == null ? null : Number(msg.dataType),
    mqPushType: msg.mqPushType == null ? null : Number(msg.mqPushType),
    site: msg.site || '',
    alias: msg.deviceAlias || ''
  }
}

const STATE_TEXT = {
  0: '正常',
  1: '故障',
  2: '报警',
  3: '手动报警',
  4: '离线',
  5: '待删除',
  6: '停用',
  7: '未激活'
}

/* ---------------- MQTT 订阅 ---------------- */
const MQ = {
  kind: 'mqtt',
  state: 'idle', // idle | connecting | online | offline | error
  error: null,
  connectedAt: null,
  msgCount: 0,
  lastMsgAt: null,
  client: null
}

function mqBrokerUrl() {
  const raw = String(CFG.mqUrl || '').trim()
  if (/^[a-z]+:\/\//i.test(raw)) return raw
  return 'mqtt://' + raw
}

function startMqtt(onMessage) {
  let mqtt
  try {
    mqtt = require('mqtt')
  } catch (e) {
    MQ.state = 'error'
    MQ.error = '缺少 mqtt 依赖，请在 band-server 下执行 npm i mqtt'
    console.error('[radar][mq] ' + MQ.error)
    return
  }
  const url = mqBrokerUrl()
  MQ.state = 'connecting'
  MQ.error = null
  console.log('[radar][mq] 连接 ' + url + ' topic=' + CFG.mqTopic)

  const opts = {
    clientId: 'radar_' + CFG.appKey + '_' + Math.random().toString(16).slice(2, 8),
    clean: true,
    reconnectPeriod: 5000,
    connectTimeout: 15000,
    keepalive: 60
  }
  if (CFG.mqUser) opts.username = CFG.mqUser
  if (CFG.mqPass) opts.password = CFG.mqPass
  // 平台未单独下发 MQ 账号时，沿用开放平台凭证做认证
  if (!opts.username) {
    opts.username = CFG.appKey
    opts.password = CFG.appSecret
  }

  const client = mqtt.connect(url, opts)
  MQ.client = client

  client.on('connect', () => {
    MQ.state = 'online'
    MQ.connectedAt = Date.now()
    MQ.error = null
    console.log('[radar][mq] 已连接')
    client.subscribe(CFG.mqTopic, { qos: 1 }, (err) => {
      if (err) {
        MQ.error = '订阅失败: ' + err.message
        console.error('[radar][mq] ' + MQ.error)
      } else {
        console.log('[radar][mq] 订阅成功 topic=' + CFG.mqTopic)
      }
    })
  })

  client.on('message', (topic, payload) => {
    MQ.msgCount++
    MQ.lastMsgAt = Date.now()
    let msg = null
    try {
      msg = JSON.parse(payload.toString('utf8'))
    } catch (e) {
      console.error('[radar][mq] 报文非 JSON，已忽略：' + payload.toString('utf8').slice(0, 160))
      return
    }
    try {
      onMessage(msg)
    } catch (e) {
      console.error('[radar][mq] 处理报文异常', e)
    }
  })

  client.on('reconnect', () => {
    MQ.state = 'connecting'
    console.log('[radar][mq] 重连中…')
  })
  client.on('offline', () => {
    MQ.state = 'offline'
    console.log('[radar][mq] 离线')
  })
  client.on('error', (err) => {
    MQ.state = 'error'
    MQ.error = err && err.message ? err.message : String(err)
    console.error('[radar][mq] 错误：' + MQ.error)
  })
  client.on('close', () => {
    if (MQ.state === 'online') MQ.state = 'offline'
  })
}

/* ---------------- HTTP 回调接收 ---------------- */
const HTTP_PUSH = {
  count: 0,
  lastMsgAt: null
}

// 平台配置推送 URL 时的签名校验：MD5(token + timestamp + nonce) 排序拼接后与 signature 对比
// 若 token 为空则跳过校验直接返回 nonce
function checkHttpSignature(signature, timestamp, nonce) {
  if (!CFG.httpPushToken) return true
  if (!signature || !timestamp || !nonce) return false
  const params = [CFG.httpPushToken, String(timestamp), String(nonce)].sort()
  const content = params[0] + params[1] + params[2]
  const expected = crypto.createHash('md5').update(content).digest('hex')
  return expected === String(signature)
}

/* ---------------- 挂载路由 ---------------- */
/**
 * @param app       express app
 * @param broadcast server.js 的 SSE 广播函数 broadcast(kind, payload)
 */
function mount(app, broadcast) {
  const emit = typeof broadcast === 'function' ? broadcast : () => {}

  // 收到平台推送 → 落库 → SSE 广播给前端
  function handlePush(msg) {
    const n = normalizePush(msg)
    if (!n) {
      console.log('[radar][mq] 报文缺少 imei，已忽略')
      return
    }
    // mqPushType：1 设备事件上报 / 2 设备增删改 / 3 报警工单确认 / 4 故障工单确认 / 5 故障工单创建 / 6 隔离人员
    if (n.mqPushType != null && n.mqPushType !== 1) {
      console.log('[radar][mq] mqPushType=' + n.mqPushType + ' 非设备事件，跳过 ' + n.imei)
      return
    }
    // 只处理已绑定设备，避免同 topic 下其他单位/型号设备污染本地库
    const known = rdb.devices[n.imei]
    if (!known) {
      console.log('[radar][mq] 未绑定设备 ' + n.imei + '，忽略')
      return
    }
    const d = touchDev(n.imei)
    const prevStruggle = (d.latest && d.latest.struggleAlert) || 0
    d.latest = Object.assign({}, d.latest, n.latest, { ts: n.ts })

    // 在床/离床切换历史：状态变化时记录时间戳，保留最近 3 次
    const curInBed = d.latest.inBed
    const prevInBed = d._lastInBed
    if (curInBed != null && curInBed !== prevInBed && prevInBed != null) {
      if (!d.bedHistory) d.bedHistory = []
      d.bedHistory.unshift({ inBed: !!_isTruthy(curInBed), ts: n.ts })
      if (d.bedHistory.length > 3) d.bedHistory.length = 3
    }
    if (curInBed != null) d._lastInBed = curInBed

    // 挣扎历史：struggleAlert 值增加时记录时间戳，保留最近 3 次
    const curStruggle = d.latest.struggleAlert || 0
    if (curStruggle > prevStruggle) {
      if (!d.struggleHistory) d.struggleHistory = []
      d.struggleHistory.unshift({ count: curStruggle, ts: n.ts })
      if (d.struggleHistory.length > 3) d.struggleHistory.length = 3
    }
    if (n.attrs.length) d.attrs = n.attrs
    if (n.deviceState != null) {
      d.state = n.deviceState
      d.stateText = STATE_TEXT[n.deviceState] || String(n.deviceState)
    }
    if (n.event) d.lastEvent = n.event
    if (n.alias && !d.alias) d.alias = n.alias
    if (n.site && !d.site) d.site = n.site
    d.history.push({ ts: n.ts, event: n.event, latest: n.latest })
    if (d.history.length > 200) d.history.splice(0, d.history.length - 200)
    saveDB(rdb)
    emit('radar', {
      deviceid: n.imei,
      snapshot: n.latest,
      attrs: n.attrs,
      event: n.event,
      state: n.deviceState,
      stateText: n.deviceState == null ? '' : STATE_TEXT[n.deviceState] || '',
      ts: n.ts,
      struggleHistory: d.struggleHistory || [],
      bedHistory: d.bedHistory || []
    })
  }

  // 通道状态与配置自检（不回传 appSecret）
  app.get('/api/radar/status', (_req, res) => {
    res.json({
      code: 0,
      data: {
        company: CFG.company,
        appKey: CFG.appKey,
        apiBase: CFG.apiBase,
        modelName: CFG.modelName || null,
        mq: {
          kind: MQ.kind,
          url: mqBrokerUrl(),
          topic: CFG.mqTopic,
          state: MQ.state,
          error: MQ.error,
          connectedAt: MQ.connectedAt,
          msgCount: MQ.msgCount,
          lastMsgAt: MQ.lastMsgAt
        },
        http: {
          path: '/api/radar/push',
          token: CFG.httpPushToken ? '已配置' : null,
          msgCount: HTTP_PUSH.count,
          lastMsgAt: HTTP_PUSH.lastMsgAt
        },
        devices: Object.keys(rdb.devices).length
      }
    })
  })

  // 平台连通性自检：调 3.1.8 型号列表，验证签名与网络
  app.get('/api/radar/ping', async (_req, res) => {
    try {
      const data = await apiListModels()
      res.json({ code: 0, data: { ok: true, models: data } })
    } catch (e) {
      res.json({ code: 1, message: e.message, platformCode: e.platformCode || null })
    }
  })

  // 型号属性表：拿到真实 deviceModelName 后可据此精确映射
  app.get('/api/radar/attributes', async (req, res) => {
    const model = String(req.query.model || CFG.modelName || '').trim()
    if (!model) return res.status(400).json({ code: 400, message: '缺少 model 参数（平台 deviceModelName）' })
    try {
      const data = await apiListAttributes(model)
      res.json({ code: 0, data })
    } catch (e) {
      res.json({ code: 1, message: e.message, platformCode: e.platformCode || null })
    }
  })

  // 平台设备列表（排查绑定时"查不到设备"用）
  app.get('/api/radar/platform/devices', async (req, res) => {
    try {
      const data = await apiListDevices(Number(req.query.pageNum) || 1, Number(req.query.pageSize) || 50)
      res.json({ code: 0, data })
    } catch (e) {
      res.json({ code: 1, message: e.message, platformCode: e.platformCode || null })
    }
  })

  // 扫码后校验：设备号是否真实存在于平台（绑定前置校验）
  app.get('/api/radar/verify/:imei', async (req, res) => {
    const imei = String(req.params.imei || '').trim()
    if (!imei) return res.status(400).json({ code: 400, message: 'imei required' })
    try {
      const info = await apiGetDevice(imei)
      const d = info && (info.data || info)
      if (!d || (!d.deviceImei && !d.deviceId)) {
        return res.json({ code: 404, message: '平台未查询到该设备，请确认二维码设备号' })
      }
      res.json({
        code: 0,
        data: {
          deviceImei: d.deviceImei || imei,
          deviceId: d.deviceId || null,
          model: d.deviceModelName || '',
          typeName: d.deviceTypeName || '',
          state: d.state == null ? null : Number(d.state),
          stateText: d.state == null ? '' : STATE_TEXT[Number(d.state)] || String(d.state),
          companyName: d.companyName || '',
          site: d.installAddress || '',
          registerSign: d.registerSign == null ? null : d.registerSign
        }
      })
    } catch (e) {
      res.json({ code: 1, message: e.message, platformCode: e.platformCode || null })
    }
  })

  // 本地已绑定雷达列表
  app.get('/api/radar/devices', (_req, res) => {
    const list = Object.keys(rdb.devices).map((id) => {
      const d = rdb.devices[id]
      return Object.assign({}, d, { history: undefined }, d.markedUnbound ? { unbound: true } : {})
    })
    res.json({ code: 0, data: list })
  })

  // 单设备最新状态；?refresh=1 时顺带回平台拉一次基础信息（受限流保护）
  app.get('/api/radar/devices/:imei', async (req, res) => {
    const imei = String(req.params.imei || '').trim()
    const d = rdb.devices[imei]
    if (!d) return res.status(404).json({ code: 404, message: 'device not found' })
    if (String(req.query.refresh || '') === '1') {
      try {
        const info = await apiGetDevice(imei)
        const p = info && (info.data || info)
        if (p) {
          if (p.deviceModelName) d.model = p.deviceModelName
          if (p.state != null) {
            d.state = Number(p.state)
            d.stateText = STATE_TEXT[Number(p.state)] || String(p.state)
          }
          if (p.installAddress) d.site = p.installAddress
          d.platformSyncAt = Date.now()
          saveDB(rdb)
        }
      } catch (e) {
        d.platformError = e.message
      }
    }
    const out = Object.assign({}, d, { history: undefined }, d.markedUnbound ? { unbound: true } : {})
    res.json({ code: 0, data: out })
  })

  // 绑定：先向平台校验设备真实存在，再落本地库
  app.post('/api/radar/devices', async (req, res) => {
    const { deviceid, name, skipVerify } = req.body || {}
    const imei = String(deviceid || '').trim()
    if (!imei) return res.status(400).json({ code: 400, message: 'deviceid required' })

    let platform = null
    if (!skipVerify) {
      try {
        const info = await apiGetDevice(imei)
        const p = info && (info.data || info)
        if (!p || (!p.deviceImei && !p.deviceId)) {
          return res.status(404).json({ code: 404, message: '平台未查询到该设备，请确认二维码设备号' })
        }
        platform = p
      } catch (e) {
        return res.json({ code: 1, message: '平台校验失败：' + e.message, platformCode: e.platformCode || null })
      }
    }

    const d = touchDev(imei)
    if (name) d.name = name
    if (platform) {
      if (platform.deviceModelName) d.model = platform.deviceModelName
      if (platform.deviceId) d.platformDeviceId = platform.deviceId
      if (platform.state != null) {
        d.state = Number(platform.state)
        d.stateText = STATE_TEXT[Number(platform.state)] || String(platform.state)
      }
      if (platform.installAddress) d.site = platform.installAddress
      if (platform.companyName) d.companyName = platform.companyName
      d.platformSyncAt = Date.now()
    }
    if (d.markedUnbound) delete d.markedUnbound
    d.boundAt = Date.now()
    saveDB(rdb)
    emit('device_bind', { deviceid: imei, name: d.name, model: d.model || null, typeKey: 'radar' })
    res.json({ code: 0, data: Object.assign({}, d, { history: undefined }) })
  })

  // 解绑：与手环一致打标记而非真删，保住 latest / history 历史数据
  app.delete('/api/radar/devices/:imei', (req, res) => {
    const imei = String(req.params.imei || '').trim()
    if (!rdb.devices[imei]) return res.status(404).json({ code: 404, message: 'device not found' })
    rdb.devices[imei].markedUnbound = true
    saveDB(rdb)
    console.log('[radar] 解绑（标记）' + imei)
    emit('device_unbind', { deviceid: imei, typeKey: 'radar' })
    res.json({ code: 0, data: { deviceid: imei } })
  })

  /* ---------------- HTTP 回调接收端点 ---------------- */

  // URL 验证：平台在后台配置推送 URL 时会先发 GET 请求验证
  // 成功返回 nonce（text/plain），失败返回 "error"
  app.get('/api/radar/push', (req, res) => {
    const { nonce, signature, timestamp } = req.query
    if (!nonce) return res.type('text').send('error')
    if (!checkHttpSignature(signature, timestamp, nonce)) {
      console.log('[radar][http] URL 验证签名失败')
      return res.type('text').send('error')
    }
    console.log('[radar][http] URL 验证成功 nonce=' + nonce)
    res.type('text').send(String(nonce))
  })

  // 数据接收：平台推送设备数据到此 URL
  // 平台要求 200 响应，任何非 200 或超时都会被视为推送失败并限流
  app.post('/api/radar/push', (req, res) => {
    const body = req.body
    if (!body || typeof body !== 'object') {
      return res.send('ok') // 空报文也返回 200，避免被平台限流
    }
    HTTP_PUSH.count++
    HTTP_PUSH.lastMsgAt = Date.now()
    console.log('[radar][http] 收到推送 #' + HTTP_PUSH.count + ' keys=' + Object.keys(body).join(','))
    // 走与 MQTT 完全相同的处理链路：归一化 → 落库 → SSE 广播
    handlePush(body)
    // 平台只要求 200 响应即可，body 任意
    res.send('ok')
  })

  startMqtt(handlePush)
  console.log('[radar] 路由已挂载：/api/radar/status /ping /verify/:imei /devices /attributes /push')
}

module.exports = { mount, CFG, normalizePush, matchAttrKey, STATE_TEXT }
