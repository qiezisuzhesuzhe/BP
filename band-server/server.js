/**
 * 埃微 iwown 智能手环（血压款）—— 设备对云接收服务
 *
 * 协议参考 https://api8.iwown.com/iot_platform/device.html
 *
 * 手环通过 4G 网络把数据 HTTP POST 到本服务的 6 个固定路径：
 *   /pb/upload         健康数据（必选）opt 0x0A 实时步数 / 0x80 一分钟健康数据(心率/血压/步数)
 *   /alarm/upload      报警数据（必选）opt 0x12
 *   /call_log/upload   SOS/通话记录（必选）
 *   /deviceinfo/upload 设备信息（可选）
 *   /status/notify     设备在线状态（可选）
 *   /health/sleep      睡眠结果（可选）
 *
 * 数据格式（埃微自定义二进制，小端）：
 *   [deviceid:15B ASCII] 后接若干数据块，每块：
 *   prefix 0x4454(2B) | length uint16 | crc uint16 | opt uint16 | payload(protobuf)
 *
 * 给 H5 前端的 REST API：
 *   GET  /api/devices                  设备列表（含最新状态）
 *   GET  /api/devices/:deviceid        单设备最新状态
 *   POST /api/devices                  绑定设备 { deviceid, name, model }
 *   POST /api/simulate                 模拟手环上报（构造真实 0x0A/0x80 二进制包）
 */
const path = require('path')
const fs = require('fs')
const { execFile } = require('child_process')
const express = require('express')
const cors = require('cors')
const protobuf = require('protobufjs')

const PORT = process.env.PORT || 8091
const DATA_DIR = path.join(__dirname, 'data')
const DB_FILE = path.join(DATA_DIR, 'devices.json')
const PROTO_DIR = path.join(__dirname, 'proto')
const TUNNEL_LOG = process.env.TUNNEL_LOG || '/tmp/band-tunnel.log'
const TUNNEL_URL_FILE = path.join(__dirname, 'tunnel-url.txt')

// 当前公网上报地址：优先取环境变量，其次解析隧道日志中最后一次分配的地址
//（隧道重启后公网域名会变化，取最新一条即当前可用地址；支持 localhost.run / serveo）
function currentTunnelUrl() {
  if (process.env.TUNNEL_URL) return process.env.TUNNEL_URL
  try {
    const log = fs.readFileSync(TUNNEL_LOG, 'utf8')
    const urls = log.match(/https:\/\/[\w.-]+\.(?:lhr\.life|serveousercontent\.com)/g)
    if (urls && urls.length) return urls[urls.length - 1]
  } catch (e) {}
  try {
    const u = fs.readFileSync(TUNNEL_URL_FILE, 'utf8').trim()
    if (u) return u
  } catch (e) {}
  return ''
}

/* ---------------- 存储 ---------------- */
function loadDB() {
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'))
  } catch (e) {
    return { devices: {} }
  }
}
function saveDB(db) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2))
}
let db = loadDB()

function touch(deviceid) {
  if (!db.devices[deviceid]) db.devices[deviceid] = { deviceid, name: '智能手环', model: '', firstSeen: Date.now() }
  const d = db.devices[deviceid]
  d.lastSeen = Date.now()
  return d
}

/* ---------------- protobuf 加载 ---------------- */
let OM0Report, HisNotification, HisDataHealth, HisHealthPedo, HisHealthHr, HisHealthBp, HisDataECG, HisDataSpo2, RtHealth, RtBattery

async function loadProtos() {
  const root = new protobuf.Root()
  await root.load([path.join(PROTO_DIR, 'his_data.proto'), path.join(PROTO_DIR, 'om0_command.proto')], { keepCase: true })
  OM0Report = root.lookupType('OM0Report')
  HisNotification = root.lookupType('HisNotification')
  HisDataHealth = root.lookupType('HisDataHealth')
  HisHealthPedo = root.lookupType('HisHealthPedo')
  HisHealthHr = root.lookupType('HisHealthHr')
  HisHealthBp = root.lookupType('HisHealthBp')
  HisDataECG = root.lookupType('HisDataECG')
  HisDataSpo2 = root.lookupType('HisDataSpo2')
  RtHealth = root.lookupType('RtHealth')
  RtBattery = root.lookupType('RtBattery')
}

