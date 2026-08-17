<template>
  <view class="hm-page">
    <view class="top">
      <hm-navbar title="我的订单" bg-color="transparent" text-color="#ffffff" />
      <view class="top__body">
        <text class="top__t">订单记录</text>
        <text class="top__d">共 {{ orders.length }} 笔 · 已支付 {{ paidCount }} 笔</text>
      </view>
    </view>

    <view class="tabs">
      <view v-for="t in tabs" :key="t.key" class="tab" :class="{ 'tab--on': tab === t.key }" @tap="tab = t.key">
        <text class="tab__t" :class="{ 'tab__t--on': tab === t.key }">{{ t.label }}</text>
      </view>
    </view>

    <view v-if="filtered.length === 0" class="empty">
      <text class="empty__icon">🧾</text>
      <text class="empty__t">暂无订单记录</text>
      <text class="empty__d">选购健康管理服务包后，订单会显示在这里</text>
      <view class="empty__btn" @tap="goHome">
        <text class="empty__btn-t">去看看服务包</text>
      </view>
    </view>

    <view v-else class="list">
      <view v-for="o in filtered" :key="o.orderNo" class="ord">
        <view class="ord__head">
          <text class="ord__no">订单号 {{ o.orderNo }}</text>
          <text class="ord__st" :class="'ord__st--' + o.status">{{ statusText(o.status) }}</text>
        </view>

        <view class="ord__body">
          <view class="ord__icon" :style="{ background: softOf(o.pkgId) }">
            <text class="ord__icon-t">{{ o.icon }}</text>
          </view>
          <view class="ord__main">
            <text class="ord__name">{{ o.pkgName }}</text>
            <text class="ord__spec">服务时长 {{ o.duration }}</text>
          </view>
          <view class="ord__price">
            <text class="ord__now">¥{{ o.price }}</text>
            <text class="ord__origin">¥{{ o.originPrice }}</text>
          </view>
        </view>

        <view class="ord__rows">
          <view class="ord__row">
            <text class="ord__row-l">下单时间</text>
            <text class="ord__row-v">{{ o.createAt }}</text>
          </view>
          <view v-if="o.payAt" class="ord__row">
            <text class="ord__row-l">支付时间</text>
            <text class="ord__row-v">{{ o.payAt }}</text>
          </view>
          <view class="ord__row">
            <text class="ord__row-l">优惠金额</text>
            <text class="ord__row-v ord__row-v--save">-¥{{ o.originPrice - o.price }}</text>
          </view>
        </view>

        <view class="ord__acts">
          <view v-if="o.status === 'pending'" class="ord__ghost" @tap="onCancel(o)">
            <text class="ord__ghost-t">取消订单</text>
          </view>
          <view v-if="o.status === 'pending'" class="ord__cta" @tap="goPay(o)">
            <text class="ord__cta-t">继续支付</text>
          </view>
          <view v-if="o.status === 'paid'" class="ord__ghost" @tap="goDetailPkg(o)">
            <text class="ord__ghost-t">再次查看</text>
          </view>
          <view v-if="o.status === 'paid'" class="ord__cta" @tap="goRight(o)">
            <text class="ord__cta-t">查看权益</text>
          </view>
          <view v-if="o.status === 'canceled'" class="ord__ghost" @tap="goDetailPkg(o)">
            <text class="ord__ghost-t">重新购买</text>
          </view>
        </view>
      </view>
    </view>

    <view class="tips">
      <text class="tips__t">虚拟服务商品，开通后不支持无理由退款，具体见用户协议</text>
    </view>
    <view class="hm-safe-bottom"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      tab: 'all',
      tabs: [
        { key: 'all', label: '全部' },
        { key: 'pending', label: '待支付' },
        { key: 'paid', label: '已支付' }
      ]
    }
  },
  computed: {
    orders() {
      return this.$store.state.orders
    },
    paidCount() {
      return this.orders.filter((o) => o.status === 'paid').length
    },
    filtered() {
      if (this.tab === 'all') return this.orders
      return this.orders.filter((o) => o.status === this.tab)
    }
  },
  methods: {
    statusText(s) {
      if (s === 'paid') return '已支付'
      if (s === 'pending') return '待支付'
      return '已取消'
    },
    softOf(pkgId) {
      const p = this.$store.getters.packages.find((x) => x.id === pkgId)
      return p ? p.accentSoft : '#f5f3ee'
    },
    goPay(o) {
      uni.navigateTo({ url: '/pages/pay/pay?orderNo=' + o.orderNo })
    },
    goRight(o) {
      const r = this.$store.state.rights.find((x) => x.orderNo === o.orderNo)
      if (r) uni.navigateTo({ url: '/pages/rights/detail?id=' + r.id })
      else uni.navigateTo({ url: '/pages/rights/rights' })
    },
    goDetailPkg(o) {
      uni.navigateTo({ url: '/pages/service/detail?id=' + o.pkgId })
    },
    onCancel(o) {
      uni.showModal({
        title: '取消订单',
        content: '确认取消订单「' + o.pkgName + '」吗？',
        confirmText: '取消订单',
        confirmColor: '#e07a5f',
        success: (res) => {
          if (!res.confirm) return
          this.$store.commit('CANCEL_ORDER', o.orderNo)
          this.$store.dispatch('persist')
          uni.showToast({ title: '订单已取消', icon: 'none' })
        }
      })
    },
    goHome() {
      uni.switchTab({ url: '/pages/index/index' })
    }
  }
}
</script>

