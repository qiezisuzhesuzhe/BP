/**
 * 语音播报（TTS）—— 健康小助手对话页发音能力
 *
 * 两级实现，自动降级，调用方无需关心：
 *   1) Edge Neural TTS（微软 Edge 朗读服务，WebSocket 协议）
 *      音质接近真人，支持中文多音色与情感风格（gentle / friendly / cheerful）。
 *      需要联网；合成失败后本次进程内不再重试，直接走第 2 级。
 *   2) Web Speech API（浏览器内置合成，仅 H5）
 *      离线可用，音色取决于系统，作为兜底。
 *
 * 跨端说明：
 *   · H5：WebSocket + Blob + Audio，兜底 speechSynthesis。
 *   · App / 小程序：uni.connectSocket + 临时文件 + InnerAudioContext，无 Web Speech 兜底。
 *
 * 用法：
 *   import { speak, stop, isEnabled, setEnabled, VOICES, getVoiceKey, setVoiceKey } from '@/common/tts.js'
 */

const PREF_KEY = 'tts_pref_v1'

export const VOICES = [
  { key: 'xiaoxiao', name: 'zh-CN-XiaoxiaoNeural', label: '晓晓 · 温柔女声', style: 'gentle' },
  { key: 'xiaoyi', name: 'zh-CN-XiaoyiNeural', label: '晓伊 · 亲切女声', style: 'gentle' },
  { key: 'yunxi', name: 'zh-CN-YunxiNeural', label: '云希 · 阳光男声', style: 'friendly' },
  { key: 'yunyang', name: 'zh-CN-YunyangNeural', label: '云扬 · 沉稳男声', style: 'friendly' },
  { key: 'yunxia', name: 'zh-CN-YunxiaNeural', label: '云夏 · 活泼少年', style: 'cheerful' }
]

const EDGE_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4'
const EDGE_WSS =
  'wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=' + EDGE_TOKEN
const EDGE_TIMEOUT = 12000

const pref = { enabled: true, voiceKey: 'xiaoxiao' }
let edgeAvailable = true

try {
  const saved = uni.getStorageSync(PREF_KEY)
  if (saved && typeof saved === 'object') {
    if (typeof saved.enabled === 'boolean') pref.enabled = saved.enabled
    if (saved.voiceKey && VOICES.some((v) => v.key === saved.voiceKey)) pref.voiceKey = saved.voiceKey
  }
} catch (e) {
  /* ignore */
}

function savePref() {
  try {
    uni.setStorageSync(PREF_KEY, { enabled: pref.enabled, voiceKey: pref.voiceKey })
  } catch (e) {
    /* ignore */
  }
}

export function isEnabled() {
  return pref.enabled
}

export function setEnabled(on) {
  pref.enabled = !!on
  savePref()
  if (!pref.enabled) stop()
}

export function getVoiceKey() {
  return pref.voiceKey
}

export function getVoice() {
  return VOICES.find((v) => v.key === pref.voiceKey) || VOICES[0]
}

export function setVoiceKey(key) {
  if (!VOICES.some((v) => v.key === key)) return
  pref.voiceKey = key
  savePref()
  stop()
}

/* ── 文本清洗：把界面文案变成适合朗读的口语串 ── */
const EMOJI_RE =
  /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{200D}\u{1F000}-\u{1F02F}]/gu

export function cleanTextForSpeech(text) {
  if (!text) return ''
  return String(text)
    .replace(/\*\*/g, '')
    .replace(/[•·▪◆●○■□]/g, '。')
    .replace(EMOJI_RE, '')
    .replace(/(\d+)\./g, '$1，')
    .replace(/[；;]/g, '。')
    .replace(/\n{2,}/g, '。')
    .replace(/\n/g, '。')
    .replace(/[，。][，。]+/g, '。')
    .replace(/\s+/g, ' ')
    .trim()
}

