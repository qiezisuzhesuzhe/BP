<template>
  <view class="scan-page">
    <hm-navbar title="扫描设备" bg-color="transparent" text-color="#ffffff"></hm-navbar>

    <view class="scan-frame">
      <view class="scan-frame__corner scan-frame__corner--tl"></view>
      <view class="scan-frame__corner scan-frame__corner--tr"></view>
      <view class="scan-frame__corner scan-frame__corner--bl"></view>
      <view class="scan-frame__corner scan-frame__corner--br"></view>
      <view class="scan-line" v-if="camState === 'on'"></view>
      <view class="scan-frame__inner" ref="frame">
        <text v-if="camState !== 'on'" class="fa-solid fa-qrcode scan-frame__icon"></text>
      </view>
    </view>
    <text class="scan-tip">{{ camTip }}</text>

    <view class="scan-btn" @tap="simulate">
      <text class="fa-solid fa-qrcode scan-btn__icon"></text>
      <text class="scan-btn__t">{{ camState === 'on' ? '模拟识别（演示）' : '模拟扫码识别' }}</text>
    </view>

    <view class="scan-manual" @tap="openManual">
      <text class="fa-solid fa-keyboard scan-manual__icon"></text>
      <text class="scan-manual__t">扫描不到？手动输入设备号</text>
    </view>

    <!-- 手动输入设备号 -->
    <view v-if="manualVisible" class="sheet">
      <view class="sheet__mask" @tap="manualVisible = false"></view>
      <view class="sheet__card">
        <text class="sheet__t">手动输入设备号</text>
        <text class="sheet__d">输入手环机身上的 IMEI 或二维码中的设备编号</text>
        <input
          class="sheet__input"
          v-model="manualInput"
          type="number"
          maxlength="20"
          placeholder="如 860132060872223"
          placeholder-class="sheet__ph"
          focus
        />
        <view class="sheet__btns">
          <view class="sheet__btn sheet__btn--cancel" @tap="manualVisible = false">取消</view>
          <view class="sheet__btn" @tap="confirmManual">
            <text class="sheet__btn-t">绑定设备</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 识别结果确认 -->
    <view v-if="result" class="sheet">
      <view class="sheet__mask" @tap="result = null"></view>
      <view class="sheet__card">
        <text class="sheet__t">识别到设备</text>
        <view class="sheet__dev">
          <view class="sheet__dev-icon" :style="{ background: result.accentSoft }">
            <text class="sheet__dev-icon-t" :class="result.icon" :style="{ color: result.color }"></text>
          </view>
          <view class="sheet__dev-main">
            <text class="sheet__dev-name">{{ result.name }}</text>
            <text class="sheet__dev-sn">{{ result.model }}</text>
            <text class="sheet__dev-sn">SN：{{ fakeSn }}</text>
            <text v-if="fakeDeviceId" class="sheet__dev-sn sheet__dev-sn--id">设备号：{{ fakeDeviceId }}</text>
          </view>
        </view>
        <view class="sheet__btns">
          <view class="sheet__btn sheet__btn--cancel" @tap="result = null">取消</view>
          <view class="sheet__btn" :style="{ background: result.color }" @tap="confirm">
            <text class="sheet__btn-t">确认添加</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { DEVICE_TYPES, deviceType } from '@/common/mock.js'
import { bindBandDevice, extractDeviceId } from '@/common/band.js'

let scanSeq = 0

