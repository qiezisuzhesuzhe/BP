const { chromium } = require('/tmp/node_modules/playwright-core');

const PIXEL7 = {
  viewport: { width: 412, height: 915 },
  deviceScaleFactor: 2.625,
  isMobile: true,
  hasTouch: true,
  userAgent:
    'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
};

(async () => {
  const browser = await chromium.launch({
    executablePath: '/root/.cache/ms-playwright/chromium-1148/chrome-linux/chrome',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none']
  });
  const ctx = await browser.newContext(PIXEL7);
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('requestfailed', (r) => errors.push('REQFAIL ' + r.url()));

  await page.goto('http://127.0.0.1:8091/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  const info = await page.evaluate(() => ({
    w: window.innerWidth,
    h: window.innerHeight,
    dpr: window.devicePixelRatio,
    title: document.title,
    url: location.href,
    appChildren: document.querySelector('#app') ? document.querySelector('#app').children.length : -1,
    textLen: (document.body.innerText || '').trim().length,
    head: (document.body.innerText || '').trim().slice(0, 300)
  }));

  await page.screenshot({ path: '/workspace/shots/smoke.png' });
  console.log(JSON.stringify({ info, errors: errors.slice(0, 10) }, null, 2));
  await browser.close();
})().catch((e) => {
  console.error('FATAL', e.message);
  process.exit(1);
});
