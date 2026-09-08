const { chromium } = require('/tmp/node_modules/playwright-core');
const fs = require('fs');
const path = require('path');

const OUT = '/workspace/shots';
const BASE = 'http://127.0.0.1:8091/';

const PIXEL7 = {
  viewport: { width: 412, height: 915 },
  deviceScaleFactor: 2.625,
  isMobile: true,
  hasTouch: true,
  userAgent:
    'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
};

const WAIT = 3200;
const SW = 412;
const SH = 915;
const DEVICE_IMEI = '867561088869642';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function shot(page, name, opts = {}) {
  const p = path.join(OUT, name + '.png');
  await page.screenshot({ path: p, fullPage: false, ...opts });
  console.log('  shot -> ' + name + '.png');
  return p;
}

async function shotFull(page, name) {
  const p = path.join(OUT, name + '.png');
  await page.screenshot({ path: p, fullPage: true });
  console.log('  shot-full -> ' + name + '.png');
  return p;
}

async function waitForVue(page, extra) {
  await sleep(WAIT + (extra || 0));
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch({
    executablePath: '/root/.cache/ms-playwright/chromium-1148/chrome-linux/chrome',
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--font-render-hinting=none',
      '--disable-blink-features=AutomationControlled'
    ]
  });
  const ctx = await browser.newContext(PIXEL7);
  const page = await ctx.newPage();
  const errs = [];
  page.on('requestfailed', (r) => {
    if (!String(r.url()).includes('tongji-collector')) errs.push('REQFAIL ' + r.url());
  });

  // ========== 健康管理服务包 业务流程 ==========
  console.log('=== 流程一：健康管理服务包 业务链路 ===');

  // 1. 首页（含健康管理服务包卡片）
  console.log('1. 首页');
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await waitForVue(page);
  await shot(page, '01-home-top');

  // 滚动到「健康管理服务包」卡片
  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('uni-text, text')).find(
      (t) => t.textContent && t.textContent.trim() === '健康管理服务包'
    );
    if (el) {
      const rect = el.getBoundingClientRect();
      window.scrollBy(0, rect.top - 120);
    }
  });
  await sleep(500);
  await shot(page, '02-home-package-card');

  // 2. 点击第一个服务包（高血压调理计划）进入详情
  console.log('2. 服务详情页');
  await page.evaluate(() => {
    const cards = document.querySelectorAll('.pkg');
    if (cards[0]) cards[0].click();
    else {
      const els = Array.from(document.querySelectorAll('[class*=pkg]'));
      const target = els.find((e) => e.textContent && e.textContent.includes('高血压'));
      if (target) target.click();
    }
  });
  await waitForVue(page, 500);
  await shot(page, '03-service-detail-hero');

  // 滚动详情页（分段展示）
  console.log('  详情页分段');
  const sections = [
    { name: '04-service-detail-intro', scroll: 350 },
    { name: '05-service-detail-highlights', scroll: 750 },
    { name: '06-service-detail-services', scroll: 1200 },
    { name: '07-service-detail-detail', scroll: 1700 },
    { name: '08-service-detail-faq', scroll: 2400 }
  ];
  for (const s of sections) {
    await page.evaluate((y) => window.scrollTo(0, y), s.scroll);
    await sleep(300);
    await shot(page, s.name);
  }

  // 回到购买按钮位置
  await page.evaluate(() => {
    const btn = document.querySelector('.buybar__btn');
    if (btn) {
      const r = btn.getBoundingClientRect();
      window.scrollBy(0, r.top - window.innerHeight + 100);
    } else {
      window.scrollTo(0, document.body.scrollHeight);
    }
  });
  await sleep(300);
  await shot(page, '09-service-detail-buybar');

  // 3. 点击立即购买
  console.log('3. 订单支付页');
  await page.evaluate(() => {
    const btn = document.querySelector('.buybar__btn');
    if (btn) btn.click();
  });
  await waitForVue(page, 600);
  await shot(page, '10-pay-page');

  // 滚动展示支付方式
  await page.evaluate(() => window.scrollTo(0, 250));
  await sleep(300);
  await shot(page, '11-pay-methods');

  // 4. 点击确认支付 → 支付中 → 成功
  console.log('4. 支付流程');
  await page.evaluate(() => {
    const btn = document.querySelector('.paybar__btn');
    if (btn && !btn.classList.contains('paybar__btn--off')) btn.click();
  });
  await sleep(500);
  await shot(page, '12-pay-stage1-loading');
  await sleep(1300);
  await shot(page, '13-pay-stage2-processing');
  // stage3 出现在 2600ms，1500ms 后跳转 → 抓 2600~4100 之间
  await sleep(1100);
  await shot(page, '14-pay-success');

  // 5. 跳转后的页面（权益详情）
  console.log('5. 购买后跳转');
  await waitForVue(page, 1200);
  const curUrl = await page.url();
  console.log('  current url: ' + curUrl);
  await shot(page, '15-right-detail-after-purchase');

  // 6. 权益详情下半部分
  console.log('6. 权益详情滚动');
  await page.evaluate(() => window.scrollTo(0, 700));
  await sleep(400);
  await shot(page, '16-right-detail-more');

  // 7. 我的权益列表
  console.log('7. 我的权益列表');
  await page.goto(BASE + '#/pages/rights/rights', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await waitForVue(page);
  await shot(page, '17-rights-list');

  // 8. 我的订单
  console.log('8. 我的订单');
  await page.goto(BASE + '#/pages/mine/orders', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await waitForVue(page);
  await shot(page, '18-my-orders');

  // 9. 回到首页（购买后态）
  console.log('9. 首页（购买后态）');
  await page.goto(BASE + '#/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await waitForVue(page);
  await shot(page, '19-home-after-purchase');

  // ========== 全站其他页面 ==========
  console.log('\n=== 流程二：全站其他页面 ===');

  const pages = [
    { name: '20-health', url: '#/pages/health/health', label: '我的健康' },
    { name: '21-mall', url: '#/pages/mall/mall', label: '健康商城' },
    { name: '22-chat', url: '#/pages/chat/chat', label: '健康小助手' },
    { name: '23-message', url: '#/pages/message/message', label: '消息中心' },
    { name: '24-mine', url: '#/pages/mine/mine', label: '我的' },
    { name: '25-mine-profile', url: '#/pages/mine/profile', label: '个人资料' },
    { name: '26-mine-agreement', url: '#/pages/mine/agreement', label: '用户协议' }
  ];

  for (const p of pages) {
    console.log('  ' + p.label);
    try {
      await page.goto(BASE + p.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await waitForVue(page);
      await shot(page, p.name);
    } catch (e) {
      console.log('  [WARN] ' + p.name + ': ' + e.message);
    }
  }

  // ========== 设备流程：空态 → 扫码 → 绑定 → 列表 → 详情 ==========
  console.log('\n=== 流程三：设备绑定链路 ===');

  console.log('  设备空态');
  await page.goto(BASE + '#/pages/device/device', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await waitForVue(page);
  await shot(page, '27-device-empty');

  console.log('  扫码页');
  await page.goto(BASE + '#/pages/device/scan', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await waitForVue(page);
  await shot(page, '28-device-scan');

  console.log('  手动输入设备号弹层');
  await page.evaluate(() => {
    const el = document.querySelector('.scan-manual');
    if (el) el.click();
  });
  await sleep(800);
  // uni-app H5 把 <input> 编译成 <uni-input> 外壳，必须操作壳内真实 input 才能驱动 v-model
  await page.fill('.sheet__input input', DEVICE_IMEI);
  await sleep(600);
  await shot(page, '29-device-manual-input');
  console.log('  input值: ' + (await page.inputValue('.sheet__input input')));

  console.log('  提交查询设备');
  await page.evaluate(() => {
    const btns = document.querySelectorAll('.sheet__btn');
    const ok = Array.from(btns).find((b) => b.textContent && b.textContent.includes('绑定设备'));
    if (ok) ok.click();
  });
  await sleep(4000);

  // 平台反查不可达时会先弹「请确认设备类型」，选睡眠监测仪
  const needPick = await page.evaluate(() => document.querySelectorAll('.sheet__pick').length > 0);
  if (needPick) {
    console.log('  出现设备类型选择层');
    await shot(page, '30a-device-type-pick');
    await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.sheet__pick'));
      const radar = items.find((e) => e.textContent && e.textContent.includes('睡眠'));
      (radar || items[0]).click();
    });
    await sleep(3000);
  }

  await shot(page, '30-device-recognized');
  const recognized = await page.evaluate(() => {
    const t = document.querySelector('.sheet__dev-name');
    return t ? t.textContent.trim() : '(无识别弹层)';
  });
  console.log('  识别结果: ' + recognized);

  console.log('  确认添加');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('.sheet__btn'));
    const ok = btns.find((b) => b.textContent && b.textContent.includes('确认添加'));
    if (ok) ok.click();
  });
  await sleep(1200);
  await shot(page, '31-device-binding');
  await sleep(3500);

  console.log('  设备列表（已绑定）');
  await page.goto(BASE + '#/pages/device/device', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await waitForVue(page);
  const devCount = await page.evaluate(() => document.querySelectorAll('.dev').length);
  console.log('  设备条数: ' + devCount);
  await shot(page, '32-device-list');

  console.log('  设备详情');
  await page.evaluate(() => {
    const items = document.querySelectorAll('.dev');
    if (items[0]) items[0].click();
  });
  await waitForVue(page, 1500);
  console.log('  url: ' + (await page.url()));
  await shot(page, '33-device-detail');

  await page.evaluate(() => window.scrollTo(0, 700));
  await sleep(400);
  await shot(page, '34-device-detail-more');

  console.log('  手环状态');
  await page.goto(BASE + '#/pages/band/status', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await waitForVue(page, 1500);
  await shot(page, '35-band-status');

  console.log('\n=== 全部完成 ===');
  console.log('错误数：' + errs.length);
  if (errs.length) console.log(errs.slice(0, 5).join('\n'));

  await browser.close();
})().catch((e) => {
  console.error('FATAL', e.message);
  console.error(e.stack);
  process.exit(1);
});
