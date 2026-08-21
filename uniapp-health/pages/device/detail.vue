<template>
  <view class="hm-page">
    <hm-navbar title="设备详情" bg-color="transparent"></hm-navbar>

    <view class="wrap" v-if="dev">
      <!-- 设备信息 -->
      <view class="dev-head">
        <view class="dev-head__icon" :style="{ background: type.accentSoft }">
          <text class="dev-head__icon-t" :class="type.icon" :style="{ color: type.color }"></text>
        </view>
        <view class="dev-head__main">
          <text class="dev-head__name">{{ dev.name }}</text>
          <text class="dev-head__model">{{ shownModel }} · {{ dev.sn }}</text>
          <text class="dev-head__sync">{{ syncTip }}</text>
        </view>
        <view class="dev-head__status" :style="{ background: liveColor }">
          <text class="dev-head__dot"></text>
          <text class="dev-head__status-t">{{ liveLabel }}</text>
        </view>
      </view>

      <!-- 雷达款：五项核心指标，手环风格 vital 卡布局，每项带最新数据时间 -->
      <block v-if="isRadar">
        <view class="vital">
          <view class="vital__card vital__card--hr">
            <view class="vital__head">
              <text class="fa-solid fa-heart-pulse vital__icon"></text>
              <text class="vital__name">心率</text>
            </view>
            <view class="vital__value">
              <text class="vital__num">{{ radarLatest && radarLatest.heartRate != null ? radarLatest.heartRate : '--' }}</text>
              <text class="vital__unit">bpm</text>
            </view>
            <text class="vital__sub">{{ latestTimeTip }}</text>
          </view>
          <view class="vital__card vital__card--resp">
            <view class="vital__head">
              <text class="fa-solid fa-wind vital__icon"></text>
              <text class="vital__name">呼吸</text>
            </view>
            <view class="vital__value">
              <text class="vital__num">{{ radarLatest && radarLatest.respRate != null ? radarLatest.respRate : '--' }}</text>
              <text class="vital__unit">次/分</text>
            </view>
            <text class="vital__sub">{{ latestTimeTip }}</text>
          </view>
        </view>
        <view class="vital">
          <view class="vital__card vital__card--sleep">
            <view class="vital__head">
              <text class="fa-solid fa-moon vital__icon"></text>
              <text class="vital__name">睡眠时长</text>
            </view>
            <view class="vital__value">
              <text class="vital__num">{{ radarLatest && radarLatest.stay != null ? radarLatest.stay : '--' }}</text>
              <text class="vital__unit">h</text>
            </view>
            <text class="vital__sub">{{ latestTimeTip }}</text>
          </view>
          <view class="vital__card vital__card--presence">
            <view class="vital__head">
              <text class="fa-solid fa-bed vital__icon"></text>
              <text class="vital__name">存在状态</text>
            </view>
            <view class="vital__value">
              <text class="vital__num" :style="{ color: inBedColor }">{{ inBedText }}</text>
            </view>
            <text class="vital__sub">{{ latestTimeTip }}</text>
          </view>
        </view>
        <view class="wrap--single">
          <view class="vital__card vital__card--struggle" :class="{ 'vital__card--alert': struggleInfo.active }">
            <view class="vital__head">
              <text class="fa-solid fa-triangle-exclamation vital__icon vital__icon--alert"></text>
              <text class="vital__name" :style="{ color: struggleInfo.active ? '#f15533' : '' }">异常挣扎</text>
            </view>
            <view class="vital__value">
              <text class="vital__num" :style="{ color: struggleInfo.active ? '#f15533' : '' }">{{ struggleInfo.active ? struggleInfo.count : '无' }}</text>
              <text class="vital__unit" v-if="struggleInfo.active">次</text>
              <text class="vital__unit" v-else>&nbsp;</text>
            </view>
            <text class="vital__sub" :class="{ 'vital__sub--alert': struggleInfo.active }">
              {{ struggleInfo.active ? struggleInfo.text + '，最近挣扎时间' : '状态正常' }}
            </text>
            <!-- 最近三次挣扎时间 -->
            <view v-if="struggleHistory.length" class="struggle-list">
              <view v-for="(s, i) in struggleHistory" :key="i" class="struggle-list__item">
                <text class="struggle-list__time">{{ fmtTs(s.ts) }}</text>
                <text class="struggle-list__count">第{{ i + 1 }}次 · 共{{ s.count }}次</text>
              </view>
            </view>
          </view>
        </view>
      </block>

      <!-- 非雷达设备：保留原有网格布局 -->
      <view v-else class="grid">
        <view v-for="(f, i) in type.fields" :key="f.key" class="cell" :class="{ 'cell--pulse': pulsing[i] }">
          <view class="cell__icon" :style="{ background: type.accentSoft }">
            <text class="cell__icon-t" :class="f.icon" :style="{ color: type.color }"></text>
          </view>
          <view class="cell__val">
            <text class="cell__num" :style="{ color: type.color }">{{ fmt(f) }}</text>
            <text class="cell__unit">{{ f.unit }}</text>
          </view>
          <text class="cell__label">{{ f.label }}</text>
        </view>
      </view>

      <!-- 平台透传的其他属性：型号未知时，未命中内置映射的属性原样展示，避免丢数据 -->
      <view v-if="extraAttrs.length" class="extra">
        <text class="extra__title">设备上报的其他属性</text>
        <view v-for="(a, i) in extraAttrs" :key="i" class="extra__row">
          <text class="extra__k">{{ a.name }}</text>
          <text class="extra__v">{{ a.value }}{{ a.unit }}</text>
        </view>
      </view>

      <view class="foot-tip">
        <text class="foot-tip__t">{{ footTip }}</text>
      </view>

      <view class="unbind" @tap="unbind">
        <text class="unbind__t">解绑设备</text>
      </view>
      <view class="hm-safe-bottom"></view>
    </view>
  </view>
