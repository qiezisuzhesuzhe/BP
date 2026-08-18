<template>
  <view class="nav" :class="{ 'nav--static': !sticky }" :style="{ background: bgColor, color: textColor }">
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
    textColor: { type: String, default: '#1a2a3c' },
    backTo: { type: String, default: '' },
    sticky: { type: Boolean, default: true }
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
  z-index: $z-nav;
}

.nav--static {
  position: static;
}

.nav__bar {
  min-height: $size-header-height;
  display: flex;
  align-items: center;
  padding: 0 $space-3;
}

.nav__left,
.nav__right {
  width: $size-avatar-lg;
  display: flex;
  align-items: center;
}

.nav__right {
  justify-content: flex-end;
}

.nav__back {
  width: $size-back-subpage-back;
  height: $size-back-subpage-back;
  line-height: $size-back-subpage-back;
  border-radius: $radius-full;
  background: $back-subpage-back-bg;
  color: $back-subpage-back-text;
  box-shadow: $shadow-sm;
  font-size: $font-size-xl;
  text-align: center;
  font-weight: $font-weight-regular;
}

.nav__title {
  flex: 1;
  text-align: center;
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  letter-spacing: 1rpx;
}
</style>
