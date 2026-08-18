# DESIGN

本文件是项目 UI 设计规范入口文件，供 Trae 自动识别并约束后续 UI 生成。所有新增或修改 UI 时，必须遵守本文档定义的设计原则与设计令牌。

## 设计原则

- 使用统一的设计令牌表达颜色、字体、间距、尺寸、圆角、阴影和动效。
- 禁止在 UI 代码中硬编码颜色、字号、间距、尺寸、圆角、阴影等视觉值。
- 当现有令牌无法满足需求时，应先扩展本文档中的设计令牌，再应用到代码。
- 保持医疗健康产品应有的清晰、可信、温和、易读的视觉气质。
- 页面内容优先保证信息层级清楚、操作路径明确、移动端体验稳定。

## 颜色令牌

| 令牌 | 值 | 用途 |
| --- | --- | --- |
| `--color-brand-primary` | `#7DD4BC` | 品牌主色、标签、顶部操作图标 |
| `--color-brand-primary-hover` | `#4AB89E` | 品牌主色悬停态、按压态 |
| `--color-brand-primary-active` | `#389A82` | 品牌主色激活态 |
| `--color-brand-soft` | `#D4F5EE` | 品牌浅色背景、选中背景、淡图标背景 |
| `--color-label-soft-bg` | `rgba(212, 245, 238, 0.72)` | 卡片内左上角小标签半透明淡绿色背景 |
| `--color-label-soft-border` | `rgba(56, 154, 130, 0.12)` | 卡片内左上角小标签弱边框 |
| `--color-label-soft-text` | `var(--color-brand-primary-active)` | 卡片内左上角小标签文字 |
| `--color-brand-cyan` | `#61E0E5` | 青色品牌主色、积分页图标、渐变起始色 |
| `--color-brand-cyan-soft` | `#D8F8FA` | 青色浅色背景 |
| `--color-brand-green` | `#84E8C2` | 绿色品牌色、渐变结束色 |
| `--color-brand-green-soft` | `#DDF7ED` | 绿色浅色背景 |
| `--color-avatar-default-bg-start` | `#F2F4F7` | 默认头像背景渐变起点 |
| `--color-avatar-default-bg-end` | `#D9DEE7` | 默认头像背景渐变终点 |
| `--color-avatar-default-shape` | `#AAB2BF` | 默认头像人物轮廓 |
| `--color-info` | `#8DCDD8` | 信息提示、辅助图标 |
| `--color-info-soft` | `#E2F2F6` | 信息浅色背景 |
| `--color-warm` | `#E8C4A4` | 温暖辅助色、健康服务场景 |
| `--color-warm-soft` | `#FDF4ED` | 温暖浅色背景 |
| `--color-success` | `#27AE60` | 成功、完成、正常状态 |
| `--color-warning` | `#F2C94C` | 警告、提醒状态 |
| `--color-danger` | `#EB5757` | 错误、危险、删除操作 |
| `--color-badge` | `#F15533` | 消息红点、角标、未读提醒 |
| `--color-gold` | `#B8932E` | 金色主色：尊享级别徽章、积分数字、装饰线 |
| `--color-gold-deep` | `#9A7420` | 金色深色：渐变末端、强调 |
| `--color-gold-soft` | `#FAF3E0` | 金色浅色背景：尊享卡片渐变底 |
| `--color-gold-line` | `rgba(184, 147, 46, 0.35)` | 金色描边：徽章、卡片边框 |
| `--color-gold-glow` | `rgba(184, 147, 46, 0.14)` | 金色柔光：卡片角落光晕 |
| `--color-bg-page` | `linear-gradient(135deg, #DDF7ED, #F3F3F3)` | 页面背景斜向渐变：左上(#DDF7ED)→右下(#F3F3F3)，固定于视口、不随页面滚动 |
| `--color-bg-page-fade` | `linear-gradient(180deg, rgba(243, 243, 243, 0) 0%, #F3F3F3 88%)` | 页面顶部渐变到底色的柔和过渡层 |
| `--color-bg-page-height` | `1600px` | 兼容保留（fixed 模式下渐变以 `100% 100%` 铺满视口） |
| `--color-bg-page-base` | `#F3F3F3` | 页面基础底色 |
| `--color-back-subpage-bg` | `var(--color-bg-page-base)` | 带返回子页面背景底色 |
| `--color-back-subpage-header-bg` | `var(--color-bg-surface)` | 带返回子页面头部承载背景 |
| `--color-back-subpage-back-bg` | `var(--color-bg-surface)` | 带返回子页面返回按钮背景 |
| `--color-back-subpage-back-text` | `var(--color-text-primary)` | 带返回子页面返回按钮箭头颜色 |
| `--color-bg-surface` | `#FFFFFF` | 卡片、弹层、导航容器背景 |
| `--color-bg-subtle` | `#EDF5F2` | 次级背景、分区背景 |
| `--color-bg-section` | `#F2F7FA` | 模块区背景、统计卡片背景 |
| `--color-text-primary` | `#1A2A3C` | 一级文字、标题、大号数字 |
| `--color-text-secondary` | `#334155` | 正文、重要说明 |
| `--color-text-muted` | `#64748B` | 次级文字、说明、灰色模块标题 |
| `--color-text-disabled` | `#94A3B8` | 禁用文字、弱提示、空状态图标 |
| `--color-icon-ink` | `rgba(0, 0, 0, 0.10)` | 浅色底上的深色图标色（仅 alpha=0.10 的透明黑，不使用纯黑/更高透明度） |
| `--color-text-hint` | `#C6D2DE` | 占位提示、搜索框 placeholder |
| `--color-text-inverse` | `#FFFFFF` | 深色背景、品牌渐变背景上的标题和重要文字 |
| `--color-border-subtle` | `rgba(15, 61, 53, 0.06)` | 弱边框、分割线 |
| `--color-overlay` | `rgba(15, 61, 53, 0.10)` | 遮罩、投影辅助色 |

## 字体令牌

| 令牌 | 值 | 用途 |
| --- | --- | --- |
| `--font-family-base` | `"DIN Pro", "DIN Alternate", "PingFang SC", -apple-system, BlinkMacSystemFont, "Hiragino Sans GB", "Microsoft YaHei", sans-serif` | 默认字体；英文/数字优先渲染 DIN Pro（Mac 备选 DIN Alternate），中文回退苹方/雅黑 |
| `--font-family-en` | `"DIN Pro", "DIN Alternate", "Helvetica Neue", Arial, sans-serif` | 纯英文/数字场景字体 |
| `--icon-font-family` | `"Font Awesome 6 Free"` | 图标字体族，通过 BootCDN 国内 CDN 加载（font-awesome 6.4.2） |
| `--icon-font-family-brands` | `"Font Awesome 6 Brands"` | 品牌图标字体族（微信/支付宝等） |
| `--font-size-min` | `12px` | 移动端最小舒适字号，可读正文/入口/标签不得小于该值 |
| `--font-size-2xs` | `10px` | 微型说明、底部导航文字（仅限角标、徽标、装饰性元素，不作为可读正文） |
| `--font-size-xs` | `12px` | 辅助说明、角标、次要模块标题 |
| `--font-size-sm` | `14px` | 次级正文、标签、列表副标题 |
| `--font-size-md` | `16px` | 默认正文、主入口文字、列表标题 |
| `--font-size-lg` | `18px` | 强调正文、小标题、功能区标题 |
| `--font-size-xl` | `22px` | 模块标题 |
| `--font-size-2xl` | `28px` | 页面标题 |
| `--font-size-3xl` | `36px` | 关键数据、视觉标题 |
| `--font-size-4xl` | `60px` | 积分首页大号数字、核心统计 |
| `--line-height-tight` | `1.1` | 大数字行高 |
| `--line-height-normal` | `1.4` | 正文行高 |
| `--line-height-relaxed` | `1.6` | 长文说明行高 |
| `--font-weight-regular` | `400` | 常规文本 |
| `--font-weight-medium` | `500` | 强调文本、次要标题 |
| `--font-weight-semibold` | `600` | 小标题、按钮、统计数字 |
| `--font-weight-bold` | `700` | 重要标题、大号数字 |
| `--font-weight-heavy` | `800` | 视觉标题、核心数字 |

## 语义排版令牌

| 令牌 | 值 | 用途 |
| --- | --- | --- |
| `--typography-page-title-size` | `var(--font-size-2xl)` | 页面首个大标题卡片标题字号 |
| `--typography-page-title-line-height` | `var(--line-height-tight)` | 页面首个大标题卡片标题行高 |
| `--typography-page-title-weight` | `var(--font-weight-heavy)` | 页面首个大标题卡片标题字重 |
| `--typography-page-title-color` | `var(--color-text-primary)` | 浅色页面首卡大标题颜色 |
| `--typography-page-title-inverse-color` | `var(--color-text-inverse)` | 深色或品牌渐变页面首卡大标题颜色 |

## 间距令牌

| 令牌 | 值 | 用途 |
| --- | --- | --- |
| `--space-1` | `4px` | 极小间距、图标内边距 |
| `--space-2` | `8px` | 小间距、标签上下边距 |
| `--space-3` | `12px` | 表单内间距、图文间距 |
| `--space-4` | `16px` | 默认组件间距、左右安全边距 |
| `--space-5` | `20px` | 卡片内间距、统计卡片左右内边距 |
| `--space-6` | `24px` | 模块内边距、统计卡片上下内边距 |
| `--space-8` | `32px` | 区块间距、功能图标区域上下边距 |
| `--space-10` | `40px` | 页面级区块间距 |
| `--space-12` | `48px` | 大型视觉区块间距、大号数字底部间距 |
| `--space-data-list-gap` | `var(--space-2)` | 数据列表内相邻卡片间距 |
| `--space-section-head-top` | `4px` | 区块标题额外上间距（叠加页面容器顶部 `--space-4` 后共 40px） |
| `--space-section-head-bottom` | `16px` | 区块标题下间距（标题上远下近） |

## 尺寸令牌

| 令牌 | 值 | 用途 |
| --- | --- | --- |
| `--size-page-max-width` | `480px` | 移动端预览容器最大宽度 |
| `--size-status-bar-height` | `var(--status-bar-height, 0px)` | uni-app 顶部状态栏安全区高度 |
| `--size-safe-header-height` | `calc(var(--size-status-bar-height) + var(--size-header-height))` | 含状态栏安全区的顶部导航总占位高度 |
| `--size-header-height` | `64px` | 顶部导航内容高度 |
| `--size-tab-height` | `48px` | 标签导航高度 |
| `--size-bottom-nav-height` | `72px` | 底部导航高度 |
| `--size-icon-xs` | `16px` | 微型图标、位置图标 |
| `--size-icon-sm` | `18px` | 小图标 |
| `--size-icon-md` | `24px` | 默认图标 |
| `--size-icon-lg` | `32px` | 强调图标、功能入口图标 |
| `--size-icon-xl` | `44px` | 徽章图标、积分页图形图标 |
| `--size-back-subpage-back` | `42px` | 带返回子页面返回按钮尺寸 |
| `--size-back-subpage-header-min-height` | `42px` | 带返回子页面头部最小高度 |
| `--size-avatar-sm` | `32px` | 小头像、消息列表头像 |
| `--size-avatar-md` | `48px` | 默认头像 |
| `--size-avatar-lg` | `64px` | 大头像 |
| `--size-badge-sm` | `6px` | 小型红点角标 |
| `--size-badge-md` | `18px` | 带数字红点角标 |
| `--size-input-height` | `44px` | 搜索框、输入框高度 |
| `--size-stat-card-height` | `90px` | 积分页统计卡片高度 |
| `--size-hero-image-height` | `210px` | 服务详情页主图高度（aspectFill 居中裁剪） |
| `--size-detail-image-height` | `160px` | 服务详情区块配图高度（aspectFill 居中裁剪） |

## 圆角令牌

| 令牌 | 值 | 用途 |
| --- | --- | --- |
| `--radius-xs` | `6px` | 小标签、局部控件 |
| `--radius-sm` | `12px` | 小控件、按钮内局部形状 |
| `--radius-md` | `20px` | 子卡片、卡片内部信息块，需略小于母卡片 |
| `--radius-lg` | `24px` | 母卡片、弹层、主容器，基准同健康评分卡 |
| `--radius-xl` | `24px` | 页面级大圆角容器、空状态容器，统一同健康评分卡 |
| `--radius-card` | `var(--radius-lg)` | 全站同级母卡片统一圆角，基准为健康评分卡 |
| `--radius-card-child` | `var(--radius-md)` | 卡片内部子卡片/信息块圆角，略小于母卡片 |
| `--radius-control` | `var(--radius-sm)` | 非胶囊类小控件圆角 |
| `--radius-full` | `999px` | 胶囊按钮、头像、圆形按钮、红点角标 |

## 阴影令牌

| 令牌 | 值 | 用途 |
| --- | --- | --- |
| `--shadow-sm` | `0 2px 12px rgba(15, 61, 53, 0.06)` | 轻量卡片、导航阴影 |
| `--shadow-md` | `0 6px 24px rgba(125, 212, 188, 0.18)` | 常规卡片、浮层、功能图标外发光 |
| `--shadow-lg` | `0 8px 48px rgba(15, 61, 53, 0.10)` | 重点弹层、大卡片 |
| `--effect-glass-nav-blur` | `blur(18px) saturate(180%)` | 顶部导航磨砂模糊效果 |

## 动效令牌

| 令牌 | 值 | 用途 |
| --- | --- | --- |
| `--duration-fast` | `120ms` | 快速反馈 |
| `--duration-normal` | `200ms` | 常规过渡 |
| `--duration-slow` | `320ms` | 页面级或强调过渡 |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | 标准缓动 |
| `--ease-emphasized` | `cubic-bezier(0.2, 0, 0, 1.2)` | 强调缓动 |

## 组件规范

### 按钮

- 主要按钮使用 `--color-brand-primary`，悬停或按压使用 `--color-brand-primary-hover`。
- 危险按钮使用 `--color-danger`。
- 按钮圆角使用 `--radius-md` 或 `--radius-full`。
- 按钮文字使用 `--font-weight-semibold`。

### 卡片

- 卡片背景使用 `--color-bg-surface`。
- 同级母卡片圆角统一使用 `--radius-card`，其值以健康评分卡为基准。
- 卡片内部子卡片/信息块圆角统一使用 `--radius-card-child`，必须略小于母卡片。
- 详情页内容卡片保持清新简洁，不使用左侧竖线、强渐变、大面积高饱和色块等装饰性样式。
- 卡片阴影使用 `--shadow-sm` 或 `--shadow-md`。
- 卡片内边距使用 `--space-4`、`--space-5` 或 `--space-6`。
- 统计卡片背景使用 `--color-bg-section`，圆角使用 `--radius-card`。
- 页面首个大标题卡片与下方内容区需保持清晰区块距离，默认使用 `--space-6`，不得贴近列表或筛选栏。
- 区块大标题（`hm-sec-title`）间距遵循"上远下近"：标题距上方内容使用 `--space-section-head-top`（叠加页面容器顶部间距后共 40px），距下方内容使用 `--space-section-head-bottom`（16px），即上间距始终大于下间距。
- 区块标题行（标题 + 副标题）左右分别对齐：大标题左对齐，小字右对齐；副标题带交互组件（如日期切换器）时，小字与组件同放右侧一行。
- 首页问候区：机构名与问候语左对齐，右上消息图标右对齐（`justify-content: space-between`），不使用居中排版。
- 同一内容列表内的相邻卡片应保持紧凑连续，默认使用 `--space-data-list-gap`；除非是跨区块内容，不应使用大于 `--space-4` 的间距。
- 当列表外层已使用 `gap` 管理间距时，列表卡片之间不得再叠加 `margin-top`，避免间距过大。
- 卡片内小标题使用 `--font-size-lg`、`--font-weight-heavy` 和 `--line-height-tight`，并与下方说明保持至少 `--space-2` 间距。
- 移动端最小舒适字号为 `--font-size-min`（12px）：功能入口文字、数据标签、说明类可读正文一律不得小于该值；`--font-size-2xs`（10px）仅限角标、徽标、装饰性元素。
- 卡片左上角小标签使用 `--color-label-soft-bg`、`--color-label-soft-border`、`--color-label-soft-text`，内边距使用 `--space-1`/`--space-2`，并与下方内容保持至少 `--space-2` 间距。
- 浅色卡片小标题使用 `--color-text-primary`；深色或品牌渐变背景小标题必须使用 `--color-text-inverse`，不得使用深色文字。

### 带返回子页面

- 所有带返回按钮的二级/详情页必须使用统一 `back-subpage` 页面样式。
- 页面背景使用 `--color-bg-page-base`、`--color-bg-page` 和 `--color-bg-page-fade`；背景 `background-attachment: fixed` 固定于视口，不随页面滚动或变长。
- 返回头部最小高度使用 `--size-back-subpage-header-min-height`，顶部区域保持透明，不再使用独立深色或渐变标题卡。
- 返回按钮尺寸使用 `--size-back-subpage-back`，背景使用 `--color-back-subpage-back-bg`，箭头颜色使用 `--color-back-subpage-back-text`，圆角使用 `--radius-full`。
- 返回页标题使用页面标题排版令牌：`--typography-page-title-size`、`--typography-page-title-weight`、`--typography-page-title-line-height`。

### 导航

- 顶部导航内容高度使用 `--size-header-height`，固定导航总占位使用 `--size-safe-header-height`，并通过 uni-app `--status-bar-height` 预留状态栏安全区。
- 底部导航高度使用 `--size-bottom-nav-height`，背景使用 `--color-bg-surface`。
- 当前选中状态使用 `--color-brand-primary` 或 `--color-brand-soft`。
- 消息红点使用 `--color-badge`，圆角使用 `--radius-full`。

### 表单

- 输入框背景使用 `--color-bg-section` 或 `--color-bg-surface`。
- 输入框高度使用 `--size-input-height`，圆角使用 `--radius-full`。
- 占位文字使用 `--color-text-hint`。
- 错误状态使用 `--color-danger`。
- 成功状态使用 `--color-success`。

### 功能入口

- 图标背景使用外发光阴影 `--shadow-md`。
- 图标使用圆形或胶囊形，圆角 `--radius-full`。
- 图标内部使用主色 `--color-brand-primary` 或青色 `--color-brand-cyan`。
- 文字标题使用 `--font-size-md`，说明文字使用 `--font-size-xs`。

### 图标

- 禁止使用 emoji 作为 UI 图标（Windows 等系统会渲染为方框）。
- 统一使用 Font Awesome 6（`--icon-font-family`）图标字体：Solid 图标用 `fa-solid fa-xxx`，品牌图标用 `fa-brands fa-xxx`。
- 图标继承所在元素 `font-size` 与 `color`，通过设计令牌控制尺寸与颜色。
- 深色底（品牌渐变、深色圆点等）图标使用 `--color-text-inverse`；浅色底图标使用 `--color-icon-ink`（透明黑 alpha=0.10），禁止纯黑及其他透明度。
- 数据驱动的图标（列表项、菜单、消息）以 class 字符串形式存于数据层，模板用 `:class` 绑定。

### 空状态

- 空状态容器使用 `--radius-card`，保持与健康评分卡一致。
- 空状态图标使用 `--color-text-disabled`。
- 空状态文字使用 `--color-text-muted`。

## 可访问性规范

- 正文和背景需要保持清晰可读的对比度。
- 可交互元素必须具有明确的触控区域和视觉反馈。
- 不应仅依赖颜色表达状态，必要时配合文字或图标。
- 移动端主要点击目标建议不小于 `44px`。

## CSS 令牌定义

```css
:root {
  --color-brand-primary: #7DD4BC;
  --color-brand-primary-hover: #4AB89E;
  --color-brand-primary-active: #389A82;
  --color-brand-soft: #D4F5EE;
  --color-label-soft-bg: rgba(212, 245, 238, 0.72);
  --color-label-soft-border: rgba(56, 154, 130, 0.12);
  --color-label-soft-text: var(--color-brand-primary-active);
  --color-brand-cyan: #61E0E5;
  --color-brand-cyan-soft: #D8F8FA;
  --color-brand-green: #84E8C2;
  --color-brand-green-soft: #DDF7ED;
  --color-avatar-default-bg-start: #F2F4F7;
  --color-avatar-default-bg-end: #D9DEE7;
  --color-avatar-default-shape: #AAB2BF;
  --color-info: #8DCDD8;
  --color-info-soft: #E2F2F6;
  --color-warm: #E8C4A4;
  --color-warm-soft: #FDF4ED;
  --color-success: #27AE60;
  --color-warning: #F2C94C;
  --color-danger: #EB5757;
  --color-badge: #F15533;
  --color-gold: #B8932E;
  --color-gold-deep: #9A7420;
  --color-gold-soft: #FAF3E0;
  --color-gold-line: rgba(184, 147, 46, 0.35);
  --color-gold-glow: rgba(184, 147, 46, 0.14);
  --color-bg-page: linear-gradient(135deg, #DDF7ED, #F3F3F3);
  --color-bg-page-fade: linear-gradient(180deg, rgba(243, 243, 243, 0) 0%, #F3F3F3 88%);
  --color-bg-page-height: 1600px;
  --color-bg-page-base: #F3F3F3;
  --color-back-subpage-bg: var(--color-bg-page-base);
  --color-back-subpage-header-bg: var(--color-bg-surface);
  --color-back-subpage-back-bg: var(--color-bg-surface);
  --color-back-subpage-back-text: var(--color-text-primary);
  --color-bg-surface: #FFFFFF;
  --color-bg-glass-nav: rgba(255, 255, 255, 0.78);
  --color-bg-subtle: #EDF5F2;
  --color-bg-section: #F2F7FA;
  --color-text-primary: #1A2A3C;
  --color-text-secondary: #334155;
  --color-text-muted: #64748B;
  --color-text-disabled: #94A3B8;
  --color-text-hint: #C6D2DE;
  --color-text-inverse: #FFFFFF;
  --color-border-subtle: rgba(15, 61, 53, 0.06);
  --color-overlay: rgba(15, 61, 53, 0.10);
  --font-family-base: "PingFang SC", -apple-system, BlinkMacSystemFont, "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  --font-size-min: 12px;
  --font-size-2xs: 10px;
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 22px;
  --font-size-2xl: 28px;
  --font-size-3xl: 36px;
  --font-size-4xl: 60px;
  --line-height-tight: 1.1;
  --line-height-normal: 1.4;
  --line-height-relaxed: 1.6;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-heavy: 800;
  --typography-page-title-size: var(--font-size-2xl);
  --typography-page-title-line-height: var(--line-height-tight);
  --typography-page-title-weight: var(--font-weight-heavy);
  --typography-page-title-color: var(--color-text-primary);
  --typography-page-title-inverse-color: var(--color-text-inverse);
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-section-head-top: 4px;
  --space-section-head-bottom: 16px;
  --size-page-max-width: 480px;
  --size-header-height: 64px;
  --size-tab-height: 48px;
  --size-bottom-nav-height: 72px;
  --size-icon-xs: 16px;
  --size-icon-sm: 18px;
  --size-icon-md: 24px;
  --size-icon-lg: 32px;
  --size-icon-xl: 44px;
  --size-back-subpage-back: 42px;
  --size-back-subpage-header-min-height: 42px;
  --size-avatar-sm: 32px;
  --size-product-user-avatar: 28px;
  --size-avatar-md: 48px;
  --size-avatar-lg: 64px;
  --size-badge-sm: 6px;
  --size-badge-md: 18px;
  --size-input-height: 44px;
  --size-stat-card-height: 90px;
  --radius-xs: 6px;
  --radius-sm: 12px;
  --radius-md: 20px;
  --radius-lg: 24px;
  --radius-xl: 24px;
  --radius-card: var(--radius-lg);
  --radius-card-child: var(--radius-md);
  --radius-control: var(--radius-sm);
  --radius-full: 999px;
  --shadow-sm: 0 2px 12px rgba(15, 61, 53, 0.06);
  --shadow-md: 0 6px 24px rgba(125, 212, 188, 0.18);
  --shadow-lg: 0 8px 48px rgba(15, 61, 53, 0.10);
  --effect-glass-nav-blur: blur(18px) saturate(180%);
  --z-base: 0;
  --z-nav: 3000;
  --z-modal: 4000;
  --duration-fast: 120ms;
  --duration-normal: 200ms;
  --duration-slow: 320ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-emphasized: cubic-bezier(0.2, 0, 0, 1.2);
}
```
