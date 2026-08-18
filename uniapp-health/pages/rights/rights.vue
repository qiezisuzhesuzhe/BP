<template>
  <view class="hm-page">
    <view class="top">
      <hm-navbar title="我的权益" back-to="/pages/index/index" bg-color="transparent" />
      <view class="top__body">
        <text class="top__t">我的健康管理权益</text>
        <text class="top__d">共 {{ rights.length }} 项服务 · {{ activeCount }} 项使用中</text>
      </view>
    </view>

    <view v-if="rights.length === 0" class="empty">
      <text class="empty__icon fa-solid fa-folder-open"></text>
      <text class="empty__t">还没有已开通的服务</text>
      <text class="empty__d">开通健康管理服务包，获得专属医师团队与 AI 助手陪伴</text>
      <view class="empty__btn" @tap="goHome">
        <text class="empty__btn-t">去看看服务包</text>
      </view>
    </view>

    <view v-else class="list">
      <view v-for="r in rights" :key="r.id" class="card">
        <view class="card__head" :style="{ background: r.accentSoft }">
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
      <text class="tips__t"><text class="fa-solid fa-lightbulb"></text> 服务期内如需调整方案，可在对话中随时告知健康管理师</text>
    </view>
    <view class="hm-safe-bottom"></view>

    <!-- 加企业微信流程弹层 -->
    <view v-if="wecom.show" class="mask">
      <view class="sheet">
        <view v-if="wecom.step === 1" class="sheet__pane">
          <text class="sheet__icon fa-solid fa-user-doctor"></text>
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
  background: transparent;
  padding-bottom: $space-5;
}

.top__body {
  padding: $space-1 $space-4 0;
}

.top__t {
  display: block;
  color: $page-title-color;
  font-size: $page-title-size;
  font-weight: $page-title-weight;
  line-height: $page-title-line-height;
  letter-spacing: 2rpx;
}

.top__d {
  display: block;
  color: $text-muted;
  font-size: $font-size-xs;
  margin-top: $space-1;
}

.empty {
  margin: 0 $space-3;
  background: $bg-surface;
  border-radius: $radius-card;
  box-shadow: $shadow-sm;
  padding: $space-8 $space-5;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty__icon {
  font-size: $size-icon-xl;
  color: $text-disabled;
}

.empty__t {
  font-size: $font-size-md;
  font-weight: $font-weight-bold;
  color: $text-primary;
  margin-top: $space-3;
}

.empty__d {
  font-size: $font-size-xs;
  color: $text-muted;
  text-align: center;
  margin-top: $space-2;
  line-height: $line-height-relaxed;
}

.empty__btn {
  margin-top: $space-5;
  background: $brand-primary;
  border-radius: $radius-full;
  padding: $space-2 $space-6;
}

.empty__btn-t {
  color: $text-inverse;
  font-size: $font-size-sm;
  font-weight: $font-weight-bold;
}

.list {
  padding: 0 $space-3;
  margin-top: 0;
}

.card {
  background: $bg-surface;
  border-radius: $radius-card;
  overflow: hidden;
  box-shadow: $shadow-sm;
  margin-bottom: $space-data-list-gap;
}

.card__head {
  padding: $space-3;
  display: flex;
  align-items: center;
}

.card__head-l {
  flex: 1;
  overflow: hidden;
}

.card__status {
  display: inline-block;
  font-size: $font-size-2xs;
  color: $label-soft-text;
  background: $bg-surface;
  padding: $space-1 $space-2;
  border-radius: $radius-full;
}

.card__name {
  display: block;
  color: $text-primary;
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  margin-top: $space-2;
}

.card__sub {
  display: block;
  color: $text-muted;
  font-size: $font-size-2xs;
  margin-top: $space-1;
}

.card__emoji {
  font-size: $size-icon-lg;
  margin-left: $space-2;
}

.card__body {
  padding: $space-3;
}

.card__rows {
  background: $bg-section;
  border-radius: $radius-card-child;
  padding: $space-1 $space-3;
}

.card__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space-2 0;
  border-bottom: 1rpx solid $border-subtle;
}

.card__row:last-child {
  border-bottom: none;
}

.card__row-l {
  font-size: $font-size-xs;
  color: $text-muted;
}

.card__row-v {
  font-size: $font-size-xs;
  color: $text-primary;
  font-weight: $font-weight-semibold;
}

.prog {
  margin-top: $space-3;
}

.prog__bar {
  height: $space-2;
  border-radius: $radius-full;
  background: $bg-section;
  overflow: hidden;
}

.prog__fill {
  height: 100%;
  border-radius: $radius-full;
}