export default {
  data() {
    return {
      types: DEVICE_TYPES,
      result: null,
      fakeSn: '',
      fakeDeviceId: '',
      manualVisible: false,
      manualInput: '',
      // 相机状态：idle 准备中 / starting 启动中 / on 已开启 / fail 不可用
      camState: 'idle',
      stream: null,
      scanTimer: null,
      videoEl: null,
      canvasEl: null
    }
  },
  computed: {
    camTip() {
      const tips = {
        idle: '正在准备扫码…',
        starting: '正在启动相机…',
        on: '将设备机身上的二维码对准扫描框，自动识别',
        fail: '未检测到可用相机，可点击下方按钮模拟识别'
      }
      return tips[this.camState] || ''
    }
  },
  onShow() {
    this.startCamera()
  },
  onHide() {
    this.stopCamera()
  },
  onUnload() {
    this.stopCamera()
  },
  methods: {
    // 加载 jsQR（main.js 已预加载本地库，此处兜底确保就绪）
    ensureJsQR() {
      if (typeof window === 'undefined') return Promise.reject(new Error('no window'))
      if (window.jsQR) return Promise.resolve()
      return new Promise((resolve, reject) => {
        const s = document.createElement('script')
        s.src = './static/lib/jsqr.js'
        s.onload = () => resolve()
        s.onerror = () => reject(new Error('jsQR 加载失败'))
        document.head.appendChild(s)
      })
    },
    async startCamera() {
      // 非 H5 或浏览器不支持摄像头时降级为模拟
      if (typeof document === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        this.camState = 'fail'
        return
      }
      try {
        await this.ensureJsQR()
      } catch (e) {
        this.camState = 'fail'
        return
      }
      this.camState = 'starting'
      const v = document.createElement('video')
      v.setAttribute('playsinline', '')
      v.setAttribute('muted', '')
      v.muted = true
      v.playsInline = true
      // 动态创建的 video 不在模板中，scoped 样式无法命中，直接内联
      v.style.width = '100%'
      v.style.height = '100%'
      v.style.objectFit = 'cover'
      v.style.display = 'block'
      v.style.borderRadius = 'inherit'
      this.videoEl = v
      const frame = this.$refs.frame
      if (frame && frame.$el) {
        frame.$el.appendChild(v)
      } else if (frame) {
        frame.appendChild(v)
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        })
        this.stream = stream
        v.srcObject = stream
        await v.play()
        this.camState = 'on'
        this.startScanLoop()
      } catch (e) {
        this.camState = 'fail'
        this.teardownVideo()
      }
    },
    // 定时截帧交给 jsQR 识别
    startScanLoop() {
      this.stopScanLoop()
      const canvas = document.createElement('canvas')
      this.canvasEl = canvas
      this.scanTimer = setInterval(() => {
        const v = this.videoEl
        if (!v || !v.videoWidth || this.result) return
        const w = Math.min(v.videoWidth, 640)
        const h = Math.round((w / v.videoWidth) * v.videoHeight)
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.drawImage(v, 0, 0, w, h)
        const img = ctx.getImageData(0, 0, w, h)
        // attemptBoth：兼容深色背景/反色二维码，提高真实手环小屏二维码识别率
        const code = window.jsQR(img.data, w, h, { inversionAttempts: 'attemptBoth' })
        if (code && code.data) this.handleCode(code.data)
      }, 220)
    },
    stopScanLoop() {
      if (this.scanTimer) {
        clearInterval(this.scanTimer)
        this.scanTimer = null
      }
    },
    teardownVideo() {
      this.stopScanLoop()
      if (this.videoEl && this.videoEl.parentNode) this.videoEl.parentNode.removeChild(this.videoEl)
      this.videoEl = null
      this.canvasEl = null
    },
    stopCamera() {
      this.stopScanLoop()
      if (this.stream) {
        this.stream.getTracks().forEach((t) => t.stop())
        this.stream = null
      }
      if (this.videoEl) {
        this.videoEl.srcObject = null
        if (this.videoEl.parentNode) this.videoEl.parentNode.removeChild(this.videoEl)
        this.videoEl = null
      }
      this.canvasEl = null
    },
    // 解析设备机身二维码：
    // 1) 安康自定义格式 ankang://device?type=xxx&sn=xxx[&deviceid=xxx]
    // 2) 通用格式（真实手环常见）：URL 带 imei/deviceid 参数、JSON、混有文本的 15 位数字等，
    //    通过 extractDeviceId 宽容提取设备号，按血压款手环识别
    handleCode(text) {
      if (this.result) return false
      const raw = String(text || '').trim()
      if (!raw) return false
      const m = raw.match(/ankang:\/\/device\?type=([a-z0-9-]+)(?:&sn=([A-Za-z0-9-]+))?(?:&deviceid=([A-Za-z0-9-]+))?/i)
      let type = null
      let deviceid = ''
      if (m) {
        type = deviceType(m[1])
        deviceid = m[3] || ''
      }
      if (!type) {
        deviceid = extractDeviceId(raw)
        if (deviceid) type = deviceType('band-bp')
      }
      if (!type) return false
      this.stopScanLoop()
      this.fakeSn = (m && m[2]) || 'AK-' + String(100000 + Math.floor(Math.random() * 899999))
      this.fakeDeviceId = deviceid || '86' + String(Math.floor(Math.random() * 9000000000000 + 1000000000000))
      this.result = type
      return true
    },
    // 原型演示：生成一张设备机身二维码内容，走与相机相同的识别流程
    simulate() {
      if (this.result) return
      const type = this.types[scanSeq % this.types.length]
      scanSeq++
      this.fakeSn = 'AK-' + String(100000 + Math.floor(Math.random() * 899999))
      if (type.key === 'band-bp') {
        const imei = '86' + String(Math.floor(Math.random() * 9000000000000 + 1000000000000))
        this.fakeDeviceId = imei
        this.handleCode('ankang://device?type=' + type.key + '&sn=' + this.fakeSn + '&deviceid=' + imei)
      } else {
        this.fakeDeviceId = ''
        this.handleCode('ankang://device?type=' + type.key + '&sn=' + this.fakeSn)
      }
    },
    openManual() {
      this.manualVisible = true
      this.manualInput = ''
    },
    // 手动输入的设备号走与扫码相同的解析/绑定流程
    confirmManual() {
      const raw = String(this.manualInput || '').trim()
      if (!raw) {
        uni.showToast({ title: '请输入设备号', icon: 'none' })
        return
      }
      this.manualVisible = false
      if (!this.handleCode(raw)) {
        uni.showToast({ title: '未识别到有效设备号，请检查后重试', icon: 'none' })
      }
    },
    async confirm() {
      const type = this.result
      this.result = null
      const dev = await this.$store.dispatch('addDevice', {
        typeKey: type.key,
        sn: this.fakeSn,
        deviceid: this.fakeDeviceId
      })
      // 血压款手环：注册到对接后端，进入手环状态页
      if (type.key === 'band-bp' && this.fakeDeviceId) {
        bindBandDevice(this.fakeDeviceId, type.name)
      }
      uni.showToast({ title: '设备添加成功', icon: 'success' })
      setTimeout(() => {
        if (type.key === 'band-bp') {
          uni.redirectTo({ url: '/pages/band/status?id=' + dev.id })
        } else {
          uni.redirectTo({ url: '/pages/device/detail?id=' + dev.id })
        }
      }, 600)
    }
  }
}
</script>

