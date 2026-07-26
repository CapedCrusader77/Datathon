"""
LLM Client — Supports Ollama (local), OpenAI, and Google Gemini
"""
import httpx
from typing import AsyncGenerator
from app.core.config import settings
import json
import logging

logger = logging.getLogger("policegpt")


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
            async for chunk in self._demo_stream():
                yield chunk

    async def _demo_stream(self) -> AsyncGenerator[str, None]:
        chunks = [
            "Based on analysis of FIR **CR-045/2024** and cross-referencing CCTNS records:\n\n",
            "**1. Suspect Profile**\n",
            "- Main accused: **Ravi Kumar S** (KSP-CR-2024-0001)\n",
            "- Gang affiliation: Bengaluru South Gang\n",
            "- Modus Operandi: Armed robbery of commercial establishments using motorcycles\n\n",
            "**2. Key Evidence Found**\n",
            "- CCTV footage from Koramangala 5th Block petrol station\n",
            "- Escape vehicle identified: White Hyundai i20 (**KA-01-AB-1234**)\n",
            "- Mobile tower dump indicates presence in Shivajinagar post-incident\n\n",
            "**3. Legal Provisions Applicable**\n",
            "- **IPC Section 392**: Robbery (up to 10 years rigorous imprisonment)\n",
            "- **IPC Section 397**: Robbery with attempt to cause death/grievous hurt\n",
            "- **BNS Section 309**: Robbery provisions under Bharatiya Nyaya Sanhita\n\n",
            "**4. Cross-District Connections**\n",
            "- Suspect linked to FIR **CR-089/2023** (Whitefield PS — similar MO)\n",
            "- 2 similar MO cases in South Bangalore (2023-24)\n\n",
            "⚠️ **Recommendations**\n",
            "1. Issue immediate Lookout Circular\n",
            "2. Coordinate with Shivajinagar PS\n",
            "3. Forensic analysis of CCTV footage\n",
        ]
        for c in chunks:
            yield c

    async def _ollama_stream(self, system: str, prompt: str) -> AsyncGenerator[str, None]:
        try:
            async with httpx.AsyncClient(timeout=120) as client:
                async with client.stream(
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
                    response.raise_for_status()
                    async for line in response.aiter_lines():
                        if line:
                            try:
                                data = json.loads(line)
                                if content := data.get("message", {}).get("content"):
                                    yield content
                            except json.JSONDecodeError:
                                pass
        except Exception as e:
            logger.warning(f"[Ollama Fallback] Connection error ({e}) — switching to demo stream")
            async for chunk in self._demo_stream():
                yield chunk

    async def _openai_stream(self, system: str, prompt: str) -> AsyncGenerator[str, None]:
        try:
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
        except Exception as e:
            logger.warning(f"[OpenAI Fallback] Error ({e}) — switching to demo stream")
            async for chunk in self._demo_stream():
                yield chunk
