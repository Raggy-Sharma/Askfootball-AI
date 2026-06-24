# AskFootball AI — Backend

An agentic AI system for EA FC 26 Career Mode. The LLM selects FastAPI endpoints as tools, executes them, and synthesizes structured football data into natural-language analysis — squad gap analysis, transfer recommendations, tactical comparisons, and more.

This repository contains the **backend only**: the FastAPI data layer and the LangGraph agent layer.

---

## Architecture Overview

```
User Query
    │
    ▼
LangGraph Agent  ──►  Gemini LLM (selects tools)
    │
    ▼
Tool Functions (httpx)  ──►  FastAPI Endpoints  ──►  SQLite (FC26.db)
    │
    ▼
Natural-language football analysis
```

- **API layer** serves information-dense data. It does not contain business logic.
- **Agent layer** does all reasoning. It selects tools, executes them, and synthesizes answers.
- **LLM** is Gemini 2.5 Flash (primary) with Gemini 2.5 Flash-Lite as automatic fallback.

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Language | Python 3.12 |
| API Framework | FastAPI |
| ORM | SQLAlchemy |
| Validation | Pydantic v2 |
| Database | SQLite (FC26.db) |
| Server | Uvicorn |
| Agent Orchestration | LangGraph |
| LLM Integration | LangChain (langchain-google-genai) |
| HTTP Client | httpx |
| Auth | API Key (Bearer token) |

---

## Prerequisites

Before setup, ensure you have:

- **Python 3.12** installed (`python3.12 --version` to verify)
- **Git** installed
- A **Gemini API key** from [Google AI Studio](https://aistudio.google.com/apikey)
- The **FC26.db** database file (not included in the repo — see Database section)

---

## Project Structure

```
ASKFOOTBALL-AI/
├── askfootball_api/          # FastAPI application
│   └── app/
│       ├── api/routes/       # Endpoint route handlers
│       ├── models/           # SQLAlchemy models
│       ├── schemas/          # Pydantic schemas
│       ├── database/         # DB session management
│       ├── auth/             # API key verification
│       ├── utils/            # Shared utilities
│       ├── main.py           # FastAPI app entry point
│       └── config.py         # API configuration
├── backend/
│   └── agent/                # LangGraph agent layer
│       ├── config.py         # API base URL, headers
│       ├── api_helper.py     # Authenticated HTTP helper
│       ├── state.py          # Agent state definition
│       ├── prompts.py        # System prompt
│       ├── llm.py            # LLM setup + fallback chain
│       ├── graph.py          # LangGraph definition
│       ├── validation.py     # Result validation node
│       └── tools/            # Tool definitions (12 tools)
├── data/                     # Raw data files
├── db/
│   └── FC26.db               # SQLite database
├── scripts/                  # Data build & enrichment scripts
├── run_agent.py              # Agent REPL entry point
├── requirements.txt          # Python dependencies
├── .env                      # Environment variables (not committed)
└── .gitignore
```

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ASKFOOTBALL-AI
```

### 2. Create a Virtual Environment

Use Python 3.12 explicitly to avoid version mismatches:

```bash
python3.12 -m venv .venv
source .venv/bin/activate        # macOS / Linux
# .venv\Scripts\activate         # Windows
```

Verify the version:

```bash
python --version                 # Should print Python 3.12.x
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

If `requirements.txt` is missing or incomplete, install the core packages directly:

```bash
pip install fastapi uvicorn sqlalchemy pydantic httpx
pip install langgraph langchain-core langchain-google-genai
pip install python-dotenv
```

### 4. Set Up the Database

Place the `FC26.db` file in the `db/` directory:

```bash
mkdir -p db
# Copy FC26.db into db/
```

If you are building the database from raw data, run the build scripts in order:

```bash
python scripts/build_primary_phase.py
python scripts/build_player_roles.py
python scripts/build_squad_summary.py
```

### 5. Configure Environment Variables

Create a `.env` file at the project root:

```bash
# .env
ASKFOOTBALL_API_KEY=your-chosen-api-key
GEMINI_API_KEY=your-gemini-api-key
```

- `ASKFOOTBALL_API_KEY` — any string you choose. It secures your API and must match between the FastAPI server and the agent.
- `GEMINI_API_KEY` — from Google AI Studio.

> **Note:** If using Langfuse observability, also add `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY`, and `LANGFUSE_HOST`.

---

## Running the Application

The system has two parts that run separately: the **API server** and the **agent**.

### Step 1: Start the FastAPI Server

In one terminal:

```bash
source .venv/bin/activate
cd askfootball_api
uvicorn app.main:app --reload --port 8000
```

The server runs at `http://localhost:8000`.

Verify it works by opening the interactive API docs:

```
http://localhost:8000/docs
```

### Step 2: Start the Agent

In a **separate** terminal:

```bash
source .venv/bin/activate
python run_agent.py
```

You will see an interactive prompt:

```
AskFootball AI Agent
Type 'quit' to exit.

You:
```

Type a question and press Enter.

---

## Example Queries

```
Who is the highest rated player in Real Madrid?
Find me young Brazilian strikers with high potential
What are FC Barcelona's tactical weaknesses?
Compare Pedri and Bellingham
Help me offload some players from Chelsea
Rodri is injured. Who can cover CDM at Manchester City?
```

---

## API Endpoints

The API exposes 13 endpoints, all (except health check) requiring the API key:

| Endpoint | Description |
|----------|-------------|
| `GET /` | Health check (no auth) |
| `GET /players` | Search/filter players (20+ filters) |
| `GET /players/compare` | Compare 2-3 players |
| `GET /players/{id}` | Full player profile |
| `GET /players/{id}/attributes` | 60+ attribute breakdown |
| `GET /players/{id}/playstyles` | Player playstyles |
| `GET /players/{id}/roles` | Tactical role scores |
| `GET /clubs` | List clubs |
| `GET /clubs/{id}/tactics` | Team tactical profile |
| `GET /clubs/{id}/squad` | Squad role composition |
| `GET /clubs/{id}/squad/detailed` | Full squad analysis |
| `GET /leagues` | List leagues |
| `GET /nations` | List nations |

Authenticate by sending the API key as a Bearer token:

```
Authorization: Bearer your-chosen-api-key
```

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| `403 Forbidden` from tools | API key mismatch between agent and server | Ensure `ASKFOOTBALL_API_KEY` is identical in `.env` and used by both |
| `ConnectionError` to Gemini | Missing or invalid Gemini API key | Verify `GEMINI_API_KEY` in `.env` |
| `429 RESOURCE_EXHAUSTED` | Gemini free tier rate limit hit | Enable billing on Google Cloud, or wait for quota reset |
| Agent can't connect to API | FastAPI server not running | Start the server first (Step 1) |
| `ModuleNotFoundError` | Dependencies not installed | Activate `.venv` and run `pip install -r requirements.txt` |
| Wrong Python version | venv created with wrong Python | Recreate with `python3.12 -m venv .venv` |

---

## Notes

- The API server and agent **must run simultaneously** in separate terminals.
- The agent communicates with the API over HTTP (localhost:8000), so both must be active.
- The FC26.db database file is required and is not included in the repository.
- This is the backend only. The frontend is a separate concern.

---

## License

Private project. Not for distribution.