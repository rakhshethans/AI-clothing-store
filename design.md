# Threadline — SABLE visual direction

## Application scope

Owner brief received 19 October 2026. This is a visual refinement of the existing mobile social-shopping app. Keep Explore as the initial view; retain Search, Post, Saved, Profile, photo-specific shopping sheets, persistence and budget planning. The existing editorial route is the home for the larger campaign composition. Do not replace the feed with a storefront or introduce checkout without asking the owner.

Apply the supplied bone/ink colours, Archivo typography, precise heart icon, hairline divisions, monochrome campaign photography, restrained motion and mobile-safe controls. GPT Taste is the requested skill; the Sites skill is prohibited. The explicit reference overrides the skill's random layouts, stock imagery, GSAP requirements and font defaults.

Keep Threadline's name and truthful prototype disclosures. SABLE's company/address, atelier statistics and fabric specifications are reference copy, not claims about Threadline. No fabricated studio, manufacturing team, commerce inventory, mailing list or bag is introduced. Existing saved-piece actions remain saves. Garment illustrations and user-uploaded photographs keep their original colours for useful comparisons; grayscale applies to editorial media. Touch controls remain visible without hover.

The supplied prompt does not contain the original CSS clamp values, exact number-counting code or full source copy. Reconstructed spacing and motion must be described as an adaptation, not a pixel-identical implementation. Reference media uses the exact supplied jsDelivr URLs; cloth.mp4 must never be replaced. Its src is assigned only on intersection, and playback pauses offscreen. Reduced motion leaves all content visible and uses a manual video play control.

## Owner-supplied reference brief (verbatim)

```text
Recreate the website "SABLE" with high visual fidelity using HTML, Tailwind CSS, and vanilla JavaScript. The site is a high-end, monochrome fashion e-commerce landing page with a minimalist, editorial aesthetic.

Preserve source quirks:
- The wordmark "SABLE" in the hero is placed behind the model image, not layered over it, relying on the model's transparency (between arms/legs) for depth.
- The custom SVG heart icon uses a specific path and stroke-width (1.6).
- Section IDs must match: #hero, #cats, #season, #svc, #shop, #look, #cloth, #atelier, #signup.
- Responsive behavior: Nav links and the "Bag" count labels hide below 900px.

CRITICAL FIDELITY CONSTRAINTS
- Background color: #EFEDE8 (bone).
- Ink color: #101010.
- No hover effects on mobile; maintain strict 4-column desktop to 2-column mobile shifts for the shop grid.
- Images must use grayscale(1) and specific contrast filters (1.04 to 1.08) as defined in the source.
- Do not substitute the video in the #cloth section; use the provided .mp4 with its specific IntersectionObserver lazy-loading logic.

TECH STACK / DEPENDENCIES
- CSS: Tailwind CSS (via CDN), custom CSS variables (--bone, --ink, --mid, --line, --nav).
- Fonts: Archivo (400, 500, 600, 700, 800, 900) from Google Fonts.
- Animation: Vanilla JS for parallax, intersection observers, and scroll-scrubbing (no external libraries like GSAP).

GLOBAL STYLE
- Font: Archivo, system-ui, sans-serif.
- Body: -webkit-font-smoothing: antialiased; overflow-x: clip.
- Nav: Sticky, 96px height, backdrop-filter: blur(10px), background: rgba(239,237,232,.9).

ASSET MAP
- Hero Model: https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@sable-v2/sable/img/model.png
- Categories: cat-men.webp, cat-women.webp, cat-tailoring.webp (from /sable/img/)
- Product Feed: p-overshirt.webp, p-tee.webp, p-cardigan.webp, p-knit.webp
- Section Media: season.webp, look1.webp, look2.webp, atelier.webp
- Video: https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@sable-v2/sable/img/cloth.mp4 (Poster: cloth.webp)

VECTOR / ICON SHAPES
- Heart (Fav): <svg viewBox="0 0 24 24"><path d="M12 20.5 3.8 12.6a5 5 0 0 1 7.1-7l1.1 1.1 1.1-1.1a5 5 0 0 1 7.1 7Z"/></svg>

MEDIA BEHAVIOR
- Video: muted, loop, playsinline, preload="none". Use IntersectionObserver to set the `src` attribute only when visible to prevent unnecessary data usage.
- Images: Lazy loading enabled. Scale and clip-path animations driven by scroll position.

LAYER STACK / POSITIONING MAP
- Announcement Bar: Z-index not specified (standard flow), overflow: hidden.
- Nav: Z-index 60, sticky.
- Hero: Wordmark (z-index: 1), Model (z-index: 2), Corner Labels (z-index: 4, absolute).
- Card Add-to-Bag: Absolute, bottom: 10px, opacity: 0 (appears on hover via translateY transition).

SECTION 1 - HERO
- Layout: Flex center with absolute corner labels.
- Content: "Fashion that moves with you" (Top-left), "Autumn collection 2026" (Bottom-right).
- Animation: Load sequence (h1 -> model -> h2 -> h3) with 140ms staggered delays.
- Interaction: Model scales slightly (1.00006) and translates Y (-0.06) on scroll; wordmark translates Y (0.14) for parallax depth.

SECTION 2 - CATEGORIES (#cats)
- Layout: 3-column grid (1-column on mobile).
- Content: Outerwear, Knitwear, Tailoring.
- Interaction: Image scale(1.09) on hover; arrow icon translates X (6px).

SECTION 3 - SEASON (#season)
- Layout: 2-column split. Left: Copy + Button. Right: Full-bleed image.
- Parallax: Image scales 1.12 and translates based on bounding rect.

SECTION 4 - SHOP (#shop)
- Layout: 4-column grid (2-column on mobile).
- Functionality: "Add to bag" updates counter in nav. "Added" feedback for 1300ms.
- Card Style: 3:4 aspect ratio, hidden-till-hover buttons.

SECTION 5 - LOOKBOOK (#look)
- Layout: Offset 12-column grid. lg-a (1/6), lg-b (6/13), lg-c (3/8).
- Custom CSS: Scroll-driven --p variable controls `clip-path: inset()` and `scale` for image reveal.

SECTION 6 - CLOTH (#cloth)
- Layout: 2-column split (grid). Left: Description + Definition List (<dl>). Right: Video.
- Text: "Three cloths, all season." with specific GSM details.

SECTION 7 - ATELIER (#atelier)
- Layout: 2-column split. Left: Image. Right: Copy + Stats.
- Interaction: Numbers (11 People, 42 Styles, 120 Units) count up using cubic-bezier(0.19, 1, 0.22, 1) when scrolled into view.

GLOBAL ANIMATION / INTERACTION RULES
- Scroll Progress: A 2px high bar `#prog` under the nav scaleX(0 to 1) based on page depth.
- Reveal Classes: `.rv` elements use IntersectionObserver to add `.in` (opacity 1, translate 0) with a 70ms staggered delay.
- Reduced Motion: Check `matchMedia('(prefers-reduced-motion: reduce)')` to disable all transforms/transitions.

