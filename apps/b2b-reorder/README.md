# Reorder Radar (working name)

Shopify app for B2B stores: shows which company locations are late to reorder,
per product, and prepares the usual order as a draft order.
Plan and competitor analysis: `research/2026-10-26-b2b-reorder-app-plan.md`.

Separate from WinBack: reads only B2B (company) orders and never writes to customers.

## Now
- `src/engine.ts`: reorder engine (pure TypeScript, no Shopify calls).
- `src/engine.test.ts`: tests.

```
npm install
npm test
npm run typecheck
```

## Next
Create the app in the Shopify Partner dashboard, run `shopify app init`,
then wire the engine to B2B orders via the Admin GraphQL API.
