<template>
  <view class="hm-page">
    <!-- 顶部渐变头 -->
    <view class="hero">
      <hm-navbar title="" :show-back="false" bg-color="transparent" :sticky="false"></hm-navbar>

      <view class="hero__body">
        <text class="hero__org">新华保险北京分公司</text>
        <view class="hero__title">
          <text class="hero__hello">{{ greeting }}，{{ profile.name }}</text>
          <view class="hero__bell" @tap="goMsg">
            <text class="hero__bell-icon fa-solid fa-bell"></text>
            <view v-if="unreadCount > 0" class="hero__badge">
              <text class="hero__badge-t">{{ unreadCount > 99 ? '99+' : unreadCount }}</text>
            </view>
          </view>
        </view>

        <view v-if="activeRight" class="hero__stats">
          <view class="hero__stat">
            <text class="hero__stat-v">{{ activeRight ? activeRight.usedDays : 0 }}</text>
            <text class="hero__stat-l">已管理天数</text>
          </view>
          <view class="hero__stat-line"></view>
          <view class="hero__stat">
            <text class="hero__stat-v">{{ activeRight ? todayTimeline.items.length : '—' }}</text>
            <text class="hero__stat-l">今日待办</text>
          </view>
          <view class="hero__stat-line"></view>
          <view class="hero__stat">
            <text class="hero__stat-v">{{ activeRight ? remainDays : '—' }}</text>
            <text class="hero__stat-l">剩余有效期</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 我的权益（始终展示，购买后解锁完整权益） -->
    <view class="wrap">
      <view class="sec-head">
        <text class="hm-sec-title">我的权益</text>
        <text v-if="activeRight" class="hm-sec-sub">{{ activeRight.name }}</text>
      </view>

      <view class="rights" @tap="onRightsTap">
        <view class="rights__head">
          <view class="rights__head-l">
            <view class="rights__level">
              <text class="fa-solid fa-shield-halved rights__level-icon"></text>
              <text class="rights__level-t">{{ activeRight ? activeRight.level : '基础会员' }}</text>
            </view>
            <text v-if="activeRight" class="rights__date">有效期 {{ activeRight.startAt }} ~ {{ activeRight.endAt }}</text>
          </view>
          <view class="rights__pts">
            <text class="rights__pts-l">剩余积分</text>
            <text class="rights__pts-v">{{ activeRight ? activeRight.points : 500 }}</text>
          </view>
        </view>
        <view class="rights__grid">
          <view v-for="e in rightEntries" :key="e.key" class="rights__item">
            <view class="rights__item-icon" :style="{ background: e.bg }">
              <text class="rights__item-icon-t" :class="e.icon" :style="{ color: e.color }"></text>
              <text v-if="activeRight && e.quota" class="rights__item-badge">{{ e.quota }}</text>
            </view>
            <text class="rights__item-t">{{ e.label }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 进行中的服务 -->
    <view class="wrap">
      <view v-if="activeRight" class="ongoing" @tap="goRightDetail(activeRight.id)">
        <view class="ongoing__icon" :style="{ background: activeRight.accentSoft }">
          <text class="ongoing__icon-t">{{ activeRight.icon }}</text>
        </view>
        <view class="ongoing__main">
          <text class="ongoing__name">{{ activeRight.name }}</text>
          <text class="ongoing__meta">有效期至 {{ activeRight.endAt }}</text>
        </view>
        <view class="ongoing__act" :style="{ background: activeRight.accent }">
          <text class="ongoing__act-t">{{ activeRight.chatStarted ? '继续对话' : '立即使用' }}</text>
        </view>
      </view>
    </view>

    <!-- 今日健康指导（仅成功购买服务包后显示） -->
    <view v-if="activeRight" class="wrap">
      <view class="sec-head">
        <text class="hm-sec-title">今日健康指导</text>
        <view class="sec-head__side">
          <text class="hm-sec-sub">{{ todayLabel }} · 共 {{ todayTimeline.items.length }} 项安排</text>
          <view class="day-switch">
            <view
              v-for="(d, i) in dayTabs"
              :key="i"
              class="day-switch__item"
              :class="{ 'day-switch__item--on': currentDayIndex === i }"
              @tap="setDay(i)"
            >
              <text class="day-switch__t">{{ d }}</text>
            </view>
          </view>
        </view>
      </view>

      <hm-timeline :items="todayTimeline.items" />
    </view>

    <!-- 健康管理服务包 -->
    <view class="wrap" id="shop">
      <view class="sec-head">
        <text class="hm-sec-title">健康管理服务包</text>
        <text class="hm-sec-sub">三甲医师团队 + AI 助手全程陪伴</text>
      </view>

      <view v-for="pkg in packages" :key="pkg.id" class="pkg" @tap="goDetail(pkg.id)">
        <view class="pkg__banner" :style="{ background: pkg.accentSoft }">
          <view class="pkg__banner-l">
            <text class="pkg__badge">{{ pkg.tagline }}</text>
            <text class="pkg__name">{{ pkg.name }}</text>
            <text class="pkg__sub">{{ pkg.subtitle }}</text>
          </view>
          <text class="pkg__emoji" :class="pkg.icon"></text>
        </view>

        <view class="pkg__body">
          <view class="pkg__tags">
            <text v-for="(t, i) in pkg.tags" :key="i" class="pkg__tag" :style="{ color: pkg.accent, background: pkg.accentSoft }">{{ t }}</text>
          </view>

          <view class="pkg__foot">
            <view class="pkg__price">
              <text class="pkg__cur">¥</text>
              <text class="pkg__now">{{ pkg.price }}</text>
              <text class="pkg__origin">¥{{ pkg.originPrice }}</text>
              <text class="pkg__dur">/ {{ pkg.duration }}</text>
            </view>
          </view>

          <view class="pkg__sold">
            <text class="pkg__sold-t"><text class="fa-solid fa-star pkg__sold-star"></text>{{ pkg.rating }} 分 · 已服务 {{ pkg.sold }} 人</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 健康小知识：已按需求移除 -->

    <view class="foot-tip">
      <text class="foot-tip__t">本服务为健康管理与生活方式干预，不替代医疗诊断与处方</text>
    </view>
    <view class="hm-safe-bottom"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      dayTabs: ['今天', '明天', '后天']
    }
  },
  computed: {
    profile() {
      return this.$store.state.profile
    },
    packages() {
      return this.$store.getters.packages
    },
    unreadCount() {
      return this.$store.getters.unreadCount
    },
    activeRight() {
      return this.$store.getters.activeRight
    },
    rightEntries() {
      return this.$store.getters.rightEntries
    },
    todayTimeline() {
      return this.$store.getters.todayTimeline
    },
    currentDayIndex() {
      return this.$store.state.currentDayIndex
    },
    todayLabel() {
      const d = new Date()
      const w = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      return d.getMonth() + 1 + '月' + d.getDate() + '日 ' + w[d.getDay()]
    },
    greeting() {
      const h = new Date().getHours()
      if (h < 6) return '夜深了'
      if (h < 11) return '早上好'
      if (h < 14) return '中午好'
      if (h < 18) return '下午好'
      return '晚上好'
    },
    remainDays() {
      const r = this.activeRight
      if (!r) return 0
      const n = Math.ceil((r.endTs - Date.now()) / 86400000)
      return n > 0 ? n + '天' : '已到期'
    }
  },
  onShow() {
    this.syncBadge()
  },
  methods: {
    syncBadge() {
      const n = this.unreadCount
      if (n > 0) {
        uni.setTabBarBadge({ index: 1, text: n > 99 ? '99+' : '' + n, fail() {} })
      } else {
        uni.removeTabBarBadge({ index: 1, fail() {} })
      }
    },
    setDay(i) {
      this.$store.commit('SET_DAY', i)
    },
    shade(hex) {
      // 简易加深：用于渐变第二色
      const n = parseInt(hex.slice(1), 16)
      const r = Math.max(0, ((n >> 16) & 255) - 40)
      const g = Math.max(0, ((n >> 8) & 255) - 40)
      const b = Math.max(0, (n & 255) - 30)
      return 'rgb(' + r + ',' + g + ',' + b + ')'
    },
    goDetail(id) {
      uni.navigateTo({ url: '/pages/service/detail?id=' + id })
    },
    goRightDetail(id) {
      uni.navigateTo({ url: '/pages/rights/detail?id=' + id })
    },
    onRightsTap() {
      if (this.activeRight) {
        this.goRightDetail(this.activeRight.id)
      } else {
        uni.navigateTo({ url: '/pages/service/detail?id=hbp3m' })
      }
    },
    goMsg() {
      uni.switchTab({ url: '/pages/message/message' })
    }
  }
}
</script>

