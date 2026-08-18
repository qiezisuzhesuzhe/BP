<script>
export default {
  onLaunch() {
    // 兼容小程序/H5：启动时同步一次未读角标
    this.syncBadge()
  },
  onShow() {
    this.syncBadge()
  },
  methods: {
    syncBadge() {
      const n = this.$store.getters.unreadCount
      if (n > 0) {
        uni.setTabBarBadge({ index: 1, text: n > 99 ? '99+' : '' + n, fail() {} })
      } else {
        uni.removeTabBarBadge({ index: 1, fail() {} })
      }
    }
  }
}
</script>

<style lang="scss">
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

.hm-page {
  min-height: 100vh;
  background: $bg-page-base;
  background-image: $bg-page;
  background-repeat: no-repeat;
  background-size: 100% $bg-page-height;
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
  margin-top: $space-1;
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
