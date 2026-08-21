const IMG = 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt='

function img(prompt, size = 'landscape_4_3') {
  return IMG + encodeURIComponent(prompt) + '&image_size=' + size
}

export const PACKAGES = [
  {
    id: 'hbp3m',
    key: 'hbp',
    name: '高血压调理计划',
    duration: '3个月',
    subtitle: '三甲医师团队 + AI 助手 24h 陪伴式控压',
    price: 699,
    originPrice: 1299,
    tagline: '中国高血压防治指南 2024 标准',
    accent: '#389a82',
    accentSoft: '#d4f5ee',
    icon: 'fa-solid fa-stethoscope',
    sold: 2847,
    rating: '4.9',
    heroImg: img('医疗健康服务电商详情页主图，微笑的中年亚洲男性在明亮家中客厅使用上臂式电子血压计测量血压，桌上有新鲜蔬果与温水，青绿色与暖白配色，晨光柔和，专业温暖的医疗关怀氛围，干净留白，高级商业摄影，浅景深'),
    tags: ['24h AI 陪伴', '医师团队审核', '指南级危险分层', '按天时间线'],
    highlights: [
      { icon: 'fa-solid fa-dna', title: '指南级危险分层', desc: '依据《中国高血压防治指南2024》表8，25题精准评估低危/中危/高危/很高危' },
      { icon: 'fa-solid fa-calendar-days', title: '每日时间线方案', desc: '监测/用药/营养/运动/心理/睡眠 六维日程，到点提醒不遗漏' },
      { icon: 'fa-solid fa-pills', title: '六大类用药答疑', desc: '地平、普利、沙坦、利尿剂、洛尔、复方制剂副作用与应对全覆盖' },
      { icon: 'fa-solid fa-arrow-trend-up', title: '双周方案迭代', desc: '晚间7问采集依从性数据，方案随身体反馈动态调整' }
    ],
    services: [
      { name: '健康小助手对话', spec: '不限次数', unit: '次' },
      { name: '初次分型评估报告', spec: '1 份（7段式）', unit: '份' },
      { name: '每日健康时间线', spec: '90 天', unit: '天' },
      { name: '医师团队方案审核', spec: '每月 1 次', unit: '次' },
      { name: '用药副作用答疑', spec: '不限次数', unit: '次' },
      { name: '阶段性康复评估', spec: '每 14 天 1 次', unit: '次' }
    ],
    detailSections: [
      {
        title: '谁适合这个计划',
        img: img('亚洲三甲医院心内科医生团队白大褂形象，正在与患者视频问诊，屏幕显示血压曲线图表，明亮现代诊室，青绿色调，专业可信，商业摄影'),
        points: [
          '已确诊高血压，正在服药但血压波动大',
          '血压 130-139/85-89 mmHg，处于正常高值需干预',
          '服药后出现干咳、脚踝水肿等副作用不知如何处理',
          '想系统了解低盐饮食、运动处方但缺少可执行方案'
        ]
      },
      {
        title: '每天为你安排什么',
        img: img('低盐健康餐俯拍，燕麦粥、水煮蛋、凉拌菠菜、清蒸鲈鱼、西兰花、糙米饭摆盘，浅木质桌面，限盐勺特写，清爽自然光，健康饮食摄影，高级质感'),
        points: [
          '07:00 晨起血压监测 · 静坐5分钟后测量',
          '07:30 降压药提醒 · 不可自行停药',
          '08:00 低盐早餐建议 · 全天盐分 <5g',
          '10:00 太极/八段锦 · 中等强度有氧30分钟',
          '20:30 晚间7问评估 · 采集依从性与身体感受',
          '22:00 睡前正念冥想 · 改善睡眠质量'
        ]
      }
    ],
    faq: [
      { q: '这个服务能代替医院就诊吗？', a: '不能。本服务是健康管理与生活方式干预，不做诊断和处方。药物调整必须由您的主治医师决定，我们会协助您整理数据便于医生判断。' },
      { q: '需要每天花多久时间？', a: '核心动作每天约 10 分钟：早晚各测一次血压 + 晚间 7 问打卡。运动和饮食融入日常生活，不额外占用时间。' },
      { q: '3个月后没效果怎么办？', a: '服务期内每 14 天做一次阶段评估，若连续两次评估无改善，医师团队会免费重制方案，并延长 1 个月服务期。' }
    ]
  },
  {
    id: 'dm3m',
    key: 'dm',
    name: '高血糖调理计划',
    duration: '3个月',
    subtitle: '控糖曲线可视化 + 营养师定制配餐',
    price: 899,
    originPrice: 1599,
    tagline: '中国2型糖尿病防治指南 2024 标准',
    accent: '#4ab89e',
    accentSoft: '#d8f8fa',
    icon: 'fa-solid fa-droplet',
    sold: 1936,
    rating: '4.8',
    heroImg: img('医疗健康服务电商详情页主图，中年亚洲女性在家中用血糖仪测指尖血糖，旁边有全谷物食品和绿叶蔬菜，蓝绿色与暖白配色，柔和自然光，专业温暖的医疗关怀氛围，干净留白，高级商业摄影'),
    tags: ['血糖曲线分析', '营养师配餐', 'GI/GL 双控', '并发症筛查提醒'],
    highlights: [
      { icon: 'fa-solid fa-arrow-trend-down', title: '七点血糖谱解读', desc: '空腹/三餐后2h/睡前/夜间，识别黎明现象与餐后高峰' },
      { icon: 'fa-solid fa-leaf', title: '低GI 配餐方案', desc: '注册营养师按您的口味与三餐习惯定制，主食替换有具体克数' },
      { icon: 'fa-solid fa-person-running', title: '餐后运动窗口', desc: '餐后30-60分钟黄金降糖窗，给到具体运动类型与强度' },
      { icon: 'fa-solid fa-magnifying-glass', title: '并发症筛查日历', desc: '眼底、尿微量白蛋白、足部、糖化血红蛋白 到期自动提醒' }
    ],
    services: [
      { name: '健康小助手对话', spec: '不限次数', unit: '次' },
      { name: '控糖基线评估报告', spec: '1 份', unit: '份' },
      { name: '每日控糖时间线', spec: '90 天', unit: '天' },
      { name: '营养师定制配餐', spec: '每 2 周更新', unit: '次' },
      { name: '血糖曲线分析', spec: '每周 1 次', unit: '次' },
      { name: '并发症筛查提醒', spec: '全周期', unit: '项' }
    ],
    detailSections: [
      {
        title: '谁适合这个计划',
        img: img('血糖管理概念图，血糖仪、连续血糖监测贴片、记录本上的血糖曲线图表，浅色桌面俯拍，蓝绿色调，简洁专业，医疗产品摄影'),
        points: [
          '空腹血糖 6.1-7.0 mmol/L 的糖前期人群',
          '已确诊 2 型糖尿病，糖化血红蛋白未达标',
          '血糖忽高忽低，不知道是饮食还是用药问题',
          '想减重同时稳住血糖，需要专业配餐方案'
        ]
      },
      {
        title: '每天为你安排什么',
        img: img('低升糖指数健康餐俯拍，藜麦、荞麦面、鸡胸肉、牛油果、蓝莓、绿叶菜摆盘，浅色餐具，清爽自然光，控糖饮食摄影，高级质感'),
        points: [
          '06:50 空腹血糖监测 · 记录并识别黎明现象',
          '07:30 二甲双胍等口服药提醒',
          '08:00 低GI 早餐 · 蛋白质先行、主食定量',
          '10:00 餐后2h 血糖测量 · 对比餐前增幅',
          '19:30 餐后快走 · 黄金降糖窗 30 分钟',
          '21:30 睡前血糖 + 低血糖预警自检'
        ]
      }
    ],
    faq: [
      { q: '需要买连续血糖仪吗？', a: '不强制。指尖血糖仪即可开始，若您已有 CGM 设备，可以在对话中直接上报曲线，我们会做更精细的分析。' },
      { q: '配餐要严格照着吃吗？', a: '配餐给的是"可替换清单"而非固定菜谱，会按您的口味偏好和当地食材给 2-3 个等效替换方案，执行门槛低。' },
      { q: '可以和高血压计划一起买吗？', a: '可以。糖尿病合并高血压很常见，两个计划的时间线会自动合并去重，用药提醒也会做相互作用提示。' }
    ]
  }
]

