# Sending setup for foysalsolutions.com (checked 27 Oct 2026)

What DNS shows today and what is left before the first outreach email.

| Record | Now | Status |
|---|---|---|
| MX | route1/2/3.mx.cloudflare.net | OK (receiving through Cloudflare Email Routing) |
| DKIM | brevo1 / brevo2 CNAMEs to Brevo | OK |
| Brevo verification | `brevo-code:15cb…` TXT | OK |
| DMARC | `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com` | OK for now (keep `p=none` during warm-up) |
| SPF | `v=spf1 include:_spf.mx.cloudflare.net include:_spf.google.com ~all` | **Add Brevo** |

## The one change to make (Cloudflare → DNS → the TXT record that starts with `v=spf1`)

Replace it with:

```
v=spf1 include:_spf.mx.cloudflare.net include:_spf.google.com include:spf.brevo.com ~all
```

Keep only one SPF record. Two `v=spf1` records break SPF.

## Then, in order

1. Gmail → Settings → Accounts → "Send mail as" → your @foysalsolutions.com address → SMTP `smtp-relay.brevo.com`, port 587, TLS, with your Brevo SMTP login and key. Do not paste the key in any chat.
2. Paste the signature from any `outreach/0X-*/signature.html`.
3. Send a test to mail-tester.com. Send real emails only at 9/10 or higher.
4. Warm-up: 2–3 cold emails per day the first week, Tuesday to Thursday, 08:00–10:00 Swedish time.

## Who gets what

| Lead | Contact by | Why |
|---|---|---|
| 1 Västerås Tandhälsa AB | Email | AB |
| 2 Tandvård vid Svartån AB | Email | AB |
| 3 Tandläkare Sköldenklint AB | Email | AB |
| 4 Tigran Capital AB (Tandhälsan) | Email | AB |
| 5 Leg tandläkare Maria Sjökvist AB | Email | AB |
| 6 Tandläkarmottagning Ekersgatan 7 | **Phone first**, email only after a yes, else letter | Enskild firma (private person under Swedish marketing rules) |
