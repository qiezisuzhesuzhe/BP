<template>
  <view class="hm-page">
    <!-- 顶部渐变头 -->
    <view class="hero">
      <hm-navbar title="" :show-back="false" bg-color="transparent" text-color="#ffffff">
        <template #right>
          <view class="hero__bell" @tap="goMsg">
            <text class="hero__bell-icon">🔔</text>
            <view v-if="unreadCount > 0" class="hero__badge">
              <text class="hero__badge-t">{{ unreadCount > 99 ? '99+' : unreadCount }}</text>
            </view>
          </view>
        </template>
      </hm-navbar>

      <view class="hero__body">
        <text class="hero__hello">{{ greeting }}，{{ profile.name }}</text>
        <text class="hero__slogan">今天也要好好照顾自己</text>

        <view class="hero__stats">
          <view class="hero__stat">
            <text class="hero__stat-v">{{ activeRight ? activeRight.usedDays : 0 }}</text>
            <text class="hero__stat-l">已管理天数</text>
          </view>
          <view class="hero__stat-line"></view>
          <view class="hero__stat">
            <text class="hero__stat-v">{{ todayTimeline.items.length }}</text>
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

    <!-- 进行中的服务 / 未购买引导 -->
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

      <view v-else class="notice">
        <text class="notice__icon">💡</text>
        <view class="notice__main">
          <text class="notice__t">您还没有开通健康管理服务</text>
          <text class="notice__d">下方为体验版今日指导，开通后获得专属方案</text>
        </view>
      </view>
    </view>

    <!-- 今日健康指导 -->
    <view class="wrap">
      <view class="sec-head">
        <view>
          <text class="hm-sec-title">今日健康指导</text>
          <text class="hm-sec-sub">{{ todayLabel }} · 共 {{ todayTimeline.items.length }} 项安排</text>
        </view>
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

      <hm-timeline :items="todayTimeline.items" :locked="todayTimeline.preview" :free-count="3" />

      <view v-if="todayTimeline.preview" class="unlock" @tap="scrollToShop">
        <text class="unlock__t">开通服务包，解锁完整每日方案 →</text>
      </view>
    </view>

    <!-- 健康管理服务包 -->
    <view class="wrap" id="shop">
      <view class="sec-head">
        <view>
          <text class="hm-sec-title">健康管理服务包</text>
          <text class="hm-sec-sub">三甲医师团队 + AI 助手全程陪伴</text>
        </view>
      </view>

      <view v-for="pkg in packages" :key="pkg.id" class="pkg" @tap="goDetail(pkg.id)">
        <view class="pkg__banner" :style="{ background: 'linear-gradient(135deg,' + pkg.accent + ' 0%, ' + shade(pkg.accent) + ' 100%)' }">
          <view class="pkg__banner-l">
            <text class="pkg__badge">{{ pkg.tagline }}</text>
            <text class="pkg__name">{{ pkg.name }}</text>
            <text class="pkg__sub">{{ pkg.subtitle }}</text>
          </view>
          <text class="pkg__emoji">{{ pkg.icon }}</text>
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
            <view class="pkg__btn" :style="{ background: pkg.accent }">
              <text class="pkg__btn-t">查看详情</text>
            </view>
          </view>

          <view class="pkg__sold">
            <text class="pkg__sold-t">⭐ {{ pkg.rating }} 分 · 已服务 {{ pkg.sold }} 人</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 健康知识 -->
    <view class="wrap">
      <view class="sec-head">
        <view>
          <text class="hm-sec-title">健康小知识</text>
          <text class="hm-sec-sub">来自权威指南的实用建议</text>
        </view>
      </view>
      <view class="kn">
        <view v-for="(k, i) in knowledge" :key="i" class="kn__item">
          <text class="kn__icon">{{ k.icon }}</text>
          <view class="kn__main">
            <text class="kn__t">{{ k.title }}</text>
            <text class="kn__d">{{ k.desc }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="foot-tip">
      <text class="foot-tip__t">本服务为健康管理与生活方式干预，不替代医疗诊断与处方</text>
    </view>
    <view class="hm-safe-bottom"></view>
  </view>
</template>

<script>
import { KNOWLEDGE } from '@/common/mock.js'

export default {
  data() {
    return {
      knowledge: KNOWLEDGE,
      dayTabs: ['第1天', '第2天', '第3天']
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
    goMsg() {
      uni.switchTab({ url: '/pages/message/message' })
    },
    scrollToShop() {
      uni.pageScrollTo({ selector: '#shop', duration: 300, fail() {} })
    }
  }
}
</script>

<style lang="scss" scoped>
.hero {
  background: linear-gradient(160deg, $teal-800 0%, $teal-700 45%, $teal-500 100%);
  padding-bottom: 44rpx;
  border-bottom-left-radius: $radius-lg;
  border-bottom-right-radius: $radius-lg;
}

.hero__bell {
  position: relative;
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero__bell-icon {
  font-size: 34rpx;
}

.hero__badge {
  position: absolute;
  top: 2rpx;
  right: 0;
  min-width: 30rpx;
  height: 30rpx;
  border-radius: 999rpx;
  background: $coral-500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6rpx;
}

.hero__badge-t {
  color: #fff;
  font-size: 18rpx;
  line-height: 18rpx;
}

.hero__body {
  padding: 8rpx 36rpx 0;
}

.hero__hello {
  display: block;
  color: #fff;
  font-size: 46rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
}

.hero__slogan {
  display: block;
  color: rgba(255, 255, 255, 0.78);
  font-size: 25rpx;
  margin-top: 10rpx;
}

.hero__stats {
  margin-top: 36rpx;
  background: rgba(255, 255, 255, 0.16);
  border-radius: $radius-sm;
  padding: 26rpx 0;
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
  color: #fff;
  font-size: 40rpx;
  font-weight: 700;
  line-height: 44rpx;
}

.hero__stat-l {
  color: rgba(255, 255, 255, 0.75);
  font-size: 21rpx;
  margin-top: 8rpx;
}

.hero__stat-line {
  width: 1rpx;
  height: 48rpx;
  background: rgba(255, 255, 255, 0.28);
}

.wrap {
  padding: 32rpx 28rpx 0;
}

.ongoing {
  background: #fff;
  border-radius: $radius-md;
  box-shadow: $shadow-md;
  padding: 24rpx;
  display: flex;
  align-items: center;
  margin-top: -68rpx;
}

.ongoing__icon {
  width: 84rpx;
  height: 84rpx;
  border-radius: $radius-sm;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ongoing__icon-t {
  font-size: 40rpx;
}

.ongoing__main {
  flex: 1;
  padding: 0 20rpx;
  overflow: hidden;
}

.ongoing__name {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $ink-900;
}

.ongoing__meta {
  display: block;
  font-size: 22rpx;
  color: $ink-500;
  margin-top: 6rpx;
}

.ongoing__act {
  padding: 14rpx 26rpx;
  border-radius: 999rpx;
}

.ongoing__act-t {
  color: #fff;
  font-size: 24rpx;
  font-weight: 600;
}

.notice {
  background: $gold-100;
  border-radius: $radius-md;
  padding: 24rpx;
  display: flex;
  align-items: center;
  margin-top: -68rpx;
  box-shadow: $shadow-md;
}

.notice__icon {
  font-size: 38rpx;
  margin-right: 18rpx;
}

.notice__main {
  flex: 1;
}

.notice__t {
  display: block;
  font-size: 27rpx;
  font-weight: 700;
  color: #8a6a2f;
}

.notice__d {
  display: block;
  font-size: 22rpx;
  color: #a3803f;
  margin-top: 6rpx;
}

.sec-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.day-switch {
  display: flex;
  background: $warm-100;
  border-radius: 999rpx;
  padding: 4rpx;
}

.day-switch__item {
  padding: 8rpx 18rpx;
  border-radius: 999rpx;
}

.day-switch__item--on {
  background: #fff;
  box-shadow: $shadow-sm;
}

.day-switch__t {
  font-size: 21rpx;
  color: $ink-500;
}

.day-switch__item--on .day-switch__t {
  color: $teal-700;
  font-weight: 700;
}

.unlock {
  background: $teal-100;
  border-radius: $radius-sm;
  padding: 24rpx;
  text-align: center;
}

.unlock__t {
  color: $teal-800;
  font-size: 25rpx;
  font-weight: 600;
}

.pkg {
  background: #fff;
  border-radius: $radius-md;
  overflow: hidden;
  box-shadow: $shadow-md;
  margin-bottom: 28rpx;
}

.pkg__banner {
  padding: 30rpx 28rpx;
  display: flex;
  align-items: center;
}

.pkg__banner-l {
  flex: 1;
  overflow: hidden;
}

.pkg__badge {
  display: inline-block;
  font-size: 19rpx;
  color: #fff;
  background: rgba(255, 255, 255, 0.22);
  padding: 5rpx 14rpx;
  border-radius: 999rpx;
}

.pkg__name {
  display: block;
  color: #fff;
  font-size: 38rpx;
  font-weight: 700;
  margin-top: 14rpx;
  letter-spacing: 1rpx;
}

.pkg__sub {
  display: block;
  color: rgba(255, 255, 255, 0.82);
  font-size: 22rpx;
  margin-top: 8rpx;
}

.pkg__emoji {
  font-size: 76rpx;
  opacity: 0.9;
  margin-left: 16rpx;
}

.pkg__body {
  padding: 24rpx 28rpx 26rpx;
}

.pkg__tags {
  display: flex;
  flex-wrap: wrap;
}

.pkg__tag {
  font-size: 21rpx;
  padding: 6rpx 16rpx;
  border-radius: 999rpx;
  margin: 0 12rpx 12rpx 0;
}

.pkg__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12rpx;
}

.pkg__price {
  display: flex;
  align-items: baseline;
}

.pkg__cur {
  font-size: 24rpx;
  color: $coral-500;
  font-weight: 700;
}

.pkg__now {
  font-size: 52rpx;
  color: $coral-500;
  font-weight: 700;
  line-height: 52rpx;
  margin-left: 2rpx;
}

.pkg__origin {
  font-size: 23rpx;
  color: $ink-400;
  text-decoration: line-through;
  margin-left: 12rpx;
}

.pkg__dur {
  font-size: 22rpx;
  color: $ink-500;
  margin-left: 8rpx;
}

.pkg__btn {
  padding: 16rpx 34rpx;
  border-radius: 999rpx;
}

.pkg__btn-t {
  color: #fff;
  font-size: 26rpx;
  font-weight: 700;
}

.pkg__sold {
  margin-top: 16rpx;
}

.pkg__sold-t {
  font-size: 21rpx;
  color: $ink-400;
}

.kn {
  background: #fff;
  border-radius: $radius-md;
  box-shadow: $shadow-sm;
  padding: 8rpx 24rpx;
}

.kn__item {
  display: flex;
  align-items: flex-start;
  padding: 22rpx 0;
  border-bottom: 1rpx solid $warm-100;
}

.kn__item:last-child {
  border-bottom: none;
}

.kn__icon {
  font-size: 32rpx;
  margin-right: 18rpx;
}

.kn__main {
  flex: 1;
}

.kn__t {
  display: block;
  font-size: 26rpx;
  font-weight: 600;
  color: $ink-900;
}

.kn__d {
  display: block;
  font-size: 22rpx;
  color: $ink-500;
  margin-top: 6rpx;
}

.foot-tip {
  padding: 40rpx 48rpx 20rpx;
  text-align: center;
}

.foot-tip__t {
  font-size: 20rpx;
  color: $ink-400;
  line-height: 1.7;
}
</style>
