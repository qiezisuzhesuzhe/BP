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

      <!-- 实时数据 -->
      <view class="sec-head">
        <text class="hm-sec-title">实时数据</text>
        <text class="hm-sec-sub">{{ refreshTip }}</text>
      </view>

      <!-- 雷达款：平台推送的在床状态与设备状态，是非接触监测最关键的结论 -->
      <view v-if="isRadar" class="rstat">
        <view class="rstat__item">
          <text class="rstat__icon" :class="inBedIcon" :style="{ color: inBedColor }"></text>
          <text class="rstat__t" :style="{ color: inBedColor }">{{ inBedText }}</text>
        </view>
        <view class="rstat__item" v-if="radarStateLabel">
          <text class="rstat__icon fa-solid fa-circle-nodes" style="color:#8dcdd8"></text>
          <text class="rstat__t">{{ radarStateLabel }}</text>
        </view>
        <view class="rstat__item" v-if="respTip">
          <text class="rstat__icon fa-solid fa-wind" style="color:#f2994a"></text>
          <text class="rstat__t">呼吸{{ respTip }}</text>
        </view>
      </view>

      <view class="grid">
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
import { fetchRadarRecord, unbindRadarDevice, radarInBed, radarStateText, respLevel } from '@/common/radar.js'

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
      if (this.isRadar) return '云平台实时推送'
      return '每 2 秒自动刷新'
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
    inBedIcon() {
      const v = radarInBed(this.radarLatest)
      if (v === true) return 'fa-solid fa-bed'
      if (v === false) return 'fa-solid fa-person-walking-arrow-right'
      return 'fa-solid fa-satellite-dish'
    },
    inBedColor() {
      const v = radarInBed(this.radarLatest)
      if (v === true) return '#389a82'
      if (v === false) return '#f2994a'
      return '#94a3b8'
    },
    radarStateLabel() {
      if (!this.radarRec) return ''
      return this.radarRec.stateText || radarStateText(this.radarRec.state)
    },
    // 呼吸频率分级（偏慢 / 正常 / 偏快 / 过快），无数据则不显示该 chip
    respTip() {
      if (!this.radarLatest) return ''
      const r = respLevel(this.radarLatest.respRate)
      return r && r.text ? r.text : ''
    },
    // 平台上报但未命中内置字段映射的属性，原样列出（型号未知时兜住全部数据）
    extraAttrs() {
      if (!this.isRadar) return []
      const list = (this.radarRec && this.radarRec.attrs) || []
      return list.filter((a) => a && !a.key && a.name != null && a.value != null && a.value !== '')
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
    fmt(f) {
      // 雷达取后端真实快照，其他设备沿用 store 中的原型数据
      const src = this.isRadar ? this.radarLatest : (this.dev && this.dev.data)
      const v = src ? src[f.key] : null
      if (v === null || v === undefined || v === '') return '--'
      return v
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
  display: flex;
  flex-wrap: wrap;
  background: $bg-surface;
  border-radius: $radius-card-child;
  box-shadow: $shadow-sm;
  padding: $space-3;
  margin-bottom: $space-data-list-gap;
}

.rstat__item {
  display: flex;
  align-items: center;
  margin-right: $space-4;
}

.rstat__icon {
  font-size: $font-size-sm;
  margin-right: $space-1;
}

.rstat__t {
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  color: $text-secondary;
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
