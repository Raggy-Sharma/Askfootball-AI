# test_tools.py (run from project root)
from backend.agent.tools.player_tools import search_players, get_player_profile
from backend.agent.tools import ALL_TOOLS

# Test search
result = search_players.invoke({
    "position": "ST",
    "league_name": "La Liga",
    "min_overall": 80
})
print(result["count"], "players found")
for p in result["data"][:3]:
    print(f"  {p['display_name']} - OVR {p['overall']}")

# Test single player
result = get_player_profile.invoke({"player_id": 252371})
player = result["data"]
print(f"{player['display_name']}: {player['overall']} OVR")

from backend.agent.tools import ALL_TOOLS

for t in ALL_TOOLS:
    print(f"Tool: {t.name}")
    print(f"  Description: {t.description[:80]}...")
    print(f"  Schema: {t.args_schema.schema()}")
    print()