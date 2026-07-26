"""
POLICEGPT AI Engine — Core RAG + LLM Pipeline
Implements: Intent Detection → NER → Query Expansion → Hybrid Search
→ Knowledge Graph → Reranking → LLM Reasoning → Response Generation
"""
from typing import Any, Dict, List, Optional, AsyncGenerator
import asyncio
import json
import logging
import re

from app.core.config import settings
from app.ai.intent_classifier import IntentClassifier
from app.ai.ner_extractor import NERExtractor
from app.ai.query_expander import QueryExpander
from app.search.hybrid_search import HybridSearchEngine
from app.knowledge_graph.graph_client import KnowledgeGraphClient
from app.ai.reranker import CrossEncoderReranker
from app.ai.llm_client import LLMClient
from app.ai.prompt_templates import PromptTemplates
from app.security.prompt_guard import PromptGuard
from app.db.redis_client import RedisClient

logger = logging.getLogger("policegpt.ai_engine")


class PoliceGPTEngine:
    """
    Core AI reasoning engine for POLICEGPT.
    Orchestrates the full investigation query pipeline.
    """

    def __init__(self):
        self.intent_classifier = IntentClassifier()
        self.ner_extractor = NERExtractor()
        self.query_expander = QueryExpander()
        self.search_engine = HybridSearchEngine()
        self.kg_client = KnowledgeGraphClient()
        self.reranker = CrossEncoderReranker()
        self.llm_client = LLMClient()
        self.prompt_templates = PromptTemplates()
        self.prompt_guard = PromptGuard()
        self.redis = RedisClient()

    async def process_query(
        self,
        query: str,
        session_id: str,
        officer_id: str,
        officer_role: str,
        stream: bool = True,
    ) -> AsyncGenerator[Dict, None]:
        """
        Main query pipeline — Chain of Thought (internal) → Grounded Response
        """
        logger.info(f"[ENGINE] Processing query | session={session_id} | officer={officer_id}")

        # ── 1. Prompt Injection Guard ────────────────────────────────────────
        is_safe, threat_type = await self.prompt_guard.check(query)
        if not is_safe:
            yield {"type": "error", "content": f"⚠️ Query blocked: {threat_type}"}
            return

        # ── 2. Retrieve Conversation History ────────────────────────────────
        history = await self.redis.get_conversation_history(session_id, limit=10)

        # ── 3. Intent Classification ─────────────────────────────────────────
        intent = await self.intent_classifier.classify(query, history)
        yield {"type": "thinking", "content": f"Intent: {intent['primary']}"}

        # ── 4. Named Entity Recognition ─────────────────────────────────────
        entities = await self.ner_extractor.extract(query)
        yield {"type": "thinking", "content": f"Entities: {entities}"}

        # ── 5. Query Expansion ──────────────────────────────────────────────
        expanded_queries = await self.query_expander.expand(query, intent, entities)

        # ── 6. Metadata Filter Construction ─────────────────────────────────
        metadata_filters = self._build_metadata_filters(intent, entities, officer_role)

        # ── 7. Hybrid Search (Semantic + Keyword) ───────────────────────────
        yield {"type": "status", "content": "🔍 Searching crime database..."}
        search_results = await self.search_engine.search(
            queries=expanded_queries,
            filters=metadata_filters,
            top_k=20,
        )

        # Feature 3: Emit retrieval path metadata for debugging
        retrieval_path = search_results[0].get("retrieval_path", "hybrid") if search_results else "hybrid"
        yield {
            "type": "retrieval_meta",
            "content": {
                "path": retrieval_path,
                "results_count": len(search_results),
                "query_count": len(expanded_queries),
            }
        }

        # ── 8. Knowledge Graph Lookup ────────────────────────────────────────
        kg_results = {}
        if entities.get("persons") or entities.get("vehicles") or entities.get("phones"):
            yield {"type": "status", "content": "🕸️ Querying knowledge graph..."}
            kg_results = await self.kg_client.lookup_entities(entities)

        # ── 9. Cross-Encoder Reranking ───────────────────────────────────────
        reranked = await self.reranker.rerank(query, search_results, top_k=8)

        # ── 10. Build Context ────────────────────────────────────────────────
        context = self._build_context(reranked, kg_results, intent)

        # ── 11. Construct System + User Prompt ──────────────────────────────
        system_prompt = self.prompt_templates.get_system_prompt(officer_role, intent)
        full_prompt = self.prompt_templates.build_rag_prompt(
            query=query,
            context=context,
            history=history,
            intent=intent,
            entities=entities,
        )

        # ── 12. LLM Reasoning + Streaming Response ──────────────────────────
        yield {"type": "status", "content": "🧠 Analyzing evidence..."}
        citations = self._extract_citations(reranked)

        async for chunk in self.llm_client.stream_generate(
            system_prompt=system_prompt,
            user_prompt=full_prompt,
        ):
            yield {"type": "content", "content": chunk}

        # ── 13. Post-Response Actions ────────────────────────────────────────
        yield {"type": "citations", "content": citations}

        # Visualization hints based on intent
        viz_hints = self._get_visualization_hints(intent, entities, search_results)
        if viz_hints:
            yield {"type": "visualization", "content": viz_hints}

        # ── 14. Save to Conversation History ────────────────────────────────
        await self.redis.save_message(session_id, "user", query, officer_id=officer_id)
        # Full response saved by the router after streaming completes

    def _build_metadata_filters(
        self, intent: Dict, entities: Dict, officer_role: str
    ) -> Dict:
        """Construct structured filters from NER + intent for vector DB query"""
        filters = {}
        if entities.get("date_range"):
            filters["date_range"] = entities["date_range"]
        if entities.get("locations"):
            filters["locations"] = entities["locations"]
        if intent.get("crime_categories"):
            filters["categories"] = intent["crime_categories"]
        if entities.get("case_status"):
            filters["status"] = entities["case_status"]
        # Role-based data access control
        if officer_role == "officer":
            filters["district_restricted"] = True
        return filters

    def _build_context(
        self, reranked: List, kg_results: Dict, intent: Dict
    ) -> str:
        """Assemble retrieved documents into LLM context"""
        sections = []
        for i, doc in enumerate(reranked, 1):
            sections.append(
                f"[CASE {i}] FIR: {doc.get('fir_number', 'N/A')}\n"
                f"Category: {doc.get('category', 'N/A')}\n"
                f"Date: {doc.get('date_filed', 'N/A')}\n"
                f"Location: {doc.get('crime_location', 'N/A')}\n"
                f"Summary: {doc.get('summary', 'N/A')}\n"
                f"Status: {doc.get('status', 'N/A')}\n"
                f"Score: {doc.get('score', 0):.3f}"
            )
        if kg_results:
            sections.append(f"\n[KNOWLEDGE GRAPH]\n{json.dumps(kg_results, indent=2)}")
        return "\n\n---\n\n".join(sections)

    def _extract_citations(self, reranked: List) -> List[Dict]:
        return [
            {
                "fir_number": doc.get("fir_number"),
                "title": doc.get("category", "Case"),
                "date": doc.get("date_filed"),
                "relevance": round(doc.get("score", 0) * 100, 1),
                # Feature 5: include a narrative snippet for explainability UI
                "snippet": (doc.get("summary") or "")[:120] or None,
            }
            for doc in reranked[:5]
            if doc.get("fir_number") and doc.get("fir_number") != "AGGREGATE"
        ]

    def _get_visualization_hints(
        self, intent: Dict, entities: Dict, results: List
    ) -> Optional[Dict]:
        primary = intent.get("primary", "")
        if primary in ["crime_heatmap", "hotspot_analysis"]:
            return {"type": "map", "action": "show_heatmap"}
        if primary in ["network_analysis", "gang_lookup"]:
            return {"type": "graph", "action": "show_network"}
        if primary in ["timeline", "case_history"]:
            return {"type": "timeline", "action": "show_timeline"}
        if primary in ["statistics", "trend_analysis"]:
            return {"type": "chart", "action": "show_analytics"}
        return None
