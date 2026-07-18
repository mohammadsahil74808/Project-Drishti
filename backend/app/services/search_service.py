from app.schemas.assistant import SemanticSearchResponse, SemanticSearchResult

def semantic_search(query: str, top_k: int) -> SemanticSearchResponse:
    import requests
    from app.core.config import settings
    
    try:
        resp = requests.post(
            f"{settings.ai_engine_url}/search/semantic", 
            json={"query": query, "top_k": top_k}, 
            timeout=10.0
        )
        resp.raise_for_status()
        data = resp.json()
        
        results = []
        for hit in data.get("results", []):
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
    except Exception as e:
        print(f"Semantic search failed: {e}")
        return SemanticSearchResponse(query=query, results=[])
