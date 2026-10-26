# Leg tandläkare Maria Sjökvist AB: design plan

Brief: same content as mariasjokvist.se (4 pages: Start, Om oss, Kontakta oss, GDPR), premium look with
animation. Today it is a One.com editor site with a fixed-width desktop layout that shrinks to tiny text on phones.
Audience: adults in Gävle, many long-time patients. Primary job: book online (Opus Dental) or call.
Subject: one dentist, Maria Sjökvist, general dentist since 1983 (Karolinska Institutet, Huddinge), practice
since 1984, at Norra Rådmansgatan 8A since 1992. Connected to Försäkringskassan. Calls patients by postcard.
Only one real photo: two staff in white coats in the treatment room, 563 px wide, with the slogan
"Vi hjälper dig med all planering och utförande av ett vackert leende." burned into the bottom strip.

## Tokens
- Color: Papper #F4F6F9 (page), Vit #FFFFFF, Bläck #1B2A44 (text, dark band), Gävleblå #2F64AE (the blue
  of their current site and logo text, used for actions), Is #DCE8F4 (from their ice-cube image, soft
  panels), Stämpel #B3412E (only the postage stamp on the postcard).
- Type: Newsreader 500/600 for display (editorial, calm, fits a 40-year solo practice), Public Sans
  400/500/600 for body and UI. Sentence case, no all-caps labels.

## The memorable thing
The postcard: they really call patients in by "vykort". The hero shows their photo as a postcard (caption
cropped out, slogan set as real text instead). It flips in 3D to the back: stamp, address lines, phone and
"Boka tid". Flips on a button (and hover on desktop); reduced motion swaps without rotation.

## Other motion, each answering something
- Headline lines rise once; postcard drops in with a slight tilt.
- "I Gävle sedan 1984": the years count up (computed from today), three milestones (1983, 1984, 1992)
  draw a connecting line on scroll.
- GDPR: their full policy as an accordion of plain questions, so the long page becomes readable.
- Sections fade up once.

## Notes
- The site shows two postal codes (802 11 in the header, 803 11 on the contact page). The proposal shows
  the street address without a postal code instead of guessing.
- No opening hours on the current site, so none are shown.
- The photo is low resolution, so it is never shown wider than about 520 px.
