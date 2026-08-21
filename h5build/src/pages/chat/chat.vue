<template>
  <view class="chat">
    <hm-navbar title="" bg-color="transparent">
      <template #right>
        <view class="chat__voice" @tap="toggleVoice">
          <text class="chat__voice-icon" :class="voiceOn ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark'"></text>
        </view>
      </template>
    </hm-navbar>

    <view class="chat__head">
      <view class="chat__head-avatar">
        <text class="chat__head-emoji fa-solid fa-stethoscope"></text>
      </view>
      <view class="chat__head-main">
        <text class="chat__head-name">健康小助手</text>
        <view class="chat__head-state">
          <view class="chat__dot-live"></view>
          <text class="chat__head-status">在线 · 三甲医师团队支持</text>
        </view>
      </view>
    </view>

    <scroll-view class="chat__scroll" scroll-y :scroll-into-view="scrollInto" :scroll-with-animation="true">
      <view class="chat__list">
        <view class="chat__notice">
          <text class="chat__notice-t">本对话内容为健康管理建议，不替代医疗诊断与处方</text>
        </view>

        <view v-for="(m, i) in messages" :key="m.id || i" class="msg" :class="'msg--' + m.role">
          <view v-if="m.role === 'ai'" class="msg__avatar">
            <text class="msg__avatar-t fa-solid fa-stethoscope"></text>
          </view>

          <view class="msg__body">
            <view v-if="m.kind === 'text'" class="bubble" :class="'bubble--' + m.role">
              <text class="bubble__t" :class="'bubble__t--' + m.role">{{ m.text }}</text>
            </view>

            <view v-else-if="m.kind === 'report'" class="report">
              <view class="report__head">
                <text class="report__icon fa-solid fa-clipboard-list"></text>
                <view class="report__head-main">
                  <text class="report__title">首次评估结论</text>
                  <text class="report__sub">{{ m.report.pkgName }}</text>
                </view>
              </view>

              <view class="report__row">
                <text class="report__label">管理分型</text>
                <text class="report__value">{{ m.report.type }}</text>
              </view>
              <view class="report__row">
                <text class="report__label">危险分层</text>
                <text class="report__risk" :style="{ color: m.report.riskColor, background: m.report.riskBg }">{{ m.report.risk }}</text>
              </view>
              <view class="report__row">
                <text class="report__label">阶段目标</text>
                <text class="report__value">{{ m.report.target }}</text>
              </view>

              <view class="report__line"></view>

              <text class="report__focus-title">核心干预方向</text>
              <view v-for="(p, pi) in m.report.points" :key="pi" class="report__point">
                <text class="report__point-idx">{{ pi + 1 }}</text>
                <view class="report__point-main">
                  <text class="report__point-t">{{ p.title }}</text>
                  <text class="report__point-d">{{ p.desc }}</text>
                </view>
              </view>

              <text class="report__ref">参考：{{ m.report.guide }}</text>
            </view>

            <view v-else-if="m.kind === 'timeline'" class="plan">
              <view class="plan__head">
                <text class="plan__title">今日健康日程</text>
                <text class="plan__count">共 {{ m.items.length }} 项</text>
              </view>
              <hm-timeline :items="m.items" />
            </view>
          </view>
        </view>

        <view v-if="typing" class="msg msg--ai">
          <view class="msg__avatar">
            <text class="msg__avatar-t fa-solid fa-stethoscope"></text>
          </view>
          <view class="msg__body">
            <view class="bubble bubble--ai typing">
              <view class="typing__dot typing__dot--1"></view>
              <view class="typing__dot typing__dot--2"></view>
              <view class="typing__dot typing__dot--3"></view>
            </view>
          </view>
        </view>

        <view v-if="phase === 'generating'" class="msg msg--ai">
          <view class="msg__avatar">
            <text class="msg__avatar-t fa-solid fa-stethoscope"></text>
          </view>
          <view class="msg__body">
            <view class="gen">
              <view class="gen__head">
                <view class="gen__ring"></view>
                <text class="gen__title">正在为您生成个性化方案…</text>
              </view>
              <view v-for="(s, si) in genStages" :key="si" class="gen__step">
                <text class="gen__step-mark" :class="{ 'gen__step-mark--on': si <= genStep }">{{ si < genStep ? '✓' : '·' }}</text>
                <text class="gen__step-t" :class="{ 'gen__step-t--on': si <= genStep }">{{ s }}</text>
              </view>
              <view class="gen__bar">
                <view class="gen__bar-in" :style="{ width: genPercent + '%' }"></view>
              </view>
            </view>
          </view>
        </view>

        <!-- 阶段：欢迎是否激活本服务包（新购+已加企微，首次进入对话时显示） -->
        <view v-if="phase === 'greeting'" class="activate">
          <view class="activate__head">
            <text class="activate__badge">{{ right ? right.name : '健康管理服务包' }}</text>
            <text class="activate__status">已购买 · 待激活</text>
          </view>
          <text class="activate__t">您的服务包尚未激活，是否现在开始？</text>
          <text class="activate__d">激活后将进入首次健康问询（约 2 分钟，共 5 个问题），完成即生成您的个性化健康方案。</text>
          <view class="activate__row">
            <view class="activate__btn activate__btn--ghost" @tap="skipActivation">
              <text class="activate__btn-t activate__btn-t--ghost">稍后再说</text>
            </view>
            <view class="activate__btn" @tap="confirmActivate">
              <text class="activate__btn-t">立即激活</text>
            </view>
          </view>
        </view>

        <!-- 激活引导：用户点「稍后再说」后显示的二次引导卡 -->
        <view v-if="phase === 'done' && right && right.wecomAdded && !right.chatStarted && !activationSkipped" class="activate activate--lite">
          <text class="activate__t">您的「{{ right.name }}」尚未激活</text>
          <view class="activate__btn activate__btn--sm" @tap="confirmActivate">
            <text class="activate__btn-t">立即激活服务包</text>
          </view>
        </view>

        <view v-if="awaiting && currentQuestion" class="opts">
          <text class="opts__hint">请选择最接近您情况的一项</text>
          <view
            v-for="(o, oi) in currentQuestion.options"
            :key="o.v"
            class="opts__item"
            :class="{ 'opts__item--on': pickedIndex === oi }"
            @tap="chooseOption(oi)"
          >
            <text class="opts__t" :class="{ 'opts__t--on': pickedIndex === oi }">{{ o.label }}</text>
          </view>
        </view>

        <view v-if="assessDone" class="cta" @tap="goPlan">
          <text class="cta__t">查看完整方案 →</text>
        </view>

        <view :id="anchorId" class="chat__anchor"></view>
      </view>
    </scroll-view>

    <view class="bar">
      <view class="bar__inner">
        <input
          class="bar__input"
          :class="{ 'bar__input--off': !freeMode }"
          v-model="draft"
          :disabled="!freeMode"
          :placeholder="freeMode ? '有什么健康问题想问我？' : '请点击上方选项作答'"
          placeholder-class="bar__ph"
          confirm-type="send"
          @confirm="send"
        />
        <view class="bar__mic" @tap="onMic">
          <text class="bar__mic-t fa-solid fa-microphone"></text>
        </view>
        <view class="bar__send" :class="{ 'bar__send--off': !canSend }" @tap="send">
          <text class="bar__send-t">发送</text>
        </view>
      </view>
      <view class="bar__safe"></view>
    </view>
  </view>
