# Tandvård vid Svartån: design plan

Brief: same content as tandvardvidsvartan.se, premium look, with animation (client asked for it).
Audience: adults and families in Västerås. Primary job: make people call 021-12 40 28.
Subject: a husband-and-wife practice (Henrik and Gabriella Skage, both Karolinska 1994) in an old
red wooden house on Badhusgatan, right by the river Svartån. Their logo is a pen drawing of those houses.

## Tokens
- Color: Älv #0F2B2F (river water, hero and dark bands), Falu #8A2F24 (the red houses, used only for
  actions), Linne #EEF0EA (page), Papper #FBFBF8 (cards), Bläck #142022 (text), Skylt #C8A45A (the gold
  letters on their sign, used for small highlights only).
- Type: Cormorant Garamond 500/600 for display (echoes the serif caps on their street sign),
  Schibsted Grotesk 400/500/600 for text and UI (a Nordic grotesk). Sentence case, no all-caps labels.
- Layout: left aligned, asymmetric two-column sections, wide photo bands.

## The memorable thing
The hero: their own pen drawing of the houses, inverted to light ink on river-dark water, draws itself
in on load (one orchestrated reveal), with a slow animated river line along the bottom of the hero.

## Other motion (each answers something)
- Images reveal once with a clip wipe as they enter the viewport (photos only, not text blocks).
- Price list: a switch between "Bruttopris" and "Lägsta nettopris (15 %)" that counts the numbers.
- Opening hours: today's row is highlighted and an "Öppet nu / Stängt nu" status uses Swedish time.
- Everything respects prefers-reduced-motion.

## Checked against the generic defaults
- Not cream + serif + terracotta: the page is a cool linen and river teal; red is Falu red from the houses.
- Numbers only where content is a sequence (none here except prices, which are real values).
- No eyebrow labels; headings carry the meaning.

## Build notes (26 Oct 2026)
- Live: https://tandvard-vid-svartan-forslag.vercel.app (Vercel project tandvard-vid-svartan-forslag, Vercel Authentication off, noindex).
- All images load from the clinic's own media server over https (their site links them over http, which is why they are blocked there).
- The pen drawing is their PNG logo turned into light ink by an inline SVG colour-matrix filter; a clip polygon hides the logo text in its corner.
- First reveal used clip-path on the image itself: Chrome treated fully clipped targets as never intersecting, so nothing revealed and lazy images never loaded. Fixed with a cover pseudo-element that scales away.
- Removed the italic gold "Svartån" in the H1 (single-word accent is a generated-design tell).
- Left out the summer-closure notice (6/7–11/8): the date has passed. The regional emergency number is kept.
