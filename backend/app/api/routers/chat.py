"""
Chat API Router — POLICEGPT Conversational Interface
Streaming SSE endpoint for real-time AI responses
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from typing import Optional, AsyncGenerator
import json
import asyncio
import uuid

from app.auth.dependencies import get_current_officer
from app.ai.engine import PoliceGPTEngine
from app.models.schemas import OfficerOut
from app.db.redis_client import RedisClient

router = APIRouter()
engine = PoliceGPTEngine()
redis = RedisClient()


class ChatRequest(BaseModel):
    query: str = Field(..., min_length=2, max_length=2000)
    session_id: Optional[str] = None
    language: str = Field(default="en", pattern="^(en|kn|hi)$")


class ChatResponse(BaseModel):
    session_id: str
    response: str
    citations: list
    visualization: Optional[dict] = None
    intent: Optional[str] = None
    tokens_used: Optional[int] = None


@router.post("/stream")
async def chat_stream(
    request: ChatRequest,
    officer: OfficerOut = Depends(get_current_officer),
):
    """
    Streaming SSE endpoint for POLICEGPT AI chat.
    Returns real-time chunks as the LLM reasons through the query.
    """
    session_id = request.session_id or str(uuid.uuid4())

    async def event_generator() -> AsyncGenerator[str, None]:
        try:
            async for event in engine.process_query(
                query=request.query,
                session_id=session_id,
                officer_id=str(officer.id),
                officer_role=officer.role,
                stream=True,
            ):
                yield f"data: {json.dumps(event)}\n\n"
            # Send completion event
            yield f"data: {json.dumps({'type': 'done', 'session_id': session_id})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'content': str(e)})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )


@router.post("/", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    officer: OfficerOut = Depends(get_current_officer),
):
    """Non-streaming chat endpoint"""
    session_id = request.session_id or str(uuid.uuid4())
    full_response = ""
    citations = []
    visualization = None

    async for event in engine.process_query(
        query=request.query,
        session_id=session_id,
        officer_id=str(officer.id),
        officer_role=officer.role,
        stream=False,
    ):
        if event["type"] == "content":
            full_response += event["content"]
        elif event["type"] == "citations":
            citations = event["content"]
        elif event["type"] == "visualization":
            visualization = event["content"]

    return ChatResponse(
        session_id=session_id,
        response=full_response,
        citations=citations,
        visualization=visualization,
    )


@router.get("/history/{session_id}")
async def get_history(
    session_id: str,
    officer: OfficerOut = Depends(get_current_officer),
):
    """Retrieve conversation history for a session"""
    history = await redis.get_conversation_history(session_id, limit=50)
    return {"session_id": session_id, "messages": history}


@router.delete("/history/{session_id}")
async def clear_history(
    session_id: str,
    officer: OfficerOut = Depends(get_current_officer),
):
    """Clear conversation history"""
    await redis.clear_session(session_id)
    return {"message": "Session cleared"}


@router.get("/sessions")
async def list_sessions(
    officer: OfficerOut = Depends(get_current_officer),
):
    """List all active sessions for an officer"""
    sessions = await redis.list_officer_sessions(str(officer.id))
    return {"sessions": sessions}
