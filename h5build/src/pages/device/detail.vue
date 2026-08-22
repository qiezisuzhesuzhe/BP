<template>
  <view class="hm-page">
    <hm-navbar title="设备详情" bg-color="transparent">
      <view slot="right" class="nav-actions" v-if="isRadar">
        <view class="nav-sub-btn" @tap="onUnbind">
          <text class="fa-solid fa-link-slash nav-sub-btn__icon"></text>
          <text class="nav-sub-btn__t">解绑</text>
        </view>
        <view class="nav-refresh" :class="{ 'nav-refresh--busy': refreshing }" @tap="doRefresh">
          <text class="fa-solid fa-rotate nav-refresh__icon" :class="{ 'nav-refresh__icon--spin': refreshing }"></text>
        </view>
      </view>
    </hm-navbar>

    <view class="wrap wrap--first" v-if="dev">
      <!-- 设备头卡 -->
      <view class="head">
        <view class="head__main">
          <text class="head__name">{{ dev.name }}</text>
          <view class="head__sn">
            <text class="head__sn-t">{{ shownModel }} · {{ dev.sn }}</text>
            <text class="head__sse" :class="{ 'head__sse--on': radarOnline }">
              <text class="fa-solid" :class="radarOnline ? 'fa-signal' : 'fa-link-slash'"></text>
              <text class="head__sse-t">{{ radarOnline ? '实时接收' : '等待连接' }}</text>
            </text>
          </view>
        </view>
        <view class="head__status" :class="{ 'head__status--off': !radarOnline }">
          <view class="head__dot"></view>
          <text class="head__status-t">{{ liveLabel }}</text>
        </view>
      </view>
    </view>

    <!-- 雷达款：五项核心指标，手环风格 vital 卡布局 -->
    <block v-if="isRadar">
      <view class="wrap">
        <view class="vital">
          <view class="vital__card vital__card--hr">
            <view class="vital__head">
              <text class="fa-solid fa-heart-pulse vital__icon vital__icon--hr"></text>
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
              <text class="fa-solid fa-wind vital__icon vital__icon--resp"></text>
              <text class="vital__name">呼吸</text>
            </view>
            <view class="vital__value">
              <text class="vital__num">{{ radarLatest && radarLatest.respRate != null ? radarLatest.respRate : '--' }}</text>
              <text class="vital__unit">次/分</text>
            </view>
            <text class="vital__sub">{{ latestTimeTip }}</text>
          </view>
        </view>

        <!-- 在床状态：左侧状态值 + 右侧在床/离床历史 -->
        <view class="bed-card">
          <view class="bed-card__left">
            <view class="vital__head">
              <text class="fa-solid fa-bed vital__icon vital__icon--presence"></text>
              <text class="vital__name">在床状态</text>
            </view>
            <view class="vital__value">
              <text class="vital__num" :style="{ color: inBedColor }">{{ inBedText }}</text>
            </view>
            <text class="vital__sub">{{ latestTimeTip }}</text>
          </view>
          <view class="bed-card__right">
            <text v-if="bedHistory.length" class="bed-card__label">最近切换</text>
            <view v-if="bedHistory.length" class="bed-list">
              <view v-for="(b, i) in bedHistory" :key="i" class="bed-list__item">
                <text class="bed-list__type" :class="{ 'bed-list__type--off': !b.inBed }">{{ b.inBed ? '在床' : '离床' }}</text>
                <text class="bed-list__time">{{ fmtTs(b.ts) }}</text>
              </view>
            </view>
            <text v-else class="bed-card__empty">--</text>
          </view>
        </view>

        <!-- 睡眠：独立卡片，位于在床状态与异常挣扎之间 -->
        <view class="sleep-card">
          <view class="sec-head">
            <text class="sec-title">睡眠</text>
            <text class="sec-sub">{{ sleepTotalText }}</text>
          </view>
          <view class="sleep">
            <view class="sleep__stats">
              <view class="sleep__stat">
                <text class="sleep__stat-num sleep__stat-num--deep">{{ radarSleep.deep != null ? fmtSleepMin(radarSleep.deep) : '--' }}</text>
                <text class="sleep__stat-t">深睡</text>
              </view>
              <view class="sleep__stat">
                <text class="sleep__stat-num sleep__stat-num--light">{{ radarSleep.light != null ? fmtSleepMin(radarSleep.light) : '--' }}</text>
                <text class="sleep__stat-t">浅睡</text>
              </view>
              <view class="sleep__stat">
                <text class="sleep__stat-num sleep__stat-num--wake">{{ radarSleep.wake != null ? fmtSleepMin(radarSleep.wake) : '--' }}</text>
                <text class="sleep__stat-t">清醒</text>
              </view>
            </view>
            <view v-if="radarSleep.total" class="sleep__strip">
              <view class="sleep__strip-seg sleep__strip-seg--deep" :style="{ width: radarSleepPct.deep + '%' }"></view>
              <view class="sleep__strip-seg sleep__strip-seg--light" :style="{ width: radarSleepPct.light + '%' }"></view>
              <view class="sleep__strip-seg sleep__strip-seg--wake" :style="{ width: radarSleepPct.wake + '%' }"></view>
            </view>
            <view v-else class="sleep__strip sleep__strip--empty"></view>
          </view>
        </view>

        <view class="vital__card vital__card--struggle" :class="{ 'vital__card--alert': struggleInfo.active }">
          <view class="vital__head">
            <text class="fa-solid fa-triangle-exclamation vital__icon vital__icon--alert"></text>
            <text class="vital__name" :style="{ color: struggleInfo.active ? '#f15533' : '' }">异常挣扎</text>
          </view>
          <view class="vital__value">
            <text class="vital__num" :style="{ color: struggleInfo.active ? '#f15533' : '' }">{{ struggleInfo.active ? struggleInfo.count : '--' }}</text>
            <text class="vital__unit" v-if="struggleInfo.active">次</text>
            <text class="vital__unit" v-else>&nbsp;</text>
          </view>
          <text class="vital__sub" :class="{ 'vital__sub--alert': struggleInfo.active }">
            {{ struggleInfo.active ? struggleInfo.text + '，最近挣扎时间' : '状态正常' }}
          </text>
          <view v-if="struggleHistory.length" class="struggle-list">
            <view v-for="(s, i) in struggleHistory" :key="i" class="struggle-list__item">
              <text class="struggle-list__time">{{ fmtTs(s.ts) }}</text>
              <text class="struggle-list__count">第{{ i + 1 }}次 · 共{{ s.count }}次</text>
            </view>
          </view>
        </view>
      </view>

      <view class="wrap">
        <view class="foot-tip">
          <text class="foot-tip__t">{{ footTip }}</text>
        </view>
      </view>
      <view class="wrap">
        <view class="unbind" @tap="onUnbind">
          <text class="unbind__t">解绑设备</text>
        </view>
      </view>
      <view class="hm-safe-bottom"></view>
    </block>

    <!-- 非雷达设备：保留原有网格布局 -->
    <view v-else class="wrap">
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
      _sub: null,
      refreshing: false
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
    // 雷达在线以「最新数据时间戳 + 最后访问时间 + 是否存在生命体征数据」综合判定。
    // 只看 latest.ts 会误判：设备刚绑定完成但从未真正推送过报文时，latest.ts 为 null/过旧，
    // 但后端已经能查到完整的历史数据（lastSeen 是本次拉取时写的，就在一分钟前），
    // 且 latest 里可能带 heartRate/respRate/inBed 等实际值——这种情况显然不该显示离线。
    radarOnline() {
      const rec = this.radarRec || {}
      const latest = rec.latest || {}
      const now = Date.now()
      // 1) 最近一次上报在窗口内
      const ts = latest.ts
      if (ts && now - ts < 20 * 60 * 1000) return true
      // 2) 本次拉取就带了真实生命体征数据，视为在线（演示设备多靠这条）
      if (latest.heartRate != null || latest.respRate != null || latest.inBed != null) return true
      // 3) lastSeen 兜底：后端在 20 分钟内还能查到此设备，说明设备"活在"平台上
      const lastSeen = rec.lastSeen
      if (lastSeen && now - lastSeen < 20 * 60 * 1000) return true
      return false
    },
    liveLabel() {
      return this.radarOnline ? '在线' : '离线'
    },
    liveColor() {
      return this.radarOnline ? '#389a82' : '#94a3b8'
    },
    // 最新数据时间提示：显示在每个 vital 卡片下方
    latestTimeTip() {
      const ts = this.radarLatest && this.radarLatest.ts
      if (!ts) return '--'
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
      return '数据由设备同步上传'
    },
    inBedText() {
      const v = radarInBed(this.radarLatest)
      if (v === true) return '在床'
      if (v === false) return '离床'
      return '--'
    },
    inBedColor() {
      const v = radarInBed(this.radarLatest)
      if (v === true) return '#389a82'
      if (v === false) return '#f2994a'
      return '#94a3b8'
    },
    radarSleep() {
      const l = this.radarLatest || {}
      const deep = l.deepSleep != null ? Number(l.deepSleep) : null
      const light = l.lightSleep != null ? Number(l.lightSleep) : null
      const wake = l.awakeSleep != null ? Number(l.awakeSleep) : null
      const total = l.sleepTotal != null ? Number(l.sleepTotal) : (l.stay != null ? Number(l.stay) : null)
      return { deep, light, wake, total }
    },
    radarSleepPct() {
      const s = this.radarSleep
      if (!s || !s.total) return { deep: 0, light: 0, wake: 0 }
      const deep = s.deep != null ? Math.round((s.deep / s.total) * 100) : 0
      const light = s.light != null ? Math.round((s.light / s.total) * 100) : 0
      return { deep: deep, light: light, wake: Math.max(0, 100 - deep - light) }
    },
    sleepTotalText() {
      const s = this.radarSleep
      if (!s || !s.total) return '--'
      return '共 ' + this.fmtSleepMin(s.total)
    },
    struggleInfo() {
      return radarStruggleAlert(this.radarLatest)
    },
    // 最近在床/离床切换历史（最多 3 条）
    bedHistory() {
      if (!this.isRadar) return []
      const rec = this.radarRec
      if (!rec || !Array.isArray(rec.bedHistory)) return []
      return rec.bedHistory.slice(0, 3)
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
    fmtTs(ts) {
      if (!ts) return ''
      const d = new Date(ts)
      const pad = (n) => String(n).padStart(2, '0')
      return `${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
    },
    fmtSleepMin(min) {
      if (min == null || isNaN(min)) return '--'
      // 雷达上报的单位可能是小时(h)或分钟(min)，这里统一按分钟格式化
      const v = Number(min)
      if (v >= 100) {
        // 可能是分钟单位
        const h = Math.floor(v / 60)
        const m = Math.round(v % 60)
        return h ? h + '小时' + m + '分' : m + '分钟'
      }
      // 可能是小时单位
      const h = Math.floor(v)
      const m = Math.round((v - h) * 60)
      return h ? h + '小时' + m + '分' : m + '分钟'
    },
    fmt(f) {
      const d = this.dev
      if (!d || !d.latest) return '--'
      const v = d.latest[f.key]
      if (v == null) return '--'
      return f.unit ? (v + f.unit) : v
    },
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
    // 手动刷新（与手环详情页一致）
    async doRefresh() {
      if (this.refreshing) return
      this.refreshing = true
      const deviceid = (this.dev && this.dev.deviceid) || ''
      if (!deviceid) {
        uni.showToast({ title: '未绑定设备号', icon: 'none' })
        this.refreshing = false
        return
      }
      const beforeTs = (this.radarLatest && this.radarLatest.ts) || 0
      await this.pullRadar()
      this.refreshing = false
      const afterTs = (this.radarLatest && this.radarLatest.ts) || 0
      const hasData = !!(this.radarLatest && (this.radarLatest.heartRate != null || this.radarLatest.respRate != null))
      if (afterTs !== beforeTs) {
        uni.showToast({ title: '已刷新，数据已更新', icon: 'none', duration: 1600 })
      } else if (hasData) {
        uni.showToast({ title: '已刷新，暂无新数据', icon: 'none', duration: 1600 })
      } else {
        uni.showToast({ title: '暂无数据，设备尚未上报', icon: 'none', duration: 1600 })
      }
    },
    onUnbind() {
      this.unbind()
    },
    unbind() {
      if (!this.dev) return
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
/* ---------- 导航栏右侧按钮（仅雷达款显示） ---------- */
.nav-actions {
  display: flex;
  align-items: center;
  gap: $space-2;
}

.nav-sub-btn {
  height: 60rpx;
  padding: 0 $space-3;
  border-radius: $radius-full;
  background: rgba(255, 255, 255, 0.7);
  border: 1rpx solid rgba(148, 163, 184, 0.35);
  display: inline-flex;
  align-items: center;
  gap: $space-1;
  flex-shrink: 0;
  white-space: nowrap;
  backdrop-filter: blur(6px);
  transition: opacity 0.15s ease, transform 0.1s ease;
}

.nav-sub-btn:active {
  transform: scale(0.97);
  opacity: 0.8;
}

.nav-sub-btn__icon {
  font-size: $font-size-xs;
  color: #64748b;
}

.nav-sub-btn__t {
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  color: #475569;
}

.nav-refresh {
  width: 60rpx;
  height: 60rpx;
  border-radius: $radius-full;
  background: $brand-primary-active;
  box-shadow: $shadow-sm;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-refresh--busy {
  opacity: 0.7;
}

.nav-refresh__icon {
  color: $text-inverse;
  font-size: $font-size-xs;
}

.nav-refresh__icon--spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ---------- 页面容器 ---------- */
.wrap {
  height: auto;
  padding: $space-4 $space-4 0;
}

.wrap:not(.wrap--first) {
  padding-top: 0;
}

/* ---------- 设备头卡 ---------- */
.head {
  display: flex;
  align-items: center;
  background: $bg-surface;
  border-radius: $radius-card-child;
  box-shadow: $shadow-sm;
  padding: $space-4;
}

.head__main {
  flex: 1;
  padding: 0 $space-3;
  overflow: hidden;
}

.head__name {
  display: block;
  font-size: $font-size-md;
  font-weight: $font-weight-heavy;
  color: $text-primary;
  line-height: $line-height-tight;
}

.head__sn {
  display: flex;
  align-items: center;
  min-width: 0;
  margin-top: $space-1;
}

.head__sn-t {
  flex: 0 1 auto;
  min-width: 0;
  font-size: $font-size-2xs;
  color: $text-muted;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.head__sse {
  display: inline-flex;
  align-items: center;
  gap: $space-1;
  flex-shrink: 0;
  margin-left: $space-2;
  padding: $space-1 $space-2;
  border-radius: $radius-full;
  background: $bg-section;
  color: $text-hint;
  font-size: $font-size-2xs;
  line-height: 1;
}

.head__sse .fa-solid {
  font-size: $font-size-2xs;
}

.head__sse--on {
  background: rgba(56, 154, 130, 0.15);
  color: #2b7e6a;
  font-weight: $font-weight-semibold;
}

.head__status {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: $space-1 $space-2;
  border-radius: $radius-full;
  background: $success;
}

.head__status--off {
  background: $bg-section;
}

.head__dot {
  width: $size-badge-sm;
  height: $size-badge-sm;
  border-radius: 50%;
  background: $text-inverse;
  margin-right: $space-1;
}

.head__status--off .head__dot {
  background: $text-disabled;
}

.head__status-t {
  font-size: $font-size-2xs;
  color: $text-inverse;
  font-weight: $font-weight-semibold;
}

.head__status--off .head__status-t {
  color: $text-muted;
}

/* ---------- Vital 卡片 ---------- */
.vital {
  display: flex;
  margin-top: $space-8;
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

.vital:not(:first-child) {
  margin-top: $space-3;
}

/* ---------- 在床状态卡片（左右布局） ---------- */
.bed-card {
  display: flex;
  align-items: stretch;
  margin-top: $space-3;
  background: linear-gradient(145deg, #e8f3ef 0%, $bg-surface 75%);
  border-radius: $radius-card-child;
  box-shadow: $shadow-sm;
  padding: $space-4;
}

.bed-card__left {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.bed-card__right {
  flex: 1;
  min-width: 0;
  margin-left: $space-3;
  padding-left: $space-3;
  border-left: 1rpx solid $border-subtle;
  display: flex;
  flex-direction: column;
}

.bed-card__label {
  font-size: $font-size-2xs;
  font-weight: $font-weight-semibold;
  color: $text-muted;
  margin-bottom: $space-1;
}

.bed-card__empty {
  font-size: $font-size-sm;
  color: $text-muted;
  font-family: $font-family-en;
}

.bed-list {
  display: flex;
  flex-direction: column;
  gap: $space-1;
}

.bed-list__item {
  display: flex;
  align-items: center;
  gap: $space-2;
}

.bed-list__type {
  font-size: $font-size-2xs;
  font-weight: $font-weight-semibold;
  color: #389a82;
  flex-shrink: 0;
}

.bed-list__type--off {
  color: #f2994a;
}

.bed-list__time {
  font-size: $font-size-2xs;
  color: $text-muted;
}

/* ---------- 睡眠卡片（独立卡片，与 bed-card 风格一致） ---------- */
.sleep-card {
  margin-top: $space-3;
  background: linear-gradient(145deg, #f0edf8 0%, $bg-surface 75%);
  border-radius: $radius-card-child;
  box-shadow: $shadow-sm;
  padding: $space-4;
}

.sleep-card .sec-head {
  margin-top: 0;
}

/* 全宽卡片（如异常挣扎）在 wrap 内与上方 vital 行保持间距 */
.wrap > .vital__card:not(:first-child) {
  margin-top: $space-3;
}

.vital__card--alert {
  border: 2rpx solid rgba(241, 85, 51, 0.4);
}

.vital__card--hr {
  background: linear-gradient(145deg, #e8f8f0 0%, $bg-surface 75%);
}

.vital__card--resp {
  background: linear-gradient(145deg, #e8f4f6 0%, $bg-surface 75%);
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
}

.vital__icon--hr { color: $brand-green; }
.vital__icon--resp { color: #8dcdd8; }
.vital__icon--sleep { color: #9b8fc9; }
.vital__icon--presence { color: #389a82; }
.vital__icon--alert { color: #f15533; }

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

.vital__unit {
  margin-left: $space-1;
  font-size: $font-size-2xs;
  color: $text-muted;
}

.vital__sub {
  display: block;
  margin-top: $space-2;
  font-size: $font-size-2xs;
  color: $text-hint;
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

/* ---------- 非雷达设备网格 ---------- */
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

/* ---------- 分区标题（与手环一致） ---------- */
.sec-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: $space-4;
  margin-bottom: $space-3;
}

.sec-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-heavy;
  line-height: $line-height-tight;
  color: $text-primary;
  letter-spacing: 1rpx;
}

.sec-sub {
  font-size: $font-size-xs;
  color: $text-muted;
  margin-top: $space-2;
}

/* ---------- 睡眠（与手环风格一致） ---------- */
.sleep__stats {
  display: flex;
}

.sleep__stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sleep__stat-num {
  font-size: $font-size-lg;
  font-weight: $font-weight-heavy;
  font-family: $font-family-en;
  line-height: 1.1;
}

.sleep__stat-num--deep {
  color: #1e6f5c;
}

.sleep__stat-num--light {
  color: #3eb98f;
}

.sleep__stat-num--wake {
  color: #94a3b8;
}

.sleep__stat-t {
  margin-top: $space-1;
  font-size: $font-size-2xs;
  color: $text-muted;
}

.sleep__strip {
  margin-top: $space-3;
  height: $space-3;
  border-radius: $radius-full;
  overflow: hidden;
  display: flex;
}

.sleep__strip-seg {
  height: 100%;
  transition: width 0.6s ease;
}

.sleep__strip-seg--deep {
  background: #1e6f5c;
}

.sleep__strip-seg--light {
  background: #7dd4bc;
}

.sleep__strip-seg--wake {
  background: #c8d5df;
}

.sleep__strip--empty {
  background: $bg-section;
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
