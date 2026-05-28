from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.schemas.recommendation import RecommendationImpressionCreate, RecommendationItem
from app.services.recommendations import engine
from app.utils.db import get_db


router = APIRouter(tags=["recommendations"])


@router.get("/recommendations", response_model=List[RecommendationItem])
def get_recommendations(
    user_id: Optional[int] = Query(None),
    k: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
):
    return engine.recommend_for_user(db, user_id=user_id, k=k)


@router.get("/feed", response_model=List[RecommendationItem])
def get_feed(
    k: int = Query(20, ge=1, le=50),
    db: Session = Depends(get_db),
):
    return engine.global_feed(db, k=k)


@router.post("/recommendations/impressions")
def create_impression_batch(
    items: List[RecommendationImpressionCreate],
    db: Session = Depends(get_db),
):
    created = engine.record_impressions(db, [item.model_dump() for item in items])
    return {"created": created}