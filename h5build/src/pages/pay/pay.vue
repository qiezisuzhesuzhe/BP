<template>
  <view class="hm-page">
    <hm-navbar title="订单支付" bg-color="transparent" :show-back="!paying" />

    <block v-if="order">
      <view class="wrap">
        <view class="card ord">
          <view class="ord__head">
            <view class="ord__icon" :style="{ background: iconBg }">
              <text class="ord__icon-t">{{ order.icon }}</text>
            </view>
            <view class="ord__main">
              <text class="ord__name">{{ order.pkgName }}</text>
              <text class="ord__dur">服务时长 {{ order.duration }}</text>
            </view>
            <text class="ord__status" :style="{ color: order.accent }">{{ statusText }}</text>
          </view>

          <view class="hm-divider"></view>

          <view class="ord__rows">
            <view class="ord__row">
              <text class="ord__k">订单编号</text>
              <text class="ord__v">{{ order.orderNo }}</text>
            </view>
            <view class="ord__row">
              <text class="ord__k">下单时间</text>
              <text class="ord__v">{{ order.createAt }}</text>
            </view>
          </view>

          <view class="hm-divider"></view>

          <view class="ord__rows">
            <view class="ord__row">
              <text class="ord__k">服务原价</text>
              <text class="ord__v">¥{{ order.originPrice }}</text>
            </view>
            <view class="ord__row">
              <text class="ord__k">限时优惠</text>
              <text class="ord__v ord__v--cut">- ¥{{ discount }}</text>
            </view>
            <view class="ord__row ord__row--pay">
              <text class="ord__k ord__k--pay">实付金额</text>
              <view class="ord__pay">
                <text class="ord__pay-cur">¥</text>
                <text class="ord__pay-v">{{ order.price }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="wrap">
        <view class="sec-head">
          <text class="hm-sec-title">支付方式</text>
          <text class="hm-sec-sub">当前为演示环境，不会真实扣款</text>
        </view>
        <view class="pay">
          <view
            v-for="m in methods"
            :key="m.key"
            class="pay__item"
            :class="{ 'pay__item--on': payMethod === m.key }"
            @tap="choose(m.key)"
          >
            <text class="pay__icon" :class="m.icon"></text>
            <view class="pay__main">
              <text class="pay__name">{{ m.name }}</text>
              <text class="pay__desc">{{ m.desc }}</text>
            </view>
            <view class="pay__radio" :class="{ 'pay__radio--on': payMethod === m.key }">
              <text v-if="payMethod === m.key" class="pay__check">✓</text>
            </view>
          </view>
        </view>
      </view>

      <view class="foot-tip">
        <text class="foot-tip__t">支付即表示同意《服务协议》与《隐私政策》</text>
        <text class="foot-tip__t">虚拟服务开通后不支持退款，本服务不替代医疗诊断与处方</text>
      </view>

      <view class="bar-holder"></view>

      <view class="paybar">
        <view class="paybar__btn" :class="{ 'paybar__btn--off': paying }" @tap="submit">
          <text class="paybar__btn-t">确认支付 ¥{{ order.price }}</text>
        </view>
      </view>
    </block>

    <view v-else class="empty">
      <text class="empty__icon fa-solid fa-box"></text>
      <text class="empty__t">订单不存在或已失效</text>
      <view class="empty__btn" @tap="goHome">
        <text class="empty__btn-t">返回首页</text>
      </view>
    </view>

    <view v-if="paying" class="mask">
      <view class="modal">
        <view v-if="stage < 3" class="modal__loading">
          <view class="modal__spin"></view>
        </view>
        <view v-else class="modal__done">
          <view class="modal__circle">
            <text class="modal__tick">✓</text>
          </view>
        </view>

        <text class="modal__stage">{{ stageText }}</text>

        <block v-if="stage >= 3">
          <view class="modal__amount">
            <text class="modal__amount-cur">¥</text>
            <text class="modal__amount-v">{{ order.price }}</text>
          </view>
          <text class="modal__note">已开通 {{ order.duration }} 服务</text>
          <text class="modal__tip">正在跳转到我的权益…</text>
        </block>
        <text v-else class="modal__tip">请勿关闭页面</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orderNo: '',
      payMethod: 'wx',
      paying: false,
      stage: 0,
      timers: [],
      methods: [
        { key: 'wx', name: '微信支付', desc: '亿万用户的选择，更快更安全', icon: 'fa-brands fa-weixin' },
        { key: 'alipay', name: '支付宝', desc: '数亿用户在用，安全可托付', icon: 'fa-brands fa-alipay' },
        { key: 'unionpay', name: '云闪付', desc: '银行卡支付，享银联优惠', icon: 'fa-solid fa-credit-card' }
      ]
    }
  },
  computed: {
    order() {
      return this.$store.getters.orderByNo(this.orderNo)
    },
    discount() {
      const o = this.order
      return o ? o.originPrice - o.price : 0
    },
    iconBg() {
      const o = this.order
      if (!o) return '#edf5f2'
      const pkg = this.$store.getters.packages.find((p) => p.id === o.pkgId)
      return pkg ? pkg.accentSoft : '#edf5f2'
    },
    statusText() {
      const o = this.order
      return o && o.status === 'paid' ? '已支付' : '待支付'
    },
    methodName() {
      const m = this.methods.find((x) => x.key === this.payMethod)
      return m ? m.name : '微信支付'
    },
    stageText() {
      if (this.stage === 1) return '正在调起' + this.methodName + '…'
      if (this.stage === 2) return '支付处理中…'
      if (this.stage >= 3) return '支付成功'
      return ''
    }
  },
  onLoad(options) {
    this.orderNo = (options && options.orderNo) || ''
  },
  onUnload() {
    this.clearTimers()
  },
  onBackPress() {
    return this.paying
  },
  methods: {
    clearTimers() {
      this.timers.forEach((t) => clearTimeout(t))
      this.timers = []
    },
    choose(key) {
      if (this.paying) return
      this.payMethod = key
    },
    goHome() {
      uni.reLaunch({ url: '/pages/index/index' })
    },
    submit() {
      if (this.paying || !this.order) return
      if (this.order.status === 'paid') {
        uni.reLaunch({ url: '/pages/rights/rights' })
        return
      }
      this.paying = true
      this.stage = 1
      this.timers.push(
        setTimeout(() => {
          this.stage = 2
        }, 1200)
      )
      this.timers.push(
        setTimeout(() => {
          this.stage = 3
          this.$store.dispatch('payOrder', this.orderNo)
          this.timers.push(
            setTimeout(() => {
              uni.reLaunch({ url: '/pages/rights/rights' })
            }, 1500)
          )
        }, 2600)
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  padding: $space-4 $space-4 0;
}

.card {
  background: $bg-surface;
  border-radius: $radius-card-child;
  box-shadow: $shadow-md;
}

.ord {
  padding: $space-3;
}

.ord__head {
  display: flex;
  align-items: center;
  padding-bottom: $space-3;
}

.ord__icon {
  width: $size-avatar-md;
  height: $size-avatar-md;
  border-radius: $radius-sm;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ord__icon-t {
  font-size: $size-icon-sm;
}

.ord__main {
  flex: 1;
  padding: 0 $space-2;
  overflow: hidden;
}

.ord__name {
  display: block;
  font-size: $font-size-md;
  font-weight: 700;
  color: $text-primary;
}

.ord__dur {
  display: block;
  font-size: $font-size-2xs;
  color: $text-muted;
  margin-top: $space-1;
}

.ord__status {
  font-size: $font-size-xs;
  font-weight: 600;
}

.ord__rows {
  padding: $space-3 0 $space-1;
}

.ord__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: $space-2;
}

.ord__k {
  font-size: $font-size-xs;
  color: $text-muted;
}

.ord__v {
  font-size: $font-size-xs;
  color: $text-primary;
}

.ord__v--cut {
  color: $badge;
}

.ord__row--pay {
  align-items: baseline;
  padding-top: $space-1;
}

.ord__k--pay {
  font-size: $font-size-sm;
  font-weight: 600;
  color: $text-primary;
}

.ord__pay {
  display: flex;
  align-items: baseline;
}

.ord__pay-cur {
  font-size: $font-size-xs;
  color: $badge;
  font-weight: 700;
}

.ord__pay-v {
  font-size: $font-size-2xl;
  line-height: $font-size-2xl;
  color: $badge;
  font-weight: 700;
  margin-left: 0;
}

.sec-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-top: $space-sec-head-top;
  margin-bottom: $space-sec-head-bottom;
}

.pay {
  background: $bg-surface;
  border-radius: $radius-card-child;
  box-shadow: $shadow-md;
  padding: $space-1 $space-2;
}

.pay__item {
  display: flex;
  align-items: center;
  padding: $space-3 $space-2;
  border-radius: $radius-sm;
  border: 1rpx solid transparent;
  margin: $space-data-list-gap 0;
}

.pay__item--on {
  border-color: $brand-primary;
  background: $brand-soft;
}

.pay__icon {
  font-size: $size-icon-sm;
  margin-right: $space-2;
  color: $icon-ink;
}

.pay__main {
  flex: 1;
  overflow: hidden;
}

.pay__name {
  display: block;
  font-size: $font-size-sm;
  font-weight: 600;
  color: $text-primary;
}

.pay__desc {
  display: block;
  font-size: $font-size-2xs;
  color: $text-disabled;
  margin-top: $space-1;
}

.pay__radio {
  width: $size-badge-md;
  height: $size-badge-md;
  border-radius: $radius-full;
  border: 1rpx solid $text-hint;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pay__radio--on {
  background: $brand-primary;
  border-color: $brand-primary-active;
}

.pay__check {
  color: $text-inverse;
  font-size: $font-size-xs;
  font-weight: 700;
  line-height: $font-size-xs;
}

.foot-tip {
  padding: $space-4 $space-5 $space-2;
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

.paybar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 96;
  background: $bg-surface;
  box-shadow: $shadow-lg;
  padding: $space-2 $space-3;
  padding-bottom: calc(env(safe-area-inset-bottom) + #{$space-2});
}

.paybar__btn {
  height: $size-input-height;
  border-radius: $radius-full;
  background: $brand-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: $shadow-sm;
}

.paybar__btn--off {
  opacity: 0.5;
}

.paybar__btn-t {
  color: $text-inverse;
  font-size: $font-size-md;
  font-weight: 700;
  letter-spacing: 2rpx;
}

.empty {
  padding: $space-12 $space-6 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty__icon {
  font-size: $size-icon-xl;
}

.empty__t {
  font-size: $font-size-sm;
  color: $text-muted;
  margin-top: $space-3;
}

.empty__btn {
  margin-top: $space-5;
  padding: $space-2 $space-6;
  border-radius: $radius-full;
  background: $brand-primary;
}

.empty__btn-t {
  color: $text-inverse;
  font-size: $font-size-sm;
  font-weight: 600;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 200;
  background: $overlay;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  width: $size-page-max-width * 0.6;
  background: $bg-surface;
  border-radius: $radius-card;
  box-shadow: $shadow-lg;
  padding: $space-6 $space-5;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal__loading {
  height: $size-avatar-lg;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal__spin {
  width: $size-avatar-sm;
  height: $size-avatar-sm;
  border-radius: $radius-full;
  border: 4rpx solid $border-subtle;
  border-top-color: $brand-primary-active;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.modal__done {
  height: $size-avatar-lg;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal__circle {
  width: $size-avatar-md;
  height: $size-avatar-md;
  border-radius: $radius-full;
  background: $success;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pop 0.45s ease-out;
}

@keyframes pop {
  0% {
    transform: scale(0.2);
    opacity: 0;
  }
  60% {
    transform: scale(1.15);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.modal__tick {
  color: $text-inverse;
  font-size: $font-size-3xl;
  font-weight: 700;
  line-height: $font-size-3xl;
}

.modal__stage {
  font-size: $font-size-md;
  font-weight: 700;
  color: $text-primary;
  margin-top: $space-3;
  text-align: center;
}

.modal__amount {
  display: flex;
  align-items: baseline;
  margin-top: $space-2;
}

.modal__amount-cur {
  font-size: $font-size-sm;
  color: $text-primary;
  font-weight: 700;
}

.modal__amount-v {
  font-size: $font-size-3xl;
  line-height: $font-size-3xl;
  color: $text-primary;
  font-weight: 700;
  margin-left: 0;
}

.modal__note {
  font-size: $font-size-xs;
  color: $success;
  font-weight: 600;
  margin-top: $space-2;
}

.modal__tip {
  font-size: $font-size-2xs;
  color: $text-disabled;
  margin-top: $space-2;
}
</style>