</template>

<script>
import { QUESTIONS, QUESTIONS_DM, TIMELINE } from '@/common/mock.js'

export default {
  data() {
    return {
      rightId: '',
      voiceOn: true,
      messages: [],
      answers: {},
      phase: 'idle',
      step: 0,
      awaiting: false,
      pickedIndex: -1,
      typing: false,
      genStep: 0,
      genStages: ['分析问卷数据', '进行危险分层', '匹配干预方案', '生成健康时间线'],
      assessDone: false,
      activationSkipped: false,
      draft: '',
      tick: 0,
      scrollInto: '',
      timers: []
    }
  },
  computed: {
    right() {
      return this.$store.getters.rightById(this.rightId) || this.$store.getters.activeRight
    },
    pkgKey() {
      const r = this.right
      return r && r.pkgKey === 'dm' ? 'dm' : 'hbp'
    },
    questions() {
      return this.pkgKey === 'dm' ? QUESTIONS_DM : QUESTIONS
    },
    currentQuestion() {
      return this.questions[this.step] || null
    },
    freeMode() {
      // 欢迎 / 询问中都不可自由输入；激活跳过/做完都可
      return this.phase === 'done'
    },
    canSend() {
      return this.freeMode && this.draft.trim().length > 0
    },
    genPercent() {
      return Math.min(100, Math.round(((this.genStep + 1) / this.genStages.length) * 100))
    },
    anchorId() {
      return 'anchor-' + this.tick
    }
  },
  watch: {
    messages() {
      this.scrollBottom()
    },
    typing() {
      this.scrollBottom()
    },
    genStep() {
      this.scrollBottom()
    }
  },
  onLoad(options) {
    this.rightId = (options && options.rightId) || ''
    const r = this.right
    if (r) this.rightId = r.id
    const history = this.$store.state.chats[this.rightId]
    if (history && history.messages && history.messages.length) {
      this.messages = history.messages.slice()
      this.answers = Object.assign({}, history.answers || {})
      this.phase = 'done'
      this.assessDone = !!history.done
      this.activationSkipped = !!history.activationSkipped
      this.scrollBottom()
      return
    }

    // 首次进入：根据 wecomAdded/chatStarted 决定进入的初始态
    // 1) chatStarted=true 但无 history → 直接开始问（理论上不会发生，但兜底）
    // 2) wecomAdded=true 且 chatStarted=false → 欢迎语 + 激活询问卡
    // 3) 尚未加企微（老链路兜底）→ 直接开始问（兼容原来从列表点进来但没走企微的情况）
    if (r && r.wecomAdded && !r.chatStarted) {
      this.phase = 'greeting'
      this.typing = true
      this.delay(900, () => {
        this.typing = false
        const pkgName = (r && r.name) || '您刚购买的健康管理服务包'
        this.push({
          role: 'ai',
          kind: 'text',
          text: '您好，我是您的专属健康管理师李静 👋。欢迎来到安康健康管理！我在服务后台已经看到您刚刚购买了「' + pkgName + '」，咱们正式开始之前，想先跟您确认一下是否现在就激活服务包、为您做首次健康评估？'
        })
      })
    } else {
      this.phase = 'asking'
      this.typing = true
      this.delay(800, () => {
        this.typing = false
        this.pushQuestion(0)
      })
    }
  },
  onUnload() {
    this.timers.forEach((t) => clearTimeout(t))
    this.timers = []
  },
  methods: {
    delay(ms, fn) {
      const t = setTimeout(fn, ms)
      this.timers.push(t)
      return t
    },
    uid() {
      return 'c_' + Date.now().toString(36) + Math.floor(Math.random() * 1000)
    },
    scrollBottom() {
      this.tick++
      this.$nextTick(() => {
        this.scrollInto = this.anchorId
      })
    },
    push(msg) {
      this.messages = this.messages.concat([Object.assign({ id: this.uid() }, msg)])
      this.save()
    },
    save() {
      if (!this.rightId) return
      this.$store.dispatch('saveChat', {
        rightId: this.rightId,
        data: {
          messages: this.messages,
          answers: this.answers,
          done: this.assessDone,
          activationSkipped: this.activationSkipped
        }
      })
    },
    toggleVoice() {
      this.voiceOn = !this.voiceOn
      uni.showToast({ title: this.voiceOn ? '语音播报已开启' : '语音播报已关闭', icon: 'none' })
    },
    // 用户在欢迎态点击"立即激活"：AI 响应一句确认 → 开始问卷
    confirmActivate() {
      if (this.phase !== 'greeting' && !(this.right && !this.right.chatStarted)) return
      this.phase = 'asking'
      this.activationSkipped = false
      this.save()
      this.typing = true
      this.delay(600, () => {
        this.typing = false
        this.push({
          role: 'ai',
          kind: 'text',
          text: '好的，为您立即激活服务包 🔓。接下来我会问您几个问题，来初步了解当前身体与生活方式的情况，方便后面生成更适合您的个性化健康方案——我们现在开始吧～'
        })
        this.delay(900, () => {
          this.pushQuestion(0)
        })
      })
    },
    // 稍后再说：AI 提示可随时开始 → 进入自由模式；底部会有二次引导卡
    skipActivation() {
      this.phase = 'done'
      this.activationSkipped = true
      this.save()
      this.typing = true
      this.delay(600, () => {
        this.typing = false
        this.push({
          role: 'ai',
          kind: 'text',
          text: '没问题，已经为您暂存服务包 🔖。您可以先随便逛逛，任何时候想开始评估了直接告诉我，或点击下方「立即激活服务包」就可以继续～'
        })
      })
    },
    pushQuestion(i) {
      this.step = i
      this.pickedIndex = -1
      this.push({ role: 'ai', kind: 'text', text: this.questions[i].text })
      this.awaiting = true
    },
    chooseOption(oi) {
      if (!this.awaiting) return
      const q = this.currentQuestion
      if (!q) return
      const o = q.options[oi]
      if (!o) return
      this.pickedIndex = oi
      this.awaiting = false
      this.answers = Object.assign({}, this.answers, { [q.id]: o.v })
      this.push({ role: 'user', kind: 'text', text: o.label })

      const next = this.step + 1
      if (next < this.questions.length) {
        this.typing = true
        this.delay(800, () => {
          this.typing = false
          this.pushQuestion(next)
        })
        return
      }
      this.typing = true
      this.delay(800, () => {
        this.typing = false
        this.push({ role: 'ai', kind: 'text', text: '感谢您的配合，5 个问题都已完成。我正在结合权威指南为您做危险分层与方案匹配，请稍等片刻。' })
        this.startGenerating()
      })
    },
    startGenerating() {
      this.phase = 'generating'
      this.genStep = 0
      this.runGenStage()
    },
    runGenStage() {
      this.delay(900, () => {
        if (this.genStep < this.genStages.length - 1) {
          this.genStep = this.genStep + 1
          this.runGenStage()
          return
        }
        this.finishGenerating()
      })
    },
    finishGenerating() {
      this.phase = 'done'
      const report = this.buildReport()
      this.push({ role: 'ai', kind: 'text', text: '方案已生成，下面是您的首次评估结论，请先看一下关键判断与目标值。' })
      this.push({ role: 'ai', kind: 'report', report: report })
      this.delay(700, () => {
        this.push({ role: 'ai', kind: 'text', text: '这是为您安排的第一天日程，按时间点执行即可，完成后我会陪您复盘。' })
        this.push({ role: 'ai', kind: 'timeline', items: this.firstDayItems() })
        this.assessDone = true
        if (this.rightId) {
          this.$store.dispatch('finishAssessment', { rightId: this.rightId, answers: this.answers })
        }
        this.save()
      })
    },
    firstDayItems() {
      const days = TIMELINE[this.pkgKey] || TIMELINE.hbp
      const items = days[0] || []
      return items.slice(0, 6)
    },
    buildReport() {
      return this.pkgKey === 'dm' ? this.buildDmReport() : this.buildHbpReport()
    },
    buildHbpReport() {
      const a = this.answers

      // 血压分级（《中国高血压防治指南 2024》）
      const g1 = a.bp_grade === 'grade1'
      const g2 = a.bp_grade === 'grade2'
      const g3 = a.bp_grade === 'grade3'
      const gUnknown = a.bp_grade === 'unknown'

      // 临床合并症与心血管危险因素
      const cvd = a.comorbidity === 'cvd'
      const dmCkd = a.comorbidity === 'dm_ckd'
      const riskFactor = a.comorbidity === 'risk_factor'

      // 用药依从性
      const badMed = a.medication === 'irregular' || a.medication === 'self_stop'
      const noMed = a.medication === 'none'

      // 生活方式（不参与危险分层，仅驱动干预建议）
      const heavySalt = a.salt_intake === 'high'
      const naiveSalt = a.salt_intake === 'unaware'
      const lowMove = a.exercise === 'none' || a.exercise === 'low'

      // 危险分层：血压分级 × 合并症/危险因素
      let tier = 1
      if (cvd) tier = 4
      else if (dmCkd) tier = g2 || g3 ? 4 : 3
      else if (g3) tier = riskFactor ? 4 : 3
      else if (g2) tier = riskFactor ? 3 : 2
      else if (g1) tier = riskFactor ? 2 : 1
      else tier = 0

      const RISK = {
        0: { risk: '待评估（需先完成血压分级）', color: '#64748b', bg: '#f2f7fa' },
        1: { risk: '低危（以生活方式干预为主）', color: '#6ba584', bg: '#e8f4ec' },
        2: { risk: '中危（生活方式干预 + 规范随访）', color: '#f2c94c', bg: '#fdf4ed' },
        3: { risk: '高危（需药物强化干预）', color: '#e07a5f', bg: '#fde8e3' },
        4: { risk: '很高危（需尽早达标并保护靶器官）', color: '#d14b3d', bg: '#fde8e3' }
      }

      const gradeLabel = g3 ? '3 级' : g2 ? '2 级' : g1 ? '1 级' : '分级待确认'
      const withLabel = cvd
        ? '伴临床合并症'
        : dmCkd
        ? '伴糖尿病/慢性肾病'
        : riskFactor
        ? '伴心血管危险因素'
        : '无合并症'

      const target =
        cvd || dmCkd
          ? '目标 <130/80 mmHg（合并症人群更严格），避免舒张压低于 60 mmHg'
          : g3
          ? '先在 2-4 周内降至 <140/90 mmHg，稳定后能耐受者进一步降至 <130/80 mmHg'
          : '一般目标 <140/90 mmHg，能耐受者可降至 <130/80 mmHg'

      const points = []

      // 1. 分级对应的首要动作
      if (g3) {
        points.push({
          title: '尽快就诊评估，勿自行调药',
          desc: '3 级高血压建议 1 周内到心内科或高血压门诊复评，多数需要两种及以上药物联合治疗；若出现头痛、胸痛、视物模糊、肢体无力请立即就医。'
        })
      } else if (gUnknown) {
        points.push({
          title: '先用 7 天家庭血压监测确定分级',
          desc: '连续 7 天、每天晨起服药前和睡前各测 2 次，取后 6 天平均值。分级明确后才能准确判断危险等级与用药强度。'
        })
      } else {
        points.push({
          title: '家庭血压监测（晨晚各一次）',
          desc: '晨起服药前与睡前静坐 5 分钟后测量，连续记录 7 天，用于判断达标情况与昼夜节律，比单次诊室血压更可靠。'
        })
      }

      // 2. 用药依从性
      if (noMed) {
        points.push({
          title: '尽快明确是否需要启动药物治疗',
          desc: g1 && !riskFactor && !dmCkd && !cvd
            ? '1 级且无合并症者可先强化生活方式 1-3 个月；若仍未达标，应在医生指导下启动降压药。'
            : '您的分层已达到药物治疗指征，建议尽早由医生评估后启动降压方案，不宜仅靠生活方式调整。'
        })
      } else if (badMed) {
        points.push({
          title: '规范用药，血压正常也不可停药',
          desc: '漏服与自行减停是血压波动和心脑事件的主要诱因。建议固定服药时间、使用分药盒或手机提醒，需调整方案时先与医生沟通。'
        })
      } else {
        points.push({
          title: '维持现有方案并记录药物反应',
          desc: '继续按医嘱服药，记录是否出现头晕、干咳、下肢水肿、心率过缓等反应，复诊时一并反馈供医生调整。'
        })
      }

      // 3. 合并症/危险因素管理
      if (cvd) {
        points.push({
          title: '兼顾靶器官保护与平稳降压',
          desc: '既有心脑血管病史者降压需平稳、避免过快过低。请遵医嘱坚持抗血小板与降脂治疗，并定期复查心功能、颈动脉与肾功能。'
        })
      } else if (dmCkd) {
        points.push({
          title: '同步管理血糖/肾功能',
          desc: '建议每 3-6 个月复查糖化血红蛋白、尿微量白蛋白与血肌酐；此类人群优选 ACEI/ARB 类降压药，具体由医生决定。'
        })
      } else if (riskFactor) {
        points.push({
          title: '控制可改变的心血管危险因素',
          desc: '戒烟并避免二手烟，复查血脂与尿酸并按医嘱干预。多重危险因素叠加会把总体风险抬升一个等级。'
        })
      } else if (heavySalt || naiveSalt) {
        points.push({
          title: '限盐减钠为首要生活方式干预',
          desc: '每日食盐控制在 5g 以内，使用限盐勺，减少腌制品、酱料与加工肉，同时增加新鲜蔬果与富钾食物。'
        })
      } else {
        points.push({
          title: '巩固低盐富钾的膳食结构',
          desc: '保持每日食盐 5g 以内，采用得舒（DASH）式膳食，增加深色蔬菜、低糖水果与全谷物比例。'
        })
      }

      // 4. 剩余的生活方式短板
      if ((heavySalt || naiveSalt) && (cvd || dmCkd || riskFactor)) {
        points.push({
          title: '每日食盐降至 5g 以内',
          desc: '限钠是降压效果最明确的生活方式措施，减少腌制品、酱料与加工肉，烹饪末期再放盐更易减量。'
        })
      } else if (lowMove) {
        points.push({
          title: '循序渐进达到每周 150 分钟',
          desc: '从每周 3 次、每次 20 分钟快走或太极拳起步，逐步达到每周 150 分钟中等强度有氧运动；血压未控制稳定前避免憋气式力量训练。'
        })
      } else {
        points.push({
          title: '保持运动与情绪管理节奏',
          desc: '维持每周 150 分钟以上中等强度有氧运动，配合呼吸放松训练缓解紧张，避免血压情绪性波动。'
        })
      }

      return {
        pkgName: (this.right && this.right.name) || '高血压健康管理',
        type: '高血压 ' + gradeLabel + ' · ' + withLabel,
        risk: RISK[tier].risk,
        riskColor: RISK[tier].color,
        riskBg: RISK[tier].bg,
        target: target,
        points: points.slice(0, 4),
        guide: '《中国高血压防治指南 2024》'
      }
    },
    buildDmReport() {
      const a = this.answers
      const highA1c = a.hba1c === 'r70_80' || a.hba1c === 'gt80'
      const highFpg = a.fpg === 'high'
      const bigStaple = a.staple === 'large' || a.staple === 'varies'
      const noMove = a.dm_exercise === 'rarely' || a.dm_exercise === 'never'
      const onInsulin = a.dm_med === 'insulin' || a.dm_med === 'both'
      const midHigh = highA1c || highFpg

      const points = []
      points.push({
        title: '建立血糖监测谱',
        desc: '每日空腹 + 餐后 2 小时配对监测，空腹目标 4.4-7.0 mmol/L，餐后 2 小时目标 <10.0 mmol/L。'
      })
      if (onInsulin) {
        points.push({
          title: '用药安全与低血糖防范',
          desc: '注射部位轮换，随身携带糖块；出现心慌出汗手抖立即检测并补糖，记录发生时间供医生调整剂量。'
        })
      } else if (a.dm_med === 'none') {
        points.push({
          title: '强化生活方式并评估是否需起始药物',
          desc: '先以饮食运动干预 3 个月观察 HbA1c 变化，若仍未达标需及时就诊评估起始降糖药物。'
        })
      } else {
        points.push({
          title: '规范口服降糖药',
          desc: '二甲双胍建议随餐服用以减轻胃肠反应，不可因血糖一时下降自行停药。'
        })
      }
      if (bigStaple) {
        points.push({
          title: '控制主食总量与进餐顺序',
          desc: '每餐主食约一小碗（生重 50-75g），一半换成杂粮；先吃蔬菜与蛋白质再吃主食，压平餐后血糖峰。'
        })
      } else {
        points.push({
          title: '优化碳水质量',
          desc: '维持定量主食，优选低 GI 杂粮，搭配足量蔬菜与优质蛋白，避免含糖饮料与精制点心。'
        })
      }
      if (noMove) {
        points.push({
          title: '把握餐后降糖黄金窗',
          desc: '餐后 30-60 分钟进行 20-30 分钟快走，每周再加 2 次抗阻训练，提升肌肉葡萄糖摄取能力。'
        })
      } else {
        points.push({
          title: '维持餐后运动并增加抗阻训练',
          desc: '保持餐后步行习惯，每周 2 次弹力带或静蹲训练，改善胰岛素敏感性。'
        })
      }

      return {
        pkgName: (this.right && this.right.name) || '糖尿病健康管理',
        type: midHigh ? '2 型糖尿病 · 血糖未达标型' : '2 型糖尿病 · 血糖基本达标型',
        risk: midHigh ? '中高危（需强化控糖）' : '低中危（以维持达标为主）',
        riskColor: midHigh ? '#e07a5f' : '#6ba584',
        riskBg: midHigh ? '#fde8e3' : '#e8f4ec',
        target: midHigh
          ? 'HbA1c 目标 <7.0%，空腹血糖 4.4-7.0 mmol/L，先争取 3 个月内下降 1%'
          : '维持 HbA1c <7.0%，空腹 4.4-7.0 mmol/L，餐后 2 小时 <10.0 mmol/L',
        points: points.slice(0, 4),
        guide: '《中国 2 型糖尿病防治指南 2024》'
      }
    },
    send() {
      if (!this.canSend) return
      const text = this.draft.trim()
      this.draft = ''
      this.push({ role: 'user', kind: 'text', text: text })
      this.typing = true
      this.delay(800, () => {
        this.typing = false
        this.push({ role: 'ai', kind: 'text', text: this.replyOf(text) })
      })
    },
    replyOf(text) {
      if (text.indexOf('血压') >= 0) {
        return '家庭自测血压建议晨起服药前和睡前各测一次，静坐 5 分钟、上臂与心脏同高，连续记录 7 天取平均值更可靠。一般目标为 <140/90 mmHg，能耐受者可进一步降到 <130/80 mmHg；若连续 3 天超过 160/100 mmHg 或伴头痛胸闷，请尽快就诊。'
      }
      if (text.indexOf('血糖') >= 0) {
        return '控糖建议做「配对监测」：同一餐的餐前与餐后 2 小时各测一次，比较升幅。空腹目标 4.4-7.0 mmol/L，餐后 2 小时 <10.0 mmol/L，HbA1c 目标 <7.0%。若出现心慌、出汗、手抖等低血糖表现，请立即检测并补充 15g 葡萄糖。'
      }
      if (text.indexOf('饮食') >= 0 || text.indexOf('吃') >= 0) {
        return '饮食上推荐得舒（DASH）式结构：每日食盐 <5g，多用蒸煮炖替代煎炸，主食一半换成杂粮，每天 500g 蔬菜与 200g 低糖水果，优质蛋白选鱼禽蛋奶豆。进餐顺序建议先菜、再蛋白质、最后主食，这样餐后血压与血糖波动都会更平缓。'
      }
      if (text.indexOf('运动') >= 0) {
        return '运动处方建议每周累计 150 分钟中等强度有氧（快走、太极拳、游泳、骑行），分 5 次完成，运动时能说话但略微气喘即可；再加每周 2 次抗阻训练。避免清晨血压高峰时段剧烈运动，运动前后各留 5 分钟热身与拉伸。'
      }
      if (text.indexOf('用药') >= 0 || text.indexOf('吃药') >= 0 || text.indexOf('药') >= 0) {
        return '用药请遵循三个原则：固定时间服用、不自行加减停、记录不良反应。血压或血糖降到正常是药物在起效，并不代表可以停药。若出现干咳、下肢水肿、明显乏力或反复低血糖，请记录时间和表现，复诊时告知医生调整方案。'
      }
      if (text.indexOf('睡眠') >= 0 || text.indexOf('失眠') >= 0) {
        return '睡眠不足会升高交感张力，让次日血压和空腹血糖同时升高。建议固定起床时间、睡前 1 小时离开手机、卧室保持安静微暗，配合 4-4-6 呼吸法放松。如长期打鼾伴呼吸暂停、白天嗜睡，建议做睡眠呼吸监测排查。'
      }
      return '这个问题我记下了。您可以把具体情况说得更细一些，比如最近的测量数值、症状出现的时间和持续时长、正在服用的药物名称，我会结合权威指南给出更针对性的建议。涉及诊断和处方调整的部分，我会同步给医师团队为您复核。'
    },
    onMic() {
      if (!this.freeMode) {
        uni.showToast({ title: '请先点击选项完成问询', icon: 'none' })
        return
      }
      uni.showToast({ title: '按住说话（演示）', icon: 'none' })
    },
    goPlan() {
      uni.reLaunch({ url: '/pages/index/index' })
    }
  }
}
</script>

