# Project workflow

The owner requested regular GitHub commits on 19 October 2026.

- Make a local commit after each coherent, reviewable change and its relevant checks.
- Use concrete messages describing the resulting behaviour. Keep unrelated fixes separate.
- Push completed commits to the verified project remote when access is configured. Do not guess
  a repository, silently publish the project, force-push, or rewrite existing remote history.
- Never commit credentials, personal uploads, private-data/, browser screenshots or unrelated
  parent-project files. Keep generated screenshots in scratch unless requested as deliverables.
- Treat public/ as source; regenerate Threadline.html after source changes.
- Run npm test and npm run check for application changes. Inspect relevant desktop/mobile browser
  views when layout or interactions change. Document blockers and distinguish tests from live QA.
- Read PRODUCT_SPEC.md, EXPLORE_PLAN.md, ARCHITECTURE.md and applicable AGENTS.md instructions.
  Use GPT Taste for requested design work and do not use the Sites skill.

## Current GitHub connection

The owner supplied https://github.com/rakhshethans/AI-clothing-store on 19 October 2026. It is
configured as origin. After reconnecting GitHub and authorising the app installation, repository
writes succeeded. Direct Git networking is blocked in this environment, so use the connected
GitHub tools with the verified main head as the commit parent and an expected-SHA ref update.
Keep the original local checkpoints on a backup branch if reconciling API-created commit IDs.
Outside this network restriction, use normal Git fetch/push against origin.

Threadline.html is a generated local preview and is ignored by Git. A fresh clone can rebuild it
with node scripts/build-standalone.mjs or npm run build. Source images, fonts and vendor scripts
remain tracked, so the build does not need external downloads.
Editorial photographs are tracked as optimised WebP files. Original generated PNGs are retained
only locally under private-data/source-images and are not part of the GitHub upload or package.
