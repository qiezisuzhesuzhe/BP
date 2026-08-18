<template>
  <view class="hm-page">
    <hm-navbar title="设备详情" bg-color="transparent"></hm-navbar>

    <view class="wrap" v-if="dev">
      <!-- 设备信息 -->
      <view class="dev-head">
        <view class="dev-head__icon" :style="{ background: type.accentSoft }">
          <text class="dev-head__icon-t" :class="type.icon" :style="{ color: type.color }"></text>
        </view>
        <view class="dev-head__main">
          <text class="dev-head__name">{{ dev.name }}</text>
          <text class="dev-head__model">{{ dev.model }} · {{ dev.sn }}</text>
          <text class="dev-head__sync">最近同步 {{ dev.lastSync }}</text>
        </view>
        <view class="dev-head__status">
          <text class="dev-head__dot"></text>
          <text class="dev-head__status-t">实时</text>
        </view>
      </view>

      <!-- 实时数据 -->
      <view class="sec-head">
        <text class="hm-sec-title">实时数据</text>
        <text class="hm-sec-sub">每 2 秒自动刷新</text>
      </view>

      <view class="grid">
        <view v-for="(f, i) in type.fields" :key="f.key" class="cell" :class="{ 'cell--pulse': pulsing[i] }">
          <view class="cell__icon" :style="{ background: type.accentSoft }">
            <text class="cell__icon-t" :class="f.icon" :style="{ color: type.color }"></text>
          </view>
          <view class="cell__val">
            <text class="cell__num" :style="{ color: type.color }">{{ fmt(f) }}</text>
            <text class="cell__unit">{{ f.unit }}</text>
          </view>
          <text class="cell__label">{{ f.label }}</text>
        </view>
      </view>

      <view class="foot-tip">
        <text class="foot-tip__t">数据由设备同步上传，本页为演示数据，仅供界面预览</text>
      </view>

      <view class="unbind" @tap="unbind">
        <text class="unbind__t">解绑设备</text>
      </view>
      <view class="hm-safe-bottom"></view>
    </view>
  </view>
</template>

<script>
import { deviceType } from '@/common/mock.js'

export default {
  data() {
    return {
      id: '',
      timer: null,
      pulsing: [false, false, false, false]
    }
  },
  computed: {
    dev() {
      return this.$store.getters.deviceById(this.id)
    },
    type() {
      return this.dev ? deviceType(this.dev.typeKey) : null
    }
  },
  onLoad(options) {
    this.id = options.id || ''
  },
  onShow() {
    this.pull()
    this.timer = setInterval(() => this.pull(), 2000)
  },
  onHide() {
    this.clearTimer()
  },
  onUnload() {
    this.clearTimer()
  },
  methods: {
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    async pull() {
      if (!this.id || !this.$store.getters.deviceById(this.id)) return
      await this.$store.dispatch('updateDeviceData', this.id)
      // 数据更新时对应字段短暂高亮，模拟实时刷新感
      if (this.type) {
        this.type.fields.forEach((f, i) => {
          this.$set(this.pulsing, i, true)
          setTimeout(() => this.$set(this.pulsing, i, false), 400)
        })
      }
    },
    fmt(f) {
      const v = this.dev && this.dev.data ? this.dev.data[f.key] : null
      if (v === null || v === undefined || v === '') return '--'
      return v
    },
    unbind() {
      uni.showModal({
        title: '解绑设备',
        content: '解绑后该设备将停止向本账号同步数据，确定解绑「' + this.dev.name + '」吗？',
        confirmColor: '#f15533',
        success: (res) => {
          if (!res.confirm) return
          this.$store.dispatch('removeDevice', this.id)
          uni.showToast({ title: '已解绑', icon: 'success' })
          setTimeout(() => uni.navigateBack(), 500)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.dev-head {
  display: flex;
  align-items: center;
  background: $bg-surface;
  border-radius: $radius-card;
  box-shadow: $shadow-sm;
  padding: $space-4 $space-3;
}

.dev-head__icon {
  width: $size-icon-xl;
  height: $size-icon-xl;
  border-radius: $radius-card-child;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: $shadow-md;
}

.dev-head__icon-t {
  font-size: $font-size-xl;
}

.dev-head__main {
  flex: 1;
  padding: 0 $space-3;
  overflow: hidden;
}

.dev-head__name {
  display: block;
  font-size: $font-size-lg;
  font-weight: $font-weight-heavy;
  color: $text-primary;
  line-height: $line-height-tight;
}

.dev-head__model {
  display: block;
  font-size: $font-size-xs;
  color: $text-secondary;
  margin-top: $space-1;
}

.dev-head__sync {
  display: block;
  font-size: $font-size-2xs;
  color: $text-disabled;
  margin-top: $space-1;
}

.dev-head__status {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  background: $success;
  border-radius: $radius-full;
  padding: $space-1 $space-2;
}

.dev-head__dot {
  width: $size-badge-sm;
  height: $size-badge-sm;
  border-radius: 50%;
  background: $text-inverse;
  margin-right: $space-1;
  animation: dot-blink 1.6s ease-in-out infinite;
}

@keyframes dot-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}

.dev-head__status-t {
  font-size: $font-size-2xs;
  color: $text-inverse;
  font-weight: $font-weight-semibold;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.cell {
  width: 49%;
  background: $bg-surface;
  border-radius: $radius-card-child;
  box-shadow: $shadow-sm;
  padding: $space-3;
  margin-bottom: $space-data-list-gap;
  transition: box-shadow $duration-normal $ease-standard;
}

.cell--pulse {
  box-shadow: 0 0 0 2rpx rgba(56, 154, 130, 0.35);
}

.cell__icon {
  width: $size-icon-md;
  height: $size-icon-md;
  border-radius: $radius-sm;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cell__icon-t {
  font-size: $font-size-sm;
}

.cell__val {
  margin-top: $space-2;
  display: flex;
  align-items: baseline;
}

.cell__num {
  font-size: $font-size-2xl;
  font-weight: $font-weight-heavy;
  line-height: $line-height-tight;
}

.cell__unit {
  font-size: $font-size-2xs;
  color: $text-muted;
  margin-left: $space-1;
}

.cell__label {
  display: block;
  font-size: $font-size-xs;
  color: $text-muted;
  margin-top: $space-1;
}

.foot-tip {
  padding: $space-4 $space-6 $space-3;
  text-align: center;
}

.foot-tip__t {
  font-size: $font-size-2xs;
  color: $text-disabled;
  line-height: $line-height-relaxed;
}

.unbind {
  margin-top: $space-2;
  background: $bg-surface;
  border-radius: $radius-card-child;
  box-shadow: $shadow-sm;
  height: $size-input-height;
  display: flex;
  align-items: center;
  justify-content: center;
}

.unbind__t {
  font-size: $font-size-sm;
  color: $danger;
  font-weight: $font-weight-semibold;
}
</style>
