<template>
  <view class="hm-page">
    <view class="top">
      <hm-navbar title="我的订单" bg-color="transparent" />
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
      return p ? p.accentSoft : '#edf5f2'
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
  background: transparent;
  padding-bottom: $space-5;
}

.top__body {
  padding: $space-2 $space-4 0;
}

.top__t {
  display: block;
  font-size: $page-title-size;
  font-weight: $page-title-weight;
  line-height: $page-title-line-height;
  color: $page-title-color;
  letter-spacing: 1rpx;
}

.top__d {
  display: block;
  margin-top: $space-1;
  font-size: $font-size-xs;
  color: $text-muted;
}

.tabs {
  display: flex;
  align-items: center;
  padding: $space-3 $space-4;
  background: $bg-surface;
  box-shadow: $shadow-sm;
}

.tab {
  padding: $space-2 $space-4;
  border-radius: $radius-full;
  background: $bg-subtle;
  margin-right: $space-2;
}

.tab--on {
  background: $brand-primary;
}

.tab__t {
  font-size: $font-size-xs;
  color: $text-muted;
}

.tab__t--on {
  color: $text-inverse;
  font-weight: $font-weight-semibold;
}

.list {
  padding: $space-4 $space-4 0;
}

.ord {
  border-radius: $radius-card-child;
  background: $bg-surface;
  box-shadow: $shadow-sm;
  padding: $space-3;
  margin-bottom: $space-data-list-gap;
}

.ord__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: $space-2;
  border-bottom: 1rpx solid $border-subtle;
}

.ord__no {
  font-size: $font-size-2xs;
  color: $text-disabled;
  letter-spacing: 1rpx;
}

.ord__st {
  font-size: $font-size-2xs;
  font-weight: $font-weight-semibold;
}

.ord__st--paid {
  color: $success;
}

.ord__st--pending {
  color: $badge;
}

.ord__st--canceled {
  color: $text-disabled;
}

.ord__body {
  display: flex;
  align-items: center;
  padding: $space-3 0;
}

.ord__icon {
  width: $size-avatar-md;
  height: $size-avatar-md;
  border-radius: $radius-sm;
  text-align: center;
  line-height: $size-avatar-md;
  margin-right: $space-3;
}

.ord__icon-t {
  font-size: $font-size-xl;
}

.ord__main {
  flex: 1;
  min-width: 0;
}

.ord__name {
  display: block;
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.ord__spec {
  display: block;
  margin-top: $space-1;
  font-size: $font-size-xs;
  color: $text-muted;
}

.ord__price {
  text-align: right;
}

.ord__now {
  display: block;
  font-size: $font-size-md;
  font-weight: $font-weight-heavy;
  color: $badge;
}

.ord__origin {
  display: block;
  margin-top: $space-1;
  font-size: $font-size-2xs;
  color: $text-hint;
  text-decoration: line-through;
}

.ord__rows {
  padding-top: $space-2;
  border-top: 1rpx solid $border-subtle;
}

.ord__row {
  display: flex;
  justify-content: space-between;
  padding: $space-1 0;
}

.ord__row-l {
  font-size: $font-size-xs;
  color: $text-disabled;
}

.ord__row-v {
  font-size: $font-size-xs;
  color: $text-secondary;
}

.ord__row-v--save {
  color: $badge;
}

.ord__acts {
  display: flex;
  justify-content: flex-end;
  margin-top: $space-3;
}

.ord__ghost {
  padding: $space-2 $space-4;
  border-radius: $radius-full;
  border: 1rpx solid $border-subtle;
  margin-left: $space-2;
}

.ord__ghost-t {
  font-size: $font-size-xs;
  color: $text-muted;
}

.ord__cta {
  padding: $space-2 $space-4;
  border-radius: $radius-full;
  background: $brand-primary;
  margin-left: $space-2;
}

.ord__cta-t {
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  color: $text-inverse;
}

.empty {
  padding: $space-12 $space-10;
  text-align: center;
}

.empty__icon {
  display: block;
  font-size: $size-icon-xl;
  color: $text-disabled;
}

.empty__t {
  display: block;
  margin-top: $space-3;
  font-size: $font-size-md;
  font-weight: $font-weight-semibold;
  color: $text-secondary;
}

.empty__d {
  display: block;
  margin-top: $space-2;
  font-size: $font-size-xs;
  color: $text-muted;
  line-height: $line-height-relaxed;
}

.empty__btn {
  display: inline-block;
  margin-top: $space-5;
  padding: $space-3 $space-8;
  border-radius: $radius-full;
  background: $brand-primary;
}

.empty__btn-t {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $text-inverse;
}

.tips {
  padding: $space-4 $space-6 $space-1;
  text-align: center;
}

.tips__t {
  font-size: $font-size-2xs;
  color: $text-hint;
  line-height: $line-height-relaxed;
}
</style>
