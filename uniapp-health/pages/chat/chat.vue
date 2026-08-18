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
        <text class="chat__head-name">安康 · AI健康助手</text>
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

        <view v-if="awaiting && currentQuestion" class="opts">
          <text class="opts__hint">请选择最接近您情况的一项</text>
          <view
            v-for="(o, oi) in currentQuestion.options"
            :key="oi"
            class="opts__item"
            :class="{ 'opts__item--on': pickedIndex === oi }"
            @tap="chooseOption(oi)"
          >
            <text class="opts__t" :class="{ 'opts__t--on': pickedIndex === oi }">{{ o }}</text>
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
      this.scrollBottom()
      return
    }
    this.phase = 'asking'
    this.typing = true
    this.delay(800, () => {
      this.typing = false
      this.pushQuestion(0)
    })
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
        data: { messages: this.messages, answers: this.answers, done: this.assessDone }
      })
    },
    toggleVoice() {
      this.voiceOn = !this.voiceOn
      uni.showToast({ title: this.voiceOn ? '语音播报已开启' : '语音播报已关闭', icon: 'none' })
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
      const text = q.options[oi]
      this.pickedIndex = oi
      this.awaiting = false
      this.answers = Object.assign({}, this.answers, { [q.id]: text })
      this.push({ role: 'user', kind: 'text', text: text })

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
      const highBp = a.bp_range === '较高 (>140/90)'
      const heavySalt = a.salt_intake === '口味偏重 (>10g/天)'
      const badMed = a.medication === '没有服药' || a.medication === '偶尔服用' || a.medication === '记不清了'
      const lowMove = a.exercise === '从不运动' || a.exercise === '每周1-2次'
      const badSleep = a.sleep === '经常失眠' || a.sleep === '严重睡眠问题'
      const midHigh = highBp && heavySalt

      const points = []
      if (badMed) {
        points.push({
          title: '规范用药，避免自行停药',
          desc: '降压治疗需长期坚持。请与医生确认方案后固定时间服药，血压下降也不可自行减停。'
        })
      } else {
        points.push({
          title: '维持现有用药并记录反应',
          desc: '继续按医嘱服药，记录是否出现头晕、干咳、下肢水肿等情况，复诊时反馈给医生。'
        })
      }
      points.push({
        title: '家庭血压监测（晨晚各一次）',
        desc: '晨起服药前与睡前静坐 5 分钟后测量，连续记录 7 天，用于判断达标情况和昼夜节律。'
      })
      if (heavySalt || a.salt_intake === '不太注意') {
        points.push({
          title: '限盐减钠为首要生活方式干预',
          desc: '每日食盐控制在 5g 以内，使用限盐勺，减少腌制品、酱料与加工肉，同时增加新鲜蔬果摄入。'
        })
      } else {
        points.push({
          title: '巩固低盐饮食结构',
          desc: '保持每日食盐 5g 以内，增加钾丰富的蔬菜水果，采用得舒（DASH）式膳食模式。'
        })
      }
      if (lowMove) {
        points.push({
          title: '循序渐进增加有氧运动',
          desc: '从每周 3 次、每次 20 分钟快走或太极拳起步，逐步达到每周 150 分钟中等强度运动。'
        })
      } else if (badSleep) {
        points.push({
          title: '改善睡眠以稳定血压节律',
          desc: '固定作息、睡前 1 小时远离手机，配合呼吸放松训练；若长期打鼾憋气，建议筛查睡眠呼吸暂停。'
        })
      } else {
        points.push({
          title: '保持运动与情绪管理节奏',
          desc: '每周累计 150 分钟中等强度有氧运动，配合正念呼吸缓解紧张，避免血压情绪性波动。'
        })
      }

      return {
        pkgName: (this.right && this.right.name) || '高血压健康管理',
        type: midHigh ? '高血压 · 生活方式高危型' : '高血压 · 生活方式可控型',
        risk: midHigh ? '中高危（需强化干预）' : '低中危（以生活方式干预为主）',
        riskColor: midHigh ? '#e07a5f' : '#6ba584',
        riskBg: midHigh ? '#fde8e3' : '#e8f4ec',
        target: midHigh
          ? '先降至 <140/90 mmHg，能耐受者进一步降至 <130/80 mmHg'
          : '血压稳定维持 <140/90 mmHg，可耐受者争取 <130/80 mmHg',
        points: points.slice(0, 4),
        guide: '《中国高血压防治指南 2024》'
      }
    },
    buildDmReport() {
      const a = this.answers
      const highA1c = a.hba1c === '7.0-8.0%' || a.hba1c === '>8% 或未测'
      const highFpg = a.fpg === '较高 (>7.0)'
      const bigStaple = a.staple === '一大碗以上' || a.staple === '不固定'
      const noMove = a.dm_exercise === '基本不动' || a.dm_exercise === '饭后就躺'
      const onInsulin = a.dm_med === '注射胰岛素' || a.dm_med === '两者都有'
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
      } else if (a.dm_med === '暂未用药') {
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
</style>