export const TIMELINE = {
  hbp: {
    0: [
      { time: '07:00', cat: 'monitor', title: '晨起血压监测', desc: '晨起静坐5分钟后测量血压，记录数值', tag: '每日监测', icon: 'fa-solid fa-stethoscope' },
      { time: '07:30', cat: 'medication', title: '降压药物服用', desc: '按时服用医生开具的降压药，不可自行停药', tag: '用药提醒', icon: 'fa-solid fa-pills' },
      { time: '08:00', cat: 'nutrition', title: '营养早餐建议', desc: '燕麦粥+水煮蛋+凉拌菠菜，控制盐分<2g', tag: '饮食管理', icon: 'fa-solid fa-bowl-food' },
      { time: '10:00', cat: 'exercise', title: '太极拳练习', desc: '24式简化太极拳，在舒缓音乐中练习30分钟', tag: '运动处方', icon: 'fa-solid fa-spa' },
      { time: '12:30', cat: 'nutrition', title: '低盐午餐', desc: '糙米饭+清蒸鲈鱼+西兰花，使用限盐勺', tag: '饮食管理', icon: 'fa-solid fa-leaf' },
      { time: '15:00', cat: 'psychology', title: '正念呼吸练习', desc: '吸气4秒-屏息4秒-呼气6秒，循环5分钟', tag: '心理调适', icon: 'fa-solid fa-seedling' },
      { time: '18:00', cat: 'exercise', title: '快走运动', desc: '傍晚凉爽时段快走30分钟，步速适中', tag: '运动处方', icon: 'fa-solid fa-person-walking' },
      { time: '19:00', cat: 'nutrition', title: '清淡晚餐', desc: '杂粮饭+番茄豆腐汤+炒时蔬，少油少盐', tag: '饮食管理', icon: 'fa-solid fa-utensils' },
      { time: '20:30', cat: 'assessment', title: '康复情况评估', desc: '记录今日血压值、身体感受和情绪状态', tag: '康复评估', icon: 'fa-solid fa-clipboard-list' },
      { time: '22:00', cat: 'sleep', title: '睡前正念冥想', desc: '10分钟睡前引导冥想，帮助身心放松入眠', tag: '睡眠管理', icon: 'fa-solid fa-moon' }
    ],
    1: [
      { time: '07:00', cat: 'monitor', title: '晨起血压监测', desc: '晨起静坐5分钟后测量血压，记录数值', tag: '每日监测', icon: 'fa-solid fa-stethoscope' },
      { time: '07:30', cat: 'medication', title: '降压药物服用', desc: '按时服用降压药，注意药物副作用', tag: '用药提醒', icon: 'fa-solid fa-pills' },
      { time: '08:00', cat: 'nutrition', title: '营养早餐', desc: '全麦面包+无糖豆浆+水煮蛋，健康开启新一天', tag: '饮食管理', icon: 'fa-solid fa-bread-slice' },
      { time: '09:30', cat: 'exercise', title: '八段锦练习', desc: '传统养生功法八段锦全套，强身健体', tag: '运动处方', icon: 'fa-solid fa-spa' },
      { time: '12:30', cat: 'nutrition', title: '午餐营养搭配', desc: '杂粮饭+番茄牛腩+清炒芦笋，营养均衡', tag: '饮食管理', icon: 'fa-solid fa-bowl-food' },
      { time: '14:30', cat: 'psychology', title: '渐进式肌肉放松', desc: '从头到脚逐段绷紧再放松，释放身心压力', tag: '心理调适', icon: 'fa-solid fa-seedling' },
      { time: '17:30', cat: 'exercise', title: '游泳或散步', desc: '30分钟中等强度有氧运动，避免血压高峰', tag: '运动处方', icon: 'fa-solid fa-person-swimming' },
      { time: '19:00', cat: 'nutrition', title: '低盐晚餐', desc: '紫薯+冬瓜汤+白灼菜心，清淡易消化', tag: '饮食管理', icon: 'fa-solid fa-utensils' },
      { time: '20:00', cat: 'monitor', title: '晚间血压监测', desc: '睡前1小时测量血压，记录并对比早间数值', tag: '每日监测', icon: 'fa-solid fa-stethoscope' },
      { time: '21:00', cat: 'assessment', title: '每日康复评估', desc: '总结当日身体状况，记录血压和情绪变化', tag: '康复评估', icon: 'fa-solid fa-clipboard-list' },
      { time: '22:00', cat: 'sleep', title: '助眠冥想', desc: '15分钟深度放松冥想，改善睡眠质量', tag: '睡眠管理', icon: 'fa-solid fa-moon' }
    ],
    2: [
      { time: '07:00', cat: 'monitor', title: '晨起血压监测', desc: '晨起静坐5分钟后测量血压，连续监测对比', tag: '每日监测', icon: 'fa-solid fa-stethoscope' },
      { time: '07:30', cat: 'medication', title: '降压药物服用', desc: '按时服药，如有不适及时记录', tag: '用药提醒', icon: 'fa-solid fa-pills' },
      { time: '08:00', cat: 'nutrition', title: '营养早餐', desc: '小米南瓜粥+蒸蛋+凉拌苦瓜，清爽开胃', tag: '饮食管理', icon: 'fa-solid fa-mug-hot' },
      { time: '10:00', cat: 'exercise', title: '慢跑或快走', desc: '公园慢跑30分钟，感受清晨新鲜空气', tag: '运动处方', icon: 'fa-solid fa-person-running' },
      { time: '12:30', cat: 'nutrition', title: '营养午餐', desc: '糙米饭+清蒸带鱼+蒜蓉西兰花，低油低盐', tag: '饮食管理', icon: 'fa-solid fa-utensils' },
      { time: '15:00', cat: 'psychology', title: '正念冥想练习', desc: '引导式正念冥想10分钟，提升觉察力', tag: '心理调适', icon: 'fa-solid fa-spa' },
      { time: '18:00', cat: 'exercise', title: '舒缓瑜伽', desc: '基础瑜伽30分钟，拉伸筋骨，平静心绪', tag: '运动处方', icon: 'fa-solid fa-spa' },
      { time: '19:00', cat: 'nutrition', title: '健康晚餐', desc: '藜麦沙拉+鸡胸肉蔬菜卷，营养低脂', tag: '饮食管理', icon: 'fa-solid fa-leaf' },
      { time: '20:30', cat: 'assessment', title: '阶段性康复评估', desc: '三日总结评估，对比前后变化，调整方案', tag: '康复评估', icon: 'fa-solid fa-chart-column' },
      { time: '22:00', cat: 'sleep', title: '睡前放松冥想', desc: '引导式入眠冥想，帮助快速入睡', tag: '睡眠管理', icon: 'fa-solid fa-moon' }
    ]
  },
  dm: {
    0: [
      { time: '06:50', cat: 'monitor', title: '空腹血糖监测', desc: '起床后未进食测量，识别是否存在黎明现象', tag: '每日监测', icon: 'fa-solid fa-droplet' },
      { time: '07:30', cat: 'medication', title: '口服降糖药提醒', desc: '二甲双胍随餐服用可减轻胃肠道反应', tag: '用药提醒', icon: 'fa-solid fa-pills' },
      { time: '08:00', cat: 'nutrition', title: '低GI 早餐', desc: '蛋白质先行：鸡蛋+无糖豆浆+荞麦馒头半个', tag: '饮食管理', icon: 'fa-solid fa-bowl-food' },
      { time: '10:00', cat: 'monitor', title: '餐后2h 血糖', desc: '与餐前对比，增幅超过 3.0 mmol/L 需调整主食量', tag: '每日监测', icon: 'fa-solid fa-arrow-trend-up' },
      { time: '12:30', cat: 'nutrition', title: '控糖午餐', desc: '杂粮饭 100g+清蒸鱼+两份绿叶菜，先菜后饭', tag: '饮食管理', icon: 'fa-solid fa-leaf' },
      { time: '13:30', cat: 'exercise', title: '餐后快走', desc: '餐后30分钟快走 20 分钟，压平餐后血糖峰', tag: '运动处方', icon: 'fa-solid fa-person-walking' },
      { time: '16:00', cat: 'psychology', title: '压力管理练习', desc: '皮质醇升高会拉高血糖，做5分钟呼吸放松', tag: '心理调适', icon: 'fa-solid fa-seedling' },
      { time: '19:00', cat: 'nutrition', title: '控糖晚餐', desc: '主食减半，增加优质蛋白与膳食纤维', tag: '饮食管理', icon: 'fa-solid fa-utensils' },
      { time: '19:30', cat: 'exercise', title: '黄金降糖窗运动', desc: '餐后30-60分钟中等强度运动30分钟', tag: '运动处方', icon: 'fa-solid fa-person-running' },
      { time: '21:00', cat: 'assessment', title: '控糖情况评估', desc: '汇总今日血糖谱、饮食与运动完成度', tag: '康复评估', icon: 'fa-solid fa-clipboard-list' },
      { time: '21:30', cat: 'sleep', title: '睡前血糖与低血糖自检', desc: '睡前血糖<5.6 需加餐，预防夜间低血糖', tag: '睡眠管理', icon: 'fa-solid fa-moon' }
    ],
    1: [
      { time: '06:50', cat: 'monitor', title: '空腹血糖监测', desc: '连续记录第2天，观察空腹血糖趋势', tag: '每日监测', icon: 'fa-solid fa-droplet' },
      { time: '07:30', cat: 'medication', title: '降糖药提醒', desc: '按医嘱服药，如有低血糖症状及时记录', tag: '用药提醒', icon: 'fa-solid fa-pills' },
      { time: '08:00', cat: 'nutrition', title: '低GI 早餐', desc: '燕麦（非速溶）+鸡蛋+一小把坚果', tag: '饮食管理', icon: 'fa-solid fa-bread-slice' },
      { time: '09:30', cat: 'exercise', title: '抗阻训练', desc: '弹力带上肢+靠墙静蹲，提升肌肉葡萄糖摄取', tag: '运动处方', icon: 'fa-solid fa-dumbbell' },
      { time: '12:30', cat: 'nutrition', title: '控糖午餐', desc: '藜麦饭+鸡胸肉+凉拌木耳，控制精制碳水', tag: '饮食管理', icon: 'fa-solid fa-bowl-food' },
      { time: '14:30', cat: 'monitor', title: '餐后2h 血糖', desc: '目标 <10.0 mmol/L，理想 <7.8', tag: '每日监测', icon: 'fa-solid fa-arrow-trend-up' },
      { time: '17:30', cat: 'exercise', title: '有氧运动', desc: '游泳或骑行30分钟，随身携带糖块', tag: '运动处方', icon: 'fa-solid fa-person-swimming' },
      { time: '19:00', cat: 'nutrition', title: '控糖晚餐', desc: '冬瓜虾仁+杂粮饭80g+白灼菜心', tag: '饮食管理', icon: 'fa-solid fa-utensils' },
      { time: '21:00', cat: 'assessment', title: '每日控糖评估', desc: '记录血糖波动、饮食偏差与身体感受', tag: '康复评估', icon: 'fa-solid fa-clipboard-list' },
      { time: '22:00', cat: 'sleep', title: '助眠放松', desc: '睡眠不足会显著升高次日空腹血糖', tag: '睡眠管理', icon: 'fa-solid fa-moon' }
    ],
    2: [
      { time: '06:50', cat: 'monitor', title: '空腹血糖监测', desc: '第3天数据，形成初步血糖谱', tag: '每日监测', icon: 'fa-solid fa-droplet' },
      { time: '07:30', cat: 'medication', title: '降糖药提醒', desc: '注意用药与进餐时间的配合', tag: '用药提醒', icon: 'fa-solid fa-pills' },
      { time: '08:00', cat: 'nutrition', title: '低GI 早餐', desc: '全麦吐司+牛油果+煎蛋，优质脂肪延缓吸收', tag: '饮食管理', icon: 'fa-solid fa-mug-hot' },
      { time: '10:00', cat: 'exercise', title: '快走或慢跑', desc: '中等强度30分钟，心率控制在最大心率60-70%', tag: '运动处方', icon: 'fa-solid fa-person-running' },
      { time: '12:30', cat: 'nutrition', title: '控糖午餐', desc: '荞麦面+瘦牛肉+菠菜，先喝汤再吃菜后吃面', tag: '饮食管理', icon: 'fa-solid fa-utensils' },
      { time: '15:00', cat: 'psychology', title: '正念减压', desc: '10分钟正念冥想，稳定情绪与血糖', tag: '心理调适', icon: 'fa-solid fa-spa' },
      { time: '18:00', cat: 'exercise', title: '舒缓拉伸', desc: '瑜伽拉伸30分钟，改善外周血液循环', tag: '运动处方', icon: 'fa-solid fa-spa' },
      { time: '19:00', cat: 'nutrition', title: '控糖晚餐', desc: '蒸南瓜（替代主食）+清蒸鲈鱼+芦笋', tag: '饮食管理', icon: 'fa-solid fa-leaf' },
      { time: '20:30', cat: 'assessment', title: '三日血糖谱分析', desc: '汇总三日七点血糖，识别高峰时段并调整方案', tag: '康复评估', icon: 'fa-solid fa-chart-column' },
      { time: '22:00', cat: 'sleep', title: '睡前冥想', desc: '引导式入眠冥想，保障 7 小时睡眠', tag: '睡眠管理', icon: 'fa-solid fa-moon' }
    ]
  }
}

