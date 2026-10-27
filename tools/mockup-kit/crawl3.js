// Generic crawler: follow same-site links (with or without www), save text, images, screenshots.
const { chromium } = require('playwright');
const fs = require('fs');
const [base, dir, max = 20] = process.argv.slice(2);
fs.mkdirSync(dir, { recursive: true });
const root = new URL(base).hostname.replace(/^www\./, '');
(async () => {
  const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  const p = await (await b.newContext({ viewport: { width: 1366, height: 900 }, ignoreHTTPSErrors: true })).newPage();
  const queue = [base], seen = new Set(), out = {};
  while (queue.length && seen.size < +max) {
    const u = queue.shift().split('#')[0].replace(/^http:/, 'https:');
    if (seen.has(u)) continue; seen.add(u);
    try {
      const r = await p.goto(u, { waitUntil: 'load', timeout: 60000 }); await p.waitForTimeout(1500);
      const d = await p.evaluate(() => ({ title: document.title, text: document.body.innerText,
        imgs: [...document.querySelectorAll('img')].map(i => i.getAttribute('src') || '').filter(Boolean),
        bgs: [...document.querySelectorAll('*')].map(e => getComputedStyle(e).backgroundImage).filter(x => x.includes('url(') && !x.includes('gradient')).slice(0, 15),
        links: [...document.querySelectorAll('a[href]')].map(a => a.href) }));
      out[u] = { status: r.status(), ...d };
      const name = (new URL(u).pathname.replace(/\W+/g, '_').replace(/^_|_$/g, '')) || 'home';
      await p.screenshot({ path: `${dir}/${name}.png`, fullPage: true });
      console.log('PAGE', r.status(), u, d.text.length);
      for (const l of d.links) {
        try { const x = new URL(l); if (x.hostname.replace(/^www\./, '') === root && !/\.(pdf|jpe?g|png|webp|docx?|pptx?)$|wp-(login|admin)|feed|\?/.test(x.pathname + x.search)) queue.push(x.href); } catch {}
      }
    } catch (e) { console.log('ERR', u, e.message.slice(0, 80)); }
  }
  fs.writeFileSync(`${dir}/site.json`, JSON.stringify(out, null, 1)); await b.close();
})();
