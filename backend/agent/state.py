from langgraph.graph import MessagesState


class AgentState(MessagesState):
    """State that flows through the AskFootball agent graph.

    Inherits 'messages' from MessagesState, which is a list
    of BaseMessage objects (human, AI, tool messages).
    LangGraph automatically appends new messages rather
    than replacing the list — this is called a 'reducer'.
    """
    pass
