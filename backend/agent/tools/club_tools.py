import httpx
from langchain_core.tools import tool
from pydantic import BaseModel, Field
from typing import Optional
from backend.agent.config import API_BASE_URL, API_HEADERS
from backend.agent.api_helper import _api_get


class ListClubsInput(BaseModel):
    league_name: Optional[str] = Field(None, description="League name to filter by (e.g., 'La Liga', 'Premier League', 'Bundesliga')")
    limit: int = Field(50, ge=1, le=200, description="Max results to return (1-200)")
    offset: int = Field(0, ge=0, description="Pagination offset")

class ClubIdInput(BaseModel):
    club_id: int = Field(..., description="The club's unique ID")

@tool("list_clubs", args_schema=ListClubsInput)
def list_clubs(league_name=None, limit=50, offset=0) -> dict:
    """List clubs, optionally filtered by league.

    Use this to find a club's ID when you know the club name.
    Use this to list all clubs in a specific league."""
    return _api_get("/clubs", {
        "league_name": league_name, "limit": limit, "offset": offset
    })

@tool("get_club_tactics", args_schema=ClubIdInput)
def get_club_tactics(club_id: int) -> dict:
    """Get a club's tactical profile: formation, build-up style, defensive style, tempo, width, pressing intensity, coach, and rivals.

    Use this when the user asks about a team's playing style, formation, or tactical identity.
    Use this BEFORE searching for players that fit a team's style — you need to know the style first."""
    return _api_get(f"/clubs/{club_id}/tactics")

@tool("get_squad_summary", args_schema=ClubIdInput)
def get_squad_summary(club_id: int) -> dict:
    """Get a quick overview of a club's squad composition by tactical role: player count, average score, elite count, and status per role.

    Use this for a high-level squad overview.
    For detailed per-player analysis, use get_squad_detailed instead."""
    return _api_get(f"/clubs/{club_id}/squad")

@tool("get_squad_detailed", args_schema=ClubIdInput)
def get_squad_detailed(club_id: int) -> dict:
    """Get every player in a club's squad with their top 3 roles, core attributes, and playstyles.

    Use this when the user asks about squad weaknesses, depth, gaps, or formation feasibility.
    This is the primary tool for squad analysis — it returns the full picture in one call.
    Use this INSTEAD of calling get_player_profile for each player individually."""
    return _api_get(f"/clubs/{club_id}/squad/detailed")
