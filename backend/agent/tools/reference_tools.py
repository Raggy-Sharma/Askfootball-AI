from langchain_core.tools import tool
from pydantic import BaseModel, Field
from typing import Optional
from backend.agent.config import API_BASE_URL, API_HEADERS
from backend.agent.api_helper import _api_get

class ListInput(BaseModel):
    """Pagination parameters."""
    limit: Optional[int] = Field(100, description="Max results")
    offset: Optional[int] = Field(0, description="Pagination offset")

@tool("list_leagues", args_schema=ListInput)
def list_leagues(limit=100, offset=0) -> dict:
    """List all available football leagues.

    Use this to find valid league names or league IDs."""
    return _api_get("/leagues", {"limit": limit, "offset": offset})

@tool("list_nations", args_schema=ListInput)
def list_nations(limit=200, offset=0) -> dict:
    """List all available nations.

    Use this to find valid nation names or resolve nationality queries."""
    return _api_get("/nations", {"limit": limit, "offset": offset})


