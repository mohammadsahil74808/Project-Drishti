# ai/

All machine learning and AI pipelines, organized by capability:

| Subfolder | Responsibility |
|---|---|
| `forecasting/` | Prophet + LightGBM ensemble for crime forecasting |
| `risk_scoring/` | XGBoost risk classifier + SHAP explainability |
| `nlp/` | NER, embeddings, FAISS semantic search over FIR text |
| `network/` | NetworkX-based criminal network graph construction & centrality |
| `geo/` | DBSCAN hotspot detection and spatial aggregation |
| `assistant/` | LangChain agent (SQL tool + RAG tool) powering the AI chat assistant |

Each module is designed to expose a pure input→output interface so it can be tested,
retrained, and swapped without touching the API layer. Models are trained/retrained
via `app/workers/` Celery jobs, not on the request path.
