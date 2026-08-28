// 生成设备 tab 图标（81x81 RGBA PNG）：智能手环线形图标
// 表盘圆角矩形描边 + 上下表带 + 表盘内短信号线
const zlib = require('zlib')
const fs = require('fs')

// ---- CRC32 ----
const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c >>> 0
  }
  return t
})()
function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const typeBuf = Buffer.from(type, 'ascii')
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0)
  return Buffer.concat([len, typeBuf, data, crc])
}

function encodePng(w, h, rgba) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type RGBA
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0
  const stride = w * 4
  const raw = Buffer.alloc((stride + 1) * h)
  for (let y = 0; y < h; y++) {
    raw[y * (stride + 1)] = 0 // filter none
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride)
  }
  const idat = zlib.deflateSync(raw, { level: 9 })
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))])
}

const S = 81
function makeIcon(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const buf = Buffer.alloc(S * S * 4) // 全透明
  const set = (x, y) => {
    if (x < 0 || y < 0 || x >= S || y >= S) return
    const i = (y * S + x) * 4
    buf[i] = r; buf[i + 1] = g; buf[i + 2] = b; buf[i + 3] = 255
  }
  // 圆角矩形填充
  const fillRoundRect = (x0, y0, x1, y1, rad) => {
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const cx = x < x0 + rad ? x0 + rad : x > x1 - rad ? x1 - rad : x
        const cy = y < y0 + rad ? y0 + rad : y > y1 - rad ? y1 - rad : y
        const dx = x - cx, dy = y - cy
        if (dx * dx + dy * dy <= rad * rad) set(x, y)
      }
    }
  }
  // 表盘外框（描边）：外圆角矩形填充 + 内圆角矩形镂空
  fillRoundRect(20, 24, 61, 57, 9)
  fillRoundRect(24, 28, 57, 53, 6) // 镂空（透明覆盖：保持透明即可，跳过）
  // 上面镂空用透明覆盖 = 不写像素即可，但填充已写入；需再次清空内矩形
  for (let y = 28; y <= 53; y++) {
    for (let x = 24; x <= 57; x++) {
      const cx = x < 24 + 6 ? 24 + 6 : x > 57 - 6 ? 57 - 6 : x
      const cy = y < 28 + 6 ? 28 + 6 : y > 53 - 6 ? 53 - 6 : y
      const dx = x - cx, dy = y - cy
      if (dx * dx + dy * dy <= 36) {
        const i = (y * S + x) * 4
        buf[i + 3] = 0
      }
    }
  }
  // 上下表带（实心）
  fillRoundRect(34, 15, 47, 24, 3)
  fillRoundRect(34, 57, 47, 66, 3)
  // 表盘内信号线（三段竖条）
  fillRoundRect(30, 36, 34, 40, 2)
  fillRoundRect(38, 34, 42, 42, 2)
  fillRoundRect(46, 36, 50, 40, 2)
  return encodePng(S, S, buf)
}

const out = '/workspace/uniapp-health/static/tab/'
fs.writeFileSync(out + 'device.png', makeIcon('#94a8aa'))
fs.writeFileSync(out + 'device-active.png', makeIcon('#1a7d82'))
console.log('generated', fs.statSync(out + 'device.png').size, fs.statSync(out + 'device-active.png').size)
