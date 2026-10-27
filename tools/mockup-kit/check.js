// Interaction checks: reveal/timeline, accordion, tabs, marquee, images, overflow.
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  for (const [n, vp, m] of [['desktop', { width: 1440, height: 900 }, false], ['mobile', { width: 390, height: 844 }, true]]) {
    const p = await (await b.newContext({ viewport: vp, isMobile: m })).newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto(process.argv[2], { waitUntil: 'load', timeout: 60000 }); await p.waitForTimeout(2500);
    const H = await p.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < H; y += 450) { await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(180); }
    await p.waitForTimeout(1500);
    const r = await p.evaluate(() => {
      const imgs = [...document.images]; const bad = imgs.filter(i => !i.naturalWidth).map(i => i.src.split('/').pop());
      const tl = document.querySelector('.timeline'); 
      return { imgs: imgs.length, bad, overflow: document.documentElement.scrollWidth - innerWidth,
        lit: tl ? document.querySelectorAll('.timeline li.lit').length + '/' + document.querySelectorAll('.timeline li').length : '-',
        bar: tl ? getComputedStyle(tl.querySelector('.progress')).height : '-',
        reveals: document.querySelectorAll('.reveal').length ? document.querySelectorAll('.reveal.in').length + '/' + document.querySelectorAll('.reveal').length : '-' };
    });
    // tabs
    const tab = await p.$('[role="tab"][aria-selected="false"]');
    if (tab) { await tab.scrollIntoViewIfNeeded(); await tab.click(); await p.waitForTimeout(300); r.tab = await p.evaluate(() => [...document.querySelectorAll('[role="tabpanel"]')].map(x => x.hidden ? 'hidden' : 'shown').join(',')); }
    // accordion
    const sum = await p.$$('details summary');
    if (sum.length > 1) { await sum[1].scrollIntoViewIfNeeded(); await sum[1].click(); await p.waitForTimeout(300); r.details = await p.evaluate(() => [...document.querySelectorAll('details')].filter(d => d.open).length); }
    // marquee moving
    const mq = await p.$('.marquee');
    if (mq) { const a = await p.evaluate(() => getComputedStyle(document.querySelector('.marquee')).transform); await p.waitForTimeout(800); const c = await p.evaluate(() => getComputedStyle(document.querySelector('.marquee')).transform); r.marquee = a !== c ? 'moving' : 'static'; }
    // menu on mobile
    if (m) { await p.evaluate(() => scrollTo(0, 0)); await p.click('.menu'); await p.waitForTimeout(200); r.menu = await p.evaluate(() => getComputedStyle(document.querySelector('.nav, nav')).display); }
    console.log(n, JSON.stringify(r), 'errors', errs);
  }
  await b.close();
})();
