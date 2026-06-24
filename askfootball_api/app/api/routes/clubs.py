from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import Optional
from app.schemas.clubs import (ClubBrief, TacticsSchema, SquadRoleSchema,
    PlayerSquadEntry, SquadDetailedResponse,
)

from app.database.session import get_db
from app.auth.api_key import verify_api_key
from app.models.club import Club, League
from app.models.team_profile import TeamProfile
from app.models.squad_summary import SquadSummary
from app.schemas.common import APIResponse
from app.models.player import Player

router = APIRouter(
    prefix="/clubs",
    tags=["Clubs"],
    dependencies=[Depends(verify_api_key)]
)

@router.get("", response_model=APIResponse[list[ClubBrief]])
def list_clubs(
    league_name: Optional[str] = Query(None),
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    query = db.query(Club).join(Club.league, isouter=True)
    if league_name:
        query = query.filter(
            League.league_name.ilike(f"%{league_name}%")
        )
    total = query.count()
    clubs = query.offset(offset).limit(limit).all()
    return APIResponse(
        data=[
            ClubBrief(
                club_id=c.club_id,
                club_name=c.club_name,
                league_name=(
                    c.league.league_name if c.league else None
                ),
                home_stadium=c.home_stadium,
            ) for c in clubs
        ],
        count=total,
    )


@router.get("/{club_id}/tactics",
            response_model=APIResponse[TacticsSchema])
def get_club_tactics(
    club_id: int,
    db: Session = Depends(get_db),
):
    profile = db.query(TeamProfile).filter(
        TeamProfile.club_id == club_id
    ).first()
    if not profile:
        raise HTTPException(404, "Team profile not found")
    return APIResponse(data=profile)


@router.get("/{club_id}/squad",
            response_model=APIResponse[list[SquadRoleSchema]])
def get_squad_summary(
    club_id: int,
    db: Session = Depends(get_db),
):
    roles = db.query(SquadSummary).filter(
        SquadSummary.club_id == club_id
    ).all()
    return APIResponse(data=roles, count=len(roles))


@router.get("/{club_id}/squad/detailed",
            response_model=APIResponse[SquadDetailedResponse])
def get_squad_detailed(
    club_id: int,
    db: Session = Depends(get_db),
):
    """Full squad with each player's top roles, core attributes, and playstyles."""
    club = db.query(Club).filter(Club.club_id == club_id).first()
    if not club:
        raise HTTPException(404, f"Club {club_id} not found")

    players = (
        db.query(Player)
        .options(
            joinedload(Player.attributes),
            joinedload(Player.roles),
            joinedload(Player.playstyles),
        )
        .filter(Player.club_id == club_id)
        .all()
    )

    squad = []
    for p in players:
        attrs = p.attributes
        core = None
        gk = None
        if attrs:
            gk = {
                "diving": attrs.goalkeeping_diving,
                "handling": attrs.goalkeeping_handling,
                "kicking": attrs.goalkeeping_kicking,
                "positioning": attrs.goalkeeping_positioning,
                "reflexes": attrs.goalkeeping_reflexes
            }
            core = {
                "pace": attrs.pace,
                "shooting": attrs.shooting,
                "passing": attrs.passing,
                "dribbling": attrs.dribbling,
                "defending": attrs.defending,
                "physic": attrs.physic,
            }

        top_roles = sorted(
            p.roles, key=lambda r: r.score, reverse=True
        )[:3]
        
        squad.append(PlayerSquadEntry(
            player_id=p.player_id,
            display_name=p.display_name,
            age=p.age,
            overall=p.overall,
            potential=p.potential,
            positions=p.positions,
            club_position=p.club_position,
            preferred_foot=p.preferred_foot,
            value_eur=p.value_eur,
            wage_eur=p.wage_eur,
            core_attributes=core,
            gk_attributes=gk,
            top_roles=[
                {
                    "role_name": r.role_name,
                    "score": r.score,
                    "confidence": r.confidence,
                }
                for r in top_roles
            ],
            playstyles=[
                {
                    "playstyle": ps.playstyle,
                    "is_plus": bool(ps.is_plus),
                }
                for ps in (p.playstyles or [])
            ],
        ))

    return APIResponse(
        data=SquadDetailedResponse(
            club_id=club_id,
            club_name=club.club_name,
            player_count=len(squad),
            players=squad,
        ),
    )