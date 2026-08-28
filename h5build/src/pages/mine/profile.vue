<template>
  <view class="hm-page">
    <view class="top">
      <hm-navbar title="个人资料" bg-color="transparent" />
      <view class="top__body">
        <view class="ava">
          <text class="ava__t">{{ form.avatarText }}</text>
        </view>
        <text class="top__d">健康档案信息将用于生成个性化管理方案</text>
      </view>
    </view>

    <view class="hm-card">
      <view class="fi">
        <text class="fi__l">姓名</text>
        <input class="fi__input" v-model="form.name" placeholder="请输入姓名" placeholder-class="fi__ph" maxlength="12" />
      </view>
      <view class="fi">
        <text class="fi__l">手机号</text>
        <text class="fi__ro">{{ form.phone }}</text>
      </view>
      <view class="fi">
        <text class="fi__l">性别</text>
        <view class="seg">
          <view v-for="g in genders" :key="g" class="seg__i" :class="{ 'seg__i--on': form.gender === g }" @tap="form.gender = g">
            <text class="seg__t" :class="{ 'seg__t--on': form.gender === g }">{{ g }}</text>
          </view>
        </view>
      </view>
      <view class="fi fi--last">
        <text class="fi__l">所在城市</text>
        <input class="fi__input" v-model="form.city" placeholder="如：上海 · 徐汇区" placeholder-class="fi__ph" maxlength="20" />
      </view>
    </view>

    <view class="sec">
      <text class="hm-sec-title">身体指标</text>
      <text class="hm-sec-sub">影响 BMI 与运动处方强度计算</text>
    </view>
    <view class="hm-card hm-card--flush">
      <view class="fi">
        <text class="fi__l">年龄</text>
        <view class="unit">
          <input class="fi__input fi__input--num" v-model="form.age" type="number" maxlength="3" />
          <text class="unit__t">岁</text>
        </view>
      </view>
      <view class="fi">
        <text class="fi__l">身高</text>
        <view class="unit">
          <input class="fi__input fi__input--num" v-model="form.height" type="number" maxlength="3" />
          <text class="unit__t">cm</text>
        </view>
      </view>
      <view class="fi fi--last">
        <text class="fi__l">体重</text>
        <view class="unit">
          <input class="fi__input fi__input--num" v-model="form.weight" type="number" maxlength="3" />
          <text class="unit__t">kg</text>
        </view>
      </view>
    </view>

    <view class="hm-card bmi">
      <view class="bmi__l">
        <text class="bmi__t">当前 BMI</text>
        <text class="bmi__d">{{ bmiHint }}</text>
      </view>
      <view class="bmi__r">
        <text class="bmi__n" :style="{ color: bmiColor }">{{ bmi }}</text>
        <text class="bmi__lv" :style="{ color: bmiColor }">{{ bmiLevel }}</text>
      </view>
    </view>

    <view class="sec">
      <text class="hm-sec-title">健康标签</text>
      <text class="hm-sec-sub">由问询结果与服务记录自动生成</text>
    </view>
    <view class="hm-card hm-card--flush">
      <view class="tags">
        <view v-for="(t, i) in profile.tags" :key="i" class="tg">
          <text class="tg__t">{{ t }}</text>
        </view>
      </view>
      <view class="hm-divider"></view>
      <view class="row">
        <text class="row__l">加入时间</text>
        <text class="row__v">{{ profile.joinAt }}</text>
      </view>
    </view>

    <view class="bar-holder"></view>
    <view class="savebar">
      <view class="savebar__btn" @tap="onSave">
        <text class="savebar__btn-t">保存资料</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      genders: ['男', '女'],
      form: {
        name: '',
        avatarText: '',
        phone: '',
        gender: '男',
        age: '',
        height: '',
        weight: '',
        city: ''
      }
    }
  },
  computed: {
    profile() {
      return this.$store.state.profile
    },
    bmi() {
      const h = parseFloat(this.form.height)
      const w = parseFloat(this.form.weight)
      if (!h || !w) return '—'
      return (w / ((h / 100) * (h / 100))).toFixed(1)
    },
    bmiLevel() {
      const v = parseFloat(this.bmi)
      if (!v) return ''
      if (v < 18.5) return '偏瘦'
      if (v < 24) return '正常'
      if (v < 28) return '超重'
      return '肥胖'
    },
    bmiColor() {
      const lv = this.bmiLevel
      if (lv === '正常') return '#27ae60'
      if (lv === '超重') return '#f15533'
      if (lv === '肥胖') return '#eb5757'
      return '#64748b'
    },
    bmiHint() {
      const lv = this.bmiLevel
      if (lv === '超重' || lv === '肥胖') return '减重 5%-10% 可显著改善血压与血糖'
      if (lv === '正常') return '继续保持，中国成人适宜范围 18.5 - 23.9'
      if (lv === '偏瘦') return '注意营养摄入，避免肌肉量流失'
      return '请填写身高体重'
    }
  },
  onLoad() {
    const p = this.profile
    this.form = {
      name: p.name,
      avatarText: p.avatarText,
      phone: p.phone,
      gender: p.gender,
      age: '' + p.age,
      height: '' + p.height,
      weight: '' + p.weight,
      city: p.city
    }
  },
  methods: {
    onSave() {
      const name = (this.form.name || '').trim()
      if (!name) {
        uni.showToast({ title: '请填写姓名', icon: 'none' })
        return
      }
      const age = parseInt(this.form.age, 10)
      const height = parseInt(this.form.height, 10)
      const weight = parseInt(this.form.weight, 10)
      if (!age || age < 1 || age > 120) {
        uni.showToast({ title: '请填写有效年龄', icon: 'none' })
        return
      }
      if (!height || height < 80 || height > 250) {
        uni.showToast({ title: '请填写有效身高', icon: 'none' })
        return
      }
      if (!weight || weight < 20 || weight > 300) {
        uni.showToast({ title: '请填写有效体重', icon: 'none' })
        return
      }
      this.$store.dispatch('updateProfile', {
        name: name,
        avatarText: name.charAt(0),
        gender: this.form.gender,
        age: age,
        height: height,
        weight: weight,
        city: (this.form.city || '').trim()
      })
      uni.showToast({ title: '资料已保存', icon: 'none' })
      setTimeout(() => {
        uni.navigateBack()
      }, 700)
    }
  }
}
</script>

