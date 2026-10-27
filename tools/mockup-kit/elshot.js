// node elshot.js URL outprefix width sel1 sel2 ... : screenshot elements after revealing everything
const { chromium } = require('playwright');
(async () => {
  const [url, pre, w, ...sels] = process.argv.slice(2);
  const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  const p = await (await b.newContext({ viewport: { width: +w, height: 900 }, deviceScaleFactor: 1, isMobile: +w < 600 })).newPage();
  await p.goto(url, { waitUntil: 'load', timeout: 60000 });
  const H = await p.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < H; y += 400) { await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(120); }
  await p.waitForTimeout(1500);
  for (const [i, s] of sels.entries()) { const el = await p.$(s); if (!el) { console.log('missing', s); continue; } await el.screenshot({ path: `${pre}-${i}.png` }); console.log('saved', `${pre}-${i}.png`, s); }
  await b.close();
})();