COMMON MISTAKES TO AVOID
- Do not use a header overlay for the hero; the model must be a direct child of the stage for the z-index/parallax to work correctly.
- Do not forget the `backdrop-filter: blur(10px)` on the navigation.
- Do not use stock photography; use the exact URLs provided.

IMPLEMENTATION REQUIREMENTS
- Build as a single-page landing page.
- Use the provided JS logic for parallax and number counting.
- Ensure all text matches the source (e.g., "SABLE Studio Ltd", "18 Redchurch Street").
- Preserve the precise padding-top and bottom on section rows using the `clamp()` values found in the CSS.
```

## Owner's implementation instruction

> use the above prompt as a guide to revamp the website. Create a design.md file and include the above text in it.Then revamp the website using the gpt-taste skill, and the design.md file without using the sites skill. You don't need to drastically change anything we have now, if you need to make a drastic change ask me first

## Acceptance checks

- Explore is still the first view; all five app destinations and local social flows remain usable.
- Bone #EFEDE8 / ink #101010; Archivo when Google Fonts is reachable, local sans fallback offline.
- 96px sticky blurred desktop navigation; link labels hide below 900px, bottom app tabs remain usable.
- Full-width editorial campaign is isolated to the existing editorial destination; wordmark is behind the direct-child transparent model.
- Exact SVG heart, 1.6 stroke; editorial grayscale/contrast; product/user colour preserved.
- Four product columns desktop, two mobile; three category columns desktop, one mobile.
- Vanilla motion, lazy exact cloth video, cleanup on route change, reduced-motion static states.
- Inspect desktop/mobile screenshots and exercise saves, search, carousel sheets and composer; report remote-media failures explicitly.
