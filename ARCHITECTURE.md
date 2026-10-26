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

22 October update: NO_SPEND.md is the active cost policy. wardrobe-api.mjs is a disabled adapter
returning enabled:false and refusing recognition before reading/transmitting a photo; credentials
cannot activate it. The old provider implementation remains in Git history. No deployment exists.
The settings store also saves up to 200 outfit feedback entries. These affect only local ranking
and are removed by feedback reset or privacy reset. Later historical provider setup details are
superseded by this policy.

public/wardrobe-domain.js validates garment records/boxes and ranks owned-clothes combinations.
public/wardrobe.js provides group-photo review, per-piece cropping, wardrobe CRUD and saved looks.
public/wardrobe.css extends the existing visual system. public/wardrobe-samples.js supplies 16
original illustrated testing pieces. IndexedDB threadline-wardrobe version 2 contains
pieces (cropped JPEG, editable metadata, favourites/availability) and looks (piece references).
The settings store tracks one-time sample seeding. Version-1 migration preserves pieces and looks.
Remove/restore affects sample records only. Reset writes a seeding marker to prevent samples from
reappearing after a privacy clear. Preferences use threadline:wardrobe-preferences. Full import photos are transient browser memory.
Privacy reset clears this data; piece deletion removes dependent saved looks.

24 October: optional recognition runs inside public/wardrobe-recognition-worker.js using
locally installed Transformers.js/OWL-ViT/WASM assets. The worker disables remote model
loading; photos are transferred only to the on-device worker. public/wardrobe-recognition.js
owns worker cancellation/timeouts; the domain adapter maps classes, clamps boxes and suppresses
near-duplicates before existing validation/review. Closing import terminates the model worker.
Non-detected attributes remain explicitly labelled editable defaults.

GET /api/wardrobe/local-status checks local assets. The server serves a fixed public asset
allowlist with model/runtime caching; no directory listing or arbitrary private-data access.
The setup script pins runtime integrity and model revision. A ready marker is written only
after all assets and notices are installed. Assets are ignored by Git and excluded from
standalone HTML and the normal service-worker precache. The standalone retains manual entry.
The old provider status/POST endpoints remain disabled under NO_SPEND.md. See README.md and
operations/07-LOCAL-RECOGNITION.md. Real-photo accuracy and physical-phone testing are pending.

## Production boundary

The future open-posting product needs shared auth, scoped storage, server-side file/link validation,
ownership checks, moderation, deletion/report handling and an approved HTTPS deployment. The local
profile is not authentication. The current browser data adapters should be replaced behind explicit
contracts, while retaining the pure domain and per-photo relationship model.

Money remains integer GBP pence. Unknown stock and delivery are not treated as confirmed or free.
The planner still enumerates bounded combinations and aggregates delivery once per retailer.

26 October QA extension: /phone-check.html is an optional diagnostic with separate
local-only camera/photo processing and a copyable report. It does not save wardrobe
records or test installation. THREADLINE_LAN_TEST=1 explicitly binds the public
preview to 0.0.0.0 for same-Wi-Fi device testing; without it the server still binds
to 127.0.0.1. No photo-upload endpoint or paid fallback was added. The benchmark
scripts keep dataset images and raw prediction artifacts under ignored private-data.
See operations/08-REAL-PHOTO-TESTING.md for honest metrics and device-test limits.


26 October accuracy update: public/recognition-config.js fixes the clothing checkpoint,
score threshold and resize policy. The worker uses a locally converted Conditional DETR
ONNX model through the generic PreTrainedModel wrapper, then decodes sigmoid logits
and normalised boxes itself. Class-aware suppression keeps top/layer overlaps; minimum
crop edges are 1%. A pure flat-colour guard returns no candidates before model loading.
Setup verifies source/runtime hashes, installs optional CPU conversion tools into private-data
and runs scripts/export-local-recognition.py once. Python is not a photo-inference backend.
Ready manifest v2 includes the engine, source revision and per-file hashes/sizes; stale v1
assets do not enable the new worker. Only fixed public asset paths are served. Browser
inference stays local; provider inference remains disabled. Cache v11 covers small JS
dependencies, not model weights. See operations/09-CLOTHING-RECOGNITION-UPGRADE.md.

26 October performance update: the server sets COOP same-origin and COEP
credentialless. Isolated workers with shared memory and >=4 reported logical cores
request two WASM threads, otherwise one. No weights, detection policy or model
inputs changed. The controller now queues requests, matches reply IDs and settles
all work on cancellation/error. Only image pixels enter inference; reply IDs are
routing data. Benchmark labels stay exclusively in the evaluator; annotation-guided
input cropping is no longer supported. Phone diagnostics report requested threads.
Cache v12 covers updated small files. See operations/10-RECOGNITION-PERFORMANCE.md.
