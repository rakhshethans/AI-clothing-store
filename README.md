# Threadline

A mobile-first outfit discovery and shopping prototype. The default Explore page is a social-style
feed: swipe through photo dumps, open a photo-specific shopping sheet, and save posts or pieces.

## Open it

Open **Threadline.html** in a browser for the self-contained preview. No install, API key or network
is required. Refresh that file after a new build. This file preview cannot be installed as a PWA.
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