export const CAT_META = {
  monitor: { label: '监测', color: '#389a82', bg: '#d4f5ee' },
  medication: { label: '用药', color: '#f15533', bg: '#fdf4ed' },
  nutrition: { label: '营养', color: '#27ae60', bg: '#ddf7ed' },
  exercise: { label: '运动', color: '#4ab89e', bg: '#d8f8fa' },
  psychology: { label: '心理', color: '#8dcdd8', bg: '#e2f2f6' },
  sleep: { label: '睡眠', color: '#64748b', bg: '#f2f7fa' },
  assessment: { label: '评估', color: '#f2c94c', bg: '#fdf4ed' }
}

// ===== 评估判定与日程生成 =====
// 说明：日程必须由问卷评估结论驱动，并标注指南依据。
// 这里做成纯函数，供对话页、首页时间线、消息中心三处共用，
// 避免同一用户在不同入口看到互相矛盾的日程。

var GUIDE_HBP = '《中国高血压防治指南 2024》'
var GUIDE_DM = '《中国 2 型糖尿病防治指南 2024》'
// 新合并的营养与生活方式管理指南
var GUIDE_NUTRI = '《居民膳食营养与健康管理指南》'

// 供界面文案引用，避免指南名称在多处硬编码
export function guideName(pkgKey) {
  return pkgKey === 'dm' ? GUIDE_DM : GUIDE_HBP
}

// 合并知识引擎的指南引用（时间线basis字段按类目选择合适的指南）
export function basisForCat(cat) {
  if (cat === 'nutrition' || cat === 'diet' || cat === 'tea') return GUIDE_NUTRI
  if (cat === 'medication' || cat === 'monitor' || cat === 'assessment') return GUIDE_HBP
  return GUIDE_NUTRI
}

// 高血压评估判定
export function hbpFlags(answers) {
  var a = answers || {}

  // 血压分级
  var g1 = a.bp_grade === 'grade1'
  var g2 = a.bp_grade === 'grade2'
  var g3 = a.bp_grade === 'grade3'
  var gUnknown = a.bp_grade === 'unknown'

  // 临床合并症与心血管危险因素
  var cvd = a.comorbidity === 'cvd'
  var dmCkd = a.comorbidity === 'dm_ckd'
  var riskFactor = a.comorbidity === 'risk_factor'

  // 用药依从性
  var badMed = a.medication === 'irregular' || a.medication === 'self_stop'
  var noMed = a.medication === 'none'

  // 生活方式（不参与危险分层，仅驱动干预建议）
  var heavySalt = a.salt_intake === 'high'
  var naiveSalt = a.salt_intake === 'unaware'
  var lowMove = a.exercise === 'none' || a.exercise === 'low'
  var highMove = a.exercise === 'high'

  // 危险分层：血压分级 × 合并症/危险因素
  var tier = 1
  if (cvd) tier = 4
  else if (dmCkd) tier = g2 || g3 ? 4 : 3
  else if (g3) tier = riskFactor ? 4 : 3
  else if (g2) tier = riskFactor ? 3 : 2
  else if (g1) tier = riskFactor ? 2 : 1
  else tier = 0

  return {
    g1: g1,
    g2: g2,
    g3: g3,
    gUnknown: gUnknown,
    cvd: cvd,
    dmCkd: dmCkd,
    riskFactor: riskFactor,
    badMed: badMed,
    noMed: noMed,
    heavySalt: heavySalt,
    naiveSalt: naiveSalt,
    lowMove: lowMove,
    highMove: highMove,
    tier: tier,
    gradeLabel: g3 ? '3 级' : g2 ? '2 级' : g1 ? '1 级' : '分级待确认',
    withLabel: cvd
      ? '伴临床合并症'
      : dmCkd
      ? '伴糖尿病/慢性肾病'
      : riskFactor
      ? '伴心血管危险因素'
      : '无合并症'
  }
}