/* ---------------- 上传数据解析 ---------------- */
// 解析一帧数据块：payload 是 protobuf 编码
function parsePayload(opt, payload) {
  if (opt === 0x0a) {
    const msg = OM0Report.decode(payload)
    const o = {}
    if (msg.health) {
      o.steps = msg.health.steps >>> 0
      o.distance = Math.round(msg.health.distance / 10)
      o.calorie = Math.round(msg.health.calorie / 10)
    }
    if (msg.battery) {
      o.battery = msg.battery.level >>> 0
      o.charging = !!msg.battery.charging
    }
    if (msg.rssi !== undefined) o.rssi = msg.rssi | 0
    if (msg.date_time && msg.date_time.date_time) o.ts = msg.date_time.date_time.seconds >>> 0
    return { type: 'realtime', data: o }
  }
  if (opt === 0x80) {
    const notif = HisNotification.decode(payload)
    // 只有 his_data 分支才有数据；index_table 为历史索引表（可忽略）
    if (!notif.his_data) return null
    const his = notif.his_data
    // 健康数据：心率/血压/步数 + 睡眠/血氧(部分机型在 health 里)
    if (his.health) {
      const h = his.health
      const o = { seq: his.seq >>> 0 }
      if (h.time_stamp && h.time_stamp.date_time) o.ts = h.time_stamp.date_time.seconds >>> 0
      if (h.pedo_data) {
        o.steps = h.pedo_data.step >>> 0
        o.distance = Math.round(h.pedo_data.distance / 10)
        o.calorie = Math.round(h.pedo_data.calorie / 10)
      }
      if (h.hr_data) {
        o.hr = h.hr_data.avg_bpm >>> 0
        o.hrMax = h.hr_data.max_bpm >>> 0
        o.hrMin = h.hr_data.min_bpm >>> 0
      }
      if (h.bp_data) {
        o.sbp = h.bp_data.sbp >>> 0
        o.dbp = h.bp_data.dbp >>> 0
      }
      // 睡眠：sleep_data 为每分钟睡眠状态（0 清醒 / 1 浅睡 / 2 深睡）
      if (h.sleep_data && h.sleep_data.sleep_data && h.sleep_data.sleep_data.length) {
        const arr = Array.from(h.sleep_data.sleep_data)
        let deep = 0
        let light = 0
        let wake = 0
        arr.forEach((v) => {
          if (v === 2) deep++
          else if (v === 1) light++
          else wake++
        })
        o.sleep = { deep, light, wake, total: arr.length }
      }
      // 血氧（部分机型在 HisDataHealth.bxoy_data 里）
      if (h.bxoy_data && h.bxoy_data.agv_oxy != null) {
        o.spo2 = h.bxoy_data.agv_oxy >>> 0
        o.spo2Max = h.bxoy_data.max_oxy >>> 0
        o.spo2Min = h.bxoy_data.min_oxy >>> 0
      }
      // 体温/皮肤温度：HisHealthTemp.type=1 可用（0=算法计算中，暂不可用）
      // evi_body=体温，esti_arm 高位两字节=体温、低位两字节=皮肤温度；温度单位均为 0.1℃（如 375=37.5℃）
      if (h.temperature_data) {
        const t = h.temperature_data
        o.tempOk = t.type === 1
        if (t.evi_body != null) o.bodyTemp = (t.evi_body >>> 0) / 10
        if (t.esti_arm != null) o.skinTemp = ((t.esti_arm >>> 0) & 0xffff) / 10
      }
      return { type: 'health', data: o }
    }
    // 心电图：raw_data 为波形采样点（sfixed32），降采样到 ≤150 点供前端绘制
    if (his.ecg) {
      const samples = Array.from(his.ecg.raw_data || [])
      const step = Math.max(1, Math.floor(samples.length / 150))
      const down = []
      for (let i = 0; i < samples.length; i += step) down.push(samples[i])
      const o = { ecgN: samples.length, ecgSamples: down }
      if (his.ecg.time_stamp && his.ecg.time_stamp.date_time) o.ecgTs = his.ecg.time_stamp.date_time.seconds >>> 0
      return { type: 'ecg', data: o }
    }
    // 血氧：spo2_data 为一次测量的血氧值序列
    if (his.spo2) {
      const vals = Array.from(his.spo2.spo2_data || [])
      const o = { spo2N: vals.length }
      if (vals.length) {
        o.spo2 = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
        o.spo2Max = Math.max.apply(null, vals)
        o.spo2Min = Math.min.apply(null, vals)
      }
      if (his.spo2.time_stamp && his.spo2.time_stamp.date_time) o.ts = his.spo2.time_stamp.date_time.seconds >>> 0
      return { type: 'spo2', data: o }
    }
    return null
  }
  return null
}

