<template>
  <view class="hm-page">
    <hm-navbar title="健康商城" :show-back="false" bg-color="transparent" :sticky="true"></hm-navbar>

    <view class="wrap">
      <!-- 积分换购横幅 -->
      <view class="banner">
        <view class="banner__glow"></view>
        <view class="banner__head">
          <view class="banner__l">
            <text class="banner__t">健康好物 · 积分换购</text>
            <text class="banner__d">现金价或积分均可兑换，积分随服务续期累积</text>
          </view>
          <view class="banner__pts">
            <text class="fa-solid fa-coins banner__coins"></text>
            <text class="banner__pts-v">{{ myPoints }}</text>
          </view>
        </view>
      </view>

      <!-- 商品列表 -->
      <view class="sec-head">
        <text class="hm-sec-title">精选好物</text>
        <text class="hm-sec-sub">共 {{ goods.length }} 件</text>
      </view>

      <view v-for="g in goods" :key="g.id" class="good" @tap="redeem(g)">
        <view class="good__icon" :style="{ background: g.bg }">
          <text class="good__icon-t" :class="g.icon" :style="{ color: g.color }"></text>
          <text v-if="g.tag" class="good__tag">{{ g.tag }}</text>
        </view>
        <view class="good__main">
          <text class="good__name">{{ g.name }}</text>
          <text class="good__desc">{{ g.desc }}</text>
          <view class="good__foot">
            <view class="good__price">
              <text class="good__cur">¥</text>
              <text class="good__now">{{ g.price }}</text>
              <view class="good__pts">
                <text class="fa-solid fa-coins good__pts-icon"></text>
                <text class="good__pts-t">{{ g.points }} 积分</text>
              </view>
            </view>
            <view class="good__act">
              <text class="good__act-t">兑换</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="hm-safe-bottom"></view>
  </view>
</template>

<script>
import { SHOP_GOODS } from '@/common/mock.js'

export default {
  data() {
    return { goods: SHOP_GOODS }
  },
  computed: {
    activeRight() {
      return this.$store.getters.activeRight
    },
    myPoints() {
      return this.activeRight ? this.activeRight.points : 500
    }
  },
  methods: {
    redeem(g) {
      uni.showToast({ title: '「' + g.name + '」积分兑换（演示）', icon: 'none' })
    }
  }
}
</script>

<style lang="scss" scoped>
.banner {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0e4a41 0%, #1a7d82 100%);
  border-radius: $radius-card;
  box-shadow: $shadow-lg;
  padding: $space-4 $space-4 $space-5;
}

/* 右上角光晕 + 底部高光，营造品质感 */
.banner::after {
  content: '';
  position: absolute;
  top: -120rpx;
  right: -80rpx;
  width: 320rpx;
  height: 320rpx;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(125, 212, 188, 0.35) 0%, rgba(125, 212, 188, 0) 70%);
}

.banner__head {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.banner__l {
  flex: 1;
  padding-right: $space-3;
}

.banner__t {
  display: block;
  font-size: $font-size-lg;
  font-weight: $font-weight-heavy;
  color: $text-inverse;
  line-height: $line-height-tight;
  letter-spacing: 2rpx;
}

.banner__d {
  display: block;
  font-size: $font-size-xs;
  color: rgba(255, 255, 255, 0.72);
  line-height: $line-height-normal;
  margin-top: $space-2;
}

.banner__pts {
  display: flex;
  align-items: baseline;
  flex-shrink: 0;
}

.banner__coins {
  font-size: $font-size-sm;
  color: $warning;
  margin-right: $space-1;
}

.banner__pts-v {
  font-size: $font-size-2xl;
  font-weight: $font-weight-heavy;
  color: $text-inverse;
  line-height: $line-height-tight;
  font-family: $font-family-en;
}

.good {
  display: flex;
  align-items: center;
  background: $bg-surface;
  border-radius: $radius-card-child;
  box-shadow: $shadow-sm;
  padding: $space-3;
  margin-bottom: $space-data-list-gap;
}

.good__icon {
  position: relative;
  width: $size-icon-xl;
  height: $size-icon-xl;
  border-radius: $radius-card-child;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: $shadow-sm;
}

.good__icon-t {
  font-size: $font-size-xl;
}

.good__tag {
  position: absolute;
  top: -8rpx;
  right: -8rpx;
  background: $badge;
  color: $text-inverse;
  font-size: $font-size-2xs;
  line-height: $line-height-tight;
  padding: 4rpx $space-1;
  border-radius: $radius-full;
  box-shadow: $shadow-sm;
}

.good__main {
  flex: 1;
  margin-left: $space-3;
  overflow: hidden;
}

.good__name {
  display: block;
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  line-height: $line-height-tight;
}

.good__desc {
  display: block;
  font-size: $font-size-min;
  color: $text-muted;
  margin-top: $space-1;
  line-height: $line-height-normal;
}

.good__foot {
  margin-top: $space-2;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.good__price {
  display: flex;
  align-items: baseline;
  flex: 1;
  overflow: hidden;
}

.good__cur {
  font-size: $font-size-xs;
  color: $badge;
  font-weight: $font-weight-bold;
}

.good__now {
  font-size: $font-size-xl;
  color: $badge;
  font-weight: $font-weight-heavy;
  line-height: $line-height-tight;
  font-family: $font-family-en;
  margin-left: 2rpx;
}

.good__pts {
  display: flex;
  align-items: center;
  background: $warm-soft;
  border-radius: $radius-full;
  padding: $space-1 $space-2;
  margin-left: $space-2;
  flex-shrink: 0;
}

.good__pts-icon {
  font-size: $font-size-2xs;
  color: $warning;
  margin-right: $space-1;
}

.good__pts-t {
  font-size: $font-size-min;
  color: $text-secondary;
  font-family: $font-family-en;
}

.good__act {
  flex-shrink: 0;
  background: $brand-primary-active;
  border-radius: $radius-full;
  padding: $space-1 $space-3;
  margin-left: $space-2;
  box-shadow: $shadow-sm;
}

.good__act-t {
  color: $text-inverse;
  font-size: $font-size-xs;
  font-weight: $font-weight-bold;
  line-height: $line-height-tight;
}
</style>
