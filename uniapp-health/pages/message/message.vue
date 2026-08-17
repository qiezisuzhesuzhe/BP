<template>
  <view class="hm-page">
    <view class="top">
      <hm-navbar title="消息" :show-back="false" bg-color="transparent" text-color="#ffffff" />
      <view class="top__body">
        <view class="top__row">
          <view class="top__l">
            <text class="top__t">消息中心</text>
            <text class="top__d">{{ unreadCount > 0 ? unreadCount + ' 条未读消息' : '暂无未读消息' }}</text>
          </view>
          <view v-if="unreadCount > 0" class="top__act" @tap="onReadAll">
            <text class="top__act-t">全部已读</text>
          </view>
        </view>
      </view>
    </view>

    <scroll-view class="tabs" scroll-x show-scrollbar="false">
      <view class="tabs__inner">
        <view v-for="t in tabs" :key="t.key" class="tab" :class="{ 'tab--on': tab === t.key }" @tap="tab = t.key">
          <text class="tab__t" :class="{ 'tab__t--on': tab === t.key }">{{ t.label }}</text>
          <text v-if="countOf(t.key) > 0" class="tab__n" :class="{ 'tab__n--on': tab === t.key }">{{ countOf(t.key) }}</text>
        </view>
      </view>
    </scroll-view>

    <view v-if="filtered.length === 0" class="empty">
      <text class="empty__icon">📭</text>
      <text class="empty__t">这里还没有消息</text>
      <text class="empty__d">开通服务后，订单通知与每日健康提醒都会出现在这里</text>
    </view>

    <view v-else class="list">
      <view v-for="(g, gi) in grouped" :key="gi" class="group">
        <view class="group__head">
          <text class="group__t">{{ g.label }}</text>
        </view>
        <view v-for="m in g.items" :key="m.id" class="msg" :class="{ 'msg--unread': !m.read }" @tap="onTap(m)">
          <view class="msg__icon" :style="{ background: soft(m.color) }">
            <text class="msg__icon-t">{{ m.icon }}</text>
          </view>
          <view class="msg__main">
            <view class="msg__head">
              <text class="msg__title">{{ m.title }}</text>
              <text class="msg__time">{{ shortTime(m.time) }}</text>
            </view>
            <text class="msg__content">{{ m.content }}</text>
            <view class="msg__foot">
              <text class="msg__cat" :style="{ color: m.color, background: soft(m.color) }">{{ catLabel(m.type) }}</text>
              <text v-if="m.link" class="msg__go">查看详情 ›</text>
            </view>
          </view>
          <view v-if="!m.read" class="msg__dot"></view>
        </view>
      </view>
    </view>

    <view class="tips">
      <text class="tips__t">消息仅保留最近 90 天记录</text>
    </view>
    <view class="hm-safe-bottom"></view>
  </view>
</template>

<script>
const CAT = {
  order: '订单',
  service: '服务',
  report: '方案',
  timeline: '健康提醒',
  doctor: '医师',
  activity: '活动'
}

export default {
  data() {
    return {
      tab: 'all',
      tabs: [
        { key: 'all', label: '全部' },
        { key: 'unread', label: '未读' },
        { key: 'timeline', label: '健康提醒' },
        { key: 'order', label: '订单' },
        { key: 'doctor', label: '医师' },
        { key: 'activity', label: '活动' }
      ]
    }
  },
  computed: {
    messages() {
      return this.$store.state.messages
    },
    unreadCount() {
      return this.$store.getters.unreadCount
    },
    filtered() {
      const t = this.tab
      if (t === 'all') return this.messages
      if (t === 'unread') return this.messages.filter((m) => !m.read)
      if (t === 'order') return this.messages.filter((m) => m.type === 'order' || m.type === 'service')
      if (t === 'doctor') return this.messages.filter((m) => m.type === 'doctor' || m.type === 'report')
      return this.messages.filter((m) => m.type === t)
    },
    grouped() {
      const today = []
      const earlier = []
      const dayStr = this.dayOf(Date.now())
      this.filtered.forEach((m) => {
        if ((m.time || '').indexOf(dayStr) === 0) today.push(m)
        else earlier.push(m)
      })
      const out = []
      if (today.length) out.push({ label: '今天', items: today })
      if (earlier.length) out.push({ label: '更早', items: earlier })
      return out
    }
  },
  onShow() {
    this.syncBadge()
  },
  methods: {
    dayOf(ts) {
      const d = new Date(ts)
      const p = (n) => (n < 10 ? '0' + n : '' + n)
      return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate())
    },
    shortTime(s) {
      if (!s) return ''
      const dayStr = this.dayOf(Date.now())
      if (s.indexOf(dayStr) === 0) return s.slice(11)
      return s.slice(5, 10)
    },
    countOf(key) {
      if (key === 'all') return 0
      if (key === 'unread') return this.messages.filter((m) => !m.read).length
      if (key === 'order') return this.messages.filter((m) => (m.type === 'order' || m.type === 'service') && !m.read).length
      if (key === 'doctor') return this.messages.filter((m) => (m.type === 'doctor' || m.type === 'report') && !m.read).length
      return this.messages.filter((m) => m.type === key && !m.read).length
    },
    catLabel(t) {
      return CAT[t] || '通知'
    },
    soft(hex) {
      if (!hex || hex.charAt(0) !== '#') return '#f5f3ee'
      const n = parseInt(hex.slice(1), 16)
      const r = (n >> 16) & 255
      const g = (n >> 8) & 255
      const b = n & 255
      return 'rgba(' + r + ',' + g + ',' + b + ',0.12)'
    },
    onTap(m) {
      if (!m.read) {
        this.$store.dispatch('readMessage', m.id)
        this.syncBadge()
      }
      if (!m.link) return
      if (m.link === '/pages/index/index') {
        uni.switchTab({ url: m.link })
        return
      }
      if (m.link === '/pages/rights/rights') {
        uni.navigateTo({ url: m.link })
        return
      }
      uni.navigateTo({ url: m.link })
    },
    onReadAll() {
      this.$store.dispatch('readAll')
      this.syncBadge()
      uni.showToast({ title: '已全部标记已读', icon: 'none' })
    },
    syncBadge() {
      const n = this.$store.getters.unreadCount
      if (n > 0) uni.setTabBarBadge({ index: 1, text: n > 99 ? '99+' : '' + n, fail() {} })
      else uni.removeTabBarBadge({ index: 1, fail() {} })
    }
  }
}
</script>

