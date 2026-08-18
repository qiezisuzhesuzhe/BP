import Vue from 'vue'
import App from './App'
import store from './store'

// H5：加载国内可达 CDN（BootCDN）托管的 Font Awesome 6 图标字体，
// 避免 emoji 在部分系统（如 Windows）渲染为方框。
// 小程序端无 document，不执行。
if (typeof document !== 'undefined') {
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = 'https://cdn.bootcdn.net/ajax/libs/font-awesome/6.4.2/css/all.min.css'
  document.head.appendChild(link)
}

Vue.config.productionTip = false
Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()
