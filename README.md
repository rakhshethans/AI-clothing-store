# Threadline

Owner constraint (22 October 2026): zero spending. Cloud deployment and metered AI recognition
are disabled. The server refuses recognition even if provider credentials exist. Use local
manual photo marking and outfit generation. See NO_SPEND.md. No cloud project has been created.

A mobile-first outfit discovery and shopping prototype. The default Explore page is a social-style
feed: swipe through photo dumps, open a photo-specific shopping sheet, and save posts or pieces.

The visual refinement uses a bone/ink palette, Archivo typography online, thin rules and restrained
controls. SABLE is a styling reference only. Post photos retain their full colours; there is no
separate campaign page. See design.md for the owner's current direction.

## Open it

Open **Threadline.html** in a browser for the self-contained preview. No install, API key or network
is required. The file preview uses the local fallback font. Refresh that file after a new build.
This file preview cannot be installed as a PWA.
If you cloned the repository, first run node scripts/build-standalone.mjs to generate this file;
the standalone export is intentionally excluded from Git history.

For the source version, run Node.js 22+ from this folder:

```sh
node server.mjs
```

Open http://127.0.0.1:4187 . Stop with Ctrl+C. The server listens only on loopback. Home-screen
installation on a phone requires a hosted HTTPS version; see DEPLOYMENT.md. No public hosting,
App Store release or Play Store release has been performed.

## Try the mobile flow

1. Explore a post. Swipe horizontally, use the arrows/dots, or focus the photo rail and use arrow keys.
2. Open **Shop this look**. The sheet lists only pieces attached to the selected photo.
3. Like, follow or save a post; inspect Saved → Posts and Saved → Pieces.
4. Open Post, choose up to six photos, and add an optional caption.
5. Link garments to individual photos with a name, retailer and public HTTPS URL. Prices are optional.
6. Confirm photo rights and save the photo dump to this device. Reload to check local persistence.
7. Use the post menu to hide a demo profile, save a local report, or delete your own local post.
8. Search the sample catalogue or use Build a look to assemble a delivered sample budget.

## Your wardrobe

Open **Wardrobe** in the sidebar or mobile navigation to add several clothes from one group photo, review and correct
separate garment crops, edit pieces, mark laundry/unavailable items and save outfit ideas.
Recommendations use your owned clothes, with occasion, weather, colour and starting-piece choices.
The budget builder also links to owned-clothes styling. Six main destinations remain accessible.

A new wardrobe starts with 16 labelled illustrated sample pieces so you can immediately test
outfit ideas. Remove sample clothes preserves personal uploads; restore adds missing sample pieces
without duplicates. A privacy reset leaves the wardrobe empty until you explicitly restore samples.

Manual group-photo marking, local wardrobe storage and outfit suggestions work without an API.
Automatic provider recognition is disabled to avoid charges. It cannot be enabled merely by
adding credentials. The interface shows the disabled state; manual multi-garment marking works.
See operations/06-WARDROBE-AND-STYLING.md for setup and research/verification limits.

Wardrobe photos, metadata, outfit feedback and saved looks stay in this browser. No recognition
photo is uploaded in no-spend mode. Privacy reset also clears wardrobe data and outfit feedback.

Outfit ideas now favours smarter combinations for Evening, includes optional accessories, and
accepts Would wear / Not for me feedback. Rejected exact combinations are hidden; liked ones
are prioritised. Reset outfit feedback restores neutral ranking. This all runs locally.

## What is local

There are no shared accounts or public uploads. Profile, likes, follows, saves, hidden profiles and
reports are browser-local. Posted photo dumps persist in IndexedDB until deleted or site data is
cleared. Budget-builder reference photos remain temporary, in memory only. Nothing is sent to a
moderation service. A copied local post link is not a public share link.

The seeded editorial profiles and models are fictional and labelled. Product prices, stock,
illustrations and retailers are samples. Poster-entered retailer links are not automatically
verified, scraped, or converted into affiliate links. Real creator content and production accounts
remain future work. Assets and licences are recorded in THIRD_PARTY.md.

## Verify and rebuild

```sh
npm test
npm run check
npm run build
```

No dependency install is needed for the app or Node tests. The commands rebuild the standalone
HTML, validate the domain logic, and check source syntax. Browser evidence and its limitations are
recorded in IMPLEMENTATION_LOG.md and operations/social-browser-qa-2026-10-19.json.

Read PRODUCT_SPEC.md, EXPLORE_PLAN.md, ARCHITECTURE.md and CONTRIBUTING.md before changing scope.
The original business/data-rights research remains in operations/.

## Free experimental recognition on your device

Run `node --use-system-ca scripts/setup-local-recognition.mjs` once, then
`node server.mjs` and open http://127.0.0.1:4187/#wardrobe. Choose Add clothes,
upload a group photo and choose Identify clothes on this device. Review and edit
all crops, categories and attributes before saving. Manual marking remains available.

The setup downloads a pinned MIT-licensed clothing-specific Conditional DETR model,
verifies its SHA-256 and the Transformers.js 3.8.1 runtime archive, and converts the
weights locally to ONNX. It requires Python 3.11 or 3.12 for this one-time conversion.
If an existing bundled Python is unavailable, set THREADLINE_PYTHON to your Python
executable. The setup installs CPU-only conversion packages into ignored private-data
when needed; it does not change global Python packages. Allow disk space and time
for the optional package/model downloads. No account, API key or paid inference is
used. Browser assets total about 134 MiB; original weights and conversion packages
use additional local disk space. A repeated setup verifies/reuses complete assets.

Photo inference runs entirely in a browser worker; no Python service or cloud call
is used. The old provider endpoint stays blocked even if credentials are present.
The standalone HTML keeps manual import. Missing or outdated model assets leave
manual marking available; use the updated setup to upgrade an old OWL-ViT install.
Closing import terminates the worker and releases its model resources.

Recognition remains experimental. Broad categories cover tops, bottoms, layers,
one-pieces, shoes, bags and hats. Other accessory types can need manual marking.
Review every crop and category. Colour, pattern, fit, dress level and weight are
editable defaults, not model measurements. Physical iPhone performance is unverified.

## Recognition testing and phone diagnostic

The new browser model matched 83/93 labelled garments on the original 30 photos
(previously 61/93), and 90/99 on a separate reserved 30-photo slice. This is roughly
89% / 91% recall, not a guarantee for arbitrary clothes or flat lays. Background
clothes, missed pieces and incorrect categories remain possible. Warm desktop CPU
inference now takes about 4.3-4.5 seconds on capable isolated browsers using two
local CPU threads, versus about 8.8 seconds previously. Other browsers keep the
single-thread path. All 60 tested prediction arrays are unchanged. See
operations/09-CLOTHING-RECOGNITION-UPGRADE.md and
operations/10-RECOGNITION-PERFORMANCE.md for evidence and limitations.

For a physical iPhone check without paid hosting, that document explains the
optional local-Wi-Fi diagnostic at /phone-check.html. It processes a camera/photo
input locally and shows crops, timing and a copyable report containing no photo.
LAN access is opt-in via THREADLINE_LAN_TEST=1; the default server is loopback-only.
This diagnostic does not validate full-app installation or phone Safari performance
until it has actually been run on the device.