<style lang="scss" scoped>
.top {
  background: transparent;
  padding-bottom: $space-5;
  text-align: center;
}

.top__body {
  padding: $space-1 $space-4 0;
}

.ava {
  width: $size-avatar-lg;
  height: $size-avatar-lg;
  border-radius: $radius-full;
  background: linear-gradient(135deg, $avatar-default-bg-start 0%, $avatar-default-bg-end 100%);
  box-shadow: $shadow-sm;
  margin: 0 auto;
  line-height: $size-avatar-lg;
}

.ava__t {
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  color: $text-secondary;
}

.top__d {
  display: block;
  margin-top: $space-3;
  font-size: $font-size-xs;
  color: $text-muted;
  line-height: $line-height-relaxed;
}

.hm-card {
  margin: $space-data-list-gap $space-4 0;
  padding: $space-3;
}

/* 紧跟区块标题的卡片，与标题贴合无间距 */
.hm-card--flush {
  margin-top: 0;
}

.fi {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: $space-3;
  margin-bottom: $space-3;
  border-bottom: 1rpx solid $border-subtle;
}

.fi--last {
  padding-bottom: 0;
  margin-bottom: 0;
  border-bottom: none;
}

.fi__l {
  font-size: $font-size-sm;
  color: $text-secondary;
  width: 170rpx;
  flex-shrink: 0;
}

.fi__input {
  flex: 1;
  text-align: right;
  font-size: $font-size-sm;
  color: $text-primary;
}

.fi__input--num {
  flex: none;
  width: 130rpx;
}

.fi__ph {
  color: $text-hint;
  font-size: $font-size-sm;
}

.fi__ro {
  font-size: $font-size-sm;
  color: $text-disabled;
}

.unit {
  display: flex;
  align-items: center;
}

.unit__t {
  margin-left: $space-1;
  font-size: $font-size-xs;
  color: $text-disabled;
}

.seg {
  display: flex;
  border-radius: $radius-full;
  background: $bg-subtle;
  padding: 4rpx;
}

.seg__i {
  padding: $space-1 $space-4;
  border-radius: $radius-full;
}

.seg__i--on {
  background: $brand-primary;
}

.seg__t {
  font-size: $font-size-xs;
  color: $text-muted;
}

.seg__t--on {
  color: $text-inverse;
  font-weight: $font-weight-semibold;
}

.sec {
  padding: $space-5 $space-4 0;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.bmi {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bmi__l {
  flex: 1;
  padding-right: $space-3;
}

.bmi__t {
  display: block;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.bmi__d {
  display: block;
  margin-top: $space-1;
  font-size: $font-size-2xs;
  color: $text-disabled;
  line-height: $line-height-relaxed;
}

.bmi__r {
  text-align: right;
}

.bmi__n {
  display: block;
  font-size: $font-size-xl;
  font-weight: $font-weight-bold;
  line-height: $line-height-tight;
}

.bmi__lv {
  display: block;
  margin-top: $space-1;
  font-size: $font-size-2xs;
}

.tags {
  display: flex;
  flex-wrap: wrap;
}

.tg {
  padding: $space-1 $space-3;
  border-radius: $radius-full;
  background: $label-soft-bg;
  border: 1rpx solid $label-soft-border;
  margin-right: $space-1;
  margin-bottom: $space-1;
}

.tg__t {
  font-size: $font-size-2xs;
  color: $label-soft-text;
  font-weight: $font-weight-medium;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.row__l {
  font-size: $font-size-xs;
  color: $text-muted;
}

.row__v {
  font-size: $font-size-xs;
  color: $text-primary;
}

.bar-holder {
  height: calc(env(safe-area-inset-bottom) + #{$size-bottom-nav-height});
}

.savebar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: $z-nav;
  padding: $space-2 $space-4;
  padding-bottom: calc(env(safe-area-inset-bottom) + #{$space-2});
  background: $bg-glass-nav;
  backdrop-filter: $glass-nav-blur;
  box-shadow: $shadow-lg;
}

.savebar__btn {
  padding: $space-3 0;
  border-radius: $radius-full;
  background: $brand-primary;
  text-align: center;
  box-shadow: $shadow-md;
}

.savebar__btn-t {
  font-size: $font-size-md;
  font-weight: $font-weight-bold;
  color: $text-inverse;
  letter-spacing: 2rpx;
}
</style>
