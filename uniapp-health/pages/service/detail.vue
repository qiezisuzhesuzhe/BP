<template>
  <view class="hm-page" v-if="pkg">
    <view class="nav-fixed">
      <hm-navbar
        :title="navSolid ? pkg.name : ''"
        :bg-color="navSolid ? '#ffffff' : 'transparent'"
        :text-color="navSolid ? '#1a2b2c' : '#ffffff'"
      />
    </view>

    <view class="hero">
      <image class="hero__img" :src="pkg.heroImg" mode="widthFix" />
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
          <text class="intro__meta-t">⭐ {{ pkg.rating }} 分</text>
          <text class="intro__meta-dot">·</text>
          <text class="intro__meta-t">已服务 {{ pkg.sold }} 人</text>
          <text class="intro__meta-dot">·</text>
          <text class="intro__meta-t">{{ pkg.icon }} 医师团队审核</text>
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
          <text class="hl__icon-t">{{ h.icon }}</text>
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
        <image class="ds__img" :src="section.img" mode="widthFix" />
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
  z-index: 95;
}

.hero {
  position: relative;
  background: $warm-100;
}

.hero__img {
  width: 100%;
  display: block;
}

.hero__mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 220rpx;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.38) 0%, rgba(0, 0, 0, 0) 100%);
}

.wrap {
  padding: 32rpx 28rpx 0;
}

.card {
  background: #fff;
  border-radius: $radius-md;
  box-shadow: $shadow-md;
}

.intro {
  padding: 28rpx;
  margin-top: -60rpx;
}

.intro__tagline {
  display: inline-block;
  border-radius: 999rpx;
  padding: 6rpx 16rpx;
}

.intro__tagline-t {
  font-size: 20rpx;
  font-weight: 600;
}

.intro__head {
  display: flex;
  align-items: center;
  margin-top: 16rpx;
}

.intro__name {
  flex: 1;
  font-size: 42rpx;
  font-weight: 700;
  color: $ink-900;
  letter-spacing: 1rpx;
}

.intro__dur {
  font-size: 22rpx;
  font-weight: 600;
  padding: 6rpx 16rpx;
  border-radius: 999rpx;
  margin-left: 16rpx;
}

.intro__sub {
  display: block;
  font-size: 25rpx;
  color: $ink-500;
  margin-top: 12rpx;
  line-height: 1.7;
}

.intro__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 18rpx;
}

.intro__meta-t {
  font-size: 21rpx;
  color: $ink-400;
}

.intro__meta-dot {
  font-size: 21rpx;
  color: $ink-300;
  margin: 0 10rpx;
}

.intro__price {
  display: flex;
  align-items: baseline;
  margin-top: 22rpx;
  padding-top: 22rpx;
  border-top: 1rpx solid $warm-100;
}

.intro__cur {
  font-size: 26rpx;
  color: $coral-500;
  font-weight: 700;
}

.intro__now {
  font-size: 60rpx;
  line-height: 60rpx;
  color: $coral-500;
  font-weight: 700;
  margin-left: 2rpx;
}

.intro__origin {
  font-size: 24rpx;
  color: $ink-400;
  text-decoration: line-through;
  margin-left: 14rpx;
}

.intro__save {
  font-size: 20rpx;
  color: $coral-500;
  background: $coral-100;
  padding: 5rpx 14rpx;
  border-radius: 999rpx;
  margin-left: 14rpx;
}

.intro__tags {
  display: flex;
  flex-wrap: wrap;
  margin-top: 22rpx;
}

.intro__tag {
  font-size: 21rpx;
  color: $ink-700;
  background: $warm-100;
  padding: 8rpx 18rpx;
  border-radius: 999rpx;
  margin: 0 12rpx 12rpx 0;
}

.sec-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 22rpx;
}

.hl {
  display: flex;
  align-items: flex-start;
  padding: 26rpx 24rpx;
  margin-bottom: 20rpx;
}

