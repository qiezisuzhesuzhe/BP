<template>
  <view class="hm-page">
    <view class="top">
      <hm-navbar title="我的" :show-back="false" bg-color="transparent" text-color="#ffffff" />
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
        <text class="cur__icon-t">{{ activeRight.icon }}</text>
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
          <text class="mi__icon-t">{{ it.icon }}</text>
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
          <text class="mi__icon-t">{{ it.icon }}</text>
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
        { key: 'agreement', icon: '📄', bg: '#f5f3ee', label: '用户协议与隐私政策', desc: '服务条款、健康数据使用说明' },
        { key: 'service', icon: '☎️', bg: '#e8f4ec', label: '联系客服', desc: '工作日 09:00 - 21:00' },
        { key: 'reset', icon: '♻️', bg: '#fde8e3', label: '清空演示数据', desc: '恢复到初始状态，便于重新体验' }
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
        { key: 'profile', icon: '👤', bg: '#e0f4f5', label: '个人资料', desc: '姓名、性别、身高体重等健康档案' },
        { key: 'orders', icon: '🧾', bg: '#e3eef8', label: '我的订单', desc: '共 ' + this.orderCount + ' 笔订单记录' },
        { key: 'rights', icon: '🎫', bg: '#e8f4ec', label: '我的权益', desc: '已开通 ' + this.rightsCount + ' 项健康管理服务' },
        {
          key: 'chat',
          icon: '💬',
          bg: '#faf0e0',
          label: '健康对话',
          desc: this.activeRight ? '继续与 AI 健康助手对话' : '开通服务后可使用',
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
      const n = this.$store.getters.unreadCount
      if (n > 0) uni.setTabBarBadge({ index: 1, text: n > 99 ? '99+' : '' + n, fail() {} })
      else uni.removeTabBarBadge({ index: 1, fail() {} })
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
      uni.switchTab({ url: '/pages/message/message' })
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
  background: linear-gradient(160deg, $teal-800 0%, $teal-700 55%, $teal-500 100%);
  padding-bottom: 96rpx;
}

.top__body {
  padding: 16rpx 36rpx 0;
}

.who {
  display: flex;
  align-items: center;
}

.who__avatar {
  width: 116rpx;
  height: 116rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
  border: 3rpx solid rgba(255, 255, 255, 0.45);
  text-align: center;
  line-height: 112rpx;
  margin-right: 24rpx;
}

.who__avatar-t {
  font-size: 44rpx;
  font-weight: 700;
  color: #fff;
}

.who__main {
  flex: 1;
}

.who__name {
  display: block;
  font-size: 38rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: 1rpx;
}

.who__meta {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.who__go {
  font-size: 40rpx;
  color: rgba(255, 255, 255, 0.7);
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  margin-top: 26rpx;
}

.tag {
  padding: 8rpx 20rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.16);
  margin-right: 12rpx;
  margin-bottom: 10rpx;
}

.tag__t {
  font-size: 21rpx;
  color: rgba(255, 255, 255, 0.95);
}

.stat {
  margin-top: -72rpx;
  display: flex;
  align-items: center;
}

.stat__i {
  flex: 1;
  text-align: center;
}

.stat__n {
  display: block;
  font-size: 40rpx;
  font-weight: 700;
  color: $teal-700;
}

.stat__l {
  display: block;
  margin-top: 8rpx;
  font-size: 23rpx;
  color: $ink-500;
}

.stat__sep {
  width: 1rpx;
  height: 60rpx;
  background: $warm-200;
}

.cur {
  display: flex;
  align-items: center;
}

.cur__icon {
  width: 88rpx;
  height: 88rpx;
  border-radius: 26rpx;
  text-align: center;
  line-height: 88rpx;
  margin-right: 22rpx;
}

.cur__icon-t {
  font-size: 40rpx;
}

.cur__main {
  flex: 1;
}

.cur__name {
  display: block;
  font-size: 29rpx;
  font-weight: 600;
  color: $ink-900;
}

.cur__meta {
  display: block;
  margin-top: 8rpx;
  font-size: 23rpx;
  color: $ink-500;
}

.cur__go {
  font-size: 24rpx;
  font-weight: 600;
}

.sec {
  padding: 40rpx 36rpx 20rpx;
}

.mi {
  display: flex;
  align-items: center;
  padding-bottom: 26rpx;
  margin-bottom: 26rpx;
  border-bottom: 1rpx solid $warm-100;
}

.mi--last {
  padding-bottom: 0;
  margin-bottom: 0;
  border-bottom: none;
}

.mi__icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 22rpx;
  text-align: center;
  line-height: 72rpx;
  margin-right: 22rpx;
}

.mi__icon-t {
  font-size: 32rpx;
}

.mi__main {
  flex: 1;
  min-width: 0;
}

.mi__t {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: $ink-900;
}

.mi__d {
  display: block;
  margin-top: 6rpx;
  font-size: 23rpx;
  color: $ink-400;
}

.mi__badge {
  padding: 5rpx 16rpx;
  border-radius: 999rpx;
  background: $coral-100;
  color: $coral-500;
  font-size: 20rpx;
  margin-right: 12rpx;
}

.mi__go {
  font-size: 34rpx;
  color: $ink-300;
}

.foot {
  padding: 50rpx 60rpx 20rpx;
  text-align: center;
}

.foot__t {
  display: block;
  font-size: 22rpx;
  color: $ink-400;
}

.foot__d {
  display: block;
  margin-top: 10rpx;
  font-size: 21rpx;
  color: $ink-300;
  line-height: 1.7;
}
</style>
