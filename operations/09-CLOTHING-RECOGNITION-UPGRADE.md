# Clothing recogniser upgrade — 26 October 2026

The browser recogniser now uses a clothing-specific Conditional DETR checkpoint,
converted locally from the pinned MIT-licensed yainage90/fashion-object-detection
model. It replaces the generic text-prompted OWL-ViT detector. Images still stay in
the browser worker; no provider request or paid service is involved.

## Measured detection results

One-to-one matches require the same broad wardrobe category and IoU >= 0.5, using
the same evaluator and supported-label mapping as the previous check.

| Browser check | Correct matches | Recall | Target-label precision | Unmatched detections |
| --- | --- | --- | --- | --- |
| Previous model, original 30 photos | 61 / 93 | 65.6% | 30.8% | 137 |
| New model, same original 30 photos | 83 / 93 | 89.2% | 59.7% | 56 |
| New model, reserved 30 photos | 90 / 99 | 90.9% | 66.7% | 45 |

The original 30 photos are now development data. The reserved sample is the next
30 validation rows (30–59) at the same fixed dataset revision. Confidence 0.15,
class-aware NMS IoU 0.65 and a minimum crop edge of 1% were chosen from development
work before the reserved browser evaluation. No annotation-guided crops were used.
Model inputs contain the photograph only, never the reference annotations or IDs.

The source checkpoint itself was trained with Fashionpedia and ModaNet. Its exact
upstream train/validation independence has not been audited. Reserved here means
not used for this project's tuning; it does not establish unseen-model generalisation.
These are predominantly worn-outfit photos, not a representative flat-lay/pile test.
Some real background clothes are unannotated, so unmatched detections include real
spectator clothing. Precision is agreement with target-outfit labels, not accuracy
for all visible clothes. False classifications and duplicate boxes also remain.

On reserved photos, per-category recall was: bottoms 11/11; shoes 42/43; tops 9/11;
outer layers 4/5; one-pieces 16/19; bags/hats 8/10. The model does not detect every
accessory subtype. Scarves, ties, glasses and other unsupported types need manual
marking. Names describe broad categories; colours, patterns, fit, warmth and dress
level remain explicitly labelled editable defaults.

Desktop Chrome WASM inference took roughly 8.8 seconds per warm image and 12.2
seconds on first use. This is slower than the old model's ~2.6-second warm run.
Model/runtime browser assets are about 133.6 MiB, down from about 173 MiB. These
are illustrative desktop measurements, not iPhone timing or a latency guarantee.

## What changed

- Replaced generic prompts with the clothing model's seven fixed class outputs.
- Decode independent sigmoid scores correctly, including the final top class; do
  not apply softmax or drop a supposed background class.
- Preserve overlapping pieces from different categories during duplicate removal.
- Keep visible small garments down to 1% crop edges instead of discarding <3% pieces.
- Preserve the source model's aspect-ratio resize and RGB/normalisation contract.
- Reject uniform-colour images before loading/running the model, because they have
  no spatial garment evidence. White/black/red controls return zero. This does not
  guarantee zero false positives on textured non-clothing scenes.

The initial model-only uniform control returned one false detection. The input
quality guard fixes that. All 60 real benchmark photos were checked and pass this
pure guard unchanged. The reports retain the before-guard count and identify the
separate control retest; no real-image prediction was edited.

A YOLOS candidate reached only 25/34 development matches and was not selected. A
mirrored second-pass experiment did not improve 31/34 native development matches
and added extra detections, so it is not shipped. No threshold was lowered merely
to inflate the reserved result. The native Python figures were model-selection
checks; the table above is the actual browser implementation.

## Installation and privacy

Run the updated free setup command in README.md. The setup verifies the original
safetensors SHA-256, checks the pinned runtime archive integrity, and performs a
one-time local ONNX conversion. Python 3.11/3.12 and CPU-only ML packages are needed
for conversion, not for photo inference. Optional dependencies, original weights,
converted assets and evaluation photos stay outside Git. Global Python packages
are not modified. Re-running setup checks the installed hashes and reuses complete
assets. A missing/outdated/partial manifest leaves recognition disabled and manual
marking available. The paid provider endpoint is still unconditionally blocked.

Tests cover the score decoder, class order, duplicate suppression, small crops,
resizing, uniform inputs and existing no-spend guards. Browser flow checks cover
actual import, editing/saving, reload persistence, cancellation and manual fallback.
No POST requests, remote inference calls or page errors occurred. Original font
requests were blocked during QA. Physical iPhone/Safari and real flat lays remain
unverified; the phone diagnostic and instructions from the previous checkpoint remain.

Evidence:
- recognition-fashion-detr-v1-development-2026-10-26.json
- recognition-fashion-detr-v1-validation-2026-10-26.json
- recognition-input-guard-qa-2026-10-26.json
- clothing-detr-flow-qa-2026-10-26.json

Primary model sources:
- https://huggingface.co/yainage90/fashion-object-detection
- https://github.com/yainage90/fashion-visual-search
- https://huggingface.co/docs/transformers/model_doc/conditional_detr
