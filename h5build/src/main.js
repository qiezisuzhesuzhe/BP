import Vue from 'vue'
import App from './App'
import store from './store'

// H5：构建产物中框架基础样式（uni-tabbar 等）被提取为 static/index.css，
// 但生成的 index.html 未包含 <link> 引用，此处运行时补挂，否则底部导航等框架样式缺失。
// 小程序端无 document，不执行。
if (typeof document !== 'undefined') {
  const base = document.createElement('link')
  base.rel = 'stylesheet'
  base.href = './static/index.css'
  document.head.appendChild(base)

  // H5：加载随产物发布的本地 Font Awesome 6 图标字体，
  // 避免 emoji 在部分系统（如 Windows）渲染为方框。
  // 曾用外网 CDN（BootCDN），但 CDN 不可达时 fa-* 类名会裸奔成可见文字
  // （如页面直接显示 "fa-solid fa-stethoscope"），故改为本地引用，不依赖外网。
  const fa = document.createElement('link')
  fa.rel = 'stylesheet'
  fa.href = './static/fontawesome/css/all.min.css'
  document.head.appendChild(fa)

  // H5：加载本地 jsQR 扫码库（设备页真实相机扫码使用），
  // 随构建产物一同发布，不依赖外网 CDN 可达性。
  const jsqr = document.createElement('script')
  jsqr.src = './static/lib/jsqr.js'
  document.head.appendChild(jsqr)
}

Vue.config.productionTip = false
Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()
