<template>
  <view class="hm-page">
    <hm-navbar title="订单支付" bg-color="#ffffff" text-color="#1a2b2c" :show-back="!paying" />

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
            <text class="pay__icon">{{ m.icon }}</text>
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
      <text class="empty__icon">📦</text>
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
        { key: 'wx', name: '微信支付', desc: '亿万用户的选择，更快更安全', icon: '💚' },
        { key: 'alipay', name: '支付宝', desc: '数亿用户在用，安全可托付', icon: '🔵' },
        { key: 'unionpay', name: '云闪付', desc: '银行卡支付，享银联优惠', icon: '🔴' }
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
      if (!o) return '#f5f3ee'
      const pkg = this.$store.getters.packages.find((p) => p.id === o.pkgId)
      return pkg ? pkg.accentSoft : '#f5f3ee'
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
  padding: 28rpx 28rpx 0;
}

.card {
  background: #fff;
  border-radius: $radius-md;
  box-shadow: $shadow-md;
}

.ord {
  padding: 26rpx 28rpx;
}

.ord__head {
  display: flex;
  align-items: center;
  padding-bottom: 24rpx;
}

.ord__icon {
  width: 88rpx;
  height: 88rpx;
  border-radius: $radius-sm;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ord__icon-t {
  font-size: 42rpx;
}

.ord__main {
  flex: 1;
  padding: 0 20rpx;
  overflow: hidden;
}

.ord__name {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  color: $ink-900;
}

.ord__dur {
  display: block;
  font-size: 22rpx;
  color: $ink-500;
  margin-top: 8rpx;
}

.ord__status {
  font-size: 23rpx;
  font-weight: 600;
}

.ord__rows {
  padding: 22rpx 0 4rpx;
}

.ord__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 18rpx;
}

.ord__k {
  font-size: 24rpx;
  color: $ink-500;
}

.ord__v {
  font-size: 24rpx;
  color: $ink-900;
}

.ord__v--cut {
  color: $coral-500;
}

.ord__row--pay {
  align-items: baseline;
  padding-top: 4rpx;
}

.ord__k--pay {
  font-size: 26rpx;
  font-weight: 600;
  color: $ink-900;
}

.ord__pay {
  display: flex;
  align-items: baseline;
}

.ord__pay-cur {
  font-size: 24rpx;
  color: $coral-500;
  font-weight: 700;
}

.ord__pay-v {
  font-size: 50rpx;
  line-height: 50rpx;
  color: $coral-500;
  font-weight: 700;
  margin-left: 2rpx;
}

.sec-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 20rpx;
}

.pay {
  background: #fff;
  border-radius: $radius-md;
  box-shadow: $shadow-md;
  padding: 10rpx 20rpx;
}

.pay__item {
  display: flex;
  align-items: center;
  padding: 24rpx 20rpx;
  border-radius: $radius-sm;
  border: 2rpx solid transparent;
  margin: 10rpx 0;
}

.pay__item--on {
  border-color: $teal-500;
  background: $teal-100;
}

.pay__icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.pay__main {
  flex: 1;
  overflow: hidden;
}

.pay__name {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: $ink-900;
}

.pay__desc {
  display: block;
  font-size: 21rpx;
  color: $ink-400;
  margin-top: 6rpx;
}

.pay__radio {
  width: 40rpx;
  height: 40rpx;
  border-radius: 999rpx;
  border: 2rpx solid $ink-300;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.pay__radio--on {
  background: $teal-700;
  border-color: $teal-700;
}

.pay__check {
  color: #fff;
  font-size: 24rpx;
  font-weight: 700;
  line-height: 24rpx;
}

.foot-tip {
  padding: 36rpx 44rpx 20rpx;
  text-align: center;
}

.foot-tip__t {
  display: block;
  font-size: 20rpx;
  color: $ink-400;
  line-height: 1.7;
  margin-bottom: 6rpx;
}

.bar-holder {
  height: calc(160rpx + env(safe-area-inset-bottom));
}

.paybar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 96;
  background: #fff;
  box-shadow: 0 -8rpx 32rpx rgba(20, 10, 10, 0.08);
  padding: 20rpx 28rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
}

.paybar__btn {
  height: 96rpx;
  border-radius: 999rpx;
  background: linear-gradient(135deg, $teal-700 0%, $teal-500 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: $shadow-sm;
}

.paybar__btn--off {
  opacity: 0.5;
}

.paybar__btn-t {
  color: #fff;
  font-size: 32rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
}

.empty {
  padding: 180rpx 60rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty__icon {
  font-size: 90rpx;
}

.empty__t {
  font-size: 26rpx;
  color: $ink-500;
  margin-top: 24rpx;
}

.empty__btn {
  margin-top: 40rpx;
  padding: 20rpx 56rpx;
  border-radius: 999rpx;
  background: $teal-700;
}

.empty__btn-t {
  color: #fff;
  font-size: 26rpx;
  font-weight: 600;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 200;
  background: rgba(15, 25, 26, 0.62);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  width: 540rpx;
  background: #fff;
  border-radius: $radius-lg;
  box-shadow: $shadow-lg;
  padding: 56rpx 40rpx 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal__loading {
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal__spin {
  width: 84rpx;
  height: 84rpx;
  border-radius: 999rpx;
  border: 8rpx solid $warm-200;
  border-top-color: $teal-700;
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
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal__circle {
  width: 112rpx;
  height: 112rpx;
  border-radius: 999rpx;
  background: $sage-500;
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
  color: #fff;
  font-size: 62rpx;
  font-weight: 700;
  line-height: 62rpx;
}

.modal__stage {
  font-size: 30rpx;
  font-weight: 700;
  color: $ink-900;
  margin-top: 28rpx;
  text-align: center;
}

.modal__amount {
  display: flex;
  align-items: baseline;
  margin-top: 20rpx;
}

.modal__amount-cur {
  font-size: 26rpx;
  color: $ink-900;
  font-weight: 700;
}

.modal__amount-v {
  font-size: 64rpx;
  line-height: 64rpx;
  color: $ink-900;
  font-weight: 700;
  margin-left: 4rpx;
}

.modal__note {
  font-size: 24rpx;
  color: $sage-500;
  font-weight: 600;
  margin-top: 16rpx;
}

.modal__tip {
  font-size: 21rpx;
  color: $ink-400;
  margin-top: 20rpx;
}
</style>
