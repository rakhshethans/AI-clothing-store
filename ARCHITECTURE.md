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
- public/sable.css: SABLE-inspired bone/ink, Archivo and responsive editorial refinement.
- public/editorial.js: campaign markup on the existing editorial route, using the supplied URLs.
- public/motion.js: vanilla parallax, intersection reveals, lazy cloth video and scroll progress;
  all observers/playback are cleaned up on navigation. Reduced motion is respected. The older
  public/vendor/ GSAP files are retained as historical assets but no longer loaded or cached.
- public/pwa.js, manifest.webmanifest and sw.js: install guidance and an app-only offline cache.
- server.mjs: loopback static server, health endpoint and allowlisted sample redirects.
- scripts/build-standalone.mjs: embeds all three stylesheets, modules, local feed images and fallback
  font. Online font/CDN head tags are removed in the export; the optional editorial route still
  needs internet access for its exact reference images and video.
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

The served shell optionally loads Archivo from Google Fonts and Tailwind from its CDN. Local CSS
is sufficient for the app layout if those fail. CSP permits only those declared presentation hosts
and jsDelivr for campaign media. The service worker caches local app resources only; it does not
cache the campaign video, Google Fonts or remote script. No reference media is silently substituted.

The worker precaches an explicit same-origin app-file list. It ignores external retailer requests,
sample redirects, unknown paths and non-GET methods. It never caches an upload endpoint or syncs
private posts. A new worker version should change the named app cache when its offline contract
changes. The standalone HTML removes manifest/touch-icon references and skips worker registration.

## Production boundary

The future open-posting product needs shared auth, scoped storage, server-side file/link validation,
ownership checks, moderation, deletion/report handling and an approved HTTPS deployment. The local
profile is not authentication. The current browser data adapters should be replaced behind explicit
contracts, while retaining the pure domain and per-photo relationship model.

Money remains integer GBP pence. Unknown stock and delivery are not treated as confirmed or free.
The planner still enumerates bounded combinations and aggregates delivery once per retailer.