<style lang="scss" scoped>
.hero {
  background: transparent;
  padding-bottom: $space-5;
}

.hero__bell {
  position: relative;
  width: $size-icon-lg;
  height: $size-icon-lg;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero__bell-icon {
  font-size: $font-size-lg;
  color: $icon-ink;
}

.hero__badge {
  position: absolute;
  top: 2rpx;
  right: 0;
  min-width: $size-badge-md;
  height: $size-badge-md;
  border-radius: $radius-full;
  background: $badge;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 $space-1;
}

.hero__badge-t {
  color: $text-inverse;
  font-size: $font-size-2xs;
  line-height: $line-height-tight;
}

.hero__body {
  padding: $space-1 $space-4 0;
}

.hero__org {
  display: block;
  font-size: $font-size-xs;
  color: $text-muted;
  letter-spacing: 2rpx;
  margin-bottom: $space-1;
}

.hero__title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hero__hello {
  color: $page-title-color;
  font-size: $page-title-size;
  font-weight: $page-title-weight;
  line-height: $page-title-line-height;
  letter-spacing: 2rpx;
}

.hero__stats {
  margin-top: $space-4;
  background: $bg-section;
  border-radius: $radius-card;
  box-shadow: $shadow-sm;
  padding: $space-3 0;
  display: flex;
  align-items: center;
}

.hero__stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero__stat-v {
  color: $brand-primary-active;
  font-size: $font-size-xl;
  font-weight: $font-weight-heavy;
  line-height: $line-height-tight;
}

.hero__stat-l {
  color: $text-muted;
  font-size: $font-size-2xs;
  margin-top: $space-1;
}

.hero__stat-line {
  width: 1rpx;
  height: $space-6;
  background: $border-subtle;
}

.wrap {
  padding: $space-4 $space-4 0;
}

.rights {
  position: relative;
  overflow: hidden;
  background: linear-gradient(165deg, $bg-surface 0%, $brand-green-soft 100%);
  border: 1rpx solid $label-soft-border;
  border-radius: $radius-card;
  box-shadow: $shadow-md, inset 0 2rpx 0 rgba(255, 255, 255, 0.85);
  padding: $space-4 $space-3 $space-3;
}

/* 顶部细高光线：提升卡片精致度 */
.rights::before {
  content: '';
  position: absolute;
  top: 0;
  left: $space-4;
  right: $space-4;
  height: 2rpx;
  background: linear-gradient(90deg, transparent, $brand-primary, transparent);
  opacity: 0.9;
}

.rights__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 $space-1;
}

