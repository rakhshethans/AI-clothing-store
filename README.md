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