function splitSentences(text) {
  const out = []
  let buf = ''
  for (let i = 0; i < text.length; i++) {
    buf += text[i]
    if ('。！？!?'.indexOf(text[i]) !== -1) {
      const s = buf.trim()
      if (s) out.push(s)
      buf = ''
    }
  }
  const tail = buf.trim()
  if (tail) out.push(tail)
  return out
}

function escapeXml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function buildSSML(text, voice) {
  const body = splitSentences(text)
    .map((s) => {
      const isQ = /[？?]$/.test(s)
      const pause = s.length <= 10 ? '180ms' : '320ms'
      return (
        '<s>' +
        (isQ ? '<prosody pitch="+6%">' : '') +
        escapeXml(s) +
        (isQ ? '</prosody>' : '') +
        '</s><break time="' +
        pause +
        '"/>'
      )
    })
    .join('')
  return (
    '<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" ' +
    'xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="zh-CN">' +
    '<voice name="' +
    voice.name +
    '">' +
    '<mstts:express-as style="' +
    voice.style +
    '" styledegree="1.1">' +
    '<prosody rate="-4%" pitch="+2%" volume="+0%">' +
    body +
    '</prosody></mstts:express-as></voice></speak>'
  )
}

function randomHex32() {
  let s = ''
  for (let i = 0; i < 32; i++) s += Math.floor(Math.random() * 16).toString(16)
  return s
}

/* ── 跨端 WebSocket 抽象 ── */
function createSocket(url, handlers) {
  // #ifdef H5
  let ws = null
  try {
    ws = new WebSocket(url)
  } catch (e) {
    handlers.onError(e)
    return null
  }
  ws.binaryType = 'arraybuffer'
  ws.onopen = () => handlers.onOpen()
  ws.onmessage = (ev) => handlers.onMessage(ev.data)
  ws.onerror = () => handlers.onError(new Error('socket error'))
  ws.onclose = () => handlers.onClose()
  return {
    send(data) {
      ws.send(data)
    },
    close() {
      try {
        ws.close()
      } catch (e) {
        /* ignore */
      }
    }
  }
  // #endif

  // #ifndef H5
  let task = null
  try {
    task = uni.connectSocket({ url: url, multiple: true, complete: () => {} })
  } catch (e) {
    handlers.onError(e)
    return null
  }
  if (!task) {
    handlers.onError(new Error('socket unsupported'))
    return null
  }
  task.onOpen(() => handlers.onOpen())
  task.onMessage((res) => handlers.onMessage(res.data))
  task.onError(() => handlers.onError(new Error('socket error')))
  task.onClose(() => handlers.onClose())
  return {
    send(data) {
      task.send({ data: data })
    },
    close() {
      try {
        task.close({})
      } catch (e) {
        /* ignore */
      }
    }
  }
  // #endif
}

/** 只解前若干字节的 ASCII 头，用于定位 Path:audio 分隔符（避免依赖 TextDecoder） */
function asciiHead(bytes, max) {
  let s = ''
  const len = Math.min(max, bytes.length)
  for (let i = 0; i < len; i++) s += String.fromCharCode(bytes[i])
  return s
}

function concatChunks(chunks) {
  let total = 0
  for (let i = 0; i < chunks.length; i++) total += chunks[i].length
  const out = new Uint8Array(total)
  let offset = 0
  for (let i = 0; i < chunks.length; i++) {
    out.set(chunks[i], offset)
    offset += chunks[i].length
  }
  return out
}

/**
 * 向 Edge 朗读服务请求合成，resolve 出完整 mp3 字节。
 * 协议：连接后先发 speech.config（音频格式），再发 ssml；
 *       音频以二进制帧回传，帧头形如 "...Path:audio\r\n" + 原始 mp3 数据；
 *       收到文本帧 Path:turn.end 表示合成结束。
 */
