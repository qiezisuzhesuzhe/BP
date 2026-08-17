<template>
  <view class="hm-page">
    <view class="top">
      <hm-navbar title="我的权益" back-to="/pages/index/index" bg-color="transparent" text-color="#ffffff" />
      <view class="top__body">
        <text class="top__t">我的健康管理权益</text>
        <text class="top__d">共 {{ rights.length }} 项服务 · {{ activeCount }} 项使用中</text>
      </view>
    </view>

    <view v-if="rights.length === 0" class="empty">
      <text class="empty__icon">🗂️</text>
      <text class="empty__t">还没有已开通的服务</text>
      <text class="empty__d">开通健康管理服务包，获得专属医师团队与 AI 助手陪伴</text>
      <view class="empty__btn" @tap="goHome">
        <text class="empty__btn-t">去看看服务包</text>
      </view>
    </view>

    <view v-else class="list">
      <view v-for="r in rights" :key="r.id" class="card">
        <view class="card__head" :style="{ background: 'linear-gradient(135deg,' + r.accent + ' 0%,' + shade(r.accent) + ' 100%)' }">
          <view class="card__head-l">
            <text class="card__status">{{ statusText(r) }}</text>
            <text class="card__name">{{ r.name }}</text>
            <text class="card__sub">{{ r.subtitle }}</text>
          </view>
          <text class="card__emoji">{{ r.icon }}</text>
        </view>

        <view class="card__body">
          <view class="card__rows">
            <view class="card__row">
              <text class="card__row-l">服务时长</text>
              <text class="card__row-v">{{ r.duration }}</text>
            </view>
            <view class="card__row">
              <text class="card__row-l">开通时间</text>
              <text class="card__row-v">{{ r.startAt }}</text>
            </view>
            <view class="card__row">
              <text class="card__row-l">有效期至</text>
              <text class="card__row-v">{{ r.endAt }}</text>
            </view>
            <view class="card__row">
              <text class="card__row-l">剩余天数</text>
              <text class="card__row-v" :style="{ color: r.accent, fontWeight: 700 }">{{ remain(r) }}</text>
            </view>
          </view>

          <view class="prog">
            <view class="prog__bar">
              <view class="prog__fill" :style="{ width: percent(r) + '%', background: r.accent }"></view>
            </view>
            <text class="prog__t">已使用 {{ r.usedDays }} / {{ r.totalDays }} 天</text>
          </view>

          <view class="card__acts">
            <view class="card__ghost" @tap="goDetail(r.id)">
              <text class="card__ghost-t">权益详情</text>
            </view>
            <view class="card__cta" :style="{ background: r.accent }" @tap="onUse(r)">
              <text class="card__cta-t">{{ r.chatStarted ? '继续健康对话' : '立即使用' }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="tips">
      <text class="tips__t">💡 服务期内如需调整方案，可在对话中随时告知健康管理师</text>
    </view>
    <view class="hm-safe-bottom"></view>

    <!-- 加企业微信流程弹层 -->
    <view v-if="wecom.show" class="mask">
      <view class="sheet">
        <view v-if="wecom.step === 1" class="sheet__pane">
          <text class="sheet__icon">👨‍⚕️</text>
          <text class="sheet__t">添加您的专属健康管理师</text>
          <text class="sheet__d">添加企业微信后，管理师将协助您完成首次健康问询，并全程跟踪服务方案</text>

          <view class="qr">
            <view class="qr__box">
              <view v-for="n in 9" :key="n" class="qr__cell" :class="{ 'qr__cell--on': qrOn(n) }"></view>
              <view class="qr__logo">
                <text class="qr__logo-t">企</text>
              </view>
            </view>
            <text class="qr__hint">长按识别二维码 · 企业微信认证</text>
          </view>

          <view class="who">
            <view class="who__avatar">
              <text class="who__avatar-t">李</text>
            </view>
            <view class="who__main">
              <text class="who__name">李静 · 高级健康管理师</text>
              <text class="who__meta">中级营养师 / 8 年慢病管理经验</text>
            </view>
            <view class="who__badge">
              <text class="who__badge-t">认证</text>
            </view>
          </view>

          <view class="sheet__btn" @tap="stepAdd">
            <text class="sheet__btn-t">已保存二维码，添加好友</text>
          </view>
          <text class="sheet__cancel" @tap="closeWecom">稍后再说</text>
        </view>

        <view v-else-if="wecom.step === 2" class="sheet__pane sheet__pane--center">
          <view class="spin"></view>
          <text class="sheet__t">正在发送好友申请…</text>
          <text class="sheet__d">管理师将在 1 分钟内通过您的申请</text>
        </view>

        <view v-else class="sheet__pane sheet__pane--center">
          <view class="ok">
            <text class="ok__t">✓</text>
          </view>
          <text class="sheet__t">已添加成功</text>
          <text class="sheet__d">李静 已通过您的好友申请，即将进入首次健康问询</text>
          <view class="sheet__btn" @tap="enterChat">
            <text class="sheet__btn-t">开始首次问询</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      wecom: { show: false, step: 1, rightId: '' },
      timers: []
    }
  },
  computed: {
    rights() {
      return this.$store.state.rights
    },
    activeCount() {
      return this.rights.filter((r) => r.status === 'active').length
    }
  },
  onUnload() {
    this.timers.forEach((t) => clearTimeout(t))
  },
  methods: {
    delay(fn, ms) {
      this.timers.push(setTimeout(fn, ms))
    },
    statusText(r) {
      if (r.status !== 'active') return '已到期'
      return r.chatStarted ? '服务进行中' : '待开始使用'
    },
    remain(r) {
      const n = Math.ceil((r.endTs - Date.now()) / 86400000)
      return n > 0 ? n + ' 天' : '已到期'
    },
    percent(r) {
      if (!r.totalDays) return 0
      const p = Math.round((r.usedDays / r.totalDays) * 100)
      return Math.min(100, Math.max(2, p))
    },
    shade(hex) {
      const n = parseInt(hex.slice(1), 16)
      const r = Math.max(0, ((n >> 16) & 255) - 40)
      const g = Math.max(0, ((n >> 8) & 255) - 40)
      const b = Math.max(0, (n & 255) - 30)
      return 'rgb(' + r + ',' + g + ',' + b + ')'
    },
    qrOn(n) {
      return [1, 2, 3, 4, 6, 7, 9].indexOf(n) > -1
    },
    onUse(r) {
      if (r.chatStarted || r.wecomAdded) {
        uni.navigateTo({ url: '/pages/chat/chat?rightId=' + r.id })
        return
      }
      this.wecom = { show: true, step: 1, rightId: r.id }
    },
    stepAdd() {
      this.wecom.step = 2
      this.delay(() => {
        this.wecom.step = 3
        this.$store.dispatch('bindWecom', this.wecom.rightId)
      }, 1800)
    },
    enterChat() {
      const id = this.wecom.rightId
      this.wecom.show = false
      uni.navigateTo({ url: '/pages/chat/chat?rightId=' + id })
    },
    closeWecom() {
      this.wecom.show = false
    },
    goDetail(id) {
      uni.navigateTo({ url: '/pages/rights/detail?id=' + id })
    },
    goHome() {
      uni.reLaunch({ url: '/pages/index/index' })
    }
  }
}
</script>

