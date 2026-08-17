<template>
  <view class="hm-page">
    <view class="top">
      <hm-navbar title="个人资料" bg-color="transparent" text-color="#ffffff" />
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
    <view class="hm-card">
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
    <view class="hm-card">
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
      if (lv === '正常') return '#6ba584'
      if (lv === '超重') return '#d9a05b'
      if (lv === '肥胖') return '#e07a5f'
      return '#6b8082'
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
  background: linear-gradient(160deg, $teal-800 0%, $teal-700 55%, $teal-500 100%);
  padding-bottom: 96rpx;
  text-align: center;
}

.top__body {
  padding: 10rpx 36rpx 0;
}

.ava {
  width: 132rpx;
  height: 132rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.22);
  border: 3rpx solid rgba(255, 255, 255, 0.45);
  margin: 0 auto;
  line-height: 128rpx;
}

.ava__t {
  font-size: 52rpx;
  font-weight: 700;
  color: #fff;
}

.top__d {
  display: block;
  margin-top: 22rpx;
  font-size: 23rpx;
  color: rgba(255, 255, 255, 0.8);
}

.hm-card:first-of-type {
  margin-top: -72rpx;
}

.fi {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 24rpx;
  margin-bottom: 24rpx;
  border-bottom: 1rpx solid $warm-100;
}

.fi--last {
  padding-bottom: 0;
  margin-bottom: 0;
  border-bottom: none;
}

.fi__l {
  font-size: 27rpx;
  color: $ink-700;
  width: 170rpx;
  flex-shrink: 0;
}

.fi__input {
  flex: 1;
  text-align: right;
  font-size: 27rpx;
  color: $ink-900;
}

.fi__input--num {
  flex: none;
  width: 130rpx;
}

.fi__ph {
  color: #c4d2d3;
  font-size: 26rpx;
}

.fi__ro {
  font-size: 27rpx;
  color: $ink-400;
}

.unit {
  display: flex;
  align-items: center;
}

.unit__t {
  margin-left: 10rpx;
  font-size: 24rpx;
  color: $ink-400;
}

.seg {
  display: flex;
  border-radius: 999rpx;
  background: $warm-100;
  padding: 5rpx;
}

.seg__i {
  padding: 10rpx 34rpx;
  border-radius: 999rpx;
}

.seg__i--on {
  background: $teal-700;
}

.seg__t {
  font-size: 25rpx;
  color: $ink-500;
}

.seg__t--on {
  color: #fff;
  font-weight: 600;
}

.sec {
  padding: 40rpx 36rpx 20rpx;
}

.bmi {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.bmi__l {
  flex: 1;
  padding-right: 24rpx;
}

.bmi__t {
  display: block;
  font-size: 28rpx;
  font-weight: 600;
  color: $ink-900;
}

.bmi__d {
  display: block;
  margin-top: 8rpx;
  font-size: 22rpx;
  color: $ink-400;
  line-height: 1.6;
}

.bmi__r {
  text-align: right;
}

.bmi__n {
  display: block;
  font-size: 46rpx;
  font-weight: 700;
}

.bmi__lv {
  display: block;
  margin-top: 4rpx;
  font-size: 22rpx;
}

.tags {
  display: flex;
  flex-wrap: wrap;
}

.tg {
  padding: 10rpx 22rpx;
  border-radius: 999rpx;
  background: $teal-100;
  margin-right: 12rpx;
  margin-bottom: 12rpx;
}

.tg__t {
  font-size: 22rpx;
  color: $teal-800;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.row__l {
  font-size: 26rpx;
  color: $ink-500;
}

.row__v {
  font-size: 26rpx;
  color: $ink-900;
}

.bar-holder {
  height: calc(160rpx + env(safe-area-inset-bottom));
}

.savebar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  padding: 18rpx 32rpx;
  padding-bottom: calc(18rpx + env(safe-area-inset-bottom));
  background: rgba(255, 255, 255, 0.97);
  box-shadow: 0 -8rpx 40rpx rgba(20, 10, 10, 0.08);
}

.savebar__btn {
  padding: 28rpx 0;
  border-radius: 999rpx;
  background: linear-gradient(135deg, $teal-700 0%, $teal-800 100%);
  text-align: center;
  box-shadow: 0 10rpx 28rpx rgba(26, 125, 130, 0.28);
}

.savebar__btn-t {
  font-size: 30rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: 2rpx;
}
</style>
