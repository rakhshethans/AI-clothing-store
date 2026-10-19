# Threadline — project and design instructions

This file applies only to the Threadline fashion discovery/shopping project and its descendants.
It is not a global instruction file. Do not copy it into the parent workspace root or apply its
design rules to unrelated projects. Threadline is a working name, not a cleared or registered mark.

## 1. Read this first

Latest owner direction (19 October 2026): read design.md for the SABLE reference brief and its
application scope. Its bone/ink palette, Archivo typography and vanilla motion supersede the older
olive/serif/GSAP defaults below. Preserve the mobile social feed and core flows. SABLE is only a
visual reference: do not add a separate campaign page, copied brand content or storefront. The
owner explicitly removed the Autumn edit; do not recreate it without a new request.

Read PRODUCT_SPEC.md and ARCHITECTURE.md before implementation. Inspect the actual repository,
current changes, package scripts and applicable instructions before editing. Preserve unrelated
work. Parent sources/ is read-only. Never change the unrelated parent site's app, dependencies,
hosting identity or deployment configuration.

This file records the intended design. The existing sample prototype is not an approved final
visual reference. Its garment illustrations demonstrate functionality; they do not override the
creator-photography direction below. Updating this file alone does not authorise a website redesign.

## 2. Confirmed owner choices

The owner selected these directions on 17 October 2026:

| Area | Confirmed preference |
|---|---|
| Overall appearance | Editorial fashion |
| Palette | Warm neutrals: ivory, charcoal and muted olive |
| Homepage priority | Search plus outfit inspiration |
| Brand mood | Contemporary and approachable; use relevant current sites as inspiration |
| Main imagery | Creator photography first |
| Browsing information | Minimal until an item or outfit is opened |

These decisions outrank stylistic defaults elsewhere in the project. Specific font families,
colour hex values, breakpoints and numerical layout sizes below are implementation starting points,
not separately approved owner selections. Refine them within this direction using actual screenshots.
Ask before changing the overall palette, information density, imagery strategy or homepage priority.

## 3. Product identity and design objective

Help someone move from an outfit they like to garments they can actually consider buying, with
retailer alternatives and a realistic budget. The first impression should be a contemporary fashion
discovery destination: personal, visually confident, relaxed and useful.

Make affordable style feel considered. Avoid turning premium presentation into an assumption that
the audience buys luxury clothing. Use relatable outfits and approachable copy, with room for
different styles, bodies and budgets. Do not assume a menswear-only or womenswear-only audience.
The exact launch niche remains a product-validation decision.

Creator photography leads the visual experience. This does not expand the MVP into an open social
network: founder-curated, permissioned creator/editorial content can deliver the same visual direction.
Following, comments, DMs, creator payouts and algorithmic feeds need separate product justification.

## 4. Reference direction: borrow principles, retain our own identity

Research checked 17 October 2026:

- LTK's public site foregrounds creators, discovery and shoppable posts. Use creator context and
  clear outfit-to-product navigation as references. Do not copy its app-download emphasis or force
  registration before value. Reference: https://www.shopltk.com/
- ShopMy's public positioning foregrounds human curation and product recommendations. Use that
  sense of personal taste as an influence, without copying its wording, branding or storefronts.
  Reference: https://shopmy.us/home/
- COS's Features section mixes styling stories and outfit photography. Use cohesive styling stories
  and considered image selection as references, without adopting a luxury-only audience or copying
  its campaign assets. Reference: https://www.cos.com/en-gb/features
- ARKET's public catalogue navigation groups garments and seasonal curations. Use recognisable
  clothing categories and a coherent curated edit as references, not its entire navigation structure.
  Reference: https://www.arket.com/en-gb/

These are established reference products, not a verified ranking of what is most popular today.
The research used public page content, not a screenshot audit of authenticated apps. Do not invent
pixel-level observations, user metrics or claims that a reference interaction was tested. If a later
task requires visual fidelity to a live reference, inspect its current rendered interface first.

Do not clone a competitor wholesale. No copying their logos, proprietary assets, distinctive copy,
creator images or product photographs without permission. Keep references focused: creator-led
discovery, editorial image rhythm, restraint and easy progression to practical shopping.

## 5. Visual system

### Colour

Use a warm off-white page canvas, dark charcoal text and one restrained olive accent. Let outfit
photography supply most of the colour. Avoid large areas of pure white if they make the page feel
clinical, or broad beige/olive image filters that distort garment colour.

Suggested initial tokens:

