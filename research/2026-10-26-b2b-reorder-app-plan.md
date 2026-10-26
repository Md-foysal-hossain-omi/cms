# B2B Reorder app: analysis and build plan

Date: 2026-10-26. Idea #3 from the 25 Oct research: "find which B2B customers are late to reorder".
Working name: **Reorder Radar** (check the name on the App Store before launch, see Risks).

## 1. What WinBack already does (so we don't overlap)

From our own office page (`office-3d/index.html`) and the listing link `apps.shopify.com/sales-crm-insights`:

| | WinBack Customer CRM (live) |
|---|---|
| Who it serves | Retail (D2C) shoppers, every Shopify customer |
| Core unit | One customer |
| Method | RFM: sorts every customer into 12 groups, flags who is about to stop buying |
| Output | Customer groups, sync to Klaviyo / Mailchimp for win-back emails |
| Price | $30 per 30 days, 7-day trial |

I could not open the live listing (apps.shopify.com is blocked from my environment), so
features beyond this come from our own page only.

## 2. The market for the new app

- April 2026: native Shopify B2B (companies, locations, price lists) opened to Basic, Grow and Advanced plans. Many small wholesalers are new to B2B and have no tools for account follow-up.
- Native B2B gives buyers a "reorder" button, but nothing tells the **merchant** which account is late.
- Direct competitor: **Repeatly — Wholesale Reorders** (LabStack, launched 10 Jun 2026, 0 reviews). Finds each account's reorder rhythm, flags due/overdue accounts, sends a draft order + invoice. Free: 5 nudges/month. Pro: **$149/month**.
- Near competitors: WSH Order Form & Reorder (buyer-side reorder form), SparkLayer (sales-rep portal, larger merchants), Recharge (fixed subscriptions, not prediction).
- RFM / win-back apps (Winback IQ, CustomerRadar, Win Back Engine, Segments) are all D2C and email-led. None works per company location or per product.

**Gap:** a cheap, self-serve tool for small B2B stores that works **per product, per location**,
and gives a daily call list. Repeatly is per account and priced for bigger stores.

## 3. How the new app stays separate from WinBack

Separate product, separate code, no shared data written to the store.

| | WinBack | Reorder Radar |
|---|---|---|
| Customer | Retail shoppers | B2B companies and their locations |
| Unit of analysis | Customer | Company location × product (variant) |
| Question answered | "Who is drifting away?" | "Which account is late for which product, and how much money is that?" |
| Method | RFM groups | Each account's own reorder interval per product |
| Action | Email lists (Klaviyo/Mailchimp) | Ready draft order at the account's price list, rep call list |
| User | Marketer | Owner / wholesale manager / sales rep |
| Data scope | customers, orders | companies, orders, draft orders (B2B only) |

Technical rules so the two never collide when a store installs both:
1. New Shopify app in the Partner dashboard, own handle, own code folder (`apps/b2b-reorder/`). No code imported from WinBack.
2. Only orders that have a `purchasingEntity` of type company are read. D2C orders are ignored, so WinBack's groups are never affected.
3. The app writes nothing to customers. No customer tags, no customer metafields (that is WinBack's space).
4. Any stored value goes in app-owned metafields (`$app:reorder_radar`) on the **company location**, never a shared namespace.
5. No email-marketing sync in v1. Nudges are Shopify draft-order invoices, which is native B2B, not marketing.
6. Brand, listing words and screenshots never say "win back", "RFM" or "segments".

Later option: cross-sell. WinBack's admin can show "Selling wholesale? Try Reorder Radar" and the reverse, without sharing data.

## 4. Product (v1)

1. **Reorder engine** (built in this branch): for each company location and each product, learn the usual interval and quantity, then flag due, overdue or lapsed.
2. **Today list:** accounts ranked by money at risk (expected order value × how late). One line per account: "Bakery Co · Dhaka store · 6 days late · usually 24 × Flour 25kg · ~$480".
3. **One-click reorder:** create a draft order for that location with the usual items at its price list, then send the Shopify invoice. Merchant reviews before sending.
4. **Weekly email digest** to the merchant (not to buyers): late accounts and value at risk.
5. Settings: grace days, minimum orders before predicting (default 3), which products to ignore.

Not in v1: buyer emails/SMS, AI timing, rep permissions, POS, multi-store.

## 5. Pricing (to test)

- Free: up to 10 B2B accounts, list only.
- Starter $29/month: up to 100 accounts, draft orders, digest.
- Growth $59/month: unlimited accounts, CSV export, rep assignment.
Position: "Repeatly-level insight at a fifth of the price, built for stores new to Shopify B2B."

## 6. Build steps

| Step | What | Who | Status |
|---|---|---|---|
| 1 | Reorder engine in TypeScript with tests | Claude | **done in this branch** |
| 2 | Create app in Partner dashboard, run `shopify app init` (React Router template) | Omi (needs your Shopify login) | todo |
| 3 | GraphQL: read B2B orders (`purchasingEntity`), companies, locations; scopes `read_orders`, `read_companies`, `write_draft_orders` | Claude | todo |
| 4 | Polaris admin pages: Today list, account detail, settings | Claude | todo |
| 5 | Draft order + invoice action | Claude | todo |
| 6 | Daily job + weekly digest email | Claude | todo |
| 7 | Billing API plans, GDPR webhooks, app review checklist | Claude + Omi | todo |
| 8 | Test on a dev store with seeded B2B data, then 3 beta merchants | Omi | todo |

## 7. Validation before step 4 (cheap)

- [ ] Find 5 Shopify stores using native B2B (food, coffee, cosmetics, packaging). Ask: how do you know a wholesale account is late today?
- [ ] Show the Today list mockup. Goal: 3 say they would pay $29.
- [ ] Install Repeatly on a dev store. Note what it misses (per-product view? price? setup?).

## 8. Risks

- Repeatly could cut its price. Answer: per-product detail and simple setup, not only price.
- Many new B2B stores have few orders, so predictions start late. Answer: show "needs 3 orders" honestly, and still list accounts with no order for 60+ days.
- Name: check "Reorder Radar" and similar names on the App Store before submitting (WinBack already shares its name with two other apps, don't repeat that).
- Protected customer data review: we only need company/location names, no buyer personal data, which keeps the review simpler.

Sources: [Repeatly listing](https://apps.shopify.com/repeatly-reorders?locale=ja), [Repeatly on PickYourApp](https://pickyourapp.com/products/repeatly-reorders), [Winback IQ](https://apps.shopify.com/winback-iq), [Win Back Engine](https://apps.shopify.com/win-back-engine), [Shopify B2B 2026 (eSEOspace)](https://eseospace.com/blog/shopify-b2b/), [Launchtip wholesale CRM](https://www.launchtip.com/blog/shopify-wholesale-order-pipelines-crm-setup-for-b2b-efficiency-in-2026).
