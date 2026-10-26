const { chromium } = require('playwright');
const urls = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  for (const u of urls) {
    const ctx = await b.newContext({ viewport: { width: 1366, height: 800 }, ignoreHTTPSErrors: true });
    const p = await ctx.newPage();
    try {
      const r = await p.goto(u, { waitUntil: 'load', timeout: 40000 });
      await p.waitForTimeout(2500);
      const name = u.replace(/https?:\/\//, '').replace(/[\/:]/g, '_');
      await p.screenshot({ path: `shots/re-${name}.png` });
      const info = await p.evaluate(() => ({ title: document.title, text: document.body.innerText.slice(0, 600).replace(/\s+/g, ' '),
        mails: [...new Set((document.documentElement.outerHTML.match(/[\w.+-]+@[\w-]+\.[a-z.]{2,}/gi) || []))].slice(0, 4) }));
      console.log(u, r && r.status(), JSON.stringify(info));
    } catch (e) { console.log(u, 'ERR', e.message.slice(0, 100)); }
    await ctx.close();
  }
  await b.close();
})();