<style lang="scss" scoped>
.top {
  background: linear-gradient(160deg, $teal-800 0%, $teal-700 55%, $teal-500 100%);
  padding-bottom: 90rpx;
  border-bottom-left-radius: $radius-lg;
  border-bottom-right-radius: $radius-lg;
}

.top__body {
  padding: 10rpx 36rpx 0;
}

.top__t {
  display: block;
  color: #fff;
  font-size: 42rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
}

.top__d {
  display: block;
  color: rgba(255, 255, 255, 0.76);
  font-size: 24rpx;
  margin-top: 10rpx;
}

.empty {
  margin: -60rpx 28rpx 0;
  background: #fff;
  border-radius: $radius-md;
  box-shadow: $shadow-md;
  padding: 70rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty__icon {
  font-size: 84rpx;
}

.empty__t {
  font-size: 32rpx;
  font-weight: 700;
  color: $ink-900;
  margin-top: 24rpx;
}

.empty__d {
  font-size: 24rpx;
  color: $ink-500;
  text-align: center;
  margin-top: 12rpx;
  line-height: 1.7;
}

.empty__btn {
  margin-top: 36rpx;
  background: $teal-700;
  border-radius: 999rpx;
  padding: 20rpx 56rpx;
}

.empty__btn-t {
  color: #fff;
  font-size: 27rpx;
  font-weight: 700;
}

.list {
  padding: 0 28rpx;
  margin-top: -60rpx;
}

.card {
  background: #fff;
  border-radius: $radius-md;
  overflow: hidden;
  box-shadow: $shadow-md;
  margin-bottom: 28rpx;
}

.card__head {
  padding: 28rpx;
  display: flex;
  align-items: center;
}

.card__head-l {
  flex: 1;
  overflow: hidden;
}

.card__status {
  display: inline-block;
  font-size: 19rpx;
  color: #fff;
  background: rgba(255, 255, 255, 0.24);
  padding: 5rpx 14rpx;
  border-radius: 999rpx;
}

.card__name {
  display: block;
  color: #fff;
  font-size: 36rpx;
  font-weight: 700;
  margin-top: 14rpx;
}

.card__sub {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  font-size: 21rpx;
  margin-top: 8rpx;
}

.card__emoji {
  font-size: 68rpx;
  margin-left: 16rpx;
}

.card__body {
  padding: 24rpx 28rpx 28rpx;
}

.card__rows {
  background: $warm-50;
  border-radius: $radius-sm;
  padding: 8rpx 20rpx;
}

.card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 0;
  border-bottom: 1rpx solid $warm-200;
}

.card__row:last-child {
  border-bottom: none;
}

.card__row-l {
  font-size: 24rpx;
  color: $ink-500;
}

