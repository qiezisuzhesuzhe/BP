<template>
  <view class="hm-page">
    <hm-navbar title="手环状态" bg-color="transparent">
      <view slot="right" class="nav-actions">
        <view class="nav-sub-btn" @tap="onUnbind">
          <text class="fa-solid fa-link-slash nav-sub-btn__icon"></text>
          <text class="nav-sub-btn__t">解绑</text>
        </view>
        <view class="nav-refresh" :class="{ 'nav-refresh--busy': refreshing }" @tap="doRefresh">
          <text class="fa-solid fa-rotate nav-refresh__icon" :class="{ 'nav-refresh__icon--spin': refreshing }"></text>
        </view>
      </view>
    </hm-navbar>

    <!-- 设备头卡 -->
    <view class="wrap wrap--first">
      <view class="head">
        <view class="head__main">
          <text class="head__name">{{ device ? device.name : '智能手环 - 血压款' }}</text>
          <view class="head__sn">
            <text class="head__sn-t">{{ device ? device.model : '' }} · {{ deviceid || '未绑定' }}</text>
            <text class="head__sse" :class="{ 'head__sse--on': sseOpen }">
              <text class="fa-solid" :class="sseOpen ? 'fa-signal' : 'fa-signal-slash'"></text>
              <text class="head__sse-t">{{ sseOpen ? '实时接收' : '等待连接' }}</text>
            </text>
          </view>
        </view>
        <view class="head__status" :class="{ 'head__status--off': !online }">
          <view class="head__dot"></view>
          <text class="head__status-t">{{ onlineText }}</text>
        </view>
      </view>
    </view>

    <!-- 实时指标：心率/血氧/体温/皮肤温度 2×2 并排 -->
    <view class="wrap">
      <view class="vital">
        <view class="vital__card vital__card--hr">
          <view class="vital__head">
            <text class="fa-solid fa-heart-pulse vital__icon vital__icon--hr"></text>
            <text class="vital__name">实时心率</text>
          </view>
          <view class="vital__value">
            <text class="vital__num">{{ latest.hr != null ? latest.hr : '--' }}</text>
            <text class="vital__unit">bpm</text>
          </view>
          <text class="vital__sub">测量自 {{ measuredAt }}</text>
        </view>
        <view class="vital__card vital__card--spo2">
          <view class="vital__head">
            <text class="fa-solid fa-droplet vital__icon vital__icon--spo2"></text>
            <text class="vital__name">血氧</text>
          </view>
          <view class="vital__value">
            <text class="vital__num">{{ latest.spo2 != null ? latest.spo2 : '--' }}</text>
            <text class="vital__unit">%</text>
          </view>
          <text class="vital__sub">{{ spo2RangeText }}</text>
        </view>
      </view>
      <view class="vital">
        <view class="vital__card vital__card--temp">
          <view class="vital__head">
            <text class="fa-solid fa-temperature-half vital__icon vital__icon--temp"></text>
            <text class="vital__name">体温</text>
          </view>
          <view class="vital__value">
            <text class="vital__num">{{ bodyTempText }}</text>
            <text class="vital__unit">°C</text>
          </view>
          <text class="vital__sub">{{ tempOk ? '测量完成' : '算法计算中' }}</text>
        </view>
        <view class="vital__card vital__card--skin">
          <view class="vital__head">
            <text class="fa-solid fa-temperature-low vital__icon vital__icon--skin"></text>
            <text class="vital__name">皮肤温度</text>
          </view>
          <view class="vital__value">
            <text class="vital__num">{{ skinTempText }}</text>
            <text class="vital__unit">°C</text>
          </view>
          <text class="vital__sub">{{ tempOk ? '体表温度' : '算法计算中' }}</text>
        </view>
      </view>
    </view>

    <!-- 压力 -->
    <view class="wrap">
      <view class="stress">
        <view class="stress__head">
          <view class="stress__title">
            <text class="fa-solid fa-gauge-high stress__icon"></text>
            <text class="stress__name">压力</text>
          </view>
          <view class="stress__tag" :style="{ background: stressColor.bg, color: stressColor.color }">
            <text class="stress__tag-dot" :style="{ background: stressColor.color }"></text>
            <text class="stress__tag-t">{{ stressLabel }}</text>
          </view>
        </view>
        <view class="stress__value">
          <text class="stress__num">{{ stressText }}</text>
          <text class="stress__unit">压力指数</text>
        </view>
        <view class="stress__bar">
          <view class="stress__bar-in" :style="{ width: stressPct + '%', background: stressColor.color }"></view>
        </view>
        <view class="stress__scale">
          <text class="stress__scale-t">放松</text>
          <text class="stress__scale-t">适中</text>
          <text class="stress__scale-t">偏高</text>
        </view>
      </view>
    </view>

    <!-- 血压 -->
    <view class="wrap">
      <view class="sec-head">
        <text class="sec-title">血压</text>
        <view class="bp-tag" :style="{ background: bp.bg, color: bp.color }">
          <text class="bp-tag__dot" :style="{ background: bp.color }"></text>
          <text class="bp-tag__t">{{ bp.label }}</text>
        </view>
      </view>
      <view class="bp">
        <view class="bp__col">
          <text class="bp__num">{{ latest.sbp != null ? latest.sbp : '--' }}</text>
          <text class="bp__t">收缩压 mmHg</text>
        </view>
        <view class="bp__divider"></view>
        <view class="bp__col">
          <text class="bp__num">{{ latest.dbp != null ? latest.dbp : '--' }}</text>
          <text class="bp__t">舒张压 mmHg</text>
        </view>
      </view>
    </view>

    <!-- 心电图 -->
    <view class="wrap">
      <view class="sec-head">
        <text class="sec-title">心电图</text>
        <text class="sec-sub">{{ ecgTimeText }}</text>
      </view>
      <view class="ecg">
        <svg v-if="ecgPoints" class="ecg__svg" viewBox="0 0 660 170" preserveAspectRatio="none">
          <polyline :points="ecgPoints" class="ecg__line" fill="none" vector-effect="non-scaling-stroke" />
        </svg>
        <view v-else class="ecg__empty">
          <text class="ecg__empty-t">-- 暂无心电图数据</text>
        </view>
        <text class="ecg__meta">{{ ecgMetaText }}</text>
      </view>
    </view>

    <!-- 睡眠 -->
    <view class="wrap">
      <view class="sec-head">
        <text class="sec-title">睡眠</text>
        <text class="sec-sub">{{ sleepTotalText }}</text>
      </view>
      <view class="sleep">
        <view class="sleep__stats">
          <view class="sleep__stat">
            <text class="sleep__stat-num sleep__stat-num--deep">{{ sleep.deep != null ? fmtSleepMin(sleep.deep) : '--' }}</text>
            <text class="sleep__stat-t">深睡</text>
          </view>
          <view class="sleep__stat">
            <text class="sleep__stat-num sleep__stat-num--light">{{ sleep.light != null ? fmtSleepMin(sleep.light) : '--' }}</text>
            <text class="sleep__stat-t">浅睡</text>
          </view>
          <view class="sleep__stat">
            <text class="sleep__stat-num sleep__stat-num--wake">{{ sleep.wake != null ? fmtSleepMin(sleep.wake) : '--' }}</text>
            <text class="sleep__stat-t">清醒</text>
          </view>
        </view>
        <view v-if="sleep.total" class="sleep__strip">
          <view class="sleep__strip-seg sleep__strip-seg--deep" :style="{ width: sleepPct.deep + '%' }"></view>
          <view class="sleep__strip-seg sleep__strip-seg--light" :style="{ width: sleepPct.light + '%' }"></view>
          <view class="sleep__strip-seg sleep__strip-seg--wake" :style="{ width: sleepPct.wake + '%' }"></view>
        </view>
        <view v-else class="sleep__strip sleep__strip--empty"></view>
      </view>
    </view>

    <!-- 步数 -->
    <view class="wrap">
      <view class="sec-head">
        <text class="sec-title">今日活动</text>
        <text class="sec-sub">每 1 分钟自动刷新</text>
      </view>
      <view class="steps">
        <view class="steps__main">
          <text class="steps__num">{{ steps != null ? fmt(steps) : '--' }}</text>
          <text class="steps__unit">步</text>
        </view>
        <view class="steps__bar">
          <view class="steps__bar-in" :style="{ width: stepsPct + '%' }"></view>
        </view>
        <view class="steps__meta">
          <text class="steps__meta-item">距离 {{ latest.distance != null ? latest.distance + ' m' : '--' }}</text>
          <text class="steps__meta-item">目标 10,000 步</text>
          <text v-if="latest.battery != null" class="steps__meta-item">电量 {{ latest.battery * 10 }}%</text>
        </view>
      </view>
    </view>

    <!-- 发送消息 -->
    <view class="wrap">
      <view class="sec-head">
        <text class="sec-title">发送消息</text>
        <text class="sec-sub">推送到手环屏幕</text>
      </view>
      <view class="msg">
        <input
          class="msg__input"
          v-model="msgTitle"
          maxlength="5"
          placeholder="标题（选填，≤15字节）"
          placeholder-class="msg__ph"
        />
        <textarea
          class="msg__area"
          v-model="msgText"
          maxlength="80"
          placeholder="消息内容（≤240字节），发送后在手环上显示"
          placeholder-class="msg__ph"
        />
        <view class="msg__presets">
          <view v-for="p in presets" :key="p" class="msg__chip" @tap="sendPreset(p)">
            <text class="msg__chip-t">{{ p }}</text>
          </view>
        </view>
        <view class="msg__bar">
          <text class="msg__len">{{ msgBytes }}/240 字节</text>
          <view class="msg__btn" :class="{ 'msg__btn--busy': msgSending }" @tap="sendMsg">
            <text class="fa-solid fa-paper-plane msg__btn-icon"></text>
            <text class="msg__btn-t">{{ msgSending ? '发送中…' : '发送' }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部状态条 -->
    <view class="foot">
      <view class="foot__left">
        <view class="foot__dot" :class="{ 'foot__dot--ok': sseOpen }"></view>
        <text class="foot__t">
          {{ sseOpen ? '已连接实时通道，手环上报将自动刷新' : (online ? '连接通道建立中…' : '等待手环数据上报…') }}
        </text>
      </view>
      <view class="foot__right">
        <text class="foot__sync">上次同步 {{ syncText }}</text>
      </view>
    </view>
    <view class="hm-safe-bottom"></view>
  </view>
</template>

<script>
import { fetchBandLatest, sendBandMessage, bpLevel, unbindBandDevice, subscribeEvents } from '@/common/band.js'

// SSE 事件：同设备同 kind 的事件 3 秒内去重，避免短时间重复 toast/flash
const DEDUP_MS = 3000

export default {
  data() {
    return {
      id: '',
      deviceid: '',
      latest: {},
      lastSyncAt: 0,
      refreshing: false,
      online: true,
      msgTitle: '',
      msgText: '',
      msgSending: false,
      presets: ['记得测量血压', '记得按时吃药', '该起身活动了', '注意安全早点回家', '记得喝水', '不舒服请按 SOS'],
      // SSE 相关
      sseOpen: false,
      _sub: null,
      _dedup: {} // { kind: ts }
    }
  },
  computed: {
    device() {
      return this.$store.getters.deviceById(this.id) || null
    },
    bp() {
      const lv = bpLevel(this.latest.sbp, this.latest.dbp)
      const bgMap = { normal: '#ddf7ed', 'normal-h': '#fdf4ed', high: '#fdeeee', none: '#f2f7fa' }
      const colorMap = { normal: '#27ae60', 'normal-h': '#f2994a', high: '#eb5757', none: '#94a3b8' }
      return { label: lv.label, color: colorMap[lv.key], bg: bgMap[lv.key] }
    },
    steps() {
      return this.latest.steps != null ? this.latest.steps : null
    },
    stepsPct() {
      if (this.steps == null) return 0
      return Math.min(100, Math.round((this.steps / 10000) * 100))
    },
    measuredAt() {
      if (!this.latest.ts) return '--'
      const d = new Date(this.latest.ts * 1000)
      const p = (n) => (n < 10 ? '0' + n : n)
      return p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds())
    },
    syncText() {
      if (!this.lastSyncAt) return '--'
      const s = Math.max(0, Math.round((Date.now() - this.lastSyncAt) / 1000))
      if (s < 60) return s + ' 秒前'
      return Math.round(s / 60) + ' 分钟前'
    },
    onlineText() {
      return this.online ? '在线' : '离线'
    },
    msgBytes() {
      return this.byteLen(this.msgText)
    },
    /* ---------- 血氧 ---------- */
    spo2RangeText() {
      if (this.latest.spo2 == null) return '测量后显示血氧值'
      const min = this.latest.spo2Min != null ? this.latest.spo2Min : '--'
      const max = this.latest.spo2Max != null ? this.latest.spo2Max : '--'
      return '最低 ' + min + ' · 最高 ' + max
    },
    /* ---------- 体温 / 皮肤温度（HisHealthTemp：type=1 可用，值 ×10） ---------- */
    tempOk() {
      return this.latest.tempOk !== false && (this.latest.bodyTemp != null || this.latest.skinTemp != null)
    },
    bodyTempText() {
      if (this.latest.bodyTemp == null || this.latest.tempOk === false) return '--'
      return this.latest.bodyTemp.toFixed(1)
    },
    skinTempText() {
      if (this.latest.skinTemp == null || this.latest.tempOk === false) return '--'
      return this.latest.skinTemp.toFixed(1)
    },
    /* ---------- 压力（HisHealthHrv.fatigue → 压力值 = 100 - fatigue） ---------- */
    stressText() {
      return this.latest.stress != null ? this.latest.stress : '--'
    },
    stressLabel() {
      const s = this.latest.stress
      if (s == null) return '--'
      if (s < 50) return '放松'
      if (s < 80) return '适中'
      return '偏高'
    },
    stressPct() {
      if (this.latest.stress == null) return 0
      return Math.max(0, Math.min(100, this.latest.stress))
    },
    stressColor() {
      const s = this.latest.stress
      if (s == null) return { bg: '#f2f7fa', color: '#94a3b8' }
      if (s < 50) return { bg: '#ddf7ed', color: '#27ae60' }
      if (s < 80) return { bg: '#fdf4ed', color: '#f2994a' }
      return { bg: '#fdeeee', color: '#eb5757' }
    },
    /* ---------- 心电图 ---------- */
    ecgPoints() {
      const s = this.latest.ecgSamples
      if (!s || !s.length) return ''
      const W = 660
      const H = 170
      let min = Infinity
      let max = -Infinity
      for (const v of s) {
        if (v < min) min = v
        if (v > max) max = v
      }
      const span = max - min || 1
      const pts = []
      for (let i = 0; i < s.length; i++) {
        const x = (i / (s.length - 1)) * W
        const y = 10 + (1 - (s[i] - min) / span) * (H - 20)
        pts.push(x.toFixed(1) + ',' + y.toFixed(1))
      }
      return pts.join(' ')
    },
    ecgTimeText() {
      if (!this.latest.ecgTs) return '最近测量 --'
      const d = new Date(this.latest.ecgTs * 1000)
      const p = (n) => (n < 10 ? '0' + n : n)
      return '最近测量 ' + p(d.getHours()) + ':' + p(d.getMinutes())
    },
    ecgMetaText() {
      if (this.latest.ecgN == null) return '测量后显示心电图波形'
      return this.latest.ecgN + ' 个采样 · 约 ' + Math.round(this.latest.ecgN / 40) + ' 秒'
    },
    /* ---------- 睡眠 ---------- */
    sleep() {
      return this.latest.sleep || {}
    },
    sleepTotalText() {
      const s = this.latest.sleep
      if (!s || s.total == null) return '暂无睡眠数据'
      return '共 ' + this.fmtSleepMin(s.total)
    },
    sleepPct() {
      const s = this.latest.sleep
      if (!s || !s.total) return { deep: 0, light: 0, wake: 0 }
      const deep = Math.round((s.deep / s.total) * 100)
      const light = Math.round((s.light / s.total) * 100)
      return { deep: deep, light: light, wake: Math.max(0, 100 - deep - light) }
    }
  },
  onLoad(options) {
    this.id = (options && options.id) || ''
    this.ensureDevice()
  },
  onShow() {
    this.ensureDevice()
    this.load()
    this.startSse()
  },
  onHide() {
    this.stopSse()
  },
  onUnload() {
    this.stopSse()
  },
  methods: {
    /* ---------- SSE 实时通道 ---------- */
    startSse() {
      this.stopSse()
      if (!this.deviceid) return
      this._sub = subscribeEvents({
        deviceid: this.deviceid,
        kinds: ['pb','alarm','sos','status','deviceinfo','calllog','device_unbind'],
        onOpen: () => {
          this.sseOpen = true
        },
        onClose: () => {
          this.sseOpen = false
        },
        onError: () => {
          // 不打断用户：EventSource/长轮询都会自恢复
        },
        onEvent: (evt) => this.handleSse(evt)
      })
    },
    stopSse() {
      if (this._sub) {
        try { this._sub.close() } catch (e) {}
        this._sub = null
      }
      this.sseOpen = false
    },
    handleSse(evt) {
      const kind = evt.kind || (evt.payload && evt.payload.kind) || 'message'
      const p = (evt && evt.payload) || {}
      // device_unbind：如果是自己被解绑 → 立刻提示并回设备列表
      if (kind === 'device_unbind') {
        if (p.deviceid === this.deviceid) {
          this.stopSse()
          uni.showToast({ title: '本设备已被解绑', icon: 'none' })
          setTimeout(() => {
            uni.switchTab({ url: '/pages/device/device', fail: () => uni.navigateBack() })
          }, 800)
        }
        return
      }
      // sos / alarm 关键事件：无论是否带 snapshot 都 toast（不做 dedup，这类事件值得强提醒）
      if (kind === 'sos') {
        uni.showModal({
          title: '⚠️ 手环 SOS 呼叫',
          content: '检测到 ' + (this.device && this.device.name ? this.device.name : '手环') + ' 触发 SOS 紧急呼叫，请尽快确认情况。',
          showCancel: false,
          confirmText: '知道了',
          confirmColor: '#f15533'
        })
      } else if (kind === 'alarm') {
        this.toast(kind, '⚠️ 检测到告警：心率/血压/血氧异常或跌倒，请注意查看')
      }
      // 若后端给了 snapshot，直接合并到 latest（省一次 request）
      if (p && p.snapshot && typeof p.snapshot === 'object' && Object.keys(p.snapshot).length) {
        const snap = Object.assign({}, p.snapshot)
        // 避免空数据覆盖老数据
        for (const k of Object.keys(snap)) {
          if (snap[k] === null || snap[k] === undefined || snap[k] === '') delete snap[k]
        }
        this.latest = Object.assign({}, this.latest, snap)
        this.lastSyncAt = Date.now()
        // 回写 store
        if (this.id) {
          const l = this.latest
          this.$store.commit('UPDATE_DEVICE_DATA', {
            id: this.id,
            data: {
              sys: l.sbp,
              dia: l.dbp,
              heartRate: l.hr,
              steps: l.steps,
              battery: l.battery
            },
            lastSync: this.syncText
          })
        }
        const l = this.latest
        this.online = !!(l && (l.hr != null || l.sbp != null || l.dbp != null || l.steps != null))
      } else {
        // 没给 snapshot（如 status/notify 的 online）：做一次轻量拉取
        this.lightLoad()
      }
      // 轻提示
      if (kind === 'pb') this.toast(kind, '收到手环最新上报数据')
      else if (kind === 'status') {
        if (p.online === true) this.toast(kind, '设备已上线')
        else if (p.online === false) this.toast(kind, '设备已下线')
      } else if (kind === 'deviceinfo') {
        if (p.wearing === true) this.toast(kind, '检测到用户已佩戴手环')
        else if (p.wearing === false) this.toast(kind, '检测到手环已摘下')
        else this.toast(kind, '设备信息已更新')
      } else if (kind === 'calllog') {
        this.toast(kind, '检测到新的通话记录')
      }
    },
    // 同类事件 3s 内重复则不弹 toast，避免高频上报时刷屏
    toast(kind, text) {
      const now = Date.now()
      if (this._dedup[kind] && now - this._dedup[kind] < DEDUP_MS) return
      this._dedup[kind] = now
      uni.showToast({ title: text, icon: 'none', duration: 1200 })
    },
    lightLoad() {
      if (!this.deviceid) return
      fetchBandLatest(this.deviceid).then((latest) => {
        if (latest) this.latest = latest
        this.lastSyncAt = Date.now()
        const l = this.latest
        this.online = !!(l && (l.hr != null || l.sbp != null || l.dbp != null || l.steps != null))
        if (this.id) {
          this.$store.commit('UPDATE_DEVICE_DATA', {
            id: this.id,
            data: {
              sys: l.sbp,
              dia: l.dbp,
              heartRate: l.hr,
              steps: l.steps,
              battery: l.battery
            },
            lastSync: this.syncText
          })
        }
      })
    },
    // 从 store 设备记录取 deviceid（扫码绑定跳转/页面重进时兜底）
    ensureDevice() {
      if (this.deviceid) return
      const dev = this.$store.getters.deviceById(this.id)
      if (dev && dev.deviceid) {
        this.deviceid = dev.deviceid
        // 如果 deviceid 刚拿到而 SSE 还没启，启动它
        if (!this._sub) this.startSse()
      }
    },
    fmt(n) {
      return String(n == null ? 0 : n).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    // 分钟 → "X小时Y分 / Y分钟"
    fmtSleepMin(min) {
      if (min == null) return '--'
      const h = Math.floor(min / 60)
      const m = min % 60
      return h ? h + '小时' + m + '分' : m + '分钟'
    },
    // UTF-8 字节数（手环消息标题 ≤15B、内容 ≤240B）
    byteLen(s) {
      const str = String(s || '')
      let n = 0
      for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i)
        n += c > 0x7f ? (c > 0x7ff ? 3 : 2) : 1
      }
      return n
    },
    // 发送消息到手环（entservice 指令下发）
    sendMsg() {
      this.doSend((this.msgTitle || '').trim(), (this.msgText || '').trim())
    },
    // 快捷提醒语：一键填充并发送
    sendPreset(p) {
      this.doSend('安康提醒', p)
    },
    async doSend(title, text) {
      if (!text) {
        uni.showToast({ title: '请输入消息内容', icon: 'none' })
        return
      }
      if (!this.deviceid) {
        uni.showToast({ title: '未绑定设备号', icon: 'none' })
        return
      }
      if (this.byteLen(title) > 15) {
        uni.showToast({ title: '标题不能超过15字节', icon: 'none' })
        return
      }
      if (this.byteLen(text) > 240) {
        uni.showToast({ title: '内容不能超过240字节', icon: 'none' })
        return
      }
      this.msgSending = true
      const err = await sendBandMessage(this.deviceid, title, text)
      this.msgSending = false
      uni.showToast({ title: err ? err : '消息已发送到手环', icon: 'none' })
      if (!err) {
        this.msgTitle = ''
        this.msgText = ''
      }
    },
    // 解绑设备：二次确认 → 删后端记录 + 删本地 store → 回设备列表 Tab
    onUnbind() {
      if (!this.id || !this.device) return
      const name = this.device.name || '手环'
      uni.showModal({
        title: '解绑设备',
        content: '解绑后「' + name + '」将停止向本账号同步健康数据，确定继续吗？',
        confirmText: '确定解绑',
        confirmColor: '#f15533',
        cancelText: '取消',
        success: async (res) => {
          if (!res.confirm) return
          // 后端解绑（忽略失败，本地一定删除，避免用户被"脏设备"卡住）
          await unbindBandDevice(this.deviceid)
          this.$store.dispatch('removeDevice', this.id)
          uni.showToast({ title: '已解绑', icon: 'success' })
          this.stopSse()
          setTimeout(() => {
            // 设备列表是 tabBar 页：switchTab 跳回
            uni.switchTab({
              url: '/pages/device/device',
              fail: () => uni.navigateBack()
            })
          }, 500)
        }
      })
    },
    // 手动刷新：loading 反馈 + 结果提示
    async doRefresh() {
      if (this.refreshing) return
      this.refreshing = true
      await this.load()
      this.refreshing = false
      if (!this.deviceid) {
        uni.showToast({ title: '未绑定设备号', icon: 'none' })
        return
      }
      const l = this.latest
      const hasData = !!(l && (l.hr != null || l.sbp != null || l.dbp != null || l.steps != null))
      uni.showToast({
        title: hasData ? '已刷新，数据已更新' : '暂无新数据，等待手环上报',
        icon: 'none'
      })
    },
    async load() {
      if (!this.deviceid) return
      const latest = await fetchBandLatest(this.deviceid)
      this.latest = latest || {}
      this.lastSyncAt = Date.now()
      // 只有后端真实上报过数据才视为在线
      const l = this.latest
      this.online = !!(l && (l.hr != null || l.sbp != null || l.dbp != null || l.steps != null))
      // 回写本地 store，保持设备列表一致
      if (this.id) {
        this.$store.commit('UPDATE_DEVICE_DATA', {
          id: this.id,
          data: {
            sys: l.sbp,
            dia: l.dbp,
            heartRate: l.hr,
            steps: l.steps,
            battery: l.battery
          },
          lastSync: this.syncText
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
/* ---------- 页面容器 ---------- */
.wrap {
  height: auto;
  padding: $space-4 $space-4 0;
}

/* 非首个容器顶部贴齐：卡片间距由自身撑开，区块标题由 sec-head 撑开 */
.wrap:not(.wrap--first) {
  padding-top: 0;
}

/* ---------- 区块标题 ---------- */
.sec-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: $space-sec-head-top;
  margin-bottom: $space-sec-head-bottom;
}

.sec-title {
  font-size: $font-size-lg;
  font-weight: $font-weight-heavy;
  line-height: $line-height-tight;
  color: $text-primary;
  letter-spacing: 1rpx;
}

.sec-sub {
  font-size: $font-size-xs;
  color: $text-muted;
  margin-top: $space-2;
}

.head {
  display: flex;
  align-items: center;
  background: $bg-surface;
  border-radius: $radius-card-child;
  box-shadow: $shadow-sm;
  padding: $space-4;
}

.head__main {
  flex: 1;
  padding: 0 $space-3;
  overflow: hidden;
}

.head__name {
  display: block;
  font-size: $font-size-md;
  font-weight: $font-weight-heavy;
  color: $text-primary;
  line-height: $line-height-tight;
}

.head__sn {
  display: flex;
  align-items: center;
  min-width: 0;
  margin-top: $space-1;
}

/* 设备型号·编号：超出自动省略，不换行 */
.head__sn-t {
  flex: 0 1 auto;
  min-width: 0;
  font-size: $font-size-2xs;
  color: $text-muted;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* SSE 连接状态徽标（手机信号图标） */
.head__sse {
  display: inline-flex;
  align-items: center;
  gap: $space-1;
  flex-shrink: 0;
  margin-left: $space-2;
  padding: $space-1 $space-2;
  border-radius: $radius-full;
  background: $bg-section;
  color: $text-hint;
  font-size: $font-size-2xs;
  line-height: 1;
}
.head__sse .fa-solid {
  font-size: $font-size-2xs;
}
.head__sse--on {
  background: rgba(56, 154, 130, 0.15);
  color: #2b7e6a;
  font-weight: $font-weight-semibold;
}

.head__status {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  padding: $space-1 $space-2;
  border-radius: $radius-full;
  background: $success;
}

.head__status--off {
  background: $bg-section;
}

.head__dot {
  width: $size-badge-sm;
  height: $size-badge-sm;
  border-radius: 50%;
  background: $text-inverse;
  margin-right: $space-1;
}

.head__status--off .head__dot {
  background: $text-disabled;
}

.head__status-t {
  font-size: $font-size-2xs;
  color: $text-inverse;
  font-weight: $font-weight-semibold;
}

.head__status--off .head__status-t {
  color: $text-muted;
}

/* 实时指标 2×2 并排卡（心率/血氧/体温/皮肤温度） */
/* 首行与设备头卡拉开距离，与下方区块标题间距($space-8)呼应 */
.vital {
  display: flex;
  margin-top: $space-8;
}

.vital__card {
  flex: 1;
  min-width: 0;
  background: $bg-surface;
  border-radius: $radius-card-child;
  box-shadow: $shadow-sm;
  padding: $space-4;
}

.vital__card + .vital__card {
  margin-left: $space-3;
}

.vital:not(:first-child) {
  margin-top: $space-3;
}

/* 心率卡：浅绿渐变弱强调，其余指标白卡 */
.vital__card--hr {
  background: linear-gradient(145deg, #e8f8f0 0%, $bg-surface 75%);
}

.vital__head {
  display: flex;
  align-items: center;
}

.vital__icon {
  font-size: $font-size-md;
  margin-right: $space-2;
}

.vital__icon--hr {
  color: $brand-green;
}

.vital__icon--spo2 {
  color: #0ba5c3;
}

.vital__icon--temp {
  color: #f2994a;
}

.vital__icon--skin {
  color: #4a90d9;
}

.vital__name {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $text-secondary;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.vital__value {
  display: flex;
  align-items: baseline;
  margin-top: $space-3;
}

.vital__num {
  font-size: $font-size-2xl;
  font-weight: $font-weight-heavy;
  font-family: $font-family-en;
  line-height: 1;
}

.vital__card--hr .vital__num {
  color: $brand-green;
}

.vital__card--spo2 .vital__num {
  color: #0ba5c3;
}

.vital__card--temp .vital__num {
  color: #f2994a;
}

.vital__card--skin .vital__num {
  color: #4a90d9;
}

.vital__unit {
  margin-left: $space-1;
  font-size: $font-size-2xs;
  color: $text-muted;
}

.vital__sub {
  display: block;
  margin-top: $space-2;
  font-size: $font-size-2xs;
  color: $text-hint;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 压力卡（全宽，带等级标签与进度条） */
.stress {
  margin-top: $space-8;
  background: $bg-surface;
  border-radius: $radius-card-child;
  box-shadow: $shadow-sm;
  padding: $space-4;
}

.stress__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stress__title {
  display: flex;
  align-items: center;
}

.stress__icon {
  font-size: $font-size-md;
  color: #8b5cf6;
  margin-right: $space-2;
}

.stress__name {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $text-secondary;
}

.stress__tag {
  display: flex;
  align-items: center;
  padding: $space-1 $space-3;
  border-radius: $radius-full;
  font-size: $font-size-2xs;
  font-weight: $font-weight-semibold;
}

.stress__tag-dot {
  width: $size-badge-sm;
  height: $size-badge-sm;
  border-radius: 50%;
  margin-right: $space-1;
}

.stress__value {
  display: flex;
  align-items: baseline;
  margin-top: $space-3;
}

.stress__num {
  font-size: $font-size-2xl;
  font-weight: $font-weight-heavy;
  font-family: $font-family-en;
  line-height: 1;
  color: $text-primary;
}

.stress__unit {
  margin-left: $space-2;
  font-size: $font-size-2xs;
  color: $text-muted;
}

.stress__bar {
  margin-top: $space-3;
  height: $space-2;
  border-radius: $radius-full;
  background: $bg-section;
  overflow: hidden;
}

.stress__bar-in {
  height: 100%;
  border-radius: $radius-full;
  transition: width 0.6s ease;
}

.stress__scale {
  margin-top: $space-1;
  display: flex;
  justify-content: space-between;
}

.stress__scale-t {
  font-size: $font-size-2xs;
  color: $text-hint;
}

/* 血压卡 */
.bp {
  display: flex;
  align-items: center;
  background: $bg-surface;
  border-radius: $radius-card-child;
  box-shadow: $shadow-sm;
  padding: $space-4 0;
}

.bp__col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bp__num {
  font-size: $font-size-2xl;
  font-weight: $font-weight-heavy;
  color: $text-primary;
  font-family: $font-family-en;
  line-height: 1;
}

.bp__t {
  margin-top: $space-2;
  font-size: $font-size-2xs;
  color: $text-muted;
}

.bp__divider {
  width: 1rpx;
  height: $size-icon-md;
  background: $bg-section;
}

.bp-tag {
  display: flex;
  align-items: center;
  padding: $space-1 $space-3;
  border-radius: $radius-full;
  font-size: $font-size-2xs;
  font-weight: $font-weight-semibold;
}

.bp-tag__dot {
  width: $size-badge-sm;
  height: $size-badge-sm;
  border-radius: 50%;
  margin-right: $space-1;
}

/* 步数卡 */
.steps {
  background: $bg-surface;
  border-radius: $radius-card-child;
  box-shadow: $shadow-sm;
  padding: $space-4;
}

.steps__main {
  display: flex;
  align-items: baseline;
}

.steps__num {
  font-size: $font-size-2xl;
  font-weight: $font-weight-heavy;
  color: $text-primary;
  font-family: $font-family-en;
  line-height: 1;
}

.steps__unit {
  margin-left: $space-2;
  font-size: $font-size-xs;
  color: $text-muted;
}

.steps__bar {
  margin-top: $space-3;
  height: $space-2;
  border-radius: $radius-full;
  background: $bg-section;
  overflow: hidden;
}

.steps__bar-in {
  height: 100%;
  border-radius: $radius-full;
  background: linear-gradient(90deg, $brand-primary, $brand-primary-hover);
  transition: width 0.6s ease;
}

.steps__meta {
  margin-top: $space-2;
  display: flex;
  justify-content: space-between;
}

.steps__meta-item {
  font-size: $font-size-2xs;
  color: $text-muted;
}

/* 心电图卡（深色底，波形为唯一视觉重心） */
.ecg {
  position: relative;
  background: linear-gradient(155deg, #0c2b2e 0%, #113f40 100%);
  border-radius: $radius-card-child;
  padding: $space-4;
  box-shadow: $shadow-md;
  overflow: hidden;
}

.ecg::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.045) 1rpx, transparent 1rpx),
    linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1rpx, transparent 1rpx);
  background-size: 48rpx 48rpx;
  pointer-events: none;
}

.ecg__svg {
  position: relative;
  display: block;
  width: 100%;
  height: 220rpx;
}

.ecg__line {
  stroke: #6ff0c3;
  stroke-width: 2;
  stroke-linejoin: round;
  stroke-linecap: round;
  filter: drop-shadow(0 0 6rpx rgba(111, 240, 195, 0.65));
}

.ecg__empty {
  position: relative;
  height: 220rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ecg__empty-t {
  color: rgba(255, 255, 255, 0.45);
  font-size: $font-size-xs;
  letter-spacing: 2rpx;
}

.ecg__meta {
  position: relative;
  display: block;
  margin-top: $space-2;
  font-size: $font-size-2xs;
  color: rgba(255, 255, 255, 0.6);
}

/* 睡眠卡 */
.sleep {
  background: $bg-surface;
  border-radius: $radius-card-child;
  box-shadow: $shadow-sm;
  padding: $space-4;
}

.sleep__stats {
  display: flex;
}

.sleep__stat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sleep__stat-num {
  font-size: $font-size-lg;
  font-weight: $font-weight-heavy;
  font-family: $font-family-en;
  line-height: 1.1;
}

.sleep__stat-num--deep {
  color: #1e6f5c;
}

.sleep__stat-num--light {
  color: #3eb98f;
}

.sleep__stat-num--wake {
  color: #94a3b8;
}

.sleep__stat-t {
  margin-top: $space-1;
  font-size: $font-size-2xs;
  color: $text-muted;
}

.sleep__strip {
  margin-top: $space-3;
  height: $space-3;
  border-radius: $radius-full;
  overflow: hidden;
  display: flex;
}

.sleep__strip-seg {
  height: 100%;
  transition: width 0.6s ease;
}

.sleep__strip-seg--deep {
  background: #1e6f5c;
}

.sleep__strip-seg--light {
  background: #7dd4bc;
}

.sleep__strip-seg--wake {
  background: #c8d5df;
}

.sleep__strip--empty {
  background: $bg-section;
}

/* 底部状态 */
.foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space-4 $space-4 0;
}

.foot__left {
  display: flex;
  align-items: center;
}

.foot__dot {
  width: $size-badge-sm;
  height: $size-badge-sm;
  border-radius: 50%;
  background: $text-hint;
  margin-right: $space-2;
}

.foot__dot--ok {
  background: $success;
}

.foot__t {
  font-size: $font-size-2xs;
  color: $text-muted;
}

.foot__sync {
  font-size: $font-size-2xs;
  color: $text-disabled;
}

.foot__right {
  display: flex;
  align-items: center;
}

/* 顶部右上角功能区：解绑按钮 + 刷新 */
.nav-actions {
  display: flex;
  align-items: center;
  gap: $space-2;
}

.nav-sub-btn {
  height: 60rpx;
  padding: 0 $space-3;
  border-radius: $radius-full;
  background: rgba(255, 255, 255, 0.7);
  border: 1rpx solid rgba(148, 163, 184, 0.35);
  display: inline-flex;
  align-items: center;
  gap: $space-1;
  flex-shrink: 0;
  white-space: nowrap;
  backdrop-filter: blur(6px);
  transition: opacity 0.15s ease, transform 0.1s ease;
}

.nav-sub-btn:active {
  transform: scale(0.97);
  opacity: 0.8;
}

.nav-sub-btn__icon {
  font-size: $font-size-xs;
  color: #64748b;
}

.nav-sub-btn__t {
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  color: #475569;
}

/* 顶部右上角刷新按钮 */
.nav-refresh {
  width: 60rpx;
  height: 60rpx;
  border-radius: $radius-full;
  background: $brand-primary-active;
  box-shadow: $shadow-sm;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-refresh--busy {
  opacity: 0.7;
}

.nav-refresh__icon {
  color: $text-inverse;
  font-size: $font-size-xs;
}

.nav-refresh__icon--spin {
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

/* 发送消息卡 */
.msg {
  background: $bg-surface;
  border-radius: $radius-card-child;
  box-shadow: $shadow-sm;
  padding: $space-4;
}

.msg__input {
  height: $size-input-height;
  background: $bg-section;
  border-radius: $radius-card-child;
  padding: 0 $space-3;
  font-size: $font-size-sm;
  color: $text-primary;
}

.msg__area {
  margin-top: $space-3;
  width: 100%;
  height: 180rpx;
  background: $bg-section;
  border-radius: $radius-card-child;
  padding: $space-3;
  font-size: $font-size-sm;
  color: $text-primary;
  box-sizing: border-box;
  line-height: $line-height-relaxed;
}

.msg__ph {
  color: $text-hint;
  font-size: $font-size-xs;
}

/* 快捷提醒语 */
.msg__presets {
  margin-top: $space-3;
  display: flex;
  flex-wrap: wrap;
}

.msg__chip {
  margin: 0 $space-2 $space-2 0;
  padding: $space-1 $space-3;
  border-radius: $radius-full;
  background: $bg-section;
  border: 1rpx solid $border-subtle;
}

.msg__chip-t {
  font-size: $font-size-2xs;
  color: $text-secondary;
}

.msg__bar {
  margin-top: $space-3;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.msg__len {
  font-size: $font-size-2xs;
  color: $text-muted;
}

.msg__btn {
  display: flex;
  align-items: center;
  background: $brand-primary-active;
  border-radius: $radius-full;
  padding: $space-2 $space-5;
}

.msg__btn--busy {
  opacity: 0.7;
}

.msg__btn-icon {
  color: $text-inverse;
  font-size: $font-size-2xs;
  margin-right: $space-1;
}

.msg__btn-t {
  color: $text-inverse;
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
}
</style>
