<template>
  <view class="hm-page">
    <view class="top">
      <hm-navbar title="我的" :show-back="false" bg-color="transparent" />
      <view class="top__body">
        <view class="who" @tap="goProfile">
          <view class="who__avatar">
            <text class="who__avatar-t">{{ profile.avatarText }}</text>
          </view>
          <view class="who__main">
            <text class="who__name">{{ profile.name }}</text>
            <text class="who__meta">{{ profile.gender }} · {{ profile.age }}岁 · {{ profile.city }}</text>
          </view>
          <text class="who__go">›</text>
        </view>
        <view class="tag-row">
          <view v-for="(t, i) in profile.tags" :key="i" class="tag">
            <text class="tag__t">{{ t }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="hm-card stat">
      <view class="stat__i" @tap="goRights">
        <text class="stat__n">{{ rightsCount }}</text>
        <text class="stat__l">我的权益</text>
      </view>
      <view class="stat__sep"></view>
      <view class="stat__i" @tap="goOrders">
        <text class="stat__n">{{ orderCount }}</text>
        <text class="stat__l">我的订单</text>
      </view>
      <view class="stat__sep"></view>
      <view class="stat__i" @tap="goMsg">
        <text class="stat__n">{{ unreadCount }}</text>
        <text class="stat__l">未读消息</text>
      </view>
    </view>

    <view v-if="activeRight" class="hm-card cur" @tap="goRightDetail">
      <view class="cur__icon" :style="{ background: activeRight.accentSoft }">
        <text class="cur__icon-t" :class="activeRight.icon"></text>
      </view>
      <view class="cur__main">
        <text class="cur__name">{{ activeRight.name }}</text>
        <text class="cur__meta">有效期至 {{ activeRight.endAt }} · 剩余 {{ remainDays }}</text>
      </view>
      <text class="cur__go" :style="{ color: activeRight.accent }">详情 ›</text>
    </view>

    <view class="sec">
      <text class="hm-sec-title">常用功能</text>
    </view>
    <view class="hm-card menu">
      <view v-for="(it, i) in menu" :key="i" class="mi" :class="{ 'mi--last': i === menu.length - 1 }" @tap="onMenu(it)">
        <view class="mi__icon" :style="{ background: it.bg }">
          <text class="mi__icon-t" :class="it.icon"></text>
        </view>
        <view class="mi__main">
          <text class="mi__t">{{ it.label }}</text>
          <text class="mi__d">{{ it.desc }}</text>
        </view>
        <text v-if="it.badge" class="mi__badge">{{ it.badge }}</text>
        <text class="mi__go">›</text>
      </view>
    </view>

    <view class="sec">
      <text class="hm-sec-title">关于与设置</text>
    </view>
    <view class="hm-card menu">
      <view v-for="(it, i) in about" :key="i" class="mi" :class="{ 'mi--last': i === about.length - 1 }" @tap="onMenu(it)">
        <view class="mi__icon" :style="{ background: it.bg }">
          <text class="mi__icon-t" :class="it.icon"></text>
        </view>
        <view class="mi__main">
          <text class="mi__t">{{ it.label }}</text>
          <text class="mi__d">{{ it.desc }}</text>
        </view>
        <text class="mi__go">›</text>
      </view>
    </view>

    <view class="foot">
      <text class="foot__t">安康健康管理 · 演示版本 v1.0.0</text>
      <text class="foot__d">本应用为产品演示用途，不提供真实医疗诊疗服务</text>
    </view>
    <view class="hm-safe-bottom"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      about: [
        { key: 'agreement', icon: 'fa-solid fa-file-lines', bg: '#f2f7fa', label: '用户协议与隐私政策', desc: '服务条款、健康数据使用说明' },
        { key: 'service', icon: 'fa-solid fa-phone', bg: '#ddf7ed', label: '联系客服', desc: '工作日 09:00 - 21:00' },
        { key: 'reset', icon: 'fa-solid fa-recycle', bg: '#fdf4ed', label: '清空演示数据', desc: '恢复到初始状态，便于重新体验' }
      ]
    }
  },
  computed: {
    profile() {
      return this.$store.state.profile
    },
    unreadCount() {
      return this.$store.getters.unreadCount
    },
    activeRight() {
      return this.$store.getters.activeRight
    },
    rightsCount() {
      return this.$store.state.rights.length
    },
    orderCount() {
      return this.$store.state.orders.length
    },
    remainDays() {
      const r = this.activeRight
      if (!r) return '—'
      const n = Math.ceil((r.endTs - Date.now()) / 86400000)
      return n > 0 ? n + ' 天' : '已到期'
    },
    menu() {
      return [
        { key: 'profile', icon: 'fa-solid fa-user', bg: '#d4f5ee', label: '个人资料', desc: '姓名、性别、身高体重等健康档案' },
        { key: 'orders', icon: 'fa-solid fa-receipt', bg: '#d8f8fa', label: '我的订单', desc: '共 ' + this.orderCount + ' 笔订单记录' },
        { key: 'rights', icon: 'fa-solid fa-ticket', bg: '#ddf7ed', label: '我的权益', desc: '已开通 ' + this.rightsCount + ' 项健康管理服务' },
        {
          key: 'chat',
          icon: 'fa-solid fa-comment-dots',
          bg: '#fdf4ed',
          label: '健康对话',
          desc: this.activeRight ? '继续与健康小助手对话' : '开通服务后可使用',
          badge: this.activeRight && !this.activeRight.chatStarted ? '待问询' : ''
        }
      ]
    }
  },
  onShow() {
    this.syncBadge()
  },
  methods: {
    syncBadge() {
      // 消息已不在 tabBar 中，未读数改由页面内入口展示，无需设置 tabBar 角标
    },
    goProfile() {
      uni.navigateTo({ url: '/pages/mine/profile' })
    },
    goOrders() {
      uni.navigateTo({ url: '/pages/mine/orders' })
    },
    goRights() {
      uni.navigateTo({ url: '/pages/rights/rights' })
    },
    goRightDetail() {
      uni.navigateTo({ url: '/pages/rights/detail?id=' + this.activeRight.id })
    },
    goMsg() {
      uni.navigateTo({ url: '/pages/message/message' })
    },
    onMenu(it) {
      if (it.key === 'profile') return this.goProfile()
      if (it.key === 'orders') return this.goOrders()
      if (it.key === 'rights') return this.goRights()
      if (it.key === 'agreement') return uni.navigateTo({ url: '/pages/mine/agreement' })
      if (it.key === 'chat') {
        const r = this.activeRight
        if (!r) {
          uni.showToast({ title: '请先开通健康管理服务', icon: 'none' })
          return
        }
        if (!r.wecomAdded && !r.chatStarted) {
          uni.navigateTo({ url: '/pages/rights/rights' })
          return
        }
        uni.navigateTo({ url: '/pages/chat/chat?rightId=' + r.id })
        return
      }
      if (it.key === 'service') {
        uni.showModal({
          title: '联系客服',
          content: '演示版本暂未开通在线客服，如需咨询请在健康对话中留言，管理师会尽快回复。',
          showCancel: false,
          confirmText: '知道了'
        })
        return
      }
      if (it.key === 'reset') {
        uni.showModal({
          title: '清空演示数据',
          content: '将清除全部订单、权益、消息与对话记录，恢复到初始状态。是否继续？',
          confirmText: '清空',
          confirmColor: '#e07a5f',
          success: (res) => {
            if (!res.confirm) return
            this.$store.dispatch('resetAll')
            this.syncBadge()
            uni.showToast({ title: '已恢复初始状态', icon: 'none' })
          }
        })
      }
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
  padding: $space-2 $space-4 0;
}

.who {
  display: flex;
  align-items: center;
}

.who__avatar {
  width: $size-avatar-lg;
  height: $size-avatar-lg;
  border-radius: 50%;
  background: linear-gradient(135deg, $avatar-default-bg-start 0%, $avatar-default-bg-end 100%);
  box-shadow: $shadow-sm;
  text-align: center;
  line-height: $size-avatar-lg;
  margin-right: $space-3;
}

.who__avatar-t {
  font-size: $font-size-xl;
  font-weight: $font-weight-heavy;
  color: $text-secondary;
}

.who__main {
  flex: 1;
}

.who__name {
  display: block;
  font-size: $page-title-size;
  font-weight: $page-title-weight;
  line-height: $page-title-line-height;
  color: $page-title-color;
  letter-spacing: 1rpx;
}

.who__meta {
  display: block;
  margin-top: $space-1;
  font-size: $font-size-xs;
  color: $text-muted;
}

.who__go {
  font-size: $font-size-xl;
  color: $text-hint;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  margin-top: $space-3;
}

.tag {
  padding: $space-1 $space-3;
  border-radius: $radius-full;
  background: $label-soft-bg;
  border: 1rpx solid $label-soft-border;
  margin-right: $space-2;
  margin-bottom: $space-1;
}

.tag__t {
  font-size: $font-size-2xs;
  color: $label-soft-text;
  font-weight: $font-weight-medium;
}

.stat {
  margin: 0 $space-3;
  display: flex;
  align-items: center;
  padding: $space-3 0;
}

.stat__i {
  flex: 1;
  text-align: center;
}

.stat__n {
  display: block;
  font-size: $font-size-xl;
  font-weight: $font-weight-heavy;
  line-height: $line-height-tight;
  color: $brand-primary-active;
}

.stat__l {
  display: block;
  margin-top: $space-1;
  font-size: $font-size-2xs;
  color: $text-muted;
}

.stat__sep {
  width: 1rpx;
  height: $space-6;
  background: $border-subtle;
}

.cur {
  margin: $space-data-list-gap $space-4 0;
  padding: $space-3;
  display: flex;
  align-items: center;
}

.cur__icon {
  width: $size-icon-xl;
  height: $size-icon-xl;
  border-radius: $radius-card-child;
  text-align: center;
  line-height: $size-icon-xl;
  margin-right: $space-3;
}

.cur__icon-t {
  font-size: $font-size-xl;
  color: $icon-ink;
}

.cur__main {
  flex: 1;
}

.cur__name {
  display: block;
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.cur__meta {
  display: block;
  margin-top: $space-1;
  font-size: $font-size-xs;
  color: $text-muted;
}

.cur__go {
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
}

.sec {
  padding: $space-5 $space-4 $space-2;
}

.menu {
  margin: 0 $space-3;
  padding: $space-3;
}

.mi {
  display: flex;
  align-items: center;
  padding-bottom: $space-3;
  margin-bottom: $space-3;
  border-bottom: 1rpx solid $border-subtle;
}

.mi--last {
  padding-bottom: 0;
  margin-bottom: 0;
  border-bottom: none;
}

.mi__icon {
  width: $size-icon-lg;
  height: $size-icon-lg;
  border-radius: $radius-sm;
  text-align: center;
  line-height: $size-icon-lg;
  margin-right: $space-3;
}

.mi__icon-t {
  font-size: $size-icon-xs;
  color: $icon-ink;
}

.mi__main {
  flex: 1;
  min-width: 0;
}

.mi__t {
  display: block;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.mi__d {
  display: block;
  margin-top: $space-1;
  font-size: $font-size-2xs;
  color: $text-disabled;
}

.mi__badge {
  padding: $space-1 $space-2;
  border-radius: $radius-full;
  background: $warm-soft;
  color: $badge;
  font-size: $font-size-2xs;
  margin-right: $space-2;
}

.mi__go {
  font-size: $font-size-lg;
  color: $text-hint;
}

.foot {
  padding: $space-6 $space-8 $space-2;
  text-align: center;
}

.foot__t {
  display: block;
  font-size: $font-size-2xs;
  color: $text-disabled;
}

.foot__d {
  display: block;
  margin-top: $space-1;
  font-size: $font-size-2xs;
  color: $text-hint;
  line-height: $line-height-relaxed;
}
</style>