<style lang="scss" scoped>
.scan-page {
  min-height: 100vh;
  background: #0f1f2e;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.scan-frame {
  position: relative;
  margin-top: $space-12;
  width: 520rpx;
  height: 520rpx;
}

.scan-frame__inner {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-card;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.04);
}

.scan-frame__icon {
  font-size: 160rpx;
  color: rgba(255, 255, 255, 0.18);
}

.scan-frame__corner {
  position: absolute;
  width: 64rpx;
  height: 64rpx;
  border: 8rpx solid $brand-primary;
  z-index: 2;
}

.scan-frame__corner--tl {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
  border-radius: $radius-sm 0 0 0;
}

.scan-frame__corner--tr {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
  border-radius: 0 $radius-sm 0 0;
}

.scan-frame__corner--bl {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
  border-radius: 0 0 0 $radius-sm;
}

.scan-frame__corner--br {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
  border-radius: 0 0 $radius-sm 0;
}

.scan-line {
  position: absolute;
  left: 24rpx;
  right: 24rpx;
  top: 16rpx;
  height: 4rpx;
  border-radius: 2rpx;
  background: linear-gradient(90deg, transparent, $brand-primary, transparent);
  box-shadow: 0 0 24rpx rgba(125, 212, 188, 0.9);
  animation: scan-move 2.4s ease-in-out infinite;
  z-index: 1;
}

