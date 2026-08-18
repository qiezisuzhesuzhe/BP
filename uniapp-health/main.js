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

  // H5：加载国内可达 CDN（BootCDN）托管的 Font Awesome 6 图标字体，
  // 避免 emoji 在部分系统（如 Windows）渲染为方框。
  const fa = document.createElement('link')
  fa.rel = 'stylesheet'
  fa.href = 'https://cdn.bootcdn.net/ajax/libs/font-awesome/6.4.2/css/all.min.css'
  document.head.appendChild(fa)
}

Vue.config.productionTip = false
Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()
