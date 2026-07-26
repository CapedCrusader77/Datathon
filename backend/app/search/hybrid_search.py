"""
Hybrid Search Engine — POLICEGPT
Routes queries to the correct retrieval path:
  - sql:    Counting / aggregation queries (structured filters only)
  - vector: Semantic / MO similarity queries (embedding search)
  - hybrid: Multi-condition queries with both filters + semantic component
"""
import re
import logging

logger = logging.getLogger("policegpt.hybrid_search")

# ── Query type detection patterns ────────────────────────────────────────────
_COUNT_PATTERNS = re.compile(
    r"\b(how many|total number|count of|number of|statistics|how often|frequency)\b",
    re.IGNORECASE,
)
_SEMANTIC_PATTERNS = re.compile(
    r"\b(similar to|same modus operandi|same mo|fuzzy|like this|resembles|pattern like)\b",
    re.IGNORECASE,
)
_AMBIGUOUS_PATTERNS = re.compile(
    r"^\s*(what|who|any|tell me about|find)\b",
    re.IGNORECASE,
)


def _detect_retrieval_path(queries: list, filters: dict) -> str:
    """
    Determine the retrieval path for a set of queries + filters.

    Returns one of: "sql", "vector", "hybrid"
    """
    combined_query = " ".join(queries) if queries else ""

    has_filters = bool(filters)
    is_count = bool(_COUNT_PATTERNS.search(combined_query))
    is_semantic = bool(_SEMANTIC_PATTERNS.search(combined_query))

    if is_count and not is_semantic:
        # Pure counting / aggregation — no need for vector search
        return "sql"
    if is_semantic and not has_filters:
        # Pure semantic / MO similarity — vector only
        return "vector"
    # Everything else: use hybrid (filters + semantic)
    return "hybrid"


class HybridSearchEngine:
    """
    Combines Qdrant vector search + Elasticsearch keyword search.
    Selects retrieval path per query and attaches metadata to results.
    """

    async def search(
        self,
        queries: list,
        filters: dict,
        top_k: int = 20,
    ) -> list:
        """
        Hybrid search — returns a list of matching documents with a
        'retrieval_path' field indicating which path was used.
        """
        path = _detect_retrieval_path(queries, filters)
        logger.info(f"[HybridSearch] path={path} | queries={queries} | filters={filters}")

        # ── Demo results (replace with real Qdrant/ES queries in production) ──
        base_results = [
            {
                "fir_number": "CR-045/2024",
                "category": "Robbery",
                "date_filed": "2024-03-10",
                "crime_location": "Koramangala",
                "summary": "Armed robbery at petrol station near Koramangala 5th block. Suspect fled on motorcycle.",
                "status": "open",
                "score": 0.92,
                "retrieval_path": path,
            },
            {
                "fir_number": "CR-089/2023",
                "category": "Robbery",
                "date_filed": "2023-08-22",
                "crime_location": "Whitefield",
                "summary": "Similar robbery with motorcycles used as escape vehicles. CCTV footage secured.",
                "status": "chargesheeted",
                "score": 0.87,
                "retrieval_path": path,
            },
            {
                "fir_number": "CR-034/2024",
                "category": "Narcotics",
                "date_filed": "2024-01-08",
                "crime_location": "KR Market",
                "summary": "Drug peddling network busted. Cross-district coordination identified.",
                "status": "open",
                "score": 0.65,
                "retrieval_path": path,
            },
        ]

        # ── Path-specific result shaping ──────────────────────────────────────
        if path == "sql":
            # For SQL aggregation queries, return a synthetic count result
            return [
                {
                    "fir_number": "AGGREGATE",
                    "category": "Summary",
                    "date_filed": None,
                    "crime_location": "All Districts",
                    "summary": f"Structured query returned {len(base_results)} matching records.",
                    "status": "N/A",
                    "score": 1.0,
                    "retrieval_path": "sql",
                    "count": len(base_results) * 400,  # simulated DB count
                },
                *base_results,
            ]

        # For vector / hybrid, apply any active filters client-side
        results = base_results
        if filters.get("locations"):
            locs = [l.lower() for l in filters["locations"]]
            results = [
                r for r in results
                if any(loc in r["crime_location"].lower() for loc in locs)
            ] or base_results  # fallback to unfiltered

        return results[:top_k]


class CrossEncoderReranker:
    async def rerank(self, query: str, results: list, top_k: int = 8) -> list:
        """Cross-encoder reranking for precision (stub — uses score sort)"""
        return sorted(results, key=lambda r: r.get("score", 0), reverse=True)[:top_k]


class KnowledgeGraphClient:
    async def lookup_entities(self, entities: dict) -> dict:
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