.card__row-v {
  font-size: 25rpx;
  color: $ink-900;
  font-weight: 600;
}

.prog {
  margin-top: 22rpx;
}

.prog__bar {
  height: 12rpx;
  border-radius: 999rpx;
  background: $warm-200;
  overflow: hidden;
}

.prog__fill {
  height: 100%;
  border-radius: 999rpx;
}

.prog__t {
  display: block;
  font-size: 21rpx;
  color: $ink-400;
  margin-top: 10rpx;
}

.card__acts {
  display: flex;
  align-items: center;
  margin-top: 28rpx;
}

.card__ghost {
  padding: 20rpx 34rpx;
  border-radius: 999rpx;
  border: 1rpx solid $ink-300;
  margin-right: 18rpx;
}

.card__ghost-t {
  font-size: 26rpx;
  color: $ink-700;
}

.card__cta {
  flex: 1;
  padding: 22rpx 0;
  border-radius: 999rpx;
  text-align: center;
  box-shadow: $shadow-sm;
}

.card__cta-t {
  color: #fff;
  font-size: 29rpx;
  font-weight: 700;
  letter-spacing: 1rpx;
}

.tips {
  padding: 12rpx 40rpx 20rpx;
  text-align: center;
}

.tips__t {
  font-size: 21rpx;
  color: $ink-400;
}

.mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(13, 40, 42, 0.55);
  z-index: 200;
  display: flex;
  align-items: flex-end;
}

.sheet {
  width: 100%;
  background: #fff;
  border-top-left-radius: $radius-lg;
  border-top-right-radius: $radius-lg;
  padding: 44rpx 40rpx calc(48rpx + env(safe-area-inset-bottom));
  animation: rise 0.28s ease-out;
}

@keyframes rise {
  from {
    transform: translateY(60rpx);
    opacity: 0.4;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.sheet__pane {
  display: flex;
  flex-direction: column;
}

.sheet__pane--center {
  align-items: center;
  padding: 30rpx 0 20rpx;
}

.sheet__icon {
  font-size: 64rpx;
  text-align: center;
}

.sheet__t {
  font-size: 34rpx;
  font-weight: 700;
  color: $ink-900;
  text-align: center;
  margin-top: 20rpx;
}

.sheet__d {
  font-size: 24rpx;
  color: $ink-500;
  text-align: center;
  margin-top: 12rpx;
  line-height: 1.7;
}

.qr {
  margin-top: 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qr__box {
  width: 300rpx;
  height: 300rpx;
  background: $warm-50;
  border: 2rpx solid $warm-200;
  border-radius: $radius-sm;
  padding: 20rpx;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: space-between;
  position: relative;
}

.qr__cell {
  width: 78rpx;
  height: 78rpx;
  border-radius: 10rpx;
  background: $warm-100;
}

.qr__cell--on {
  background: $teal-800;
}

.qr__logo {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 78rpx;
  height: 78rpx;
  margin: -39rpx 0 0 -39rpx;
  border-radius: 14rpx;
  background: #fff;
  border: 4rpx solid $teal-700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr__logo-t {
  font-size: 34rpx;
  font-weight: 700;
  color: $teal-700;
}

.qr__hint {
  font-size: 21rpx;
  color: $ink-400;
  margin-top: 16rpx;
}

.who {
  margin-top: 30rpx;
  background: $teal-100;
  border-radius: $radius-sm;
  padding: 22rpx;
  display: flex;
  align-items: center;
}

.who__avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: $teal-700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.who__avatar-t {
  color: #fff;
  font-size: 30rpx;
  font-weight: 700;
}

.who__main {
  flex: 1;
  padding: 0 18rpx;
}

.who__name {
  display: block;
  font-size: 27rpx;
  font-weight: 700;
  color: $teal-900;
}

.who__meta {
  display: block;
  font-size: 21rpx;
  color: $teal-800;
  opacity: 0.8;
  margin-top: 6rpx;
}

.who__badge {
  background: $teal-700;
  border-radius: 999rpx;
  padding: 6rpx 16rpx;
}

.who__badge-t {
  color: #fff;
  font-size: 19rpx;
}

.sheet__btn {
  margin-top: 34rpx;
  background: $teal-700;
  border-radius: 999rpx;
  padding: 26rpx 0;
  text-align: center;
  box-shadow: $shadow-sm;
  width: 100%;
}

.sheet__btn-t {
  color: #fff;
  font-size: 30rpx;
  font-weight: 700;
  letter-spacing: 1rpx;
}

.sheet__cancel {
  text-align: center;
  font-size: 25rpx;
  color: $ink-400;
  margin-top: 26rpx;
}

.spin {
  width: 76rpx;
  height: 76rpx;
  border: 6rpx solid $warm-200;
  border-top-color: $teal-700;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.ok {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  background: $sage-500;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pop 0.4s ease-out;
}

.ok__t {
  color: #fff;
  font-size: 52rpx;
  font-weight: 700;
}

@keyframes pop {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  60% {
    transform: scale(1.14);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}
</style>
