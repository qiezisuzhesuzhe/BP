// 生成我的健康 tab 图标（81x81 RGBA PNG）：心形 + 镂空心电折线
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
const SS = 3 // 超采样倍数，用于抗锯齿

function makeIcon(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const buf = Buffer.alloc(S * S * 4)

  // 心形隐式方程 (x^2+y^2-1)^3 - x^2*y^3 <= 0
  const inHeart = (px, py) => {
    const x = (px - 40.5) / 27
    const y = (44.5 - py) / 27
    const a = x * x + y * y - 1
    return a * a * a - x * x * y * y * y <= 0
  }

  // 心电折线（作为镂空路径）
  const PTS = [
    [23, 43],
    [32, 43],
    [36, 33],
    [41, 52],
    [46, 43],
    [58, 43]
  ]
  const HALF = 2.6
  const nearECG = (px, py) => {
    for (let i = 0; i < PTS.length - 1; i++) {
      const [x1, y1] = PTS[i]
      const [x2, y2] = PTS[i + 1]
      const dx = x2 - x1
      const dy = y2 - y1
      const len2 = dx * dx + dy * dy
      let t = ((px - x1) * dx + (py - y1) * dy) / len2
      t = t < 0 ? 0 : t > 1 ? 1 : t
      const cx = x1 + t * dx
      const cy = y1 + t * dy
      const ex = px - cx
      const ey = py - cy
      if (ex * ex + ey * ey <= HALF * HALF) return true
    }
    return false
  }

  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      let hit = 0
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const px = x + (sx + 0.5) / SS
          const py = y + (sy + 0.5) / SS
          if (inHeart(px, py) && !nearECG(px, py)) hit++
        }
      }
      if (hit === 0) continue
      const alpha = Math.round((hit / (SS * SS)) * 255)
      const i = (y * S + x) * 4
      buf[i] = r
      buf[i + 1] = g
      buf[i + 2] = b
      buf[i + 3] = alpha
    }
  }
  return encodePng(S, S, buf)
}

const out = '/workspace/uniapp-health/static/tab/'
fs.writeFileSync(out + 'health.png', makeIcon('#94a8aa'))
fs.writeFileSync(out + 'health-active.png', makeIcon('#1a7d82'))
console.log('generated', fs.statSync(out + 'health.png').size, fs.statSync(out + 'health-active.png').size)
