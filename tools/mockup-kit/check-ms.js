const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  for (const [n, vp, m] of [['desktop', { width: 1440, height: 900 }, false], ['mobile', { width: 390, height: 844 }, true]]) {
    const p = await (await b.newContext({ viewport: vp, isMobile: m })).newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', c => c.type() === 'error' && errs.push(c.text()));
    await p.goto(process.argv[2], { waitUntil: 'load', timeout: 60000 }); await p.waitForTimeout(1500);
    await p.click('#flip'); await p.waitForTimeout(1200);
    const flipped = await p.evaluate(() => [document.getElementById('postcard').classList.contains('flipped'), getComputedStyle(document.getElementById('postcard')).transform.slice(0, 30)]);
    await p.screenshot({ path: `ms/out/flip-${n}.png` });
    await p.click('#flip'); await p.waitForTimeout(1200);
    const H = await p.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < H; y += 400) { await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(150); }
    await p.waitForTimeout(1800);
    const r = await p.evaluate(() => ({ rv: document.querySelectorAll('.rv.in').length + '/' + document.querySelectorAll('.rv').length, years: document.getElementById('years').textContent,
      imgs: [...document.images].map(i => i.naturalWidth).join(','), overflow: document.documentElement.scrollWidth - innerWidth }));
    const s = await p.$$('.qa summary'); await s[2].scrollIntoViewIfNeeded(); await s[2].click(); await p.waitForTimeout(300);
    r.open = await p.evaluate(() => [...document.querySelectorAll('.qa details')].filter(d => d.open).length);
    if (m) { await p.evaluate(() => scrollTo(0, 0)); await p.click('.menu'); await p.waitForTimeout(200); r.menu = await p.evaluate(() => getComputedStyle(document.getElementById('nav')).display); }
    console.log(n, JSON.stringify({ flipped, ...r }), 'errors', errs);
  }
  await b.close();
})();
