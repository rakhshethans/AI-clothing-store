# Architecture

An isolated ES-module application with a Node standard-library development server. It does not
repurpose the unrelated parent site. No framework, package installation or API key is needed.

## Modules

- public/index.html: app shell, accessible dialogs and navigation.
- public/styles.css: shared editorial design tokens and existing shopping views.
- public/explore.css: social feed, bottom navigation, photo sheets, composer and profile.
- public/app.js: routing and existing search, product-save, detail and budget flows.
- public/catalog.js: 48 synthetic products, sample retailers and original SVG garments.
- public/domain.js: pure search, availability, integer-pence totals and deterministic planning.
- public/social-domain.js: pure validation for profile handles, uploads, garment prices and URLs.
- public/social.js: feed/carousels, per-photo garment links, local composer, profile and social state.
- public/media.js and public/assets/: local original imagery, Geist font and app icons.
- public/theme.css: bone/ink, Archivo and responsive styling for the existing app.
- public/motion.js: lightweight vanilla scroll progress with route cleanup and reduced-motion
  support. No campaign motion, video or page is included. Older public/vendor/ GSAP files remain
  historical assets and are not loaded or cached.
- public/pwa.js, manifest.webmanifest and sw.js: install guidance and an app-only offline cache.
- server.mjs: loopback static server, health endpoint and allowlisted sample redirects.
- scripts/build-standalone.mjs: embeds all three stylesheets, modules, local feed images and fallback
  font. Online Google Fonts tags are removed from the self-contained export.
- tests/: catalogue/domain/importer, bundle, server, social validation and offline-worker checks.

## Browser storage

threadline:saves stores sample product IDs. threadline:social stores a local profile, liked/saved
post IDs, follows, hidden profiles and local reports. threadline:linked-pieces stores manually
saved retailer links. No password or remote session is involved.

IndexedDB threadline-social / posts stores local photo dumps, including resized JPEG data URLs,
caption, author snapshot and a separate garment array on every photo. Uploaded images are validated
before decoding, bounded to 20 megapixels, and resized to a maximum 1400px edge. Local posts persist
until deleted or browser data is cleared. This is intentionally different from the budget-builder
reference photo, which remains a temporary object URL in memory.

No user upload or retailer URL is fetched by the server. Poster links are rendered as external
HTTPS links after validation; entered prices and product identities are unverified.

## PWA boundary

The served shell optionally loads Archivo from Google Fonts. Local CSS and a locally bundled
fallback font keep the app usable offline. CSP permits Google font resources; Tailwind's CDN and
jsDelivr campaign permissions were removed. The worker caches local app resources only.

The worker precaches an explicit same-origin app-file list. It ignores external retailer requests,
sample redirects, unknown paths and non-GET methods. It never caches an upload endpoint or syncs
private posts. A new worker version should change the named app cache when its offline contract
changes. The standalone HTML removes manifest/touch-icon references and skips worker registration.

## Wardrobe extension

public/wardrobe-domain.js validates garment records/boxes and ranks owned-clothes combinations.
public/wardrobe.js provides group-photo review, per-piece cropping, wardrobe CRUD and saved looks.
public/wardrobe.css extends the existing visual system. public/wardrobe-samples.js supplies 16
original illustrated testing pieces. IndexedDB threadline-wardrobe version 2 contains
pieces (cropped JPEG, editable metadata, favourites/availability) and looks (piece references).
The settings store tracks one-time sample seeding. Version-1 migration preserves pieces and looks.
Remove/restore affects sample records only. Reset writes a seeding marker to prevent samples from
reappearing after a privacy clear. Preferences use threadline:wardrobe-preferences. Full import photos are transient browser memory.
Privacy reset clears this data; piece deletion removes dependent saved looks.

wardrobe-api.mjs provides optional local-only recognition through AI Gateway's compatible HTTP API.
GET /api/wardrobe/status reports configured/unconfigured without exposing credentials. POST
/api/wardrobe/recognise validates consent, request shape, image size/magic and model JSON output.
Server-only AI_GATEWAY_API_KEY / AI_GATEWAY_MODEL are loaded from uncommitted .env.local when
running the Node entry point. No external SDK, server-side wardrobe storage or public endpoint
authentication is added. This is not ready to expose as an unauthenticated paid inference endpoint.
See operations/06-WARDROBE-AND-STYLING.md for setup, heuristics, quotas and verification limits.

## Production boundary

The future open-posting product needs shared auth, scoped storage, server-side file/link validation,
ownership checks, moderation, deletion/report handling and an approved HTTPS deployment. The local
profile is not authentication. The current browser data adapters should be replaced behind explicit
contracts, while retaining the pure domain and per-photo relationship model.

Money remains integer GBP pence. Unknown stock and delivery are not treated as confirmed or free.
The planner still enumerates bounded combinations and aggregates delivery once per retailer.
