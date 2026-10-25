#!/usr/bin/env python3
"""Verify and enrich bakeries-40.csv from each store's public pages.

For every row with a website it:
  - loads /products.json and saves up to 6 product titles,
  - loads the homepage and /cart and looks for Shopify and date picker app markers,
  - looks for a published email (mailto:) and an Instagram link on the homepage and /pages/contact.

It only reads public pages. It never submits forms or places orders.
Only fields that are empty in the input are filled, and every finding is listed in a new
"checks" column so you can see where it came from.

Usage:  python3 verify_bakeries.py bakeries-40.csv bakeries-40-verified.csv
"""
import csv
import json
import re
import sys
import time
import urllib.error
import urllib.request

UA = "Mozilla/5.0 (compatible; PrepDay-research/1.0)"
DATE_APPS = {
    "Zapiet": ["zapiet", "storepickup"],
    "Buunto": ["buunto"],
    "Bloom": ["bloom-pickup", "bloomdelivery", "bloom_delivery"],
    "Order Delivery Date / Stellar": ["identixweb", "order-delivery-date"],
    "Pickeasy": ["pickeasy", "logbase"],
    "Readyby": ["readyby"],
    "Calla": ["calla-delivery", "callaapp"],
    "other date app": ["delivery-date", "delivery_date", "pickup-date", "pickup_date"],
}
EMAIL_RE = re.compile(r"mailto:([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})")
INSTA_RE = re.compile(r"https?://(?:www\.)?instagram\.com/([A-Za-z0-9_.]+)")


def get(url, timeout=20):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, ""
    except Exception:
        return None, ""


def check(site):
    site = site.rstrip("/")
    found = {}
    notes = []

    status, body = get(site + "/products.json?limit=250")
    if status == 200:
        try:
            products = json.loads(body).get("products", [])
            found["shopify_proof"] = "products.json"
            titles = [p.get("title", "").strip() for p in products if p.get("title")]
            if titles:
                found["top_products"] = "; ".join(titles[:6])
            notes.append(f"products.json ok ({len(products)} products)")
        except ValueError:
            notes.append("products.json not JSON")
    else:
        notes.append(f"products.json status {status}")

    pages = []
    for path in ("", "/cart", "/pages/contact"):
        s, html = get(site + path)
        if s == 200:
            pages.append(html)
    source = "\n".join(pages)
    low = source.lower()

    if "shopify_proof" not in found and ("cdn.shopify.com" in low or "shopify.theme" in low):
        found["shopify_proof"] = "cdn.shopify.com"
        notes.append("Shopify markers in page source")

    for app, keys in DATE_APPS.items():
        if any(k in low for k in keys):
            found["date_app"] = app
            notes.append(f"date app marker: {app}")
            break

    emails = sorted({e for e in EMAIL_RE.findall(source) if not e.lower().endswith(("sentry.io", "example.com"))})
    if emails:
        found["contact_email"] = emails[0]
        notes.append("email from mailto link")
    insta = [h for h in INSTA_RE.findall(source) if h.lower() not in ("p", "explore", "accounts")]
    if insta:
        found["instagram"] = "https://instagram.com/" + insta[0]

    return found, "; ".join(notes)


def main(src, dst):
    with open(src, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    fields = list(rows[0].keys()) + ["checks"]
    for row in rows:
        site = row.get("website", "").strip()
        if not site:
            row["checks"] = "no website, skipped"
            continue
        found, notes = check(site)
        for k, v in found.items():
            if not row.get(k):
                row[k] = v
        row["checks"] = notes
        print(f"{row['store_name']}: {notes}")
        time.sleep(1)
    with open(dst, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        w.writerows(rows)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