.hl__icon {
  width: 76rpx;
  height: 76rpx;
  border-radius: $radius-sm;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.hl__icon-t {
  font-size: 38rpx;
}

.hl__main {
  flex: 1;
  padding-left: 20rpx;
}

.hl__t {
  display: block;
  font-size: 28rpx;
  font-weight: 700;
  color: $ink-900;
}

.hl__d {
  display: block;
  font-size: 22rpx;
  color: $ink-500;
  margin-top: 8rpx;
  line-height: 1.7;
}

.srv {
  padding: 4rpx 24rpx;
}

.srv__row {
  display: flex;
  align-items: center;
  padding: 22rpx 0;
  border-bottom: 1rpx solid $warm-100;
}

.srv__row:last-child {
  border-bottom: none;
}

.srv__row--head {
  border-bottom: 1rpx solid $warm-200;
}

.srv__c1 {
  flex: 1;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.srv__c2 {
  width: 200rpx;
  text-align: right;
}

.srv__th {
  font-size: 22rpx;
  color: $ink-400;
  font-weight: 600;
}

.srv__dot {
  width: 10rpx;
  height: 10rpx;
  border-radius: 999rpx;
  margin-right: 14rpx;
  flex-shrink: 0;
}

.srv__name {
  font-size: 26rpx;
  color: $ink-900;
}

.srv__spec {
  width: 200rpx;
  text-align: right;
  font-size: 23rpx;
  color: $ink-500;
}

.ds {
  overflow: hidden;
}

.ds__img {
  width: 100%;
  display: block;
}

.ds__body {
  padding: 24rpx 26rpx 8rpx;
}

.ds__point {
  display: flex;
  align-items: flex-start;
  padding-bottom: 20rpx;
}

.ds__idx {
  width: 34rpx;
  height: 34rpx;
  border-radius: 999rpx;
  font-size: 20rpx;
  font-weight: 700;
  text-align: center;
  line-height: 34rpx;
  margin-right: 16rpx;
  flex-shrink: 0;
}

.ds__p {
  flex: 1;
  font-size: 24rpx;
  color: $ink-700;
  line-height: 1.7;
}

.faq {
  padding: 4rpx 24rpx;
}

.faq__item {
  border-bottom: 1rpx solid $warm-100;
}

.faq__item:last-child {
  border-bottom: none;
}

.faq__q {
  display: flex;
  align-items: center;
  padding: 26rpx 0;
}

.faq__q-t {
  flex: 1;
  font-size: 26rpx;
  font-weight: 600;
  color: $ink-900;
}

.faq__arrow {
  font-size: 30rpx;
  color: $ink-400;
  margin-left: 16rpx;
  transition: transform 0.2s;
}

.faq__arrow--on {
  transform: rotate(180deg);
  color: $teal-700;
}

.faq__a {
  padding: 0 0 26rpx;
}

.faq__a-t {
  font-size: 23rpx;
  color: $ink-500;
  line-height: 1.8;
}

.foot-tip {
  padding: 40rpx 44rpx 20rpx;
  text-align: center;
}

.foot-tip__t {
  display: block;
  font-size: 20rpx;
  color: $ink-400;
  line-height: 1.7;
  margin-bottom: 8rpx;
}

.bar-holder {
  height: calc(150rpx + env(safe-area-inset-bottom));
}

.buybar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 96;
  background: #fff;
  box-shadow: 0 -8rpx 32rpx rgba(20, 10, 10, 0.08);
  padding: 18rpx 28rpx;
  padding-bottom: calc(18rpx + env(safe-area-inset-bottom));
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
  font-size: 24rpx;
  color: $coral-500;
  font-weight: 700;
}

.buybar__now {
  font-size: 54rpx;
  line-height: 54rpx;
  color: $coral-500;
  font-weight: 700;
  margin-left: 2rpx;
}

.buybar__origin {
  font-size: 22rpx;
  color: $ink-400;
  text-decoration: line-through;
  margin-left: 12rpx;
}

.buybar__save {
  display: inline-block;
  font-size: 19rpx;
  color: $coral-500;
  background: $coral-100;
  padding: 4rpx 12rpx;
  border-radius: 999rpx;
  margin-top: 6rpx;
}

.buybar__btn {
  min-width: 300rpx;
  height: 92rpx;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: $shadow-sm;
}

.buybar__btn-t {
  color: #fff;
  font-size: 32rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
}
</style>
