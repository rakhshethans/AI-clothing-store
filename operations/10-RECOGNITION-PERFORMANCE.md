# Local recognition performance and integrity - 26 October 2026

Recognition now uses up to two local WASM CPU threads on capable, isolated browser
pages. The clothing model, weights, input resolution, score threshold and duplicate
suppression are unchanged. No cloud inference, paid dependency or deployment is used.

## Measured outcome

| Browser sample | Labelled matches | Previous warm median | New warm median | New cold run |
| --- | --- | --- | --- | --- |
| Original 30 development photos | 83/93 | 8.835 s | 4.327 s | 6.529 s |
| Reserved 30 validation photos | 90/99 | 8.757 s | 4.544 s | 7.040 s |

All candidate fields (including scores and boxes) were exactly equal to the saved
single-thread predictions for every one of the 60 photos. This is a measured speed
improvement, not a new accuracy improvement. Timings are separate desktop Chrome
runs on the same machine; warm medians are approximately 1.9-2.0 times faster. The
reserved sample was checked after keeping the existing detector policy. The same
Fashionpedia scope, upstream split-independence caveat and background-annotation
limits in 09-CLOTHING-RECOGNITION-UPGRADE.md still apply. Physical phone timings,
Safari and realistic flat lays remain unverified.

## Runtime changes

The local server sends COOP same-origin and COEP credentialless headers. The worker
requests two CPU threads only if cross-origin isolation, SharedArrayBuffer and at
least four reported logical cores are available. It otherwise requests one thread;
insecure same-Wi-Fi HTTP phone pages therefore retain the single-thread path. The
runtime also performs its own feature checks. No model/runtime download changes or
additional packages are required. Phone reports record isolation and requested
thread count so device reports remain interpretable. Small-file app cache is v12.

The worker controller serialises overlapping recognition calls. Replies carry a
request ID, stale replies are ignored, and cancellation removes queued work or
terminates an active worker before continuing. Stopping recognition or a fatal
worker error settles all outstanding promises. This fixes overwritten callbacks
that could strand an import. Closing import still releases the worker and model.

## Detection integrity

Only decoded image pixels enter model inference. A monotonically increasing ID
routes replies and never enters the model. Filenames, timestamps, wardrobe samples,
reference annotations and image-specific result tables are not detector inputs.
The fixed seven category names are the model's vocabulary, not preset detections.
Non-detected colour/fit/pattern fields remain explicitly editable defaults.

Actual-model QA imported identical photo bytes under conflicting garment filenames
and different timestamps: pixels and detection outputs were identical. A uniform
control returned no garments. Concurrent calls, cancellation with queued work, and
actual single-thread inference without isolation all completed correctly. No photo
uploads, unexpected remote requests or page errors occurred.

The benchmark now passes the full photo alone into its browser inference function.
Reference boxes are read only afterwards by the evaluator. The former optional
annotation-guided diagnostic crop flag is rejected. Historical oracle-crop reports
remain historical diagnostics; none is used as a production recognition result.
Run tags preserve earlier reports when comparing runtime changes.

A separate native, development-only resolution experiment tried 640/1066 and
960/1600 resize bounds. At the unchanged 0.15 threshold, 640 matched only 75/93
labels. 960 matched 84/93 with 61 unmatched candidates, versus native 800/1333's
84/93 and 56 unmatched candidates. Neither alternative shipped. These native
numbers are selection checks, not the browser numbers in the table above.

## Reproduce and inspect

With installed local assets, the optional Playwright dependency and preview running:

```text
node scripts/benchmark-local-recognition.mjs --run-tag=cpu-parallel
node scripts/benchmark-local-recognition.mjs --holdout --run-tag=cpu-parallel
node scripts/verify-recognition-runtime.mjs
```

THREADLINE_PLAYWRIGHT_MODULE and THREADLINE_CHROME can point at existing local
installations. Downloaded weights, packages, raw predictions and evaluation images
stay ignored. All 45 Node tests and source syntax checks pass; standalone rebuilt.
UI import/edit/save/reload, cancellation, manual fallback and widths
320/390/768/1440px were checked again. Full-colour crop previews remain unchanged.

Evidence:
- recognition-fashion-detr-v1-cpu-parallel-development-2026-10-26.json
- recognition-fashion-detr-v1-cpu-parallel-validation-2026-10-26.json
- recognition-cpu-comparison-2026-10-26.json
- recognition-runtime-qa-2026-10-26.json
- clothing-detr-parallel-flow-qa-2026-10-26.json

Runtime references:
- https://onnxruntime.ai/docs/tutorials/web/env-flags-and-session-options.html
- https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cross-Origin-Embedder-Policy