function synthViaEdge(text, voice) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let settled = false
    let socket = null

    const finish = (fn, arg) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      if (socket) socket.close()
      fn(arg)
    }

    const timer = setTimeout(() => finish(reject, new Error('tts timeout')), EDGE_TIMEOUT)

    socket = createSocket(EDGE_WSS + '&ConnectionId=' + randomHex32(), {
      onOpen() {
        const ts = new Date().toString()
        socket.send(
          'X-Timestamp:' +
            ts +
            '\r\nContent-Type:application/json; charset=utf-8\r\n' +
            'Path:speech.config\r\n\r\n' +
            '{"context":{"synthesis":{"audio":{"metadataoptions":{' +
            '"sentenceBoundaryEnabled":false,"wordBoundaryEnabled":false},' +
            '"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}'
        )
        socket.send(
          'X-RequestId:' +
            randomHex32() +
            '\r\nContent-Type:application/ssml+xml\r\n' +
            'X-Timestamp:' +
            ts +
            'Z\r\nPath:ssml\r\n\r\n' +
            buildSSML(text, voice)
        )
      },
      onMessage(data) {
        if (typeof data === 'string') {
          if (data.indexOf('Path:turn.end') !== -1) {
            if (!chunks.length) return finish(reject, new Error('tts empty'))
            finish(resolve, concatChunks(chunks))
          }
          return
        }
        const bytes = new Uint8Array(data)
        const marker = asciiHead(bytes, 1024).indexOf('Path:audio\r\n')
        if (marker !== -1) chunks.push(bytes.slice(marker + 12))
      },
      onError(err) {
        finish(reject, err)
      },
      onClose() {
        if (!settled) finish(reject, new Error('tts closed'))
      }
    })

    if (!socket) finish(reject, new Error('socket unavailable'))
  })
}

/* ── 播放控制：session 递增用于打断上一次播报，避免叠音 ── */
let session = 0
let currentAudio = null
let currentObjectUrl = ''

function releaseAudio() {
  if (currentAudio) {
    try {
      // #ifdef H5
      currentAudio.pause()
      // #endif
      // #ifndef H5
      currentAudio.stop()
      currentAudio.destroy()
      // #endif
    } catch (e) {
      /* ignore */
    }
    currentAudio = null
  }
  if (currentObjectUrl) {
    try {
      URL.revokeObjectURL(currentObjectUrl)
    } catch (e) {
      /* ignore */
    }
    currentObjectUrl = ''
  }
}

export function stop() {
  session++
  releaseAudio()
  // #ifdef H5
  try {
    const synth = window.speechSynthesis
    if (synth) synth.cancel()
  } catch (e) {
    /* ignore */
  }
  // #endif
}

/* ── 播放 mp3 字节 ── */
// #ifdef H5
function playBytes(bytes) {
  return new Promise((resolve, reject) => {
    let url = ''
    try {
      url = URL.createObjectURL(new Blob([bytes], { type: 'audio/mpeg' }))
    } catch (e) {
      return reject(e)
    }
    const audio = new Audio(url)
    currentAudio = audio
    currentObjectUrl = url
    audio.onended = () => resolve()
    audio.onerror = () => reject(new Error('audio error'))
    const p = audio.play()
    if (p && typeof p.catch === 'function') p.catch(reject)
  })
}
// #endif

// #ifndef H5
function bytesToBase64(bytes) {
  const table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  let out = ''
  let i = 0
  for (; i + 2 < bytes.length; i += 3) {
    const n = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]
    out += table[(n >> 18) & 63] + table[(n >> 12) & 63] + table[(n >> 6) & 63] + table[n & 63]
  }
  const rest = bytes.length - i
  if (rest === 1) {
    const n = bytes[i] << 16
    out += table[(n >> 18) & 63] + table[(n >> 12) & 63] + '=='
  } else if (rest === 2) {
    const n = (bytes[i] << 16) | (bytes[i + 1] << 8)
    out += table[(n >> 18) & 63] + table[(n >> 12) & 63] + table[(n >> 6) & 63] + '='
  }
  return out
}

