<template>
  <view class="hm-page">
    <view class="top">
      <hm-navbar title="用户协议" bg-color="transparent" />
      <view class="top__body">
        <text class="top__t">用户协议与隐私政策</text>
        <text class="top__d">生效日期：2026-01-01 · 版本 v1.0</text>
      </view>
    </view>

    <view class="tabs">
      <view v-for="t in tabs" :key="t.key" class="tab" :class="{ 'tab--on': tab === t.key }" @tap="tab = t.key">
        <text class="tab__t" :class="{ 'tab__t--on': tab === t.key }">{{ t.label }}</text>
      </view>
    </view>

    <view class="hm-card warn">
      <text class="warn__icon">⚠️</text>
      <view class="warn__main">
        <text class="warn__t">重要提示</text>
        <text class="warn__d">本平台提供健康管理与生活方式干预服务，不属于医疗诊疗行为，不能替代医院就诊、检查与医师处方。出现急症表现请立即就近急诊或拨打 120。</text>
      </view>
    </view>

    <view class="hm-card doc">
      <view v-for="(s, i) in current" :key="i" class="art">
        <text class="art__t">{{ s.title }}</text>
        <text v-for="(p, j) in s.paras" :key="j" class="art__p">{{ p }}</text>
      </view>
    </view>

    <view class="foot">
      <text class="foot__t">如对本协议有疑问，可在健康对话中留言，或联系客服获取书面说明。</text>
    </view>
    <view class="hm-safe-bottom"></view>
  </view>
</template>

<script>
const TERMS = [
  {
    title: '一、服务内容与定位',
    paras: [
      '1.1 安康健康管理（以下称"本平台"）为用户提供慢性病健康管理服务，包括健康风险评估、每日健康指导时间线、AI 健康助手对话、健康管理师随访与阶段性康复评估等。',
      '1.2 本平台服务属于健康管理与生活方式干预，不构成医疗诊断、治疗建议或处方行为。平台生成的评估结论、分层结果与方案内容，均为健康管理参考，不能替代执业医师的面诊判断。',
      '1.3 平台方案参考《中国高血压防治指南（2024 年修订版）》《中国 2 型糖尿病防治指南（2024 年版）》等权威文献编制，但指南适用需结合个体实际情况，最终医疗决策应由用户与其主治医师共同作出。'
    ]
  },
  {
    title: '二、用户责任与承诺',
    paras: [
      '2.1 用户应如实提供年龄、身高体重、用药情况、检查数值等健康信息。信息失真可能导致评估结论与方案建议偏差，由此产生的后果由用户自行承担。',
      '2.2 用户不得擅自根据平台内容自行停药、减药、换药或调整剂量。任何用药变更均须经处方医师确认。',
      '2.3 服务期内出现以下情形应立即停止依据平台建议行动并及时就医：胸痛胸闷持续不缓解、意识障碍、言语不清、单侧肢体无力、剧烈头痛伴呕吐、血压持续 ≥180/110 mmHg、血糖 ≥16.7 mmol/L 或出现低血糖昏迷倾向。',
      '2.4 用户账号仅供本人使用，不得转让、出借或用于商业用途。'
    ]
  },
  {
    title: '三、服务期限与购买规则',
    paras: [
      '3.1 服务期自开通之日起连续计算，按所购服务包标注时长（如 3 个月）执行，中途暂停不延长服务期。',
      '3.2 服务包为虚拟服务商品，开通并完成首次问询后不支持无理由退款。未开始使用（未完成首次问询）且购买后 7 日内，可申请全额退款。',
      '3.3 服务到期后，历史评估报告与对话记录仍可查阅，但不再推送每日健康指导，不再提供管理师随访。',
      '3.4 促销活动价格、划线价仅作为参考标示，实际以下单页面显示的应付金额为准。'
    ]
  },
  {
    title: '四、知识产权',
    paras: [
      '4.1 平台内的方案模板、时间线内容、评估算法、界面设计与文案，著作权归平台方所有。',
      '4.2 用户可将个人的评估报告与方案用于自身健康管理及向医师展示，但不得批量复制、转售或用于任何商业化用途。'
    ]
  },
  {
    title: '五、免责条款',
    paras: [
      '5.1 因用户提供信息不真实、未遵循医嘱、擅自变更用药等原因造成的健康损害，本平台不承担责任。',
      '5.2 因网络中断、设备故障、第三方服务不可用等非本平台可控因素导致的服务暂时中断，本平台将尽力恢复，但不承担由此产生的间接损失。',
      '5.3 在法律允许的最大范围内，本平台的赔偿责任上限不超过用户为相应服务包实际支付的费用。'
    ]
  },
  {
    title: '六、协议变更与争议解决',
    paras: [
      '6.1 本平台可根据法律法规与业务调整变更本协议，变更后将在应用内公示。用户继续使用服务视为接受变更。',
      '6.2 本协议适用中华人民共和国法律。双方争议应先协商解决，协商不成的，提交平台方所在地有管辖权的人民法院裁判。'
    ]
  }
]

