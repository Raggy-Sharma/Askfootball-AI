from langchain_core.messages import HumanMessage
from backend.agent.graph import agent

def ask(query: str) -> str:
    result = agent.invoke({
        "messages": [HumanMessage(content=query)]
    })
    last_message = result["messages"][-1]
    content = last_message.content
    
    # Gemini returns content as a list of blocks, not a plain string
    if isinstance(content, list):
        return "\n".join(
            block["text"] for block in content if isinstance(block, dict) and "text" in block
        )
    return content


if __name__ == "__main__":
    print("AskFootball AI Agent")
    print("Type 'quit' to exit.\n")

    while True:
        query = input("You: ")
        if query.lower() in ("quit", "exit", "q"):
            break
        print(f"\nAgent: {ask(query)}\n")