// 解析完整上传请求体：deviceid(15B) + 数据块链
function parseUploadBody(raw) {
  if (!raw || raw.length < 23) return { error: 'data too short' }
  const deviceid = raw.slice(0, 15).toString('ascii').replace(/\0+$/, '').trim()
  let pos = 15
  const packets = []
  while (pos + 8 <= raw.length) {
    if (raw[pos] !== 0x44 || raw[pos + 1] !== 0x54) return { error: 'invalid header at ' + pos }
    const length = raw.readUInt16LE(pos + 2)
    const crc = raw.readUInt16LE(pos + 4)
    const opt = raw.readUInt16LE(pos + 6)
    if (pos + 8 + length > raw.length) return { error: 'truncated payload' }
    const payload = raw.slice(pos + 8, pos + 8 + length)
    packets.push({ opt, crc, length })
    const parsed = parsePayload(opt, payload)
    if (parsed) parsed.deviceid = deviceid
    packets[packets.length - 1].parsed = parsed
    pos += 8 + length
    if (pos === raw.length) break
  }
  return { deviceid, packets }
}

// 合并一次上报中的最新状态（realtime 与 health 互补）
function mergeSamples(deviceid, packets) {
  const dev = touch(deviceid)
  const snap = {}
  for (const p of packets) {
    if (!p.parsed) continue
    const { type, data } = p.parsed
    if (type === 'realtime') {
      if (data.steps !== undefined) snap.steps = data.steps
      if (data.distance !== undefined) snap.distance = data.distance
      if (data.calorie !== undefined) snap.calorie = data.calorie
      if (data.battery !== undefined) snap.battery = data.battery
      if (data.charging !== undefined) snap.charging = data.charging
      if (data.ts) snap.ts = data.ts
    } else if (type === 'health') {
      if (data.hr !== undefined) snap.hr = data.hr
      if (data.sbp !== undefined) snap.sbp = data.sbp
      if (data.dbp !== undefined) snap.dbp = data.dbp
      if (data.steps !== undefined) snap.steps = data.steps
      if (data.sleep !== undefined) snap.sleep = data.sleep
      if (data.spo2 !== undefined) snap.spo2 = data.spo2
      if (data.spo2Max !== undefined) snap.spo2Max = data.spo2Max
      if (data.spo2Min !== undefined) snap.spo2Min = data.spo2Min
      if (data.bodyTemp !== undefined) snap.bodyTemp = data.bodyTemp
      if (data.skinTemp !== undefined) snap.skinTemp = data.skinTemp
      if (data.tempOk !== undefined) snap.tempOk = data.tempOk
      if (data.ts) snap.ts = data.ts
    } else if (type === 'ecg') {
      if (data.ecgN !== undefined) snap.ecgN = data.ecgN
      if (data.ecgSamples) snap.ecgSamples = data.ecgSamples
      if (data.ecgTs) snap.ecgTs = data.ecgTs
    } else if (type === 'spo2') {
      if (data.spo2 !== undefined) snap.spo2 = data.spo2
      if (data.spo2Max !== undefined) snap.spo2Max = data.spo2Max
      if (data.spo2Min !== undefined) snap.spo2Min = data.spo2Min
      if (data.spo2N !== undefined) snap.spo2N = data.spo2N
      if (data.ts) snap.ts = data.ts
    }
  }
  if (Object.keys(snap).length) {
    dev.latest = Object.assign({}, dev.latest || {}, snap)
    dev.latest.updatedAt = Date.now()
    if (!dev.history) dev.history = []
    dev.history.push(Object.assign({ at: Date.now() }, snap))
    if (dev.history.length > 500) dev.history = dev.history.slice(-500)
    saveDB(db)
  }
  return dev
}

