# Threadline — SABLE visual direction

22 October: owner requires zero spending. Keep the existing local app and add restrained Would
wear / Not for me controls to outfit ideas, with local persistence and a reset option. Do not
create hosting resources, use metered recognition or paid assets. NO_SPEND.md is authoritative.

## Application scope — corrected by owner, 19 October 2026

Use SABLE only as a visual reference for the existing mobile social-shopping app: bone/ink,
Archivo typography, restrained controls, whitespace and thin dividers. The owner removed the
unnecessary Autumn edit campaign page and its links. Do not restore a copied campaign, full-page
brand clone, fabric video, lookbook, atelier section or newsletter flow without a new request.
The quoted reference below is historical source material, not permission to add those features.

Keep Explore as the initial view and retain Search, Post, Saved, Profile, per-photo shopping,
local persistence and budget planning. All post photos (including demos and uploads) must retain
their original colours. Keep the corrected demo photo crops. Preserve accessible touch actions,
desktop/mobile reflow, the updated SVG heart, and reduced-motion support.

GPT Taste remains the requested design skill; Sites is prohibited. Keep Threadline branding and
truthful prototype labels. Changes to the core structure require the owner's agreement.

## Owner-supplied reference brief (verbatim)

Latest owner update (19 October 2026): Wardrobe is a dedicated sidebar destination and a sixth
mobile navigation item. Keep all existing destinations. Include 16 labelled sample garments for
testing outfit ideas, with remove/restore controls that preserve personal uploads. Build a look
also links to owned-clothes styling. Wardrobe uses the same bone/ink tokens, Archivo preference, full-colour photographs,
thin dividers, touch-visible controls and four/two piece grid. Imports support several clothes
in one photograph, editable detections and crop review. Show recognition setup and error states
honestly. Do not create a landing page, campaign, fake recognition result or extra sales funnel.

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

- No Autumn edit page, navigation links, copied SABLE sections, remote campaign images or video.
- Explore, Search, Post, Saved and Profile stay intact; old #editorial URLs return to Explore.
- Bone #EFEDE8 / ink #101010, Archivo online with local fallback, restrained controls and spacing.
- All post and product images preserve their colours; demo crops contain one photograph only.
- Four desktop/two mobile product columns; touch-visible actions and no mobile hover effects.
- Preserve per-photo garment sheets, posting, persistence, privacy and the budget planner.
- Browser verification at desktop/mobile sizes before declaring completion.
