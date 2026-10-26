# Lead finder (Swedish clinics with outdated websites)

1. `python3 collect.py orebro,vasteras,gavle clinics.json`
   Reads varden.se city lists and saves each clinic's website, phone, email and reviews.
   Chains and group templates (Folktandvården, Smile, Praktikertjänst ...) are skipped.
2. `node audit.js`
   Opens every website on mobile and desktop, saves screenshots to `shots/`,
   and writes `audit.json` (load time, mobile viewport, copyright year, CMS, online booking).
3. `node recheck.js <url> ...` screenshots single pages again.

Playwright must be installed. In the Claude cloud sandbox, Chromium needs the HTTPS proxy
(already set in `audit.js`) and only HTTPS sites can be opened.
For another niche, change `tandlakare-c` in `collect.py` (for example `fysioterapeut-c`).