// 糖尿病评估判定
export function dmFlags(answers) {
  var a = answers || {}
  var highA1c = a.hba1c === 'r70_80' || a.hba1c === 'gt80'
  var veryHighA1c = a.hba1c === 'gt80'
  var highFpg = a.fpg === 'high'
  var unknownFpg = a.fpg === 'unknown'
  var bigStaple = a.staple === 'large' || a.staple === 'varies'
  var noMove = a.dm_exercise === 'rarely' || a.dm_exercise === 'never'
  var onInsulin = a.dm_med === 'insulin' || a.dm_med === 'both'
  var noMed = a.dm_med === 'none'
  return {
    highA1c: highA1c,
    veryHighA1c: veryHighA1c,
    highFpg: highFpg,
    unknownFpg: unknownFpg,
    bigStaple: bigStaple,
    noMove: noMove,
    onInsulin: onInsulin,
    noMed: noMed,
    midHigh: highA1c || highFpg
  }
}

// 判断运动条目是否属于中高强度：极高危未达标者需要回避
var HIGH_INTENSITY = ['慢跑', '游泳', '快走', '有氧运动', '抗阻训练', '黄金降糖窗']

function isHighIntensity(title) {
  for (var i = 0; i < HIGH_INTENSITY.length; i++) {
    if (title.indexOf(HIGH_INTENSITY[i]) >= 0) return true
  }
  return false
}

function baseDay(pkgKey, dayIndex) {
  var days = TIMELINE[pkgKey] || TIMELINE.hbp
  return days[dayIndex] || days[0] || []
}

// 条目副本 + 覆盖字段，避免污染 TIMELINE 源对象
function withBasis(item, basis, patch) {
  return Object.assign({}, item, patch || {}, { basis: basis })
}

// 高血压：按评估结论改写当天日程
function planHbp(items, f) {
  var out = []
  for (var i = 0; i < items.length; i++) {
    var it = items[i]

    if (it.cat === 'monitor') {
      out.push(
        withBasis(
          it,
          GUIDE_HBP + '推荐家庭血压监测：晨起排尿后、服药前，静坐 5 分钟再测' +
            (f.gUnknown ? '；分级待确认者需连续 7 天早晚各测以建立基线' : ''),
          f.gUnknown
            ? { desc: '连续 7 天早晚各测一次并记录，用于确认您的血压分级' }
            : null
        )
      )
      continue
    }

    if (it.cat === 'medication') {
      // 未用药者不能直接给服药提醒，应先就诊评估是否启动药物
      if (f.noMed) {
        out.push({
          time: it.time,
          cat: 'assessment',
          title: '就诊评估是否启动降压药',
          desc: '带上近 7 天血压记录到全科或心内科门诊，由医生判断是否需要起始药物治疗',
          basis:
            GUIDE_HBP +
            '：2 级及以上高血压、或伴心血管危险因素与合并症者，应在生活方式干预同时启动药物治疗',
          icon: 'fa-solid fa-user-doctor'
        })
      } else if (f.badMed) {
        out.push(
          withBasis(
            it,
            GUIDE_HBP + '强调长期规律服药：自行停药或漏服会导致血压反弹，显著增加心脑血管事件风险',
            { desc: '按医嘱服药，血压降至正常也不可自行减量或停药；漏服请如实记录' }
          )
        )
      } else {
        out.push(withBasis(it, GUIDE_HBP + '推荐优先使用长效制剂，固定时间服药以平稳控制 24 小时血压'))
      }
      continue
    }

    if (it.cat === 'nutrition') {
      out.push(
        withBasis(
          it,
          GUIDE_HBP + '推荐限盐：每日食盐 <5g（钠 <2000mg），并增加富钾蔬果摄入；' + GUIDE_NUTRI + '建议食物多样、谷薯为主，多吃蔬果奶类豆类',
          f.heavySalt
            ? { desc: it.desc + '；使用限盐勺定量，避免腌制品与加工肉', goods: recommendGoodsForCat('nutrition') }
            : f.naiveSalt
            ? { desc: it.desc + '；先学会看包装钠含量，把隐形盐找出来', goods: recommendGoodsForCat('nutrition') }
            : { goods: recommendGoodsForCat('nutrition') }
        )
      )
      continue
    }

    if (it.cat === 'exercise') {
      // 极高危且血压未达标：回避中高强度运动
      if (f.tier >= 4 && isHighIntensity(it.title)) {
        out.push({
          time: it.time,
          cat: 'exercise',
          title: '低强度舒缓活动',
          desc: '室内散步或站式八段锦 15-20 分钟，全程可正常说话即为合适强度',
          basis:
            GUIDE_HBP +
            '：极高危或血压未控制到 <160/100 mmHg 前，应暂缓中高强度运动，先以低强度活动过渡',
          icon: 'fa-solid fa-spa'
        })
      } else if (f.lowMove) {
        out.push(
          withBasis(
            it,
            GUIDE_HBP + '推荐每周 5-7 天、每次 30 分钟中等强度有氧运动；久坐者应循序渐进',
            { desc: '从 10 分钟起步，每周增加 5 分钟，逐步过渡到 30 分钟' }
          )
        )
      } else {
        out.push(
          withBasis(it, GUIDE_HBP + '推荐每周 5-7 天、每次 30 分钟中等强度有氧运动，并配合柔韧性练习')
        )
      }
      continue
    }

    if (it.cat === 'psychology') {
      out.push(withBasis(it, GUIDE_HBP + '将心理压力列为血压影响因素，推荐通过呼吸放松等方式进行压力管理'))
      continue
    }

    if (it.cat === 'sleep') {
      out.push(withBasis(it, GUIDE_HBP + '提示睡眠不足与睡眠呼吸暂停可致血压升高，应保证 7-8 小时规律睡眠'))
      continue
    }

    if (it.cat === 'assessment') {
      out.push(withBasis(it, GUIDE_HBP + '推荐记录血压与症状变化，作为医生调整方案的依据'))
      continue
    }

    out.push(withBasis(it, GUIDE_HBP + '综合管理建议'))
  }

  // 危险分层高者插入就诊安排
  if (f.tier >= 3 && !f.noMed) {
    out.push({
      time: '09:00',
      cat: 'assessment',
      title: f.tier >= 4 ? '尽快预约心内科就诊' : '两周内安排复诊评估',
      desc:
        f.tier >= 4
          ? '您属于极高危分层，建议 1 周内就诊，携带血压记录评估靶器官损害与用药方案'
          : '您属于高危分层，建议 2 周内复诊，复查血压与相关指标',
      basis:
        GUIDE_HBP +
        '：' +
        (f.tier >= 4 ? '极高危患者应立即启动药物治疗并短期内随访' : '高危患者应尽早药物治疗并密切随访'),
      icon: 'fa-solid fa-user-doctor',
      pinned: true
    })
  }

  // 高危及以上补测晚间血压，掌握全天波动
  if (f.tier >= 3) {
    var hasEvening = false
    for (var j = 0; j < out.length; j++) {
      if (out[j].cat === 'monitor' && out[j].time >= '18:00') hasEvening = true
    }
    if (!hasEvening) {
      out.push({
        time: '20:00',
        cat: 'monitor',
        title: '晚间血压监测',
        desc: '晚饭后静坐 5 分钟测量，与晨起数值对比，观察全天波动',
        basis: GUIDE_HBP + '推荐家庭血压早晚各测一次，用于评估血压变异与夜间控制情况',
        icon: 'fa-solid fa-stethoscope',
        pinned: true
      })
    }
  }

  return out
}

