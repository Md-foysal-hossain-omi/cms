// Viewport screenshots (desktop + mobile) of a live URL: livecap.js url outprefix
const { chromium } = require('playwright');
(async () => {
  const [url, out] = process.argv.slice(2);
  const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  for (const [n, vp, m] of [['d', { width: 1440, height: 900 }, false], ['m', { width: 390, height: 844 }, true]]) {
    const p = await (await b.newContext({ viewport: vp, isMobile: m })).newPage();
    await p.goto(url, { waitUntil: 'load', timeout: 60000 }); await p.waitForTimeout(3500);
    await p.screenshot({ path: `${out}-${n}.png` });
    console.log('saved', `${out}-${n}.png`, await p.title());
  }
  await b.close();
})();
