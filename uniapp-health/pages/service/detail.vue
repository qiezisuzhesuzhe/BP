<template>
  <view class="hm-page" v-if="pkg">
    <view class="nav-fixed">
      <hm-navbar
        :title="navSolid ? pkg.name : ''"
        :bg-color="navSolid ? '#ffffff' : 'transparent'"
        :text-color="navSolid ? '#1a2a3c' : '#ffffff'"
      />
    </view>

    <view class="hero">
      <image class="hero__img" :src="pkg.heroImg" mode="aspectFill" />
      <view class="hero__mask"></view>
    </view>

    <view class="wrap">
      <view class="card intro">
        <view class="intro__tagline" :style="{ color: pkg.accent, background: pkg.accentSoft }">
          <text class="intro__tagline-t">{{ pkg.tagline }}</text>
        </view>

        <view class="intro__head">
          <text class="intro__name">{{ pkg.name }}</text>
          <text class="intro__dur" :style="{ color: pkg.accent, background: pkg.accentSoft }">{{ pkg.duration }}</text>
        </view>
        <text class="intro__sub">{{ pkg.subtitle }}</text>

        <view class="intro__meta">
          <text class="intro__meta-t"><text class="fa-solid fa-star intro__star"></text> {{ pkg.rating }} 分</text>
          <text class="intro__meta-dot">·</text>
          <text class="intro__meta-t">已服务 {{ pkg.sold }} 人</text>
          <text class="intro__meta-dot">·</text>
          <text class="intro__meta-t"><text :class="pkg.icon"></text> 医师团队审核</text>
        </view>

        <view class="intro__price">
          <text class="intro__cur">¥</text>
          <text class="intro__now">{{ pkg.price }}</text>
          <text class="intro__origin">¥{{ pkg.originPrice }}</text>
          <text class="intro__save">限时省 {{ saved }} 元</text>
        </view>

        <view class="intro__tags">
          <text v-for="(t, i) in pkg.tags" :key="i" class="intro__tag">{{ t }}</text>
        </view>
      </view>
    </view>

    <view class="wrap">
      <view class="sec-head">
        <text class="hm-sec-title">服务亮点</text>
        <text class="hm-sec-sub">共 {{ pkg.highlights.length }} 项核心能力</text>
      </view>
      <view v-for="(h, i) in pkg.highlights" :key="i" class="card hl">
        <view class="hl__icon" :style="{ background: pkg.accentSoft }">
          <text class="hl__icon-t" :class="h.icon"></text>
        </view>
        <view class="hl__main">
          <text class="hl__t">{{ h.title }}</text>
          <text class="hl__d">{{ h.desc }}</text>
        </view>
      </view>
    </view>

    <view class="wrap">
      <view class="sec-head">
        <text class="hm-sec-title">服务内容清单</text>
        <text class="hm-sec-sub">开通后立即生效，服务期内有效</text>
      </view>
      <view class="card srv">
        <view class="srv__row srv__row--head">
          <text class="srv__c1 srv__th">服务项目</text>
          <text class="srv__c2 srv__th">规格</text>
        </view>
        <view v-for="(s, i) in pkg.services" :key="i" class="srv__row">
          <view class="srv__c1">
            <text class="srv__dot" :style="{ background: pkg.accent }"></text>
            <text class="srv__name">{{ s.name }}</text>
          </view>
          <text class="srv__spec">{{ s.spec }}</text>
        </view>
      </view>
    </view>

    <view v-for="(section, i) in pkg.detailSections" :key="'d' + i" class="wrap">
      <view class="sec-head">
        <text class="hm-sec-title">{{ section.title }}</text>
      </view>
      <view class="card ds">
        <image class="ds__img" :src="section.img" mode="aspectFill" />
        <view class="ds__body">
          <view v-for="(p, j) in section.points" :key="j" class="ds__point">
            <text class="ds__idx" :style="{ color: pkg.accent, background: pkg.accentSoft }">{{ j + 1 }}</text>
            <text class="ds__p">{{ p }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="wrap">
      <view class="sec-head">
        <text class="hm-sec-title">常见问题</text>
        <text class="hm-sec-sub">点击查看解答</text>
      </view>
      <view class="card faq">
        <view v-for="(f, i) in pkg.faq" :key="i" class="faq__item">
          <view class="faq__q" @tap="toggleFaq(i)">
            <text class="faq__q-t">{{ f.q }}</text>
            <text class="faq__arrow" :class="{ 'faq__arrow--on': openFaq === i }">⌄</text>
          </view>
          <view v-if="openFaq === i" class="faq__a">
            <text class="faq__a-t">{{ f.a }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="foot-tip">
      <text class="foot-tip__t">本服务为健康管理与生活方式干预，不替代医疗诊断与处方。方案不含药品，用药调整请遵医嘱。</text>
      <text class="foot-tip__t">虚拟服务一经开通不支持退款，开通前请确认服务内容。</text>
    </view>

    <view class="bar-holder"></view>

    <view class="buybar">
      <view class="buybar__price">
        <view class="buybar__row">
          <text class="buybar__cur">¥</text>
          <text class="buybar__now">{{ pkg.price }}</text>
          <text class="buybar__origin">¥{{ pkg.originPrice }}</text>
        </view>
        <text class="buybar__save">限时省 {{ saved }} 元</text>
      </view>
      <view class="buybar__btn" :style="{ background: pkg.accent }" @tap="buy">
        <text class="buybar__btn-t">立即购买</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      pkgId: '',
      scrollTop: 0,
      openFaq: -1
    }
  },
  computed: {
    pkg() {
      return this.$store.getters.packages.find((p) => p.id === this.pkgId) || null
    },
    navSolid() {
      return this.scrollTop > 120
    },
    saved() {
      const p = this.pkg
      return p ? p.originPrice - p.price : 0
    }
  },
  onLoad(options) {
    this.pkgId = (options && options.id) || ''
    if (!this.pkg) {
      uni.showToast({ title: '服务包不存在', icon: 'none' })
    }
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop
  },
  methods: {
    toggleFaq(i) {
      this.openFaq = this.openFaq === i ? -1 : i
    },
    buy() {
      this.$store.dispatch('createOrder', this.pkg.id).then((order) => {
        if (!order) {
          uni.showToast({ title: '下单失败，请重试', icon: 'none' })
          return
        }
        uni.navigateTo({ url: '/pages/pay/pay?orderNo=' + order.orderNo })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: $z-nav;
}

.hero {
  position: relative;
  background: $bg-subtle;
}

.hero__img {
  width: 100%;
  height: $size-hero-image-height;
  display: block;
}

.hero__mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: $size-stat-card-height;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.38) 0%, rgba(0, 0, 0, 0) 100%);
}