.rights__head-l {
  flex: 1;
  overflow: hidden;
}

.rights__level {
  display: inline-flex;
  align-items: center;
  padding: $space-1 $space-3;
  border-radius: $radius-full;
  background: linear-gradient(135deg, $brand-soft 0%, rgba(255, 255, 255, 0.92) 100%);
  border: 1rpx solid $label-soft-border;
  box-shadow: $shadow-sm;
}

.rights__level-icon {
  font-size: $font-size-xs;
  color: $brand-primary-active;
  margin-right: $space-1;
}

.rights__level-t {
  font-size: $font-size-sm;
  font-weight: $font-weight-heavy;
  color: $text-primary;
  letter-spacing: 2rpx;
}

.rights__date {
  display: block;
  font-size: $font-size-xs;
  color: $text-muted;
  margin-top: $space-2;
  font-family: $font-family-en;
}

.rights__pts {
  display: flex;
  align-items: baseline;
  flex-shrink: 0;
  margin-left: $space-3;
}

.rights__pts-l {
  font-size: $font-size-xs;
  color: $text-muted;
  margin-right: $space-1;
}

.rights__pts-v {
  font-size: $font-size-2xl;
  font-weight: $font-weight-heavy;
  color: $brand-primary-active;
  line-height: $line-height-tight;
  font-family: $font-family-en;
}

.rights__grid {
  margin-top: $space-4;
  display: flex;
  flex-wrap: wrap;
}

.rights__item {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: $space-3;
}

.rights__item-icon {
  position: relative;
  width: $size-icon-lg;
  height: $size-icon-lg;
  border-radius: $radius-card-child;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: $shadow-sm;
}

.rights__item-icon-t {
  font-size: $font-size-md;
}

.rights__item-badge {
  position: absolute;
  top: -6rpx;
  right: -6rpx;
  min-width: $size-badge-md;
  height: $size-badge-md;
  border-radius: $radius-full;
  background: $badge;
  color: $text-inverse;
  font-size: $font-size-2xs;
  line-height: $size-badge-md;
  text-align: center;
  padding: 0 $space-1;
  box-shadow: $shadow-sm;
}

