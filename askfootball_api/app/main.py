from fastapi import FastAPI, HTTPException
from app.api.routes import players, clubs, attributes, reference
from app.utils.responses import (http_exception_handler,
                                  general_exception_handler)
import app.models  # triggers all the imports above

app = FastAPI(
    title="AskFootball AI API",
    version="0.1.0",
    description="EA FC 26 Intelligence API for AI Agents"
)

app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

app.include_router(players.router)
app.include_router(clubs.router)
app.include_router(attributes.router)
app.include_router(reference.router)


@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "api": "AskFootball AI"}
