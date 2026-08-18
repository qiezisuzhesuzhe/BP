<template>
  <view class="hm-page">
    <hm-navbar title="健康商城" :show-back="false" bg-color="transparent" :sticky="true"></hm-navbar>

    <!-- 搜索栏 -->
    <view class="wrap">
      <view class="search">
        <text class="fa-solid fa-magnifying-glass search__icon"></text>
        <text class="search__ph">搜索血压计、血糖仪、健康好物…</text>
      </view>
    </view>

    <!-- 金刚区 -->
    <view class="wrap">
      <view class="quicks">
        <view v-for="q in quicks" :key="q.key" class="quick" @tap="toast(q)">
          <view class="quick__icon" :style="{ background: q.bg }">
            <text class="quick__icon-t" :class="q.icon" :style="{ color: q.color }"></text>
          </view>
          <text class="quick__t">{{ q.label }}</text>
        </view>
      </view>
    </view>

    <!-- 商品区 -->
    <view class="wrap">
      <view class="sec-head">
        <text class="hm-sec-title">精选好物</text>
        <text class="hm-sec-sub">共 {{ goods.length }} 件 · 支持积分换购</text>
      </view>

      <view class="goods">
        <view v-for="g in goods" :key="g.id" class="good" @tap="redeem(g)">
          <view class="good__pic">
            <image class="good__pic-img" :src="g.img" mode="aspectFill" @error="onImgErr(g)"></image>
            <text v-if="g.tag" class="good__pic-tag">{{ g.tag }}</text>
          </view>
          <view class="good__body">
            <text class="good__name">{{ g.name }}</text>
            <text class="good__desc">{{ g.desc }}</text>
            <view class="good__foot">
              <view class="good__price">
                <text class="good__cur">¥</text>
                <text class="good__now">{{ g.price }}</text>
              </view>
              <view class="good__pts">
                <text class="fa-solid fa-coins good__pts-icon"></text>
                <text class="good__pts-t">{{ g.points }}</text>
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
import { SHOP_GOODS } from '@/common/mock.js'

const FALLBACK_IMG = '/static/img/placeholder.png'

export default {
  data() {
    return {
      goods: SHOP_GOODS,
      quicks: [
        { key: 'pts', label: '积分换购', icon: 'fa-solid fa-coins', color: '#b8932e', bg: '#faf3e0' },
        { key: 'coupon', label: '领券中心', icon: 'fa-solid fa-ticket', color: '#f15533', bg: '#fdf4ed' },
        { key: 'flash', label: '限时秒杀', icon: 'fa-solid fa-bolt', color: '#eb5757', bg: '#fdf4ed' },
        { key: 'qa', label: '健康问答', icon: 'fa-solid fa-comments', color: '#389a82', bg: '#d4f5ee' }
      ]
    }
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
    // 商品图加载失败时兜底为本地占位图
    onImgErr(g) {
      if (g.img !== FALLBACK_IMG) this.$set(g, 'img', FALLBACK_IMG)
    },
    redeem(g) {
      uni.showToast({ title: '「' + g.name + '」积分兑换（演示）', icon: 'none' })
    },
    toast(q) {
      uni.showToast({ title: q.label + '（演示）', icon: 'none' })
    }
  }
}
</script>

<style lang="scss" scoped>
/* 搜索栏 */
.search {
  display: flex;
  align-items: center;
  height: $size-input-height;
  background: $bg-surface;
  border-radius: $radius-full;
  box-shadow: $shadow-sm;
  padding: 0 $space-4;
}

.search__icon {
  font-size: $font-size-sm;
  color: $text-disabled;
  margin-right: $space-2;
}

.search__ph {
  font-size: $font-size-xs;
  color: $text-disabled;
}

/* 金刚区 */
.quicks {
  display: flex;
  margin-top: $space-3;
  background: $bg-surface;
  border-radius: $radius-card;
  box-shadow: $shadow-sm;
  padding: $space-4 0;
}

.quick {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.quick__icon {
  width: $size-icon-lg;
  height: $size-icon-lg;
  border-radius: $radius-full;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quick__icon-t {
  font-size: $font-size-md;
}

.quick__t {
  font-size: $font-size-min;
  color: $text-secondary;
  margin-top: $space-2;
}

/* 商品两列瀑布流：垂直间距按设计令牌 $space-data-list-gap */
.goods {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.good {
  width: 49%;
  background: $bg-surface;
  border-radius: $radius-card-child;
  box-shadow: $shadow-sm;
  overflow: hidden;
  margin-bottom: $space-data-list-gap;
}

.good__pic {
  position: relative;
  height: 220rpx;
  overflow: hidden;
  background: $bg-subtle;
}

.good__pic-img {
  width: 100%;
  height: 100%;
  display: block;
}

.good__pic-tag {
  position: absolute;
  top: $space-2;
  left: 0;
  background: $badge;
  color: $text-inverse;
  font-size: $font-size-2xs;
  line-height: $line-height-tight;
  padding: 4rpx $space-2;
  border-radius: 0 $radius-full $radius-full 0;
  box-shadow: $shadow-sm;
}

.good__body {
  padding: $space-2 $space-3 $space-3;
}

.good__name {
  display: block;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  line-height: $line-height-tight;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.good__desc {
  display: block;
  font-size: $font-size-min;
  color: $text-muted;
  margin-top: $space-1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.good__foot {
  margin-top: $space-2;
  display: flex;
  align-items: baseline;
}

.good__price {
  display: flex;
  align-items: baseline;
}

.good__cur {
  font-size: $font-size-2xs;
  color: $badge;
  font-weight: $font-weight-bold;
}

.good__now {
  font-size: $font-size-lg;
  color: $badge;
  font-weight: $font-weight-heavy;
  line-height: $line-height-tight;
  font-family: $font-family-en;
  margin-left: 2rpx;
}

.good__pts {
  display: flex;
  align-items: center;
  margin-left: auto;
  background: $warm-soft;
  border-radius: $radius-full;
  padding: $space-1 $space-2;
  flex-shrink: 0;
}

.good__pts-icon {
  font-size: $font-size-2xs;
  color: $gold;
  margin-right: $space-1;
}

.good__pts-t {
  font-size: $font-size-min;
  color: $text-secondary;
  font-family: $font-family-en;
}
</style>
