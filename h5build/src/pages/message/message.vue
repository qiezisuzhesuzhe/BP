<template>
  <view class="hm-page">
    <view class="top">
      <hm-navbar title="消息" :show-back="false" bg-color="transparent" />
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

    <scroll-view class="tabs" scroll-x :show-scrollbar="false" :scroll-into-view="scrollIntoId" scroll-with-animation>
      <view class="tabs__inner">
        <view
          v-for="t in tabs"
          :key="t.key"
          :id="'tab-' + t.key"
          class="tab"
          :class="{ 'tab--on': tab === t.key }"
          @tap="onTapTab(t.key)"
        >
          <text class="tab__t" :class="{ 'tab__t--on': tab === t.key }">{{ t.label }}</text>
          <text v-if="countOf(t.key) > 0" class="tab__n" :class="{ 'tab__n--on': tab === t.key }">{{ countOf(t.key) }}</text>
        </view>
      </view>
    </scroll-view>

    <view v-if="filtered.length === 0" class="empty">
      <text class="empty__icon fa-solid fa-envelope-open"></text>
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
            <text class="msg__icon-t" :class="m.icon"></text>
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
      scrollIntoId: '',
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
      if (!hex || hex.charAt(0) !== '#') return '#edf5f2'
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
    onTapTab(key) {
      this.tab = key
      // 触发滚动到当前 tab，避免内容超宽时被遮住
      this.$nextTick(() => {
        this.scrollIntoId = 'tab-' + key
      })
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
  background: transparent;
  padding-bottom: $space-5;
}

.top__body {
  padding: $space-2 $space-4 0;
}

.top__row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.top__t {
  display: block;
  font-size: $page-title-size;
  font-weight: $page-title-weight;
  line-height: $page-title-line-height;
  color: $page-title-color;
  letter-spacing: 1rpx;
}

.top__d {
  display: block;
  margin-top: $space-1;
  font-size: $font-size-xs;
  color: $text-muted;
}

.top__act {
  padding: $space-2 $space-3;
  border-radius: $radius-full;
  background: $bg-surface;
  box-shadow: $shadow-sm;
}

.top__act-t {
  font-size: $font-size-2xs;
  color: $brand-primary-active;
  font-weight: $font-weight-semibold;
}

.tabs {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
}

/* 隐藏 webkit 滚动条 */
.tabs ::-webkit-scrollbar {
  display: none;
}

.tabs__inner {
  display: inline-flex;
  align-items: center;
  padding: $space-2 $space-3;
  white-space: nowrap;
}

.tab {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  padding: $space-2 $space-3;
  border-radius: $radius-full;
  background: $bg-subtle;
  margin-right: $space-2;
}

.tab--on {
  background: $brand-primary;
}

.tab__t {
  font-size: $font-size-xs;
  color: $text-muted;
}

.tab__t--on {
  color: $text-inverse;
  font-weight: $font-weight-semibold;
}

.tab__n {
  margin-left: $space-1;
  min-width: $size-badge-md;
  padding: 0 $space-1;
  border-radius: $radius-full;
  background: $badge;
  font-size: $font-size-2xs;
  color: $text-inverse;
  text-align: center;
  line-height: $size-badge-md;
}

.tab__n--on {
  background: $brand-primary-active;
}

.list {
  padding: $space-4 $space-4 0;
}

.group {
  margin-bottom: $space-1;
}

.group__head {
  padding: $space-2 $space-2 $space-2;
}

.group__t {
  font-size: $font-size-2xs;
  color: $text-disabled;
  letter-spacing: 1rpx;
}

.msg {
  position: relative;
  display: flex;
  padding: $space-3;
  border-radius: $radius-card-child;
  background: $bg-surface;
  box-shadow: $shadow-sm;
  margin-bottom: $space-data-list-gap;
}

.msg--unread {
  box-shadow: $shadow-md;
}

.msg__icon {
  width: $size-icon-lg;
  height: $size-icon-lg;
  border-radius: $radius-sm;
  text-align: center;
  line-height: $size-icon-lg;
  margin-right: $space-3;
  flex-shrink: 0;
}

.msg__icon-t {
  font-size: $font-size-lg;
  color: $icon-ink;
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
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.msg__time {
  margin-left: $space-2;
  font-size: $font-size-2xs;
  color: $text-disabled;
  flex-shrink: 0;
}

.msg__content {
  display: block;
  margin-top: $space-1;
  font-size: $font-size-xs;
  color: $text-muted;
  line-height: $line-height-relaxed;
}

.msg__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: $space-2;
}

.msg__cat {
  padding: $space-1 $space-2;
  border-radius: $radius-full;
  font-size: $font-size-2xs;
}

.msg__go {
  font-size: $font-size-2xs;
  color: $brand-primary-active;
}

.msg__dot {
  position: absolute;
  top: $space-3;
  right: $space-2;
  width: $size-badge-sm;
  height: $size-badge-sm;
  border-radius: 50%;
  background: $badge;
}

.empty {
  padding: $space-12 $space-10;
  text-align: center;
}

.empty__icon {
  display: block;
  font-size: $size-icon-xl;
  color: $text-disabled;
}

.empty__t {
  display: block;
  margin-top: $space-3;
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $text-secondary;
}

.empty__d {
  display: block;
  margin-top: $space-2;
  font-size: $font-size-xs;
  color: $text-muted;
  line-height: $line-height-relaxed;
}

.tips {
  padding: $space-4 $space-4 $space-1;
  text-align: center;
}

.tips__t {
  font-size: $font-size-2xs;
  color: $text-hint;
}
</style>
