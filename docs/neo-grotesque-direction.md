# Neo-grotesque portfolio direction

This direction supersedes the condensed display direction in agency-direction.md.

## References inspected on 8 November 2026

- BASIC/DEPT: https://www.basicagency.com/ — editorial spacing, large project imagery, restrained rules and normal-width Scto Grotesk. Sample live description: weight 400, 38px/41.8px, tracking -1.33px. Awwwards awarded the earlier BASIC entry Site of the Day on 6 April 2020: https://www.awwwards.com/sites/basic-r . The current live design is a separate observation.
- Studio 28K: https://www.28k.studio/ — asymmetric grid, sentence-case PP Neue Montreal and deliberate empty space. Sample heading: weight 500, approximately 39.75px/38.16px. Its own methods page records Studio of the Year and Developer of the Year nominations and Kriss.ai Site of the Month: https://www.28k.studio/methods .
- Instrument: https://www.instrument.com/ — normal-width Instrument Sans, mixed-case copy, confident scale and rounded reel imagery. Sample services heading: weight 400, approximately 37.27px/42.59px. The homepage lists Awwwards among its recognition; no specific award date for the current design is claimed here.

These are relevant references, rather than a numerical ranking of agencies. Computed type samples describe the inspected desktop pages and may change.

## Applied design

Use self-hosted Inter Variable, an open-source alternative suited to this neo-grotesque direction, rather than copying proprietary agency fonts. Source and OFL licensing: https://rsms.me/inter/ . The original license accompanies the font.

- Normal-width mixed-case display type, moderate weights and tight but readable tracking.
- Small contextual metadata and a quiet rule above the rotating services.
- Editorial desktop project grid with imagery on the left and captions on the right; stacked media and captions on mobile.
- Bare arrows, underlined contact links and separated service text instead of pills and circular controls.
- Rounded media, beige/red palette, four fixed corners, precise scroll stops, individual-letter reveals, splash and menu transitions retained.
- Inter also aligns the editor with the public typography.

## Verification

Production build, TypeScript and the nine existing functional tests passed. Browser layout checks at 320, 390 and 430 pixels and desktop covered the hero, work and mobile navigation. About copy uses margin spacing so decorative letter masks remain aligned with the source text.
