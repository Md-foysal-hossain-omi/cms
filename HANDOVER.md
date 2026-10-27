# Handover: Foysal Solutions, lead generation and Shopify apps

Last updated: 2026-10-27 (second update: lead 6 company form, SPF check). Written for the next AI assistant (or person) taking over this work.
Read this first, then the files it points to. Everything named here is committed in this repo
(`md-foysal-hossain-omi/cms`, branch `claude/pensive-ritchie-83vc1b`).

> **বাংলায় সংক্ষেপে:** সুইডেনের ছোট, মালিক-চালিত ডেন্টাল ক্লিনিকগুলোর জন্য নতুন ওয়েবসাইটের প্রস্তাব (mockup) বানিয়ে Vercel এ লাইভ করা হচ্ছে, তারপর মালিককে ছোট ইমেইল পাঠানো হবে। ৬টা লিডের ডিজাইন আর ইমেইল কিট রেডি। ৩টা লাইভ, বাকি ৩টা (#4, #5, #6) Vercel টিম অ্যাক্সেস অনুমোদনের অপেক্ষায়। এর পাশাপাশি Shopify অ্যাপ নিয়ে রিসার্চ আর প্ল্যান করা আছে।

---

## 1. Who the user is

- **Name:** Foysal Hossain Omi (signs emails as "Foysal"). Bangladesh-based freelancer.
- **Business:** Foysal Solutions. Web design, SEO (AEO / GEO / LLM SEO), Shopify apps.
- **Email on file:** seoexpertomi@gmail.com (identity only; never send it to third-party services).
- **Business domain:** foysalsolutions.com (DNS on Cloudflare). Cloudflare Workers seen in the account: `foysalsolutions`, `prepday-site`, `omi-portfolio`.
- **Public profiles** (used in the email signature):
  - Website: https://foysalsolutions.com/
  - Portfolio: https://omi.foysalsolutions.com/
  - WhatsApp: +880 1518 979359 (https://wa.me/8801518979359)
  - LinkedIn: https://www.linkedin.com/in/seo-expert-foysal-omi/
  - Upwork: https://www.upwork.com/freelancers/~01a63de7c725a897f9
  - PeoplePerHour: https://www.peopleperhour.com/freelancer/marketing-seo/md_foysal_hosssain-omi-aeo-seo-expert-aio-llm-geo-expert-zzjvmxjq
- **Live Shopify app:** WinBack Customer CRM (`apps.shopify.com/sales-crm-insights`). RFM segments for D2C stores, Klaviyo/Mailchimp sync, $30 per 30 days, 7-day trial. New app ideas must not overlap with it.

### How the user likes to work

- Writes in **Bengali** (sometimes mixed English, sometimes voice-typed, so words can be garbled). **Reply in Bengali.** Keep files and client-facing text in English or Swedish.
- Wants quality over speed: "don't rush; finish one, check it again, fix every mistake, keep checking until it's perfect, then move to the next; report all of them together at the end."
- Has given **full approval to proceed without asking** ("আমার তরফ থেকে 100% অ্যাপ্রুভাল আছে"). Don't ask for confirmation on normal steps. Only stop for things only they can do (browser approvals, sending emails, payments).
- Likes premium, animated, distinctive designs with the clinic's **own** real content and photos.
- Sends the emails themselves from their business address. The assistant prepares everything.

---

## 2. Current main work: Swedish dentist lead generation

### The method

1. Find owner-run private dental clinics in mid-size Swedish cities with outdated websites. Exclude chains and Praktikertjänst clinics, whose dentists can't buy a site. Full list and reasoning: `research/leads/2026-10-26-sweden-dentists-top10.md`. Lead-finder scripts: `tools/lead-finder/`.
2. Crawl the clinic's site. Build a redesign that keeps the **same content**, uses their real photos (hotlinked over https from their own server), is premium and animated, and has one memorable element per site.
3. Check it until it's perfect, on desktop at 1440 px and mobile at 390 px:
   - all images load
   - no horizontal overflow
   - no JS errors
   - every interaction works
   - viewed as screenshots
4. Deploy to Vercel as `<clinic>-forslag.vercel.app` with a "Designförslag" banner and `noindex`.
5. Build an outreach kit: `email.md` (subject = first name + "?"), `followups.md`, `signature.html`, and `fore-efter-mobil.jpg`. The image shows their current mobile site next to the proposal.

### Status of the 6 leads

| # | Clinic, city | Owner (subject) | Company form | Mockup folder | Live URL | Status |
|---|---|---|---|---|---|---|
| 1 | Västerås Tandhälsa AB, Västerås | Omar Aljoudi ("Omar?") | AB | `mockups/vasteras-tandhalsa/` (deploy file: `deploy-index.html`) | https://vasteras-tandhalsa-forslag.vercel.app | Live, kit ready |
| 2 | Tandvård vid Svartån AB, Västerås | Henrik Skage ("Henrik?") | AB | `mockups/tandvard-vid-svartan/` | https://tandvard-vid-svartan-forslag.vercel.app | Live, kit ready |
| 3 | Tandläkare Sköldenklint AB, Kalmar + Mönsterås | Mikael Sköldenklint ("Mikael?") | AB (Hitta) | `mockups/skoldenklint/` | https://skoldenklint-forslag.vercel.app | Live and re-verified, kit ready |
| 4 | Tandhälsan i Eskilstuna (Tigran Capital AB) | David Karapetjan ("David?") | AB (own Företagsfakta page) | `mockups/tandhalsan-eskilstuna/` | planned: tandhalsan-eskilstuna-forslag.vercel.app | **Built and checked. NOT deployed** |
| 5 | Leg tandläkare Maria Sjökvist AB, Gävle | Maria Sjökvist ("Maria?") | AB (name on site) | `mockups/maria-sjokvist/` | planned: maria-sjokvist-forslag.vercel.app | **Built and checked. NOT deployed** |
| 6 | Tandläkarmottagning Ekersgatan 7, Örebro | Matti Koivuniemi ("Matti?") | **Enskild firma** (org.nr 641102-XXXX, "Innehavare"): phone first, no cold email | `mockups/ekersgatan-7/` | planned: ekersgatan-7-forslag.vercel.app | **Built and checked. NOT deployed** |

Outreach kits: `research/leads/outreach/01-…` to `06-…`. Each `email.md` contains:
- the Swedish email
- a Bangla translation
- a proof table for every claim
- a pre-send checklist

Each lead's `DESIGN.md` has its palette, type, the memorable element and build notes.

The memorable element per site:
- #1: a "Vad gäller ditt besök?" visit chooser.
- #2: the clinic's pen drawing of their houses, drawn on river-dark water.
- #3: a "Sedan 1974" family timeline that draws itself as you scroll.
- #4: a "Vad betalar jag?" slider that shows how the state high-cost protection splits a treatment's reference price. Rules: up to 3 000 kr the patient pays all, 3 001–15 000 kr 50 %, over 15 000 kr 15 %.
- #5: a 3D-flipping postcard; the clinic really calls patients in by postcard.
- #6: a searchable price list with all 69 reference-price codes, collected from 12 separate pages.

Leads 7–10 (worked 27 Oct):

| # | Clinic | Status |
|---|---|---|
| 7 | Lars-Göran Jonson, Sundsvall | **Dropped**: Praktikertjänst AB |
| 8 | Amaliakliniken, Halmstad | **Dropped**: Praktikertjänst AB (site on ptj.se) |
| 9 | Tandläkarna Norenius HB, Västerås | Built and checked: `mockups/norenius/`, kit `outreach/09-norenius/` ("Sandra?", phone first: no email on their site). Memorable: live "Telefonen är öppen nu" card. Planned URL norenius-forslag.vercel.app. **NOT deployed** |
| 10 | Plaza Tandvård AB, Borås | Built and checked: `mockups/plaza-tandvard/`, kit `outreach/10-plaza-tandvard/` ("Andreas?"). Memorable: Invisalign level comparer + 10-tandvården year check. Weakest lead (agency site). Planned URL plaza-tandvard-forslag.vercel.app. **NOT deployed** |

Always check the company form **before** designing (Praktikertjänst = skip, enskild firma = phone first).

### Immediate next steps

1. **Deploy #4, #5, #6, #9 and #10.** Vercel's MCP connection lost team access after a session restart. Every call returns 403 "Trying to access resource under scope best-world2".
   - Fix: call `mcp__Vercel__authorize_team_access` with teamId `team_z4QWny6TVhlgYNMRPOiIt1yZ`. Give the user the link it returns; they must approve it in a browser, and it expires in 10 minutes. Then retry.
   - The last link given was `https://vercel.com/sso/session-requests/UZv9avF5zD6da5P-VsDOrBPeidD5csPd`. It has probably expired, so make a new one.
2. Deploy method (gitSource deploys fail because the Vercel GitHub app has no repo access):
   - `mcp__Vercel__create_deployment` with `teamId`, `skipAutoDetectionConfirmation: "1"`, and requestBody `{name: "<project>", target: "production", projectSettings: {framework: null, buildCommand: null, installCommand: null, outputDirectory: null, devCommand: null, rootDirectory: null}, files: [{file: "index.html", encoding: "utf-8", data: <html>}]}`.
   - To save tokens, you can trim leading whitespace from each line first; the page has no `<pre>` blocks.
   - Then `mcp__Vercel__update_project` with `{"ssoProtection": null}`. New projects are behind Vercel login by default, so strangers can't open them until this is set.
   - Then `get_deployment` until READY. Open the public URL and re-run the checks on the live URL.
   - If Vercel gives a different URL than planned, update `email.md` and `followups.md` for that lead.
3. After the deploys, regenerate each `fore-efter-mobil.jpg` from the **live** URL. The current ones were made from the local file, which looks the same.
4. Report to the user in Bengali: all links, subjects, notes.
5. **Lead #6** is an enskild firma (confirmed 27 Oct via allabolag/bolagsfakta). Phone first, email only after a yes, otherwise the letter. Everything is in its `email.md`.

---

## 3. Email sending setup (user's side)

- Sender: an address on foysalsolutions.com. Cloudflare Email Routing only **receives**. Sending is planned through Gmail "Send mail as" with Brevo SMTP (`smtp-relay.brevo.com:587`).
- DNS seen on 26 Oct:
  - Cloudflare MX
  - Brevo DKIM (CNAMEs `brevo1` / `brevo2`)
  - DMARC `p=none` with rua to Brevo
  - SPF (checked 27 Oct): `v=spf1 include:_spf.mx.cloudflare.net include:_spf.google.com ~all`. Brevo is still missing; the exact new record is in `research/leads/outreach/SENDING-SETUP.md`.
- Advice already given:
  - Test on mail-tester.com and only send at 9/10 or higher.
  - Send 2–3 cold emails a day at first.
  - Send Tuesday to Thursday, 08:00–10:00 Swedish time.
  - One link and one inline image; no attachments.
  - Consider moving proposals to a subdomain such as `forslag.foysalsolutions.com`. Spam filters trust it more than vercel.app.
- **Never** ask for, print or store secrets (Brevo SMTP key, Vercel tokens).
- Swedish law: B2B email to an AB or HB is fine with an opt-out line ("Inte intresserad? Svara "nej" …"). An enskild firma counts as a private person, so call or send a letter instead.
- Price anchor for a small clinic site: about 15 000–30 000 SEK, plus optional monthly care.

---

## 4. Rules and lessons for building mockups

**Content and honesty**
- Use the clinic's real text, photos, hours and contacts. Don't invent facts, reviews, staff names or prices. Leave out anything unclear; for example, #5 shows no postal code because the site shows two different ones.
- Never fabricate or AI-generate photos of real people. If no good photo exists, use a clinic photo plus a small avatar.
- Mockups use real clinic branding. Host them only on the user's Vercel, with the "Designförslag" banner, a "not the official site" footer and `noindex`. **Don't publish them as claude.ai Artifacts.**
- In emails, only mention problems verified on the live site. For example, #4's "404" claim was dropped because it couldn't be confirmed.

**Design**
- Every site gets a distinct palette and font pair. Already used:
  - #1: Familjen Grotesk
  - #2: Cormorant + Schibsted Grotesk
  - #3: Red Hat
  - #4: Bricolage Grotesque + Figtree
  - #5: Newsreader + Public Sans
  - #6: Archivo (expanded)
- Avoid these generic choices (from the frontend-design skill in `.claude/skills/frontend-design/`):
  - cream + serif + terracotta palettes
  - one italic accent word in a headline
  - ALL-CAPS eyebrow labels
  - 01/02 numbering unless the steps really are a sequence
  - rows of identical SaaS cards

**Technical gotchas**
- Never `clip-path` the observed image itself. Chrome's IntersectionObserver never fires, so lazy images never load. Reveal with a `::after` cover in the section colour instead.
- Watch selector collisions: `.fact span` hit a nested counter span; `.trust div` also hit `.wrap`.
- Logos with a white background on dark sections: use an SVG feColorMatrix filter. Transparent PNG logos can use `filter: brightness(0) invert(1)`.
- Open/closed status uses `Intl.DateTimeFormat` with `timeZone: 'Europe/Stockholm'`.
- Respect `prefers-reduced-motion`.
- Playwright Chromium must be launched with `{proxy: {server: process.env.HTTPS_PROXY}}` and https URLs. Plain http gets a 405 from the proxy.
- One.com images (#5) come from `impro.usercontent.one/...` and need their `etag` query string.

**Helper scripts** (copied to `tools/mockup-kit/`; run from a working folder):
- `crawl3.js URL outdir max`: crawls the site to `site.json`, with page screenshots.
- `shot2.js /abs/index.html outdir`: full-page screenshots `sv-desktop.png` and `sv-mobile.png`.
- `check.js URL`: images, overflow, tabs, accordion, marquee, menu.
- `check-th.js`, `check-ms.js`, `check-ek.js`: site-specific checks for #4, #5 and #6.
- `elshot.js URL prefix width sel...`: screenshots of single elements.
- `livecap.js URL prefix`: viewport screenshots (`prefix-d.png`, `prefix-m.png`).
- `kit.py old.png new.png out.jpg '#hex'`: builds the before/after image. Old-site screenshots for all 10 leads are in `research/leads/screens/<host>-m.png` (mobile) and `-d.png` (desktop).

---

## 5. Earlier work (done, for context)

| Topic | File | Summary |
|---|---|---|
| E-invoicing app idea (Saudi ZATCA + Malaysia MyInvois) | `research/2026-10-26-einvoice-validation-plan.md` | 1-week validation plan; test Saudi first (Wave 25 from 1 Feb 2027). No code. |
| B2B reorder app "Reorder Radar" | `research/2026-10-26-b2b-reorder-app-plan.md`, `apps/b2b-reorder/` | Flags B2B accounts that are late to reorder, per product and per location. Kept separate from WinBack. Engine plus tests written in TypeScript. Main rival: Repeatly ($149/mo). |
| 30 easy/medium Shopify app ideas | `research/2026-10-26-30-easy-app-ideas.md` | Every idea is backed by a rival with 10+ reviews, plus a 1–30 build order. Top picks: Bangladesh courier booking, COD OTP/WhatsApp verification, hide payment/shipping methods, Bangla/Arabic PDF invoice. |
| 3D office page | `office-3d/index.html` | Walk-through 3D office for Foysal Solutions; earlier work. |

The user also briefly considered lead generation for Bangladesh and Swedish Shopify stores, then chose Swedish owner-run dentists. Next niches with the same method: physiotherapists, naprapaths, chiropractors, vets, opticians, small law and accounting firms.

---

## 6. Environment notes

- Cloud container; the scratchpad is temporary. Commit and push anything worth keeping. Push with `git push -u origin claude/pensive-ritchie-83vc1b`.
- Don't open a pull request unless the user asks.
- Commit messages in this repo end with the `Co-Authored-By` and `Claude-Session` trailers.
- Connectors available in the session: Vercel (team `best-world2`, id `team_z4QWny6TVhlgYNMRPOiIt1yZ`), Gmail, Google Drive, Shopify, Meta Ads, GitHub, WordPress.com, Windsor.ai, AdWhispr.
- Don't send email through Gmail on the user's behalf unless they ask. They send outreach themselves.
- Known Vercel project ids: Västerås Tandhälsa `prj_tyARCe80JesFzw9WNFoYIY4anFRG`, Sköldenklint `prj_J3mKZp5w4fP7Axz8qihk0PbzKUTt`.
