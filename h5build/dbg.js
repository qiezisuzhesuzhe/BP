const { JSDOM, VirtualConsole } = require('jsdom')
const vc = new VirtualConsole()
vc.on('jsdomError', e => console.log('[jsdomError] ' + (e.stack||e.message).split('\n').slice(0,6).join('\n')))
vc.on('error', (...a) => console.log('[error] ' + a.join(' ').slice(0,400)))
vc.on('warn', (...a) => console.log('[warn] ' + a.join(' ').slice(0,200)))
const sleep = ms => new Promise(r => setTimeout(r, ms))
function polyfill(w) {
  const ctx = { canvas:null, save(){},restore(){},scale(){},rotate(){},translate(){},transform(){},setTransform(){},resetTransform(){},clearRect(){},fillRect(){},strokeRect(){},beginPath(){},closePath(){},moveTo(){},lineTo(){},bezierCurveTo(){},quadraticCurveTo(){},arc(){},arcTo(){},ellipse(){},rect(){},fill(){},stroke(){},clip(){},isPointInPath:()=>false,fillText(){},strokeText(){},measureText:()=>({width:0}),drawImage(){},createLinearGradient:()=>({addColorStop(){}}),createRadialGradient:()=>({addColorStop(){}}),createPattern:()=>null,getImageData:()=>({data:new Uint8ClampedArray(4)}),putImageData(){},createImageData:()=>({data:new Uint8ClampedArray(4)}),setLineDash(){},getLineDash:()=>[],backingStorePixelRatio:1 }
  w.HTMLCanvasElement.prototype.getContext = function(){ ctx.canvas=this; return ctx }
  w.HTMLCanvasElement.prototype.toDataURL = () => 'data:image/png;base64,'
  w.CanvasRenderingContext2D = function(){}; w.CanvasRenderingContext2D.prototype = ctx
  w.Path2D = function(){}
}
;(async () => {
  const dom = await JSDOM.fromURL('http://127.0.0.1:8090/index.html', { resources:'usable', runScripts:'dangerously', pretendToBeVisual:true, virtualConsole:vc, beforeParse:polyfill })
  const w = dom.window, doc = w.document
  for (let i=1;i<=8;i++) {
    await sleep(3000)
    const st=[...doc.querySelectorAll('style')].map(s=>s.textContent).join('').length
    console.log(`t=${i*3}s  style=${doc.querySelectorAll('style').length}/${st}B  uni-view=${doc.querySelectorAll('uni-view').length}  hero=${doc.querySelector('.hero')?'Y':'N'}  bodyLen=${doc.body.innerHTML.length}`)
  }
  console.log('--- #app 内 HTML 前 600 字 ---')
  console.log(doc.querySelector('#app').innerHTML.slice(0,600))
  console.log('--- window.__uniConfig.tabBar ---')
  console.log(JSON.stringify((w.__uniConfig&&w.__uniConfig.tabBar||{}).list))
  process.exit(0)
})()
