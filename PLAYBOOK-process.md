# PLAYBOOK: how to build a redesign proposal and win the client

For a new AI session. You do not need the history of the earlier chat, only the process. If you have a better plan, apply it, but keep the honesty rules.

## 1. Who and what
- Owner: **Foysal Hossain Omi** ("Foysal"), Bangladesh-based freelancer, **Foysal Solutions** (web design, SEO, Shopify apps). He writes Bengali (often voice-typed and garbled): **reply to him in Bengali**; client-facing text in **Swedish** (English if the client is international).
- Goal: win Swedish web-design clients. Target: **owner-run dental clinics with outdated websites**. For each one we build a full redesign proposal with the **same content and the clinic's own real photos**, host it on Foysal's Vercel, then he emails the owner a short note with the link.
- Foysal sends the emails himself from Gmail (section 7). He has given blanket approval to finish work without asking again, so do not ask permission at every step.
- Work style he demands: **do not rush**. Finish one site, re-check it, fix, re-check until perfect on desktop (1440 px) and mobile (390 px), then start the next. Report everything together at the end, with all live links.

## 2. Pipeline per lead
1. **Find the lead.** Independent clinic, owner-run, site clearly dated or broken. Skip chains (Praktikertjänst, Folktandvården etc.) because the group controls the website.
2. **Check the company form** (allabolag.se, bolagsfakta, the site's footer). AB/HB = B2B email is fine with an opt-out line. **Enskild firma = private person under Swedish marketing law**: phone or letter first, email only after consent.
3. **Crawl the old site** (`tools/mockup-kit/crawl3.js`): copy all text, prices, hours, team, and download the clinic's **real photos**. Screenshot the old site at mobile and desktop (`shot2.js`) into `research/leads/screens/`.
4. **Audit and write down only problems you verified on the live old site** (broken images, menu over the headline on mobile, shortcode shown as text, hidden prices, typos, old year in footer, two postcodes). These become the hook in the email. Never invent a problem.
5. **Design the proposal** as one `mockups/<name>/index.html` plus a short `DESIGN.md` (palette, fonts, the memorable element, where content came from).
6. **Check it** with the check scripts, fix, repeat until clean.
7. **Deploy** to Vercel as `<name>-forslag.vercel.app` (section 5), then run the checks against the **live URL**.
8. **Make the outreach kit** in `research/leads/outreach/NN-name/`: `email.md`, `followups.md`, `signature.html`, `fore-efter-mobil.jpg` (before/after phone image).
9. Update `HANDOVER.md`, commit, push.

## 3. Design rules (use the `frontend-design` skill)
- Each site gets its **own palette and font pairing**. Avoid the generic combo of cream + serif + terracotta, one italic accent word in every headline, ALL-CAPS eyebrow labels, 01/02/03 numbering unless it is a real sequence, and rows of identical SaaS-style cards.
- Each page gets **one memorable, useful element built from the clinic's real facts**. Already built: a cost slider from the clinic's own price tiers (lead 4), a flipping postcard because the clinic recalls patients by postcard (5), a searchable 69-code price list (6), a "phone is open now" card using Swedish time and their phone hours (9), an Invisalign level comparer with their fixed prices (10).
- Premium and animated, but honour `prefers-reduced-motion`. Mobile-first: no horizontal scroll, no wrapped prices (`white-space:nowrap`), big tap targets.
- Same content as the old site. Only the clinic's real photos. **Never fabricate photos, reviews, prices or facts.**
- Pitfalls met: never `clip-path` an image watched by an IntersectionObserver (use an `::after` cover); watch CSS selector collisions (`.fact span` also hit a nested counter, use `.fact > span`); hide empty calculator zones; sticky elements need a bounded scroll container.
- Every proposal has a small **"Designförslag" banner** and `<meta name="robots" content="noindex">`.

## 4. Verification toolkit (`tools/mockup-kit/`)
Needs Playwright Chromium (pre-installed). In the sandbox launch with `proxy:{server:process.env.HTTPS_PROXY}` and use https URLs.
- `crawl3.js` crawl and download assets, `shot2.js` screenshots, `livecap.js` capture a live URL, `elshot.js` element screenshot
- `check.js <url>` generic: console errors, overflow at 390 and 1440, broken images, reveal animations
- `check-th.js`, `check-ms.js`, `check-ek.js`, `check-nr.js`, `check-pz.js`: per-site feature tests (slider, flip card, search, open-now logic, comparer)
- `kit.py old.png new.png out.jpg '#hex'` builds the before/after phone image used inline in the email
Done means: zero console errors, zero horizontal overflow, all images load, every interactive feature tested, and screenshots eyeballed at both widths.

## 5. Deploy to Vercel (through the Vercel MCP)
Team id `team_z4QWny6TVhlgYNMRPOiIt1yZ` (scope "best-world2").
1. `create_deployment` with `teamId`, `skipAutoDetectionConfirmation:"1"` and body
   `{name:"<name>-forslag", target:"production", projectSettings:{framework:null,buildCommand:null,installCommand:null,outputDirectory:null,devCommand:null,rootDirectory:null}, files:[{file:"index.html", encoding:"utf-8", data:"<html>"}]}`
   (gitSource deploys fail. The HTML goes inline as one file.)
2. `update_project` with `{"ssoProtection": null}` so the public can open the link (new projects are login-protected by default).
3. On 403, call `authorize_team_access`; Foysal approves the one-time link in a browser within 10 minutes.
4. Test the live URL with the check scripts.
Never publish proposals as claude.ai Artifacts; they live only on Foysal's Vercel.

## 6. Email principles
- **Subject = recipient's first name + "?"** (looks personal, high open rate).
- About 70 to 80 words, Swedish, one link, one inline image (before/after phone image pasted into the body, not attached). No attachments on a first cold email.
- Structure: who I am in one sentence; what I made and the link; the before/after image; **one or two real problems found on their own site** (proof you looked); a one-line question ("Vill du att jag gör förslaget till er riktiga hemsida?"); sign-off; opt-out line.
- Two follow-ups as replies in the same thread: day 4 and day 10, no new image or links. If "ja": answer the same day, offer a 10-minute call and a fixed price. If "nej": thank in one line, close the lead.
- Send Tue to Thu, 08:00 to 10:00 Swedish time, 2 to 3 cold emails a day at first. Open the link on a phone before sending.

## 7. Sending setup (done by Foysal)
Gmail "Send mail as" through Brevo SMTP (`smtp-relay.brevo.com:587`) from his @foysalsolutions.com address. DNS checked 27 Oct 2026: MX (Cloudflare) OK, DKIM brevo1/brevo2 OK, DMARC `p=none` OK, SPF needed `include:spf.brevo.com` (Foysal says he has handled it; see `research/leads/outreach/SENDING-SETUP.md`). Aim for mail-tester 9/10 or better. **Never ask for, print or store the SMTP key or any token.** With a Gmail connector, prefer creating drafts for Foysal to review, and send only if he explicitly says to.

## 8. Legal and honesty rules (non-negotiable)
- Company form check before any email. Enskild firma: phone or letter first.
- Only claim problems you verified live, and date them ("checked 26 Oct 2026").
- Real content and photos only. No fake testimonials.
- No secrets in chat or commits.

## 9. Where things are
- `HANDOVER.md` full background and lead status · `EMAILS-all-leads.md` every email, subject, recipient, link
- `mockups/<name>/` the sites · `research/leads/2026-10-26-sweden-dentists-top10.md` lead research · `research/leads/outreach/` per-lead kits · `research/leads/screens/` old-site screenshots · `tools/mockup-kit/` scripts
- Repo `md-foysal-hossain-omi/cms`, branch `claude/pensive-ritchie-83vc1b`.

## 10. Improving on this
Better plans welcome: other niches (physio, vets, salons, restaurants), sharper hooks, A/B tests of subjects, a `forslag.` sending subdomain, reply tracking. Keep the loop: real content, verified problems, one useful interactive element, perfect on mobile, short personal email.