/* ---------------- HTTP 服务 ---------------- */
const app = express()
app.use(cors())
// 设备上传 body 是二进制（Content-Type 实际为 x-www-form-urlencoded，body 是 octet-stream）
app.use('/pb/upload', express.raw({ type: '*/*', limit: '5mb' }))
app.use('/alarm/upload', express.raw({ type: '*/*', limit: '5mb' }))
app.use('/call_log/upload', express.raw({ type: '*/*', limit: '5mb' }))
app.use('/deviceinfo/upload', express.raw({ type: '*/*', limit: '5mb' }))
app.use('/status/notify', express.raw({ type: '*/*', limit: '5mb' }))
app.use(express.json({ limit: '1mb' }))

// 设备健康数据上报（必选）—— 成功返回单字节 0x00
app.post('/pb/upload', (req, res) => {
  const r = parseUploadBody(req.body)
  if (r.error) return res.status(200).send(Buffer.from([0x02]))
  mergeSamples(r.deviceid, r.packets)
  console.log('[pb/upload]', r.deviceid, r.packets.map(p => 'opt=0x' + p.opt.toString(16)).join(','))
  res.status(200).send(Buffer.from([0x00]))
})

// 报警上报（必选）
app.post('/alarm/upload', (req, res) => {
  const r = parseUploadBody(req.body)
  if (r.error) return res.status(200).send(Buffer.from([0x02]))
  const dev = touch(r.deviceid)
  const alarms = r.packets.filter(p => p.parsed)
  if (alarms.length) {
    dev.lastAlarm = Date.now()
    saveDB(db)
  }
  console.log('[alarm/upload]', r.deviceid)
  res.status(200).send(Buffer.from([0x00]))
})

// SOS / 通话记录（必选，JSON）
app.post('/call_log/upload', (req, res) => {
  try {
    const info = JSON.parse(req.body.toString() || '{}')
    const deviceid = info.deviceid || ''
    if (deviceid) {
      const dev = touch(deviceid)
      dev.lastCallLog = { at: Date.now(), sos: info.sos || [], normal: info.normal_call_logs || [] }
      saveDB(db)
      console.log('[call_log/upload]', deviceid)
    }
    res.json({ ReturnCode: 0 })
  } catch (e) {
    res.json({ ReturnCode: 10002 })
  }
})

// 设备信息（可选，JSON）—— 包含 model 型号，可用来补全设备名称
app.post('/deviceinfo/upload', (req, res) => {
  try {
    const info = JSON.parse(req.body.toString() || '{}')
    const deviceid = info.deviceid || ''
    if (deviceid) {
      const dev = touch(deviceid)
      if (info.model) dev.model = info.model
      if (info.version) dev.version = info.version
      if (info.net_type) dev.netType = info.net_type
      if (info.wearing_status) dev.wearing = info.wearing_status
      dev.lastDeviceInfo = Date.now()
      saveDB(db)
      console.log('[deviceinfo/upload]', deviceid, info.model)
    }
    res.json({ ReturnCode: 0 })
  } catch (e) {
    res.json({ ReturnCode: 10002 })
  }
})

// 设备在线状态（可选，JSON）
app.post('/status/notify', (req, res) => {
  try {
    const info = JSON.parse(req.body.toString() || '{}')
    const deviceid = info.DeviceId || ''
    if (deviceid) {
      const dev = touch(deviceid)
      dev.online = info.Status === 'online'
      dev.lastNotify = Date.now()
      saveDB(db)
      console.log('[status/notify]', deviceid, info.Status)
    }
    res.json({ ReturnCode: 0 })
  } catch (e) {
    res.json({ ReturnCode: 10002 })
  }
})