// 糖尿病：按评估结论改写当天日程
function planDm(items, f) {
  var out = []
  for (var i = 0; i < items.length; i++) {
    var it = items[i]

    if (it.cat === 'monitor') {
      // 依据按监测时点区分：空腹条目讲空腹目标，餐后条目讲餐后目标，
      // 否则会出现「餐后 2h 血糖」下方挂空腹目标的错配
      var isPost = it.title.indexOf('餐后') >= 0
      var mBasis = isPost
        ? GUIDE_DM + '推荐餐后 2 小时血糖 <10.0 mmol/L，与餐前配对监测可评估该餐主食量是否合适'
        : GUIDE_DM + '推荐空腹血糖控制目标 4.4-7.0 mmol/L，晨起未进食状态下测量'
      out.push(
        withBasis(
          it,
          mBasis,
          f.unknownFpg && !isPost && it.time < '08:00'
            ? { desc: '连续 3 天测空腹血糖并记录，先把基线水平摸清楚' }
            : null
        )
      )
      continue
    }

    if (it.cat === 'medication') {
      if (f.noMed) {
        out.push({
          time: it.time,
          cat: 'assessment',
          title: '就诊评估是否起始降糖药',
          desc: '带上血糖记录与最近一次 HbA1c 结果就诊，由医生判断是否需要药物治疗',
          basis:
            GUIDE_DM +
            '：生活方式干预 3 个月后 HbA1c 仍未达标（一般 <7.0%）者，应及时起始降糖药物治疗',
          icon: 'fa-solid fa-user-doctor'
        })
      } else if (f.onInsulin) {
        out.push(
          withBasis(
            it,
            GUIDE_DM + '强调胰岛素治疗者的低血糖防范：注射部位轮换，随身备糖，出现心慌出汗立即检测',
            {
              title: '胰岛素注射提醒',
              desc: '按医嘱注射并轮换注射部位，随身携带糖块以备低血糖',
              icon: 'fa-solid fa-syringe'
            }
          )
        )
      } else {
        out.push(withBasis(it, GUIDE_DM + '推荐二甲双胍作为首选口服降糖药，随餐服用以减轻胃肠道反应'))
      }
      continue
    }

    if (it.cat === 'nutrition') {
      out.push(
        withBasis(
          it,
          GUIDE_DM + '医学营养治疗：主食定量、优选低 GI 食物，先吃蔬菜与蛋白质再吃主食；' + GUIDE_NUTRI + '建议食物多样、谷薯为主，多吃蔬果奶类豆类',
          f.bigStaple
            ? { desc: it.desc + '；主食按生重 50-75g 定量，一半换成杂粮', goods: recommendGoodsForCat('nutrition') }
            : { goods: recommendGoodsForCat('nutrition') }
        )
      )
      continue
    }

    if (it.cat === 'exercise') {
      if (f.noMove) {
        out.push(
          withBasis(
            it,
            GUIDE_DM + '推荐每周至少 150 分钟中等强度有氧运动，并每周 2-3 次抗阻训练；久坐者循序渐进',
            { desc: '从餐后 10 分钟慢走起步，每周递增，逐步达到 30 分钟' }
          )
        )
      } else if (f.veryHighA1c) {
        out.push(
          withBasis(
            it,
            GUIDE_DM + '提示血糖显著升高时应谨慎运动：血糖 >16.7 mmol/L 或有酮症时暂缓运动',
            { desc: it.desc + '；运动前后各测一次血糖，异常升高时改为静息拉伸' }
          )
        )
      } else {
        out.push(
          withBasis(it, GUIDE_DM + '推荐每周至少 150 分钟中等强度有氧运动，配合每周 2-3 次抗阻训练')
        )
      }
      continue
    }

    if (it.cat === 'psychology') {
      out.push(withBasis(it, GUIDE_DM + '将心理压力列为血糖波动因素，推荐纳入常规压力管理'))
      continue
    }

    if (it.cat === 'sleep') {
      out.push(
        withBasis(
          it,
          GUIDE_DM + '提示夜间低血糖风险：睡前血糖 <5.6 mmol/L 建议适量加餐',
          f.onInsulin ? { desc: it.desc + '；胰岛素治疗者尤需重视睡前自检' } : null
        )
      )
      continue
    }

    if (it.cat === 'assessment') {
      out.push(withBasis(it, GUIDE_DM + '推荐记录血糖谱与饮食运动完成度，作为方案调整依据'))
      continue
    }

    out.push(withBasis(it, GUIDE_DM + '综合管理建议'))
  }

  // 血糖未达标者补充餐后配对监测
  if (f.midHigh) {
    var hasPost = false
    for (var j = 0; j < out.length; j++) {
      if (out[j].cat === 'monitor' && out[j].title.indexOf('餐后') >= 0) hasPost = true
    }
    if (!hasPost) {
      out.push({
        time: '14:30',
        cat: 'monitor',
        title: '午餐后 2 小时血糖',
        desc: '与餐前对比，增幅超过 3.0 mmol/L 说明主食量偏多',
        basis: GUIDE_DM + '：血糖未达标者应增加监测频率，通过配对监测定位升糖餐次',
        icon: 'fa-solid fa-arrow-trend-up',
        pinned: true
      })
    }
  }

  return out
}

// 裁剪优先级：越靠前越应保留（就诊、用药、监测优先）
var CAT_PRIORITY = ['assessment', 'medication', 'monitor', 'nutrition', 'exercise', 'psychology', 'sleep']

// 按类目轮转裁剪：每轮每个类目最多取 1 条。
// 不用「按类目穷尽」，否则营养类会占满名额、把运动等类目整体挤掉，
// 导致日程与评估报告里的运动处方自相矛盾。
function trimPlan(items, limit) {
  if (!limit || items.length <= limit) return items
  var keep = []
  var used = []
  var i = 0

  // 评估结论追加的条目（如极高危就诊安排、晚间血压监测）必须保留
  for (i = 0; i < items.length && keep.length < limit; i++) {
    if (items[i].pinned) {
      used.push(i)
      keep.push(items[i])
    }
  }

  var round = 0
  while (keep.length < limit && round < items.length) {
    var picked = false
    for (var p = 0; p < CAT_PRIORITY.length && keep.length < limit; p++) {
      for (i = 0; i < items.length; i++) {
        if (items[i].cat !== CAT_PRIORITY[p] || used.indexOf(i) >= 0) continue
        used.push(i)
        keep.push(items[i])
        picked = true
        break
      }
    }
    if (!picked) break
    round = round + 1
  }
  return keep
}

/**
 * 根据计划类目推荐商城健康产品
 * @param {String} cat 计划类目 (nutrition/diet/tea/medication/sleep/exercise)
 * @returns {Array} 商城商品数组
 */
export function recommendGoodsForCat(cat) {
  var map = {
    nutrition: [
      { id: 'g3', name: '低盐调味礼盒', price: 89, img: '/static/img/mall/g3.jpg' },
      { id: 'g6', name: '智能恒温杯', price: 159, img: '/static/img/mall/g6.jpg' }
    ],
    diet: [
      { id: 'g3', name: '低盐调味礼盒', price: 89, img: '/static/img/mall/g3.jpg' },
      { id: 'g6', name: '智能恒温杯', price: 159, img: '/static/img/mall/g6.jpg' }
    ],
    tea: [
      { id: 'g6', name: '智能恒温杯', price: 159, img: '/static/img/mall/g6.jpg' }
    ],
    medication: [
      { id: 'g8', name: '一周分装药盒', price: 29, img: '/static/img/mall/g8.jpg' }
    ],
    sleep: [
      { id: 'g4', name: '助眠香薰精油', price: 69, img: '/static/img/mall/g4.jpg' }
    ],
    exercise: [
      { id: 'g7', name: '弹力带训练套装', price: 39, img: '/static/img/mall/g7.jpg' }
    ],
    monitor: [
      { id: 'g1', name: '上臂式电子血压计', price: 299, img: '/static/img/mall/g1.jpg' },
      { id: 'g2', name: '智能体脂秤', price: 199, img: '/static/img/mall/g2.jpg' }
    ]
  }
  return map[cat] || []
}

