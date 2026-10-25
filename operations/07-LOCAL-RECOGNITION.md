# Local recognition investigation — 24 October 2026

Status: browser inference is feasible; garment accuracy remains unverified.

Recommended first benchmark: Xenova/owlvit-base-patch32 using Transformers.js.
The model returns multiple labelled boxes and has a 155 MB quantised ONNX file.
That size excludes runtime, tokenizer and configuration assets. The original Google
model card lists Apache 2.0. Quantised-browser compatibility and speed need tests.

Alternative: valentinafevu/yolos-fashionpedia lists MIT and fashion categories;
its inspected repository contains a 123 MB PyTorch checkpoint, without an ONNX
export. Its labels include sleeves, collars and pockets: filter these so garment
parts do not become separate wardrobe records. yainage90/fashion-object-detection
is another MIT-labelled candidate, with a 43.5M-parameter Conditional DETR model.
Model-card metadata is not a completed license audit; preserve applicable notices.

## Implementation decision

Keep provider recognition disabled. Local inference needs no metered API or cloud
service. Vendor a pinned runtime, weights and WASM binaries; explicitly disable
remote model loading with env.allowRemoteModels=false and set local model/WASM
paths. Default library settings fetch remote assets. No cloud fallback.

Run inference in a worker, one resized photo at a time. Feature-detect WebGPU and
retain local WASM fallback. Provide cancellation and release model/image resources.
Map garment labels to the existing six categories, suppress duplicate boxes and
validate normalised crops. Keep manual marking available. Always review before
saving; the detector does not establish fit, warmth, formality or accurate colour.
Use distinct local-inference privacy text stating that photos stay on the device.

Keep large model files outside standalone HTML and the normal service-worker
precache. An optional initial model download should show its measured total size.
No app UI changes are justified until the candidate passes real-photo testing.

## Benchmark protocol

Use at least 30 annotated real photos spanning 2–6-item flat lays, folded clothing,
overlap, worn outfits, shoes/accessories, dark fabrics, difficult lighting and
empty controls. SVG sample garments cannot establish real-photo accuracy.
Keep photos and annotations under ignored private-data; never commit them.

Match predictions one-to-one by category and intersection-over-union >= 0.5.
Measure precision, recall, duplicate boxes, crop correction time, cold/warm latency,
complete download size and memory where measurable. Tune thresholds on development
photos and evaluate held-out photos separately, with per-category results.
Proposed gates (not achieved results): precision >=90%, recall >=80%, faster review
than manual marking and no crashes on the target phone. Test actual iPhone Safari
as well as desktop Chrome; mobile emulation is insufficient for performance.

## Evidence and limits

Official documentation and model cards/file lists were read. Public Hugging Face
model metadata and npm package metadata are reachable from Node using
--use-system-ca. Initial TLS verification failed; system CA support resolved it
without disabling validation. No runtime or weights were installed; no model ran.
Real-photo accuracy, mobile latency and memory remain unknown. No paid API request,
cloud resource, deployment or remote CI run was started. Existing no-spend provider
block remains unchanged.

## Primary sources

- https://huggingface.co/docs/transformers.js/index
- https://huggingface.co/docs/transformers.js/custom_usage
- https://huggingface.co/docs/transformers.js/guides/webgpu
- https://huggingface.co/Xenova/owlvit-base-patch32
- https://huggingface.co/Xenova/owlvit-base-patch32/tree/main/onnx
- https://huggingface.co/google/owlvit-base-patch32
- https://huggingface.co/valentinafevu/yolos-fashionpedia
- https://huggingface.co/valentinafevu/yolos-fashionpedia/tree/main
- https://huggingface.co/yainage90/fashion-object-detection

## Prototype update — 24 October 2026

The implementation now exists: optional pinned assets installed locally, a browser
worker running quantised OWL-ViT through WASM, and editable draft integration in the
existing import dialog. The no-spend provider endpoint remains disabled. Runtime
assets use the bundled transformers.min.js build; the web-only build requires bare
module imports and cannot be loaded directly in a worker without a bundler.

Actual browser inference was exercised on the existing AI-created editorial image;
this proves execution and integration, not accuracy on real flat lays. The complete
model/runtime download is approximately 173 MiB. Local setup is explicit, free of
provider credentials and excluded from Git/standalone bundling. See README.md for
setup. The representative held-out accuracy and physical-phone gates above remain
pending. A failed model run never falls back to a paid provider.
