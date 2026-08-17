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
  background: $warm-50;
  color: $ink-900;
  font-size: 28rpx;
  line-height: 1.6;
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
  background: $warm-50;
}

.hm-card {
  background: #fff;
  border-radius: $radius-md;
  box-shadow: $shadow-sm;
}

.hm-sec-title {
  font-size: 34rpx;
  font-weight: 700;
  color: $ink-900;
  letter-spacing: 1rpx;
}

.hm-sec-sub {
  font-size: 24rpx;
  color: $ink-500;
  margin-top: 6rpx;
}

.hm-divider {
  height: 1rpx;
  background: $warm-200;
}

.hm-safe-bottom {
  height: calc(env(safe-area-inset-bottom) + 24rpx);
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