.wrap {
  padding: $space-4 $space-4 0;
}

.card {
  background: $bg-surface;
  border-radius: $radius-card-child;
  box-shadow: $shadow-md;
}

.intro {
  padding: $space-3;
  margin-top: $space-data-list-gap;
}

.intro__tagline {
  display: inline-block;
  border-radius: $radius-full;
  padding: $space-1 $space-2;
}

.intro__tagline-t {
  font-size: $font-size-2xs;
  font-weight: $font-weight-semibold;
}

.intro__head {
  display: flex;
  align-items: center;
  margin-top: $space-2;
}

.intro__name {
  flex: 1;
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $text-primary;
  letter-spacing: 1rpx;
}

.intro__dur {
  font-size: $font-size-2xs;
  font-weight: $font-weight-semibold;
  padding: $space-1 $space-2;
  border-radius: $radius-full;
  margin-left: $space-2;
}

.intro__sub {
  display: block;
  font-size: $font-size-xs;
  color: $text-muted;
  margin-top: $space-2;
  line-height: $line-height-relaxed;
}

.intro__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: $space-2;
}

.intro__meta-t {
  font-size: $font-size-2xs;
  color: $text-disabled;
}

.intro__star {
  color: $warning;
  margin-right: $space-1;
}

.intro__meta-dot {
  font-size: $font-size-2xs;
  color: $text-hint;
  margin: 0 $space-1;
}

.intro__price {
  display: flex;
  align-items: baseline;
  margin-top: $space-3;
  padding-top: $space-3;
  border-top: 1rpx solid $border-subtle;
}

.intro__cur {
  font-size: $font-size-sm;
  color: $badge;
  font-weight: $font-weight-bold;
}

.intro__now {
  font-size: $font-size-2xl;
  line-height: $font-size-2xl;
  color: $badge;
  font-weight: $font-weight-bold;
  margin-left: 0;
}

.intro__origin {
  font-size: $font-size-xs;
  color: $text-disabled;
  text-decoration: line-through;
  margin-left: $space-2;
}

.intro__save {
  font-size: $font-size-2xs;
  color: $badge;
  background: $warm-soft;
  padding: $space-1 $space-2;
  border-radius: $radius-full;
  margin-left: $space-2;
}

.intro__tags {
  display: flex;
  flex-wrap: wrap;
  margin-top: $space-3;
}

.intro__tag {
  font-size: $font-size-2xs;
  color: $text-secondary;
  background: $bg-subtle;
  padding: $space-1 $space-2;
  border-radius: $radius-full;
  margin: 0 $space-2 $space-2 0;
}

.sec-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: $space-3;
}

.hl {
  display: flex;
  align-items: flex-start;
  padding: $space-3;
  margin-bottom: $space-2;
}

