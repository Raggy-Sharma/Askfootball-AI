from pydantic import BaseModel
from typing import Optional


class ClubBrief(BaseModel):
    club_id: int
    club_name: str
    league_name: Optional[str] = None
    home_stadium: Optional[str] = None

    class Config:
        from_attributes = True

class PlayerSquadEntry(BaseModel):
    """A player within a squad, with role and playstyle summary."""
    player_id: int
    display_name: str
    age: int
    overall: int
    potential: int
    positions: Optional[str] = None
    club_position: Optional[str] = None
    preferred_foot: Optional[str] = None
    value_eur: Optional[int] = None
    wage_eur: Optional[int] = None
    core_attributes: Optional[dict] = None
    gk_attributes: Optional[dict] = None
    top_roles: list[dict] = []
    playstyles: list[dict] = []

    class Config:
        from_attributes = True

class SquadDetailedResponse(BaseModel):
    """Full squad with per-player role and playstyle data."""
    club_id: int
    club_name: str
    player_count: int
    players: list[PlayerSquadEntry]

    class Config:
        from_attributes = True


class TacticsSchema(BaseModel):
    club_name: Optional[str] = None
    club_tier: Optional[str] = None
    build_up_style: Optional[str] = None
    defensive_style: Optional[str] = None
    tempo: Optional[int] = None
    width: Optional[int] = None
    pressing_intensity: Optional[int] = None
    defensive_line: Optional[int] = None
    preferred_formation: Optional[str] = None
    coach_name: Optional[str] = None
    rivals: Optional[str] = None

    class Config:
        from_attributes = True


class SquadRoleSchema(BaseModel):
    role_name: str
    player_count: int
    avg_score: float
    elite_count: Optional[int] = None
    best_player_id: Optional[int] = None
    role_status: Optional[str] = None

    class Config:
        from_attributes = True