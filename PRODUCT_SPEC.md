# Threadline product specification

Status: mobile social-shopping prototype, 19 October 2026. Working name, not trademark-cleared.

## Latest owner direction

On 18 October the owner selected:
- An installable mobile-first website for iOS and Android.
- An Instagram-style vertical feed with horizontal multi-photo posts.
- A garment list in a bottom sheet, attached to the currently selected photo.
- Open posting by anyone with an account in the eventual shared product.
- One discovery feed, curated initially and personalised later.

These decisions supersede the earlier curated-storefront-only Explore direction in AGENTS.md.
GPT Taste is the requested design skill; the Sites skill must not be used. The warm editorial
palette and progressive disclosure of shopping information remain applicable.

The second set of planning questions was unanswered before implementation. Reversible defaults
are likes/save/follow, manual retailer links, allowing untagged photos, saving posts and garments,
and warm editorial visuals. These are implementation defaults, not separately confirmed choices.

## Implemented experience

Explore, Search, Post, Saved, Wardrobe and Profile navigation; desktop side rails and mobile bottom navigation;
photo carousels; photo-specific shopping sheets; labelled similar sample pieces; separate saved-post
and saved-garment collections; local likes/follows; local profile; photo-dump composer with up to six
validated images and eight manually linked garments per image; optional prices and link types;
local photo persistence, deletion, report logging and hide/unhide.

Posting is implemented as a browser-local preview. It is not a production account, shared feed,
public upload endpoint, authorisation system, moderation service or recommendation model.
No password or fake account registration is requested. Untagged photos remain valid.

The previous 48-product catalogue, composable filters, product details, browser saves/export and
three-piece budget planner remain available. All catalogue offers are fictional. Money is integer
pence; hard constraints and delivered totals are not silently relaxed.

## App installation and offline support

The source version includes a web manifest, 192/512 icons, Apple touch icon, service worker and
install guidance. Public phone installation requires HTTPS. The direct-file standalone preview
works offline but cannot be installed. No actual iOS/Android home-screen install is claimed as tested.

## Acceptance

Swiping a photo changes its counter and associated pieces. Untagged photos have no misleading
shopping CTA. Saved collections and local posts survive reload. Drafts can be cancelled and reopened.
Local posts can be deleted, and failed deletion must not be described as successful. Links require
public HTTPS without embedded credentials. The composer accepts JPEG/PNG/WebP up to 5 MB and
20 megapixels per photo. It keeps photo rights explicit and never infers a product match.

The layout must reflow at 320–1440 CSS pixels, keep bottom navigation clear of content and respect
reduced motion. The feed must not pin posts or hijack scrolling. See the implementation log for
actual browser evidence and outstanding real-device/accessibility checks.

## Wardrobe and owned-clothes styling (19 October)

Owner authorised multi-garment photo import and recommendations from owned clothes. Wardrobe
is now a dedicated main navigation destination. It provides group-photo import with separately editable/cropped garment drafts, manual
missed-piece marking, local persistence, favourites, availability, editing and deletion. Outfit
ideas uses actual wardrobe records, occasion/weather/colour preferences and optional anchors.
Complete top/bottom/shoes or one-piece/shoes combinations are required; no imaginary items are
substituted. Save combinations separately from product/post saves. Colours remain visible.

The owner subsequently requested a pre-populated test wardrobe: seed 16 explicitly labelled
sample pieces across all six garment categories once, without modifying personal items. Samples
are original illustrations, not user-owned garments or recognition output. Remove/restore controls
affect sample records and their dependent saved looks only. Privacy reset prevents automatic
reseeding on reload. Sample outfit suggestions are labelled as containing sample pieces.

Automatic detection has a real server-side provider integration requiring AI_GATEWAY_API_KEY and
an image/structured-output capable AI_GATEWAY_MODEL. Neither is configured in this environment;
recognition remains explicitly unavailable rather than returning fabricated detections. Manual
entry and local recommendations work independently. Live accuracy and provider retention need
validation before launch. See operations/06-WARDROBE-AND-STYLING.md.

## Next production gates

Provision shared authentication and authorised storage; implement public posting and server-side
validation; define moderation/report/block operations; obtain creator/product-image permissions;
audit stock/data sources; then deploy an approved HTTPS beta. No public launch or paid action is
implied by this prototype.
