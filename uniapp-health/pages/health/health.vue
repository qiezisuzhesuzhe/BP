<template>
  <view class="hm-page">
    <!-- 顶部：标题 + 家人切换 -->
    <view class="hero">
      <hm-navbar title="" :show-back="false" bg-color="transparent"></hm-navbar>

      <view class="hero__body">
        <view class="hero__top">
          <text class="hero__title">我的健康</text>
          <view class="hero__members">
            <view
              v-for="m in memberList"
              :key="m.key"
              class="hero__member"
              :class="{ 'hero__member--on': m.key === memberKey }"
              @tap="switchMember(m.key)"
            >
              <text class="hero__member-t">{{ m.avatarText }}</text>
            </view>
            <view class="hero__member hero__member--add" @tap="addMember">
              <text class="fa-solid fa-plus hero__member-icon"></text>
            </view>
          </view>
        </view>

        <!-- 三分段标签 -->
        <view class="segs">
          <view
            v-for="s in segs"
            :key="s.key"
            class="seg"
            :class="{ 'seg--on': s.key === segKey }"
            @tap="switchSeg(s.key)"
          >
            <text class="seg__t">{{ s.label }}</text>
          </view>
        </view>

        <!-- 问候 + 吉祥物 -->
        <view class="greet">
          <view class="greet__l">
            <text class="greet__hello">{{ greeting }}，{{ shortName }}</text>
            <text class="greet__sub">今天也要好好照顾自己哦</text>
          </view>
          <view class="greet__mascot">
            <text class="fa-solid fa-dove greet__mascot-icon"></text>
          </view>
        </view>
      </view>
    </view>

    <!-- 快捷入口 -->
    <view class="wrap wrap--first">
      <view class="quick">
        <view v-for="q in quick" :key="q.key" class="quick__item" @tap="onQuick(q)">
          <view class="quick__icon" :style="{ background: q.bg }">
            <text class="quick__icon-t" :class="q.icon" :style="{ color: q.color }"></text>
          </view>
          <text class="quick__t">{{ q.label }}</text>
        </view>
      </view>
    </view>

    <!-- 今日健康评分 -->
    <view class="wrap">
      <view class="sec-head">
        <text class="hm-sec-title">今日健康评分</text>
        <text class="hm-sec-sub">{{ score.date }}</text>
      </view>

      <view class="score">
        <view class="score__l">
          <view class="score__ring" :style="ringStyle">
            <view class="score__ring-in">
              <text class="score__v">{{ score.score }}</text>
              <text class="score__u">分</text>
            </view>
          </view>
          <view class="score__delta" :class="{ 'score__delta--down': score.deltaDown }">
            <text class="score__delta-icon" :class="score.deltaDown ? 'fa-solid fa-arrow-down' : 'fa-solid fa-arrow-up'"></text>
            <text class="score__delta-t">{{ score.deltaText }}</text>
          </view>
        </view>

        <view class="score__r">
          <view v-for="(it, i) in score.items" :key="i" class="score__item">
            <text class="score__item-icon" :class="it.icon"></text>
            <text class="score__item-t">{{ it.label }}</text>
            <text class="score__item-d">{{ it.delta }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 今日重点建议 -->
    <view class="wrap">
      <view class="sec-head">
        <text class="hm-sec-title">今日重点建议</text>
      </view>

      <view class="focus">
        <view class="focus__head">
          <view class="focus__head-l">
            <text class="focus__title">{{ focus.title }}</text>
            <text class="focus__remain">{{ focus.remainText }}</text>
          </view>
          <view class="focus__btn" @tap="onFocus">
            <text class="focus__btn-t">{{ focus.btnText }}</text>
          </view>
        </view>

        <view class="focus__bar">
          <view class="focus__bar-in" :style="{ width: focusPercent + '%' }"></view>
        </view>
        <view class="focus__meta">
          <text class="focus__meta-cur">{{ focusCurrent }} {{ focus.unit }}</text>
          <text class="focus__meta-tar">目标 {{ focusTarget }} {{ focus.unit }}</text>
        </view>

        <view class="focus__bonus">
          <text class="fa-solid fa-gift focus__bonus-icon"></text>
          <text class="focus__bonus-t">{{ focus.bonusText }}</text>
          <text class="focus__bonus-v">+{{ focus.bonus }}</text>
        </view>
      </view>
    </view>

    <!-- 成就 -->
    <view class="wrap">
      <view class="sec-head">
        <text class="hm-sec-title">成就</text>
        <text class="hm-sec-sub">已获得 {{ achieveDone }} / {{ achieve.length }}</text>
      </view>

      <view class="achieve">
        <view v-for="a in achieve" :key="a.key" class="achieve__item">
          <view class="achieve__medal" :class="{ 'achieve__medal--off': !a.done }">
            <text class="achieve__medal-icon" :class="a.icon"></text>
          </view>
          <text class="achieve__t" :class="{ 'achieve__t--off': !a.done }">{{ a.label }}</text>
        </view>
      </view>
    </view>

    <!-- 今日健康计划 -->
    <view class="wrap">
      <view class="sec-head">
        <text class="hm-sec-title">今日健康计划</text>
        <view class="sec-head__side" @tap="goAllPlan">
          <text class="hm-sec-sub">已完成 {{ plan.done }}/{{ plan.total }}</text>
          <text class="fa-solid fa-angle-right sec-head__arrow"></text>
        </view>
      </view>

      <view class="plan">
        <view v-for="(it, i) in plan.items" :key="i" class="plan__row">
          <view class="plan__rail">
            <view class="plan__dot" :style="{ background: planMeta(it.cat).bg }">
              <text class="plan__dot-icon" :class="planMeta(it.cat).icon" :style="{ color: planMeta(it.cat).color }"></text>
            </view>
            <view v-if="i < plan.items.length - 1" class="plan__line"></view>
          </view>

          <view class="plan__card">
            <view class="plan__head">
              <text class="plan__time">{{ it.time }}</text>
              <text
                class="plan__tag"
                :style="{ color: planMeta(it.cat).color, background: planMeta(it.cat).bg }"
              >{{ planMeta(it.cat).label }}</text>
              <text v-if="it.done" class="fa-solid fa-circle-check plan__done"></text>
            </view>
            <text class="plan__title">{{ it.title }}</text>
            <text class="plan__desc">{{ it.desc }}</text>

            <!-- 跟练视频 -->
            <view v-if="it.video" class="plan__video" @tap="playVideo(it.title)">
              <image class="plan__video-img" :src="videoCover" mode="aspectFill"></image>
              <view class="plan__video-mask"></view>
              <view class="plan__video-play">
                <text class="fa-solid fa-play plan__video-play-icon"></text>
              </view>
              <text class="plan__video-dur">12:00</text>
            </view>

            <!-- 关联商品 -->
            <view v-if="it.goods && it.goods.length" class="plan__goods">
              <view v-for="g in it.goods" :key="g.id" class="plan__good" @tap="goGood(g)">
                <image class="plan__good-img" :src="g.img" mode="aspectFill"></image>
                <view class="plan__good-info">
                  <text class="plan__good-name">{{ g.name }}</text>
                  <text class="plan__good-price">¥{{ g.price }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 健康风险预测 -->
    <view class="wrap">
      <view class="sec-head">
        <text class="hm-sec-title">健康风险预测</text>
      </view>

      <view v-for="r in forecast" :key="r.key" class="fore">
        <view class="fore__head">
          <view class="fore__head-l">
            <text class="fore__period">{{ r.period }}</text>
            <text class="fore__name">{{ r.name }}</text>
          </view>
          <view class="fore__pct">
            <text class="fore__pct-v">{{ r.percent }}</text>
            <text class="fore__pct-u">%</text>
          </view>
        </view>

        <view class="fore__bar">
          <view class="fore__bar-in" :style="{ width: r.percent + '%' }"></view>
        </view>

        <text class="fore__label">干预方案</text>
        <view class="fore__plans">
          <view v-for="(p, pi) in r.plans" :key="pi" class="fore__plan">
            <text class="fore__plan-dot"></text>
            <text class="fore__plan-t">{{ p }}</text>
          </view>
        </view>

        <view class="fore__btn" @tap="onForecast(r)">
          <text class="fore__btn-t">{{ r.btnText }}</text>
          <text class="fa-solid fa-angle-right fore__btn-icon"></text>
        </view>
      </view>
    </view>

    <!-- 疾病风险 -->
    <view class="wrap">
      <view class="sec-head">
        <text class="hm-sec-title">疾病风险</text>
        <view class="sec-head__side" @tap="goAllDisease">
          <text class="hm-sec-sub">全部</text>
          <text class="fa-solid fa-angle-right sec-head__arrow"></text>
        </view>
      </view>

      <view class="dis">
        <view v-for="d in disease" :key="d.key" class="dis__item" @tap="goDisease(d)">
          <view class="dis__l">
            <text class="dis__name">{{ d.name }}</text>
            <text class="dis__level" :style="{ color: d.color, background: d.bg }">{{ d.level }}</text>
          </view>
          <view class="dis__r">
            <view class="dis__bar">
              <view class="dis__bar-in" :style="{ width: d.score + '%', background: d.color }"></view>
            </view>
            <text class="dis__score" :style="{ color: d.color }">{{ d.score }}</text>
            <text class="fa-solid fa-angle-right dis__arrow"></text>
          </view>
        </view>
        <view class="dis__tip" @tap="goDiseaseInfo">
          <text class="fa-solid fa-circle-info dis__tip-icon"></text>
          <text class="dis__tip-t">查看风险评估说明</text>
        </view>
      </view>
    </view>

    <!-- 推荐 -->
    <view class="wrap">
      <view class="sec-head">
        <text class="hm-sec-title">推荐</text>
        <view class="sec-head__side" @tap="goMall">
          <text class="hm-sec-sub">更多</text>
          <text class="fa-solid fa-angle-right sec-head__arrow"></text>
        </view>
      </view>

      <view class="rec">
        <view v-for="g in recommend" :key="g.id" class="rec__item" @tap="goGood(g)">
          <image class="rec__img" :src="g.img" mode="aspectFill"></image>
          <view class="rec__info">
            <text v-if="g.tag" class="rec__tag">{{ g.tag }}</text>
            <text class="rec__name">{{ g.name }}</text>
            <text class="rec__desc">{{ g.desc }}</text>
            <view class="rec__foot">
              <view class="rec__price">
                <text class="rec__price-s">¥</text>
                <text class="rec__price-v">{{ g.price }}</text>
              </view>
              <view class="rec__btn">
                <text class="rec__btn-t">{{ g.btnText }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="hm-safe-bottom"></view>
  </view>
</template>

<script>
import { mapState } from 'vuex'
import {
  HEALTH_MEMBERS,
  HEALTH_QUICK,
  HEALTH_SCORE,
  HEALTH_FOCUS,
  HEALTH_ACHIEVE,
  HEALTH_PLAN,
  HEALTH_PLAN_META,
  HEALTH_RISK_FORECAST,
  HEALTH_DISEASE_RISK,
  HEALTH_RECOMMEND
} from '@/common/mock.js'

const VIDEO_COVER =
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=' +
  encodeURIComponent('video cover of a person practicing baduanjin qigong in a bright quiet room, soft morning light, calm wellness aesthetic, clean composition') +
  '&image_size=landscape_16_9'

export default {
  data() {
    return {
      members: HEALTH_MEMBERS,
      memberKey: 'self',
      segs: [
        { key: 'health', label: '我的健康' },
        { key: 'visit', label: '我的就医' },
        { key: 'family', label: '家人健康' }
      ],
      segKey: 'health',
      quick: HEALTH_QUICK,
      score: HEALTH_SCORE,
      focus: HEALTH_FOCUS,
      achieve: HEALTH_ACHIEVE,
      plan: HEALTH_PLAN,
      forecast: HEALTH_RISK_FORECAST,
      disease: HEALTH_DISEASE_RISK,
      recommend: HEALTH_RECOMMEND,
      videoCover: VIDEO_COVER
    }
  },
  computed: {
    ...mapState(['profile']),
    greeting() {
      const h = new Date().getHours()
      if (h < 6) return '凌晨好'
      if (h < 11) return '早上好'
      if (h < 14) return '中午好'
      if (h < 18) return '下午好'
      return '晚上好'
    },
    shortName() {
      const n = (this.profile && this.profile.name) || ''
      if (!n) return '您'
      return n.charAt(0) + (this.profile.gender === '男' ? '先生' : '女士')
    },
    memberList() {
      const n = (this.profile && this.profile.name) || ''
      return this.members.map((m) =>
        m.key === 'self' && n ? Object.assign({}, m, { avatarText: n.charAt(0) }) : m
      )
    },
    ringStyle() {
      const deg = Math.round((this.score.score / this.score.total) * 360)
      return {
        background:
          'conic-gradient(#4ab89e 0deg, #7dd4bc ' + deg + 'deg, #edf5f2 ' + deg + 'deg 360deg)'
      }
    },
    focusPercent() {
      const p = (this.focus.current / this.focus.target) * 100
      return Math.max(0, Math.min(100, Math.round(p)))
    },
    focusCurrent() {
      return this.fmt(this.focus.current)
    },
    focusTarget() {
      return this.fmt(this.focus.target)
    },
    achieveDone() {
      return this.achieve.filter((a) => a.done).length
    }
  },
  methods: {
    fmt(n) {
      return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    planMeta(cat) {
      return HEALTH_PLAN_META[cat] || { label: '计划', color: '#389a82', bg: '#d4f5ee', icon: 'fa-solid fa-circle' }
    },
    switchMember(key) {
      this.memberKey = key
      const m = this.members.find((x) => x.key === key)
      uni.showToast({ title: '已切换至' + (m ? m.name : ''), icon: 'none' })
    },
    addMember() {
      uni.showToast({ title: '添加家庭成员', icon: 'none' })
    },
    switchSeg(key) {
      this.segKey = key
      if (key !== 'health') {
        uni.showToast({ title: '功能开发中', icon: 'none' })
        this.segKey = 'health'
      }
    },
    onQuick(q) {
      if (q.key === 'record' || q.key === 'manual') {
        uni.navigateTo({ url: '/pages/device/device', fail() {} })
        return
      }
      uni.showToast({ title: q.label, icon: 'none' })
    },
    onFocus() {
      uni.showToast({ title: '开始记录步数', icon: 'none' })
    },
    onForecast(r) {
      uni.showToast({ title: r.btnText, icon: 'none' })
    },
    goAllPlan() {
      uni.showToast({ title: '查看全部计划', icon: 'none' })
    },
    playVideo(title) {
      uni.showToast({ title: '「' + (title || '跟练视频') + '」演示', icon: 'none' })
    },
    goGood() {
      uni.switchTab({ url: '/pages/mall/mall' })
    },
    goMall() {
      uni.switchTab({ url: '/pages/mall/mall' })
    },
    goDisease(d) {
      uni.showToast({ title: d.name + '风险详情', icon: 'none' })
    },
    goAllDisease() {
      uni.showToast({ title: '全部疾病风险', icon: 'none' })
    },
    goDiseaseInfo() {
      uni.showToast({ title: '风险评估说明', icon: 'none' })
    }
  }
}
</script>

<style lang="scss" scoped>
/* ---------- 顶部 ---------- */
.hero {
  background: transparent;
  padding-bottom: $space-2;
}

.hero__body {
  padding: 0 $space-4;
}

.hero__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hero__title {
  font-size: $page-title-size;
  font-weight: $page-title-weight;
  color: $text-primary;
  line-height: $line-height-tight;
  letter-spacing: 1rpx;
}

.hero__members {
  display: flex;
  align-items: center;
}

.hero__member {
  width: $size-product-user-avatar;
  height: $size-product-user-avatar;
  border-radius: 50%;
  background: $bg-surface;
  border: 2rpx solid $border-subtle;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: -$space-2;
  box-shadow: $shadow-sm;
}

.hero__member--on {
  border-color: $brand-primary-hover;
  background: $brand-soft;
}

.hero__member--add {
  background: $bg-subtle;
  margin-left: $space-1;
}

.hero__member-t {
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  color: $text-secondary;
}

.hero__member--on .hero__member-t {
  color: $brand-primary-active;
}

.hero__member-icon {
  font-size: $font-size-xs;
  color: $text-muted;
}

/* ---------- 分段标签 ---------- */
.segs {
  display: flex;
  align-items: center;
  margin-top: $space-4;
}

.seg {
  padding: $space-2 $space-4;
  border-radius: $radius-full;
  background: $bg-surface;
  margin-right: $space-2;
  box-shadow: $shadow-sm;
}

.seg--on {
  background: $brand-primary-hover;
}

.seg__t {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $text-muted;
}

.seg--on .seg__t {
  color: $text-inverse;
}

/* ---------- 问候 ---------- */
.greet {
  margin-top: $space-4;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.greet__hello {
  display: block;
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $text-primary;
  line-height: $line-height-tight;
}

.greet__sub {
  display: block;
  font-size: $font-size-xs;
  color: $text-muted;
  margin-top: $space-1;
}

.greet__mascot {
  width: $size-avatar-md;
  height: $size-avatar-md;
  border-radius: 50%;
  background: linear-gradient(150deg, $brand-cyan-soft, $brand-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: $shadow-sm;
}

.greet__mascot-icon {
  font-size: $font-size-xl;
  color: $brand-primary-active;
}

/* ---------- 通用容器 ---------- */
.wrap {
  height: auto;
  padding: $space-4 $space-4 0;
}

.sec-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: $space-sec-head-top;
  margin-bottom: $space-sec-head-bottom;
}

.sec-head--first {
  margin-top: 0;
}

.sec-head__side {
  display: flex;
  align-items: center;
}

.sec-head__arrow {
  font-size: $font-size-xs;
  color: $text-disabled;
  margin-left: $space-1;
}

/* ---------- 快捷入口 ---------- */
.quick {
  background: $bg-surface;
  border-radius: $radius-card;
  box-shadow: $shadow-sm;
  padding: $space-4 $space-2;
  display: flex;
  flex-wrap: wrap;
}

.quick__item {
  width: 33.33%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: $space-2 0;
}

.quick__icon {
  width: $size-icon-xl;
  height: $size-icon-xl;
  border-radius: $radius-card-child;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick__icon-t {
  font-size: $font-size-md;
}

.quick__t {
  font-size: $font-size-sm;
  color: $text-secondary;
  margin-top: $space-2;
}

/* ---------- 今日健康评分 ---------- */
.score {
  background: $bg-surface;
  border-radius: $radius-card;
  box-shadow: $shadow-sm;
  padding: $space-4;
  display: flex;
  align-items: center;
}

.score__l {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  padding-right: $space-4;
}

.score__ring {
  width: 200rpx;
  height: 200rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.score__ring-in {
  width: 156rpx;
  height: 156rpx;
  border-radius: 50%;
  background: $bg-surface;
  display: flex;
  align-items: baseline;
  justify-content: center;
}

.score__v {
  font-size: $font-size-3xl;
  font-weight: $font-weight-heavy;
  color: $text-primary;
  font-family: $font-family-en;
  line-height: 1;
}

.score__u {
  font-size: $font-size-xs;
  color: $text-muted;
  margin-left: 2rpx;
}

.score__delta {
  display: flex;
  align-items: center;
  margin-top: $space-3;
  padding: $space-1 $space-2;
  border-radius: $radius-full;
  background: $bg-subtle;
}

.score__delta--down {
  background: #fdeeee;
}

.score__delta-icon {
  font-size: $font-size-2xs;
  color: $text-muted;
  margin-right: $space-1;
}

.score__delta--down .score__delta-icon {
  color: $danger;
}

.score__delta-t {
  font-size: $font-size-xs;
  color: $text-muted;
}

.score__delta--down .score__delta-t {
  color: $danger;
}

.score__r {
  flex: 1;
  border-left: 1rpx solid $border-subtle;
  padding-left: $space-4;
}

.score__item {
  display: flex;
  align-items: center;
  padding: $space-2 0;
}

.score__item-icon {
  font-size: $font-size-xs;
  color: $text-disabled;
  width: $space-5;
}

.score__item-t {
  flex: 1;
  font-size: $font-size-sm;
  color: $text-secondary;
}

.score__item-d {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $danger;
  font-family: $font-family-en;
}

/* ---------- 今日重点建议 ---------- */
.focus {
  border-radius: $radius-card;
  background: linear-gradient(140deg, $brand-primary 0%, $brand-green 55%, $brand-cyan 100%);
  padding: $space-4;
  box-shadow: $shadow-md;
}

.focus__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.focus__head-l {
  flex: 1;
  padding-right: $space-3;
}

.focus__title {
  display: block;
  font-size: $font-size-md;
  font-weight: $font-weight-bold;
  color: $text-primary;
  line-height: $line-height-tight;
}

.focus__remain {
  display: block;
  font-size: $font-size-xs;
  color: rgba(26, 42, 60, 0.72);
  margin-top: $space-1;
}

.focus__btn {
  flex-shrink: 0;
  padding: $space-2 $space-3;
  border-radius: $radius-full;
  background: $bg-surface;
  box-shadow: $shadow-sm;
}

.focus__btn-t {
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  color: $brand-primary-active;
}

.focus__bar {
  height: $space-2;
  border-radius: $radius-full;
  background: rgba(255, 255, 255, 0.55);
  margin-top: $space-4;
  overflow: hidden;
}

.focus__bar-in {
  height: 100%;
  border-radius: $radius-full;
  background: $bg-surface;
}

.focus__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: $space-2;
}

.focus__meta-cur {
  font-size: $font-size-sm;
  font-weight: $font-weight-bold;
  color: $text-primary;
  font-family: $font-family-en;
}

.focus__meta-tar {
  font-size: $font-size-xs;
  color: rgba(26, 42, 60, 0.72);
}

.focus__bonus {
  display: flex;
  align-items: center;
  margin-top: $space-4;
  padding-top: $space-3;
  border-top: 1rpx solid rgba(255, 255, 255, 0.5);
}

.focus__bonus-icon {
  font-size: $font-size-xs;
  color: $gold-deep;
  margin-right: $space-1;
}

.focus__bonus-t {
  flex: 1;
  font-size: $font-size-xs;
  color: rgba(26, 42, 60, 0.82);
}

.focus__bonus-v {
  font-size: $font-size-sm;
  font-weight: $font-weight-bold;
  color: $gold-deep;
  font-family: $font-family-en;
}

/* ---------- 成就 ---------- */
.achieve {
  background: $bg-surface;
  border-radius: $radius-card;
  box-shadow: $shadow-sm;
  padding: $space-4 $space-2;
  display: flex;
}

.achieve__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.achieve__medal {
  width: $size-icon-xl;
  height: $size-icon-xl;
  border-radius: 50%;
  background: linear-gradient(150deg, #f7e6ae 0%, $gold 100%);
  border: 2rpx solid $gold-line;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6rpx 24rpx $gold-glow;
}

.achieve__medal--off {
  background: $bg-subtle;
  border-color: $border-subtle;
  box-shadow: none;
}

.achieve__medal-icon {
  font-size: $font-size-md;
  color: $bg-surface;
}

.achieve__medal--off .achieve__medal-icon {
  color: $text-hint;
}

.achieve__t {
  font-size: $font-size-sm;
  color: $text-secondary;
  margin-top: $space-2;
}

.achieve__t--off {
  color: $text-disabled;
}

/* ---------- 今日健康计划 ---------- */
.plan__row {
  display: flex;
  align-items: stretch;
}

.plan__rail {
  width: $size-avatar-sm;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.plan__dot {
  width: $size-product-user-avatar;
  height: $size-product-user-avatar;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: $space-1;
  box-shadow: $shadow-sm;
}

.plan__dot-icon {
  font-size: $font-size-xs;
}

.plan__line {
  flex: 1;
  width: 1rpx;
  background: $bg-section;
  margin: $space-1 0;
}

.plan__card {
  flex: 1;
  background: $bg-surface;
  border-radius: $radius-card-child;
  padding: $space-3;
  margin: 0 0 $space-data-list-gap $space-1;
  box-shadow: $shadow-sm;
}

.plan__head {
  display: flex;
  align-items: center;
  margin-bottom: $space-1;
}

.plan__time {
  font-size: $font-size-sm;
  font-weight: $font-weight-bold;
  color: $text-secondary;
  letter-spacing: 1rpx;
  font-family: $font-family-en;
}

.plan__tag {
  font-size: $font-size-2xs;
  padding: 2rpx $space-2;
  border-radius: $radius-full;
  margin-left: $space-2;
}

.plan__done {
  margin-left: auto;
  font-size: $font-size-sm;
  color: $success;
}

.plan__title {
  display: block;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin-bottom: $space-1;
}

.plan__desc {
  display: block;
  font-size: $font-size-xs;
  color: $text-muted;
  line-height: $line-height-relaxed;
}

.plan__video {
  position: relative;
  margin-top: $space-2;
  border-radius: $radius-sm;
  overflow: hidden;
}

.plan__video-img {
  width: 100%;
  height: $size-detail-image-height;
  display: block;
}

.plan__video-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(15, 61, 53, 0.05) 55%, rgba(15, 61, 53, 0.42));
}

.plan__video-play {
  position: absolute;
  top: 50%;
  left: 50%;
  width: $size-icon-lg;
  height: $size-icon-lg;
  margin-left: -$size-icon-lg * 0.5;
  margin-top: -$size-icon-lg * 0.5;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: $shadow-md;
}

.plan__video-play-icon {
  color: $brand-primary-active;
  font-size: $font-size-sm;
  margin-left: 4rpx;
}

.plan__video-dur {
  position: absolute;
  right: $space-2;
  bottom: $space-2;
  color: $text-inverse;
  font-size: $font-size-2xs;
  background: rgba(0, 0, 0, 0.35);
  padding: 2rpx $space-1;
  border-radius: $radius-xs;
  letter-spacing: 1rpx;
}

.plan__goods {
  display: flex;
  margin-top: $space-2;
}

.plan__good {
  flex: 1;
  background: $bg-section;
  border-radius: $radius-sm;
  overflow: hidden;
  margin-right: $space-2;
}

.plan__good:last-child {
  margin-right: 0;
}

.plan__good-img {
  width: 100%;
  height: 140rpx;
  display: block;
}

.plan__good-info {
  padding: $space-2;
}

.plan__good-name {
  display: block;
  font-size: $font-size-xs;
  color: $text-secondary;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.plan__good-price {
  display: block;
  font-size: $font-size-sm;
  font-weight: $font-weight-bold;
  color: $badge;
  font-family: $font-family-en;
  margin-top: 2rpx;
}

/* ---------- 健康风险预测 ---------- */
.fore {
  background: $bg-surface;
  border-radius: $radius-card;
  box-shadow: $shadow-sm;
  padding: $space-4;
  margin-bottom: $space-data-list-gap;
}

.fore:last-child {
  margin-bottom: 0;
}

.fore__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.fore__period {
  display: block;
  font-size: $font-size-xs;
  color: $text-muted;
}

.fore__name {
  display: block;
  font-size: $font-size-md;
  font-weight: $font-weight-bold;
  color: $text-primary;
  margin-top: $space-1;
}

.fore__pct {
  display: flex;
  align-items: baseline;
}

.fore__pct-v {
  font-size: $font-size-2xl;
  font-weight: $font-weight-heavy;
  color: $warning;
  font-family: $font-family-en;
  line-height: 1;
}

.fore__pct-u {
  font-size: $font-size-xs;
  color: $warning;
  margin-left: 2rpx;
}

.fore__bar {
  height: $space-1;
  border-radius: $radius-full;
  background: $bg-subtle;
  margin-top: $space-3;
  overflow: hidden;
}

.fore__bar-in {
  height: 100%;
  border-radius: $radius-full;
  background: linear-gradient(90deg, $warning, #f2994a);
}

.fore__label {
  display: block;
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  color: $text-secondary;
  margin-top: $space-4;
}

.fore__plans {
  margin-top: $space-2;
}

.fore__plan {
  display: flex;
  align-items: flex-start;
  margin-bottom: $space-2;
}

.fore__plan-dot {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background: $brand-primary-hover;
  margin: 12rpx $space-2 0 0;
  flex-shrink: 0;
}

.fore__plan-t {
  flex: 1;
  font-size: $font-size-xs;
  color: $text-muted;
  line-height: $line-height-relaxed;
}

.fore__btn {
  margin-top: $space-3;
  padding: $space-3;
  border-radius: $radius-control;
  background: $brand-soft;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fore__btn-t {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $brand-primary-active;
}

.fore__btn-icon {
  font-size: $font-size-xs;
  color: $brand-primary-active;
  margin-left: $space-1;
}

/* ---------- 疾病风险 ---------- */
.dis {
  background: $bg-surface;
  border-radius: $radius-card;
  box-shadow: $shadow-sm;
  padding: $space-2 $space-4;
}

.dis__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space-3 0;
  border-bottom: 1rpx solid $border-subtle;
}

.dis__l {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.dis__name {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.dis__level {
  font-size: $font-size-2xs;
  padding: 2rpx $space-2;
  border-radius: $radius-full;
  margin-left: $space-2;
}

.dis__r {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.dis__bar {
  width: 140rpx;
  height: $space-1;
  border-radius: $radius-full;
  background: $bg-subtle;
  overflow: hidden;
}

.dis__bar-in {
  height: 100%;
  border-radius: $radius-full;
}

.dis__score {
  font-size: $font-size-sm;
  font-weight: $font-weight-bold;
  font-family: $font-family-en;
  margin-left: $space-2;
  min-width: $space-6;
  text-align: right;
}

.dis__arrow {
  font-size: $font-size-xs;
  color: $text-disabled;
  margin-left: $space-2;
}

.dis__tip {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-3 0;
}

.dis__tip-icon {
  font-size: $font-size-xs;
  color: $text-disabled;
  margin-right: $space-1;
}

.dis__tip-t {
  font-size: $font-size-xs;
  color: $text-muted;
}

/* ---------- 推荐 ---------- */
.rec__item {
  background: $bg-surface;
  border-radius: $radius-card;
  box-shadow: $shadow-sm;
  overflow: hidden;
  display: flex;
  margin-bottom: $space-data-list-gap;
}

.rec__item:last-child {
  margin-bottom: 0;
}

.rec__img {
  width: 200rpx;
  height: 200rpx;
  flex-shrink: 0;
  display: block;
}

.rec__info {
  flex: 1;
  padding: $space-3;
  display: flex;
  flex-direction: column;
}

.rec__tag {
  align-self: flex-start;
  font-size: $font-size-2xs;
  color: $brand-primary-active;
  background: $label-soft-bg;
  border: 1rpx solid $label-soft-border;
  padding: 2rpx $space-2;
  border-radius: $radius-xs;
}

.rec__name {
  display: block;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin-top: $space-1;
}

.rec__desc {
  display: block;
  font-size: $font-size-xs;
  color: $text-muted;
  line-height: $line-height-normal;
  margin-top: $space-1;
}

.rec__foot {
  margin-top: auto;
  padding-top: $space-2;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.rec__price {
  display: flex;
  align-items: baseline;
}

.rec__price-s {
  font-size: $font-size-xs;
  color: $badge;
  font-weight: $font-weight-semibold;
}

.rec__price-v {
  font-size: $font-size-lg;
  font-weight: $font-weight-heavy;
  color: $badge;
  font-family: $font-family-en;
  line-height: 1;
}

.rec__btn {
  padding: $space-1 $space-3;
  border-radius: $radius-full;
  background: $brand-primary-hover;
}

.rec__btn-t {
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  color: $text-inverse;
}
</style>
