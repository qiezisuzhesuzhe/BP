const { JSDOM, VirtualConsole } = require('jsdom')

const vc = new VirtualConsole()
const errs = []
vc.on('jsdomError', e => errs.push('[jsdomError] ' + (e.message || e) + (e.stack ? '\n' + String(e.stack).split('\n').slice(0, 4).join('\n') : '')))
vc.on('error', (...a) => errs.push('[error] ' + a.join(' ')))

function polyfill(w) {
  w.matchMedia = w.matchMedia || (q => ({
    matches: false, media: q, onchange: null,
    addListener() {}, removeListener() {},
    addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false }
  }))
  w.requestAnimationFrame = cb => setTimeout(() => cb(Date.now()), 16)
  w.cancelAnimationFrame = id => clearTimeout(id)
  w.scrollTo = () => {}
  if (!w.HTMLElement.prototype.scrollIntoView) w.HTMLElement.prototype.scrollIntoView = () => {}

  const ctx2d = {
    backingStorePixelRatio: 1, webkitBackingStorePixelRatio: 1,
    mozBackingStorePixelRatio: 1, msBackingStorePixelRatio: 1,
    oBackingStorePixelRatio: 1, backingStoreRatio: 1,
    canvas: null, font: '', fillStyle: '', strokeStyle: '',
    lineWidth: 1, textAlign: 'left', textBaseline: 'alphabetic',
    globalAlpha: 1, globalCompositeOperation: 'source-over',
    save() {}, restore() {}, scale() {}, rotate() {}, translate() {}, transform() {},
    setTransform() {}, resetTransform() {}, beginPath() {}, closePath() {},
    moveTo() {}, lineTo() {}, arc() {}, arcTo() {}, rect() {}, quadraticCurveTo() {},
    bezierCurveTo() {}, fill() {}, stroke() {}, clip() {},
    fillRect() {}, strokeRect() {}, clearRect() {},
    fillText() {}, strokeText() {}, drawImage() {},
    measureText: t => ({ width: String(t).length * 8 }),
    createLinearGradient: () => ({ addColorStop() {} }),
    createRadialGradient: () => ({ addColorStop() {} }),
    createPattern: () => ({}),
    getImageData: (x, y, sw = 1, sh = 1) => ({ width: sw, height: sh, data: new Uint8ClampedArray(sw * sh * 4) }),
    putImageData() {}, createImageData: (sw = 1, sh = 1) => ({ width: sw, height: sh, data: new Uint8ClampedArray(sw * sh * 4) }),
    setLineDash() {}, getLineDash: () => [], isPointInPath: () => false
  }
  w.HTMLCanvasElement.prototype.getContext = function () {
    return Object.assign(Object.create(ctx2d), { canvas: this })
  }
  w.HTMLCanvasElement.prototype.toDataURL = () => 'data:image/png;base64,'

  if (typeof w.CanvasRenderingContext2D === 'undefined') {
    function CanvasRenderingContext2D() {}
    CanvasRenderingContext2D.prototype = ctx2d
    w.CanvasRenderingContext2D = CanvasRenderingContext2D
  }
  if (typeof w.Path2D === 'undefined') {
    w.Path2D = function Path2D() {}
  }
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

function txt(doc) {
  return (doc.querySelector('#app') || doc.body).textContent.replace(/\s+/g, ' ').trim()
}

function shot(doc, label) {
  const t = txt(doc)
  console.log('\n===== ' + label + ' =====')
  console.log('uni-view=' + doc.querySelectorAll('uni-view').length +
    ' uni-image=' + doc.querySelectorAll('uni-image').length +
    ' uni-tabbar=' + doc.querySelectorAll('uni-tabbar').length +
    ' textLen=' + t.length)
  console.log('hash=' + doc.defaultView.location.hash)
  console.log('---- 可见文本 ----')
  console.log(t.slice(0, 1800))
  return t
}

function findByText(doc, sel, kw) {
  return [...doc.querySelectorAll(sel)].filter(e => (e.textContent || '').includes(kw))
}

function clickDeepest(doc, kw, sel = 'uni-view,uni-text,uni-button') {
  const hits = findByText(doc, sel, kw)
  if (!hits.length) return null
  const el = hits[hits.length - 1]
  const w = doc.defaultView
  const touch = { identifier: 0, target: el, clientX: 10, clientY: 10, pageX: 10, pageY: 10, screenX: 10, screenY: 10 }
  for (const type of ['touchstart', 'touchend', 'click']) {
    const ev = doc.createEvent('Event')
    ev.initEvent(type, true, true)
    if (type.startsWith('touch')) {
      const list = type === 'touchend' ? [] : [touch]
      Object.defineProperty(ev, 'touches', { value: list })
      Object.defineProperty(ev, 'targetTouches', { value: list })
      Object.defineProperty(ev, 'changedTouches', { value: [touch] })
    }
    el.dispatchEvent(ev)
  }
  return el
}

