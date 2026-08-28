// 生成通用占位图（640x420 RGBA PNG）：页面同款青绿渐变 + 中央白色圆环
// 用于 text_to_image API 会话失效时 image 加载失败的兜底
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

const W = 640
const H = 420
const buf = Buffer.alloc(W * H * 4)
const lerp = (a, b, t) => Math.round(a + (b - a) * t)

// 左上 #ddf7ed → 右下 #f3f3f3（135deg 渐变，与页面背景一致）
const c0 = [221, 247, 237]
const c1 = [243, 243, 243]
const cx = W / 2
const cy = H / 2
const rOut = 74
const rIn = 58

for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const t = (x + y) / (W + H)
    let r = lerp(c0[0], c1[0], t)
    let g = lerp(c0[1], c1[1], t)
    let b = lerp(c0[2], c1[2], t)
    const i = (y * W + x) * 4
    // 中央白色圆环
    const d = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy))
    if (d <= rOut && d >= rIn) {
      r = 255; g = 255; b = 255
    } else if (d > rOut - 6 && d < rOut) {
      // 外缘柔化
      const a = (rOut - d) / 6
      r = lerp(r, 255, a); g = lerp(g, 255, a); b = lerp(b, 255, a)
    }
    // 半透明光晕让圆环融入
    if (d <= rOut && d >= rIn) {
      buf[i + 3] = 205
    } else {
      buf[i + 3] = 255
    }
    buf[i] = r; buf[i + 1] = g; buf[i + 2] = b
  }
}

const out = '/workspace/uniapp-health/static/img/'
fs.mkdirSync(out, { recursive: true })
fs.writeFileSync(out + 'placeholder.png', encodePng(W, H, buf))
console.log('generated', fs.statSync(out + 'placeholder.png').size, 'bytes')