@keyframes scan-move {
  0% {
    top: 16rpx;
    opacity: 0.4;
  }
  50% {
    top: 488rpx;
    opacity: 1;
  }
  100% {
    top: 16rpx;
    opacity: 0.4;
  }
}

.scan-tip {
  margin-top: $space-6;
  font-size: $font-size-xs;
  color: rgba(255, 255, 255, 0.72);
  letter-spacing: 2rpx;
  text-align: center;
  padding: 0 $space-6;
  line-height: $line-height-relaxed;
}

.scan-btn {
  margin-top: $space-8;
  display: flex;
  align-items: center;
  background: $brand-primary;
  border-radius: $radius-full;
  padding: $space-3 $space-8;
  box-shadow: $shadow-lg;
}

.scan-btn__icon {
  color: $text-primary;
  font-size: $font-size-md;
  margin-right: $space-2;
}

.scan-btn__t {
  color: $text-primary;
  font-size: $font-size-sm;
  font-weight: $font-weight-bold;
}

.scan-manual {
  margin-top: $space-3;
  display: flex;
  align-items: center;
  padding: $space-2 $space-4;
  border-radius: $radius-full;
  background: rgba(255, 255, 255, 0.08);
  border: 1rpx solid rgba(255, 255, 255, 0.16);
}

.scan-manual__icon {
  color: rgba(255, 255, 255, 0.85);
  font-size: $font-size-2xs;
  margin-right: $space-2;
}

.scan-manual__t {
  color: rgba(255, 255, 255, 0.85);
  font-size: $font-size-2xs;
  letter-spacing: 1rpx;
}

.sheet {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: $z-modal;
  display: flex;
  align-items: flex-end;
}

.sheet__mask {
  position: absolute;
  inset: 0;
  background: rgba(15, 31, 46, 0.55);
}

.sheet__card {
  position: relative;
  width: 100%;
  background: $bg-surface;
  border-radius: $radius-lg $radius-lg 0 0;
  padding: $space-5 $space-4 calc(env(safe-area-inset-bottom) + #{$space-5});
}

.sheet__t {
  display: block;
  font-size: $font-size-md;
  font-weight: $font-weight-heavy;
  color: $text-primary;
  text-align: center;
}

.sheet__d {
  display: block;
  font-size: $font-size-2xs;
  color: $text-muted;
  text-align: center;
  margin-top: $space-2;
}

.sheet__input {
  margin-top: $space-4;
  height: $size-input-height;
  background: $bg-section;
  border-radius: $radius-card-child;
  padding: 0 $space-4;
  font-size: $font-size-md;
  color: $text-primary;
  letter-spacing: 2rpx;
}

.sheet__ph {
  color: $text-hint;
  font-size: $font-size-sm;
  letter-spacing: 0;
}

.sheet__dev {
  margin-top: $space-4;
  display: flex;
  align-items: center;
  background: $bg-section;
  border-radius: $radius-card-child;
  padding: $space-3;
}

.sheet__dev-icon {
  width: $size-icon-xl;
  height: $size-icon-xl;
  border-radius: $radius-card-child;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sheet__dev-icon-t {
  font-size: $font-size-xl;
}

.sheet__dev-main {
  flex: 1;
  padding-left: $space-3;
}

.sheet__dev-name {
  display: block;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $text-primary;
}

.sheet__dev-sn {
  display: block;
  font-size: $font-size-2xs;
  color: $text-muted;
  margin-top: $space-1;
}

.sheet__dev-sn--id {
  color: $brand-primary-active;
  font-weight: $font-weight-semibold;
}

.sheet__btns {
  margin-top: $space-5;
  display: flex;
}

.sheet__btn {
  flex: 1;
  height: $size-input-height;
  border-radius: $radius-full;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: $font-size-sm;
  font-weight: $font-weight-bold;
  color: $text-inverse;
}

.sheet__btn--cancel {
  background: $bg-section;
  color: $text-secondary;
  margin-right: $space-3;
}

.sheet__btn-t {
  color: $text-inverse;
}
</style>
