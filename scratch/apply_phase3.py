import os

def update_file(path, replacements):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    for old, new in replacements:
        content = content.replace(old, new)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

# 1. Update deps.py for UserRole
deps_py = r"c:\Users\Ayan\OneDrive\Desktop\Project Drishti\backend\app\core\deps.py"
update_file(deps_py, [
    ("from database.models.user import User, UserRole", 
     "from database.models.user import User\nfrom enum import Enum\nclass UserRole(str, Enum):\n    ADMIN = 'ADMIN'\n    SP = 'SP'\n    COMMISSIONER = 'COMMISSIONER'\n    SHO = 'SHO'\n    ANALYST = 'ANALYST'")
])

# 2. Update main.py
main_py = r"c:\Users\Ayan\OneDrive\Desktop\Project Drishti\backend\app\main.py"
main_code = """from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting up and loading AI models...")
    try:
        from classification.crime_classifier import CrimeClassifier
        app.state.crime_classifier = CrimeClassifier.load_latest()
    except Exception:
        app.state.crime_classifier = None

    try:
        from risk.risk_predictor import RiskPredictor
        app.state.risk_predictor = RiskPredictor.load_latest()
    except Exception:
        app.state.risk_predictor = None

    try:
        from search.semantic_search import SemanticSearchService
        app.state.semantic_search = SemanticSearchService()
    except Exception:
        app.state.semantic_search = None

    yield
    app.state.crime_classifier = None
    app.state.risk_predictor = None
    app.state.semantic_search = None

app = FastAPI(
    title=settings.app_name,
    description="AI-Driven Crime Analytics & Visualization Platform — Karnataka State Police",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.api_v1_prefix)

@app.get("/health", tags=["system"])
def health_check():
    return {"status": "ok", "service": "SentinelX AI backend"}
"""
with open(main_py, "w", encoding="utf-8") as f:
    f.write(main_code)

# 3. Update search_service.py
search_service_py = r"c:\Users\Ayan\OneDrive\Desktop\Project Drishti\backend\app\services\search_service.py"
search_code = """from app.schemas.assistant import SemanticSearchResponse, SemanticSearchResult

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
"""
with open(search_service_py, "w", encoding="utf-8") as f:
    f.write(search_code)

# 4. Update search.py
search_py = r"c:\Users\Ayan\OneDrive\Desktop\Project Drishti\backend\app\api\v1\search.py"
search_router_code = """from fastapi import APIRouter
from app.core.ai_deps import SemanticSearchDep
from app.schemas.assistant import SemanticSearchRequest, SemanticSearchResponse
from app.services import search_service

router = APIRouter(prefix="/search", tags=["search"])

@router.post("/semantic", response_model=SemanticSearchResponse)
def semantic_search(payload: SemanticSearchRequest, semantic_model: SemanticSearchDep):
    return search_service.semantic_search(payload.query, payload.top_k, semantic_model)
"""
with open(search_py, "w", encoding="utf-8") as f:
    f.write(search_router_code)

# 5. Update assistant_service.py
asst_service = r"c:\Users\Ayan\OneDrive\Desktop\Project Drishti\backend\app\services\assistant_service.py"
update_file(asst_service, [
    ("from app.services import analytics_service, search_service", "from assistant.chat_backend import handle_chat_message\n"),
    ("""def answer_query(db: Session, query: str, district_id: uuid.UUID | None = None) -> ChatMessageResponse:
    normalized = query.lower()

    if re.search(r"trend|how many|volume|cases?\\b", normalized):
        distribution = analytics_service.get_crime_type_distribution(db, district_id, None, None)
        trend = analytics_service.get_crime_trend(db, district_id, None, None, None, "daily")
        insight = analytics_service.generate_ai_insight(distribution, trend)
        content = insight.summary
        chart_payload = {
            "type": "distribution",
            "data": [i.model_dump(mode="json") for i in distribution.items[:5]],
        }
    elif re.search(r"search|find|show me cases|pattern", normalized):
        results = search_service.semantic_search(db, query, top_k=5)
        if results.results:
            content = (
                f"Found {len(results.results)} matching cases. Top match: FIR "
                f"{results.results[0].fir_no} — \\\"{results.results[0].snippet[:100]}\\\""
            )
        else:
            content = "No matching cases found for that description in the current dataset."
        chart_payload = {"type": "search_results", "data": [r.model_dump(mode="json") for r in results.results]}
    else:
        content = (
            "I can answer questions about crime trends, case volumes, and search FIR "
            "narratives. Try asking about a specific crime type, district, or time range."
        )
        chart_payload = None

    return ChatMessageResponse(
        id=uuid.uuid4(),
        content=content,
        created_at=datetime.utcnow(),
        chart_payload=chart_payload,
    )""", """def answer_query(db: Session, query: str, district_id: uuid.UUID | None = None) -> ChatMessageResponse:
    session_id = str(uuid.uuid4())
    try:
        ai_response = handle_chat_message(query, session_id=session_id)
        content = ai_response.get("response", ai_response.get("content", ""))
        chart_payload = ai_response.get("data")
    except Exception as e:
        content = f"Error communicating with AI engine: {e}"
        chart_payload = None

    return ChatMessageResponse(
        id=uuid.uuid4(),
        content=content,
        created_at=datetime.utcnow(),
        chart_payload=chart_payload,
    )""")
])

# 6. Update fir_service.py
fir_service = r"c:\Users\Ayan\OneDrive\Desktop\Project Drishti\backend\app\services\fir_service.py"
update_file(fir_service, [
    ("def create_fir(db: Session, payload: FIRCreate) -> FIR:\n    existing = db.scalar(select(FIR).where(FIR.fir_no == payload.fir_no))\n    if existing:\n        raise DuplicateFIRNumberError(f\"FIR number '{payload.fir_no}' already exists.\")",
     "from nlp.fir_parser import parse_fir_text\ndef create_fir(db: Session, payload: FIRCreate) -> FIR:\n    existing = db.scalar(select(FIR).where(FIR.fir_no == payload.fir_no))\n    if existing:\n        raise DuplicateFIRNumberError(f\"FIR number '{payload.fir_no}' already exists.\")\n    if payload.mo_description:\n        try:\n            parsed = parse_fir_text(payload.mo_description, use_spacy=False)\n            if not payload.ipc_sections and parsed.get(\"sections\"):\n                payload.ipc_sections = parsed[\"sections\"]\n            if not payload.weapon_used and parsed.get(\"weapons\"):\n                payload.weapon_used = parsed[\"weapons\"][0]\n        except Exception:\n            pass")
])

print("Finished applying phase 3.")
