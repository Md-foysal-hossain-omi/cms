# Shopify e-invoicing app (Saudi ZATCA + Malaysia MyInvois): 1-week validation plan

Date: 2026-10-26. Status: plan only, no code. Facts below come from secondary sources
(search results) and are marked **verify** where an official source must confirm them.

## What the quick check found

| Market | Mandate status | Competitors seen |
|---|---|---|
| Saudi (ZATCA Fatoora Phase 2) | Waves continue. Wave 24 deadline 30 Jun 2026 (turnover > SAR 375k). Wave 25 from 1 Feb 2027 (turnover > SAR 187.5k in 2022-2025). Future waves get 6 months notice. **verify** on zatca.gov.sa | "ZATCA Tools" (free, 0 reviews); ECOSIRE build-to-order connector from $499 |
| Malaysia (MyInvois) | RM1m-RM5m segment reportedly postponed to 1 Jan 2027; RM500k-RM1m wave reportedly dropped; invoices > RM10k individual, small B2C consolidated. **verify** on hasil.gov.my | ECOSIRE build-to-order connector from $299 one-time |

Your earlier research said both markets have 3 to 11 apps each. Search shows few
real, reviewed products, so the gap is "reliable, reviewed, self-serve" rather than "no app".

## Recommendation

Test **Saudi first**. Wave 25 (Feb 2027) gives merchants a hard date about 3 months away,
and Shopify is common in the Gulf. Malaysia's date is soft (postponed), so urgency is weaker.
Do not build both before Day 5 results.

## Day-by-day

**Day 1: Rules and risk**
- [ ] Read ZATCA developer portal: Phase 2 onboarding, sandbox, signing (CSID), hash chain, QR (TLV), clearance (B2B) vs reporting (B2C) flows.
- [ ] Decide: does an app need to be a ZATCA-approved solution provider? Note any certification cost.
- [ ] Read MyInvois SDK: intermediary-system flow, digital signature, consolidated B2C, self-billed.

**Day 2: Competitors**
- [ ] Open apps.shopify.com listings for ZATCA Tools and any others: price, reviews, last update, support replies.
- [ ] Install the free ones on a dev store. Record: Arabic/English invoice quality, credit notes, refunds, multi-currency, B2B clearance, error handling.
- [ ] Note the 3 worst gaps (these become the pitch).

**Day 3: Demand**
- [ ] Keyword Planner via AdWhispr (country Saudi Arabia, Malaysia): "zatca shopify", "fatoora integration", "فاتورة إلكترونية شوبيفاي", "myinvois shopify".
- [ ] Count Shopify merchants in KSA/MY above the wave thresholds (BuiltWith/StoreLeads or similar).

**Day 4: Merchant talks**
- [ ] Reach 10 Saudi Shopify merchants (Reddit, Shopify Community, LinkedIn, Facebook groups). Ask: how do you issue ZATCA invoices today, what does it cost, what breaks?
- [ ] Goal: 3 say they would pay now.

**Day 5: Technical spike (half day)**
- [ ] In ZATCA sandbox, generate and submit one signed simplified invoice from a Shopify order JSON by script.
- [ ] If sandbox onboarding takes more than 1 day, flag as high build risk.

**Day 6: Economics**
- [ ] Price test: $19 / $39 / $79 per month by invoice volume. Estimate break-even installs.
- [ ] List ongoing costs: ZATCA spec changes, support in Arabic.

**Day 7: Decision**
Go if all true: >=3 merchants would pay; sandbox spike worked; competitors show clear gaps; no mandatory provider certification blocking you.
No-go otherwise; fall back to the next idea from the ranked list (production planner, NDIS).

## Open questions for Foysal
1. Can you handle Arabic support and RTL invoice templates?
2. Budget for a ZATCA solution-provider certification if required?
3. Shopify Plus/B2B stores only, or all plans?
