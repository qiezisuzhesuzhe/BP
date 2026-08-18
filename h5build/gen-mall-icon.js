// 生成健康商城 tab 图标（81x81 RGBA PNG）：购物袋 + 提手拱门 + 袋口横线
const zlib = require('zlib')
const fs = require('fs')

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
  ihdr[8] = 8
  ihdr[9] = 6
  const stride = w * 4
  const raw = Buffer.alloc((stride + 1) * h)
  for (let y = 0; y < h; y++) {
    raw[y * (stride + 1)] = 0
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
  const buf = Buffer.alloc(S * S * 4)
  const set = (x, y, alpha = 255) => {
    if (x < 0 || y < 0 || x >= S || y >= S) return
    const i = (y * S + x) * 4
    buf[i] = r; buf[i + 1] = g; buf[i + 2] = b; buf[i + 3] = alpha
  }
  const fillRoundRect = (x0, y0, x1, y1, rad, alpha = 255) => {
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const cx = x < x0 + rad ? x0 + rad : x > x1 - rad ? x1 - rad : x
        const cy = y < y0 + rad ? y0 + rad : y > y1 - rad ? y1 - rad : y
        const dx = x - cx, dy = y - cy
        if (dx * dx + dy * dy <= rad * rad) set(x, y, alpha)
      }
    }
  }
  const hollowRoundRect = (x0, y0, x1, y1, rad) => {
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const cx = x < x0 + rad ? x0 + rad : x > x1 - rad ? x1 - rad : x
        const cy = y < y0 + rad ? y0 + rad : y > y1 - rad ? y1 - rad : y
        const dx = x - cx, dy = y - cy
        if (dx * dx + dy * dy <= rad * rad) {
          const i = (y * S + x) * 4
          buf[i + 3] = 0
        }
      }
    }
  }
  // 提手拱门
  fillRoundRect(33, 19, 48, 30, 6)
  hollowRoundRect(37, 22, 44, 27, 2)
  // 袋身
  fillRoundRect(20, 31, 61, 66, 8)
  // 袋口横线（镂空出袋口缝）
  hollowRoundRect(24, 44, 57, 46, 1)
  return encodePng(S, S, buf)
}

const out = '/workspace/uniapp-health/static/tab/'
fs.writeFileSync(out + 'mall.png', makeIcon('#94a8aa'))
fs.writeFileSync(out + 'mall-active.png', makeIcon('#1a7d82'))
console.log('generated', fs.statSync(out + 'mall.png').size, fs.statSync(out + 'mall-active.png').size)
