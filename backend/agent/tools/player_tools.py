import httpx
from langchain_core.tools import tool
from pydantic import BaseModel, Field
from typing import Optional
from backend.agent.config import API_BASE_URL, API_HEADERS
from backend.agent.api_helper import _api_get
# --- Input Schemas ---
class SearchPlayersInput(BaseModel):
    """Parameters for searching players."""
    club_name: Optional[str] = Field(None, description="Club name or partial match (e.g., 'Real Madrid', 'Barcelona')")
    position: Optional[str] = Field(None, description="Position code: ST, CAM, CB, LW, RW, CDM, CM, LB, RB, GK")
    club_position: Optional[str] = Field(None, description="Current playing position in squad (may differ from natural positions)")
    min_age: Optional[int] = Field(None, description="Minimum age")
    max_age: Optional[int] = Field(None, description="Maximum age")
    min_overall: Optional[int] = Field(None, description="Minimum overall rating (1-99)")
    max_overall: Optional[int] = Field(None, description="Maximum overall rating (1-99)")
    nationality: Optional[str] = Field(None, description="Nation name (e.g., 'Brazil', 'England')")
    league_name: Optional[str] = Field(None, description="League name (e.g., 'La Liga', 'Premier League', 'Bundesliga')")
    role_name: Optional[str] = Field(None, description="Tactical role: ANCHOR, BOX_TO_BOX, INVERTED_WINGER, TARGET_FORWARD, PLAYMAKER, etc.")
    min_role_score: Optional[float] = Field(None, description="Minimum role score 0.0-1.0 (use with role_name). 0.80+ is strong.")
    playstyle: Optional[str] = Field(None, description="Playstyle tag: Relentless, Tiki Taka, Rapid, Technical, Press Proven, etc.")
    playstyle_plus: Optional[bool] = Field(None, description="If true, only return plus variants of the playstyle")
    min_value: Optional[int] = Field(None, description="Minimum market value in EUR")
    max_value: Optional[int] = Field(None, description="Maximum market value in EUR")
    min_potential: Optional[int] = Field(None, description="Minimum potential rating (1-99)")
    max_potential: Optional[int] = Field(None, description="Maximum potential rating (1-99)")
    preferred_foot: Optional[str] = Field(None, description="'Left' or 'Right'")
    display_name: Optional[str] = Field(None, description="Player name or partial match (e.g., 'Garcia', 'Mbappé', 'De Jong')")
    player_ids: Optional[str] = Field(None, description="Comma-separated player IDs for batch lookup (e.g., '271421,270673,264652'). Use this to get multiple specific players in one call instead of calling get_player_profile multiple times.")
    limit: Optional[int] = Field(20, description="Max results to return (1-100)")
    offset: Optional[int] = Field(0, description="Pagination offset")

class PlayerIdInput(BaseModel):
    """Input requiring a single player ID."""
    player_id: int = Field(..., description="The player's unique ID")


class ComparePlayersInput(BaseModel):
    """Input for comparing players."""
    player_ids: str = Field(
        ...,
        description="Comma-separated player IDs (2-3 players), e.g., '251854,252371,256630'"
    )

# --- Tool Functions ---
# --- Search Players ---
@tool("search_players", args_schema=SearchPlayersInput)
def search_players(
    club_name=None, position=None, club_position=None,
    min_age=None, max_age=None, min_overall=None, max_overall=None,
    nationality=None, league_name=None,
    role_name=None, min_role_score=None,
    playstyle=None, playstyle_plus=None,
    min_value=None, max_value=None,
    min_potential=None, max_potential=None,
    preferred_foot=None, display_name=None, player_ids=None, limit=20, offset=0,
) -> dict:
    """Search and filter the player database. Returns a paginated list of matching players.

        Use this tool when the user wants to:
        - Find players matching specific criteria (position, league, age, etc.)
        - Search for transfer targets with tactical role or playstyle requirements
        - List players filtered by value, potential, or rating ranges

        Do NOT use this for getting a single known player's full profile (use get_player_profile).
        Do NOT use this for comparing specific players (use compare_players).
        Do NOT use this for squad analysis (use get_squad_detailed)."""
    params = {
        "club_name": club_name, "position": position,
        "club_position": club_position,
        "min_age": min_age, "max_age": max_age,
        "min_overall": min_overall, "max_overall": max_overall,
        "nationality": nationality, "league_name": league_name,
        "role_name": role_name, "min_role_score": min_role_score,
        "playstyle": playstyle, "playstyle_plus": playstyle_plus,
        "min_value": min_value, "max_value": max_value,
        "min_potential": min_potential, "max_potential": max_potential,
        "preferred_foot": preferred_foot,
        "display_name": display_name, 
        "player_ids": player_ids,
        "limit": limit, "offset": offset,
    }
    return _api_get("/players", params)


@tool("get_player_profile", args_schema=PlayerIdInput)
def get_player_profile(player_id: int) -> dict:
    """Get a single player's complete profile including bio, core attributes, playstyles, and tactical role scores.

    Use this when the user asks about a specific known player.
    Use this when you need full details before making a recommendation.
    Returns everything: personal info, stats, playstyles, role scores."""
    return _api_get(f"/players/{player_id}")

@tool("get_player_attributes", args_schema=PlayerIdInput)
def get_player_attributes(player_id: int) -> dict:
    """Get the full 60+ attribute breakdown for a player, grouped by category (attacking, skill, movement, power, mentality, defensive, goalkeeping).

    Use this when you need detailed attribute analysis beyond the 6 core stats.
    For quick checks, the core_attributes in get_player_profile are usually sufficient."""
    return _api_get(f"/players/{player_id}/attributes")

@tool("get_player_playstyles", args_schema=PlayerIdInput)
def get_player_playstyles(player_id: int) -> dict:
    """Get a player's playstyle tags (e.g., Relentless, Tiki Taka) with plus variant indicator.

    Use this when you specifically need to check playstyle compatibility.
    Note: get_player_profile already includes playstyles in its response."""
    return _api_get(f"/players/{player_id}/playstyles")

@tool("get_player_roles", args_schema=PlayerIdInput)
def get_player_roles(player_id: int) -> dict:
    """Get a player's tactical role scores sorted highest first, with confidence level and explanation.

    Use this when analyzing which tactical roles a player is best suited for.
    Note: get_player_profile already includes roles in its response."""
    return _api_get(f"/players/{player_id}/roles")

@tool("compare_players", args_schema=ComparePlayersInput)
def compare_players(player_ids: str) -> dict:
    """Compare 2-3 players side by side with full profiles.

    Use this when the user asks to compare specific players.
    Input is comma-separated player IDs: '251854,252371' or '251854,252371,256630'.
    You must know the player IDs first — use search_players to find them if needed."""
    return _api_get("/players/compare", {"player_ids": player_ids})


