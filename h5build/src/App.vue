<script>
import { getBandServer, setBandServer } from '@/common/band.js'

export default {
  onLaunch() {
    // #ifndef H5
    // APP / 小程序启动阶段：检查后端基址是否已经配置，保证真机打包后能立刻知道"数据链路是否打通"
    try {
      const base = getBandServer()
      if (!base) {
        // 开发期没有配置公网域名时：给出明确 toast 提示 + 临时设置（便于调试）
        // 正式发布前：务必把 common/band.js 的 BAND_SERVER_DEFAULT_APP 设置为 HTTPS 公网域名。
        uni.showToast({
          title: '请在设置页配置后端地址（BAND_SERVER）',
          icon: 'none',
          duration: 3500
        })
      }
      // APP 端需要把 CDN 图标库本地化时，可在此把静态资源路径改写为 plus.io.convertLocalFileSystemURL 的目标路径
    } catch (e) {
      // ignore
    }
    // #endif
  },
  onShow() {},
  // 暴露给"设置页/开发者调试页"配置后端地址用
  methods: {
    setBandServer,
    getBandServer
  }
}
</script>

<style lang="scss">
/* uni-app 全局说明：
   - 所有页面均为 navigationStyle: custom，使用自定义 hm-navbar
   - hm-navbar 采用 position: static（文档流内），导航栏随页面内容自然向上滚动消失
   - 顶部安全区 padding-top: var(--status-bar-height) 由 hm-navbar 内部处理
   - 不在 uni-page-body 叠加 padding-top，避免与 navbar 内部占位双重下移 */

page {
  background: $bg-page-base;
  color: $text-primary;
  font-family: $font-family-base;
  font-size: $font-size-sm;
  line-height: $line-height-relaxed;
}

view,
text,
scroll-view,
button,
input,
textarea,
image {
  box-sizing: border-box;
}

/* uni-app H5 中 <view> 编译为自定义元素 <uni-view>，
   浏览器默认 display: inline 会导致容器 padding/margin 失效，
   这里统一恢复为块级，避免页面区块错位、卡片贴边 */
view {
  display: block;
}

.hm-page {
  min-height: 100vh;
  background: $bg-page-base;
  background-image: $bg-page;
  background-repeat: no-repeat;
  /* 背景固定于视口：渐变铺满视口，页面滚动/变长时背景不随之移动 */
  background-size: 100% 100%;
  background-attachment: fixed;
}

.hm-card {
  background: $bg-surface;
  border-radius: $radius-card;
  box-shadow: $shadow-sm;
}

.hm-sec-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-heavy;
  line-height: $line-height-tight;
  color: $text-primary;
  letter-spacing: 1rpx;
}

.hm-sec-sub {
  font-size: $font-size-xs;
  color: $text-muted;
  margin-top: $space-2;
}

.hm-divider {
  height: 1rpx;
  background: $border-subtle;
}

.hm-safe-bottom {
  height: calc(env(safe-area-inset-bottom) + #{$space-3});
}

.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.ellipsis-2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
