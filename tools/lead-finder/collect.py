# Collect private dental clinics per city from varden.se (website, phone, email, reviews).
import json, re, sys, time, urllib.request, html as H

UA = {"User-Agent": "Mozilla/5.0"}
CITIES = sys.argv[1].split(",")
OUT = sys.argv[2]
CHAINS = re.compile(r"folktandv|smile|dentsmile|colosseum|praktikertj|ptj\.se|distriktstandv|tandfokus|citytandl|happydent|kakkirurg|specialist|odontolog|tandvårdsakut|europaklinik|oral-?care|dental-?care-?group|tandlakarhuset", re.I)

def get(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=25) as r:
        return r.read().decode("utf-8", "replace")

def field(s, key):
    m = re.search(r'\\"%s\\":(\\"(.*?)\\"|null|[\d.]+)' % key, s)
    if not m: return None
    return m.group(2) if m.group(2) is not None else (None if m.group(1) == "null" else m.group(1))

rows, seen = [], set()
for city in CITIES:
    links = []
    for page in range(1, 6):
        url = f"https://www.varden.se/hitta/tandlakare-c/{city}-p" + (f"?page={page}" if page > 1 else "")
        try: s = get(url)
        except Exception as e: print("ERR", url, e, file=sys.stderr); break
        new = [l for l in dict.fromkeys(re.findall(r'href="(/vardgivare/[^"#]+)"', s)) if l not in links]
        if not new: break
        links += new
        time.sleep(0.4)
    for l in links:
        if l in seen or CHAINS.search(l): continue
        seen.add(l)
        try: s = get("https://www.varden.se" + l)
        except Exception as e: print("ERR", l, e, file=sys.stderr); continue
        name = re.search(r'<meta property="og:title" content="([^"]+)"', s)
        rs = re.search(r'\\"reviewSummary\\":\{\\"reviews\\":(\d+),\\"rating\\":([\d.]+)', s)
        phone = re.search(r'\\"phoneNumbers\\":\[\{\\"number\\":\\"(\d+)', s)
        addr = re.search(r'"streetAddress":"([^"]+)"', s)
        row = dict(city=city, name=H.unescape(name.group(1)) if name else l, varden="https://www.varden.se" + l,
                   website=field(s, "websiteUrl"), email=field(s, "email"),
                   phone=phone.group(1) if phone else None, address=addr.group(1) if addr else None,
                   reviews=int(rs.group(1)) if rs else 0, rating=float(rs.group(2)) if rs else 0)
        if row["website"] and CHAINS.search(row["website"]): continue
        rows.append(row)
        print(json.dumps(row, ensure_ascii=False), flush=True)
        time.sleep(0.4)
json.dump(rows, open(OUT, "w"), ensure_ascii=False, indent=1)
print("TOTAL", len(rows), file=sys.stderr)
