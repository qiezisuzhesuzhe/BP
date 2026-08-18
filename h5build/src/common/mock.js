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
      { name: 'AI 健康助手对话', spec: '不限次数', unit: '次' },
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
      { name: 'AI 健康助手对话', spec: '不限次数', unit: '次' },
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
      { time: '08:00', cat: 'nutrition', title: '营养早餐', desc: '全麦面包+无糖豆浆+水煮蛋，健康开启新一天', tag: '饮食管理', icon: 'fa-solid fa-croissant' },
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
      { time: '08:00', cat: 'nutrition', title: '低GI 早餐', desc: '燕麦（非速溶）+鸡蛋+一小把坚果', tag: '饮食管理', icon: 'fa-solid fa-croissant' },
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

export const QUESTIONS = [
  {
    id: 'medication',
    text: '您好！我是安康，您的AI血压健康助手。在开始之前，我想先了解一下您的基本情况。第一个问题：您目前是否有服用降压药物？',
    options: ['是，按时服药', '偶尔服用', '没有服药', '记不清了']
  },
  {
    id: 'bp_range',
    text: '好的。那您平时自测的血压大概在什么范围？',
    options: ['偏低或正常 (<130/80)', '正常偏高 (130-140/80-90)', '较高 (>140/90)', '不太清楚']
  },
  {
    id: 'salt_intake',
    text: '了解了。接下来想问问您的饮食习惯：您每天的盐分摄入量大概是多少？',
    options: ['很清淡 (<5g/天)', '适中 (5-10g/天)', '口味偏重 (>10g/天)', '不太注意']
  },
  {
    id: 'exercise',
    text: '好的。运动方面：您每周大概进行几次有氧运动？比如快走、慢跑、太极拳等。',
    options: ['从不运动', '每周1-2次', '每周3-4次', '几乎每天']
  },
  {
    id: 'sleep',
    text: '最后一个问题：您最近的睡眠质量怎么样？',
    options: ['睡得很好', '一般，偶尔失眠', '经常失眠', '严重睡眠问题']
  }
]

export const QUESTIONS_DM = [
  {
    id: 'dm_med',
    text: '您好！我是安康，您的AI控糖助手。先了解基本情况：您目前是否在使用降糖药物或胰岛素？',
    options: ['口服降糖药', '注射胰岛素', '两者都有', '暂未用药']
  },
  {
    id: 'fpg',
    text: '好的。您最近的空腹血糖大概在什么范围？',
    options: ['正常 (<6.1)', '偏高 (6.1-7.0)', '较高 (>7.0)', '不太清楚']
  },
  {
    id: 'hba1c',
    text: '了解。您最近一次糖化血红蛋白（HbA1c）是多少？',
    options: ['<6.5%', '6.5-7.0%', '7.0-8.0%', '>8% 或未测']
  },
  {
    id: 'staple',
    text: '饮食方面：您每餐主食（米饭/面食）的量大概是多少？',
    options: ['少于一小碗', '一小碗', '一大碗以上', '不固定']
  },
  {
    id: 'dm_exercise',
    text: '最后一个问题：您餐后有运动的习惯吗？',
    options: ['餐后必走', '偶尔走走', '基本不动', '饭后就躺']
  }
]

export const KNOWLEDGE = [
  { icon: 'fa-solid fa-book', title: '我国成人高血压患病率约 27.5%', desc: '有效控压可显著降低心脑血管并发症风险' },
  { icon: 'fa-solid fa-bullseye', title: '一般人群目标血压 <140/90 mmHg', desc: '能耐受者可进一步降至 <130/80 mmHg' },
  { icon: 'fa-solid fa-leaf', title: 'DASH 饮食原则', desc: '低盐（<5g/天）、高钾、低脂、多蔬果全谷物' },
  { icon: 'fa-solid fa-person-running', title: '每周 3-5 次中等强度有氧运动', desc: '每次 30 分钟，快走、慢跑、太极拳、八段锦均可' }
]

