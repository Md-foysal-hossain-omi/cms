const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  for (const [n, vp, m] of [['desktop', { width: 1440, height: 900 }, false], ['mobile', { width: 390, height: 844 }, true]]) {
    const p = await (await b.newContext({ viewport: vp, isMobile: m })).newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', c => c.type() === 'error' && errs.push(c.text()));
    await p.goto(process.argv[2], { waitUntil: 'load', timeout: 60000 }); await p.waitForTimeout(1500);
    const H = await p.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < H; y += 400) { await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(120); }
    await p.waitForTimeout(1500);
    const r = await p.evaluate(() => ({ rv: document.querySelectorAll('.rv.in').length + '/' + document.querySelectorAll('.rv').length,
      imgs: [...document.images].map(i => i.naturalWidth).join(','), overflow: document.documentElement.scrollWidth - innerWidth,
      rows: document.querySelectorAll('.prow').length, status: document.getElementById('status').textContent }));
    r.search = [];
    for (const t of ['krona', '101', 'tandsten', 'xyz', '']) {
      await p.fill('#q', t); await p.waitForTimeout(500);
      r.search.push(t + '=' + await p.evaluate(() => document.querySelectorAll('.prow').length + '/' + document.getElementById('count').textContent));
    }
    await p.click('#chips button:nth-child(9)'); await p.waitForTimeout(500);
    r.chip = await p.evaluate(() => document.querySelector('#chips [aria-pressed=true]').textContent + ':' + document.querySelectorAll('.prow').length);
    if (m) { await p.evaluate(() => scrollTo(0, 0)); await p.click('.menu'); await p.waitForTimeout(200); r.menu = await p.evaluate(() => getComputedStyle(document.getElementById('nav')).display); }
    console.log(n, JSON.stringify(r), 'errors', errs);
  }
  await b.close();
})();