```css
--canvas: #F8F7F2;
--surface: #FFFEFA;
--surface-muted: #EEECE4;
--text: #262921;
--text-secondary: #62685C;
--border: #DCDDD3;
--accent: #3F4E37;
--accent-soft: #E7EBD9;
--focus: #596E3C;
--error: #963D31;
```

Use accent for primary actions, selected states and small navigation cues. Do not fill every card
with a different pastel. Reserve error/warning colours for their meanings. Check contrast in the
actual foreground/background combinations, including images, disabled states and overlays.

### Typography

Pair an expressive but readable editorial serif for major headings with a clean sans serif for
navigation, search, filters, prices and body copy. Georgia plus a system sans is an acceptable
dependency-free baseline. Any upgraded font must have an appropriate licence and a sensible loading
strategy; do not add multiple font services for a minor aesthetic improvement.

- Desktop primary heading: approximately 56–76px, adjusted to available width.
- Mobile primary heading: approximately 36–48px; avoid forcing awkward multi-line slogans.
- Section headings: approximately 28–42px.
- Body copy and form controls: normally 15–16px; retain 16px editable text on mobile.
- Supporting metadata: normally 12–14px; do not rely on tiny uppercase captions for essential details.
- Headings may have tighter spacing; body copy needs comfortable leading around 1.5–1.65.

Use short headings and sentence case. Small uppercase eyebrow labels are occasional editorial
accents, not the default label style. Avoid negative letter-spacing that harms legibility or a
thin fashion font that disappears over photography.

### Spacing, surfaces and shapes

Use a consistent 4/8px-derived spacing scale. Prefer image composition, alignment and whitespace
over nested boxes. Default to thin quiet dividers and little or no shadow. Use modest radii for
controls and product surfaces; save pills for search suggestions or genuinely compact facets.
Do not put every paragraph in a rounded card or give all buttons full-pill geometry.

Aim for a desktop content width around 1280–1440px, with 32–64px side gutters depending on viewport.
Mobile gutters should generally be 16–20px. Maintain a visible relationship between headings and
their content; generous space must not make the page feel empty or push the main task off-screen.

## 6. Photography and art direction

Use real, permissioned creator outfit photographs as the dominant inspiration assets. Prioritise
clothes worn by people, believable settings, natural movement and a recognisable personal style.
Prefer full-body or sufficiently wide crops that preserve the garments, shoes and silhouette the
user may want to shop. A portrait that hides the outfit is not an adequate outfit-search reference.

Maintain a coherent edit without making every person or background look identical. Include realistic
variation in skin tones, bodies, presentation and clothing styles; do not fabricate a demographic
coverage claim from a handful of images. Never infer sensitive attributes from an uploaded photo.

- Default inspiration tile ratio: 3:4 or 4:5; choose one primary ratio per section.
- Detail pages can show a fuller image or swipeable set with an explicit position indicator.
- Store useful focal-point/crop metadata; avoid cutting off heads, feet or important accessories.
- Use `object-fit: cover` for appropriate editorial crops; use contain for product isolation when
  cropping would hide the item. Do not stretch images or change garment colours with a brand filter.
- Use clean retailer images for item comparison only when their use is permitted. These support,
  rather than replace, creator-led inspiration.
- Keep text mostly outside photographs. If text overlays are necessary, use a local scrim and
  verify legibility across the actual images; avoid permanent dark overlays on every tile.
- Credit the real creator/photographer where appropriate. Do not invent creator identities,
  testimonials, follower counts, endorsements or product tags.

If rights-cleared photography is unavailable, use conspicuously labelled placeholders or existing
original illustrations during development. Do not imply synthetic imagery depicts an actual creator
or actual product match. Asset absence is a known gap, not a reason to silently change the direction
to a collage-only storefront. Keep a provenance/permission record for production imagery.

## 7. Homepage composition

The first screen must communicate both inspiration and a clear way to act.

1. A restrained header: working wordmark, a few clear navigation destinations and saved items.
2. A compact editorial introduction with a short useful headline, one sentence explaining the task,
   a visible search field and an accessible reference-image entry point where supported.
3. A prominent creator outfit or tightly curated photo composition, next to the search area on
   wide screens. Avoid a collage of product cutouts as the main permanent hero treatment.
4. Immediately below, a curated outfit collection with minimal chrome and clear paths into each look.
5. Further down, relevant edits or saved/recent content when real data exists. Avoid an endless stack
   of generic feature, statistics, testimonial and newsletter sections.

Keep search visible without scrolling on common mobile screens. If the hero image is tall, put
search before it on mobile. Do not use a full-screen brand poster that hides the product task.
Avoid a carousel that auto-advances or makes the only search entry hard to find.

