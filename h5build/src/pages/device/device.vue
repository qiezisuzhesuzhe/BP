<template>
  <view class="hm-page">
    <hm-navbar title="我的设备" :show-back="false" bg-color="transparent"></hm-navbar>

    <view class="wrap">
      <!-- 空状态：引导扫描添加 -->
      <view v-if="devices.length === 0" class="empty">
        <view class="empty__icon">
          <text class="fa-solid fa-microchip empty__icon-t"></text>
        </view>
        <text class="empty__t">暂无绑定设备</text>
        <text class="empty__d">扫描设备机身上的二维码，即可快速添加并开始同步健康数据</text>
        <view class="empty__btn" @tap="goScan">
          <text class="fa-solid fa-qrcode empty__btn-icon"></text>
          <text class="empty__btn-t">扫描二维码添加</text>
        </view>
      </view>

      <!-- 设备列表 -->
      <view v-for="dev in devices" :key="dev.id" class="dev" @tap="goDetail(dev.id)">
        <view class="dev__icon" :style="{ background: meta(dev).accentSoft }">
          <text class="dev__icon-t" :class="meta(dev).icon" :style="{ color: meta(dev).color }"></text>
        </view>
        <view class="dev__main">
          <text class="dev__name">{{ dev.name }}</text>
          <text class="dev__sn">{{ dev.model }} · {{ dev.sn }}</text>
          <text class="dev__sync">最近同步 {{ dev.lastSync }}</text>
        </view>
        <view class="dev__status" :class="{ 'dev__status--off': !dev.online }">
          <text class="dev__status-dot"></text>
          <text class="dev__status-t">{{ dev.online ? '在线' : '离线' }}</text>
        </view>
      </view>
    </view>

    <view v-if="devices.length > 0" class="hm-safe-bottom"></view>
    <view v-if="devices.length > 0" class="add-bar" @tap="goScan">
      <text class="fa-solid fa-qrcode add-bar__icon"></text>
      <text class="add-bar__t">扫描添加设备</text>
    </view>
  </view>
</template>

<script>
import { DEVICE_TYPES } from '@/common/mock.js'

export default {
  data() {
    return { timer: null }
  },
  computed: {
    devices() {
      return this.$store.getters.devices
    }
  },
  onShow() {
    this.syncAll()
    // 原型模拟：每 5 秒拉取一次设备最新数据
    this.timer = setInterval(() => this.syncAll(), 5000)
  },
  onHide() {
    this.clearTimer()
  },
  onUnload() {
    this.clearTimer()
  },
  methods: {
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    syncAll() {
      this.devices.forEach((d) => {
        this.$store.dispatch('updateDeviceData', d.id)
      })
    },
    meta(dev) {
      return DEVICE_TYPES.find((t) => t.key === dev.typeKey) || DEVICE_TYPES[0]
    },
    goDetail(id) {
      const dev = this.$store.getters.deviceById(id)
      if (dev && dev.typeKey === 'band-bp') {
        // 血压款手环：进入实时状态页（对接后端数据，每 1 分钟刷新）
        uni.navigateTo({ url: '/pages/band/status?id=' + id })
        return
      }
      uni.navigateTo({ url: '/pages/device/detail?id=' + id })
    },
    goScan() {
      uni.navigateTo({ url: '/pages/device/scan' })
    }
  }
}
</script>

<style lang="scss" scoped>
.empty {
  padding: $space-12 $space-6 $space-10;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.empty__icon {
  width: $size-avatar-lg;
  height: $size-avatar-lg;
  border-radius: $radius-full;
  background: $brand-soft;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: $shadow-md;
  margin-bottom: $space-4;
}

.empty__icon-t {
  font-size: $size-icon-lg;
  color: $icon-ink;
}

.empty__t {
  font-size: $font-size-md;
  font-weight: $font-weight-heavy;
  color: $text-primary;
  line-height: $line-height-tight;
}

.empty__d {
  display: block;
  font-size: $font-size-xs;
  color: $text-muted;
  line-height: $line-height-relaxed;
  margin-top: $space-2;
  max-width: 480rpx;
}

.empty__btn {
  margin-top: $space-5;
  display: flex;
  align-items: center;
  background: $brand-primary-active;
  border-radius: $radius-full;
  padding: $space-3 $space-6;
  box-shadow: $shadow-md;
}

.empty__btn-icon {
  color: $text-inverse;
  font-size: $font-size-sm;
  margin-right: $space-2;
}

.empty__btn-t {
  color: $text-inverse;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
}

.dev {
  display: flex;
  align-items: center;
  background: $bg-surface;
  border-radius: $radius-card-child;
  box-shadow: $shadow-sm;
  padding: $space-3;
  margin-bottom: $space-data-list-gap;
}

.dev__icon {
  width: $size-icon-xl;
  height: $size-icon-xl;
  border-radius: $radius-card-child;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dev__icon-t {
  font-size: $font-size-xl;
}

.dev__main {
  flex: 1;
  padding: 0 $space-3;
  overflow: hidden;
}

.dev__name {
  display: block;
  font-size: $font-size-md;
  font-weight: $font-weight-heavy;
  color: $text-primary;
  line-height: $line-height-tight;
}

.dev__sn {
  display: block;
  font-size: $font-size-xs;
  color: $text-secondary;
  margin-top: $space-1;
}

.dev__sync {
  display: block;
  font-size: $font-size-2xs;
  color: $text-disabled;
  margin-top: $space-1;
}

.dev__status {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: $space-1 $space-2;
  border-radius: $radius-full;
  background: $success;
}

.dev__status--off {
  background: $bg-section;
}

.dev__status-dot {
  width: $size-badge-sm;
  height: $size-badge-sm;
  border-radius: 50%;
  background: $text-inverse;
  margin-right: $space-1;
}

.dev__status--off .dev__status-dot {
  background: $text-disabled;
}

.dev__status-t {
  font-size: $font-size-2xs;
  color: $text-inverse;
  font-weight: $font-weight-semibold;
}

.dev__status--off .dev__status-t {
  color: $text-muted;
}

.add-bar {
  position: fixed;
  left: $space-4;
  right: $space-4;
  /* 底部留出 tabBar(约54px) + 安全间距 */
  bottom: 64px;
  height: $size-input-height;
  border-radius: $radius-full;
  background: $brand-primary-active;
  box-shadow: $shadow-lg;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-bar__icon {
  color: $text-inverse;
  font-size: $font-size-md;
  margin-right: $space-2;
}

.add-bar__t {
  color: $text-inverse;
  font-size: $font-size-sm;
  font-weight: $font-weight-bold;
}
</style>
