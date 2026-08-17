<template>
  <view class="tl">
    <view v-for="(item, idx) in items" :key="idx" class="tl__row">
      <view class="tl__rail">
        <view class="tl__dot" :style="{ background: meta(item.cat).color }">
          <text class="tl__dot-icon">{{ item.icon }}</text>
        </view>
        <view v-if="idx < items.length - 1" class="tl__line"></view>
      </view>

      <view class="tl__card" :class="{ 'tl__card--locked': locked && idx >= freeCount }">
        <view class="tl__head">
          <text class="tl__time">{{ item.time }}</text>
          <text class="tl__tag" :style="{ color: meta(item.cat).color, background: meta(item.cat).bg }">
            {{ meta(item.cat).label }}
          </text>
        </view>
        <text class="tl__title">{{ item.title }}</text>
        <text class="tl__desc">{{ locked && idx >= freeCount ? '开通服务后查看完整方案内容' : item.desc }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { CAT_META } from '@/common/mock.js'

export default {
  name: 'hm-timeline',
  props: {
    items: { type: Array, default: () => [] },
    locked: { type: Boolean, default: false },
    freeCount: { type: Number, default: 3 }
  },
  methods: {
    meta(cat) {
      return CAT_META[cat] || { label: '指导', color: '#1a7d82', bg: '#e0f4f5' }
    }
  }
}
</script>

<style lang="scss" scoped>
.tl__row {
  display: flex;
  align-items: stretch;
}

.tl__rail {
  width: 76rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.tl__dot {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8rpx;
  box-shadow: 0 4rpx 14rpx rgba(20, 10, 10, 0.14);
}

.tl__dot-icon {
  font-size: 26rpx;
  line-height: 26rpx;
}

.tl__line {
  flex: 1;
  width: 2rpx;
  background: $warm-200;
  margin: 8rpx 0;
}

.tl__card {
  flex: 1;
  background: #fff;
  border-radius: $radius-sm;
  padding: 22rpx 24rpx;
  margin: 0 0 20rpx 8rpx;
  box-shadow: $shadow-sm;
}

.tl__card--locked {
  background: $warm-100;
}

.tl__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.tl__time {
  font-size: 26rpx;
  font-weight: 700;
  color: $ink-700;
  letter-spacing: 1rpx;
}

.tl__tag {
  font-size: 20rpx;
  padding: 4rpx 14rpx;
  border-radius: 999rpx;
}

.tl__title {
  display: block;
  font-size: 29rpx;
  font-weight: 600;
  color: $ink-900;
  margin-bottom: 6rpx;
}

.tl__desc {
  display: block;
  font-size: 24rpx;
  color: $ink-500;
  line-height: 1.6;
}
</style>
