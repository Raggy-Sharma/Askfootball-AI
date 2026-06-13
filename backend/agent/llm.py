import os
from dotenv import load_dotenv
from langchain_ollama import ChatOllama
from langchain_google_genai import ChatGoogleGenerativeAI
from backend.agent.tools import ALL_TOOLS

load_dotenv()

# Bind tools so the LLM knows what tools are available.
# bind_tools() converts your @tool functions into the JSON
# schema format that the LLM reads to decide which tool to call.

# --- Primary: Gemini 2.5 Flash (stable, proven) ---
primary_llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    google_api_key=os.getenv("GEMINI_API_KEY"),
    temperature=0,
)

# --- Fallback: Gemini 2.5 Flash-Lite (cheapest, emergency) ---
fallback_llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash-lite",
    google_api_key=os.getenv("GEMINI_API_KEY"),
    temperature=0,
)

# Bind tools
primary_with_tools = primary_llm.bind_tools(ALL_TOOLS)
fallback_with_tools = fallback_llm.bind_tools(ALL_TOOLS)

# Chain: 2.5 Flash → 2.5 Flash-Lite
llm_with_fallbacks = primary_with_tools.with_fallbacks(
    [fallback_with_tools]
)


