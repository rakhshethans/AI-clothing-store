# Deployment preparation — not deployed

22 October owner constraint: zero spending. Deployment is on hold; do not create hosting
projects or resources. The Vercel connection was inspected read-only, and no project was created.
The instructions below are historical preparation, not permission to deploy. See NO_SPEND.md.

Current preview is loopback-only. No site registration, remote Git push or public hosting changes
were made. The parent .openai/hosting.json belongs to another application and must not be reused.

For local preview: Node 22+; `node server.mjs`; open http://127.0.0.1:4187 .
The app needs no package install or API secrets. public/ contains the web assets and local vendor
libraries. Run npm run build to regenerate the direct-file preview after changing source files.

Before public release: complete the beta/permissions checklist, choose commercial-eligible hosting,
create a separate project/identity, commit the exact source, run tests/checks and review deployment
configuration. Do not upload operations participant logs or rights contracts as public assets.
The current sample redirect endpoint is Node-specific. A static-only deployment must explicitly
replace it with approved direct links or a tested equivalent redirect handler; do not assume it
works on a generic static host. No email/AI/database deployment is configured.

Release record must include commit ID, catalogue snapshot/checksum, deployment ID, configuration
version and QA result. Public deployment and paid changes need explicit founder approval.

## Installable mobile website

The source includes a manifest, 192/512px PNG icons, Apple touch icon and an app-only offline worker.
Serve the source assets at the root of a separate HTTPS origin for phone installation. The current
manifest scope, worker path and asset URLs assume the origin root, not a GitHub Pages subdirectory.
The direct-file Threadline.html export deliberately omits manifest/touch-icon URLs and cannot be
installed. A plain HTTP address on a phone's LAN is not sufficient; localhost is a desktop test case.

On iPhone, use Safari's Share → Add to Home Screen. Android installation is browser-dependent.
Browser install guidance is in Profile. No real-device install or live service-worker registration
has been verified: sandbox networking rejects loopback navigation. Automated checks validate the
manifest, icons, precache files, cache boundaries and offline fallback through the actual handler.

Sources: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable
and https://support.apple.com/guide/iphone/open-as-web-app-iphea86e5236/ios .

Before public UGC, add shared authentication, scoped image storage, ownership enforcement,
server-side validation, moderation operations and deletion/report handling. Browser-local profiles
and reports do not supply those services. GitHub source control is not public deployment.
