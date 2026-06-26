from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import Optional
from pydantic import BaseModel

from app.database.session import get_db
from app.auth.api_key import verify_api_key
from app.models.player import Player
from app.models.role import PlayerRole
from app.models.playstyle import PlayerPlaystyle
from app.models.club import Club, Nation, League
from app.schemas.player import (
    PlayerBrief, PlayerDetail, CoreAttributesSchema, GKAttributesSchema,
    PlayerCompareResponse, PlaystyleSchema, RoleSchema,
)
from app.schemas.common import APIResponse

router = APIRouter(
    prefix="/players",
    tags=["Players"],
    dependencies=[Depends(verify_api_key)]
)


@router.get("", response_model=APIResponse[list[PlayerBrief]])
def list_players(
    club_name: Optional[str] = Query(None),
    position: Optional[str] = Query(None),
    club_position: Optional[str] = Query(None),
    min_age: Optional[int] = Query(None, ge=1, le=100),
    max_age: Optional[int] = Query(None, ge=1, le=100),
    min_overall: Optional[int] = Query(None, ge=1, le=99),
    max_overall: Optional[int] = Query(None, ge=1, le=99),
    nationality: Optional[str] = Query(None),
    league_name: Optional[str] = Query(None),
    role_name: Optional[str] = Query(None, description="Filter by tactical role (e.g., ANCHOR, INVERTED_WINGER)"),
    min_role_score: Optional[float] = Query(None, ge=0, le=100, description="Minimum role score (requires role_name)"),
    playstyle: Optional[str] = Query(None, description="Filter by playstyle tag (e.g., Relentless, Tiki Taka)"),
    playstyle_plus: Optional[bool] = Query(None, description="If true, only return plus variants of the playstyle"),
    min_value: Optional[int] = Query(None, ge=0, description="Minimum market value in EUR"),
    max_value: Optional[int] = Query(None, ge=0, description="Maximum market value in EUR"),
    min_potential: Optional[int] = Query(None, ge=1, le=99, description="Minimum potential rating"),
    max_potential: Optional[int] = Query(None, ge=1, le=99, description="Maximum potential rating"),
    preferred_foot: Optional[str] = Query(None),
    display_name: Optional[str] = Query(None, description="Player name or partial match (e.g., 'Garcia', 'Mbappé', 'De Jong')"),
    player_ids: Optional[str] = Query(None, description="Comma-separated player IDs for batch lookup (e.g., '271421,270673,264652')"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    """Search and filter players with pagination."""
    query = (
        db.query(Player)
        .join(Player.club, isouter=True)
        .join(Club.league, isouter=True)
        .join(Player.nation, isouter=True)
    )
    needs_distinct = False

    if role_name:
        query = query.join(Player.roles)
        query = query.filter(
            PlayerRole.role_name.ilike(role_name)
        )
        if min_role_score is not None:
            query = query.filter(
                PlayerRole.score >= min_role_score
            )
        needs_distinct = True

    if playstyle:
        query = query.join(Player.playstyles)
        query = query.filter(
            PlayerPlaystyle.playstyle.ilike(f"%{playstyle}%")
        )
        if playstyle_plus is not None:
            query = query.filter(
                PlayerPlaystyle.is_plus == (1 if playstyle_plus else 0)
            )
        needs_distinct = True

    if club_name:
        query = query.filter(
            Club.club_name.ilike(f"%{club_name}%")
        )
    if position:
        query = query.filter(
            Player.positions.contains(position.upper())
        )
    if club_position:
        query = query.filter(
            Player.club_position.ilike(club_position)
        )
    if min_age:
        query = query.filter(Player.age >= min_age)
    if max_age:
        query = query.filter(Player.age <= max_age)
    if min_overall:
        query = query.filter(Player.overall >= min_overall)
    if max_overall:
        query = query.filter(Player.overall <= max_overall)
    if nationality:
        query = query.filter(
            Nation.nation_name.ilike(f"%{nationality}%")
        )
    if league_name:
        query = query.filter(
            League.league_name.ilike(f"%{league_name}%")
        )
    if preferred_foot:
        query = query.filter(
            Player.preferred_foot.ilike(preferred_foot)
        )
    if display_name:
        query = query.filter(
            Player.display_name.ilike(f"%{display_name}%")
        )
    if player_ids:
        id_list = [int(x.strip()) for x in player_ids.split(",") if x.strip().isdigit()]
        if id_list:
            query = query.filter(Player.player_id.in_(id_list))
    if min_value is not None:
        query = query.filter(Player.value_eur >= min_value)
    if max_value is not None:
        query = query.filter(Player.value_eur <= max_value)
    if min_potential:
        query = query.filter(Player.potential >= min_potential)
    if max_potential:
        query = query.filter(Player.potential <= max_potential)

    if needs_distinct:
        query = query.distinct()
        
    total = query.count()
    players = query.offset(offset).limit(limit).all()

    return APIResponse(
        data=[
            PlayerBrief(
                player_id=p.player_id,
                display_name=p.display_name,
                overall=p.overall,
                potential=p.potential,
                age=p.age,
                club_position=p.club_position,
                preferred_foot=p.preferred_foot,
                club_name=p.club.club_name if p.club else None,
                nationality=(
                    p.nation.nation_name if p.nation else None
                ),
            )
            for p in players
        ],
        count=total,
    )

@router.get("/compare",
            response_model=APIResponse[PlayerCompareResponse])
def compare_players(
    player_ids: str = Query(
        ...,
        description="Comma-separated player IDs (2-3), e.g., 251854,252371,256630"
    ),
    db: Session = Depends(get_db),
):
    """Compare 2-3 players side by side with full profiles."""
    id_list = [
        int(pid.strip())
        for pid in player_ids.split(",")
        if pid.strip().isdigit()
    ]

    if len(id_list) < 2 or len(id_list) > 3:
        raise HTTPException(
            400,
            "Provide exactly 2 or 3 comma-separated player IDs"
        )

    players = (
        db.query(Player)
        .options(
            joinedload(Player.club).joinedload(Club.league),
            joinedload(Player.nation),
            joinedload(Player.attributes),
            joinedload(Player.playstyles),
            joinedload(Player.roles),
        )
        .filter(Player.player_id.in_(id_list))
        .all()
    )

    if len(players) != len(id_list):
        found_ids = {p.player_id for p in players}
        missing = [pid for pid in id_list if pid not in found_ids]
        raise HTTPException(
            404,
            f"Players not found: {missing}"
        )

    result = []
    for player in players:
        attrs = player.attributes
        result.append(PlayerDetail(
            player_id=player.player_id,
            display_name=player.display_name,
            full_name=player.full_name,
            age=player.age,
            height_cm=player.height_cm,
            weight_kg=player.weight_kg,
            preferred_foot=player.preferred_foot,
            weak_foot=player.weak_foot,
            skill_moves=player.skill_moves,
            overall=player.overall,
            potential=player.potential,
            value_eur=player.value_eur,
            wage_eur=player.wage_eur,
            club_position=player.club_position,
            jersey_number=player.jersey_number,
            contract_valid_until_year=player.contract_valid_until_year,
            primary_phase=player.primary_phase,
            positions=player.positions,
            club_name=(
                player.club.club_name if player.club else None
            ),
            league_name=(
                player.club.league.league_name
                if player.club and player.club.league
                else None
            ),
            nationality=(
                player.nation.nation_name
                if player.nation else None
            ),
            core_attributes=(
                CoreAttributesSchema(
                    pace=attrs.pace,
                    shooting=attrs.shooting,
                    passing=attrs.passing,
                    dribbling=attrs.dribbling,
                    defending=attrs.defending,
                    physic=attrs.physic,
                ) if attrs else None
            ),
            gk_attributes=(
                GKAttributesSchema(
                    diving=attrs.goalkeeping_diving or 0,
                    handling=attrs.goalkeeping_handling or 0,
                    kicking=attrs.goalkeeping_kicking or 0,
                    positioning=attrs.goalkeeping_positioning or 0,
                    reflexes=attrs.goalkeeping_reflexes or 0,
                ) if attrs else None
            ),
            playstyles=player.playstyles or [],
            roles=player.roles or [],
        ))

    return APIResponse(
        data=PlayerCompareResponse(
            players=result,
            count=len(result),
        ),
    )

@router.get("/{player_id}",
            response_model=APIResponse[PlayerDetail])
def get_player(
    player_id: int,
    db: Session = Depends(get_db),
):
    """Get complete player profile with all layers."""
    player = (
        db.query(Player)
        .options(
            joinedload(Player.club).joinedload(Club.league),
            joinedload(Player.nation),
            joinedload(Player.attributes),
            joinedload(Player.playstyles),
            joinedload(Player.roles),
        )
        .filter(Player.player_id == player_id)
        .first()
    )

    if not player:
        raise HTTPException(404, f"Player {player_id} not found")

    attrs = player.attributes
    return APIResponse(
        data=PlayerDetail(
            player_id=player.player_id,
            display_name=player.display_name,
            full_name=player.full_name,
            age=player.age,
            height_cm=player.height_cm,
            weight_kg=player.weight_kg,
            preferred_foot=player.preferred_foot,
            weak_foot=player.weak_foot,
            skill_moves=player.skill_moves,
            overall=player.overall,
            potential=player.potential,
            value_eur=player.value_eur,
            wage_eur=player.wage_eur,
            club_position=player.club_position,
            jersey_number=player.jersey_number,
            contract_valid_until_year=(
                player.contract_valid_until_year
            ),
            primary_phase=player.primary_phase,
            positions=player.positions,
            club_name=(
                player.club.club_name if player.club else None
            ),
            league_name=(
                player.club.league.league_name
                if player.club and player.club.league
                else None
            ),
            nationality=(
                player.nation.nation_name
                if player.nation else None
            ),
            core_attributes=(
                CoreAttributesSchema(
                    pace=attrs.pace,
                    shooting=attrs.shooting,
                    passing=attrs.passing,
                    dribbling=attrs.dribbling,
                    defending=attrs.defending,
                    physic=attrs.physic,
                ) if attrs else None
            ),
            gk_attributes=(
                GKAttributesSchema(
                    diving=attrs.goalkeeping_diving or 0,
                    handling=attrs.goalkeeping_handling or 0,
                    kicking=attrs.goalkeeping_kicking or 0,
                    positioning=attrs.goalkeeping_positioning or 0,
                    reflexes=attrs.goalkeeping_reflexes or 0,
                ) if attrs else None
            ),
            playstyles=player.playstyles or [],
            roles=player.roles or [],
        )
    )

@router.get("/{player_id}/playstyles",
            response_model=APIResponse[list[PlaystyleSchema]])
def get_player_playstyles(
    player_id: int,
    db: Session = Depends(get_db),
):
    """Get player playstyles with plus variant indicator."""
    player = db.query(Player).filter(
        Player.player_id == player_id
    ).first()
    if not player:
        raise HTTPException(404, f"Player {player_id} not found")

    playstyles = (
        db.query(PlayerPlaystyle)
        .filter(PlayerPlaystyle.player_id == player_id)
        .all()
    )
    return APIResponse(data=playstyles, count=len(playstyles))

@router.get("/{player_id}/roles",
        response_model=APIResponse[list[RoleSchema]])
def get_player_roles(
    player_id: int,
    db: Session = Depends(get_db),
):
    """Get player tactical role scores with confidence and explanation."""
    player = db.query(Player).filter(
        Player.player_id == player_id
    ).first()
    if not player:
        raise HTTPException(404, f"Player {player_id} not found")

    roles = (
        db.query(PlayerRole)
        .filter(PlayerRole.player_id == player_id)
        .order_by(PlayerRole.score.desc())
        .all()
    )
    return APIResponse(data=roles, count=len(roles))
