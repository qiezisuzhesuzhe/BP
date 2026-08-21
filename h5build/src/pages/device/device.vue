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
          <!-- 睡眠监测仪（毫米波雷达款）：心率 + 呼吸 + 睡眠 + 存在 + 挣扎预警 -->
          <view v-else-if="dev.typeKey === 'radar' && radarLive[dev.deviceid]" class="dev__live">
            <view class="dev__chip">
              <text class="dev__chip-icon" :class="inBedIcon(dev.deviceid)" :style="{ color: inBedColor(dev.deviceid) }"></text>
              <text class="dev__chip-n dev__chip-n--txt">{{ inBedText(dev.deviceid) }}</text>
            </view>
            <view class="dev__chip" v-if="radarLive[dev.deviceid].heartRate != null">
              <text class="dev__chip-icon fa-solid fa-heart" style="color:#e74c3c"></text>
              <text class="dev__chip-n">{{ radarLive[dev.deviceid].heartRate }}</text>
              <text class="dev__chip-u">bpm</text>
            </view>
            <view class="dev__chip" v-if="radarLive[dev.deviceid].respRate != null">
              <text class="dev__chip-icon fa-solid fa-wind" style="color:#8dcdd8"></text>
              <text class="dev__chip-n">{{ radarLive[dev.deviceid].respRate }}</text>
              <text class="dev__chip-u">次/分</text>
            </view>
            <view class="dev__chip" v-if="radarLive[dev.deviceid].struggleAlert > 0">
              <text class="dev__chip-icon fa-solid fa-triangle-exclamation" style="color:#f15533"></text>
              <text class="dev__chip-n" style="color:#f15533">{{ radarLive[dev.deviceid].struggleAlert }}</text>
              <text class="dev__chip-u">次挣扎</text>
            </view>
          </view>
          <!-- 其他设备：展示最近同步 -->
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
import { fetchBandLatestBatch, subscribeEvents } from '@/common/band.js'
import { fetchRadarLatestBatch, radarInBed } from '@/common/radar.js'

// SSE 事件 800ms 内批量合并，避免 pb 高频上报触发多次 pull
const MERGE_MS = 800

