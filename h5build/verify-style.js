const { JSDOM, VirtualConsole } = require('jsdom')

const jsdomErrors = []
const vc = new VirtualConsole()
vc.on('jsdomError', (e) => jsdomErrors.push(e.message))

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function polyfill(w) {
  const ctx = {
    canvas: null, save() {}, restore() {}, scale() {}, rotate() {}, translate() {},
    transform() {}, setTransform() {}, resetTransform() {}, clearRect() {}, fillRect() {},
    strokeRect() {}, beginPath() {}, closePath() {}, moveTo() {}, lineTo() {},
    bezierCurveTo() {}, quadraticCurveTo() {}, arc() {}, arcTo() {}, ellipse() {},
    rect() {}, fill() {}, stroke() {}, clip() {}, isPointInPath: () => false,
    fillText() {}, strokeText() {}, measureText: () => ({ width: 0 }),
    drawImage() {}, createLinearGradient: () => ({ addColorStop() {} }),
    createRadialGradient: () => ({ addColorStop() {} }),
    createPattern: () => null, getImageData: () => ({ data: new Uint8ClampedArray(4) }),
    putImageData() {}, createImageData: () => ({ data: new Uint8ClampedArray(4) }),
    setLineDash() {}, getLineDash: () => [], backingStorePixelRatio: 1
  }
  w.HTMLCanvasElement.prototype.getContext = function () { ctx.canvas = this; return ctx }
  w.HTMLCanvasElement.prototype.toDataURL = () => 'data:image/png;base64,'
  w.CanvasRenderingContext2D = function () {}
  w.CanvasRenderingContext2D.prototype = ctx
  w.Path2D = function () {}
  w.matchMedia = function (q) {
    return {
      media: q || '',
      matches: false,
      onchange: null,
      addListener() {}, removeListener() {},
      addEventListener() {}, removeEventListener() {},
      dispatchEvent() { return false }
    }
  }
  if (!w.ResizeObserver) {
    w.ResizeObserver = function () {
      return { observe() {}, unobserve() {}, disconnect() {} }
    }
  }
  if (!w.IntersectionObserver) {
    w.IntersectionObserver = function () {
      return { observe() {}, unobserve() {}, disconnect() {}, takeRecords: () => [] }
    }
  }
}

function cssOf(doc) {
  return [...doc.querySelectorAll('style')].map((s) => s.textContent).join('\n')
}

function inlineOf(doc) {
  return [...doc.querySelectorAll('[style]')].map((e) => e.getAttribute('style')).join('\n')
}

function hexToRgb(h) {
  const n = parseInt(h, 16)
  return 'rgb(' + ((n >> 16) & 255) + ', ' + ((n >> 8) & 255) + ', ' + (n & 255) + ')'
}

function computedOf(doc, w) {
  const out = []
  for (const el of doc.querySelectorAll('[style]')) {
    const s = w.getComputedStyle(el)
    out.push(s.backgroundColor, s.color, s.backgroundImage, s.borderColor)
  }
  return out.join('\n')
}

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '')
}

const TOKENS = ['7dd4bc', '4ab89e', '389a82', 'd4f5ee', '61e0e5', 'd8f8fa', '84e8c2',
  'ddf7ed', '8dcdd8', 'e2f2f6', 'e8c4a4', 'fdf4ed', '27ae60', 'f2c94c',
  'eb5757', 'f15533', 'f3f3f3', 'edf5f2', 'f2f7fa', '1a2a3c', '334155',
  '64748b', '94a3b8', 'c6d2de']

const inlineSeen = []

