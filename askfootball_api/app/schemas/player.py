
from pydantic import BaseModel
from typing import Optional


# --- Request Schemas ---

# The 'description' parameter in Field() serves two purposes:
# 1. It appears in the Swagger UI at /docs as help text for each parameter
# 2. It gets embedded in the OpenAPI spec at /openapi.json — this is how
#    AI agents understand what each parameter does when consuming your API as a tool
# It has zero effect on runtime behavior or validation


# --- Response Schemas ---

class PlayerBrief(BaseModel):
    """Compact player info for list views."""
    player_id: int
    display_name: str
    overall: int
    potential: int
    age: int
    club_position: Optional[str] = None
    preferred_foot: Optional[str] = None
    club_name: Optional[str] = None
    nationality: Optional[str] = None

    class Config:
        from_attributes = True


class CoreAttributesSchema(BaseModel):
    """Six high-level aggregate stats."""
    pace: int
    shooting: int
    passing: int
    dribbling: int
    defending: int
    physic: int

    class Config:
        from_attributes = True


class PlaystyleSchema(BaseModel):
    playstyle: str
    is_plus: bool  # Pydantic auto-converts 0/1 to bool

    class Config:
        from_attributes = True


class RoleSchema(BaseModel):
    role_name: str
    score: float
    confidence: Optional[str] = None
    explanation: Optional[str] = None

    class Config:
        from_attributes = True


class PlayerDetail(BaseModel):
    """Full player profile with all layers."""
    player_id: int
    display_name: str
    full_name: Optional[str] = None
    age: int
    height_cm: int
    weight_kg: int
    preferred_foot: Optional[str] = None
    weak_foot: Optional[int] = None
    skill_moves: Optional[int] = None
    overall: int
    potential: int
    value_eur: Optional[int] = None
    wage_eur: Optional[int] = None
    club_position: Optional[str] = None
    jersey_number: Optional[int] = None
    contract_valid_until_year: Optional[int] = None
    primary_phase: Optional[str] = None
    positions: Optional[str] = None
    club_name: Optional[str] = None
    league_name: Optional[str] = None
    nationality: Optional[str] = None
    core_attributes: Optional[CoreAttributesSchema] = None
    playstyles: list[PlaystyleSchema] = []
    roles: list[RoleSchema] = []

    class Config:
        from_attributes = True

class PlayerCompareResponse(BaseModel):
    """Side-by-side comparison of 2-3 players."""
    players: list[PlayerDetail]
    count: int

    class Config:
        from_attributes = True