from fastapi import APIRouter, Depends
from pydantic import BaseModel
from langchain_core.messages import HumanMessage

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
    result = agent.invoke({
        "messages": [HumanMessage(content=request.message)]
    })
    last_message = result["messages"][-1]
    content = last_message.content

    # Handle Gemini's list-of-blocks response format
    if isinstance(content, list):
        content = "\n".join(
            block["text"] for block in content
            if isinstance(block, dict) and "text" in block
        )

    return ChatResponse(response=content)
