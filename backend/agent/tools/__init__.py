from backend.agent.tools.player_tools import (
    search_players,
    get_player_profile,
    get_player_attributes,
    get_player_playstyles,
    get_player_roles,
    compare_players,
)
from backend.agent.tools.club_tools import (
    list_clubs,
    get_club_tactics,
    get_squad_summary,
    get_squad_detailed,
)
from backend.agent.tools.reference_tools import (
    list_leagues,
    list_nations,
)

ALL_TOOLS = [
    search_players,
    get_player_profile,
    get_player_attributes,
    get_player_playstyles,
    get_player_roles,
    compare_players,
    list_clubs,
    get_club_tactics,
    get_squad_summary,
    get_squad_detailed,
    list_leagues,
    list_nations,
]