/**
 * 生成个性化日程
 * @param {String} pkgKey  hbp | dm
 * @param {Object} answers 问卷答案；为空时退回通用模板
 * @param {Number} dayIndex 第几天（0 起）
 * @param {Number} limit   可选，最多返回条数（按类目重要性裁剪）
 */
export function buildDayPlan(pkgKey, answers, dayIndex, limit) {
  var key = pkgKey === 'dm' ? 'dm' : 'hbp'
  var items = baseDay(key, dayIndex || 0)
  var hasAnswers = !!(answers && Object.keys(answers).length)

  var planned
  if (!hasAnswers) {
    // 未评估时不编造依据，仅给通用模板
    planned = items.map(function (it) {
      var item = Object.assign({}, it)
      // 为营养/饮食/养生条目自动挂载商城商品推荐
      var goodsCats = ['nutrition', 'diet', 'tea', 'sleep', 'exercise', 'medication', 'monitor']
      if (goodsCats.indexOf(item.cat) >= 0) {
        item.goods = recommendGoodsForCat(item.cat)
      }
      return item
    })
  } else {
    planned = key === 'dm' ? planDm(items, dmFlags(answers)) : planHbp(items, hbpFlags(answers))
    // 评估后的条目也挂载商品推荐
    for (var i = 0; i < planned.length; i++) {
      var p = planned[i]
      if (p.goods && p.goods.length) continue
      var goodsCats = ['nutrition', 'diet', 'tea', 'sleep', 'exercise', 'medication', 'monitor']
      if (goodsCats.indexOf(p.cat) >= 0) {
        p.goods = recommendGoodsForCat(p.cat)
      }
    }
  }

  planned = trimPlan(planned, limit)
  planned.sort(function (x, y) {
    return x.time < y.time ? -1 : x.time > y.time ? 1 : 0
  })
  return planned
}

// 问卷选项统一结构：{ v: 稳定值码, label: 展示文案 }
// v 用于报告生成的逻辑判定，label 仅用于界面展示与对话气泡。
// 改文案只需改 label，不会影响危险分层逻辑；v 一经确定不要随意变更。
export const QUESTIONS = [
  {
    id: 'bp_grade',
    text: '您好！我是健康小助手。为了按《中国高血压防治指南 2024》为您做危险分层，先了解 5 项必要信息。第一个问题：近 1 个月您在家中测到的最高血压，落在哪一档？',
    options: [
      { v: 'grade1', label: '1级：140-159 / 90-99 mmHg' },
      { v: 'grade2', label: '2级：160-179 / 100-109 mmHg' },
      { v: 'grade3', label: '3级：≥180 / ≥110 mmHg' },
      { v: 'unknown', label: '未规律测量，不清楚' }
    ]
  },
  {
    id: 'medication',
    text: '好的。降压药的服用情况直接影响血压达标率，请问您目前属于哪一种？',
    options: [
      { v: 'adherent', label: '每天按时按量服用' },
      { v: 'irregular', label: '经常漏服或自行减量' },
      { v: 'self_stop', label: '血压降下来就停药' },
      { v: 'none', label: '尚未开始药物治疗' }
    ]
  },
  {
    id: 'comorbidity',
    text: '了解了。以下这些情况会明显改变您的降压目标值，请问您是否有医生确诊过？',
    options: [
      { v: 'cvd', label: '冠心病、心衰或脑卒中病史' },
      { v: 'dm_ckd', label: '糖尿病或慢性肾病' },
      { v: 'risk_factor', label: '仅血脂异常、高尿酸或吸烟' },
      { v: 'none', label: '以上都没有' }
    ]
  },
  {
    id: 'salt_intake',
    text: '限钠是指南推荐的首要生活方式干预。您平时的口味和加工食品摄入更接近哪种？',
    options: [
      { v: 'low', label: '清淡，每日食盐基本 <5g' },
      { v: 'medium', label: '适中，每日食盐 5-10g' },
      { v: 'high', label: '偏重，>10g 或常吃腌制加工食品' },
      { v: 'unaware', label: '从未留意过' }
    ]
  },
  {
    id: 'exercise',
    text: '最后一个问题：指南建议每周至少 150 分钟中等强度有氧运动。您目前的运动量大概是？',
    options: [
      { v: 'none', label: '基本不运动' },
      { v: 'low', label: '每周 1-2 次' },
      { v: 'medium', label: '每周 3-4 次，每次约 30 分钟' },
      { v: 'high', label: '每周 5 次以上' }
    ]
  }
]

export const QUESTIONS_DM = [
  {
    id: 'dm_med',
    text: '您好！我是健康小助手。先了解基本情况：您目前是否在使用降糖药物或胰岛素？',
    options: [
      { v: 'oral', label: '口服降糖药' },
      { v: 'insulin', label: '注射胰岛素' },
      { v: 'both', label: '两者都有' },
      { v: 'none', label: '暂未用药' }
    ]
  },
  {
    id: 'fpg',
    text: '好的。您最近的空腹血糖大概在什么范围？',
    options: [
      { v: 'normal', label: '正常 (<6.1)' },
      { v: 'mid', label: '偏高 (6.1-7.0)' },
      { v: 'high', label: '较高 (>7.0)' },
      { v: 'unknown', label: '不太清楚' }
    ]
  },
  {
    id: 'hba1c',
    text: '了解。您最近一次糖化血红蛋白（HbA1c）是多少？',
    options: [
      { v: 'lt65', label: '<6.5%' },
      { v: 'r65_70', label: '6.5-7.0%' },
      { v: 'r70_80', label: '7.0-8.0%' },
      { v: 'gt80', label: '>8% 或未测' }
    ]
  },
  {
    id: 'staple',
    text: '饮食方面：您每餐主食（米饭/面食）的量大概是多少？',
    options: [
      { v: 'small', label: '少于一小碗' },
      { v: 'normal', label: '一小碗' },
      { v: 'large', label: '一大碗以上' },
      { v: 'varies', label: '不固定' }
    ]
  },
  {
    id: 'dm_exercise',
    text: '最后一个问题：您餐后有运动的习惯吗？',
    options: [
      { v: 'always', label: '餐后必走' },
      { v: 'sometimes', label: '偶尔走走' },
      { v: 'rarely', label: '基本不动' },
      { v: 'never', label: '饭后就躺' }
    ]
  }
]

export const KNOWLEDGE = [
  { icon: 'fa-solid fa-book', title: '我国成人高血压患病率约 27.5%', desc: '有效控压可显著降低心脑血管并发症风险' },
  { icon: 'fa-solid fa-bullseye', title: '一般人群目标血压 <140/90 mmHg', desc: '能耐受者可进一步降至 <130/80 mmHg' },
  { icon: 'fa-solid fa-leaf', title: 'DASH 饮食原则', desc: '低盐（<5g/天）、高钾、低脂、多蔬果全谷物' },
  { icon: 'fa-solid fa-person-running', title: '每周 3-5 次中等强度有氧运动', desc: '每次 30 分钟，快走、慢跑、太极拳、八段锦均可' },
  // 《居民膳食营养与健康管理指南》合并内容
  { icon: 'fa-solid fa-bowl-food', title: '每日膳食指南：食物多样、谷薯为主', desc: '每天摄入 12 种以上食物，每周 25 种以上' },
  { icon: 'fa-solid fa-apple-whole', title: '多吃蔬果、奶类、豆类', desc: '蔬菜每天 300-500g，水果 200-350g' },
  { icon: 'fa-solid fa-fish', title: '适量吃鱼、禽、蛋、瘦肉', desc: '每周至少吃 2 次鱼，优先选择鱼虾等水产品' },
  { icon: 'fa-solid fa-droplet', title: '少盐少油、控糖限酒', desc: '每天食盐不超过 5g，烹调油 25-30g' },
  { icon: 'fa-solid fa-moon', title: '规律作息、充足睡眠', desc: '成年人每天 7-8 小时，尽量固定作息时间' },
  { icon: 'fa-solid fa-person-walking', title: '减少久坐、增加身体活动', desc: '每小时起身活动 5 分钟，每周累计 150 分钟以上' }
]

