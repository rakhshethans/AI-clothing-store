# AI implementation gate

No automated garment recognition or exact visual match is implemented. The UI explicitly labels
its photo feature as a private reference and asks the user to select style/items manually.

Before AI: confirm product/creator processing rights and provider terms, DPA, retention, model
availability and budget. Create 60 permissioned cases: 20 known catalogue identities with separate
worn/studio views, 20 similar-item requests and 20 absent/ambiguous requests. Hold out >=one third.
Record catalogue coverage independently from retrieval ranking.

Compare keyword/manual crop baseline with low-cost multimodal extraction, then optional image
embeddings. Use human-relevant precision@5, exact recall@5 for catalogue-present cases, exact-label
precision with independent evidence, no-match behaviour, correction rate, p50/p95 latency and actual
cost including retries. Cosine similarity is not an exact-identity probability.

Proposed gates: >=70% useful held-out in-scope results, no unsupported exact labels, text p95<2s,
visual p95<8s and mean visual cost allowance <=£.005 unless economics are revised. Targets are not
current measured model performance. Implement timeouts, quota caps and disable switch before beta.

Use ordinary code for budget sums, permissions, stock and links. Do not deploy a GPU, vector DB or
GraphRAG infrastructure without an observed need and an improvement over the baseline.