.rights__item-t {
  font-size: $font-size-min;
  color: $text-secondary;
  margin-top: $space-1;
}

.ongoing {
  background: $bg-surface;
  border-radius: $radius-card;
  box-shadow: $shadow-md;
  padding: $space-3;
  display: flex;
  align-items: center;
}

.ongoing__icon {
  width: $size-icon-xl;
  height: $size-icon-xl;
  border-radius: $radius-card-child;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: $shadow-md;
}

.ongoing__icon-t {
  font-size: $font-size-xl;
  color: $icon-ink;
}

.ongoing__main {
  flex: 1;
  padding: 0 $space-3;
  overflow: hidden;
}

.ongoing__name {
  display: block;
  font-size: $font-size-md;
  font-weight: $font-weight-heavy;
  line-height: $line-height-tight;
  color: $text-primary;
}

.ongoing__meta {
  display: block;
  font-size: $font-size-xs;
  color: $text-muted;
  margin-top: $space-1;
}

.ongoing__act {
  padding: $space-2 $space-3;
  border-radius: $radius-full;
}

.ongoing__act-t {
  color: $text-inverse;
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
}

.sec-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: $space-sec-head-top;
  margin-bottom: $space-sec-head-bottom;
}

.sec-head__side {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.sec-head__side .hm-sec-sub {
  margin-right: $space-2;
  margin-bottom: 0;
}

.day-switch {
  display: flex;
  background: $bg-subtle;
  border-radius: $radius-full;
  padding: 4rpx;
}

.day-switch__item {
  padding: $space-1 $space-2;
  border-radius: $radius-full;
}

.day-switch__item--on {
  background: $bg-surface;
  box-shadow: $shadow-sm;
}

.day-switch__t {
  font-size: $font-size-2xs;
  color: $text-muted;
}

.day-switch__item--on .day-switch__t {
  color: $brand-primary-active;
  font-weight: $font-weight-bold;
}

.pkg {
  background: $bg-surface;
  border-radius: $radius-card;
  overflow: hidden;
  box-shadow: $shadow-sm;
  margin-bottom: $space-4;
}

.pkg__banner {
  padding: $space-4 $space-3;
  display: flex;
  align-items: center;
}

.pkg__banner-l {
  flex: 1;
  overflow: hidden;
}

.pkg__badge {
  display: inline-block;
  font-size: $font-size-2xs;
  color: $label-soft-text;
  background: $bg-surface;
  padding: 4rpx $space-2;
  border-radius: $radius-full;
}

.pkg__name {
  display: block;
  color: $text-primary;
  font-size: $font-size-lg;
  font-weight: $font-weight-heavy;
  line-height: $line-height-tight;
  margin-top: $space-2;
  letter-spacing: 1rpx;
}

.pkg__sub {
  display: block;
  color: $text-secondary;
  font-size: $font-size-xs;
  margin-top: $space-1;
}

.pkg__emoji {
  font-size: $size-icon-xl;
  margin-left: $space-2;
  color: $icon-ink;
}

.pkg__body {
  padding: $space-3;
}

.pkg__tags {
  display: flex;
  flex-wrap: wrap;
}

.pkg__tag {
  font-size: $font-size-2xs;
  padding: $space-1 $space-2;
  border-radius: $radius-full;
  margin: 0 $space-1 $space-1 0;
}

.pkg__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: $space-2;
}

.pkg__price {
  display: flex;
  align-items: baseline;
}

.pkg__cur {
  font-size: $font-size-xs;
  color: $badge;
  font-weight: $font-weight-bold;
}

.pkg__now {
  font-size: $font-size-2xl;
  color: $badge;
  font-weight: $font-weight-heavy;
  line-height: $line-height-tight;
  margin-left: 2rpx;
}

.pkg__origin {
  font-size: $font-size-xs;
  color: $text-disabled;
  text-decoration: line-through;
  margin-left: $space-1;
}

.pkg__dur {
  font-size: $font-size-xs;
  color: $text-muted;
  margin-left: $space-1;
}

.pkg__sold {
  margin-top: $space-2;
}

.pkg__sold-t {
  font-size: $font-size-2xs;
  color: $text-disabled;
}

.pkg__sold-star {
  color: $warning;
  margin-right: $space-1;
}

.foot-tip {
  padding: $space-5 $space-6 $space-3;
  text-align: center;
}

.foot-tip__t {
  font-size: $font-size-2xs;
  color: $text-disabled;
  line-height: $line-height-relaxed;
}
</style>
