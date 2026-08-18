<template>
  <view class="tl">
    <view v-for="(item, idx) in items" :key="idx" class="tl__row">
      <view class="tl__rail">
        <view class="tl__dot" :style="{ background: meta(item.cat).color }">
          <text class="tl__dot-icon" :class="item.icon" :style="{ color: iconColor(item.cat) }"></text>
        </view>
        <view v-if="idx < items.length - 1" class="tl__line"></view>
      </view>

      <view class="tl__card">
        <view class="tl__head">
          <text class="tl__time">{{ item.time }}</text>
          <text class="tl__tag" :style="{ color: meta(item.cat).color, background: meta(item.cat).bg }">
            {{ meta(item.cat).label }}
          </text>
        </view>
        <text class="tl__title">{{ item.title }}</text>
        <text class="tl__desc">{{ item.desc }}</text>

        <!-- 运动：视频封面缩略图 -->
        <view v-if="item.cat === 'exercise'" class="tl__cover" @tap="playVideo(item.title)">
          <image class="tl__cover-img" :src="item._coverFail ? FALLBACK_IMG : exerciseCover(item.title)" mode="aspectFill" @error="onCoverErr(item)"></image>
          <view class="tl__cover-mask"></view>
          <view class="tl__cover-play">
            <text class="fa-solid fa-play tl__cover-play-icon"></text>
          </view>
          <text class="tl__cover-dur">02:30</text>
          <text class="tl__cover-label">跟练视频</text>
        </view>

        <!-- 餐：拍照打卡 -->
        <view
          v-if="item.cat === 'nutrition'"
          class="tl__action"
          :class="{ 'tl__action--done': checked[idx] }"
          @tap="toggleCheck(idx)"
        >
          <text class="tl__action-icon" :class="checked[idx] ? 'fa-solid fa-circle-check' : 'fa-solid fa-camera'"></text>
          <text class="tl__action-t">{{ checked[idx] ? '已拍照打卡' : '拍照打卡' }}</text>
        </view>

        <!-- 评估：立即评估 -->
        <view v-if="item.cat === 'assessment'" class="tl__action tl__action--primary" @tap="goAssess">
          <text class="tl__action-icon fa-solid fa-clipboard-list"></text>
          <text class="tl__action-t">立即评估</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { CAT_META } from '@/common/mock.js'

const COVER_TAICHI =
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=' +
  encodeURIComponent('video cover of an elderly person practicing tai chi in a green park at morning, warm sunlight, health lifestyle, clean composition') +
  '&image_size=landscape_16_9'
const COVER_WALK =
  'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=' +
  encodeURIComponent('video cover of a middle-aged man brisk walking on a tree-lined path, golden hour, health lifestyle, clean composition') +
  '&image_size=landscape_16_9'

const FALLBACK_IMG = '/static/img/placeholder.png'

export default {
  name: 'hm-timeline',
  props: {
    items: { type: Array, default: () => [] }
  },
  data() {
    return {
      checked: {}
    }
  },
  methods: {
    meta(cat) {
      return CAT_META[cat] || { label: '指导', color: '#389a82', bg: '#d4f5ee' }
    },
    // 视频封面加载失败时兜底为本地占位图
    onCoverErr(item) {
      this.$set(item, '_coverFail', true)
    },
    // 面性图标对比度规则：深色底用浅色图标(#fff)，浅色底用 $icon-ink(透明黑 alpha=0.1)
    iconColor(cat) {
      const hex = (this.meta(cat).color || '').replace('#', '')
      if (!/^[0-9a-f]{6}$/i.test(hex)) return '#ffffff'
      const n = parseInt(hex, 16)
      const lum = (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255
      return lum > 0.55 ? 'rgba(0, 0, 0, 0.1)' : '#ffffff'
    },
    exerciseCover(title) {
      const t = title || ''
      if (/太极|八段锦|瑜伽|冥想|拉伸|呼吸|正念/.test(t)) return COVER_TAICHI
      if (/走|跑|泳|游|行|骑/.test(t)) return COVER_WALK
      return COVER_WALK
    },
    toggleCheck(idx) {
      this.$set(this.checked, idx, !this.checked[idx])
      uni.showToast({
        title: this.checked[idx] ? '打卡成功' : '已取消打卡',
        icon: 'none'
      })
    },
    goAssess() {
      uni.navigateTo({ url: '/pages/chat/chat' })
    },
    playVideo(title) {
      uni.showToast({
        title: '「' + (title || '跟练视频') + '」演示',
        icon: 'none'
      })
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

/* ---------- 运动：视频封面 ---------- */
.tl__cover {
  position: relative;
  margin-top: $space-2;
  border-radius: $radius-sm;
  overflow: hidden;
}

.tl__cover-img {
  width: 100%;
  height: $size-detail-image-height;
  display: block;
}

.tl__cover-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, rgba(15, 61, 53, 0.05) 55%, rgba(15, 61, 53, 0.42));
}

.tl__cover-play {
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

.tl__cover-play-icon {
  color: $brand-primary-active;
  font-size: $font-size-sm;
  margin-left: 4rpx;
}

.tl__cover-dur {
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

.tl__cover-label {
  position: absolute;
  left: $space-2;
  bottom: $space-2;
  color: $text-inverse;
  font-size: $font-size-2xs;
  background: rgba(0, 0, 0, 0.35);
  padding: 2rpx $space-1;
  border-radius: $radius-xs;
}

/* ---------- 操作按钮（餐/评估） ---------- */
.tl__action {
  margin-top: $space-2;
  display: inline-flex;
  align-items: center;
  padding: $space-1 $space-3;
  border-radius: $radius-full;
  background: $brand-soft;
  border: 1rpx solid $label-soft-border;
}

.tl__action--primary {
  background: $label-soft-bg;
}

.tl__action--done {
  background: $bg-section;
}

.tl__action-icon {
  font-size: $font-size-xs;
  margin-right: $space-1;
  color: $icon-ink;
}

.tl__action--done .tl__action-icon {
  color: $success;
}

.tl__action-t {
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  color: $brand-primary-active;
}

.tl__action--done .tl__action-t {
  color: $text-muted;
}
</style>
