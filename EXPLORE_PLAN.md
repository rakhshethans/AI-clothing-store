# Explore: agreed direction and current implementation

## Confirmed choices

| Area | Owner choice |
|---|---|
| Delivery | Mobile-first website, installable on iOS/Android |
| Feed | Instagram-style vertical feed with horizontal photo dumps |
| Outfit links | Garments attached to individual photos, revealed in a bottom sheet |
| Posting audience | Anyone with an account in the eventual shared product |
| Ranking | One discovery feed; curated initially, personalisation later |
| Design workflow | GPT Taste; no Sites skill |

## Journey

Open Explore → browse a post → swipe its photos → open Shop this look → inspect linked pieces →
save a post or garment → visit a retailer or build a sample outfit budget.

Post → choose up to six photos → add a caption → select each photo and attach optional clothing
links → confirm photo rights → post. Multiple looks can live in one photo dump without mixing
their garment lists. Photos without links remain valid.

## Interface

Mobile uses a compact wordmark/search header and five bottom destinations: Explore, Search, Post,
Saved and Profile. A post presents the author, photos, caption, restrained actions and a shopping
entry for the current image. No engagement counts or endorsements are invented.

Desktop keeps the same feed in the middle, with app navigation at left and secondary inspiration
at right. Warm ivory, charcoal and olive, editorial serif accents and the local Geist font keep
the existing design direction. The social feed does not use pinned scrolling or a large sales hero.

## Implemented defaults awaiting future preference changes

Likes/save/follow; manual retailer links; untagged photos allowed; separate post/garment saves.
Comments, DMs, creator payouts and a recommendation model are not included.

## Honest prototype limits

The controls operate locally. The composer persists photos in this browser; it does not publish
to other people. Demo profiles and AI-created imagery are labelled. Reports stay on the device.
Profile creation does not establish an authenticated account.

For a shared product, implement real authentication, user/content ownership, authorised image
storage, upload validation, moderation operations and privacy/deletion flows before public release.
Home-screen installation must be validated on real iOS/Android devices over an approved HTTPS host.
