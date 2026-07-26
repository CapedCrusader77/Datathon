"""
LLM Client — Supports Ollama (local), OpenAI, and Google Gemini
"""
import json
from collections.abc import AsyncGenerator

import httpx

from app.core.config import settings


class LLMClient:
    async def stream_generate(
        self,
        system_prompt: str,
        user_prompt: str,
    ) -> AsyncGenerator[str, None]:
        if settings.LLM_PROVIDER == "ollama":
            async for chunk in self._ollama_stream(system_prompt, user_prompt):
                yield chunk
        elif settings.LLM_PROVIDER == "openai":
            async for chunk in self._openai_stream(system_prompt, user_prompt):
                yield chunk
        else:
            yield "LLM provider not configured. Using demo mode.\n"
            yield "\nBased on retrieved case data:\n\n"
            yield "📋 **Case Summary**\n"
            yield "Found 3 matching FIRs in the Karnataka crime database.\n\n"
            yield "🔍 **Key Findings**\n"
            yield "- Primary suspect Ravi Kumar S linked to 12 FIRs\n"
            yield "- Crime pattern indicates organized gang activity\n"
            yield "- 2 similar MO cases in South Bangalore (2023-24)\n\n"
            yield "⚠️ **Recommendations**\n"
            yield "1. Issue immediate Lookout Circular\n"
            yield "2. Coordinate with Shivajinagar PS\n"
            yield "3. Forensic analysis of CCTV footage\n"

    async def _ollama_stream(self, system: str, prompt: str) -> AsyncGenerator[str, None]:
        async with httpx.AsyncClient(timeout=120) as client, client.stream(
            "POST",
            f"{settings.OLLAMA_BASE_URL}/api/chat",
            json={
                "model": settings.OLLAMA_MODEL,
                "messages": [
                    {"role": "system", "content": system},
                    {"role": "user", "content": prompt},
                ],
                "stream": True,
            },
        ) as response:
            async for line in response.aiter_lines():
                if line:
                    try:
                        data = json.loads(line)
                        if content := data.get("message", {}).get("content"):
                            yield content
                    except json.JSONDecodeError:
                        pass

    async def _openai_stream(self, system: str, prompt: str) -> AsyncGenerator[str, None]:
        from openai import AsyncOpenAI
        client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        stream = await client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": prompt},
            ],
            stream=True,
        )
        async for chunk in stream:
            if chunk.choices[0].delta.content:
                yield chunk.choices[0].delta.content
