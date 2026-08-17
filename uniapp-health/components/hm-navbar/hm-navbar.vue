<template>
  <view class="nav" :style="{ background: bgColor, color: textColor }">
    <view class="nav__status" :style="{ height: statusBarHeight + 'px' }"></view>
    <view class="nav__bar">
      <view class="nav__left" @tap="onBack">
        <text v-if="showBack" class="nav__back">‹</text>
      </view>
      <text class="nav__title ellipsis">{{ title }}</text>
      <view class="nav__right"><slot name="right"></slot></view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'hm-navbar',
  props: {
    title: { type: String, default: '' },
    showBack: { type: Boolean, default: true },
    bgColor: { type: String, default: 'transparent' },
    textColor: { type: String, default: '#1a2b2c' },
    backTo: { type: String, default: '' }
  },
  data() {
    return { statusBarHeight: 20 }
  },
  created() {
    try {
      const info = uni.getSystemInfoSync()
      this.statusBarHeight = info.statusBarHeight || 20
    } catch (e) {}
  },
  methods: {
    onBack() {
      if (!this.showBack) return
      if (this.backTo) {
        uni.reLaunch({ url: this.backTo })
        return
      }
      const pages = getCurrentPages()
      if (pages.length > 1) {
        uni.navigateBack()
      } else {
        uni.reLaunch({ url: '/pages/index/index' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.nav {
  position: sticky;
  top: 0;
  z-index: 90;
}

.nav__bar {
  height: 88rpx;
  display: flex;
  align-items: center;
  padding: 0 20rpx;
}

.nav__left,
.nav__right {
  width: 120rpx;
  display: flex;
  align-items: center;
}

.nav__right {
  justify-content: flex-end;
}

.nav__back {
  font-size: 60rpx;
  line-height: 60rpx;
  width: 60rpx;
  text-align: center;
  font-weight: 300;
}

.nav__title {
  flex: 1;
  text-align: center;
  font-size: 32rpx;
  font-weight: 600;
  letter-spacing: 1rpx;
}
</style>