// 睡眠结果（可选，GET）
app.get('/health/sleep', (req, res) => {
  const deviceid = req.query.deviceid || ''
  const sleepDate = req.query.sleep_date || ''
  res.json({
    ReturnCode: 0,
    Data: {
      deviceid,
      sleep_date: sleepDate,
      start_time: sleepDate + ' 23:15:00',
      end_time: sleepDate + ' 07:00:00',
      deep_sleep: 85, light_sleep: 300, weak_sleep: 30, eyemove_sleep: 50,
      score: 80, osahs_risk: 0, spo2_score: 0, sleep_hr: 60
    }
  })
})

/* ---------------- REST API（给 H5 前端） ---------------- */
// API 响应禁止缓存：H5 每 1 分钟轮询拉取最新数据，若被浏览器内存缓存命中
// 将一直返回旧数据（整页刷新才更新），此处强制 no-store 保证每次都发新请求
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

app.get('/api/devices', (req, res) => {
  const list = Object.keys(db.devices).map(id => db.devices[id])
  res.json({ code: 0, data: list })
})

app.get('/api/devices/:deviceid', (req, res) => {
  const dev = db.devices[req.params.deviceid]
  if (!dev) return res.status(404).json({ code: 404, message: 'device not found' })
  res.json({ code: 0, data: dev })
})

app.post('/api/devices', (req, res) => {
  const { deviceid, name, model } = req.body || {}
  if (!deviceid) return res.status(400).json({ code: 400, message: 'deviceid required' })
  const dev = touch(deviceid)
  if (name) dev.name = name
  if (model) dev.model = model
  saveDB(db)
  res.json({ code: 0, data: dev })
})

// 当前公网上报地址（供 H5 显示；隧道重启导致地址变化时自动取最新一条）
app.get('/api/address', (req, res) => {
  const url = currentTunnelUrl()
  res.json({
    code: 0,
    data: {
      public: url || null,
      local: 'http://localhost:' + PORT,
      checkedAt: Date.now()
    }
  })
})

/* ---------------- 给手环发送消息（entservice 指令下发） ---------------- */
// 文档：https://api8.iwown.com/iot_platform/entservice.html 「发送设备消息」
// POST { device_id, title(≤15字节), description(≤240字节) }，经 curl 走沙箱代理调用平台
const ENTSERVICE_BASE = process.env.ENTSERVICE_BASE || 'https://search.iwown.com'

function curlPostJson(url, obj) {
  return new Promise((resolve, reject) => {
    execFile(
      'curl',
      ['-s', '--max-time', '25', '-X', 'POST', url, '-H', 'Content-Type: application/json', '-d', JSON.stringify(obj)],
      { maxBuffer: 2 * 1024 * 1024 },
      (err, stdout) => {
        if (err) return reject(err)
        try {
          resolve(JSON.parse(stdout))
        } catch (e) {
          reject(new Error('指令服务响应异常: ' + String(stdout).slice(0, 120)))
        }
      }
    )
  })
}

app.post('/api/band/message', async (req, res) => {
  const { device_id, title, description } = req.body || {}
  if (!device_id) return res.status(400).json({ code: 400, message: 'device_id 不能为空' })
  if (title == null || !String(description || '').trim()) {
    return res.status(400).json({ code: 400, message: '标题与消息内容不能为空' })
  }
  if (Buffer.byteLength(String(title), 'utf8') > 15) {
    return res.status(400).json({ code: 400, message: '标题不能超过 15 字节' })
  }
  if (Buffer.byteLength(String(description), 'utf8') > 240) {
    return res.status(400).json({ code: 400, message: '内容不能超过 240 字节' })
  }
  // 设备未激活时需附带 device_model 参数（取本服务已收到的设备型号）
  let url = ENTSERVICE_BASE + '/entservice/cmd/message'
  const dev = db.devices[device_id]
  if (dev && dev.model) url += '?device_model=' + encodeURIComponent(dev.model)
  try {
    const r = await curlPostJson(url, {
      device_id,
      title: String(title),
      description: String(description)
    })
    if (r.ReturnCode === 0) {
      console.log('[band/message] 下发成功', device_id)
      res.json({ code: 0, data: r.Data || null })
    } else {
      res.json({
        code: r.ReturnCode || -1,
        message: '下发失败，平台返回 ' + (r.ReturnCode || '') + (r.msg ? '：' + r.msg : '')
      })
    }
  } catch (e) {
    res.status(502).json({ code: 502, message: '指令服务不可达: ' + e.message })
  }
})