.hl__icon {
  width: $size-avatar-sm;
  height: $size-avatar-sm;
  border-radius: $radius-card-child;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.hl__icon-t {
  font-size: $size-icon-sm;
  color: $icon-ink;
}

.hl__main {
  flex: 1;
  padding-left: $space-2;
}

.hl__t {
  display: block;
  font-size: $font-size-sm;
  font-weight: $font-weight-bold;
  color: $text-primary;
}

.hl__d {
  display: block;
  font-size: $font-size-2xs;
  color: $text-muted;
  margin-top: $space-1;
  line-height: $line-height-relaxed;
}

.srv {
  padding: $space-1 $space-3;
}

.srv__row {
  display: flex;
  align-items: center;
  padding: $space-3 0;
  border-bottom: 1rpx solid $border-subtle;
}

.srv__row:last-child {
  border-bottom: none;
}

.srv__row--head {
  border-bottom: 1rpx solid $border-subtle;
}

.srv__c1 {
  flex: 1;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.srv__c2 {
  width: $size-stat-card-height;
  text-align: right;
}

.srv__th {
  font-size: $font-size-2xs;
  color: $text-disabled;
  font-weight: $font-weight-semibold;
}

.srv__dot {
  width: $size-badge-sm;
  height: $size-badge-sm;
  border-radius: $radius-full;
  margin-right: $space-2;
  flex-shrink: 0;
}

.srv__name {
  font-size: $font-size-sm;
  color: $text-primary;
}

.srv__spec {
  width: $size-stat-card-height;
  text-align: right;
  font-size: $font-size-xs;
  color: $text-muted;
}

.ds {
  overflow: hidden;
}

.ds__img {
  width: 100%;
  height: $size-detail-image-height;
  display: block;
  border-radius: $radius-card-child $radius-card-child 0 0;
}

.ds__body {
  padding: $space-3 $space-3 $space-1;
}

.ds__point {
  display: flex;
  align-items: flex-start;
  padding-bottom: $space-2;
}

.ds__idx {
  width: $size-badge-md;
  height: $size-badge-md;
  border-radius: $radius-full;
  font-size: $font-size-2xs;
  font-weight: $font-weight-bold;
  text-align: center;
  line-height: $size-badge-md;
  margin-right: $space-2;
  flex-shrink: 0;
}

.ds__p {
  flex: 1;
  font-size: $font-size-xs;
  color: $text-secondary;
  line-height: $line-height-relaxed;
}

.faq {
  padding: $space-1 $space-3;
}

.faq__item {
  border-bottom: 1rpx solid $border-subtle;
}

.faq__item:last-child {
  border-bottom: none;
}

.faq__q {
  display: flex;
  align-items: center;
  padding: $space-3 0;
}

.faq__q-t {
  flex: 1;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.faq__arrow {
  font-size: $font-size-md;
  color: $text-disabled;
  margin-left: $space-2;
  transition: transform 0.2s;
}

.faq__arrow--on {
  transform: rotate(180deg);
  color: $brand-primary-active;
}

.faq__a {
  padding: 0 0 $space-3;
}

.faq__a-t {
  font-size: $font-size-xs;
  color: $text-muted;
  line-height: $line-height-relaxed;
}

.foot-tip {
  padding: $space-5 $space-5 $space-2;
  text-align: center;
}

.foot-tip__t {
  display: block;
  font-size: $font-size-2xs;
  color: $text-disabled;
  line-height: $line-height-relaxed;
  margin-bottom: $space-1;
}

.bar-holder {
  height: calc(env(safe-area-inset-bottom) + #{$size-bottom-nav-height});
}

.buybar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: $z-nav;
  background: $bg-surface;
  box-shadow: $shadow-lg;
  padding: $space-2 $space-3;
  padding-bottom: calc(env(safe-area-inset-bottom) + #{$space-2});
  display: flex;
  align-items: center;
}

.buybar__price {
  flex: 1;
  overflow: hidden;
}

.buybar__row {
  display: flex;
  align-items: baseline;
}

.buybar__cur {
  font-size: $font-size-xs;
  color: $badge;
  font-weight: $font-weight-bold;
}

.buybar__now {
  font-size: $font-size-2xl;
  line-height: $font-size-2xl;
  color: $badge;
  font-weight: $font-weight-bold;
  margin-left: 0;
}

.buybar__origin {
  font-size: $font-size-2xs;
  color: $text-disabled;
  text-decoration: line-through;
  margin-left: $space-2;
}

.buybar__save {
  display: inline-block;
  font-size: $font-size-2xs;
  color: $badge;
  background: $warm-soft;
  padding: $space-1 $space-2;
  border-radius: $radius-full;
  margin-top: $space-1;
}

.buybar__btn {
  min-width: $size-page-max-width * 0.32;
  height: $size-input-height;
  border-radius: $radius-full;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: $shadow-sm;
}

.buybar__btn-t {
  color: $text-inverse;
  font-size: $font-size-md;
  font-weight: $font-weight-bold;
  letter-spacing: 2rpx;
}
</style>
