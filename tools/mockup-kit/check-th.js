// Site checks for Tandhälsan: reveals, calculator math, picker keyboard, opening status.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  for (const [n, vp, m] of [['desktop', { width: 1440, height: 900 }, false], ['mobile', { width: 390, height: 844 }, true]]) {
    const p = await (await b.newContext({ viewport: vp, isMobile: m })).newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', c => c.type() === 'error' && errs.push(c.text()));
    await p.goto(process.argv[2], { waitUntil: 'load', timeout: 60000 }); await p.waitForTimeout(1500);
    const H = await p.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < H; y += 400) { await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(150); }
    await p.waitForTimeout(1600);
    const r = await p.evaluate(() => ({
      rv: document.querySelectorAll('.rv.in').length + '/' + document.querySelectorAll('.rv').length,
      cover: document.querySelectorAll('.cover.in').length + '/' + document.querySelectorAll('.cover').length,
      counts: [...document.querySelectorAll('[data-count]')].map(e => e.textContent).join(','),
      status: document.getElementById('status').textContent, fri: document.getElementById('friTime').textContent,
      today: document.querySelector('#hours tr.today td')?.textContent,
    }));
    r.calc = [];
    for (const v of [0, 2000, 8000, 20000, 40000]) {
      await p.evaluate(v => { const s = document.getElementById('price'); s.value = v; s.dispatchEvent(new Event('input')); }, v);
      await p.waitForTimeout(700);
      r.calc.push(await p.evaluate(() => [document.getElementById('priceOut').textContent, document.getElementById('you').textContent, document.getElementById('state').textContent, [...document.querySelectorAll('.zone')].map(z => Math.round(z.getBoundingClientRect().width)).join('/')].join(' ')));
    }
    await p.focus('#t-und'); await p.keyboard.press('ArrowDown'); await p.keyboard.press('ArrowDown');
    r.kbd = await p.evaluate(() => document.activeElement.id + ' ' + [...document.querySelectorAll('[role=tabpanel]')].filter(x => !x.hidden).map(x => x.id));
    console.log(n, JSON.stringify(r, null, 1), 'errors', errs);
  }
  await b.close();
})();
