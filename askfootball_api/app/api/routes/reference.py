from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database.session import get_db
from app.auth.api_key import verify_api_key
from app.models.club import League, Nation
from app.schemas.common import APIResponse
from pydantic import BaseModel


class LeagueSchema(BaseModel):
    league_id: int
    league_name: str
    league_level: Optional[int] = None

    class Config:
        from_attributes = True


class NationSchema(BaseModel):
    nation_id: int
    nation_name: str

    class Config:
        from_attributes = True


router = APIRouter(
    prefix="",
    tags=["Reference Data"],
    dependencies=[Depends(verify_api_key)]
)


@router.get("/leagues",
            response_model=APIResponse[list[LeagueSchema]])
def list_leagues(
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    """List all leagues."""
    total = db.query(League).count()
    leagues = (
        db.query(League)
        .order_by(League.league_level.asc(), League.league_name.asc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return APIResponse(data=leagues, count=total)


@router.get("/nations",
            response_model=APIResponse[list[NationSchema]])
def list_nations(
    limit: int = Query(200, ge=1, le=500),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    """List all nations."""
    total = db.query(Nation).count()
    nations = (
        db.query(Nation)
        .order_by(Nation.nation_name.asc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return APIResponse(data=nations, count=total)