// 首页"我的权益"入口（图标统一金色，与权益卡片金色装饰呼应）
// quotaText 为入口下方显示的剩余次数文字；quota 为角标数字（可选）
export const RIGHT_ENTRIES = [
  { key: 'ai', label: 'AI自测', icon: 'fa-solid fa-face-grin-tongue', color: '#b8932e', bg: '#faf3e0', quotaText: '无限制' },
  { key: 'consult', label: '免费问诊', icon: 'fa-solid fa-comments', color: '#b8932e', bg: '#faf3e0', quotaText: '无限制' },
  { key: 'expert', label: '专家预约', icon: 'fa-solid fa-user-doctor', color: '#b8932e', bg: '#faf3e0', quota: 3, quotaText: '剩3次' },
  { key: 'video', label: '视频问诊', icon: 'fa-solid fa-video', color: '#b8932e', bg: '#faf3e0', quota: 12, quotaText: '剩12次' },
  { key: 'accompany', label: '陪诊', icon: 'fa-solid fa-hand-holding-heart', color: '#b8932e', bg: '#faf3e0', quota: 3, quotaText: '剩3次' },
  { key: 'psycho', label: '心理评估', icon: 'fa-solid fa-heart-pulse', color: '#b8932e', bg: '#faf3e0', quotaText: '无限制' },
  { key: 'gene', label: '基因检测', icon: 'fa-solid fa-dna', color: '#b8932e', bg: '#faf3e0', quota: 1, quotaText: '剩1次' }
]

// 健康商城商品（积分换购：price 现金价 / points 所需积分 / img 商品图）
export const SHOP_GOODS = [
  { id: 'g1', name: '上臂式电子血压计', desc: '国标认证 · 双人记忆 · 智能语音播报', icon: 'fa-solid fa-heart-pulse', color: '#389a82', bg: '#d4f5ee', price: 299, points: 1299, tag: '热卖', img: '/static/img/mall/g1.jpg' },
  { id: 'g2', name: '智能体脂秤', desc: '14 项身体数据 · APP 同步趋势', icon: 'fa-solid fa-weight-scale', color: '#4ab89e', bg: '#d8f8fa', price: 199, points: 899, tag: '新品', img: '/static/img/mall/g2.jpg' },
  { id: 'g3', name: '低盐调味礼盒', desc: '控盐勺 + 低钠酱油 + 海盐整月用量', icon: 'fa-solid fa-jar', color: '#f15533', bg: '#fdf4ed', price: 89, points: 399, tag: '', img: '/static/img/mall/g3.jpg' },
  { id: 'g4', name: '助眠香薰精油', desc: '薰衣草配方 · 睡前放松助眠', icon: 'fa-solid fa-spa', color: '#8dcdd8', bg: '#e2f2f6', price: 69, points: 299, tag: '', img: '/static/img/mall/g4.jpg' },
  { id: 'g5', name: '血糖试纸（50支）', desc: '与主流血糖仪通用 · 单片独立包装', icon: 'fa-solid fa-droplet', color: '#27ae60', bg: '#ddf7ed', price: 129, points: 599, tag: '', img: '/static/img/mall/g5.jpg' },
  { id: 'g6', name: '智能恒温杯', desc: '55°C 恒温提示 · USB 充电', icon: 'fa-solid fa-mug-hot', color: '#f2c94c', bg: '#fdf4ed', price: 159, points: 699, tag: '积分特惠', img: '/static/img/mall/g6.jpg' },
  { id: 'g7', name: '弹力带训练套装', desc: '3 档阻力 · 居家运动必备', icon: 'fa-solid fa-dumbbell', color: '#64748b', bg: '#f2f7fa', price: 39, points: 159, tag: '', img: '/static/img/mall/g7.jpg' },
  { id: 'g8', name: '一周分装药盒', desc: '早中晚三格 · 防潮密封', icon: 'fa-solid fa-pills', color: '#389a82', bg: '#d4f5ee', price: 29, points: 99, tag: '积分特惠', img: '/static/img/mall/g8.jpg' }
]

export function makeOrderNo() {
  const d = new Date()
  const p = (n) => (n < 10 ? '0' + n : '' + n)
  return 'AK' + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) +
    p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds()) +
    Math.floor(Math.random() * 900 + 100)
}

/* ---------- 智能设备 ---------- */
// 每种设备的可展示实时指标：key/label/unit/icon
export const DEVICE_TYPES = [
  {
    key: 'band',
    name: '智能手环',
    model: '享相手环 S1',
    icon: 'fa-solid fa-hand-holding-heart',
    color: '#389a82',
    accentSoft: '#d4f5ee',
    desc: '全天候心率、步数与睡眠监测',
    fields: [
      { key: 'heartRate', label: '心率', unit: 'bpm', icon: 'fa-solid fa-heart-pulse' },
      { key: 'steps', label: '今日步数', unit: '步', icon: 'fa-solid fa-shoe-prints' },
      { key: 'sleep', label: '睡眠时长', unit: 'h', icon: 'fa-solid fa-moon' },
      { key: 'battery', label: '电量', unit: '%', icon: 'fa-solid fa-battery-three-quarters' }
    ]
  },
  {
    key: 'band-bp',
    name: '智能手环 - 血压款',
    model: '享相手环 BP',
    icon: 'fa-solid fa-heart-circle-check',
    color: '#f15533',
    accentSoft: '#fdf4ed',
    desc: '腕式血压 + 心率 + 步数监测',
    fields: [
      { key: 'sys', label: '收缩压', unit: 'mmHg', icon: 'fa-solid fa-heart-pulse' },
      { key: 'dia', label: '舒张压', unit: 'mmHg', icon: 'fa-solid fa-heart-pulse' },
      { key: 'heartRate', label: '心率', unit: 'bpm', icon: 'fa-solid fa-heart' },
      { key: 'steps', label: '今日步数', unit: '步', icon: 'fa-solid fa-shoe-prints' }
    ]
  },
  {
    key: 'radar',
    name: '睡眠监测仪 - 毫米波雷达款',
    model: 'SM-C03',
    icon: 'fa-solid fa-satellite-dish',
    color: '#8dcdd8',
    accentSoft: '#e2f2f6',
    desc: '非接触式心率、呼吸、存在与异常挣扎监测',
    fields: [
      { key: 'heartRate', label: '心率', unit: 'bpm', icon: 'fa-solid fa-heart' },
      { key: 'respRate', label: '呼吸', unit: '次/分', icon: 'fa-solid fa-wind' },
      { key: 'stay', label: '睡眠时长', unit: 'h', icon: 'fa-solid fa-moon' },
      { key: 'inBed', label: '存在状态', unit: '', icon: 'fa-solid fa-bed' },
      { key: 'struggleAlert', label: '异常挣扎', unit: '次', icon: 'fa-solid fa-triangle-exclamation' }
    ]
  },
  {
    key: 'bed',
    name: '睡眠监测仪 - 床上款',
    model: '享相床垫 B1',
    icon: 'fa-solid fa-bed-pulse',
    color: '#f2c94c',
    accentSoft: '#fdf4ed',
    desc: '床垫式睡眠质量与生命体征监测',
    fields: [
      { key: 'sleepScore', label: '睡眠评分', unit: '分', icon: 'fa-solid fa-star' },
      { key: 'heartRate', label: '心率', unit: 'bpm', icon: 'fa-solid fa-heart' },
      { key: 'turn', label: '翻身次数', unit: '次', icon: 'fa-solid fa-rotate' },
      { key: 'deepSleep', label: '深睡时长', unit: 'h', icon: 'fa-solid fa-moon' }
    ]
  }
]

export function deviceType(key) {
  return DEVICE_TYPES.find((t) => t.key === key) || DEVICE_TYPES[0]
}

