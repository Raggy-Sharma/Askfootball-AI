import httpx
from backend.agent.config import API_BASE_URL, API_HEADERS

def _api_get(path: str, params: dict = None) -> dict:
    """Make authenticated GET request to the AskFootball API."""
    response = httpx.get(
        f"{API_BASE_URL}{path}",
        # Filter out None-valued params before sending the request.
        params={k: v for k, v in (params or {}).items() if v is not None},
        headers=API_HEADERS,
        timeout=30.0,
    )
    response.raise_for_status()
    return response.json()