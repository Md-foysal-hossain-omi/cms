const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  for (const [name, vp, mobile] of [['desktop', { width: 1440, height: 900 }, false], ['mobile', { width: 390, height: 844 }, true]]) {
    const p = await (await b.newContext({ viewport: vp, isMobile: mobile, deviceScaleFactor: mobile ? 2 : 1 })).newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + process.argv[2], { waitUntil: 'load' });
    await p.waitForTimeout(3000);
    // scroll through to trigger reveals
    const h = await p.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 600) { await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(150); }
    await p.waitForTimeout(1500); await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(500);
    await p.screenshot({ path: `${process.argv[3]}/sv-${name}.png`, fullPage: true });
    console.log(name, 'overflow', await p.evaluate(() => document.documentElement.scrollWidth - innerWidth), 'errors', errs);
  }
  await b.close();
})();
