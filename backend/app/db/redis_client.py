"""Redis client for conversation history and caching"""
import json
import redis.asyncio as aioredis
from app.core.config import settings
from typing import List, Dict, Optional


class RedisClient:
    def __init__(self):
        self._client = None

    @property
    def client(self):
        if not self._client:
            self._client = aioredis.from_url(settings.REDIS_URL, decode_responses=True)
        return self._client

    async def get_conversation_history(self, session_id: str, limit: int = 10) -> List[Dict]:
        key = f"conv:{session_id}"
        raw = await self.client.lrange(key, -limit * 2, -1)
        return [json.loads(r) for r in raw]

    async def save_message(self, session_id: str, role: str, content: str, officer_id: Optional[str] = None):
        key = f"conv:{session_id}"
        msg = json.dumps({"role": role, "content": content})
        await self.client.rpush(key, msg)
        await self.client.expire(key, 86400 * 7)  # 7 days TTL
        if officer_id:
            await self.client.sadd(f"officer:{officer_id}:sessions", session_id)

    async def clear_session(self, session_id: str, officer_id: Optional[str] = None):
        await self.client.delete(f"conv:{session_id}")
        if officer_id:
            await self.client.srem(f"officer:{officer_id}:sessions", session_id)

    async def list_officer_sessions(self, officer_id: str) -> List[str]:
        members = await self.client.smembers(f"officer:{officer_id}:sessions")
        return [str(m) for m in members] if members else []