const PRIVACY = [
  {
    title: '一、我们收集哪些信息',
    paras: [
      '1.1 账号信息：手机号、昵称/姓名、头像标识。',
      '1.2 健康档案信息：性别、年龄、身高、体重、所在城市。',
      '1.3 健康管理信息：问卷答案（用药情况、血压/血糖区间、饮食口味、运动与睡眠习惯等）、评估报告、对话记录、打卡与依从性记录。',
      '1.4 交易信息：订单号、服务包名称、支付金额、支付时间、支付渠道结果。',
      '1.5 我们不会收集您的病历原件、影像资料、基因数据，也不会索取与服务无关的设备通讯录、相册全量权限。'
    ]
  },
  {
    title: '二、我们如何使用这些信息',
    paras: [
      '2.1 生成个性化健康风险分层与每日健康指导时间线。',
      '2.2 供您的专属健康管理师与医师团队进行方案审核与随访。',
      '2.3 完成订单交易、开通服务权益与售后处理。',
      '2.4 在完全去标识化、无法回溯到个人的前提下，用于服务质量统计与方案有效性分析。'
    ]
  },
  {
    title: '三、信息的存储与保护',
    paras: [
      '3.1 健康信息在传输过程中采用加密通道，存储时对身份标识字段进行脱敏处理。',
      '3.2 健康档案与对话记录默认保存至服务到期后 24 个月，用于连续性管理与追溯；超期后进行匿名化处理或删除。',
      '3.3 仅经过授权的健康管理师、医师与必要的运维人员可在最小必要范围内访问您的健康信息，访问行为留有审计日志。'
    ]
  },
  {
    title: '四、信息共享与对外提供',
    paras: [
      '4.1 我们不会向任何第三方出售您的健康信息。',
      '4.2 仅在以下情形下共享：您明确同意（如授权医师查看）；为完成支付而向支付机构提供必要交易信息；法律法规要求或司法/行政机关依法调取。',
      '4.3 企业微信仅用于健康管理师与您的沟通触达，沟通内容同样受本政策约束。'
    ]
  },
  {
    title: '五、您的权利',
    paras: [
      '5.1 查阅与更正：您可在「我的 - 个人资料」中随时查看与修改健康档案信息。',
      '5.2 删除与注销：您可申请删除健康档案或注销账号。注销后相关健康信息将被删除或匿名化，且不可恢复。',
      '5.3 撤回同意：您可撤回对健康信息处理的同意，但这将导致无法继续提供个性化管理服务。',
      '5.4 演示说明：本演示版本的全部数据仅保存在您的本机存储中，不上传至任何服务器，可在「我的 - 清空演示数据」中一键清除。'
    ]
  },
  {
    title: '六、未成年人与联系我们',
    paras: [
      '6.1 本服务面向成年慢性病人群，不向未满 18 周岁的未成年人提供。',
      '6.2 如对隐私政策有疑问、投诉或需要行使上述权利，可通过应用内客服入口联系我们，我们将在 15 个工作日内答复。'
    ]
  }
]

export default {
  data() {
    return {
      tab: 'terms',
      tabs: [
        { key: 'terms', label: '用户协议' },
        { key: 'privacy', label: '隐私政策' }
      ]
    }
  },
  computed: {
    current() {
      return this.tab === 'terms' ? TERMS : PRIVACY
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

.warn {
  display: flex;
  padding: $space-3;
  margin: $space-3 $space-4 0;
  background: $warm-soft;
}

.warn__icon {
  font-size: $size-icon-xs;
  margin-right: $space-2;
}

.warn__main {
  flex: 1;
}

.warn__t {
  display: block;
  font-size: $font-size-sm;
  font-weight: $font-weight-heavy;
  line-height: $line-height-tight;
  color: $text-primary;
}

.warn__d {
  display: block;
  margin-top: $space-1;
  font-size: $font-size-xs;
  color: $text-muted;
  line-height: $line-height-relaxed;
}

.doc {
  padding: $space-4;
  margin: $space-data-list-gap $space-4 0;
}

.art {
  margin-bottom: $space-4;
}

.art:last-child {
  margin-bottom: 0;
}

.art__t {
  display: block;
  font-size: $font-size-lg;
  font-weight: $font-weight-heavy;
  line-height: $line-height-tight;
  color: $text-primary;
  margin-bottom: $space-2;
  letter-spacing: 1rpx;
}

.art__p {
  display: block;
  font-size: $font-size-xs;
  color: $text-secondary;
  line-height: $line-height-relaxed;
  margin-bottom: $space-2;
}

.art__p:last-child {
  margin-bottom: 0;
}

.foot {
  padding: $space-5 $space-6 $space-1;
  text-align: center;
}

.foot__t {
  font-size: $font-size-2xs;
  color: $text-disabled;
  line-height: $line-height-relaxed;
}
</style>
