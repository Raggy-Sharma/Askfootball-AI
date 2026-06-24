from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import ToolNode
from langchain_core.messages import SystemMessage

from backend.agent.state import AgentState
from backend.agent.prompts import SYSTEM_PROMPT
from backend.agent.tools import ALL_TOOLS
from backend.agent.llm import llm_with_fallbacks

def call_model(state: AgentState) -> dict:
    messages = state["messages"]
    system_msg = SystemMessage(content=SYSTEM_PROMPT)
    response = llm_with_fallbacks.invoke([system_msg] + messages)
    return {"messages": [response]}

tool_node = ToolNode(ALL_TOOLS)

# --- Routing ---
def route_after_model(state: AgentState) -> str:
    """Route to tools if the LLM made tool calls, else end."""
    last_message = state["messages"][-1]
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "tools"
    return END

# --- Build the Graph ---
workflow = StateGraph(AgentState)

# Add nodes
workflow.add_node("call_model", call_model)
workflow.add_node("tools", tool_node)

# Set entry point
workflow.set_entry_point("call_model")

# Add edges
# After call_model: check if tools were called
workflow.add_conditional_edges("call_model", route_after_model)

# After tools: always go back to call_model
workflow.add_edge("tools", "call_model")

# Compile the graph into a runnable
agent = workflow.compile()
