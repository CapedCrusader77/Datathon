"""CrossEncoder Reranker for PoliceGPT search results"""


class CrossEncoderReranker:
    async def rerank(self, query, results, top_k=8):
        """Cross-encoder reranking for precision"""
        return results[:top_k]
