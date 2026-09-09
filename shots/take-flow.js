const { chromium } = require('/tmp/pw/node_modules/playwright-core');
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

// 高血压评估答案：2级血压 + 经常漏服 + 地平类 + 危险因素(血脂异常/吸烟)
//                + 高盐 + 基本不运动 + 肝阳上亢  → 指南分层「高危」
const ANSWER_INDEX = [1, 1, 0, 2, 2, 0, 0];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function shot(page, name) {
  await page.screenshot({ path: path.join(OUT, name + '.png'), fullPage: false });
  console.log('  shot -> ' + name + '.png');
}

async function shotFull(page, name) {
  await page.screenshot({ path: path.join(OUT, name + '.png'), fullPage: true });
  console.log('  shot-full -> ' + name + '.png');
}

async function tap(page, selector) {
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (el) el.click();
  }, selector);
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch({
    executablePath: '/root/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
  });
  const ctx = await browser.newContext(PIXEL7);
  const page = await ctx.newPage();
  page.on('requestfailed', (r) => {
    if (!String(r.url()).includes('/api/events/stream')) console.log('  [REQFAIL] ' + r.url());
  });

  // ===== 1. 首页：未购初态 + 服务包卡片 =====
  console.log('1. 首页卡片展示');
  await page.goto(BASE, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await sleep(3200);
  await shot(page, '01-home-top');

  await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('uni-text,text')).find(
      (t) => t.textContent && t.textContent.trim() === '健康管理服务包'
    );
    if (el) window.scrollBy(0, el.getBoundingClientRect().top - 120);
  });
  await sleep(600);
  await shot(page, '02-home-package-card');

  // ===== 2. 服务详情页 =====
  console.log('2. 服务详情页');
  await page.evaluate(() => {
    const c = document.querySelector('.pkg');
    if (c) c.click();
  });
  await sleep(3600);
  await shot(page, '03-service-detail-hero');

  const detailScrolls = [
    ['04-service-detail-intro', 350],
    ['05-service-detail-highlights', 750],
    ['06-service-detail-services', 1200],
    ['07-service-detail-detail', 1700],
    ['08-service-detail-faq', 2400]
  ];
  for (const [name, y] of detailScrolls) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await sleep(400);
    await shot(page, name);
  }
  await page.evaluate(() => {
    const b = document.querySelector('.buybar__btn');
    if (b) b.scrollIntoView({ block: 'center' });
  });
  await sleep(500);
  await shot(page, '09-service-detail-buybar');

  // ===== 3. 下单支付（点击立即购买 → 自动建单并跳支付页）=====
  console.log('3. 下单支付');
  await tap(page, '.buybar__btn');
  await sleep(3600);
  await shot(page, '10-pay-page');
  await page.evaluate(() => window.scrollTo(0, 250));
  await sleep(400);
  await shot(page, '11-pay-methods');

  await page.evaluate(() => {
    const b = document.querySelector('.paybar__btn');
    if (b && !b.classList.contains('paybar__btn--off')) b.click();
  });
  await sleep(500);
  await shot(page, '12-pay-stage1-loading');
  await sleep(1300);
  await shot(page, '13-pay-stage2-processing');
  await sleep(1100);
  await shot(page, '14-pay-success');
  await sleep(2200);
  console.log('  跳转: ' + page.url());

  // ===== 4. 权益详情（待激活）=====
  console.log('4. 权益详情 → 添加健康管理师');
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(800);
  await shot(page, '15-right-detail-after-purchase');
  await page.evaluate(() => window.scrollTo(0, 650));
  await sleep(400);
  await shot(page, '16-right-detail-more');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await sleep(400);
  await shot(page, '17-right-detail-cta');

  // 点底部「添加企业微信」
  await page.evaluate(() => {
    const b = document.querySelector('.buybar__btn');
    if (b) b.click();
  });
  await sleep(900);
  await shot(page, '18-wecom-add-sheet');
  // 弹层内「添加企业微信」
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('.sheet__btn')).find(
      (x) => x.textContent && x.textContent.includes('添加企业微信')
    );
    if (b) b.click();
  });
  await sleep(700);
  await shot(page, '19-wecom-applying');
  // 1.8s 后通过
  await sleep(1600);
  await shot(page, '20-wecom-added');

  // ===== 5. 进入对话：激活 + 7 题首次评估 =====
  console.log('5. 对话激活与首次评估');
  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('.sheet__btn')).find(
      (x) => x.textContent && x.textContent.includes('进入对话')
    );
    if (b) b.click();
  });
  await sleep(3600);
  console.log('  chat url: ' + page.url());
  await shot(page, '21-chat-greeting');

  await tap(page, '.activate__btn:not(.activate__btn--ghost)');

  for (let i = 0; i < ANSWER_INDEX.length; i++) {
    const oi = ANSWER_INDEX[i];
    // 等选项出现
    await page.waitForFunction(
      () => document.querySelectorAll('.opts__item').length > 0,
      null,
      { timeout: 10000 }
    );
    await sleep(400);
    if (i === 0) await shot(page, '22-chat-assess-q1');
    if (i === 3) await shot(page, '23-chat-assess-mid');
    await page.evaluate((idx) => {
      const items = document.querySelectorAll('.opts__item');
      if (items[idx]) items[idx].click();
    }, oi);
    console.log('  Q' + (i + 1) + ' -> option[' + oi + ']');
    await sleep(700);
  }

  // ===== 6. 方案生成动画（4 阶段 ×900ms）=====
  console.log('6. 方案生成中');
  await sleep(700);
  await shot(page, '24-chat-generating-1');
  await sleep(1000);
  await shot(page, '25-chat-generating-2');
  await sleep(2200);

  // ===== 7. 对话内：方案已生成 + 评估报告 + 首日日程 =====
  console.log('7. 报告与首日日程');
  await page.waitForFunction(
    () => document.querySelectorAll('.report').length > 0,
    null,
    { timeout: 10000 }
  );
  await sleep(900);
  const risk = await page.evaluate(() => {
    const el = document.querySelector('.report__risk');
    return el ? el.textContent.trim() : '(无)';
  });
  console.log('  危险分层: ' + risk);
  await page.evaluate(() => {
    const r = document.querySelector('.report');
    if (r) r.scrollIntoView({ block: 'start' });
  });
  await sleep(700);
  await shot(page, '26-chat-report-top');
  await shotFull(page, '27-chat-report-full');

  // 等首日日程卡出现（报告后 700ms 推送）
  await page.waitForFunction(
    () => document.querySelectorAll('.plan').length > 0,
    null,
    { timeout: 10000 }
  );
  await sleep(1200);
  await page.evaluate(() => {
    const p = document.querySelector('.plan');
    if (p) p.scrollIntoView({ block: 'start' });
  });
  await sleep(700);
  await shot(page, '28-chat-plan-timeline');
  await shotFull(page, '29-chat-done-full');

  // ===== 8. 回首页：今日健康指导时间轴 =====
  console.log('8. 首页时间轴');
  await page.evaluate(() => {
    const c = document.querySelector('.cta');
    if (c) c.click();
  });
  await sleep(3800);
  console.log('  home url: ' + page.url());
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(500);
  await shot(page, '30-home-after-assess-top');

  // 定位「今日健康指导」并滚动
  const found = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('uni-text,text')).find(
      (t) => t.textContent && t.textContent.includes('今日健康指导')
    );
    if (el) {
      el.scrollIntoView({ block: 'start' });
      return true;
    }
    return false;
  });
  console.log('  时间轴区块: ' + (found ? '已找到' : '未找到'));
  await sleep(800);
  await shot(page, '31-home-timeline');
  await page.evaluate(() => window.scrollBy(0, 520));
  await sleep(500);
  await shot(page, '32-home-timeline-more');

  // 权益状态断言
  const store = await page.evaluate(() => {
    try {
      return JSON.parse(localStorage.getItem('ankang_store_v1') || '{}');
    } catch (e) {
      return {};
    }
  });
  const r = (store.rights || [])[0] || {};
  console.log('  权益: status=' + r.status + ' wecomAdded=' + r.wecomAdded +
    ' chatStarted=' + r.chatStarted + ' answers=' + Object.keys(r.answers || {}).length);

  // 消息中心：方案生成通知
  await page.goto(BASE + '#/pages/message/message', { waitUntil: 'domcontentloaded' });
  await sleep(3000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(600);
  await shot(page, '33-message-plan-ready');

  // 权益详情/订单（评估后态）
  await page.goto(BASE + '#/pages/rights/rights', { waitUntil: 'domcontentloaded' });
  await sleep(3000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(600);
  await shot(page, '34-rights-list-active');
  await page.goto(BASE + '#/pages/mine/orders', { waitUntil: 'domcontentloaded' });
  await sleep(3000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(600);
  await shot(page, '35-my-orders');

  await browser.close();
  console.log('\n=== 主链路截图完成 ===');
})().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