function report(doc, w, label, keys) {
  const all = cssOf(doc)
  inlineSeen.push(inlineOf(doc), computedOf(doc, w))
  const ph = (all.match(/%\?[0-9.]+\?%/g) || []).length
  const rpx = (stripComments(all).match(/[0-9]rpx/g) || []).length
  const px = (all.match(/:\s*[0-9.]+px/g) || []).length
  console.log(`\n───── ${label} ─────`)
  console.log(`  <style>=${doc.querySelectorAll('style').length}  CSS=${all.length}B  残留占位符=${ph}  残留rpx=${rpx}  已换算px声明=${px}`)
  let ok = 0
  for (const k of keys) {
    const esc = k.replace(/([.*+?^${}()|[\]\\])/g, '\\$1')
    const scoped = (all.match(new RegExp('\\.' + esc + '\\[data-v-[a-z0-9]{8}\\]', 'g')) || []).length
    const global = (all.match(new RegExp('\\.' + esc + '(?![\\w-])[^{]{0,30}\\{', 'g')) || []).length
    const hits = Math.max(scoped, global)
    const el = doc.querySelector('.' + k)
    let cs = ''
    if (el) {
      const s = w.getComputedStyle(el)
      const bits = []
      const pick = ['padding', 'borderRadius', 'fontSize', 'height', 'backgroundColor']
      for (const p of pick) {
        const v = s[p]
        if (v && v !== '' && v !== 'rgba(0, 0, 0, 0)' && v !== '0px' && v !== 'normal') {
          bits.push(p + '=' + v)
        }
      }
      cs = bits.slice(0, 3).join('  ')
    }
    if (hits > 0 && el) ok++
    const flag = hits > 0 && el ? 'OK  ' : (el ? '样式缺 ' : '未渲染')
    console.log(`    ${flag} ${k.padEnd(18)} 规则=${String(hits).padStart(2)}  ${cs}`)
  }
  console.log(`  ▸ ${label.slice(0, 4)} 类名样式命中 ${ok}/${keys.length}`)
  return { ph, rpx, px, size: all.length, ok, total: keys.length }
}

async function waitFor(fn, timeout = 25000, step = 300) {
  const t0 = Date.now()
  while (Date.now() - t0 < timeout) {
    try { if (fn()) return true } catch (e) {}
    await sleep(step)
  }
  return false
}

async function waitStyleGrow(doc, before) {
  await waitFor(() => cssOf(doc).length > before)
  await sleep(1200)
}