.prog__t {
  display: block;
  font-size: $font-size-2xs;
  color: $text-disabled;
  margin-top: $space-1;
}

.card__acts {
  display: flex;
  align-items: center;
  margin-top: $space-3;
}

.card__ghost {
  padding: $space-2 $space-4;
  border-radius: $radius-full;
  border: 1rpx solid $text-hint;
  margin-right: $space-2;
}

.card__ghost-t {
  font-size: $font-size-xs;
  color: $text-secondary;
}

.card__cta {
  flex: 1;
  padding: $space-3 0;
  border-radius: $radius-full;
  text-align: center;
  box-shadow: $shadow-sm;
}

.card__cta-t {
  color: $text-inverse;
  font-size: $font-size-sm;
  font-weight: 700;
  letter-spacing: 1rpx;
}

.tips {
  padding: $space-2 $space-5;
  text-align: center;
}

.tips__t {
  font-size: $font-size-2xs;
  color: $text-disabled;
}

.mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: $overlay;
  z-index: $z-modal;
  display: flex;
  align-items: flex-end;
}

.sheet {
  width: 100%;
  background: $bg-surface;
  border-top-left-radius: $radius-card;
  border-top-right-radius: $radius-card;
  padding: $space-5 $space-5 calc(env(safe-area-inset-bottom) + #{$space-6});
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
  padding: $space-4 0 $space-2;
}

.sheet__icon {
  font-size: $size-icon-lg;
  text-align: center;
}

.sheet__t {
  font-size: $font-size-lg;
  font-weight: 700;
  color: $text-primary;
  text-align: center;
  margin-top: $space-2;
}

.sheet__d {
  font-size: $font-size-xs;
  color: $text-muted;
  text-align: center;
  margin-top: $space-2;
  line-height: $line-height-relaxed;
}

.qr {
  margin-top: $space-4;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qr__box {
  width: 300rpx;
  height: 300rpx;
  background: $bg-page-base;
  border: 1rpx solid $border-subtle;
  border-radius: $radius-card-child;
  padding: $space-2;
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
  background: $bg-subtle;
}

.qr__cell--on {
  background: $brand-primary;
}

.qr__logo {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 78rpx;
  height: 78rpx;
  margin: -39rpx 0 0 -39rpx;
  border-radius: 14rpx;
  background: $bg-surface;
  border: 4rpx solid $brand-primary;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr__logo-t {
  font-size: $font-size-lg;
  font-weight: 700;
  color: $brand-primary-active;
}

.qr__hint {
  font-size: $font-size-2xs;
  color: $text-disabled;
  margin-top: $space-2;
}

.who {
  margin-top: $space-4;
  background: $brand-soft;
  border-radius: $radius-card-child;
  padding: $space-3;
  display: flex;
  align-items: center;
}

.who__avatar {
  width: $size-avatar-sm;
  height: $size-avatar-sm;
  border-radius: 50%;
  background: $brand-primary;
  display: flex;
  align-items: center;
  justify-content: center;
}

.who__avatar-t {
  color: $text-inverse;
  font-size: $font-size-md;
  font-weight: 700;
}

.who__main {
  flex: 1;
  padding: 0 $space-2;
}

.who__name {
  display: block;
  font-size: $font-size-sm;
  font-weight: 700;
  color: $brand-primary-active;
}

.who__meta {
  display: block;
  font-size: $font-size-2xs;
  color: $brand-primary-active;
  opacity: 0.8;
  margin-top: $space-1;
}

.who__badge {
  background: $brand-primary;
  border-radius: $radius-full;
  padding: $space-1 $space-2;
}

.who__badge-t {
  color: $text-inverse;
  font-size: $font-size-2xs;
}

.sheet__btn {
  margin-top: $space-4;
  background: $brand-primary;
  border-radius: $radius-full;
  padding: $space-3 0;
  text-align: center;
  box-shadow: $shadow-sm;
  width: 100%;
}

.sheet__btn-t {
  color: $text-inverse;
  font-size: $font-size-md;
  font-weight: 700;
  letter-spacing: 1rpx;
}

.sheet__cancel {
  text-align: center;
  font-size: $font-size-xs;
  color: $text-disabled;
  margin-top: $space-3;
}

.spin {
  width: $size-avatar-sm;
  height: $size-avatar-sm;
  border: 4rpx solid $border-subtle;
  border-top-color: $brand-primary-active;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.ok {
  width: $size-avatar-md;
  height: $size-avatar-md;
  border-radius: 50%;
  background: $success;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pop 0.4s ease-out;
}

.ok__t {
  color: $text-inverse;
  font-size: $font-size-2xl;
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