/* ---------------- 模拟器：构造真实 0x0A / 0x80 二进制包上报 ---------------- */
function buildFrame(opt, msgObj, encodeFn) {
  const payload = encodeFn(msgObj)
  const buf = Buffer.alloc(8 + payload.length)
  buf.writeUInt8(0x44, 0)
  buf.writeUInt8(0x54, 1)
  buf.writeUInt16LE(payload.length, 2)
  buf.writeUInt16LE(0, 4) // crc 占位（服务端不校验）
  buf.writeUInt16LE(opt, 6)
  Buffer.from(payload).copy(buf, 8)
  return buf
}

// 模拟器：随机生成一次上报（步数实时包 + 心率/血压健康包），走完整解析链路
app.post('/api/simulate', (req, res) => {
  const deviceid = (req.body && req.body.deviceid) || '860132060872223'
  const now = Math.floor(Date.now() / 1000)
  const dev = db.devices[deviceid] || {}
  const latest = dev.latest || {}
  const steps = (latest.steps || 0) + Math.floor(Math.random() * 120 + 30)

  // 0x0A OM0Report：实时步数/距离/卡路里/电量
  const om0 = OM0Report.fromObject({
    date_time: { date_time: { seconds: now }, time_zone: 8 },
    health: { steps, distance: steps * 70, calorie: Math.round(steps * 0.04) },
    battery: { level: 6 + Math.floor(Math.random() * 3), charging: false },
    rssi: -60 - Math.floor(Math.random() * 20)
  })
  const frame0A = buildFrame(0x0a, om0, om => OM0Report.encode(om).finish())

  // 0x80 HisNotification → HisData.health：一分钟心率/血压/步数
  const hr = 65 + Math.floor(Math.random() * 20)
  const sbp = 118 + Math.floor(Math.random() * 18)
  const dbp = 76 + Math.floor(Math.random() * 12)
  const his = HisNotification.fromObject({
    type: 0, // HEALTH_DATA
    his_data: {
      seq: Math.floor(Math.random() * 0xffffff),
      health: {
        time_stamp: { date_time: { seconds: now }, time_zone: 8 },
        pedo_data: { type: 0, state: 0, calorie: Math.round(steps * 0.04), step: steps, distance: steps * 70 },
        hr_data: { min_bpm: hr - 8, max_bpm: hr + 6, avg_bpm: hr },
        bp_data: { sbp, dbp }
      }
    }
  })
  const frame80 = buildFrame(0x80, his, m => HisNotification.encode(m).finish())

  const body = Buffer.concat([Buffer.from(deviceid.padEnd(15, ' ').slice(0, 15)), frame0A, frame80])
  const r = parseUploadBody(body)
  const dev2 = mergeSamples(r.deviceid, r.packets)
  res.json({ code: 0, data: dev2.latest })
})

app.get('/api/health', (req, res) => res.json({ code: 0, msg: 'band-server running', devices: Object.keys(db.devices).length }))

/* ---------------- 托管 H5（与 API 同源） ---------------- */
// H5 构建产物与后端接口同端口托管：前端用相对路径即可请求到本服务，
// 无论是本地预览、内网穿透公网地址还是手机访问都能正常工作
const H5_DIR = process.env.H5_DIR || '/workspace/h5build/dist/dev/h5'
app.use(express.static(H5_DIR))

/* ---------------- 启动 ---------------- */
async function main() {
  await loadProtos()
  app.listen(PORT, '0.0.0.0', () => {
    console.log('band-server listening on http://0.0.0.0:' + PORT)
    console.log('  H5 页面:  http://localhost:' + PORT + '/  （同源托管）')
    console.log('  设备上报路径(必选): /pb/upload  /alarm/upload  /call_log/upload')
    console.log('  可选路径: /deviceinfo/upload /status/notify /health/sleep')
    console.log('  H5 查询: /api/devices  /api/devices/:deviceid  /api/address  /api/simulate')
  })
}

main().catch(e => { console.error('启动失败', e); process.exit(1) })
