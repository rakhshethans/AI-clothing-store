# Assets and browser libraries

## Original editorial image

`public/assets/editorial.png` was created for this project using OpenAI image generation on
18 October 2026. It depicts three fictional models in editorial street-style concepts. It is not
creator content, a real person's endorsement or evidence that a catalogue item matches an outfit.
The interface identifies it as AI-created. It is reused through SVG viewBox crops without altering
the source image. Original generated dimensions: 1536 × 1024.

The garment illustrations and catalogue remain original synthetic examples from the prototype.
Real creator photography remains a future rights/access dependency.

For the mobile app, the original generated PNGs were converted to optimised WebP copies with
the same composition and dimensions: editorial.webp and feed-editorial.webp. The originals are
retained locally in private-data/source-images; the repository serves the smaller WebP files.

`public/assets/feed-editorial.png` was generated for the social Explore prototype on 18 October
2026. It is an original 1254 × 1254 contact sheet of four fictional editorial photographs, used as
627px square SVG viewBox crops. Demo profiles are labelled editorial examples; no real creator or
endorsement is represented. The PNG app icons were drawn locally using the working wordmark initial.

## Geist

The unmodified variable WOFF2 is from Vercel's official Geist repository:
https://github.com/vercel/geist-font/blob/main/fonts/Geist/webfonts/Geist%5Bwght%5D.woff2

SIL Open Font License 1.1; the complete notice and licence accompany the font in
`public/assets/Geist-OFL.txt`. Satoshi was initially selected by the skill's seeded layout exercise;
Geist, another font from that skill, was used for a redistributable offline package instead.
Editorial headings retain the project's Georgia/system-serif direction.

## GSAP and ScrollTrigger

Locally vendored, unmodified GSAP 3.13.0 and ScrollTrigger 3.13.0 from GreenSock's official repository:

- https://github.com/greensock/GSAP/blob/3.13.0/dist/gsap.min.js
- https://github.com/greensock/GSAP/blob/3.13.0/dist/ScrollTrigger.min.js

The source headers retain copyright and licence notices. Governed by the GSAP Standard No Charge
License: https://gsap.com/standard-license/ . They are used to animate the site, not as an animation
editor or visual animation builder. No CDN connection is needed at runtime.

## Design application

The owner explicitly requested the local GPT Taste skill for the 18 October redesign. Its seeded
exercise selected artistic asymmetry, a horizontal accordion, a carousel, an inline heading image,
scrubbing text and scroll pinning. The carousel contains editorial styling notes, not fabricated
testimonials. Core search, stock, money and privacy rules are unchanged. The owner-selected warm
palette and editorial serif hierarchy take precedence over generic landing-page treatments.
## SABLE visual reference — current scope, 19 October 2026

The owner supplied SABLE as a visual reference. Its separately added campaign page was removed
at the owner's request. No SABLE remote assets, video, copy, company address or campaign sections
are used by the app. The full historical brief is retained in design.md for context only.

Archivo is requested from Google Fonts (weights 400–900), with the existing local Geist font as
an offline fallback. The Tailwind CDN dependency and campaign-specific CSP permissions were removed.
Earlier GSAP assets remain in the repository but are not executed.
