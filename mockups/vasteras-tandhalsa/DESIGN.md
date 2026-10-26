# Västerås Tandhälsa: design plan (v2)

Brief: same content as the clinic's current site, a modern site that wins phone bookings.
Audience: adults in Västerås choosing a private dentist, many looking for implants or cosmetic work.
Primary job: make the patient call 021-13 85 10 (no online booking exists).

## Tokens
- Color: Ljus #F1F4F6 (cool Nordic background), Papper #FFFFFF, Uniform #10284A (the team's navy scrubs),
  Fjord #2B5C8A (links), Mint #C7E6DA (one accent area: the visit chooser), Bläck #0E1A2B (text).
- Type: Familjen Grotesk only (a grotesk from the Stockholm agency Familjen). Display 600 with tight tracking,
  body 400 at 18px. Sentence case everywhere, no all-caps labels.
- Layout: left aligned, generous whitespace, one 12-column grid at 1200px.

## The one memorable thing
A "Vad gäller ditt besök?" chooser in mint under the hero (idea from hellotend.com): four plain choices
(Implantat, Estetisk tandvård, Allmäntandvård, Första besöket) that jump to the right section.
Everything else stays quiet.

## What v1 did that read as generated (removed in v2)
- Warm cream background with a serif display and one italic coloured word in the headline.
- All-caps eyebrow label above every heading, and middle-dot meta strings.
- 01–10 numbers on treatments that are not a sequence (numbers now only on the 4 new-patient steps).
- The same rounded card for every kind of content.

## Ideas taken from reference sites (26 Oct 2026)
- marylebonesmileclinic.co.uk: dentist-led trust row under the hero; "meet the dentist" with face and background; 4-step plan.
- dentologie.com: two clear actions in the hero (book, call); FAQ accordion.
- hellotend.com: service chooser as the first interaction.
- beehivedental.com, westvillagedentalstudio.com: real clinic and team photos over stock.

## Self-critique log (v2 build)
- First v2 hero put the landscape team selfie in a tall arch: only 2 of 4 people showed. Moved the photo to a full-width 21:9 band under the headline.
- Chooser cards were too narrow beside a side title and wrapped. Title moved above, options get the full width.
- A later `.wrap { padding: 0 20px }` at 520px wiped the hero's bottom padding (shorthand override). Fixed with `padding-inline`.
- Chooser links now jump to each treatment area (#implantat, #estetisk, #allman), not one shared anchor.
