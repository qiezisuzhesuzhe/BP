<template>
  <view class="hm-page">
    <view v-if="!right" class="miss">
      <hm-navbar title="权益详情" />
      <text class="miss__icon fa-solid fa-magnifying-glass"></text>
      <text class="miss__t">未找到该权益记录</text>
      <view class="miss__btn" @tap="goRights">
        <text class="miss__btn-t">返回我的权益</text>
      </view>
    </view>

    <block v-else>
      <view class="top">
        <hm-navbar title="权益详情" bg-color="transparent" />
        <view class="top__body">
          <view class="top__row">
            <text class="top__emoji">{{ right.icon }}</text>
            <view class="top__main">
              <text class="top__name">{{ right.name }}</text>
              <text class="top__sub">{{ right.subtitle }}</text>
            </view>
          </view>
          <view class="top__chips">
            <view class="chip">
              <text class="chip__t">{{ right.duration }}</text>
            </view>
            <view class="chip">
              <text class="chip__t">{{ statusText }}</text>
            </view>
            <view class="chip">
              <text class="chip__t">剩余 {{ remain }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="hm-card panel">
        <view class="prog">
          <view class="prog__head">
            <text class="prog__t">服务进度</text>
            <text class="prog__n">{{ right.usedDays }} / {{ right.totalDays }} 天</text>
          </view>
          <view class="prog__bar">
            <view class="prog__fill" :style="{ width: percent + '%', background: right.accent }"></view>
          </view>
          <view class="prog__foot">
            <text class="prog__d">{{ right.startAt }} 开通</text>
            <text class="prog__d">{{ right.endAt }} 到期</text>
          </view>
        </view>

        <view class="hm-divider"></view>

        <view class="stat">
          <view class="stat__i">
            <text class="stat__n" :style="{ color: right.accent }">{{ right.usedDays }}</text>
            <text class="stat__l">已服务天数</text>
          </view>
          <view class="stat__sep"></view>
          <view class="stat__i">
            <text class="stat__n" :style="{ color: right.accent }">{{ remainNum }}</text>
            <text class="stat__l">剩余天数</text>
          </view>
          <view class="stat__sep"></view>
          <view class="stat__i">
            <text class="stat__n" :style="{ color: right.accent }">{{ right.chatStarted ? '已完成' : '待完成' }}</text>
            <text class="stat__l">首次问询</text>
          </view>
        </view>
      </view>

      <view class="sec">
        <text class="hm-sec-title">权益内容</text>
        <text class="hm-sec-sub">服务期内可使用的全部项目</text>
      </view>
      <view class="hm-card">
        <view v-for="(s, i) in right.services" :key="i" class="srv" :class="{ 'srv--last': i === right.services.length - 1 }">
          <view class="srv__dot" :style="{ background: right.accentSoft }">
            <text class="srv__dot-t" :style="{ color: right.accent }">✓</text>
          </view>
          <view class="srv__main">
            <text class="srv__name">{{ s.name }}</text>
            <text class="srv__spec">{{ s.spec }}</text>
          </view>
          <text class="srv__tag" :style="{ color: right.accent, background: right.accentSoft }">可用</text>
        </view>
      </view>

      <view class="sec">
        <text class="hm-sec-title">订单信息</text>
      </view>
      <view class="hm-card">
        <view class="row">
          <text class="row__l">订单编号</text>
          <text class="row__v row__v--mono">{{ right.orderNo }}</text>
        </view>
        <view class="row">
          <text class="row__l">服务包</text>
          <text class="row__v">{{ right.name }} · {{ right.duration }}</text>
        </view>
        <view class="row">
          <text class="row__l">实付金额</text>
          <text class="row__v row__v--price">¥{{ right.price }}</text>
        </view>
        <view class="row">
          <text class="row__l">支付时间</text>
          <text class="row__v">{{ payAt }}</text>
        </view>
        <view class="row">
          <text class="row__l">企业微信</text>
          <text class="row__v">{{ right.wecomAdded ? '已添加管理师' : '未添加' }}</text>
        </view>
        <view class="row" @tap="goOrders">
          <text class="row__l">查看全部订单</text>
          <text class="row__v row__v--link">前往 ›</text>
        </view>
      </view>

      <view class="sec">
        <text class="hm-sec-title">服务说明</text>
      </view>
      <view class="hm-card note">
        <text class="note__p">1. 本服务为健康管理与生活方式干预服务，不属于诊疗行为，不可替代医院就诊与医师处方。</text>
        <text class="note__p">2. 服务期自开通日起计算 {{ right.duration }}，到期后历史记录仍可查看，但不再推送每日健康指导。</text>
        <text class="note__p">3. 如出现胸痛、意识障碍、肢体无力等急症表现，请立即就近急诊或拨打 120。</text>
        <text class="note__p">4. 服务期内可随时在对话中申请调整方案，医师团队将在 1 个工作日内响应。</text>
      </view>

      <view class="bar-holder"></view>
      <view class="buybar">
        <view class="buybar__l">
          <text class="buybar__t">{{ right.chatStarted ? '方案进行中' : '请完成首次问询' }}</text>
          <text class="buybar__d">{{ right.chatStarted ? '每日健康指导已推送至首页' : '约 2 分钟，共 5 个问题' }}</text>
        </view>
        <view class="buybar__btn" :style="{ background: right.accent }" @tap="onUse">
          <text class="buybar__btn-t">{{ right.chatStarted ? '继续健康对话' : '开始首次问询' }}</text>
        </view>
      </view>
    </block>
  </view>
</template>

<script>
export default {
  data() {
    return {
      id: ''
    }
  },
  computed: {
    right() {
      return this.$store.getters.rightById(this.id)
    },
    statusText() {
      const r = this.right
      if (!r) return ''
      if (r.status !== 'active') return '已到期'
      return r.chatStarted ? '服务进行中' : '待开始使用'
    },
    remainNum() {
      const r = this.right
      if (!r) return 0
      const n = Math.ceil((r.endTs - Date.now()) / 86400000)
      return n > 0 ? n : 0
    },
    remain() {
      return this.remainNum > 0 ? this.remainNum + ' 天' : '已到期'
    },
    percent() {
      const r = this.right
      if (!r || !r.totalDays) return 0
      const p = Math.round((r.usedDays / r.totalDays) * 100)
      return Math.min(100, Math.max(2, p))
    },
    payAt() {
      const r = this.right
      if (!r) return ''
      const o = this.$store.getters.orderByNo(r.orderNo)
      return (o && o.payAt) || r.startAt
    }
  },
  onLoad(opt) {
    this.id = (opt && opt.id) || ''
    if (!this.id) {
      const a = this.$store.getters.activeRight
      if (a) this.id = a.id
    }
  },
  methods: {
    onUse() {
      const r = this.right
      if (!r) return
      if (r.wecomAdded || r.chatStarted) {
        uni.navigateTo({ url: '/pages/chat/chat?rightId=' + r.id })
        return
      }
      uni.showModal({
        title: '先添加健康管理师',
        content: '请返回「我的权益」点击立即使用，添加企业微信后开始首次问询。',
        confirmText: '去添加',
        success: (res) => {
          if (res.confirm) uni.reLaunch({ url: '/pages/rights/rights' })
        }
      })
    },
    goRights() {
      uni.reLaunch({ url: '/pages/rights/rights' })
    },
    goOrders() {
      uni.navigateTo({ url: '/pages/mine/orders' })
    }
  }
}
</script>

<style lang="scss" scoped>
.top {
  background: transparent;
  padding-bottom: $space-5;
}

.top__body {
  padding: $space-2 $space-4 0;
}

.top__row {
  display: flex;
  align-items: center;
}

.top__emoji {
  color: $icon-ink;
  width: $size-avatar-md;
  height: $size-avatar-md;
  border-radius: $radius-card-child;
  background: $bg-surface;
  box-shadow: $shadow-sm;
  font-size: $size-icon-md;
  text-align: center;
  line-height: $size-avatar-md;
  margin-right: $space-3;
}

.top__main {
  flex: 1;
}

.top__name {
  display: block;
  font-size: $page-title-size;
  font-weight: $page-title-weight;
  line-height: $page-title-line-height;
  color: $page-title-color;
  letter-spacing: 1rpx;
}

.top__sub {
  display: block;
  margin-top: $space-1;
  font-size: $font-size-xs;
  color: $text-muted;
  line-height: $line-height-normal;
}

.top__chips {
  display: flex;
  flex-wrap: wrap;
  margin-top: $space-3;
}

.chip {
  padding: $space-1 $space-3;
  border-radius: $radius-full;
  background: $label-soft-bg;
  border: 1rpx solid $label-soft-border;
  margin-right: $space-2;
  margin-bottom: $space-1;
}

.chip__t {
  font-size: $font-size-2xs;
  color: $label-soft-text;
}

.hm-card {
  margin: $space-data-list-gap $space-4 0;
  padding: $space-3;
}

.prog__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.prog__t {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.prog__n {
  font-size: $font-size-xs;
  color: $text-muted;
}

.prog__bar {
  height: $space-2;
  border-radius: $radius-full;
  background: $bg-section;
  margin-top: $space-2;
  overflow: hidden;
}

.prog__fill {
  height: 100%;
  border-radius: $radius-full;
}

.prog__foot {
  display: flex;
  justify-content: space-between;
  margin-top: $space-2;
}

.prog__d {
  font-size: $font-size-2xs;
  color: $text-disabled;
}

.stat {
  display: flex;
  align-items: center;
}

.stat__i {
  flex: 1;
  text-align: center;
}

.stat__n {
  display: block;
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
}

.stat__l {
  display: block;
  margin-top: $space-1;
  font-size: $font-size-2xs;
  color: $text-muted;
}

.stat__sep {
  width: 1rpx;
  height: $space-8;
  background: $bg-section;
}

.sec {
  padding: $space-5 $space-4 $space-2;
}

.srv {
  display: flex;
  align-items: center;
  padding-bottom: $space-3;
  margin-bottom: $space-3;
  border-bottom: 1rpx solid $border-subtle;
}

.srv--last {
  padding-bottom: 0;
  margin-bottom: 0;
  border-bottom: none;
}

.srv__dot {
  width: $size-icon-md;
  height: $size-icon-md;
  border-radius: $radius-xs;
  text-align: center;
  line-height: $size-icon-md;
  margin-right: $space-3;
}

.srv__dot-t {
  font-size: $font-size-xs;
  font-weight: $font-weight-bold;
}

.srv__main {
  flex: 1;
}

.srv__name {
  display: block;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.srv__spec {
  display: block;
  margin-top: $space-1;
  font-size: $font-size-xs;
  color: $text-muted;
}

.srv__tag {
  padding: $space-1 $space-2;
  border-radius: $radius-full;
  font-size: $font-size-2xs;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: $space-3 0;
  border-bottom: 1rpx solid $border-subtle;
}

.row:last-child {
  border-bottom: none;
}

.row__l {
  font-size: $font-size-sm;
  color: $text-muted;
}

.row__v {
  font-size: $font-size-sm;
  color: $text-primary;
  font-weight: $font-weight-medium;
}

.row__v--mono {
  font-size: $font-size-xs;
  letter-spacing: 1rpx;
}

.row__v--price {
  color: $badge;
  font-weight: $font-weight-bold;
}

.row__v--link {
  color: $brand-primary-active;
}

.note__p {
  display: block;
  font-size: $font-size-xs;
  color: $text-muted;
  line-height: $line-height-relaxed;
  margin-bottom: $space-2;
}

.note__p:last-child {
  margin-bottom: 0;
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
  display: flex;
  align-items: center;
  padding: $space-2 $space-4;
  padding-bottom: calc(env(safe-area-inset-bottom) + #{$space-2});
  background: $bg-glass-nav;
  backdrop-filter: $glass-nav-blur;
  box-shadow: $shadow-lg;
}

.buybar__l {
  flex: 1;
}

.buybar__t {
  display: block;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.buybar__d {
  display: block;
  margin-top: $space-1;
  font-size: $font-size-2xs;
  color: $text-disabled;
}

.buybar__btn {
  padding: $space-3 $space-5;
  border-radius: $radius-full;
  box-shadow: $shadow-md;
}

.buybar__btn-t {
  font-size: $font-size-sm;
  font-weight: $font-weight-bold;
  color: $text-inverse;
}

.miss {
  padding-bottom: $space-12;
  text-align: center;
}

.miss__icon {
  display: block;
  margin-top: $space-12;
  font-size: $size-icon-xl;
}

.miss__t {
  display: block;
  margin-top: $space-3;
  font-size: $font-size-md;
  color: $text-muted;
}

.miss__btn {
  display: inline-block;
  margin-top: $space-5;
  padding: $space-3 $space-6;
  border-radius: $radius-full;
  background: $brand-primary;
}

.miss__btn-t {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $text-inverse;
}
</style>
