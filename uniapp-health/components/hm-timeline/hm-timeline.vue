<template>
  <view class="tl">
    <view v-for="(item, idx) in items" :key="idx" class="tl__row">
      <view class="tl__rail">
        <view class="tl__dot" :style="{ background: meta(item.cat).color }">
          <text class="tl__dot-icon" :class="item.icon"></text>
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
      return CAT_META[cat] || { label: '指导', color: '#389a82', bg: '#d4f5ee' }
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
  width: $size-avatar-sm;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.tl__dot {
  width: $size-product-user-avatar;
  height: $size-product-user-avatar;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: $space-1;
  box-shadow: $shadow-sm;
}

.tl__dot-icon {
  font-size: $font-size-sm;
  line-height: $font-size-sm;
}

.tl__line {
  flex: 1;
  width: 1rpx;
  background: $bg-section;
  margin: $space-1 0;
}

.tl__card {
  flex: 1;
  background: $bg-surface;
  border-radius: $radius-card-child;
  padding: $space-3;
  margin: 0 0 $space-data-list-gap $space-1;
  box-shadow: $shadow-sm;
}

.tl__card--locked {
  background: $bg-subtle;
}

.tl__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $space-1;
}

.tl__time {
  font-size: $font-size-sm;
  font-weight: $font-weight-bold;
  color: $text-secondary;
  letter-spacing: 1rpx;
}

.tl__tag {
  font-size: $font-size-2xs;
  padding: $space-1 $space-2;
  border-radius: $radius-full;
}

.tl__title {
  display: block;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $text-primary;
  margin-bottom: $space-1;
}

.tl__desc {
  display: block;
  font-size: $font-size-xs;
  color: $text-muted;
  line-height: $line-height-relaxed;
}
</style>
