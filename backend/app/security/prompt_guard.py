"""Prompt Guard for security and prompt injection detection"""


class PromptGuard:
    INJECTION_PATTERNS = [
        "ignore previous instructions",
        "forget your training",
        "jailbreak",
        "system prompt",
        "reveal your instructions",
        "act as",
        "pretend you are",
    ]

    async def check(self, query: str):
        query_lower = query.lower()
        for pattern in self.INJECTION_PATTERNS:
            if pattern in query_lower:
                return False, f"Prompt injection detected: '{pattern}'"
        return True, None
