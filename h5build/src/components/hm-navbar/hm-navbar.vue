<template>
  <view>
    <!-- 导航栏在文档流中，按 uni-app 推荐方案实现：
         使用 position: static，导航栏作为页面内容的一部分，
         会跟随页面自然向上滚动消失，不占据视口固定位置 -->
    <view
      class="nav nav--block"
      :style="{ background: bgColor, color: textColor }"
    >
      <view class="nav__bar">
        <view class="nav__left" @tap="onBack">
          <text v-if="showBack" class="nav__back">‹</text>
        </view>
        <text class="nav__title ellipsis">{{ title }}</text>
        <view class="nav__right"><slot name="right"></slot></view>
      </view>
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
    backTo: { type: String, default: '' }
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
/* block 模式：导航栏在文档流中，随页面内容自然滚动（uni-app 推荐方案） */
.nav--block {
  position: static;
  width: 100%;
  padding-top: var(--status-bar-height);
}

.nav__bar {
  min-height: $size-header-height;
  display: flex;
  align-items: center;
  padding: 0 $space-3;
}

.nav__left,
.nav__right {
  min-width: $size-avatar-lg;
  width: auto;
  display: flex;
  align-items: center;
}

.nav__right {
  justify-content: flex-end;
  flex-shrink: 0;
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