function writeTempMp3(bytes) {
  return new Promise((resolve, reject) => {
    let fs = null
    try {
      fs = uni.getFileSystemManager && uni.getFileSystemManager()
    } catch (e) {
      /* ignore */
    }
    if (!fs) return reject(new Error('fs unavailable'))
    const base = (uni.env && uni.env.USER_DATA_PATH) || '_doc'
    const path = base + '/tts_' + Date.now() + '.mp3'
    fs.writeFile({
      filePath: path,
      data: bytesToBase64(bytes),
      encoding: 'base64',
      success: () => resolve(path),
      fail: (err) => reject(err || new Error('write fail'))
    })
  })
}

async function playBytes(bytes) {
  const path = await writeTempMp3(bytes)
  return new Promise((resolve, reject) => {
    const ctx = uni.createInnerAudioContext()
    currentAudio = ctx
    ctx.src = path
    ctx.onEnded(() => resolve())
    ctx.onError(() => reject(new Error('audio error')))
    ctx.play()
  })
}
// #endif

/* ── 兜底：浏览器内置合成，逐句朗读 ── */
// #ifdef H5
function pickZhVoice(synth) {
  const list = synth.getVoices() || []
  const zh = list.filter((v) => v.lang && v.lang.toLowerCase().indexOf('zh') === 0)
  if (!zh.length) return null
  const natural = zh.find((v) => /natural|online|neural/i.test(v.name))
  if (natural) return natural
  const prefer = ['xiaoxiao', 'yunxi', 'yunyang', 'xiaoyi', 'huihui', 'yaoyao', 'tingting', 'meijia']
  for (let i = 0; i < prefer.length; i++) {
    const hit = zh.find((v) => v.name.toLowerCase().replace(/[\s_-]/g, '').indexOf(prefer[i]) !== -1)
    if (hit) return hit
  }
  return zh.find((v) => v.lang.toLowerCase().indexOf('zh-cn') !== -1) || zh[0]
}

function speakViaWebSpeech(text, mySession) {
  const synth = window.speechSynthesis
  if (!synth) return
  const sentences = splitSentences(text)
  if (!sentences.length) return
  const voice = pickZhVoice(synth)
  const next = (i) => {
    if (mySession !== session || i >= sentences.length) return
    const s = sentences[i]
    const u = new SpeechSynthesisUtterance(s)
    u.lang = 'zh-CN'
    u.rate = 0.92 + Math.random() * 0.08
    u.pitch = /[？?]$/.test(s) ? 1.12 : 1.0 + (Math.random() - 0.5) * 0.06
    if (voice) u.voice = voice
    u.onend = () => setTimeout(() => next(i + 1), s.length <= 8 ? 180 : 280)
    u.onerror = () => next(i + 1)
    synth.speak(u)
  }
  next(0)
}
// #endif

/** 预热：H5 首次调用 getVoices() 常返回空数组，需提前触发一次加载 */
export function warmup() {
  // #ifdef H5
  try {
    const synth = window.speechSynthesis
    if (!synth) return
    synth.getVoices()
    synth.onvoiceschanged = () => synth.getVoices()
  } catch (e) {
    /* ignore */
  }
  // #endif
}

/**
 * 播报一段文本。关闭状态下直接返回；重复调用会打断上一次播报。
 * @param {string} text 界面原文，内部会做朗读清洗
 * @param {object} [opts] { force: true } 忽略开关强制播报（用于手动点击重听）
 */
export async function speak(text, opts) {
  const force = !!(opts && opts.force)
  if (!pref.enabled && !force) return
  const cleaned = cleanTextForSpeech(text)
  if (!cleaned) return

  stop()
  const mySession = session

  if (edgeAvailable) {
    let bytes = null
    try {
      bytes = await synthViaEdge(cleaned, getVoice())
    } catch (e) {
      // 只有"合成失败"才判定 Edge 不可用（断网 / 服务变更），本进程内不再重试
      edgeAvailable = false
    }
    if (mySession !== session) return
    if (bytes) {
      try {
        await playBytes(bytes)
      } catch (e) {
        // 播放失败多为浏览器自动播放限制，与合成能力无关，不降级
      }
      return
    }
  }

  // #ifdef H5
  speakViaWebSpeech(cleaned, mySession)
  // #endif
}