</template>

<script>
import { deviceType } from '@/common/mock.js'
import { subscribeEvents } from '@/common/band.js'
import { fetchRadarRecord, unbindRadarDevice, radarInBed, radarStruggleAlert } from '@/common/radar.js'

// 雷达为真实链路，无需 2 秒轮询：SSE 已实时推送，轮询仅作断线兜底
const RADAR_POLL_MS = 60000
const MOCK_POLL_MS = 2000

export default {
  data() {
    return {
      id: '',
      timer: null,
      pulsing: [false, false, false, false],
      radarRec: null, // 雷达后端完整记录 { latest, attrs, state, stateText, site, ... }
      _sub: null
    }
  },
  computed: {
    dev() {
      return this.$store.getters.deviceById(this.id)
    },
    type() {
      return this.dev ? deviceType(this.dev.typeKey) : null
    },
    isRadar() {
      return !!(this.dev && this.dev.typeKey === 'radar')
    },
    // 雷达最新快照：以后端为准（SSE 推送 / 接口拉取都会写进 radarRec）
    radarLatest() {
      return (this.radarRec && this.radarRec.latest) || null
    },
    // 型号：平台回传的真实型号优先于内置默认型号
    shownModel() {
      if (this.radarRec && this.radarRec.model) return this.radarRec.model
      return (this.dev && this.dev.model) || ''
    },
    syncTip() {
      if (this.isRadar) {
        const ts = this.radarLatest && this.radarLatest.ts
        if (!ts) return '等待设备首次上报'
        return '最近上报 ' + this.fmtTs(ts)
      }
      return '最近同步 ' + (this.dev ? this.dev.lastSync : '')
    },
    // 雷达在线以最近上报时间为准（与设备列表页判定口径保持一致）
    radarOnline() {
      const ts = this.radarLatest && this.radarLatest.ts
      if (!ts) return false
      return Date.now() - ts < 20 * 60 * 1000
    },
    liveLabel() {
      if (!this.isRadar) return '实时'
      return this.radarOnline ? '实时' : '待上报'
    },
    liveColor() {
      if (!this.isRadar) return '#389a82'
      return this.radarOnline ? '#389a82' : '#94a3b8'
    },
    refreshTip() {
      return ''  // 已移除"云平台实时推送"提示，时间信息移至每个卡片下方
    },
    // 最新数据时间提示：显示在每个 vital 卡片下方
    latestTimeTip() {
      if (!this.isRadar) return ''
      const ts = this.radarLatest && this.radarLatest.ts
      if (!ts) return '等待数据上报'
      return '最新数据 ' + this.fmtTs(ts)
    },
    // 挣扎历史（最近 3 次）
    struggleHistory() {
      if (!this.isRadar) return []
      const rec = this.radarRec
      if (!rec || !Array.isArray(rec.struggleHistory)) return []
      return rec.struggleHistory.slice(0, 3)
    },
    footTip() {
      if (this.isRadar) {
        const site = (this.radarRec && this.radarRec.site) || ''
        const base = '数据由睡眠监测仪经物联网云平台实时推送，非接触式采集'
        return site ? base + '，安装位置：' + site : base
      }
      return '数据由设备同步上传，本页为演示数据，仅供界面预览'
    },
    inBedText() {
      const v = radarInBed(this.radarLatest)
      if (v === true) return '在床'
      if (v === false) return '离床'
      return '在床状态待上报'
    },
    inBedColor() {
      const v = radarInBed(this.radarLatest)
      if (v === true) return '#389a82'
      if (v === false) return '#f2994a'
      return '#94a3b8'
    },
    // 平台上报但未命中内置字段映射的属性，原样列出（型号未知时兜住全部数据）
    extraAttrs() {
      if (!this.isRadar) return []
      const list = (this.radarRec && this.radarRec.attrs) || []
      return list.filter((a) => a && !a.key && a.name != null && a.value != null && a.value !== '')
    },
    // 异常挣扎状态
    struggleInfo() {
      return radarStruggleAlert(this.radarLatest)
    }
  },
  onLoad(options) {
    this.id = options.id || ''
  },
  onShow() {
    this.pull()
    this.timer = setInterval(() => this.pull(), this.isRadar ? RADAR_POLL_MS : MOCK_POLL_MS)
    if (this.isRadar) this.startSse()
  },
  onHide() {
    this.clearTimer()
    this.stopSse()
  },
  onUnload() {
    this.clearTimer()
    this.stopSse()
  },
  methods: {
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    // 雷达走 SSE 实时接收平台推送，收到本机设备号的事件才刷新
    startSse() {
      this.stopSse()
      const deviceid = (this.dev && this.dev.deviceid) || ''
      if (!deviceid) return
      this._sub = subscribeEvents({
        kinds: ['radar', 'device_unbind'],
        onEvent: (evt) => {
          const p = (evt && evt.payload) || {}
          if (p.deviceid && p.deviceid !== deviceid) return
          this.pullRadar()
        }
      })
    },
    stopSse() {
      if (this._sub) {
        try { this._sub.close() } catch (e) {}
        this._sub = null
      }
    },
    async pull() {
      if (!this.id || !this.$store.getters.deviceById(this.id)) return
      if (this.isRadar) {
        await this.pullRadar()
        return
      }
      await this.$store.dispatch('updateDeviceData', this.id)
      // 数据更新时对应字段短暂高亮，模拟实时刷新感
      if (this.type) {
        this.type.fields.forEach((f, i) => {
          this.$set(this.pulsing, i, true)
          setTimeout(() => this.$set(this.pulsing, i, false), 400)
        })
      }
    },
    async pullRadar() {
      const deviceid = (this.dev && this.dev.deviceid) || ''
      if (!deviceid) return
      const rec = await fetchRadarRecord(deviceid)
      if (!rec) return
      const prevTs = (this.radarLatest && this.radarLatest.ts) || 0
      this.radarRec = rec
      // 仅在确实有新上报时才做高亮，避免定时兜底拉取时无意义闪动
      const ts = (rec.latest && rec.latest.ts) || 0
      if (ts && ts !== prevTs && this.type) {
        this.type.fields.forEach((f, i) => {
          this.$set(this.pulsing, i, true)
          setTimeout(() => this.$set(this.pulsing, i, false), 400)
        })
      }
    },
    fmtTs(ts) {
      const d = new Date(Number(ts))
      if (isNaN(d.getTime())) return '--'
      const p = (n) => (n < 10 ? '0' + n : String(n))
      return p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes())
    },
    unbind() {
      uni.showModal({
        title: '解绑设备',
        content: '解绑后该设备将停止向本账号同步数据，确定解绑「' + this.dev.name + '」吗？',
        confirmColor: '#f15533',
        success: async (res) => {
          if (!res.confirm) return
          // 雷达为真实链路：必须先通知后端停止接收该设备推送，成功后再移除本地记录
          if (this.isRadar) {
            const deviceid = this.dev.deviceid || ''
            if (deviceid) {
              uni.showLoading({ title: '正在解绑…', mask: true })
              const ok = await unbindRadarDevice(deviceid)
              uni.hideLoading()
              if (!ok) {
                uni.showModal({
                  title: '解绑失败',
                  content: '未能与服务端确认解绑结果，请检查网络后重试。',
                  showCancel: false
                })
                return
              }
            }
            this.stopSse()
          }
          this.$store.dispatch('removeDevice', this.id)
          uni.showToast({ title: '已解绑', icon: 'success' })
          setTimeout(() => uni.navigateBack(), 500)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dev-head {
  display: flex;
  align-items: center;
  background: $bg-surface;
  border-radius: $radius-card;
  box-shadow: $shadow-sm;
  padding: $space-4 $space-3;
}

.dev-head__icon {
  width: $size-icon-xl;
  height: $size-icon-xl;
  border-radius: $radius-card-child;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: $shadow-md;
}

.dev-head__icon-t {
  font-size: $font-size-xl;
}

.dev-head__main {
  flex: 1;
  padding: 0 $space-3;
  overflow: hidden;
}

.dev-head__name {
  display: block;
  font-size: $font-size-lg;
  font-weight: $font-weight-heavy;
  color: $text-primary;
  line-height: $line-height-tight;
}

.dev-head__model {
  display: block;
  font-size: $font-size-xs;
  color: $text-secondary;
  margin-top: $space-1;
}

.dev-head__sync {
  display: block;
  font-size: $font-size-2xs;
  color: $text-disabled;
  margin-top: $space-1;
}

.dev-head__status {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  background: $success;
  border-radius: $radius-full;
  padding: $space-1 $space-2;
}

.dev-head__dot {
  width: $size-badge-sm;
  height: $size-badge-sm;
  border-radius: 50%;
  background: $text-inverse;
  margin-right: $space-1;
  animation: dot-blink 1.6s ease-in-out infinite;
}

@keyframes dot-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}

.dev-head__status-t {
  font-size: $font-size-2xs;
  color: $text-inverse;
  font-weight: $font-weight-semibold;
}

.rstat {
  display: none;
}

/* Vital 卡片：手环风格布局，雷达详情用 */
.vital {
  display: flex;
  margin-top: $space-3;
}

.wrap--single {
  padding: $space-4 $space-4 0;
  margin-top: $space-3;
}

.wrap--single .vital__card {
  width: 100%;
}

.vital__card {
  flex: 1;
  min-width: 0;
  background: $bg-surface;
  border-radius: $radius-card-child;
  box-shadow: $shadow-sm;
  padding: $space-4;
}

.vital__card + .vital__card {
  margin-left: $space-3;
}

.vital__card--alert {
  border: 2rpx solid rgba(241, 85, 51, 0.4);
}

.vital__card--hr {
  background: linear-gradient(145deg, #e8f8f0 0%, $bg-surface 75%);
}

.vital__card--struggle {
  background: linear-gradient(145deg, #fff5f3 0%, $bg-surface 75%);
}

.vital__card--struggle.vital__card--alert {
  background: linear-gradient(145deg, #fdeeee 0%, $bg-surface 75%);
}

.vital__head {
  display: flex;
  align-items: center;
}

.vital__icon {
  font-size: $font-size-md;
  margin-right: $space-2;
  color: $brand-green;
}

.vital__icon--alert {
  color: #f15533;
}

.vital__card--resp .vital__icon { color: #8dcdd8; }
.vital__card--sleep .vital__icon { color: #9b8fc9; }
.vital__card--presence .vital__icon { color: #389a82; }
.vital__card--struggle .vital__icon { color: #f15533; }

.vital__name {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $text-secondary;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vital__value {
  display: flex;
  align-items: baseline;
  margin-top: $space-3;
}

.vital__num {
  font-size: $font-size-2xl;
  font-weight: $font-weight-heavy;
  font-family: $font-family-en;
  line-height: 1;
  color: $text-primary;
}

.vital__card--hr .vital__num { color: $brand-green; }
.vital__card--resp .vital__num { color: #8dcdd8; }
.vital__card--sleep .vital__num { color: #9b8fc9; }

.vital__unit {
  margin-left: $space-1;
  font-size: $font-size-2xs;
  color: $text-muted;
}

.vital__sub {
  display: block;
  margin-top: $space-2;
  font-size: $font-size-2xs;
  color: $text-muted;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vital__sub--alert {
  color: #f15533;
}

/* 挣扎历史列表 */
.struggle-list {
  margin-top: $space-3;
  padding-top: $space-2;
  border-top: 1rpx solid $bg-section;
}

.struggle-list__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-1 0;
}

.struggle-list__time {
  font-size: $font-size-xs;
  color: $text-primary;
  font-weight: $font-weight-semibold;
}

.struggle-list__count {
  font-size: $font-size-2xs;
  color: $text-muted;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.cell {
  width: 49%;
  background: $bg-surface;
  border-radius: $radius-card-child;
  box-shadow: $shadow-sm;
  padding: $space-3;
  margin-bottom: $space-data-list-gap;
  transition: box-shadow $duration-normal $ease-standard;
}

.cell--pulse {
  box-shadow: 0 0 0 2rpx rgba(56, 154, 130, 0.35);
}

.cell__icon {
  width: $size-icon-md;
  height: $size-icon-md;
  border-radius: $radius-sm;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cell__icon-t {
  font-size: $font-size-sm;
}

.cell__val {
  margin-top: $space-2;
  display: flex;
  align-items: baseline;
}

.cell__num {
  font-size: $font-size-2xl;
  font-weight: $font-weight-heavy;
  line-height: $line-height-tight;
}

.cell__unit {
  font-size: $font-size-2xs;
  color: $text-muted;
  margin-left: $space-1;
}

.cell__label {
  display: block;
  font-size: $font-size-xs;
  color: $text-muted;
  margin-top: $space-1;
}

.extra {
  background: $bg-surface;
  border-radius: $radius-card-child;
  box-shadow: $shadow-sm;
  padding: $space-3;
}

.extra__title {
  display: block;
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  color: $text-secondary;
  margin-bottom: $space-2;
}

.extra__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space-1 0;
}

.extra__k {
  font-size: $font-size-xs;
  color: $text-muted;
  flex: 1;
  overflow: hidden;
}

.extra__v {
  font-size: $font-size-xs;
  color: $text-primary;
  font-weight: $font-weight-semibold;
  margin-left: $space-2;
  flex-shrink: 0;
}

.foot-tip {
  padding: $space-4 $space-6 $space-3;
  text-align: center;
}

.foot-tip__t {
  font-size: $font-size-2xs;
  color: $text-disabled;
  line-height: $line-height-relaxed;
}

.unbind {
  margin-top: $space-2;
  background: $bg-surface;
  border-radius: $radius-card-child;
  box-shadow: $shadow-sm;
  height: $size-input-height;
  display: flex;
  align-items: center;
  justify-content: center;
}

.unbind__t {
  font-size: $font-size-sm;
  color: $danger;
  font-weight: $font-weight-semibold;
}
</style>
