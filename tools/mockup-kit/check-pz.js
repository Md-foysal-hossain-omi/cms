// Site checks for Plaza: Invisalign level switch, 10-tandvården year check, reveals, images.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  for (const [n, vp, m] of [['desktop', { width: 1440, height: 900 }, false], ['mobile', { width: 390, height: 844 }, true]]) {
    const p = await (await b.newContext({ viewport: vp, isMobile: m })).newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', c => c.type() === 'error' && errs.push(c.text()));
    await p.goto(process.argv[2], { waitUntil: 'load', timeout: 60000 }); await p.waitForTimeout(1200);
    const H = await p.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < H; y += 400) { await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(120); }
    await p.waitForTimeout(1500);
    const r = await p.evaluate(() => ({ rv: document.querySelectorAll('.rv.in').length + '/' + document.querySelectorAll('.rv').length,
      bad: [...document.images].filter(i => !i.naturalWidth).map(i => i.src.split('/').pop()), n: document.images.length, overflow: document.documentElement.scrollWidth - innerWidth }));
    r.levels = [];
    for (const i of [0, 1, 2, 3]) {
      await p.click(`.levels button[data-l="${i}"]`); await p.waitForTimeout(900);
      r.levels.push(await p.evaluate(() => [document.getElementById('lname').textContent.replace('Invisalign® ', ''), document.getElementById('lprice').textContent, document.getElementById('lskenor').textContent, Math.round(parseFloat(getComputedStyle(document.getElementById('lbar')).width))].join(' | ')));
    }
    r.ten = [];
    for (const y of ['1955', '1959', '1960', '1990', '']) {
      await p.fill('#born', y); await p.waitForTimeout(150);
      r.ten.push(y + '=' + await p.evaluate(() => document.getElementById('ans').textContent));
    }
    if (m) { await p.evaluate(() => scrollTo(0, 0)); await p.click('.menu'); await p.waitForTimeout(200); r.menu = await p.evaluate(() => getComputedStyle(document.getElementById('nav')).display); }
    console.log(n, JSON.stringify(r, null, 1), 'errors', errs);
  }
  await b.close();
})();
