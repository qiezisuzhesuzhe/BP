const { JSDOM, VirtualConsole } = require('jsdom')
const vc = new VirtualConsole()
vc.on('jsdomError', e => {
  console.log('=== jsdomError ===')
  console.log(e.message)
  const inner = e.detail || e
  console.log(String(inner && inner.stack || '').split('\n').slice(0, 12).join('\n'))
})

function polyfill(w) {
  w.matchMedia = q => ({ matches: false, media: q, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false })
  w.requestAnimationFrame = cb => setTimeout(() => cb(Date.now()), 16)
  w.cancelAnimationFrame = id => clearTimeout(id)
  w.scrollTo = () => {}
  const ctx2d = {
    backingStorePixelRatio: 1, webkitBackingStorePixelRatio: 1, mozBackingStorePixelRatio: 1,
    msBackingStorePixelRatio: 1, oBackingStorePixelRatio: 1, backingStoreRatio: 1,
    canvas: null, font: '', fillStyle: '', strokeStyle: '', lineWidth: 1,
    save() {}, restore() {}, scale() {}, translate() {}, beginPath() {}, closePath() {},
    moveTo() {}, lineTo() {}, arc() {}, rect() {}, fill() {}, stroke() {}, clip() {},
    fillRect() {}, strokeRect() {}, clearRect() {}, fillText() {}, drawImage() {},
    measureText: t => ({ width: String(t).length * 8 }),
    createLinearGradient: () => ({ addColorStop() {} }),
    getImageData: (x, y, sw = 1, sh = 1) => ({ width: sw, height: sh, data: new Uint8ClampedArray(sw * sh * 4) }),
    setLineDash() {}, getLineDash: () => []
  }
  w.HTMLCanvasElement.prototype.getContext = function () { return Object.assign(Object.create(ctx2d), { canvas: this }) }
  w.HTMLCanvasElement.prototype.toDataURL = () => 'data:image/png;base64,'
  function C2D() {}
  C2D.prototype = ctx2d
  w.CanvasRenderingContext2D = C2D
  w.Path2D = function Path2D() {}
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

function clickDeepest(doc, kw) {
  const hits = [...doc.querySelectorAll('uni-view,uni-text,uni-button')].filter(e => (e.textContent || '').includes(kw))
  if (!hits.length) { console.log('!! 未找到: ' + kw); return }
  const el = hits[hits.length - 1]
  const w = doc.defaultView
  for (const type of ['touchstart', 'touchend', 'click']) {
    const ev = doc.createEvent('Event'); ev.initEvent(type, true, true); el.dispatchEvent(ev)
  }
}

;(async () => {
  const dom = await JSDOM.fromURL('http://127.0.0.1:8090/index.html', {
    resources: 'usable', runScripts: 'dangerously', pretendToBeVisual: true,
    virtualConsole: vc, beforeParse: polyfill
  })
  const w = dom.window
  const doc = w.document
  w.addEventListener('error', e => {
    console.log('=== window.error ===')
    console.log(e.message)
    console.log(String(e.error && e.error.stack || '').split('\n').slice(0, 12).join('\n'))
  })
  await sleep(7000)
  console.log('--- 逐步点击，观察报错发生在哪一步 ---')
  console.log('step: 点击首页服务包')
  clickDeepest(doc, '高血压调理计划'); await sleep(2500)
  console.log('hash=' + w.location.hash)
  console.log('step: 点击 FAQ 手风琴')
  clickDeepest(doc, '这个服务能代替医院就诊吗？'); await sleep(1500)
  console.log('step: 点击立即购买')
  clickDeepest(doc, '立即购买'); await sleep(3000)
  console.log('hash=' + w.location.hash)
  console.log('step: 点击确认支付')
  clickDeepest(doc, '确认支付'); await sleep(7000)
  console.log('hash=' + w.location.hash)
  console.log('step: 点击立即使用')
  clickDeepest(doc, '立即使用'); await sleep(7000)
  console.log('hash=' + w.location.hash)
  const t = (doc.querySelector('#app') || doc.body).textContent.replace(/\s+/g, ' ').trim()
  console.log('末页文本(前 600)：' + t.slice(0, 600))
  w.close(); process.exit(0)
})().catch(e => { console.error('FATAL', e); process.exit(1) })
