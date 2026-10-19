# Rollback and incident procedure

Local: stop this app's server using Ctrl+C; restart the last known-good project copy/version.
Never stop unrelated parent project processes. Do not delete user browser storage as a release step.

Importer: validates before writing, stages to a separate path and atomically promotes the snapshot.
Keep the last good snapshot copy before a live import. Rejected data must not replace it. Imports
are not automatically wired into the public catalogue in this controlled prototype.

Future deployment: retain immutable last-good application and catalogue releases. Disable AI,
uploads or feed jobs first if implicated; restore known-good app/config/snapshot and verify search,
filters, price calculations, outbound URLs and disclosures. Prefer additive compatible migrations.
Do not run destructive DB rollback against user data; use a tested forward fix or backup restore.
Record impact, affected versions, remediation and follow-up. Revoke any actually exposed credential.
