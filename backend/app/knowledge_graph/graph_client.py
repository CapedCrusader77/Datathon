"""Hybrid search, reranker, KG client, prompt guard stubs"""


class HybridSearchEngine:
    async def search(self, queries, filters, top_k=20):
        """Combines vector search (Qdrant) + keyword search (ES)"""
        return [
            {"fir_number": "CR-045/2024", "category": "Robbery", "date_filed": "2024-03-10",
             "crime_location": "Koramangala", "summary": "Armed robbery at petrol station", "status": "open", "score": 0.92},
            {"fir_number": "CR-089/2023", "category": "Robbery", "date_filed": "2023-08-22",
             "crime_location": "Whitefield", "summary": "Similar robbery with motorcycles", "status": "chargesheeted", "score": 0.87},
            {"fir_number": "CR-034/2024", "category": "Narcotics", "date_filed": "2024-01-08",
             "crime_location": "KR Market", "summary": "Drug peddling network busted", "status": "open", "score": 0.65},
        ]


class CrossEncoderReranker:
    async def rerank(self, query, results, top_k=8):
        """Cross-encoder reranking for precision"""
        return results[:top_k]


class KnowledgeGraphClient:
    async def lookup_entities(self, entities):
        """Query Neo4j for entity relationships"""
        return {
            "connections": [
                {"from": "Ravi Kumar", "to": "CR-045/2024", "relation": "ACCUSED_IN"},
                {"from": "KA-01-AB-1234", "to": "CR-045/2024", "relation": "SEEN_AT"},
            ]
        }


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