// 首页"我的权益"入口（quota 表示剩余次数，无则不限）
export const RIGHT_ENTRIES = [
  { key: 'ai', label: 'AI自测', icon: 'fa-solid fa-tongue', color: '#389a82', bg: '#d4f5ee' },
  { key: 'consult', label: '免费问诊', icon: 'fa-solid fa-comments', color: '#4ab89e', bg: '#d8f8fa' },
  { key: 'expert', label: '专家预约', icon: 'fa-solid fa-user-doctor', color: '#f15533', bg: '#fdf4ed', quota: 3 },
  { key: 'video', label: '视频问诊', icon: 'fa-solid fa-video', color: '#8dcdd8', bg: '#e2f2f6', quota: 6 },
  { key: 'accompany', label: '陪诊', icon: 'fa-solid fa-hand-holding-heart', color: '#f2c94c', bg: '#fdf4ed', quota: 12 },
  { key: 'psycho', label: '心理评估', icon: 'fa-solid fa-heart-pulse', color: '#27ae60', bg: '#ddf7ed' },
  { key: 'nurse', label: '上门换药', icon: 'fa-solid fa-house-medical', color: '#64748b', bg: '#f2f7fa' }
]

// 健康商城商品（积分换购：price 现金价 / points 所需积分）
export const SHOP_GOODS = [
  { id: 'g1', name: '上臂式电子血压计', desc: '国标认证 · 双人记忆 · 智能语音播报', icon: 'fa-solid fa-heart-pulse', color: '#389a82', bg: '#d4f5ee', price: 299, points: 1299, tag: '热卖' },
  { id: 'g2', name: '智能体脂秤', desc: '14 项身体数据 · APP 同步趋势', icon: 'fa-solid fa-weight-scale', color: '#4ab89e', bg: '#d8f8fa', price: 199, points: 899, tag: '新品' },
  { id: 'g3', name: '低盐调味礼盒', desc: '控盐勺 + 低钠酱油 + 海盐整月用量', icon: 'fa-solid fa-jar', color: '#f15533', bg: '#fdf4ed', price: 89, points: 399, tag: '' },
  { id: 'g4', name: '助眠香薰精油', desc: '薰衣草配方 · 睡前放松助眠', icon: 'fa-solid fa-spa', color: '#8dcdd8', bg: '#e2f2f6', price: 69, points: 299, tag: '' },
  { id: 'g5', name: '血糖试纸（50支）', desc: '与主流血糖仪通用 · 单片独立包装', icon: 'fa-solid fa-droplet', color: '#27ae60', bg: '#ddf7ed', price: 129, points: 599, tag: '' },
  { id: 'g6', name: '智能恒温杯', desc: '55°C 恒温提示 · USB 充电', icon: 'fa-solid fa-mug-hot', color: '#f2c94c', bg: '#fdf4ed', price: 159, points: 699, tag: '积分特惠' },
  { id: 'g7', name: '弹力带训练套装', desc: '3 档阻力 · 居家运动必备', icon: 'fa-solid fa-dumbbell', color: '#64748b', bg: '#f2f7fa', price: 39, points: 159, tag: '' },
  { id: 'g8', name: '一周分装药盒', desc: '早中晚三格 · 防潮密封', icon: 'fa-solid fa-pills', color: '#389a82', bg: '#d4f5ee', price: 29, points: 99, tag: '积分特惠' }
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
    model: '安康手环 S1',
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
    model: '安康手环 BP',
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
    model: '安康雷达 R1',
    icon: 'fa-solid fa-satellite-dish',
    color: '#8dcdd8',
    accentSoft: '#e2f2f6',
    desc: '非接触式呼吸、体动与离床监测',
    fields: [
      { key: 'respRate', label: '呼吸频率', unit: '次/分', icon: 'fa-solid fa-wind' },
      { key: 'bodyMove', label: '体动次数', unit: '次', icon: 'fa-solid fa-person-walking' },
      { key: 'bedOff', label: '离床次数', unit: '次', icon: 'fa-solid fa-bed' },
      { key: 'stay', label: '床内时长', unit: 'h', icon: 'fa-solid fa-moon' }
    ]
  },
  {
    key: 'bed',
    name: '睡眠监测仪 - 床上款',
    model: '安康床垫 B1',
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
      d.respRate = rnd(14, 20)
      d.bodyMove = (p.bodyMove || 0) + rnd(0, 2)
      d.bedOff = (p.bedOff || 0) + rnd(0, 1)
      d.stay = +((p.stay || 7.2) + rnd(-0.05, 0.05, 2)).toFixed(2)
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
