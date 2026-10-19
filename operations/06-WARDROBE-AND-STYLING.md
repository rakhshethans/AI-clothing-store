# Digital wardrobe and outfit suggestions

Owner requested multi-garment photos and recommendations from owned clothes on 19 October 2026.
Implemented as an extension of the existing app, using GPT Taste and design.md; no Sites workflow.

## User journey

Profile → My wardrobe → Add clothes → choose up to four group photos → explicitly allow recognition
→ Identify clothes → review separate garment names, categories, colours and crops → add selected
pieces together. Up to 20 detected pieces per photo and 300 saved pieces in this local prototype.
JPEG/PNG/WebP input, maximum 8 MB and 20 megapixels each, resized to a 1600px edge and JPEG before
inference. Each saved crop has a maximum 520px edge. Browser storage is IndexedDB, not an account.

Detected boxes can be corrected in percentage fields. A missed piece can be marked by dragging a
box or using the keyboard-accessible crop fields; no separate photo is required. Estimates must
remain editable. Occluded items, lighting, busy backgrounds and similar/overlapping clothes can
cause recognition mistakes. Identity, fabric composition, size and exact brand are not established.

Outfit ideas combines owned available top + bottom + shoes, or one-piece + shoes, with optional
layers. Users choose occasion, weather and colour direction, can anchor a particular piece, and
can favourite items and save combinations. A missing complete combination is reported honestly.
Favourites and the selected anchor are prioritised; ranking considers up to 30 suitable pieces
per category with a bounded beam of base combinations. This is a heuristic search, not a claim
to find a globally optimal outfit among every possible combination. Suggestions are diversified.

## Styling research and its limits

Sources inspected 19 October 2026:

- Adobe, Colour Wheel Combinations:
  https://www.adobe.com/uk/creativecloud/design/discover/color-wheel.html
  Uses related, contrasting and tonal colour relationships. Our named-colour artist's wheel is
  an approximate implementation choice, not a measured colour model for actual fabric.
- Adobe, A Guide to Complementary Colours:
  https://www.adobe.com/uk/creativecloud/design/discover/complementary-colors.html
- Stitch Fix stylist advice on balancing proportions:
  https://newsroom.stitchfix.com/blog/stitch-fix-unveils-trends-shaping-winter-2025/
- Stitch Fix on using a printed piece with a neutral base:
  https://www.stitchfix.com/women/blog/style-guide/plus-size-clothing-guide/

Implementation inference: favour a coherent colour palette, compatible dress levels, one print
focus, and contrasting garment volumes. More expressive mode permits stronger colour contrasts
and mixed patterns. These are adjustable preferences, not universal style rules or a scientifically
validated measure of attractiveness. No body classification, gender inference or skin-tone analysis.
Warmth and dress level are user-editable estimates. Weather is selected manually, not fetched.
Cold-day suggestions need adequate summed garment weight and a layer; no waterproof/temperature
guarantee is implied. Recommendation explanations state the actual attributes used.

## Connect automatic recognition

The integration is real provider-neutral HTTP through Vercel AI Gateway, using the official
Chat Completions image-input and strict structured-output formats. No SDK dependency was added.

Docs verified:
https://vercel.com/docs/ai-gateway/sdks-and-apis/openai-chat-completions/images
https://vercel.com/docs/ai-gateway/sdks-and-apis/openai-chat-completions/structured-outputs

1. Create a budget-limited AI Gateway key in your provider account. Never put it into chat or
   browser code. Key creation, billing and provider retention settings are not configured here.
2. Inspect the current full model list at https://ai-gateway.vercel.sh/v1/models and choose a model
   that accepts image inputs and strict JSON-schema outputs. Do not copy an obsolete model ID.
3. Put AI_GATEWAY_API_KEY and AI_GATEWAY_MODEL in an uncommitted .env.local in the project root,
   or set them in the server environment. AI_GATEWAY_MODEL is the exact provider/model ID.
4. Run node server.mjs from the project folder and open http://127.0.0.1:4187/#wardrobe .
   The Node entry point loads .env.local explicitly. Restart after changing configuration.
5. Use a permitted group photo, review consent, identify, then inspect and save the detected items.
   Verify model quality on real photographs before enabling an actual public beta.

When either setting is absent, the API and UI report that recognition is unconnected. No fake
automatic results are produced. Manual group-photo marking and outfit generation still work.
The standalone Threadline.html cannot contact this server API; use the served version for AI.

## Privacy and service limits

Only an explicit Identify clothes action sends the resized full group photo via the app server to
the configured model provider. Users are told this before consent. The app's server does not persist
the image or log request bodies. The gateway/provider may retain data according to the account's
settings and terms; no zero-retention claim is made. Cropped pieces remain on the device. Outfit
ranking runs locally without sending wardrobe images. Privacy reset clears pieces, saved outfits
and preferences. Deleting a piece removes saved looks referencing it. Failing writes are not
reported as saved, and cancelling an import must not save partial pieces.

The preview server binds to 127.0.0.1. Recognition requires JSON, a same-origin custom request header
and per-request consent, with a 3.1 MB request cap, one concurrent call, a 45s timeout and 30 attempted
calls per UTC day per process. These reset on restart and are local guardrails, not production auth
or a billing cap. Configure a real provider budget separately. Public hosting requires real account
auth, durable quotas, model access restrictions and tested privacy/retention arrangements first.

## Verification boundary

Automated provider-adapter tests substitute network responses. Browser QA uses a synthetic three-
garment group photo and explicitly mocked detections to verify per-piece cropping, correction,
persistence and recommendation interactions. These are test fixtures, not production recogniser
results. No live credential is present; live model output quality and paid inference remain untested.
