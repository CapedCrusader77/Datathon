"""Knowledge Graph client for entity relationships"""


class KnowledgeGraphClient:
    async def lookup_entities(self, entities):
        """Query Neo4j for entity relationships"""
        return {
            "connections": [
                {"from": "Ravi Kumar", "to": "CR-045/2024", "relation": "ACCUSED_IN"},
                {"from": "KA-01-AB-1234", "to": "CR-045/2024", "relation": "SEEN_AT"},
            ]
        }