async function nav(doc, w, url) {
  const before = cssOf(doc).length
  w.uni.navigateTo({ url })
  await waitStyleGrow(doc, before)
}
async function tab(doc, w, url) {
  const before = cssOf(doc).length
  w.uni.switchTab({ url })
  await waitStyleGrow(doc, before)
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

  const booted = await waitFor(() => w.uni && w.__uniRoutes && cssOf(doc).length > 2000 && doc.querySelector('.hero'), 40000)
  console.log('启动完成=' + booted + '  uni=' + typeof w.uni + ' __uniRoutes=' + typeof w.__uniRoutes)
  await sleep(1500)

  const stats = []

  // 先播种订单 + 权益，保证首页时间轴（仅购买后显示）与后续页面可渲染
  let store = null
  for (const sel of ['uni-app', 'uni-page', 'body > *']) {
    for (const el of doc.querySelectorAll(sel)) {
      const vm = el.__vue__
      if (vm && vm.$store) { store = vm.$store; break }
      if (vm && vm.$root && vm.$root.$store) { store = vm.$root.$store; break }
    }
    if (store) break
  }
  console.log('store 获取: ' + (store ? 'OK' : 'FAIL'))
  const order = await store.dispatch('createOrder', 'hbp3m')
  await store.dispatch('payOrder', order.orderNo)
  await sleep(1500)

  stats.push(report(doc, w, '① 首页 pages/index/index',
    ['hm-page', 'hero', 'hero__hello', 'hero__stat-v', 'hero__bell', 'day-switch', 'hm-sec-title', 'wrap', 'tl__action', 'tl__cover',
      'rights', 'rights__head', 'rights__level', 'rights__date', 'rights__pts', 'rights__grid', 'rights__item', 'rights__item-badge']))

  await nav(doc, w, '/pages/service/detail?id=hbp3m')
  stats.push(report(doc, w, '② 服务详情 pages/service/detail',
    ['buybar', 'buybar__btn', 'buybar__price', 'buybar__origin', 'card', 'ds__img', 'faq']))

  await nav(doc, w, '/pages/pay/pay?orderNo=' + order.orderNo)
  stats.push(report(doc, w, '③ 支付 pages/pay/pay',
    ['hm-page', 'card', 'bar-holder', 'hm-sec-title', 'foot-tip']))

  await nav(doc, w, '/pages/rights/rights')
  stats.push(report(doc, w, '④ 我的权益 pages/rights/rights',
    ['card', 'card__head', 'card__cta', 'card__rows', 'card__row-v', 'card__status', 'card__emoji', 'prog__fill']))

  const rightId = store.getters.activeRight ? store.getters.activeRight.id : ''
  await nav(doc, w, '/pages/rights/detail?id=' + rightId)
  stats.push(report(doc, w, '⑤ 权益详情 pages/rights/detail', ['hm-page', 'top', 'top__name']))

  await tab(doc, w, '/pages/message/message')
  stats.push(report(doc, w, '⑥ 消息 pages/message/message',
    ['hm-page', 'group', 'group__t', 'msg', 'msg__cat', 'msg__content', 'list']))

  await tab(doc, w, '/pages/mine/mine')
  stats.push(report(doc, w, '⑦ 我的 pages/mine/mine',
    ['hm-page', 'hm-card', 'cur', 'cur__name', 'cur__icon', 'foot__t', 'hm-sec-title']))

  await nav(doc, w, '/pages/mine/orders')
  stats.push(report(doc, w, '⑧ 我的订单 pages/mine/orders',
    ['hm-page', 'ord', 'ord__head', 'ord__price', 'ord__origin', 'ord__cta', 'tabs', 'tab__t']))

  await nav(doc, w, '/pages/mine/agreement')
  stats.push(report(doc, w, '⑨ 用户协议 pages/mine/agreement', ['hm-page']))

  // ── 设备功能验证 ──
  await tab(doc, w, '/pages/device/device')
  stats.push(report(doc, w, '⑩ 设备列表(空状态) pages/device/device',
    ['hm-page', 'wrap', 'empty', 'empty__icon', 'empty__t', 'empty__d', 'empty__btn']))

  const dev = await store.dispatch('addDevice', { typeKey: 'band', sn: 'AK-100001' })
  await sleep(800)
  stats.push(report(doc, w, '⑪ 设备列表(已添加) pages/device/device',
    ['hm-page', 'wrap', 'dev', 'dev__icon', 'dev__name', 'dev__sn', 'dev__status', 'add-bar', 'add-bar__t']))

  // 注：scan-line 仅在相机开启(camState==='on')时渲染，jsdom 无摄像头环境无法验证
  await nav(doc, w, '/pages/device/scan')
  stats.push(report(doc, w, '⑫ 扫码添加 pages/device/scan',
    ['scan-page', 'scan-frame', 'scan-frame__inner', 'scan-frame__icon', 'scan-tip', 'scan-btn', 'scan-btn__t']))

  // 触发模拟识别，验证底部确认弹层（沿 DOM 父链查找页面 vm）
  let scanVm = null
  let cursor = doc.querySelector('.scan-page')
  while (cursor && cursor !== doc.body && cursor !== doc) {
    if (cursor.__vue__ && typeof cursor.__vue__.simulate === 'function') { scanVm = cursor.__vue__; break }
    cursor = cursor.parentElement
  }
  if (!scanVm) {
    for (const el of doc.querySelectorAll('*')) {
      if (el.__vue__ && typeof el.__vue__.simulate === 'function') { scanVm = el.__vue__; break }
    }
  }
  if (scanVm) {
    scanVm.simulate()
    const sheetShown = await waitFor(() => doc.querySelector('.sheet'), 15000)
    console.log('\n───── ⑫b 扫码识别结果 ─────')
    console.log('  弹层渲染=' + sheetShown + ' 识别设备=' + (doc.querySelector('.sheet__dev-name') ? doc.querySelector('.sheet__dev-name').textContent : '—'))
    if (sheetShown) {
      stats.push(report(doc, w, '⑫b 识别结果弹层',
        ['sheet', 'sheet__card', 'sheet__dev', 'sheet__dev-icon', 'sheet__dev-name', 'sheet__btns', 'sheet__btn']))
    }
  } else {
    console.log('  未找到 scan 页 vm，跳过弹层验证')
  }

  await nav(doc, w, '/pages/device/detail?id=' + dev.id)
  stats.push(report(doc, w, '⑬ 设备详情 pages/device/detail',
    ['hm-page', 'dev-head', 'dev-head__icon', 'dev-head__name', 'dev-head__model', 'dev-head__status', 'grid', 'cell', 'cell__icon', 'cell__num', 'cell__label', 'unbind', 'foot-tip']))

  // 实时数据刷新验证：detail 页每 2s 轮询 updateDeviceData
  const nums = () => [...doc.querySelectorAll('.cell__num')].map((e) => e.textContent).join('|')
  const first = nums()
  await sleep(2600)
  const second = nums()
  console.log('\n───── ⑬b 实时数据刷新 ─────')
  console.log('  2.6s 后数值' + (first && second && first !== second ? '已更新 OK' : '未变化') + '  ' + first + ' → ' + second)
  console.log('  最近同步: ' + (doc.querySelector('.dev-head__sync') ? doc.querySelector('.dev-head__sync').textContent : '—'))
  // tabBar 第 4 个 tab 校验
  const tabItems = doc.querySelectorAll('.uni-tabbar__item')
  console.log('  tabBar 项数=' + tabItems.length + ' 标签=' + [...tabItems].map((i) => i.textContent.trim()).join('/'))

  const all = cssOf(doc)
  const decl = stripComments(all)
  const inline = inlineSeen.join('\n')
  const surface = (all + '\n' + inline).toLowerCase()
  const hitTokens = TOKENS.filter((t) => surface.includes(t) || surface.includes(hexToRgb(t)))
  const missTokens = TOKENS.filter((t) => !(surface.includes(t) || surface.includes(hexToRgb(t))))
  console.log('\n══════ 汇总 ══════')
  console.log('累计注入 <style>      : ' + doc.querySelectorAll('style').length)
  console.log('累计运行时 CSS 体积   : ' + all.length + ' B')
  console.log('残留占位符 %?n?%      : ' + (all.match(/%\?[0-9.]+\?%/g) || []).length)
  console.log('残留字面量 rpx(声明)  : ' + (decl.match(/[0-9]rpx/g) || []).length)
  console.log('残留字面量 rpx(含注释): ' + (all.match(/[0-9]rpx/g) || []).length)
  console.log('已换算 px 声明        : ' + (all.match(/:\s*[0-9.]+px/g) || []).length)
  console.log('设计令牌命中(CSS+内联): ' + hitTokens.length + '/' + TOKENS.length)
  if (missTokens.length) console.log('  未出现令牌          : ' + missTokens.map((t) => '#' + t).join(' '))
  const okSum = stats.reduce((a, s) => a + s.ok, 0)
  const totSum = stats.reduce((a, s) => a + s.total, 0)
  console.log('各页类名样式命中合计  : ' + okSum + '/' + totSum)
  console.log('upx2px(750)/(40)/(24) : ' + w.uni.upx2px(750) + ' / ' + w.uni.upx2px(40) + ' / ' + w.uni.upx2px(24))
  console.log('jsdomError 数         : ' + jsdomErrors.length)
  if (jsdomErrors.length) console.log(jsdomErrors.slice(0, 3).join('\n'))
  dom.window.close()
  process.exit(0)
})()
