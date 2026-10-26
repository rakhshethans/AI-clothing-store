# Real-photo recognition check — 26 October 2026

Status: experimental; the proposed recognition quality gates are not met.
No threshold, prompt or NMS parameter was tuned on this sample. Model/runtime and
production recognition behaviour are unchanged.

## Sample and scoring

Used the first 30 validation rows from detection-datasets/fashionpedia, revision
80845435ce686b8a9dbf70a05452fbfb8e09cdd7. This fixed selection was made before
inference. There are 93 annotated instances in the supported clothing categories;
26 of the photos have at least two such instances. These are primarily worn-outfit
photos, not a representative test of clothes laid out on a bed/floor.

Images remain in ignored private-data/recognition-benchmark. No photographs,
signed download URLs or pixel data are committed. Aggregate metrics and dataset
image IDs are recorded for reproducibility. Fashionpedia annotation attribution:
Menglin Jia, Mengyun Shi, Mikhail Sirotenko, Yin Cui, Claire Cardie, Bharath Hariharan,
Hartwig Adam and Serge Belongie, Fashionpedia, ECCV 2020. Dataset image rights remain
with their original sources; see the official data-license page.

Each prediction must match one unclaimed annotation of the same broad wardrobe
category with box IoU >= 0.5. Garment parts and unsupported accessory classes are
excluded. Confidence threshold 0.1, duplicate suppression IoU 0.65 and the existing
20-draft cap are unchanged. Both runs use the actual production browser worker,
local WASM assets and the normal resize/JPEG preparation policy.

| Check | Matched / labelled | Recall | Target-label precision | Extra unmatched boxes | Warm median |
| --- | --- | --- | --- | --- | --- |
| Full photos | 61 / 93 | 65.6% | 30.8% | 137 | 2.59 s |
| Crops around labelled outfits | 62 / 93 | 66.7% | 46.3% | 72 | 2.81 s |

The second check uses annotation-guided crops with a 3% margin. It is a diagnostic
oracle crop, not a feature that automatically chooses the correct subject. It must
not be presented as an independent held-out result or an automatic targeting gain.

Important metric limitation: annotations concentrate on the main outfit, while some
photos contain spectators and other background clothing. Inspection of examples
6410, 8554 and 8985 confirmed real unannotated background clothes. Some unmatched
boxes are therefore real clothes, rather than hallucinations. The reported precision
measures agreement with the target outfit labels, not all-visible-clothing accuracy.
Cropping reduces that problem but does not remove every annotation mismatch.

Blank-image controls produced zero detections. No POST requests or page errors
occurred during either run. External font requests were blocked; model/runtime
requests stayed on loopback. First runs including model load took 6.17 s / 5.52 s.
This is desktop Chrome on Windows with a narrow viewport, not phone timing.

## Implication

Keep review mandatory. The test does not justify automatic saving, a reliability
claim or a fixed confidence percentage. Tops were often missed or classified as a
one-piece; background clothes can fill the review list. Real flat lays, overlapping
piles, user's camera images and human correction time still need testing. Compare a
fashion-specific detector on a separate development set before selecting another
model; use an untouched set to validate any eventual improvement.

Evidence files:
- recognition-real-photo-qa-2026-10-26.json
- recognition-real-photo-crop-qa-2026-10-26.json
- phone-diagnostic-qa-2026-10-26.json

## Run the reproducible benchmark

1. Install the optional free local assets using README.md, then start node server.mjs.
2. Run node --use-system-ca scripts/prepare-recognition-benchmark.mjs.
3. Run node scripts/benchmark-local-recognition.mjs with Playwright available.
4. The optional --subject-crop flag runs the annotation-guided diagnostic separately.

If Playwright is installed outside this repository, set THREADLINE_PLAYWRIGHT_MODULE
to its absolute file URL. THREADLINE_CHROME can select an existing Chrome executable.
No Playwright installation or browser download is performed automatically. All model
inference runs locally. Dataset preparation downloads public data, not paid inference.

## Physical iPhone handoff — not yet performed

The diagnostic page /phone-check.html avoids wardrobe-storage and installation
requirements, so it can exercise the local worker over plain local-network HTTP.
It does not test the full app's secure-context requirements or PWA installation.

On your Windows computer, from the project directory, stop any preview using port
4187. In PowerShell run:

```powershell
$env:THREADLINE_LAN_TEST='1'
node server.mjs
```

The flag deliberately allows other devices on your network to request the public
preview files. The default without this flag remains loopback-only. Use a trusted
private Wi-Fi network; do not forward the port on your router. If Windows asks,
allow Node on the private network only. No hosting, certificate purchase or API key
is needed for this diagnostic.

Find your computer's Wi-Fi IPv4 address using ipconfig. On the iPhone on the same
Wi-Fi, open Safari at http://YOUR-PC-WIFI-IP:4187/phone-check.html. The localhost
address points at the phone itself and will not reach your computer. If the page
cannot load, check the network/firewall; do not disable the firewall globally.

Take a photo of 3–5 separated clothes. Run recognition, inspect each crop and count
misses, extras and wrong categories. Repeat with overlapping clothes and one blank
surface. Run a second time to compare warm vs first-run timing. Cancel once during
loading and retry. Note browser crashes/reloads, camera image format, long pauses
and whether the page becomes unresponsive. Choose Show test results and copy the
report; it contains timing, categories and boxes, not the photograph.

After testing, stop the server and remove the optional LAN flag:

```powershell
Remove-Item Env:THREADLINE_LAN_TEST
```

Physical Safari/camera/memory results remain unverified until this is done on a real
phone. The automated diagnostic test used desktop Chrome with touch emulation at
320/390/768/1440px and an insecure HTTP test origin; it is not an iPhone result.

Sources:
- https://huggingface.co/datasets/detection-datasets/fashionpedia
- https://fashionpedia.github.io/home/data_license.html