;(async () => {
  const dom = await JSDOM.fromURL('http://127.0.0.1:8090/index.html', {
    resources: 'usable',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    virtualConsole: vc,
    beforeParse: polyfill
  })
  const w = dom.window
  const doc = w.document

  await sleep(7000)
  console.log('Vue=' + typeof w.Vue + ' uni=' + typeof w.uni +
    ' __uniConfig=' + typeof w.__uniConfig + ' __uniRoutes=' + typeof w.__uniRoutes)
  if (w.__uniConfig) {
    console.log('tabBar.list=' + JSON.stringify((w.__uniConfig.tabBar || {}).list?.map(i => i.text)))
  }

  // ① 首页
  const home = shot(doc, '① 首页 pages/index/index')
  const homeChecks = ['今日健康指导', '健康管理服务包', '高血压调理计划', '高血糖调理计划', '699', '899', '首页', '消息', '我的']
  console.log('---- 首页关键词 ----')
  homeChecks.forEach(k => console.log((home.includes(k) ? '[OK]  ' : '[MISS]') + ' ' + k))

  // ② 点击高血压服务包 -> 服务详情
  clickDeepest(doc, '高血压调理计划')
  await sleep(2500)
  if (!w.location.hash.includes('service')) {
    w.location.hash = '#/pages/service/detail?key=hbp'
    await sleep(2500)
  }
  const detail = shot(doc, '② 服务详情 pages/service/detail')
  ;['高血压', '699', '立即购买', '原价'].forEach(k => console.log((detail.includes(k) ? '[OK]  ' : '[MISS]') + ' ' + k))

  // ③ 点击购买 -> 支付页
  clickDeepest(doc, '购买')
  await sleep(3000)
  const pay = shot(doc, '③ 支付 pages/pay/pay')

  // ④ 确认支付
  clickDeepest(doc, '支付')
  await sleep(6000)
  const paid = shot(doc, '④ 支付结果 / 跳转后')

  // ⑤ 我的权益（继续留在权益页，点击「立即使用」触发加企微 → 对话）
  const rights = shot(doc, '⑤ 我的权益 pages/rights/rights')
  ;['立即使用', '有效期'].forEach(k => console.log((rights.includes(k) ? '[OK]  ' : '[MISS]') + ' ' + k))

  // ⑥ 点击「立即使用」-> 加企业微信弹层
  clickDeepest(doc, '立即使用')
  await sleep(2000)
  shot(doc, '⑥ 加企业微信弹层')

  // ⑦ 点击「已保存二维码，添加好友」-> 加好友动画 -> 「开始首次问询」
  clickDeepest(doc, '添加好友')
  await sleep(9000)
  shot(doc, '⑦ 加企微完成（已添加成功）')

  clickDeepest(doc, '开始首次问询')
  await sleep(9000)
  const chat = shot(doc, '⑧ 对话首次问询 pages/chat/chat')
  ;['健康管理师', '问询', '第'].forEach(k => console.log((chat.includes(k) ? '[OK]  ' : '[--]  ') + ' ' + k))

  // ⑧-2 连续回答问询
  for (let i = 1; i <= 5; i++) {
    const opts = [...doc.querySelectorAll('uni-view')]
      .filter(e => e.className && String(e.className).includes('opt') && !e.querySelector('uni-view'))
    if (!opts.length) { console.log('第' + i + '轮：未找到选项元素'); break }
    const el = opts[0]
    const t = doc.createEvent('Event'); t.initEvent('click', true, true)
    el.dispatchEvent(t)
    await sleep(4000)
    console.log('第' + i + '轮已答：' + (el.textContent || '').trim().slice(0, 30))
  }
  await sleep(6000)
  const report = shot(doc, '⑨ 问询完成 / 分型报告')
  ;['危', '报告', '方案'].forEach(k => console.log((report.includes(k) ? '[OK]  ' : '[--]  ') + ' ' + k))

  // ⑧ 消息页（用 uni API 跳转，直改 hash 会被 uni router 忽略）
  w.uni.switchTab({ url: '/pages/message/message' })
  await sleep(3000)
  const msg = shot(doc, '⑧ 消息 pages/message/message')
  ;['购买', '时间线', '未读'].forEach(k => console.log((msg.includes(k) ? '[OK]  ' : '[--]  ') + ' ' + k))

  // ⑨ 我的
  w.uni.switchTab({ url: '/pages/mine/mine' })
  await sleep(3000)
  const mine = shot(doc, '⑨ 我的 pages/mine/mine')
  ;['个人资料', '我的订单', '我的权益', '用户协议'].forEach(k => console.log((mine.includes(k) ? '[OK]  ' : '[MISS]') + ' ' + k))

  // ⑩ 我的订单
  w.uni.navigateTo({ url: '/pages/mine/orders' })
  await sleep(3000)
  shot(doc, '⑩ 我的订单 pages/mine/orders')

  if (errs.length) {
    console.log('\n===== 运行时错误 (前 20 条) =====')
    errs.slice(0, 20).forEach(e => console.log(e))
  } else {
    console.log('\n运行时无错误')
  }
  w.close()
  process.exit(0)
})().catch(e => { console.error('FATAL', e); process.exit(1) })
