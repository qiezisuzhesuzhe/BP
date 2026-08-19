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
          <text class="dev__sn">{{ dev.model }} · {{ dev.sn || dev.deviceid }}</text>
          <!-- 血压款手环：展示实时血压 + 心率 + 电量 -->
          <view v-if="dev.typeKey === 'band-bp' && bandLive[dev.deviceid]" class="dev__live">
            <view class="dev__chip">
              <text class="dev__chip-icon fa-solid fa-heart-pulse" style="color:#f15533"></text>
              <text class="dev__chip-n">{{ bandLive[dev.deviceid].sbp != null ? bandLive[dev.deviceid].sbp : '--' }}</text>
              <text class="dev__chip-sep">/</text>
              <text class="dev__chip-n dev__chip-n--sub">{{ bandLive[dev.deviceid].dbp != null ? bandLive[dev.deviceid].dbp : '--' }}</text>
              <text class="dev__chip-u">mmHg</text>
            </view>
            <view class="dev__chip">
              <text class="dev__chip-icon fa-solid fa-heart" style="color:#389a82"></text>
              <text class="dev__chip-n">{{ bandLive[dev.deviceid].hr != null ? bandLive[dev.deviceid].hr : '--' }}</text>
              <text class="dev__chip-u">bpm</text>
            </view>
            <view class="dev__chip" v-if="bandLive[dev.deviceid].battery != null">
              <text class="dev__chip-icon" :class="batteryIcon(bandLive[dev.deviceid].battery)" :style="{ color: batteryColor(bandLive[dev.deviceid].battery) }"></text>
              <text class="dev__chip-n">{{ bandLive[dev.deviceid].battery }}</text>
              <text class="dev__chip-u">%</text>
            </view>
          </view>
          <!-- 非血压款：展示最近同步 -->
          <text v-else class="dev__sync">最近同步 {{ dev.lastSync }}</text>
        </view>
        <view class="dev__right">
          <view class="dev__status" :class="{ 'dev__status--off': !isOnline(dev) }">
            <text class="dev__status-dot"></text>
            <text class="dev__status-t">{{ isOnline(dev) ? '在线' : '离线' }}</text>
          </view>
          <text class="fa-solid fa-angle-right dev__arrow"></text>
        </view>
      </view>
    </view>

    <view v-if="devices.length > 0" class="hm-safe-bottom"></view>
    <view v-if="devices.length > 0" class="add-bar" @tap="goScan">
      <text class="fa-solid fa-plus add-bar__icon"></text>
      <text class="add-bar__t">添加其他设备</text>
    </view>
  </view>
</template>

<script>
import { DEVICE_TYPES } from '@/common/mock.js'
import { fetchBandLatestBatch } from '@/common/band.js'

const LIVE_POLL_MS = 60 * 1000 // 列表页每 1 分钟拉一次手环实时数据（与详情页一致）

export default {
  data() {
    return {
      bandLive: {}, // { [deviceid]: latestSnapshot }
      timer: null
    }
  },
  computed: {
    devices() {
      return this.$store.getters.devices
    }
  },
  onShow() {
    this.pullBandLive()
    this.clearTimer()
    this.timer = setInterval(() => this.pullBandLive(), LIVE_POLL_MS)
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
    // 拉取所有血压款手环的后端实时数据
    async pullBandLive() {
      const bandIds = this.devices
        .filter((d) => d.typeKey === 'band-bp' && d.deviceid)
        .map((d) => d.deviceid)
      if (bandIds.length === 0) {
        this.bandLive = {}
        return
      }
      const data = await fetchBandLatestBatch(bandIds)
      if (data) this.bandLive = data
    },
    meta(dev) {
      return DEVICE_TYPES.find((t) => t.key === dev.typeKey) || DEVICE_TYPES[0]
    },
    // 在线判断：血压款以后端 latest 更新时间 + 电量为准，其他设备走 store
    isOnline(dev) {
      if (dev.typeKey === 'band-bp' && dev.deviceid) {
        const l = this.bandLive[dev.deviceid]
        if (!l) return dev.online === true
        // updatedAt 20 分钟内视为在线
        if (l.updatedAt) return Date.now() - l.updatedAt < 20 * 60 * 1000
        return (l.hr != null) || (l.sbp != null) || (l.battery != null)
      }
      return dev.online === true
    },
    batteryIcon(b) {
      const v = Number(b)
      if (isNaN(v)) return 'fa-solid fa-battery-three-quarters'
      if (v >= 80) return 'fa-solid fa-battery-full'
      if (v >= 50) return 'fa-solid fa-battery-three-quarters'
      if (v >= 20) return 'fa-solid fa-battery-half'
      if (v >= 10) return 'fa-solid fa-battery-quarter'
      return 'fa-solid fa-battery-empty'
    },
    batteryColor(b) {
      const v = Number(b)
      if (isNaN(v)) return '#94a3b8'
      if (v >= 50) return '#27ae60'
      if (v >= 20) return '#f2994a'
      return '#f15533'
    },
    goDetail(id) {
      const dev = this.$store.getters.deviceById(id)
      if (dev && dev.typeKey === 'band-bp') {
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
  transition: transform 0.1s ease, box-shadow 0.2s ease;
}

.dev:active {
  transform: scale(0.99);
  box-shadow: $shadow-sm;
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
  min-width: 0;
}

.dev__name {
  display: block;
  font-size: $font-size-md;
  font-weight: $font-weight-heavy;
  color: $text-primary;
  line-height: $line-height-tight;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dev__sn {
  display: block;
  font-size: $font-size-xs;
  color: $text-secondary;
  margin-top: $space-1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dev__sync {
  display: block;
  font-size: $font-size-2xs;
  color: $text-disabled;
  margin-top: $space-1;
}

/* 手环实时数据：指标 chip 行 */
.dev__live {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: $space-2;
  margin-top: $space-2;
}

.dev__chip {
  display: inline-flex;
  align-items: baseline;
  padding: $space-1 $space-2;
  border-radius: $radius-sm;
  background: $bg-section;
}

.dev__chip-icon {
  font-size: $font-size-xs;
  margin-right: $space-1;
  opacity: 0.9;
}

.dev__chip-n {
  font-family: $font-family-en;
  font-weight: $font-weight-heavy;
  color: $text-primary;
  font-size: $font-size-sm;
  line-height: 1;
}

.dev__chip-n--sub {
  color: $text-secondary;
}

.dev__chip-sep {
  margin: 0 4rpx;
  color: $text-muted;
  font-size: $font-size-xs;
}

.dev__chip-u {
  margin-left: $space-1;
  font-size: $font-size-2xs;
  color: $text-muted;
}

.dev__right {
  display: flex;
  align-items: center;
  gap: $space-2;
  flex-shrink: 0;
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

.dev__arrow {
  font-size: $font-size-xs;
  color: $text-disabled;
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
  transition: opacity 0.2s ease, transform 0.1s ease;
}

.add-bar:active {
  transform: scale(0.99);
  opacity: 0.9;
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
