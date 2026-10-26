# Tandläkare Sköldenklint: design plan

Brief: same content as skoldenklint.com (14 pages), premium look with animation.
Audience: adults and families in Kalmar and Mönsterås. Primary job: call or mail the right clinic.
Subject: family practice since 1974 (Torsten and Sylvia), run since 2018 by their son Mikael, an implant
surgeon. Two clinics. Their own 2024–2025 photo shoot: calm Scandinavian rooms (rattan chairs, white
curtains), team in sand-coloured scrubs in front of green leaves. Logo: thin line tooth, wide-tracked caps.

## Tokens
- Color: Kalkvit #F4F3EF (page), Sand #D8C9B4 (the scrubs), Sund #263F49 (Kalmarsund water, dark bands),
  Löv #56704A (the leaves behind the portraits, used for small highlights), Bläck #1C2427 (text).
- Type: Red Hat Display 500/700 for headings with slight negative tracking, Red Hat Text 400/500 for body.
  Wide-tracked small caps are NOT used (the logo already does that once, as an image).
- Layout: left aligned. Split hero, then full-width bands alternating Kalkvit and Sund.

## The memorable thing
"Sedan 1974": a vertical family timeline (a real sequence of dates) whose line draws itself as you scroll,
next to a photo of Mikael at work.

## Other motion, each answering something
- Hero: photo eases from 1.12 to 1 scale, headline lines rise once.
- Treatments: accordion; opening a row expands its full text.
- Reviews: slow horizontal drift of the four real reviews, pauses on hover/focus, stops with reduced motion.
- Visit: Kalmar / Mönsterås switch swaps address, phone, mail and map link; today's opening row and an
  open/closed status in Swedish time.

## Checked against defaults
Not cream + serif + terracotta (cool lime-white, sans, sea blue). No eyebrow labels, no 01/02 markers except
the timeline years, which are real dates.

## Build notes
- Live: https://skoldenklint-forslag.vercel.app (Vercel project prj_J3mKZp5w4fP7Axz8qihk0PbzKUTt, SSO off).
  `index.html` here is the deployed file. Images are hotlinked from www.skoldenklint.com over https.
- Fixes found in the check loop:
  - `.trust div` also matched `.wrap` and removed its padding; now `.trust .wrap > div`.
  - Footer FK and Tandläkarförbund logos are transparent PNGs, made white with `brightness(0) invert(1)`.
  - The 2020 portraits are round PNGs, so every team photo is shown as a circle.
  - Mobile: the hero photo first pushed the headline below the fold. Now headline first, photo after
    (480 px high up to 1040 px wide, 400 px on phones).
- Final check (desktop 1440 and mobile 390): 18/18 images load, no horizontal overflow, 5/5 timeline steps
  light up, tabs, accordion, marquee and mobile menu work, no console errors.
