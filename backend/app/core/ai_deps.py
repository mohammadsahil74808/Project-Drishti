from typing import Annotated
from fastapi import Request, HTTPException, Depends

def get_crime_classifier(request: Request):
    model = getattr(request.app.state, "crime_classifier", None)
    if not model:
        raise HTTPException(status_code=503, detail="Crime Classification model is not available or is still loading.")
    return model

def get_risk_predictor(request: Request):
    model = getattr(request.app.state, "risk_predictor", None)
    if not model:
        raise HTTPException(status_code=503, detail="Risk Prediction model is not available or is still loading.")
    return model

def get_semantic_search(request: Request):
    model = getattr(request.app.state, "semantic_search", None)
    if not model:
        raise HTTPException(status_code=503, detail="Semantic Search model is not available or is still loading.")
    return model

CrimeClassifierDep = Annotated[any, Depends(get_crime_classifier)]
RiskPredictorDep = Annotated[any, Depends(get_risk_predictor)]
SemanticSearchDep = Annotated[any, Depends(get_semantic_search)]
