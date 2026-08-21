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
        <text class="sheet__d">输入手环或睡眠监测仪机身上的 IMEI / 二维码中的设备编号</text>
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
            <text class="sheet__dev-sn">{{ shownModel }}</text>
            <text class="sheet__dev-sn">SN：{{ fakeSn }}</text>
            <text v-if="fakeDeviceId" class="sheet__dev-sn sheet__dev-sn--id">设备号：{{ fakeDeviceId }}</text>
            <text v-if="platformInfo && platformInfo.site" class="sheet__dev-sn">安装位置：{{ platformInfo.site }}</text>
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
import { verifyRadarDevice, bindRadarDevice } from '@/common/radar.js'

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
      // 绑定成功后的返回目标：'back' 返回来源页（如对话页），'device' 回设备列表 tab
      from: '',
      // 平台查证中（雷达设备号需回云平台核验，耗时约 1-2 秒）
      verifying: false,
      // 平台核验拿到的设备信息（型号、安装位置、状态），用于确认弹层展示真实信息
      platformInfo: null,
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
    },
    // 确认弹层里的型号：平台查得的真实型号优先于内置默认型号
    shownModel() {
      if (this.platformInfo && this.platformInfo.model) return this.platformInfo.model
      return (this.result && this.result.model) || ''
    }
  },
  onLoad(options) {
    // from 由跳转方传入（如对话页 '立即绑定' 传 from=chat），绑定成功后原路返回；
    // 缺省或来自设备列表 tab 时统一回设备列表
    this.from = (options && options.from) || ''
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
      // #ifdef H5
      // H5 走纯浏览器 getUserMedia + jsQR DOM 注入实现
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
      // #endif

      // #ifndef H5
      // APP / 小程序端：用系统原生扫码能力 uni.scanCode（兼容 iOS/Android 相机权限与性能）
      try {
        const res = await new Promise((resolve, reject) => {
          uni.scanCode({
            scanType: ['qrCode'],
            autoDecodeCharset: true,
            onlyFromCamera: false, // 允许相册选图，减少用户扫不上时切换成本
            success: (r) => resolve(r),
            fail: (err) => reject(err)
          })
        })
        this.camState = 'on'
        // uni.scanCode 扫码成功后直接解析内容
        if (res && (res.result || res.charSet)) {
          // handleCode 内含回平台查证，是异步的，必须 await，否则拿到的是 Promise（恒真）会漏掉失败提示
          uni.showLoading({ title: '查询设备…', mask: true })
          let ok = false
          try {
            ok = await this.handleCode(res.result || '')
          } finally {
            uni.hideLoading()
          }
          if (!ok) {
            // 扫码内容无法识别为设备码，给出提示
            uni.showModal({
              title: '无法识别二维码',
              content: '请确认二维码为享相手环或睡眠监测仪机身上的二维码，或选择"手动输入设备号"。',
              showCancel: false
            })
          }
        }
      } catch (e) {
        // 用户取消扫码（常见）不 toast，仅标记 fail 让 UI 提供模拟识别/手动入口
        const msg = (e && (e.errMsg || e.errmsg || String(e))) || ''
        if (msg && /cancel|abort|deny|permission/i.test(msg)) {
          this.camState = 'fail'
        } else {
          this.camState = 'fail'
        }
      }
      // #endif
    },
    // 定时截帧交给 jsQR 识别
    startScanLoop() {
      this.stopScanLoop()
      const canvas = document.createElement('canvas')
      this.canvasEl = canvas
      this.scanTimer = setInterval(async () => {
        const v = this.videoEl
        if (!v || !v.videoWidth || this.result || this.verifying) return
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
        if (!code || !code.data) return
        // 识别到码后要回平台查证设备类型（约 1-2 秒），期间给出 loading，避免界面像卡住
        uni.showLoading({ title: '查询设备…', mask: true })
        try {
          await this.handleCode(code.data)
        } finally {
          uni.hideLoading()
        }
      }, 220)
    },
    stopScanLoop() {
      if (this.scanTimer) {
        clearInterval(this.scanTimer)
        this.scanTimer = null
      }
    },
    teardownVideo() {
      // #ifdef H5
      this.stopScanLoop()
      if (this.videoEl && this.videoEl.parentNode) this.videoEl.parentNode.removeChild(this.videoEl)
      this.videoEl = null
      this.canvasEl = null
      // #endif
    },
    stopCamera() {
      // #ifdef H5
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
      // #endif
      // 非 H5 没有需要释放的对象，仅 reset 视觉状态即可
      // #ifndef H5
      // uni.scanCode 是系统控件，会在调用时自动申请/释放资源，无需手动回收
      // #endif
    },
    // 解析设备机身二维码：
    // 1) 享相自定义格式 ankang://device?type=xxx&sn=xxx[&deviceid=xxx]，type 直接指明设备类型
    // 2) 通用格式（真实设备机身码常见）：URL 带 imei/deviceid 参数、JSON、混有文本的 15 位数字等，
    //    先用 extractDeviceId 宽容提取设备号，再回物联网云平台查证该设备号是否为毫米波雷达；
    //    平台查得到 → 睡眠监测仪（雷达款），并带回真实型号/安装位置；查不到 → 回落血压款手环。
    // 返回 Promise<boolean>：true 已识别并弹出确认层
    async handleCode(text) {
      if (this.result || this.verifying) return false
      const raw = String(text || '').trim()
      if (!raw) return false
      const m = raw.match(/ankang:\/\/device\?type=([a-z0-9-]+)(?:&sn=([A-Za-z0-9-]+))?(?:&deviceid=([A-Za-z0-9-]+))?/i)
      let type = null
      let deviceid = ''
      let platform = null
      if (m) {
        type = deviceType(m[1])
        deviceid = m[3] || ''
      }
      if (!type) {
        deviceid = extractDeviceId(raw)
        if (deviceid) {
          // 回平台查证设备归属：这是区分雷达与手环的唯一可靠依据（二维码内容本身不含类型信息）
          this.verifying = true
          try {
            platform = await verifyRadarDevice(deviceid)
          } catch (e) {
            platform = null
          }
          this.verifying = false
          if (this.result) return false
          type = deviceType(platform ? 'radar' : 'band-bp')
        }
      }
      if (!type) return false
      this.stopScanLoop()
      this.fakeSn = (m && m[2]) || 'AK-' + String(100000 + Math.floor(Math.random() * 899999))
      this.fakeDeviceId = deviceid || '86' + String(Math.floor(Math.random() * 9000000000000 + 1000000000000))
      this.platformInfo = platform
      this.result = type
      return true
    },
    // 原型演示：生成一张设备机身二维码内容，走与相机相同的识别流程
    async simulate() {
      if (this.result || this.verifying) return
      const type = this.types[scanSeq % this.types.length]
      scanSeq++
      this.fakeSn = 'AK-' + String(100000 + Math.floor(Math.random() * 899999))
      if (type.key === 'band-bp') {
        const imei = '86' + String(Math.floor(Math.random() * 9000000000000 + 1000000000000))
        this.fakeDeviceId = imei
        await this.handleCode('ankang://device?type=' + type.key + '&sn=' + this.fakeSn + '&deviceid=' + imei)
      } else {
        this.fakeDeviceId = ''
        await this.handleCode('ankang://device?type=' + type.key + '&sn=' + this.fakeSn)
      }
    },
    openManual() {
      this.manualVisible = true
      this.manualInput = ''
    },
    // 手动输入的设备号走与扫码相同的解析/绑定流程
    async confirmManual() {
      const raw = String(this.manualInput || '').trim()
      if (!raw) {
        uni.showToast({ title: '请输入设备号', icon: 'none' })
        return
      }
      this.manualVisible = false
      uni.showLoading({ title: '查询设备…', mask: true })
      let ok = false
      try {
        ok = await this.handleCode(raw)
      } finally {
        uni.hideLoading()
      }
      if (!ok) {
        uni.showToast({ title: '未识别到有效设备号，请检查后重试', icon: 'none' })
      }
    },
    async confirm() {
      const type = this.result
      const deviceid = this.fakeDeviceId
      const platform = this.platformInfo
      this.result = null
      this.platformInfo = null

      // 雷达款：先向对接后端注册（后端会再回平台核验一次），注册失败则不入库，避免出现"绑了但永远没数据"的僵尸设备
      if (type.key === 'radar') {
        uni.showLoading({ title: '正在绑定…', mask: true })
        const rec = await bindRadarDevice(deviceid, type.name)
        uni.hideLoading()
        if (!rec) {
          uni.showModal({
            title: '绑定失败',
            content: '云平台未能确认该设备（设备号 ' + deviceid + '）。请确认设备已在平台注册并联网后重试。',
            showCancel: false
          })
          return
        }
      }

      await this.$store.dispatch('addDevice', {
        typeKey: type.key,
        sn: this.fakeSn,
        deviceid: deviceid,
        // 平台回传的真实型号/安装位置优先于内置默认值
        model: (platform && platform.model) || undefined,
        site: (platform && platform.site) || undefined
      })

      // 血压款手环：注册到对接后端
      if (type.key === 'band-bp' && deviceid) {
        bindBandDevice(deviceid, type.name)
      }

      uni.showToast({ title: '设备添加成功', icon: 'success' })
      setTimeout(() => {
        // 从对话页等普通页面进来的，绑定完原路返回，保住用户此前的上下文；
        // 从设备列表 tab 进来（或无来源标记）的，回设备列表查看新设备
        if (this.from && this.from !== 'device') {
          const pages = getCurrentPages ? getCurrentPages() : []
          if (pages && pages.length > 1) {
            uni.navigateBack({ delta: 1 })
            return
          }
        }
        uni.switchTab({
          url: '/pages/device/device'
        })
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
