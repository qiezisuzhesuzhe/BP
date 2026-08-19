<template>
  <view class="hm-page">
    <hm-navbar title="手环状态" bg-color="transparent">
      <view slot="right">
        <view class="nav-refresh" :class="{ 'nav-refresh--busy': refreshing }" @tap="doRefresh">
          <text class="fa-solid fa-rotate nav-refresh__icon" :class="{ 'nav-refresh__icon--spin': refreshing }"></text>
        </view>
      </view>
    </hm-navbar>

    <!-- 设备头卡：点左上角手环图标可切换「上报地址」区块显示/隐藏 -->
    <view class="wrap wrap--first">
      <view class="head">
        <view class="head__icon" @tap="toggleAddr">
          <text class="fa-solid fa-heart-circle-check head__icon-t"></text>
          <text class="head__icon-eye" :class="addrVisible ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"></text>
        </view>
        <view class="head__main">
          <text class="head__name">{{ device ? device.name : '智能手环 - 血压款' }}</text>
          <text class="head__sn">{{ device ? device.model : '' }} · {{ deviceid || '未绑定' }}</text>
        </view>
        <view class="head__status" :class="{ 'head__status--off': !online }">
          <view class="head__dot"></view>
          <text class="head__status-t">{{ onlineText }}</text>
        </view>
      </view>
    </view>

    <!-- 心率 -->
    <view class="wrap">
      <view class="hr">
        <view class="hr__top">
          <view class="hr__label">
            <text class="fa-solid fa-heart-pulse hr__label-icon"></text>
            <text class="hr__label-t">实时心率</text>
          </view>
        </view>
        <view class="hr__value">
          <text class="hr__num">{{ latest.hr != null ? latest.hr : '--' }}</text>
          <text class="hr__unit">bpm</text>
        </view>
        <text class="hr__tip">测量自 {{ measuredAt }}</text>
      </view>
    </view>

    <!-- 血压 -->
    <view class="wrap">
      <view class="sec-head">
        <text class="sec-title">血压</text>
        <view class="bp-tag" :style="{ background: bp.bg, color: bp.color }">
          <text class="bp-tag__dot" :style="{ background: bp.color }"></text>
          <text class="bp-tag__t">{{ bp.label }}</text>
        </view>
      </view>
      <view class="bp">
        <view class="bp__col">
          <text class="bp__num">{{ latest.sbp != null ? latest.sbp : '--' }}</text>
          <text class="bp__t">收缩压 mmHg</text>
        </view>
        <view class="bp__divider"></view>
        <view class="bp__col">
          <text class="bp__num">{{ latest.dbp != null ? latest.dbp : '--' }}</text>
          <text class="bp__t">舒张压 mmHg</text>
        </view>
      </view>
    </view>

    <!-- 步数 -->
    <view class="wrap">
      <view class="sec-head">
        <text class="sec-title">今日活动</text>
        <text class="sec-sub">每 1 分钟自动刷新</text>
      </view>
      <view class="steps">
        <view class="steps__main">
          <text class="steps__num">{{ steps != null ? fmt(steps) : '--' }}</text>
          <text class="steps__unit">步</text>
        </view>
        <view class="steps__bar">
          <view class="steps__bar-in" :style="{ width: stepsPct + '%' }"></view>
        </view>
        <view class="steps__meta">
          <text class="steps__meta-item">距离 {{ latest.distance != null ? latest.distance + ' m' : '--' }}</text>
          <text class="steps__meta-item">目标 10,000 步</text>
          <text v-if="latest.battery != null" class="steps__meta-item">电量 {{ latest.battery * 10 }}%</text>
        </view>
      </view>
    </view>

    <!-- 上报地址（点头卡图标切换显示/隐藏） -->
    <view v-if="addrVisible" class="wrap">
      <view class="sec-head">
        <text class="sec-title">上报地址</text>
        <text class="sec-sub">手环端需配置该地址</text>
      </view>
      <view class="addr">
        <view class="addr__row">
          <text class="fa-solid fa-cloud-arrow-up addr__icon"></text>
          <text class="addr__url" :class="{ 'addr__url--off': !address }">{{ address || '未获取到地址' }}</text>
          <text v-if="addressChanged" class="addr__tag">已变化</text>
        </view>
        <text class="addr__tip">进入页面/每次刷新自动核对，隧道重启导致地址变化会标记「已变化」</text>
      </view>
    </view>

    <!-- 发送消息 -->
    <view class="wrap">
      <view class="sec-head">
        <text class="sec-title">发送消息</text>
        <text class="sec-sub">推送到手环屏幕</text>
      </view>
      <view class="msg">
        <input
          class="msg__input"
          v-model="msgTitle"
          maxlength="5"
          placeholder="标题（选填，≤15字节）"
          placeholder-class="msg__ph"
        />
        <textarea
          class="msg__area"
          v-model="msgText"
          maxlength="80"
          placeholder="消息内容（≤240字节），发送后在手环上显示"
          placeholder-class="msg__ph"
        />
        <view class="msg__presets">
          <view v-for="p in presets" :key="p" class="msg__chip" @tap="sendPreset(p)">
            <text class="msg__chip-t">{{ p }}</text>
          </view>
        </view>
        <view class="msg__bar">
          <text class="msg__len">{{ msgBytes }}/240 字节</text>
          <view class="msg__btn" :class="{ 'msg__btn--busy': msgSending }" @tap="sendMsg">
            <text class="fa-solid fa-paper-plane msg__btn-icon"></text>
            <text class="msg__btn-t">{{ msgSending ? '发送中…' : '发送' }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部状态条 -->
    <view class="foot">
      <view class="foot__left">
        <view class="foot__dot" :class="{ 'foot__dot--ok': online }"></view>
        <text class="foot__t">{{ online ? '已连接接收服务' : '等待手环数据上报…' }}</text>
      </view>
      <view class="foot__right">
        <text class="foot__sync">上次同步 {{ syncText }}</text>
      </view>
    </view>
    <view class="hm-safe-bottom"></view>
  </view>
</template>

<script>
import { fetchBandLatest, fetchBandAddress, sendBandMessage, bpLevel } from '@/common/band.js'

const POLL_MS = 60 * 1000 // 每 1 分钟刷新

export default {
  data() {
    return {
      id: '',
      deviceid: '',
      latest: {},
      lastSyncAt: 0,
      timer: null,
      refreshing: false,
      online: true,
      address: '',
      addressChanged: false,
      addrVisible: true,
      msgTitle: '',
      msgText: '',
      msgSending: false,
      presets: ['记得测量血压', '记得按时吃药', '该起身活动了', '注意安全早点回家', '记得喝水', '不舒服请按 SOS']
    }
  },
  computed: {
    device() {
      return this.$store.getters.deviceById(this.id) || null
    },
    bp() {
      const lv = bpLevel(this.latest.sbp, this.latest.dbp)
      const bgMap = { normal: '#ddf7ed', 'normal-h': '#fdf4ed', high: '#fdeeee', none: '#f2f7fa' }
      const colorMap = { normal: '#27ae60', 'normal-h': '#f2994a', high: '#eb5757', none: '#94a3b8' }
      return { label: lv.label, color: colorMap[lv.key], bg: bgMap[lv.key] }
    },
    steps() {
      return this.latest.steps != null ? this.latest.steps : null
    },
    stepsPct() {
      if (this.steps == null) return 0
      return Math.min(100, Math.round((this.steps / 10000) * 100))
    },
    measuredAt() {
      if (!this.latest.ts) return '--'
      const d = new Date(this.latest.ts * 1000)
      const p = (n) => (n < 10 ? '0' + n : n)
      return p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds())
    },
    syncText() {
      if (!this.lastSyncAt) return '--'
      const s = Math.max(0, Math.round((Date.now() - this.lastSyncAt) / 1000))
      if (s < 60) return s + ' 秒前'
      return Math.round(s / 60) + ' 分钟前'
    },
    onlineText() {
      return this.online ? '在线' : '离线'
    },
    msgBytes() {
      return this.byteLen(this.msgText)
    }
  },
  onLoad(options) {
    this.id = (options && options.id) || ''
    this.ensureDevice()
  },
  onShow() {
    this.ensureDevice()
    this.load()
    this.timer = setInterval(() => this.load(), POLL_MS)
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
    // 从 store 设备记录取 deviceid（扫码绑定跳转/页面重进时兜底）
    ensureDevice() {
      if (this.deviceid) return
      const dev = this.$store.getters.deviceById(this.id)
      if (dev && dev.deviceid) this.deviceid = dev.deviceid
    },
    fmt(n) {
      return String(n == null ? 0 : n).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    // UTF-8 字节数（手环消息标题 ≤15B、内容 ≤240B）
    byteLen(s) {
      const str = String(s || '')
      let n = 0
      for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i)
        n += c > 0x7f ? (c > 0x7ff ? 3 : 2) : 1
      }
      return n
    },
    // 点头卡图标：切换「上报地址」区块显示/隐藏
    toggleAddr() {
      this.addrVisible = !this.addrVisible
    },
    // 发送消息到手环（entservice 指令下发）
    sendMsg() {
      this.doSend((this.msgTitle || '').trim(), (this.msgText || '').trim())
    },
    // 快捷提醒语：一键填充并发送
    sendPreset(p) {
      this.doSend('安康提醒', p)
    },
    async doSend(title, text) {
      if (!text) {
        uni.showToast({ title: '请输入消息内容', icon: 'none' })
        return
      }
      if (!this.deviceid) {
        uni.showToast({ title: '未绑定设备号', icon: 'none' })
        return
      }
      if (this.byteLen(title) > 15) {
        uni.showToast({ title: '标题不能超过15字节', icon: 'none' })
        return
      }
      if (this.byteLen(text) > 240) {
        uni.showToast({ title: '内容不能超过240字节', icon: 'none' })
        return
      }
      this.msgSending = true
      const err = await sendBandMessage(this.deviceid, title, text)
      this.msgSending = false
      uni.showToast({ title: err ? err : '消息已发送到手环', icon: 'none' })
      if (!err) {
        this.msgTitle = ''
        this.msgText = ''
      }
    },
    // 手动刷新：loading 反馈 + 结果提示
    async doRefresh() {
      if (this.refreshing) return
      this.refreshing = true
      await this.load()
      this.refreshing = false
      if (!this.deviceid) {
        uni.showToast({ title: '未绑定设备号', icon: 'none' })
        return
      }
      const l = this.latest
      const hasData = !!(l && (l.hr != null || l.sbp != null || l.dbp != null || l.steps != null))
      uni.showToast({
        title: hasData ? '已刷新，数据已更新' : '暂无新数据，等待手环上报',
        icon: 'none'
      })
    },
    // 每次刷新都核对当前上报地址；与上次不同则标记"已变化"
    refreshAddress() {
      fetchBandAddress().then((info) => {
        if (!info || !info.public) {
          this.address = ''
          return
        }
        const prev = uni.getStorageSync('ankang_band_address')
        this.address = info.public
        this.addressChanged = !!(prev && prev !== info.public)
        uni.setStorageSync('ankang_band_address', info.public)
      })
    },
    async load() {
      this.refreshAddress()
      if (!this.deviceid) return
      const latest = await fetchBandLatest(this.deviceid)
      this.latest = latest || {}
      this.lastSyncAt = Date.now()
      // 只有后端真实上报过数据才视为在线
      const l = this.latest
      this.online = !!(l && (l.hr != null || l.sbp != null || l.dbp != null || l.steps != null))
      // 回写本地 store，保持设备列表一致
      if (this.id) {
        this.$store.commit('UPDATE_DEVICE_DATA', {
          id: this.id,
          data: {
            sys: l.sbp,
            dia: l.dbp,
            heartRate: l.hr,
            steps: l.steps,
            battery: l.battery
          },
          lastSync: this.syncText
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/* ---------- 页面容器 ---------- */
.wrap {
  height: auto;
  padding: $space-4 $space-4 0;
}

/* 非首个容器顶部贴齐：卡片间距由自身撑开，区块标题由 sec-head 撑开 */
.wrap:not(.wrap--first) {
  padding-top: 0;
}

/* ---------- 区块标题 ---------- */
.sec-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: $space-sec-head-top;
  margin-bottom: $space-sec-head-bottom;
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

.head {
  display: flex;
  align-items: center;
  background: $bg-surface;
  border-radius: $radius-card-child;
  box-shadow: $shadow-sm;
  padding: $space-4;
}

.head__icon {
  position: relative;
  width: $size-icon-xl;
  height: $size-icon-xl;
  border-radius: $radius-card-child;
  background: $label-soft-bg;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* 图标右下角小徽标：眼睛=地址区块可见，闭眼=隐藏 */
.head__icon-eye {
  position: absolute;
  right: -6rpx;
  bottom: -6rpx;
  width: 34rpx;
  height: 34rpx;
  border-radius: $radius-full;
  background: $brand-primary-active;
  color: $text-inverse;
  font-size: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4rpx solid $bg-surface;
  box-sizing: border-box;
}

.head__icon-t {
  font-size: $font-size-xl;
  color: $brand-primary-active;
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
  display: block;
  font-size: $font-size-2xs;
  color: $text-muted;
  margin-top: $space-1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

/* 心率卡 */
.hr {
  margin-top: $space-4;
  background: linear-gradient(140deg, $brand-primary-hover 0%, $brand-green 100%);
  border-radius: $radius-card-child;
  padding: $space-4;
  box-shadow: $shadow-md;
}

.hr__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hr__label {
  display: flex;
  align-items: center;
}

.hr__label-icon {
  color: rgba(255, 255, 255, 0.9);
  font-size: $font-size-sm;
  margin-right: $space-2;
}

.hr__label-t {
  color: rgba(255, 255, 255, 0.92);
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
}

.hr__value {
  display: flex;
  align-items: baseline;
  margin-top: $space-3;
}

.hr__num {
  font-size: $font-size-3xl;
  font-weight: $font-weight-heavy;
  color: $text-inverse;
  font-family: $font-family-en;
  line-height: 1;
}

.hr__unit {
  margin-left: $space-2;
  font-size: $font-size-sm;
  color: rgba(255, 255, 255, 0.85);
}

.hr__tip {
  display: block;
  margin-top: $space-2;
  font-size: $font-size-2xs;
  color: rgba(255, 255, 255, 0.7);
}

/* 血压卡 */
.bp {
  display: flex;
  align-items: center;
  background: $bg-surface;
  border-radius: $radius-card-child;
  box-shadow: $shadow-sm;
  padding: $space-4 0;
}

.bp__col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bp__num {
  font-size: $font-size-2xl;
  font-weight: $font-weight-heavy;
  color: $text-primary;
  font-family: $font-family-en;
  line-height: 1;
}

.bp__t {
  margin-top: $space-2;
  font-size: $font-size-2xs;
  color: $text-muted;
}

.bp__divider {
  width: 1rpx;
  height: $size-icon-md;
  background: $bg-section;
}

.bp-tag {
  display: flex;
  align-items: center;
  padding: $space-1 $space-3;
  border-radius: $radius-full;
  font-size: $font-size-2xs;
  font-weight: $font-weight-semibold;
}

.bp-tag__dot {
  width: $size-badge-sm;
  height: $size-badge-sm;
  border-radius: 50%;
  margin-right: $space-1;
}

/* 步数卡 */
.steps {
  background: $bg-surface;
  border-radius: $radius-card-child;
  box-shadow: $shadow-sm;
  padding: $space-4;
}

.steps__main {
  display: flex;
  align-items: baseline;
}

.steps__num {
  font-size: $font-size-2xl;
  font-weight: $font-weight-heavy;
  color: $text-primary;
  font-family: $font-family-en;
  line-height: 1;
}

.steps__unit {
  margin-left: $space-2;
  font-size: $font-size-xs;
  color: $text-muted;
}

.steps__bar {
  margin-top: $space-3;
  height: $space-2;
  border-radius: $radius-full;
  background: $bg-section;
  overflow: hidden;
}

.steps__bar-in {
  height: 100%;
  border-radius: $radius-full;
  background: linear-gradient(90deg, $brand-primary, $brand-primary-hover);
  transition: width 0.6s ease;
}

.steps__meta {
  margin-top: $space-2;
  display: flex;
  justify-content: space-between;
}

.steps__meta-item {
  font-size: $font-size-2xs;
  color: $text-muted;
}

/* 上报地址卡 */
.addr {
  background: $bg-surface;
  border-radius: $radius-card-child;
  box-shadow: $shadow-sm;
  padding: $space-4;
}

.addr__row {
  display: flex;
  align-items: center;
}

.addr__icon {
  font-size: $font-size-sm;
  color: $brand-primary-active;
  margin-right: $space-2;
  flex-shrink: 0;
}

.addr__url {
  flex: 1;
  font-size: $font-size-sm;
  font-family: $font-family-en;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.addr__url--off {
  color: $text-muted;
}

.addr__tag {
  flex-shrink: 0;
  margin-left: $space-2;
  padding: $space-1 $space-2;
  border-radius: $radius-full;
  font-size: $font-size-2xs;
  font-weight: $font-weight-semibold;
  color: #f2994a;
  background: #fdf4ed;
}

.addr__tip {
  display: block;
  margin-top: $space-2;
  font-size: $font-size-2xs;
  color: $text-muted;
}

/* 底部状态 */
.foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space-4 $space-4 0;
}

.foot__left {
  display: flex;
  align-items: center;
}

.foot__dot {
  width: $size-badge-sm;
  height: $size-badge-sm;
  border-radius: 50%;
  background: $text-hint;
  margin-right: $space-2;
}

.foot__dot--ok {
  background: $success;
}

.foot__t {
  font-size: $font-size-2xs;
  color: $text-muted;
}

.foot__sync {
  font-size: $font-size-2xs;
  color: $text-disabled;
}

.foot__right {
  display: flex;
  align-items: center;
}

/* 顶部右上角刷新按钮 */
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
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 发送消息卡 */
.msg {
  background: $bg-surface;
  border-radius: $radius-card-child;
  box-shadow: $shadow-sm;
  padding: $space-4;
}

.msg__input {
  height: $size-input-height;
  background: $bg-section;
  border-radius: $radius-card-child;
  padding: 0 $space-3;
  font-size: $font-size-sm;
  color: $text-primary;
}

.msg__area {
  margin-top: $space-3;
  width: 100%;
  height: 180rpx;
  background: $bg-section;
  border-radius: $radius-card-child;
  padding: $space-3;
  font-size: $font-size-sm;
  color: $text-primary;
  box-sizing: border-box;
  line-height: $line-height-relaxed;
}

.msg__ph {
  color: $text-hint;
  font-size: $font-size-xs;
}

/* 快捷提醒语 */
.msg__presets {
  margin-top: $space-3;
  display: flex;
  flex-wrap: wrap;
}

.msg__chip {
  margin: 0 $space-2 $space-2 0;
  padding: $space-1 $space-3;
  border-radius: $radius-full;
  background: $bg-section;
  border: 1rpx solid $border-subtle;
}

.msg__chip-t {
  font-size: $font-size-2xs;
  color: $text-secondary;
}

.msg__bar {
  margin-top: $space-3;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.msg__len {
  font-size: $font-size-2xs;
  color: $text-muted;
}

.msg__btn {
  display: flex;
  align-items: center;
  background: $brand-primary-active;
  border-radius: $radius-full;
  padding: $space-2 $space-5;
}

.msg__btn--busy {
  opacity: 0.7;
}

.msg__btn-icon {
  color: $text-inverse;
  font-size: $font-size-2xs;
  margin-right: $space-1;
}

.msg__btn-t {
  color: $text-inverse;
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
}
</style>