export default {
  data() {
    return {
      bandLive: {}, // { [deviceid]: latestSnapshot }
      radarLive: {}, // { [deviceid]: 雷达最新快照 }
      _sub: null,
      _mergeTimer: null
    }
  },
  computed: {
    devices() {
      return this.$store.getters.devices
    }
  },
  onShow() {
    this.pullBandLive()
    this.pullRadarLive()
    this.startSse()
  },
  onHide() {
    this.stopSse()
    this._clearMerge()
  },
  onUnload() {
    this.stopSse()
    this._clearMerge()
  },
  methods: {
    startSse() {
      this.stopSse()
      this._sub = subscribeEvents({
        kinds: ['pb','alarm','sos','status','deviceinfo','device_bind','device_unbind','radar'],
        onEvent: (evt) => this.handleSse(evt)
      })
    },
    stopSse() {
      if (this._sub) {
        try { this._sub.close() } catch (e) {}
        this._sub = null
      }
    },
    _clearMerge() {
      if (this._mergeTimer) {
        clearTimeout(this._mergeTimer)
        this._mergeTimer = null
      }
    },
    handleSse(evt) {
      const kind = evt.kind || ''
      const p = (evt && evt.payload) || {}
      // device_bind / unbind：直接刷新列表 store（无需特殊处理，Vuex 会联动）
      // 有 deviceid 且带快照：按事件类型分流写入 radarLive / bandLive
      if (p && p.deviceid && p.snapshot && typeof p.snapshot === 'object') {
        const snap = Object.assign({}, p.snapshot || {})
        for (const k of Object.keys(snap)) {
          if (snap[k] === null || snap[k] === undefined || snap[k] === '') delete snap[k]
        }
        const bucket = kind === 'radar' ? 'radarLive' : 'bandLive'
        const prev = this[bucket][p.deviceid] || {}
        this.$set(this[bucket], p.deviceid, Object.assign({}, prev, snap))
      }
      // 其他变动（在线状态、新增设备等）：延迟合并批量拉 1 次
      this._clearMerge()
      this._mergeTimer = setTimeout(() => {
        this._mergeTimer = null
        this.pullBandLive()
        this.pullRadarLive()
      }, MERGE_MS)
      // 异常告警：设备列表页不需要强弹窗，仅用轻 toast（去重依赖 mergeTimer 合并）
      if (kind === 'alarm') {
        uni.showToast({ title: '某手环上报健康告警', icon: 'none' })
      } else if (kind === 'sos') {
        uni.showToast({ title: '⚠️ 收到手环 SOS 呼叫', icon: 'none' })
      }
    },
    // 拉取所有血压款手环的后端实时数据
    async pullBandLive() {
      const bandIds = this.devices
        .filter((d) => /^band/.test(d.typeKey || '') && d.deviceid)
        .map((d) => d.deviceid)
      if (bandIds.length === 0) {
        this.bandLive = {}
        return
      }
      const data = await fetchBandLatestBatch(bandIds)
      if (data) this.bandLive = data
    },
    // 拉取所有睡眠监测仪（雷达款）的后端实时数据
    async pullRadarLive() {
      const ids = this.devices
        .filter((d) => d.typeKey === 'radar' && d.deviceid)
        .map((d) => d.deviceid)
      if (ids.length === 0) {
        this.radarLive = {}
        return
      }
      const data = await fetchRadarLatestBatch(ids)
      if (data) this.radarLive = data
    },
    // 在床状态：true 在床 / false 离床 / null 平台未上报该属性
    inBedText(deviceid) {
      const v = radarInBed(this.radarLive[deviceid])
      if (v === true) return '在床'
      if (v === false) return '离床'
      return '待上报'
    },
    inBedIcon(deviceid) {
      const v = radarInBed(this.radarLive[deviceid])
      if (v === true) return 'fa-solid fa-bed'
      if (v === false) return 'fa-solid fa-person-walking-arrow-right'
      return 'fa-solid fa-satellite-dish'
    },
    inBedColor(deviceid) {
      const v = radarInBed(this.radarLive[deviceid])
      if (v === true) return '#389a82'
      if (v === false) return '#f2994a'
      return '#94a3b8'
    },
    meta(dev) {
      return DEVICE_TYPES.find((t) => t.key === dev.typeKey) || DEVICE_TYPES[0]
    },
    // 在线判断：与详情页口径保持一致——有数据即视为在线，无数据再看时间窗口
    isOnline(dev) {
      if (dev.typeKey === 'band-bp' && dev.deviceid) {
        const l = this.bandLive[dev.deviceid]
        if (!l) return dev.online === true
        // 与详情页一致：有 hr/sbp/battery/steps 数据即视为在线
        if (l.hr != null || l.sbp != null || l.dbp != null || l.steps != null || l.battery != null) return true
        // 无测量数据时，按 updatedAt 时间窗口判定
        if (l.updatedAt) return Date.now() - l.updatedAt < 20 * 60 * 1000
        return false
      }
      // 雷达款：与详情页一致——有生命体征数据即视为在线，无数据再看时间窗口
      if (dev.typeKey === 'radar' && dev.deviceid) {
        const l = this.radarLive[dev.deviceid]
        if (!l) return dev.online === true
        // 有心率/呼吸/在床数据即视为在线
        if (l.heartRate != null || l.breathRate != null || l.inBed != null) return true
        // 无测量数据时，按 ts 时间窗口判定
        if (l.ts) return Date.now() - l.ts < 20 * 60 * 1000
        return false
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
      // 来源为设备列表 tab：绑定成功后 switchTab 回本页查看新设备
      uni.navigateTo({ url: '/pages/device/scan?from=device' })
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
  margin-left: $space-4;
  margin-right: $space-4;
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

/* 中文短语（如"在床/离床"）不走英文数字字体，避免字形与字重错位 */
.dev__chip-n--txt {
  font-family: inherit;
  font-weight: $font-weight-bold;
  font-size: $font-size-xs;
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
