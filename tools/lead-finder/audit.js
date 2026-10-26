// Audit each clinic website: mobile + desktop screenshots and outdated-design signals.
const { chromium } = require('playwright');
const fs = require('fs');
const clinics = JSON.parse(fs.readFileSync('clinics.json'));
const seen = new Set();
const sites = clinics.filter(c => {
  if (!c.website || /1177\.se|rvn\.se/.test(c.website)) return false;
  const host = new URL(c.website.startsWith('http') ? c.website : 'http://' + c.website).hostname.replace(/^www\./, '');
  if (seen.has(host)) return false; seen.add(host); c.host = host; return true;
});
(async () => {
  const browser = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY || process.env.https_proxy } });
  const out = [];
  for (const c of sites) {
    const r = { ...c };
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148', ignoreHTTPSErrors: true });
    const page = await ctx.newPage();
    try {
      // The sandbox proxy only tunnels HTTPS; a site that fails here likely has no working SSL.
      const url = 'https://' + c.website.replace(/^https?:\/\//, '');
      const t0 = Date.now();
      await page.goto(url, { waitUntil: 'load', timeout: 30000 });
      r.loadMs = Date.now() - t0;
      r.finalUrl = page.url();
      r.https = r.finalUrl.startsWith('https://');
      Object.assign(r, await page.evaluate(() => {
        const html = document.documentElement.outerHTML;
        const text = document.body ? document.body.innerText : '';
        const years = (text.match(/(?:©|copyright|\(c\))\s*(?:\d{4}\s*[-–]\s*)?(\d{4})/gi) || []).map(s => +s.match(/(\d{4})(?!.*\d{4})/)[1]);
        const gen = document.querySelector('meta[name=generator]');
        const p = document.querySelector('main p, article p, p');
        return {
          title: document.title,
          viewport: !!document.querySelector('meta[name=viewport]'),
          overflow: document.documentElement.scrollWidth > window.innerWidth + 5,
          copyrightYear: years.length ? Math.max(...years) : null,
          generator: gen ? gen.content : null,
          wordpress: /wp-content/.test(html), wix: /wix\.com|wixstatic/.test(html), squarespace: /squarespace/.test(html),
          sitevision: /sitevision/i.test(html), oldJquery: /jquery[.-]?1\.\d/i.test(html), tables: document.querySelectorAll('table').length,
          booking: /muntra|bokadirekt|boka tid online|boka online|onlinebokning|webbokning|opusdental|boka.?tid/i.test(html),
          bodyFont: p ? parseFloat(getComputedStyle(p).fontSize) : null,
          emails: [...new Set((html.match(/[\w.+-]+@[\w-]+\.[\w.]+/g) || []).filter(e => !/\.(png|jpg|webp|svg)$|sentry|example|wixpress/i.test(e)))].slice(0, 3),
          words: text.split(/\s+/).length,
        };
      }));
      await page.screenshot({ path: `shots/${c.host}-m.png` });
      await page.setViewportSize({ width: 1366, height: 800 });
      await page.waitForTimeout(500);
      await page.screenshot({ path: `shots/${c.host}-d.png` });
    } catch (e) { r.error = String(e.message).slice(0, 120); }
    await ctx.close();
    out.push(r);
    console.log(JSON.stringify({ host: r.host, loadMs: r.loadMs, https: r.https, vp: r.viewport, of: r.overflow, yr: r.copyrightYear, wp: r.wordpress, wix: r.wix, bk: r.booking, err: r.error }));
  }
  fs.writeFileSync('audit.json', JSON.stringify(out, null, 1));
  await browser.close();
})();
