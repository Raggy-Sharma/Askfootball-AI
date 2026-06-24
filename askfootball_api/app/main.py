import sys
import os

# Add project root to path so 'backend' package is importable
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import players, clubs, attributes, reference
from app.utils.responses import (http_exception_handler, general_exception_handler)
import app.models  # triggers all the imports above
from app.api.routes import chat

app = FastAPI(
    title="AskFootball AI API",
    version="0.1.0",
    description="EA FC 26 Intelligence API for AI Agents"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",   # Vite dev server
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],           # GET, POST, OPTIONS, etc.
    allow_headers=["*"],           # Authorization, Content-Type, etc.
)

app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

app.include_router(players.router)
app.include_router(clubs.router)
app.include_router(attributes.router)
app.include_router(reference.router)
app.include_router(chat.router)

@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "api": "AskFootball AI"}
