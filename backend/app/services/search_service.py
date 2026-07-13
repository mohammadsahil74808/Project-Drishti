from app.schemas.assistant import SemanticSearchResponse, SemanticSearchResult

def semantic_search(query: str, top_k: int, model) -> SemanticSearchResponse:
    if not model:
        return SemanticSearchResponse(query=query, results=[])
    hits = model.search(query, top_k=top_k)
    results = []
    for hit in hits:
        score = hit.get("score", hit.get("distance", 0.0))
        if isinstance(score, (int, float)):
             score = round(max(0.0, min(1.0, float(score))), 2)
        else:
             score = 0.5
        results.append(
            SemanticSearchResult(
                fir_id=hit.get("fir_id"),
                fir_no=hit.get("fir_no", "Unknown"),
                score=score,
                snippet=hit.get("snippet", "")
            )
        )
    return SemanticSearchResponse(query=query, results=results)