// 生成设备实时数据快照（原型模拟）
export function makeDeviceSnapshot(type, prev) {
  const d = {}
  const p = prev || {}
  const rnd = (min, max, fix) => +(min + Math.random() * (max - min)).toFixed(fix == null ? 0 : fix)
  switch (type.key) {
    case 'band':
      d.heartRate = rnd(62, 92)
      d.steps = (p.steps || 0) + rnd(0, 18)
      d.sleep = +((p.sleep || 6.4) + rnd(-0.1, 0.1, 2)).toFixed(2)
      d.battery = Math.max(5, Math.min(100, (p.battery == null ? 86 : p.battery) - rnd(0, 1)))
      break
    case 'band-bp':
      d.sys = rnd(118, 148)
      d.dia = rnd(74, 92)
      d.heartRate = rnd(62, 92)
      d.steps = (p.steps || 0) + rnd(0, 18)
      break
    case 'radar':
      d.heartRate = rnd(58, 90)
      d.respRate = rnd(12, 22)
      d.stay = +((p.stay || 6.5) + rnd(-0.1, 0.1, 2)).toFixed(2)
      d.inBed = Math.random() > 0.15 ? 1 : 0
      d.struggleAlert = (p.struggleAlert || 0) + (Math.random() > 0.92 ? 1 : 0)
      break
    case 'bed':
      d.sleepScore = rnd(72, 96)
      d.heartRate = rnd(58, 76)
      d.turn = (p.turn || 0) + rnd(0, 3)
      d.deepSleep = +((p.deepSleep || 2.1) + rnd(-0.05, 0.05, 2)).toFixed(2)
      break
  }
  return d
}

/* ---------- 我的健康页 ---------- */
// 顶部家庭成员切换
export const HEALTH_MEMBERS = [
  { key: 'self', name: '本人', avatarText: '周' },
  { key: 'mother', name: '母亲', avatarText: '母' },
  { key: 'father', name: '父亲', avatarText: '父' }
]

// 快捷入口
export const HEALTH_QUICK = [
  { key: 'report', label: '上传报告', icon: 'fa-solid fa-file-medical', color: '#389a82', bg: '#d4f5ee' },
  { key: 'diet', label: '健康饮食', icon: 'fa-solid fa-bowl-food', color: '#e8945a', bg: '#fdf4ed' },
  { key: 'record', label: '健康记录', icon: 'fa-solid fa-notes-medical', color: '#4a9fd8', bg: '#e2f2f6' },
  { key: 'manual', label: '手工记录', icon: 'fa-solid fa-pen-to-square', color: '#8b7ad8', bg: '#eeecfb' },
  { key: 'checkin', label: '每日打卡', icon: 'fa-solid fa-calendar-check', color: '#27ae60', bg: '#ddf7ed' },
  { key: 'more', label: '更多服务', icon: 'fa-solid fa-ellipsis', color: '#64748b', bg: '#f2f7fa' }
]

// 今日健康评分
export const HEALTH_SCORE = {
  score: 88,
  total: 100,
  date: '6月11日 周三',
  deltaText: '较昨日下降 6分',
  deltaDown: true,
  items: [
    { label: '睡眠不足', delta: -1, icon: 'fa-solid fa-moon' },
    { label: '压力偏高', delta: -1, icon: 'fa-solid fa-brain' },
    { label: '运动缺少', delta: -1, icon: 'fa-solid fa-person-running' }
  ]
}

// 今日重点建议
export const HEALTH_FOCUS = {
  title: '完成 5,000 步目标',
  current: 2340,
  target: 5000,
  unit: '步',
  remainText: '剩余 13 天完成挑战，加油！',
  btnText: '去散步打卡',
  bonusText: '完成今日重点建议',
  bonus: 10
}

// 成就
export const HEALTH_ACHIEVE = [
  { key: 'a1', label: '步数达标', icon: 'fa-solid fa-shoe-prints', done: true },
  { key: 'a2', label: '早睡守护', icon: 'fa-solid fa-bed', done: true },
  { key: 'a3', label: '全项达成', icon: 'fa-solid fa-medal', done: false }
]

// 今日健康计划（时间线）
export const HEALTH_PLAN = {
  done: 4,
  total: 8,
  items: [
    { time: '08:00', cat: 'med', title: '用药提醒', desc: '苯磺酸氨氯地平片 5mg，早餐后温水送服', done: true },
    { time: '09:30', cat: 'diet', title: '健康饮食', desc: '早餐建议：燕麦粥 + 鸡蛋 1 个 + 凉拌菠菜，控盐 2g 以内', done: true },
    {
      time: '10:30',
      cat: 'tea',
      title: '养生茶推荐',
      desc: '上午代谢活跃期，饮用决明子菊花茶有助于平肝降压',
      done: true,
      goods: [
        { id: 't1', name: '决明子菊花茶', price: 39.9, img: '/static/img/mall/g4.jpg' },
        { id: 't2', name: '桑叶枸杞茶', price: 29.9, img: '/static/img/mall/g6.jpg' }
      ]
    },
    { time: '14:00', cat: 'visit', title: '复诊提醒', desc: '距上次门诊已 28 天，建议本周复查血压与肝功能', done: true },
    { time: '16:00', cat: 'sport', title: '八段锦练习', desc: '第三式「调理脾胃须单举」，跟练 12 分钟', done: false, video: true },
    {
      time: '18:30',
      cat: 'diet',
      title: '晚餐建议',
      desc: '低钠高纤：杂粮饭 + 清蒸鲈鱼 + 西兰花，晚餐七分饱',
      done: false,
      goods: [
        { id: 'd1', name: '低钠杂粮米', price: 49, img: '/static/img/mall/g3.jpg' },
        { id: 'd2', name: '控盐调味组合', price: 35, img: '/static/img/mall/g8.jpg' }
      ]
    },
    { time: '21:30', cat: 'sleep', title: '睡眠准备', desc: '放下手机，泡脚 15 分钟并做 4-7-8 呼吸放松', done: false }
  ]
}

// 计划分类元数据
export const HEALTH_PLAN_META = {
  med: { label: '用药', color: '#389a82', bg: '#d4f5ee', icon: 'fa-solid fa-pills' },
  diet: { label: '饮食', color: '#e8945a', bg: '#fdf4ed', icon: 'fa-solid fa-bowl-food' },
  tea: { label: '养生', color: '#27ae60', bg: '#ddf7ed', icon: 'fa-solid fa-mug-hot' },
  visit: { label: '就医', color: '#4a9fd8', bg: '#e2f2f6', icon: 'fa-solid fa-stethoscope' },
  sport: { label: '运动', color: '#8b7ad8', bg: '#eeecfb', icon: 'fa-solid fa-person-running' },
  sleep: { label: '睡眠', color: '#5b6b9e', bg: '#eaeefb', icon: 'fa-solid fa-moon' }
}

// 健康风险预测
export const HEALTH_RISK_FORECAST = [
  {
    key: 'fatigue',
    period: '未来 30 天',
    name: '疲劳风险',
    percent: 28,
    level: 'warn',
    plans: ['保证每日 7 小时睡眠，23 点前入睡', '每工作 1 小时起身活动 5 分钟', '补充 B 族维生素与优质蛋白'],
    btnText: '领取专属睡眠管理'
  },
  {
    key: 'glucose',
    period: '未来 180 天',
    name: '血糖偏高风险',
    percent: 30,
    level: 'warn',
    plans: ['主食替换 1/3 为杂粮，减少精制碳水', '每周 150 分钟中等强度有氧运动', '每月监测一次空腹血糖'],
    btnText: '领取控糖饮食方案'
  }
]

// 疾病风险评分
export const HEALTH_DISEASE_RISK = [
  { key: 'hbp', name: '高血压', score: 66, level: '高风险', color: '#eb5757', bg: '#fdeeee' },
  { key: 'dm2', name: '2型糖尿病', score: 54, level: '中风险', color: '#f2994a', bg: '#fdf4ed' },
  { key: 'chd', name: '冠状动脉异常', score: 10, level: '低风险', color: '#27ae60', bg: '#ddf7ed' }
]

// 推荐
export const HEALTH_RECOMMEND = [
  { id: 'r1', name: '糖尿病专家调理服务', desc: '三甲内分泌专家 1v1 制定 12 周控糖方案', price: 99, tag: 'AI专家提供方案', btnText: '立即查看', img: '/static/img/mall/g1.jpg' },
  { id: 'r2', name: '大麦荷叶纤纤丸', desc: '药食同源配方 · 辅助代谢管理', price: 69.9, tag: '新品折扣', btnText: '立即查看', img: '/static/img/mall/g5.jpg' },
  { id: 'r3', name: '玫瑰四物茶', desc: '温和调理气血 · 每日一袋冲泡即饮', price: 69.9, tag: '甄选好物', btnText: '立即查看', img: '/static/img/mall/g4.jpg' }
]

