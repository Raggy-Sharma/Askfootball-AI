from fastapi import APIRouter, Depends
from pydantic import BaseModel
from langchain_core.messages import HumanMessage
import time
from app.auth.api_key import verify_api_key
from backend.agent.graph import agent

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
    dependencies=[Depends(verify_api_key)],
)


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    response: str
    referenced_players: list[dict] = []
    follow_ups: list[str] = []



@router.post("", response_model=ChatResponse)
def chat(request: ChatRequest):
    """Send a message to the AI agent and get a response."""
    # result = agent.invoke({
    #     "messages": [HumanMessage(content=request.message)]
    # })
    # last_message = result["messages"][-1]
    # content = last_message.content
    content = "X. Simons, with an 84 overall rating and 87 potential at 22 years old, appears to be a very good fit for Tottenham Hotspur's tactical setup.\n\nTottenham Hotspur operates with a 4-4-2 formation, emphasizing a \"long ball\" build-up, a \"counter-press\" defensive style, high tempo (72), wide play (70), and very high pressing intensity (86).\n\nSimons' primary positions are CAM, LM, and ST, which are all relevant to the midfield and attacking roles within a 4-4-2 system. His core attributes highlight his strengths: 87 Dribbling, 80 Passing, 77 Pace, and 77 Shooting. While his Defending (61) and Physic (70) are not his strongest, they are adequate for a player in his role within a high-pressing system.\n\nHis top tactical roles are:\n*   **ADVANCED_PLAYMAKER** (Strong confidence)\n*   **ATTACKING_MIDFIELDER** (Strong confidence)\n*   **BOX_TO_BOX** (Strong confidence)\n\nThese roles are highly compatible with Tottenham's tactics. As an Advanced Playmaker and Attacking Midfielder, Simons can provide the crucial link-up play and creativity in the final third, which is essential even in a long-ball system that aims to quickly transition into attack. His strong Box-to-Box rating indicates he has the work rate and defensive contribution to participate effectively in Tottenham's aggressive \"counter-press\" and high pressing intensity.\n\nFurthermore, his key playstyles such as #Dribbler, Technical, Tiki Taka, Incisive Pass, and Inventive demonstrate his ability to control the ball, create chances, and execute precise passes, all of which would be valuable in Tottenham's dynamic attacking play. The #Acrobat playstyle suggests he is agile and can operate effectively in tight spaces.\n\nIn summary, X. Simons' profile as a creative and dynamic midfielder with a strong work rate aligns well with Tottenham Hotspur's high-tempo, counter-pressing 4-4-2 system, making him a valuable asset to the squad."
    referenced_players = [
        {
            "player_id": 203376,
            "display_name": "V. van Dijk",
            "full_name": "Virgil van Dijk",
            "age": 33,
            "height_cm": 193,
            "weight_kg": 92,
            "preferred_foot": "Right",
            "weak_foot": 3,
            "skill_moves": 2,
            "overall": 90,
            "potential": 90,
            "value_eur": 57000000,
            "wage_eur": 230000,
            "club_position": "LCB",
            "jersey_number": 4,
            "contract_valid_until_year": 2027,
            "primary_phase": "DEFENSE",
            "positions": "CB",
            "club_name": "Liverpool",
            "league_name": "Premier League",
            "nationality": "Netherlands",
            "core_attributes": {
            "pace": 73,
            "shooting": 60,
            "passing": 72,
            "dribbling": 72,
            "defending": 90,
            "physic": 87
            },
            "gk_attributes": {
            "diving": 13,
            "handling": 10,
            "kicking": 13,
            "positioning": 11,
            "reflexes": 11
            },
            "playstyles": [
            {
                "playstyle": "#Complete defender",
                "is_plus": "false"
            },
            {
                "playstyle": "#Strength",
                "is_plus": "false"
            },
            {
                "playstyle": "#Tackling",
                "is_plus": "false"
            },
            {
                "playstyle": "#Tactician",
                "is_plus": "false"
            },
            {
                "playstyle": "Aerial Fortress",
                "is_plus": "false"
            },
            {
                "playstyle": "Anticipate",
                "is_plus": "false"
            },
            {
                "playstyle": "Bruiser",
                "is_plus": "false"
            },
            {
                "playstyle": "Intercept",
                "is_plus": "true"
            },
            {
                "playstyle": "Jockey",
                "is_plus": "false"
            },
            {
                "playstyle": "Pinged Pass",
                "is_plus": "false"
            },
            {
                "playstyle": "Precision Header",
                "is_plus": "false"
            }
            ],
            "roles": [
            {
                "role_name": "BALL_PLAYING_DEFENDER",
                "score": 0.784,
                "confidence": "Strong",
                "explanation": "Strong Defending + spatial fit"
            },
            {
                "role_name": "FALSEBACK",
                "score": 0.753,
                "confidence": "Strong",
                "explanation": "Strong Build Up + spatial fit"
            },
            {
                "role_name": "FULLBACK",
                "score": 0.737,
                "confidence": "Strong",
                "explanation": "Strong Defending + spatial fit"
            },
            {
                "role_name": "INVERTED_WINGBACK",
                "score": 0.736,
                "confidence": "Strong",
                "explanation": "Strong Build Up + spatial fit"
            },
            {
                "role_name": "STOPPER",
                "score": 0.827,
                "confidence": "Strong",
                "explanation": "Strong Defending + spatial fit"
            },
            {
                "role_name": "WIDE_CENTER_BACK",
                "score": 0.768,
                "confidence": "Strong",
                "explanation": "Strong Defending + spatial fit"
            },
            {
                "role_name": "WINGBACK",
                "score": 0.69,
                "confidence": "Decent",
                "explanation": "Strong Speed + spatial fit"
            }
            ]
        },
        {
            "player_id": 239818,
            "display_name": "Rúben Dias",
            "full_name": "Rúben dos Santos Gato Alves Dias",
            "age": 28,
            "height_cm": 187,
            "weight_kg": 82,
            "preferred_foot": "Right",
            "weak_foot": 4,
            "skill_moves": 2,
            "overall": 86,
            "potential": 87,
            "value_eur": 64500000,
            "wage_eur": 190000,
            "club_position": "RCB",
            "jersey_number": 3,
            "contract_valid_until_year": 2029,
            "primary_phase": "DEFENSE",
            "positions": "CB",
            "club_name": "Manchester City",
            "league_name": "Premier League",
            "nationality": "Portugal",
            "core_attributes": {
            "pace": 59,
            "shooting": 39,
            "passing": 69,
            "dribbling": 69,
            "defending": 86,
            "physic": 84
            },
            "gk_attributes": {
            "diving": 7,
            "handling": 8,
            "kicking": 13,
            "positioning": 7,
            "reflexes": 12
            },
            "playstyles": [
            {
                "playstyle": "#Tackling",
                "is_plus": "false"
            },
            {
                "playstyle": "#Tactician",
                "is_plus": "false"
            },
            {
                "playstyle": "Bruiser",
                "is_plus": "true"
            },
            {
                "playstyle": "Long Ball Pass",
                "is_plus": "false"
            }
            ],
            "roles": [
            {
                "role_name": "BALL_PLAYING_DEFENDER",
                "score": 0.75,
                "confidence": "Strong",
                "explanation": "Strong Defending + spatial fit"
            },
            {
                "role_name": "FALSEBACK",
                "score": 0.721,
                "confidence": "Strong",
                "explanation": "Strong Build Up + spatial fit"
            },
            {
                "role_name": "FULLBACK",
                "score": 0.69,
                "confidence": "Decent",
                "explanation": "Strong Defending + spatial fit"
            },
            {
                "role_name": "INVERTED_WINGBACK",
                "score": 0.7,
                "confidence": "Decent",
                "explanation": "Strong Build Up + spatial fit"
            },
            {
                "role_name": "STOPPER",
                "score": 0.792,
                "confidence": "Strong",
                "explanation": "Strong Defending + spatial fit"
            },
            {
                "role_name": "WIDE_CENTER_BACK",
                "score": 0.721,
                "confidence": "Strong",
                "explanation": "Strong Defending + spatial fit"
            },
            {
                "role_name": "WINGBACK",
                "score": 0.639,
                "confidence": "Decent",
                "explanation": "Strong Speed + spatial fit"
            }
            ]
        }
    ]
    followups = [
        "Who is the best young CB?",
        "What are Liverpool's tactics?",
        "Compare Rúben Dias with Eder Militao"
    ]
    time.sleep(3)

    # Handle Gemini's list-of-blocks response format
    # if isinstance(content, list):
    #     content = "\n".join(
    #         block["text"] for block in content
    #         if isinstance(block, dict) and "text" in block
    #     )

    return ChatResponse(response=content, referenced_players=referenced_players, follow_ups=followups)
