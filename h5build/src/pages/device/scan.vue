<template>
  <view class="scan-page">
    <hm-navbar title="扫描设备" bg-color="transparent" text-color="#ffffff"></hm-navbar>

    <view class="scan-frame">
      <view class="scan-frame__corner scan-frame__corner--tl"></view>
      <view class="scan-frame__corner scan-frame__corner--tr"></view>
      <view class="scan-frame__corner scan-frame__corner--bl"></view>
      <view class="scan-frame__corner scan-frame__corner--br"></view>
      <view class="scan-line"></view>
      <view class="scan-frame__inner">
        <text class="fa-solid fa-qrcode scan-frame__icon"></text>
      </view>
    </view>
    <text class="scan-tip">将设备机身上的二维码对准扫描框</text>

    <view class="scan-btn" @tap="simulate">
      <text class="fa-solid fa-qrcode scan-btn__icon"></text>
      <text class="scan-btn__t">模拟扫描识别</text>
    </view>

    <!-- 识别结果确认 -->
    <view v-if="result" class="sheet">
      <view class="sheet__mask" @tap="result = null"></view>
      <view class="sheet__card">
        <text class="sheet__t">识别到设备</text>
        <view class="sheet__dev">
          <view class="sheet__dev-icon" :style="{ background: result.accentSoft }">
            <text class="sheet__dev-icon-t" :class="result.icon" :style="{ color: result.color }"></text>
          </view>
          <view class="sheet__dev-main">
            <text class="sheet__dev-name">{{ result.name }}</text>
            <text class="sheet__dev-sn">{{ result.model }}</text>
            <text class="sheet__dev-sn">SN：{{ fakeSn }}</text>
          </view>
        </view>
        <view class="sheet__btns">
          <view class="sheet__btn sheet__btn--cancel" @tap="result = null">取消</view>
          <view class="sheet__btn" :style="{ background: result.color }" @tap="confirm">
            <text class="sheet__btn-t">确认添加</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { DEVICE_TYPES } from '@/common/mock.js'

let scanSeq = 0

export default {
  data() {
    return {
      types: DEVICE_TYPES,
      result: null,
      fakeSn: ''
    }
  },
  methods: {
    // 原型模拟扫码：loading 后随机识别一种设备（依次轮换 4 种，方便体验）
    simulate() {
      if (this.result) return
      uni.showLoading({ title: '识别中…', mask: true })
      setTimeout(() => {
        uni.hideLoading()
        const type = this.types[scanSeq % this.types.length]
        scanSeq++
        this.fakeSn = 'AK-' + String(100000 + Math.floor(Math.random() * 899999))
        this.result = type
      }, 1200)
    },
    async confirm() {
      const type = this.result
      this.result = null
      const dev = await this.$store.dispatch('addDevice', { typeKey: type.key, sn: this.fakeSn })
      uni.showToast({ title: '设备添加成功', icon: 'success' })
      setTimeout(() => {
        uni.redirectTo({ url: '/pages/device/detail?id=' + dev.id })
      }, 600)
    }
  }
}
</script>

<style lang="scss" scoped>
.scan-page {
  min-height: 100vh;
  background: #0f1f2e;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.scan-frame {
  position: relative;
  margin-top: $space-12;
  width: 520rpx;
  height: 520rpx;
}

.scan-frame__inner {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-card;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);
}

.scan-frame__icon {
  font-size: 160rpx;
  color: rgba(255, 255, 255, 0.18);
}

.scan-frame__corner {
  position: absolute;
  width: 64rpx;
  height: 64rpx;
  border: 8rpx solid $brand-primary;
  z-index: 2;
}

.scan-frame__corner--tl {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
  border-radius: $radius-sm 0 0 0;
}

.scan-frame__corner--tr {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
  border-radius: 0 $radius-sm 0 0;
}

.scan-frame__corner--bl {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
  border-radius: 0 0 0 $radius-sm;
}

.scan-frame__corner--br {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
  border-radius: 0 0 $radius-sm 0;
}

.scan-line {
  position: absolute;
  left: 24rpx;
  right: 24rpx;
  top: 16rpx;
  height: 4rpx;
  border-radius: 2rpx;
  background: linear-gradient(90deg, transparent, $brand-primary, transparent);
  box-shadow: 0 0 24rpx rgba(125, 212, 188, 0.9);
  animation: scan-move 2.4s ease-in-out infinite;
}

@keyframes scan-move {
  0% {
    top: 16rpx;
    opacity: 0.4;
  }
  50% {
    top: 488rpx;
    opacity: 1;
  }
  100% {
    top: 16rpx;
    opacity: 0.4;
  }
}

.scan-tip {
  margin-top: $space-6;
  font-size: $font-size-xs;
  color: rgba(255, 255, 255, 0.72);
  letter-spacing: 2rpx;
}

.scan-btn {
  margin-top: $space-8;
  display: flex;
  align-items: center;
  background: $brand-primary;
  border-radius: $radius-full;
  padding: $space-3 $space-8;
  box-shadow: $shadow-lg;
}

.scan-btn__icon {
  color: $text-primary;
  font-size: $font-size-md;
  margin-right: $space-2;
}

.scan-btn__t {
  color: $text-primary;
  font-size: $font-size-sm;
  font-weight: $font-weight-bold;
}

.sheet {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: $z-modal;
  display: flex;
  align-items: flex-end;
}

.sheet__mask {
  position: absolute;
  inset: 0;
  background: rgba(15, 31, 46, 0.55);
}

.sheet__card {
  position: relative;
  width: 100%;
  background: $bg-surface;
  border-radius: $radius-lg $radius-lg 0 0;
  padding: $space-5 $space-4 calc(env(safe-area-inset-bottom) + #{$space-5});
}

.sheet__t {
  display: block;
  font-size: $font-size-md;
  font-weight: $font-weight-heavy;
  color: $text-primary;
  text-align: center;
}

.sheet__dev {
  margin-top: $space-4;
  display: flex;
  align-items: center;
  background: $bg-section;
  border-radius: $radius-card-child;
  padding: $space-3;
}

.sheet__dev-icon {
  width: $size-icon-xl;
  height: $size-icon-xl;
  border-radius: $radius-card-child;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sheet__dev-icon-t {
  font-size: $font-size-xl;
}

.sheet__dev-main {
  flex: 1;
  padding-left: $space-3;
}

.sheet__dev-name {
  display: block;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.sheet__dev-sn {
  display: block;
  font-size: $font-size-2xs;
  color: $text-muted;
  margin-top: $space-1;
}

.sheet__btns {
  margin-top: $space-5;
  display: flex;
}

.sheet__btn {
  flex: 1;
  height: $size-input-height;
  border-radius: $radius-full;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-size-sm;
  font-weight: $font-weight-bold;
  color: $text-inverse;
}

.sheet__btn--cancel {
  background: $bg-section;
  color: $text-secondary;
  margin-right: $space-3;
}

.sheet__btn-t {
  color: $text-inverse;
}
</style>