<style lang="scss" scoped>
.chat {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: $bg-page-base;
}

.chat__voice {
  width: $size-avatar-sm;
  height: $size-avatar-sm;
  border-radius: 50%;
  background: $brand-soft;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat__voice-icon {
  font-size: $font-size-md;
  color: $icon-ink;
}

.chat__head {
  background: $bg-surface;
  padding: $space-1 $space-3 $space-3;
  display: flex;
  align-items: center;
  box-shadow: $shadow-sm;
  z-index: 20;
}

.chat__head-avatar {
  width: $size-avatar-sm;
  height: $size-avatar-sm;
  border-radius: 50%;
  background: linear-gradient(140deg, $brand-primary 0%, $brand-primary-active 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat__head-emoji {
  font-size: $size-icon-xs;
  color: $text-inverse;
}

.chat__head-main {
  flex: 1;
  padding-left: $space-2;
}

.chat__head-name {
  display: block;
  font-size: $font-size-md;
  font-weight: 700;
  color: $text-primary;
  letter-spacing: 1rpx;
}

.chat__head-state {
  display: flex;
  align-items: center;
  margin-top: $space-1;
}

.chat__dot-live {
  width: $size-badge-sm;
  height: $size-badge-sm;
  border-radius: 50%;
  background: $success;
  margin-right: $space-1;
  animation: live 1.6s ease-in-out infinite;
}

@keyframes live {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.45;
    transform: scale(0.7);
  }
}

.chat__head-status {
  font-size: $font-size-2xs;
  color: $text-muted;
}

.chat__scroll {
  flex: 1;
  height: 0;
}

.chat__list {
  padding: $space-3 $space-3 $space-2;
}

.chat__notice {
  text-align: center;
  padding: 0 $space-5 $space-3;
}

.chat__notice-t {
  font-size: $font-size-2xs;
  color: $text-disabled;
  background: $bg-subtle;
  padding: $space-1 $space-2;
  border-radius: $radius-full;
  line-height: $line-height-relaxed;
}

.chat__anchor {
  height: $space-1;
}

.msg {
  display: flex;
  align-items: flex-start;
  margin-bottom: $space-3;
}

.msg--user {
  justify-content: flex-end;
}

.msg__avatar {
  width: $size-avatar-sm;
  height: $size-avatar-sm;
  border-radius: 50%;
  background: linear-gradient(140deg, $brand-primary 0%, $brand-primary-active 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: $shadow-sm;
}

.msg__avatar-t {
  font-size: $font-size-md;
  color: $text-inverse;
}

.msg__body {
  max-width: 78%;
  padding-left: $space-2;
}

.msg--user .msg__body {
  padding-left: 0;
}

.bubble {
  padding: $space-3;
  border-radius: $radius-xs $radius-card-child $radius-card-child $radius-card-child;
}

.bubble--ai {
  background: $bg-surface;
  box-shadow: $shadow-sm;
}

.bubble--user {
  background: $brand-primary;
  border-radius: $radius-card-child $radius-xs $radius-card-child $radius-card-child;
}

.bubble__t {
  font-size: $font-size-sm;
  line-height: $line-height-relaxed;
}

.bubble__t--ai {
  color: $text-primary;
}

.bubble__t--user {
  color: $text-inverse;
}

.typing {
  display: flex;
  align-items: center;
  padding: $space-3;
}

.typing__dot {
  width: $size-badge-sm;
  height: $size-badge-sm;
  border-radius: 50%;
  background: $text-hint;
  margin-right: $space-1;
  animation: bounce 1.2s ease-in-out infinite;
}

.typing__dot:last-child {
  margin-right: 0;
}

.typing__dot--2 {
  animation-delay: 0.18s;
}

.typing__dot--3 {
  animation-delay: 0.36s;
}

@keyframes bounce {
  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.45;
  }
  30% {
    transform: translateY(-10rpx);
    opacity: 1;
  }
}

.gen {
  background: $bg-surface;
  border-radius: $radius-xs $radius-card-child $radius-card-child $radius-card-child;
  box-shadow: $shadow-sm;
  padding: $space-3;
  width: $size-page-max-width * 0.48;
}

.gen__head {
  display: flex;
  align-items: center;
  margin-bottom: $space-2;
}

.gen__ring {
  width: $size-icon-xs;
  height: $size-icon-xs;
  border-radius: 50%;
  border: 2rpx solid $brand-soft;
  border-top-color: $brand-primary-active;
  margin-right: $space-2;
  animation: spin 0.9s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.gen__title {
  font-size: $font-size-sm;
  font-weight: 700;
  color: $text-primary;
}

.gen__step {
  display: flex;
  align-items: center;
  margin-bottom: $space-1;
}

.gen__step-mark {
  width: $size-icon-xs;
  font-size: $font-size-2xs;
  color: $text-hint;
  text-align: center;
}

.gen__step-mark--on {
  color: $brand-primary-active;
}

.gen__step-t {
  font-size: $font-size-xs;
  color: $text-disabled;
}

.gen__step-t--on {
  color: $text-secondary;
  font-weight: 600;
}

.gen__bar {
  height: $space-1;
  border-radius: $radius-full;
  background: $bg-section;
  margin-top: $space-2;
  overflow: hidden;
}

.gen__bar-in {
  height: 100%;
  border-radius: $radius-full;
  background: linear-gradient(90deg, $brand-primary 0%, $brand-primary-active 100%);
  transition: width 0.6s ease;
}

.report {
  background: $bg-surface;
  border-radius: $radius-xs $radius-card-child $radius-card-child $radius-card-child;
  box-shadow: $shadow-md;
  padding: $space-3;
  width: $size-page-max-width * 0.54;
}

.report__head {
  display: flex;
  align-items: center;
  padding-bottom: $space-2;
}

.report__icon {
  font-size: $size-icon-sm;
  margin-right: $space-2;
  color: $icon-ink;
}

.report__head-main {
  flex: 1;
}

.report__title {
  display: block;
  font-size: $font-size-md;
  font-weight: 700;
  color: $text-primary;
}

.report__sub {
  display: block;
  font-size: $font-size-2xs;
  color: $text-muted;
  margin-top: $space-1;
}

.report__row {
  display: flex;
  align-items: flex-start;
  margin-bottom: $space-2;
}

.report__label {
  width: $size-avatar-lg;
  font-size: $font-size-xs;
  color: $text-disabled;
  flex-shrink: 0;
  line-height: $line-height-relaxed;
}

.report__value {
  flex: 1;
  font-size: $font-size-xs;
  color: $text-primary;
  font-weight: 600;
  line-height: $line-height-relaxed;
}

.report__risk {
  font-size: $font-size-2xs;
  font-weight: 700;
  padding: $space-1 $space-2;
  border-radius: $radius-full;
}

.report__line {
  height: 1rpx;
  background: $bg-section;
  margin: $space-1 0 $space-2;
}

.report__focus-title {
  display: block;
  font-size: $font-size-xs;
  font-weight: 700;
  color: $brand-primary-active;
  margin-bottom: $space-2;
}

.report__point {
  display: flex;
  align-items: flex-start;
  margin-bottom: $space-2;
}

.report__point-idx {
  width: $size-icon-xs;
  height: $size-icon-xs;
  border-radius: 50%;
  background: $brand-soft;
  color: $brand-primary-active;
  font-size: $font-size-2xs;
  font-weight: 700;
  text-align: center;
  line-height: $size-icon-xs;
  flex-shrink: 0;
  margin-right: $space-2;
}

.report__point-main {
  flex: 1;
}

.report__point-t {
  display: block;
  font-size: $font-size-xs;
  font-weight: 600;
  color: $text-primary;
}

.report__point-d {
  display: block;
  font-size: $font-size-2xs;
  color: $text-muted;
  line-height: $line-height-relaxed;
  margin-top: $space-1;
}

.report__ref {
  display: block;
  font-size: $font-size-2xs;
  color: $text-disabled;
  margin-top: $space-1;
}

.plan {
  background: $bg-subtle;
  border-radius: $radius-xs $radius-card-child $radius-card-child $radius-card-child;
  padding: $space-3 $space-2 $space-1;
  width: $size-page-max-width * 0.58;
}

.plan__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 0 $space-1 $space-2;
}

.plan__title {
  font-size: $font-size-sm;
  font-weight: 700;
  color: $text-primary;
}

.plan__count {
  font-size: $font-size-2xs;
  color: $text-muted;
}

.opts {
  padding: $space-1 0 $space-1 $space-10;
}

.opts__hint {
  display: block;
  font-size: $font-size-2xs;
  color: $text-disabled;
  margin-bottom: $space-2;
}

.opts__item {
  background: $bg-surface;
  border: 1rpx solid $brand-soft;
  border-radius: $radius-full;
  padding: $space-2 $space-3;
  margin-bottom: $space-2;
  box-shadow: $shadow-sm;
}

.opts__item--on {
  background: $brand-primary;
  border-color: $brand-primary-active;
}

.opts__t {
  font-size: $font-size-sm;
  color: $brand-primary-active;
  font-weight: 600;
}

.opts__t--on {
  color: $text-inverse;
}

.cta {
  margin: $space-2 0 $space-1 $space-10;
  background: $brand-primary;
  border-radius: $radius-full;
  padding: $space-3 0;
  text-align: center;
  box-shadow: $shadow-md;
}

.cta__t {
  color: $text-inverse;
  font-size: $font-size-sm;
  font-weight: 700;
  letter-spacing: 1rpx;
}

.bar {
  background: $bg-surface;
  box-shadow: $shadow-lg;
}

.bar__inner {
  display: flex;
  align-items: center;
  padding: $space-2 $space-3;
}

.bar__input {
  flex: 1;
  height: $size-avatar-sm;
  background: $bg-subtle;
  border-radius: $radius-full;
  padding: 0 $space-3;
  font-size: $font-size-sm;
  color: $text-primary;
}

.bar__input--off {
  background: $bg-section;
  color: $text-disabled;
}

.bar__ph {
  color: $text-disabled;
  font-size: $font-size-xs;
}

.bar__mic {
  width: $size-avatar-sm;
  height: $size-avatar-sm;
  border-radius: 50%;
  background: $bg-subtle;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: $space-2;
  flex-shrink: 0;
}

.bar__mic-t {
  font-size: $font-size-md;
  color: $icon-ink;
}

.bar__send {
  background: $brand-primary;
  border-radius: $radius-full;
  padding: $space-2 $space-4;
  margin-left: $space-2;
  flex-shrink: 0;
}

.bar__send--off {
  background: $text-hint;
}

.bar__send-t {
  color: $text-inverse;
  font-size: $font-size-xs;
  font-weight: 700;
}

.bar__safe {
  height: env(safe-area-inset-bottom);
}

/* 服务包激活引导卡 */
.activate {
  margin: $space-4 $space-4 $space-2;
  padding: $space-4;
  background: $bg-surface;
  border-radius: $radius-card-child;
  box-shadow: $shadow-md;
  border: 1rpx solid $border-subtle;
}

.activate--lite {
  margin-top: $space-2;
  padding: $space-3;
  box-shadow: none;
  background: $brand-soft;
  border-color: transparent;
  display: flex;
  align-items: center;
  gap: $space-3;
}

.activate--lite .activate__t {
  flex: 1;
  margin: 0;
  font-size: $font-size-xs;
}

.activate__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: $space-2;
}

.activate__badge {
  font-size: $font-size-2xs;
  font-weight: $font-weight-semibold;
  color: $brand-primary-active;
  background: $brand-soft;
  padding: $space-1 $space-2;
  border-radius: $radius-full;
}

.activate__status {
  font-size: $font-size-2xs;
  color: $text-secondary;
}

.activate__t {
  display: block;
  font-size: $font-size-md;
  font-weight: $font-weight-bold;
  color: $text-primary;
  margin-bottom: $space-2;
}

.activate__d {
  display: block;
  font-size: $font-size-xs;
  color: $text-muted;
  line-height: $line-height-relaxed;
  margin-bottom: $space-4;
}

.activate__row {
  display: flex;
  gap: $space-2;
}

.activate__btn {
  flex: 1;
  padding: $space-3 0;
  border-radius: $radius-full;
  background: $brand-primary;
  text-align: center;
  box-shadow: $shadow-sm;
}

.activate__btn--sm {
  flex: 0 0 auto;
  padding: $space-2 $space-4;
  margin-left: auto;
}

.activate__btn--ghost {
  background: transparent;
  border: 1rpx solid $text-hint;
  box-shadow: none;
}

.activate__btn-t {
  color: $text-inverse;
  font-size: $font-size-sm;
  font-weight: $font-weight-bold;
}

.activate__btn-t--ghost {
  color: $text-secondary;
}
</style>