Search can present simple suggestions, but make them useful and limited. Use conventional query
examples drawn from supported capabilities. Do not advertise photo recognition, exact matching,
live stock or natural-language understanding before those features actually work.

## 8. Discovery tiles and progressive disclosure

The owner explicitly prefers minimal information until opened. Inspiration tiles should primarily
show the outfit image, a quiet save action and a short creator/title caption. Keep the complete tile
an obvious way into the outfit. Do not overlay prices, sizes, retailer badges, ratings, likes,
comments, shopping bags and multiple CTAs across the image.

At rest, show only the information needed to decide whether to open a look. Details belong in the
next layer. Hover may reveal a subtle secondary cue, but core navigation/save must work on touch
and keyboard without hover. Do not use invisible hover-only controls.

Use a stable grid before adding masonry. A coherent 3–4 column desktop inspiration grid and 2-column
mobile discovery grid are starting points, with a 1-column editorial feature where appropriate.
Masonry is optional only if it improves actual mixed-format content and preserves understandable
reading/focus order. Do not build a Pinterest clone by default.

Product-only browsing can also be restrained: image, small name and save action; full retailer,
price, size and availability appear on opening. In explicitly price-led search, budget planning or
comparison contexts, show a discreet price because it is necessary to the task. Do not hide total
costs after the user has asked to compare or meet a budget. This exception is purposeful, not a
return to dense product cards throughout discovery.

## 9. Outfit and product detail experience

Opening a look should feel like continuing the editorial story, then reveal actionable pieces.
Desktop: large outfit photograph with a neighbouring shop-the-look panel. Mobile: image followed
by details or an accessible bottom sheet; preserve a clear close/back path and scroll position.
Do not make a tiny modal the only home for a long multi-garment shopping workflow.

Reveal these details in a clear order:

- Creator/title and permissioned image context.
- Identified/tagged garments, with honest evidence of how they were matched.
- Product name, retailer, price, sizes/stock where supported, and recorded freshness.
- Similar alternatives and a budget-adjustment action.
- Known delivery and the total for the selected combination, with missing charges explicit.
- A clearly labelled outbound action, such as “View at retailer”, when a real authorised link exists.

Differentiate creator-tagged/original products from visually similar alternatives in plain language.
Show unavailable, unknown or stale information honestly. An exact-match label needs independent
identity evidence; a similarity score is insufficient. Do not add fake review stars or urgency.

## 10. Search, filters, budget and reference upload

Use one primary search entry. Keep advanced filters collapsed until requested, particularly on
mobile. Show active filters as removable chips, result count and a clear reset. Changing filters
must retain other choices and must not silently relax a hard size, retailer or budget constraint.

Keep query, selected filters and scroll position when the user returns from a detail view. Support
loading, no results, unavailable products and failures with specific recovery actions. Do not erase
the query after an error. Avoid giant chat interfaces as the default shopping experience.

Budget controls should feel like a short styling task, not a finance dashboard. Use a clear budget
field, garment choices and “already own” toggles. Reveal a readable total and delivery breakdown
after selection. An impossible budget gets an explicit explanation and suggested changes, rather
than fabricated availability or a combination above budget labelled successful.

Reference uploads need a concise explanation of what happens to the image, format/size guidance,
preview, remove action and a useful error. Default to private processing. Never publish or persist
the reference as creator content without a separate explicit action and the necessary rights.
Until AI is implemented, identify the workflow as manual reference selection; visual polish must
not imply automatic garment recognition is occurring.

## 11. Navigation and responsive behaviour

Keep navigation vocabulary short and consistent. “Discover”, “Search” or “Shop”, “Build a look”
and “Saved” are candidates; use only the destinations that actually exist. No decorative dead links.
Do not add a mobile bottom navigation bar unless it makes the selected navigation genuinely easier.

At 360, 390, 768, 1024 and 1440px widths, verify that search remains reachable, photos crop sensibly,
text is legible and controls do not overlap. Also check 320px and 200% zoom for reflow. Do not rely
on fixed hero heights, desktop sidebars or hover interactions on mobile. Aim for 44px practical
touch targets even when icons and typography are visually restrained.

Filters can become a bottom sheet/drawer on mobile. Sheets/dialogs need a labelled title, visible
close control, Escape support where applicable, contained focus, background inertness and focus
return to the trigger. A sticky CTA must not cover content, safe areas or focused fields.

## 12. Motion, feedback and tone

Use short, quiet transitions around 120–220ms for hover/focus, saves and panels. Prefer opacity and
small transforms over elaborate animation. Honour reduced-motion preferences. No scroll hijacking,
parallax hero, auto-playing audio, spinning AI decorations or bouncing conversion prompts.

