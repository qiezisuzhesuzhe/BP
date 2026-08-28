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

// 当前公网上报地址：优先取环境变量，其次取 tunnel-url.txt（守护脚本维护的固定子域名），
// 最后才回退解析隧道日志。
// ⚠️ 顺序很关键：隧道重连过程中若 key 未生效会短暂拿到随机子域名并写进日志，
//   此时若优先读日志，/api/address 会把随机地址返给前端，用户照着改手环配置就白改了。
//   tunnel-url.txt 由 tunnel.sh 每次断开后写回固定域名，因此更可信。
function currentTunnelUrl() {
  if (process.env.TUNNEL_URL) return process.env.TUNNEL_URL
  try {
    const u = fs.readFileSync(TUNNEL_URL_FILE, 'utf8').trim()
    if (u) return u
  } catch (e) {}
  try {
    const log = fs.readFileSync(TUNNEL_LOG, 'utf8')
    const urls = log.match(/https:\/\/[\w.-]+\.(?:lhr\.life|serveousercontent\.com)/g)
    if (urls && urls.length) return urls[urls.length - 1]
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
      // evi_body=体温（单位 0.01℃，如 3343=33.43℃）；esti_arm 高16位=体温冗余、低16位=皮肤温度，低16位为 0 表示无皮肤温度数据
      // 注意：health 包的体温经常低于真实体温（可能是皮肤温/原始值），优先级低于独立 temp 包。
      if (h.temperature_data) {
        const t = h.temperature_data
        const ok = t.type === 1
        o.tempOk = ok
        if (ok && t.evi_body != null && (t.evi_body >>> 0)) {
          const bt = (t.evi_body >>> 0) / 100
          if (bt >= 25 && bt <= 45) o.bodyTemp = bt   // 范围校验：25-45°C 才接受
        }
        const skin = t.esti_arm != null ? ((t.esti_arm >>> 0) & 0xffff) : 0
        if (skin) {
          const st = skin / 100
          if (st >= 20 && st <= 45) o.skinTemp = st   // 范围校验：皮肤温 20-45°C
        }
      }
      // 压力值：HisHealthHrv.fatigue=疲劳度，压力值 = 100 - fatigue
      if (h.hrv_data && h.hrv_data.fatigue != null) {
        o.stress = Math.max(0, Math.min(100, Math.round(100 - h.hrv_data.fatigue)))
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
    // 体温（HisDataType=TEMPERATURE_DATA=8，HisDataTemperature → SensorTemp.evi_body/esti_arm）
    // 注意：独立体温包（his.temp）的温度比 health 包内的 temperature_data 更准确。
    if (his.temp) {
      const s = his.temp.temperature
      const o = {}
      if (his.temp.time_stamp && his.temp.time_stamp.date_time) o.ts = his.temp.time_stamp.date_time.seconds >>> 0
      if (s) {
        o.tempOk = true
        if (s.evi_body != null && (s.evi_body >>> 0)) {
          const bt = (s.evi_body >>> 0) / 100
          if (bt >= 25 && bt <= 45) o.bodyTemp = bt   // 范围校验：25-45°C 才接受
        }
        const skin = s.esti_arm != null ? ((s.esti_arm >>> 0) & 0xffff) : 0
        if (skin) {
          const st = skin / 100
          if (st >= 20 && st <= 45) o.skinTemp = st   // 范围校验：皮肤温 20-45°C
        }
      }
      return { type: 'temp', data: o }
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
//
// 关键设计：为每个"独立可测量指标"记录独立时间戳，避免用户先上报过一次 bp+spo2
// 再单独上报 spo2 时，前端把"新 spo2 与旧 bp"混合成一次测量展示造成"数据不是我"的困惑。
//   - bpTs / spo2Ts / tempTs / ecgTs / stressTs / sleepTs / stepsTs：各指标独立时间戳（秒）
//   - 前端可依据这些时间戳判断数据是否属于同一次测量，决定是否清空另一个指标
function mergeSamples(deviceid, packets) {
  const dev = touch(deviceid)
  const snap = {}
  const nowSec = Math.floor(Date.now() / 1000)

  // 把独立体温包（type==='temp'）推迟到最后处理：
  //   因为独立体温包的体温是校准后的真实值，优先级最高。
  //   如果先处理 temp 再处理 health，health 包的低估值（皮肤温/算法未收敛值，
  //   如 33°C 左右）会把正常体温（36.5°C）覆盖，导致用户看到"体温经常很低"。
  const ordered = []
  const tempPackets = []
  for (const p of packets) {
    if (p && p.parsed && p.parsed.type === 'temp') tempPackets.push(p)
    else ordered.push(p)
  }
  for (const p of tempPackets) ordered.push(p)

  // 记录一次上报中是否出现过独立体温包：
  //   如果出现过，health 包的体温字段就不允许写入，避免 health 的低值覆盖正常值。
  //   （temp 包最后处理的基础上再加一道防御）
  const hasTempPacketInThisBatch = packets.some(p => p && p.parsed && p.parsed.type === 'temp')

  for (const p of ordered) {
    if (!p.parsed) continue
    const { type, data } = p.parsed
    // 测量时间：优先用手环上报的 ts（真实测量时刻），无 ts 时回退到服务器收到时间
    // 注意：部分手环把"本地时间(北京)当成 UTC epoch"上报，导致 ts 比真实 UTC 快 8 小时（=未来时间）。
    //       修正：若 ts 在未来（> 服务器当前时间），说明是本地时区 epoch，减去 8 小时还原为 UTC。
    const _nowSec = Math.floor(Date.now() / 1000)
    let pktTs = (data.ts >>> 0) || _nowSec
    if (pktTs > _nowSec + 60) pktTs -= 8 * 3600  // 未来时间 → 本地时区 epoch 修正
    if (pktTs > _nowSec) pktTs = _nowSec           // 兜底：不超过当前时间
    if (type === 'realtime') {
      // steps 是当日累计步数，只会单调递增；若新值 < 旧值，说明手环重置或上报的是增量，取较大值
      if (data.steps !== undefined) snap.steps = Math.max(snap.steps || 0, data.steps)
      if (data.distance !== undefined) snap.distance = Math.max(snap.distance || 0, data.distance)
      if (data.calorie !== undefined) snap.calorie = Math.max(snap.calorie || 0, data.calorie)
      if (data.battery !== undefined) snap.battery = data.battery
      if (data.charging !== undefined) snap.charging = data.charging
      snap.ts = pktTs
      snap.stepsTs = pktTs
    } else if (type === 'health') {
      if (data.hr !== undefined) snap.hr = data.hr
      if (data.sbp !== undefined) snap.sbp = data.sbp
      if (data.dbp !== undefined) snap.dbp = data.dbp
      // 注意：health 包的 pedo_data.step 经常是重置值/单次增量（如 79、30），
      //       不是当日累计步数。steps 只由 realtime(OM0Report) 更新，health 包不动 steps。
      if (data.sleep !== undefined) snap.sleep = data.sleep
      if (data.spo2 !== undefined) snap.spo2 = data.spo2
      if (data.spo2Max !== undefined) snap.spo2Max = data.spo2Max
      if (data.spo2Min !== undefined) snap.spo2Min = data.spo2Min
      // ⚠️ health 包内的 temperature_data 彻底禁写：
      //   用户明确要求"体温和皮肤温度只要真实测量的数据"。
      //   health.temperature_data 是每分钟健康包附带的算法中间值/皮肤温/未收敛值（常见32-34°C），
      //   不是用户主动触发的体温测量结果。真实体温数据仅来自独立 temp 包
      //   （HisDataType=TEMPERATURE_DATA=8，下方 type==='temp' 分支）。
      if (data.stress !== undefined) snap.stress = data.stress
      snap.ts = pktTs
      // 为每项独立可测量指标打独立时间戳；hr 跟随 bp 一次测量
      if (data.hr !== undefined) snap.hrTs = pktTs
      if (data.sbp !== undefined || data.dbp !== undefined) {
        snap.bpTs = pktTs
      }
      if (data.spo2 !== undefined) snap.spo2Ts = pktTs
      // 体温时间戳（bodyTemp/skinTemp/tempTs）完全不由 health 包写 → 下方 type==='temp' 独立分支
      if (data.stress !== undefined) snap.stressTs = pktTs
      if (data.sleep !== undefined) snap.sleepTs = pktTs
      if (data.steps !== undefined) snap.stepsTs = pktTs
    } else if (type === 'ecg') {
      if (data.ecgN !== undefined) snap.ecgN = data.ecgN
      if (data.ecgSamples) snap.ecgSamples = data.ecgSamples
      snap.ecgTs = pktTs
      snap.ts = pktTs
    } else if (type === 'spo2') {
      if (data.spo2 !== undefined) snap.spo2 = data.spo2
      if (data.spo2Max !== undefined) snap.spo2Max = data.spo2Max
      if (data.spo2Min !== undefined) snap.spo2Min = data.spo2Min
      if (data.spo2N !== undefined) snap.spo2N = data.spo2N
      snap.ts = pktTs
      snap.spo2Ts = pktTs
    } else if (type === 'temp') {
      // 独立体温包：HisDataType=TEMPERATURE_DATA=8，真实体温测量结果，优先级最高
      if (data.bodyTemp !== undefined) snap.bodyTemp = data.bodyTemp
      if (data.skinTemp !== undefined) snap.skinTemp = data.skinTemp
      if (data.tempOk !== undefined) snap.tempOk = data.tempOk
      if (data.bodyTemp !== undefined || data.skinTemp !== undefined) snap.tempTs = pktTs
      snap.ts = pktTs
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
app.use(express.json({ limit: '2mb' }))

// 设备健康数据上报（必选）—— 成功返回单字节 0x00
app.post('/pb/upload', (req, res) => {
  const r = parseUploadBody(req.body)
  if (r.error) return res.status(200).send(Buffer.from([0x02]))
  // 诊断：把每个 packet 解析出的 type 和 核心字段 落到 /tmp/pb_diag.log，排查"用户测了血压但页面不显示"
  try {
    const fs = require('fs')
    const diags = []
    for (const p of r.packets) {
      if (!p || !p.parsed) continue
      const { type, data } = p.parsed
      const info = { opt: '0x'+p.opt.toString(16), type }
      if (data.sbp != null || data.dbp != null) info.bp = [data.sbp, data.dbp]
      if (data.hr != null) info.hr = data.hr
      if (data.spo2 != null) info.spo2 = data.spo2
      if (data.bodyTemp != null) info.bodyTemp = data.bodyTemp
      if (data.steps != null) info.steps = data.steps
      if (data.ecgN != null) info.ecgN = data.ecgN
      if (data.ts != null) info.pkt_ts = data.ts
      diags.push(info)
    }
    fs.appendFileSync('/tmp/pb_diag.log', JSON.stringify({ t: Date.now(), deviceid: r.deviceid, pkts: diags })+'\n')
  } catch(e) {}
  const dev = mergeSamples(r.deviceid, r.packets)
  const opts = r.packets.map(p => 'opt=0x' + p.opt.toString(16)).join(',')
  console.log('[pb/upload]', r.deviceid, opts)
  res.status(200).send(Buffer.from([0x00]))
  // SSE 广播：带最新快照 & 每种 opt 作 detail 标签
  const has0A = r.packets.some(p => p.opt === 0x0a)
  const has80 = r.packets.some(p => p.opt === 0x80)
  broadcast('pb', {
    deviceid: r.deviceid,
    snapshot: Object.assign({}, dev.latest || {}),
    kind_detail: (has0A ? 'realtime ' : '') + (has80 ? 'health' : '').trim() || opts
  })
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
  broadcast('alarm', {
    deviceid: r.deviceid,
    snapshot: Object.assign({}, dev.latest || {}),
    alarm_count: alarms.length,
    parsed: alarms.map(a => a.parsed && a.parsed.data ? a.parsed.data : null).filter(Boolean)
  })
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
      const sosCount = (info.sos || []).length
      broadcast(sosCount ? 'sos' : 'calllog', {
        deviceid,
        snapshot: Object.assign({}, dev.latest || {}),
        sos: info.sos || [],
        normal: info.normal_call_logs || []
      })
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
      broadcast('deviceinfo', {
        deviceid,
        snapshot: Object.assign({}, dev.latest || {}),
        model: info.model || null,
        wearing: info.wearing_status == null ? null : !!info.wearing_status
      })
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
      broadcast('status', {
        deviceid,
        snapshot: Object.assign({}, dev.latest || {}),
        online: !!dev.online
      })
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

/* ---------------- SSE 实时推送（EventSource） ---------------- */
// 手环一有主动上报事件立刻广播给所有前端订阅者；前端用 EventSource 订阅 /api/events/stream
// 支持：?deviceid=xxx 仅单设备、?kinds=pb,alarm,sos 过滤类型、?since=ts 断线重连后重放最近 N 条
const SSE_CLIENTS = new Map() // id -> { res, filter }
const SSE_RING = []          // 事件环形缓冲，最近 100 条供 since 重放
const SSE_RING_MAX = 100
let _sseSeq = 0

function sseSendOne(res, event) {
  const id = event.id
  const line =
    'id: ' + id + '\n' +
    'event: ' + (event.kind || 'message') + '\n' +
    'data: ' + JSON.stringify(event) + '\n\n'
  try { res.write(line) } catch (e) {}
}

function broadcast(kind, payload) {
  const evt = {
    id: String(++_sseSeq),
    kind,
    ts: Date.now(),
    payload: payload || {}
  }
  SSE_RING.push(evt)
  if (SSE_RING.length > SSE_RING_MAX) SSE_RING.splice(0, SSE_RING.length - SSE_RING_MAX)
  for (const [, client] of SSE_CLIENTS) {
    const f = client.filter || {}
    if (f.deviceid && evt.payload.deviceid && f.deviceid !== evt.payload.deviceid) continue
    if (f.kinds && f.kinds.length && !f.kinds.includes(evt.kind)) continue
    sseSendOne(client.res, evt)
  }
  // 调试日志（只打 pb/alarm/sos/status 高频之外也保留，方便排查）
  const p = evt.payload
  const extra = p.deviceid
    ? (' ' + p.deviceid + (p.snapshot ? ' items=' + Object.keys(p.snapshot).length : '') + (p.kind_detail ? ' ' + p.kind_detail : ''))
    : ''
  console.log('[sse][' + kind + '] id=' + evt.id + extra)
}

app.get('/api/events/stream', (req, res) => {
  const deviceid = String(req.query.deviceid || '').trim()
  const kindsRaw = String(req.query.kinds || '').trim()
  const kinds = kindsRaw ? kindsRaw.split(',').map(s => s.trim()).filter(Boolean) : []
  const since = Number(req.query.since) || 0
  const resIn = req.raw && req.raw.res ? req.raw.res : res
  const resObj = resIn || res
  resObj.socket && resObj.socket.setTimeout && resObj.socket.setTimeout(0)
  resObj.setTimeout && resObj.setTimeout(0)
  res.status(200)
  res.set({
    'Content-Type': 'text/event-stream; charset=utf-8',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no'
  })
  res.flushHeaders && res.flushHeaders()
  const ok = res.write
  if (ok) {
    res.write(': hello sse\n')
    res.write('retry: 3000\n\n')
  }
  const id = 's_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8)
  SSE_CLIENTS.set(id, { res, filter: { deviceid: deviceid || null, kinds } })

  // 心跳保活：每 5s 发一行注释，防止浏览器/中间件因长时间无数据超时断开 SSE
  // 注：沙盒预览代理层空闲超时约 18s，故取 5s 留足余量，避免在心跳间隔内被中间层切断
  const hb = setInterval(() => {
    try {
      if (!SSE_CLIENTS.has(id)) { clearInterval(hb); return }
      res.write(': ping ' + Date.now() + '\n\n')
    } catch (e) { clearInterval(hb) }
  }, 5000)
  // 立即先发一次，确保连接建立后马上有字节流出
  try { res.write(': ping init\n\n') } catch (e) {}

  // since 重放
  if (since > 0) {
    for (const e of SSE_RING) {
      if (Number(e.ts) > since) {
        const f = { deviceid: deviceid || null, kinds }
        if (f.deviceid && e.payload.deviceid && f.deviceid !== e.payload.deviceid) continue
        if (f.kinds && f.kinds.length && !f.kinds.includes(e.kind)) continue
        sseSendOne(res, e)
      }
    }
  }

  const cleanup = () => {
    clearInterval(hb)
    if (SSE_CLIENTS.has(id)) {
      SSE_CLIENTS.delete(id)
      console.log('[sse] 断开，剩余连接=' + SSE_CLIENTS.size)
    }
  }
  req.on('aborted', cleanup)
  req.on('close', cleanup)
  res.on('close', cleanup)
  res.on('error', cleanup)
  console.log('[sse] 新连接 id=' + id + ' 总数=' + SSE_CLIENTS.size + (deviceid ? (' @device=' + deviceid) : '') + (kinds.length ? (' kinds=' + kinds.join(',')) : ''))
})

// 给前端用于健康检查：当前连接数 & 最近 1 条事件（方便快速判断通道是否工作）
app.get('/api/events/status', (_req, res) => {
  res.json({
    code: 0,
    data: {
      clients: SSE_CLIENTS.size,
      ring: SSE_RING.length,
      last: SSE_RING[SSE_RING.length - 1] || null
    }
  })
})

// 列表：markedUnbound 设备也继续返回（手环仍在走 pb/upload 上报数据，且前端详情页可能直接靠 id 访问），
// 带 unbound:true 标记，前端可在列表中灰色展示或标"已解绑"提示用户重绑。
app.get('/api/devices', (req, res) => {
  const list = Object.keys(db.devices).map(id => {
    const d = db.devices[id]
    // 型号兜底：如果设备记录仍 model 为空（旧记录/解绑后重建），按 IMEI 前缀自动补齐
    if (!d.model) {
      const g = guessModelFromDeviceid(id)
      if (g) {
        d.model = g.model
        if (!d.name || d.name === '智能手环') d.name = g.name
      }
    }
    return Object.assign({}, d, d.markedUnbound ? { unbound: true } : {})
  })
  res.json({ code: 0, data: list })
})

app.get('/api/devices/:deviceid', (req, res) => {
  let dev = db.devices[req.params.deviceid]
  if (!dev) return res.status(404).json({ code: 404, message: 'device not found' })
  // 型号兜底（同列表）：旧记录 model 空时按 IMEI 补齐
  if (!dev.model) {
    const g = guessModelFromDeviceid(req.params.deviceid)
    if (g) {
      dev.model = g.model
      if (!dev.name || dev.name === '智能手环') dev.name = g.name
      saveDB(db)
    }
  }
  const out = Object.assign({}, dev, dev.markedUnbound ? { unbound: true } : {})
  res.json({ code: 0, data: out })
})

// 按已知 IMEI 前缀推断手环型号（deviceinfo/upload 缺席时兜底）
// BP100CE：IMEI 862071 开头
// KT65：   IMEI 860132 开头
const MODEL_BY_PREFIX = [
  { pref: '862071', model: 'BP100CE', name: '智能手环 - 血压款' },
  { pref: '860132', model: 'KT65',    name: '智能手环' }
]
function guessModelFromDeviceid(deviceid) {
  const s = String(deviceid || '')
  for (const r of MODEL_BY_PREFIX) {
    if (s.startsWith(r.pref)) return { model: r.model, name: r.name }
  }
  return null
}

app.post('/api/devices', (req, res) => {
  const { deviceid, name, model } = req.body || {}
  if (!deviceid) return res.status(400).json({ code: 400, message: 'deviceid required' })
  const dev = touch(deviceid)
  if (name) dev.name = name
  if (model) dev.model = model
  // 型号兜底：如果没有显式传 model，且 deviceid 前缀能识别，则自动补齐（同时补齐一个合理的默认名称）
  if (!dev.model) {
    const g = guessModelFromDeviceid(deviceid)
    if (g) {
      dev.model = g.model
      if (!dev.name || dev.name === '智能手环') dev.name = g.name
    }
  }
  // 解绑后重新绑定：清除标记
  if (dev.markedUnbound) delete dev.markedUnbound
  saveDB(db)
  broadcast('device_bind', { deviceid, name: dev.name, model: dev.model || null })
  res.json({ code: 0, data: dev })
})

// 解绑设备：⚠️ 不再真删 db.devices[id]（否则 model / latest / history 这些珍贵数据全部丢失），
// 改为打标记 markedUnbound=true。注释里写的"保留后端设备记录以免影响手环上报解析"原本就是这个意图，
// 之前 delete 直接删违背了该设计：用户点解绑 → 真实手环仍在上报 → DELETE 把整条删了 →
// touch() 重建一条 model=''、latest={} 的空壳 → 页面全显示 "--"，用户看到"连不到数据"。
app.delete('/api/devices/:deviceid', (req, res) => {
  const id = req.params.deviceid
  if (!id) return res.status(400).json({ code: 400, message: 'deviceid required' })
  if (!db.devices[id]) return res.status(404).json({ code: 404, message: 'device not found' })
  db.devices[id].markedUnbound = true
  saveDB(db)
  console.log('[api/devices] 解绑（标记）', id)
  broadcast('device_unbind', { deviceid: id })
  res.json({ code: 0, data: { deviceid: id } })
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
  const payload = (req.body && typeof req.body.payload === 'object') ? req.body.payload : {}
  const now = Math.floor(Date.now() / 1000)
  const dev = db.devices[deviceid] || {}
  const latest = dev.latest || {}
  const steps = (payload.stepCount != null ? Number(payload.stepCount) : null)
    ?? ((latest.steps || 0) + Math.floor(Math.random() * 120 + 30))

  // 0x0A OM0Report：实时步数/距离/卡路里/电量（payload 中可覆盖电量/步数）
  const om0 = OM0Report.fromObject({
    date_time: { date_time: { seconds: now }, time_zone: 8 },
    health: {
      steps,
      distance: (payload.distanceKm != null ? Math.round(payload.distanceKm * 1000) : null) ?? steps * 70,
      calorie: (payload.caloriesKcal != null ? payload.caloriesKcal : null) ?? Math.round(steps * 0.04)
    },
    battery: {
      // 前端显示用 battery * 10 做百分比，真实 OM0Report.battery.level 是百分比/10 的整数
      //  这里用用户直觉语义：payload.battery=66 → 表示 66%
      level: payload.battery != null ? Math.max(0, Math.floor(Number(payload.battery) / 10)) : (6 + Math.floor(Math.random() * 3)),
      charging: !!payload.charging
    },
    rssi: -60 - Math.floor(Math.random() * 20)
  })
  const frame0A = buildFrame(0x0a, om0, om => OM0Report.encode(om).finish())

  // 0x80 HisNotification → HisData.health：一分钟心率/血压/步数（payload 可覆盖心率/血压/血氧）
  const hr = payload.heart != null ? Number(payload.heart) : (65 + Math.floor(Math.random() * 20))
  const sbp = payload.sysPress != null ? Number(payload.sysPress) : (118 + Math.floor(Math.random() * 18))
  const dbp = payload.diaPress != null ? Number(payload.diaPress) : (76 + Math.floor(Math.random() * 12))
  const spo2 = payload.spo2 != null ? Number(payload.spo2) : (95 + Math.floor(Math.random() * 5))
  const hrv = payload.hrv != null ? Number(payload.hrv) : null
  const his = HisNotification.fromObject({
    type: 0, // HEALTH_DATA
    his_data: {
      seq: Math.floor(Math.random() * 0xffffff),
      health: {
        time_stamp: { date_time: { seconds: now }, time_zone: 8 },
        pedo_data: { type: 0, state: 0, calorie: Math.round(steps * 0.04), step: steps, distance: steps * 70 },
        hr_data: { min_bpm: hr - 8, max_bpm: hr + 6, avg_bpm: hr },
        bp_data: { sbp, dbp },
        // 血氧：HisHealthBOxy，有些机型会在 health 包一起上报
        bxoy_data: (spo2 != null && spo2 > 0)
          ? { min_oxy: Math.max(80, spo2 - 3), max_oxy: Math.min(100, spo2 + 2), agv_oxy: spo2 }
          : undefined,
        // HRV：HisHealthHrv.fatigue 用于压力值 = 100 - fatigue
        hrv_data: (hrv != null)
          ? { fatigue: Math.max(0, Math.min(100, 100 - hrv)) }
          : undefined
      }
    }
  })
  const frame80 = buildFrame(0x80, his, m => HisNotification.encode(m).finish())

  // 若 payload 传了 bodyTemp 或 skinTemp → 额外拼一条 TEMPERATURE(0x02) 包
  //   SensorTemp.evi_body  = bodyTemp * 100
  //   SensorTemp.esti_arm  = skinTemp * 100  （BP100CE 未单独上报皮肤温度时，esti_arm 会是 0）
  let frameTemp = Buffer.alloc(0)
  if (payload.bodyTemp != null || payload.skinTemp != null) {
    const eviBody = payload.bodyTemp != null ? Math.round(payload.bodyTemp * 100) >>> 0 : 0
    const estiArm = payload.skinTemp != null ? Math.round(payload.skinTemp * 100) >>> 0 : 0
    const tempMsg = HisNotification.fromObject({
      type: 2, // TEMPERATURE
      his_data: {
        seq: Math.floor(Math.random() * 0xffffff),
        temp: {
          time_stamp: { date_time: { seconds: now }, time_zone: 8 },
          temperature: {
            evi_body: eviBody,
            esti_arm: estiArm
          }
        }
      }
    })
    frameTemp = buildFrame(0x80, tempMsg, m => HisNotification.encode(m).finish())
  }

  const body = Buffer.concat([
    Buffer.from(deviceid.padEnd(15, ' ').slice(0, 15)),
    frame0A,
    frame80,
    frameTemp
  ])
  const r = parseUploadBody(body)
  // 模拟接口诊断：与 /pb/upload 保持同样的诊断日志，方便对比
  try {
    const fs = require('fs')
    const diags = []
    for (const p of r.packets) {
      if (!p || !p.parsed) continue
      const { type, data } = p.parsed
      const info = { via: '/api/simulate', opt: '0x'+p.opt.toString(16), type }
      if (data.sbp != null || data.dbp != null) info.bp = [data.sbp, data.dbp]
      if (data.hr != null) info.hr = data.hr
      if (data.spo2 != null) info.spo2 = data.spo2
      if (data.bodyTemp != null) info.bodyTemp = data.bodyTemp
      if (data.steps != null) info.steps = data.steps
      if (data.ecgN != null) info.ecgN = data.ecgN
      if (data.ts != null) info.pkt_ts = data.ts
      diags.push(info)
    }
    fs.appendFileSync('/tmp/pb_diag.log', JSON.stringify({ t: Date.now(), deviceid: r.deviceid, pkts: diags })+'\n')
  } catch(e) {}
  const dev2 = mergeSamples(r.deviceid, r.packets)
  // 如果 payload 里有 mergeSamples 无法产出的衍生字段（如睡眠），直接手动写回 snapshot
  if (payload.sleepMin != null && dev2 && dev2.latest) {
    const total = Number(payload.sleepMin) || 0
    dev2.latest.sleep = dev2.latest.sleep || { deep: 0, light: 0, wake: 0, total: 0 }
    dev2.latest.sleep.total = total
    dev2.latest.sleep.light = Math.round(total * 0.7)
    dev2.latest.sleep.deep = Math.round(total * 0.25)
    dev2.latest.sleep.wake = total - dev2.latest.sleep.light - dev2.latest.sleep.deep
  }
  // 模拟接口走完完整解析链路后，也通过 SSE 广播出去一次，方便前端立刻看到数据变化
  broadcast('pb', {
    deviceid: r.deviceid,
    snapshot: Object.assign({}, dev2.latest || {}),
    kind_detail: 'simulate realtime+health'
  })
  res.json({ code: 0, data: dev2.latest })
})

app.get('/api/health', (req, res) => res.json({ code: 0, msg: 'band-server running', devices: Object.keys(db.devices).length }))

/* ---------------- 睡眠监测仪（毫米波雷达款）对接 ---------------- */
// 独立模块：自带 data/radar.json 存储与平台鉴权，复用本服务的 SSE broadcast 下发实时数据
// 必须挂在 express.static 之前，否则静态中间件会先响应 /api/radar/*
let radar = null
try {
  radar = require('./radar.js')
  radar.mount(app, broadcast)
} catch (e) {
  console.error('[radar] 模块加载失败，雷达相关接口不可用:', e && e.message)
}

/* ---------------- 托管 H5（与 API 同源） ---------------- */
// H5 构建产物与后端接口同端口托管：前端用相对路径即可请求到本服务，
// 无论是本地预览、内网穿透公网地址还是手机访问都能正常工作
const H5_DIR = process.env.H5_DIR || (fs.existsSync(path.join(__dirname, 'public'))
  ? path.join(__dirname, 'public')
  : '/workspace/h5build/dist/dev/h5')
// 开发期间禁用静态资源缓存，避免修改后浏览器仍用旧文件
app.use(express.static(H5_DIR, {
  etag: false,
  lastModified: false,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
  }
}))
// SPA fallback：非 API 路径的未知路由返回 index.html，支持前端路由刷新
app.get(/^\/(?!api\/|pb\/|alarm\/|call_log\/|deviceinfo\/|status\/|health\/|sse\/).*/, (req, res, next) => {
  if (/\.\w+$/.test(req.path)) return next() // 带扩展名的静态文件交给 static 404
  res.sendFile(path.join(H5_DIR, 'index.html'))
})

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
