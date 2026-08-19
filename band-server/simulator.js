/**
 * 手环模拟器：构造埃微 0x0A/0x80 二进制数据包，POST 到接收服务的 /pb/upload
 * 用法: node simulator.js [deviceid] [间隔秒]
 * 例:   node simulator.js 860132060872223 60   （每 60 秒上报一次，模拟真实手环）
 */
const path = require('path')
const protobuf = require('protobufjs')

const DEVICEID = process.argv[2] || '860132060872223'
const INTERVAL = parseInt(process.argv[3] || '0', 10) || 0
const BASE = process.env.SERVER_URL || 'http://localhost:8091'
// 是否附带心电图/血氧/睡眠数据（默认开启；加 4 参数可关闭：node simulator.js <id> <秒> noextra）
const EXTRA = !(process.argv[4] === 'noextra')

let OM0Report, HisNotification

function buildFrame(opt, msgObj, encodeFn) {
  const payload = encodeFn(msgObj)
  const buf = Buffer.alloc(8 + payload.length)
  buf.writeUInt8(0x44, 0)
  buf.writeUInt8(0x54, 1)
  buf.writeUInt16LE(payload.length, 2)
  buf.writeUInt16LE(0, 4)
  buf.writeUInt16LE(opt, 6)
  Buffer.from(payload).copy(buf, 8)
  return buf
}

// 生成一段近似 PQRST 的心电图采样（真实波形数值，非占位）
function genEcgSamples(n) {
  const out = []
  for (let i = 0; i < n; i++) {
    const t = i / 40 // 每 40 点一个周期
    const phase = t - Math.floor(t)
    let v = Math.sin(t * Math.PI * 2) * 28
    // P 波
    if (phase > 0.02 && phase < 0.14) v += Math.sin(((phase - 0.08) / 0.06) * Math.PI) * 34
    // QRS 波群
    if (phase > 0.3 && phase < 0.36) v -= 140
    if (phase > 0.36 && phase < 0.42) v += 180
    // T 波
    if (phase > 0.5 && phase < 0.66) v += Math.sin(((phase - 0.58) / 0.08) * Math.PI) * 55
    out.push(Math.round(v))
  }
  return out
}

async function reportOnce(stepBase) {
  const now = Math.floor(Date.now() / 1000)
  const steps = stepBase + Math.floor(Math.random() * 120 + 30)
  const frames = []

  const om0 = OM0Report.fromObject({
    date_time: { date_time: { seconds: now }, time_zone: 8 },
    health: { steps, distance: steps * 70, calorie: Math.round(steps * 0.04) },
    battery: { level: 6 + Math.floor(Math.random() * 3), charging: false },
    rssi: -60 - Math.floor(Math.random() * 20)
  })
  frames.push(buildFrame(0x0a, om0, m => OM0Report.encode(m).finish()))

  const hr = 65 + Math.floor(Math.random() * 20)
  const sbp = 118 + Math.floor(Math.random() * 18)
  const dbp = 76 + Math.floor(Math.random() * 12)
  const his = HisNotification.fromObject({
    type: 0,
    his_data: {
      seq: Math.floor(Math.random() * 0xffffff),
      health: {
        time_stamp: { date_time: { seconds: now }, time_zone: 8 },
        pedo_data: { type: 0, state: 0, calorie: Math.round(steps * 0.04), step: steps, distance: steps * 70 },
        hr_data: { min_bpm: hr - 8, max_bpm: hr + 6, avg_bpm: hr },
        bp_data: { sbp, dbp },
        // 睡眠：最近 30 分钟睡眠状态（0 清醒 / 1 浅睡 / 2 深睡）
        sleep_data: { sleep_data: [1, 1, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 1, 1, 0, 1, 2, 2, 2, 1, 1, 1, 2, 2, 1, 1, 1, 0, 1], shut_down: false, charge: false }
      }
    }
  })
  frames.push(buildFrame(0x80, his, m => HisNotification.encode(m).finish()))

  if (EXTRA) {
    // 血氧测量（type=6 SPO2_DATA）：一次测量一串血氧值
    const spo2His = HisNotification.fromObject({
      type: 6,
      his_data: {
        seq: Math.floor(Math.random() * 0xffffff),
        spo2: {
          time_stamp: { date_time: { seconds: now }, time_zone: 8 },
          spo2_data: [96, 97, 97, 98, 98, 98, 97, 98, 98, 99, 98, 98, 97, 98, 98, 99, 98, 98, 98, 97]
        }
      }
    })
    frames.push(buildFrame(0x80, spo2His, m => HisNotification.encode(m).finish()))

    // 心电图测量（type=2 ECG_DATA）：480 个波形采样点
    const ecgHis = HisNotification.fromObject({
      type: 2,
      his_data: {
        seq: Math.floor(Math.random() * 0xffffff),
        ecg: {
          time_stamp: { date_time: { seconds: now }, time_zone: 8 },
          raw_data: genEcgSamples(480)
        }
      }
    })
    frames.push(buildFrame(0x80, ecgHis, m => HisNotification.encode(m).finish()))
  }

  const body = Buffer.concat([Buffer.from(DEVICEID.padEnd(15, ' ').slice(0, 15))].concat(frames))
  const resp = await fetch(BASE + '/pb/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  })
  const ret = Buffer.from(await resp.arrayBuffer())[0]
  const t = new Date().toLocaleTimeString()
  console.log('[' + t + '] POST /pb/upload bytes=' + body.length + ' resp=0x' + ret.toString(16).padStart(2, '0') + ' steps=' + steps + ' hr=' + hr + ' bp=' + sbp + '/' + dbp + (EXTRA ? ' +spo2 +ecg +sleep' : ''))
  return steps
}

async function main() {
  const root = new protobuf.Root()
  await root.load([path.join(__dirname, 'proto/his_data.proto'), path.join(__dirname, 'proto/om0_command.proto')], { keepCase: true })
  OM0Report = root.lookupType('OM0Report')
  HisNotification = root.lookupType('HisNotification')
  console.log('手环模拟器 deviceid=' + DEVICEID + ' server=' + BASE + (INTERVAL ? ' 间隔' + INTERVAL + 's' : ' 单次'))
  let base = 0
  base = await reportOnce(0)
  if (!INTERVAL) return
  setInterval(async () => { base = await reportOnce(base) }, INTERVAL * 1000)
}

main().catch(e => { console.error(e); process.exit(1) })
