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


@router.post("", response_model=ChatResponse)
def chat(request: ChatRequest):
    """Send a message to the AI agent and get a response."""
    # result = agent.invoke({
    #     "messages": [HumanMessage(content=request.message)]
    # })
    # last_message = result["messages"][-1]
    # content = last_message.content
    content = "X. Simons, with an 84 overall rating and 87 potential at 22 years old, appears to be a very good fit for Tottenham Hotspur's tactical setup.\n\nTottenham Hotspur operates with a 4-4-2 formation, emphasizing a \"long ball\" build-up, a \"counter-press\" defensive style, high tempo (72), wide play (70), and very high pressing intensity (86).\n\nSimons' primary positions are CAM, LM, and ST, which are all relevant to the midfield and attacking roles within a 4-4-2 system. His core attributes highlight his strengths: 87 Dribbling, 80 Passing, 77 Pace, and 77 Shooting. While his Defending (61) and Physic (70) are not his strongest, they are adequate for a player in his role within a high-pressing system.\n\nHis top tactical roles are:\n*   **ADVANCED_PLAYMAKER** (Strong confidence)\n*   **ATTACKING_MIDFIELDER** (Strong confidence)\n*   **BOX_TO_BOX** (Strong confidence)\n\nThese roles are highly compatible with Tottenham's tactics. As an Advanced Playmaker and Attacking Midfielder, Simons can provide the crucial link-up play and creativity in the final third, which is essential even in a long-ball system that aims to quickly transition into attack. His strong Box-to-Box rating indicates he has the work rate and defensive contribution to participate effectively in Tottenham's aggressive \"counter-press\" and high pressing intensity.\n\nFurthermore, his key playstyles such as #Dribbler, Technical, Tiki Taka, Incisive Pass, and Inventive demonstrate his ability to control the ball, create chances, and execute precise passes, all of which would be valuable in Tottenham's dynamic attacking play. The #Acrobat playstyle suggests he is agile and can operate effectively in tight spaces.\n\nIn summary, X. Simons' profile as a creative and dynamic midfielder with a strong work rate aligns well with Tottenham Hotspur's high-tempo, counter-pressing 4-4-2 system, making him a valuable asset to the squad."
    time.sleep(3)

    # Handle Gemini's list-of-blocks response format
    # if isinstance(content, list):
    #     content = "\n".join(
    #         block["text"] for block in content
    #         if isinstance(block, dict) and "text" in block
    #     )

    return ChatResponse(response=content)