<style lang="scss" scoped>
.top {
  background: linear-gradient(160deg, $teal-800 0%, $teal-700 55%, $teal-500 100%);
  padding-bottom: 44rpx;
}

.top__body {
  padding: 16rpx 36rpx 0;
}

.top__t {
  display: block;
  font-size: 38rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: 1rpx;
}

.top__d {
  display: block;
  margin-top: 8rpx;
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}

.tabs {
  display: flex;
  align-items: center;
  padding: 22rpx 30rpx;
  background: #fff;
  box-shadow: $shadow-sm;
}

.tab {
  padding: 12rpx 32rpx;
  border-radius: 999rpx;
  background: $warm-100;
  margin-right: 16rpx;
}

.tab--on {
  background: $teal-700;
}

.tab__t {
  font-size: 25rpx;
  color: $ink-500;
}

.tab__t--on {
  color: #fff;
  font-weight: 600;
}

.list {
  padding: 26rpx 24rpx 0;
}

.ord {
  border-radius: $radius-md;
  background: #fff;
  box-shadow: $shadow-sm;
  padding: 26rpx;
  margin-bottom: 22rpx;
}

.ord__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid $warm-100;
}

.ord__no {
  font-size: 22rpx;
  color: $ink-400;
  letter-spacing: 1rpx;
}

.ord__st {
  font-size: 23rpx;
  font-weight: 600;
}

.ord__st--paid {
  color: $sage-500;
}

.ord__st--pending {
  color: $coral-500;
}

.ord__st--canceled {
  color: $ink-400;
}

.ord__body {
  display: flex;
  align-items: center;
  padding: 24rpx 0;
}

.ord__icon {
  width: 92rpx;
  height: 92rpx;
  border-radius: 26rpx;
  text-align: center;
  line-height: 92rpx;
  margin-right: 22rpx;
}

.ord__icon-t {
  font-size: 42rpx;
}

.ord__main {
  flex: 1;
  min-width: 0;
}

.ord__name {
  display: block;
  font-size: 29rpx;
  font-weight: 600;
  color: $ink-900;
}

.ord__spec {
  display: block;
  margin-top: 8rpx;
  font-size: 23rpx;
  color: $ink-500;
}

.ord__price {
  text-align: right;
}

.ord__now {
  display: block;
  font-size: 32rpx;
  font-weight: 700;
  color: $coral-500;
}

.ord__origin {
  display: block;
  margin-top: 4rpx;
  font-size: 21rpx;
  color: $ink-300;
  text-decoration: line-through;
}

.ord__rows {
  padding-top: 18rpx;
  border-top: 1rpx solid $warm-100;
}

.ord__row {
  display: flex;
  justify-content: space-between;
  padding: 7rpx 0;
}

.ord__row-l {
  font-size: 23rpx;
  color: $ink-400;
}

.ord__row-v {
  font-size: 23rpx;
  color: $ink-700;
}

.ord__row-v--save {
  color: $coral-500;
}

.ord__acts {
  display: flex;
  justify-content: flex-end;
  margin-top: 22rpx;
}

.ord__ghost {
  padding: 16rpx 34rpx;
  border-radius: 999rpx;
  border: 1rpx solid $warm-200;
  margin-left: 16rpx;
}

.ord__ghost-t {
  font-size: 25rpx;
  color: $ink-500;
}

.ord__cta {
  padding: 16rpx 38rpx;
  border-radius: 999rpx;
  background: $teal-700;
  margin-left: 16rpx;
}

.ord__cta-t {
  font-size: 25rpx;
  font-weight: 600;
  color: #fff;
}

.empty {
  padding: 110rpx 80rpx;
  text-align: center;
}

.empty__icon {
  display: block;
  font-size: 90rpx;
}

.empty__t {
  display: block;
  margin-top: 28rpx;
  font-size: 30rpx;
  font-weight: 600;
  color: $ink-700;
}

.empty__d {
  display: block;
  margin-top: 14rpx;
  font-size: 24rpx;
  color: $ink-400;
  line-height: 1.7;
}

.empty__btn {
  display: inline-block;
  margin-top: 40rpx;
  padding: 22rpx 56rpx;
  border-radius: 999rpx;
  background: $teal-700;
}

.empty__btn-t {
  font-size: 27rpx;
  font-weight: 600;
  color: #fff;
}

.tips {
  padding: 30rpx 50rpx 10rpx;
  text-align: center;
}

.tips__t {
  font-size: 21rpx;
  color: $ink-300;
  line-height: 1.7;
}
</style>
