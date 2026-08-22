// H5 端所有后端请求都走同源相对路径（common/band.js 的 bandApi 在 H5 恒返回 '' + path）。
// dev server 与 band-server(8091) 不同端口，必须把接口路径代理过去，
// 否则 /api/* 会命中 SPA history fallback 返回 200 + index.html，
// 被前端误判成「平台明确答复查不到该设备」。
const BAND_SERVER = process.env.BAND_SERVER || 'http://127.0.0.1:8091'

module.exports = {
  productionSourceMap: false,
  publicPath: './',
  devServer: {
    proxy: {
      '/api': { target: BAND_SERVER, changeOrigin: true },
      '/pb': { target: BAND_SERVER, changeOrigin: true },
      '/alarm': { target: BAND_SERVER, changeOrigin: true },
      '/call_log': { target: BAND_SERVER, changeOrigin: true },
      '/deviceinfo': { target: BAND_SERVER, changeOrigin: true },
      '/status': { target: BAND_SERVER, changeOrigin: true },
      '/health/sleep': { target: BAND_SERVER, changeOrigin: true }
    }
  }
}