<style lang="scss" scoped>
.top {
  background: linear-gradient(160deg, $teal-800 0%, $teal-700 55%, $teal-500 100%);
  padding-bottom: 40rpx;
}

.top__body {
  padding: 16rpx 36rpx 0;
}

.top__row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.top__t {
  display: block;
  font-size: 38rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: 1rpx;
}

.top__d {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.top__act {
  padding: 12rpx 26rpx;
  border-radius: 999rpx;
  background: rgba(255, 255, 255, 0.18);
}

.top__act-t {
  font-size: 23rpx;
  color: #fff;
}

.tabs {
  width: 100%;
  background: #fff;
  box-shadow: $shadow-sm;
}

.tabs__inner {
  display: flex;
  align-items: center;
  padding: 20rpx 24rpx;
  white-space: nowrap;
}

.tab {
  display: inline-flex;
  align-items: center;
  padding: 12rpx 28rpx;
  border-radius: 999rpx;
  background: $warm-100;
  margin-right: 14rpx;
}

.tab--on {
  background: $teal-700;
}

.tab__t {
  font-size: 25rpx;
  color: $ink-500;
}

.tab__t--on {
  color: #fff;
  font-weight: 600;
}

.tab__n {
  margin-left: 8rpx;
  min-width: 30rpx;
  padding: 0 8rpx;
  border-radius: 999rpx;
  background: $coral-500;
  font-size: 19rpx;
  color: #fff;
  text-align: center;
  line-height: 30rpx;
}

.tab__n--on {
  background: rgba(255, 255, 255, 0.28);
}

.list {
  padding: 24rpx 24rpx 0;
}

.group {
  margin-bottom: 10rpx;
}

.group__head {
  padding: 14rpx 12rpx 16rpx;
}

.group__t {
  font-size: 23rpx;
  color: $ink-400;
  letter-spacing: 1rpx;
}

.msg {
  position: relative;
  display: flex;
  padding: 28rpx 26rpx;
  border-radius: $radius-md;
  background: #fff;
  box-shadow: $shadow-sm;
  margin-bottom: 18rpx;
}

.msg--unread {
  box-shadow: $shadow-md;
}

.msg__icon {
  width: 76rpx;
  height: 76rpx;
  border-radius: 24rpx;
  text-align: center;
  line-height: 76rpx;
  margin-right: 22rpx;
  flex-shrink: 0;
}

.msg__icon-t {
  font-size: 34rpx;
}

.msg__main {
  flex: 1;
  min-width: 0;
}

.msg__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.msg__title {
  flex: 1;
  font-size: 28rpx;
  font-weight: 600;
  color: $ink-900;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.msg__time {
  margin-left: 16rpx;
  font-size: 21rpx;
  color: $ink-400;
  flex-shrink: 0;
}

.msg__content {
  display: block;
  margin-top: 10rpx;
  font-size: 25rpx;
  color: $ink-500;
  line-height: 1.66;
}

.msg__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16rpx;
}

.msg__cat {
  padding: 5rpx 16rpx;
  border-radius: 999rpx;
  font-size: 20rpx;
}

.msg__go {
  font-size: 22rpx;
  color: $teal-700;
}

.msg__dot {
  position: absolute;
  top: 26rpx;
  right: 20rpx;
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  background: $coral-500;
}

.empty {
  padding: 120rpx 80rpx;
  text-align: center;
}

.empty__icon {
  display: block;
  font-size: 90rpx;
}

.empty__t {
  display: block;
  margin-top: 28rpx;
  font-size: 30rpx;
  font-weight: 600;
  color: $ink-700;
}

.empty__d {
  display: block;
  margin-top: 14rpx;
  font-size: 24rpx;
  color: $ink-400;
  line-height: 1.7;
}

.tips {
  padding: 30rpx 36rpx 10rpx;
  text-align: center;
}

.tips__t {
  font-size: 21rpx;
  color: $ink-300;
}
</style>