Give immediate save feedback with a pressed state and concise accessible status. Loading skeletons
should reserve the final image dimensions. Prevent unexpected layout shifts. Unavailable actions
need an explanation, not an attractive button that does nothing.

Copy should sound contemporary, direct and approachable. Prefer “Find a similar piece”, “Make this
look fit your budget” and “Save this look” over AI jargon, inflated luxury language or technical
implementation details. Avoid excessive exclamation marks, fake scarcity and sweeping “perfect
match” claims. A small truthful sample-data label is necessary in the prototype; infrastructure
details belong in documentation rather than the main product journey.

## 13. Accessibility and performance are part of the design

Use semantic landmarks, real buttons/links and programmatic labels. Headings must follow a logical
order. Save controls need accessible names and pressed state. Text alternatives should describe
useful outfit/garment information without guessing sensitive traits. Decorative images need empty alt.

Target WCAG AA contrast: at least 4.5:1 for normal text and 3:1 for large text, with clearly visible
control boundaries/focus where applicable. Never rely only on colour for selected, error or stock
states. Verify keyboard use and reflow; an attractive screenshot alone is not acceptance.

Supply responsive image sizes and modern formats when permitted; retain image dimensions, lazy-load
below-fold assets and prioritise the real hero asset. Avoid full-resolution photo dumps, unnecessary
animation libraries and many web fonts. Keep page navigation responsive as the catalogue grows.
Report actual measurements separately from targets; do not invent Lighthouse or performance scores.

## 14. Anti-patterns to avoid

- Generic SaaS dashboards, KPI tiles or admin sidebars as the consumer homepage.
- Purple/blue AI gradients, glass panels, sparkle icons or chatbot-first layouts by default.
- A collage-only or flat-lay-only visual identity that displaces creator photography.
- Wall-to-wall badges, heavy shadows, nested rounded panels or an accent colour on every surface.
- Hidden search, forced signup, app-download gates or intrusive popups before useful browsing.
- Dense marketplace metadata on every discovery tile, or essential shopping details hidden once
  the user has deliberately entered the comparison/budget task.
- Borrowed creator images, fabricated endorsements, fake products presented as live or false AI claims.
- Unrequested dark mode, social network features, video feeds, checkout or new dependencies.

## 15. Implementation and validation workflow

The current project uses dependency-free browser ES modules and a Node server. Do not introduce a
framework or rewrite the stack solely to implement these visual rules. Use reusable tokens and
shared card, button, sheet and field patterns within the actual architecture. Preserve domain logic.

Commands, from this project directory:

```sh
npm start      # Node local server; alternatively: node server.mjs
npm test       # rebuild standalone HTML and run the listed Node tests
npm run check # syntax checks
npm run build # regenerate Threadline.html after source changes
```

Node 22+ is the recommended baseline; no dependency installation is currently required. Keep monetary
values in integer pence and business rules in testable domain functions. Treat `public/` as source
and `Threadline.html` as generated output; regenerate rather than hand-editing the bundled file.

Before a substantial design task, state the intended user journey and acceptance criteria. Build
one coherent responsive direction and review it against the owner decisions. Inspect desktop/mobile
screenshots and actual interactions when a browser is available. Check search → outfit/product →
save → budget/alternatives → retailer action, including back navigation and failure cases.

Run relevant automated checks after code changes and inspect the diff. Do not write mirrored tests
for a reversible documentation-only update. Record implementation changes and verification in
IMPLEMENTATION_LOG.md when implementing the site. If browser QA is blocked, state the exact limit;
never claim visual, upload or keyboard testing was completed from syntax/domain tests alone.

Design completion requires: coherent creator-first imagery or explicit asset gaps; the chosen warm
palette and editorial hierarchy; minimal discovery cards; usable search in the first mobile screen;
complete details when opened; accessible touch/keyboard behaviour; no misleading cost/stock/AI claims;
and responsive verification at representative sizes. Identify any unverified items explicitly.

## 16. Scope, permissions and honest delivery

Do not add live retailer data without a rights record. Never put secrets in browser code or fetch
arbitrary user URLs server-side. Maintain sample-data disclosures until actual sources are connected.
Do not add public UGC, AI services, paid changes or public deployment without the relevant validation
and explicit authorisation. Prior user authorisation remains valid; do not repeatedly ask for the
same approval. Continue independent authorised work when an external dependency is blocked.

Ask for clarification only when a meaningful design choice is unresolved. Offer 2–3 distinct options
with a concrete visual/interaction consequence. For minor reversible details, use these defaults and
explain material decisions rather than interrupting the owner for every colour or spacing value.
