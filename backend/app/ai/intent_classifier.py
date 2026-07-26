"""Stub AI modules"""


class IntentClassifier:
    async def classify(self, query: str, history: list) -> dict:
        query_lower = query.lower()
        if any(w in query_lower for w in ["heatmap", "hotspot", "map", "where", "area", "zone"]):
            return {"primary": "crime_heatmap", "confidence": 0.88}
        if any(w in query_lower for w in ["gang", "network", "associate", "connection"]):
            return {"primary": "network_analysis", "confidence": 0.85}
        if any(w in query_lower for w in ["timeline", "history", "when", "sequence"]):
            return {"primary": "timeline", "confidence": 0.82}
        if any(w in query_lower for w in ["predict", "forecast", "trend", "next"]):
            return {"primary": "prediction", "confidence": 0.79}
        if any(w in query_lower for w in ["report", "summary", "generate"]):
            return {"primary": "report_generation", "confidence": 0.91}
        if any(w in query_lower for w in ["section", "ipc", "bns", "charge", "legal"]):
            return {"primary": "legal_sections", "confidence": 0.87}
        if any(w in query_lower for w in ["missing", "child", "person"]):
            return {"primary": "missing_person", "confidence": 0.83}
        if any(w in query_lower for w in ["suspect", "criminal", "accused", "offender"]):
            return {"primary": "suspect_lookup", "confidence": 0.86}
        if any(w in query_lower for w in ["modus operandi", "mo", "similar", "pattern"]):
            return {"primary": "modus_operandi", "confidence": 0.84}
        return {"primary": "fir_search", "confidence": 0.75}


class NERExtractor:
    async def extract(self, query: str) -> dict:
        import re
        entities = {
            "persons": [], "locations": [], "vehicles": [],
            "phones": [], "date_range": None, "case_status": None,
            "crime_categories": [],
        }
        # Persons
        name_patterns = re.findall(r'\b[A-Z][a-z]+ [A-Z][a-z]+\b', query)
        entities["persons"] = name_patterns
        # Vehicles
        plates = re.findall(r'KA-\d{2}-[A-Z]{2}-\d{4}', query.upper())
        entities["vehicles"] = plates
        # Phones
        phones = re.findall(r'\+?91[-\s]?\d{10}|\d{10}', query)
        entities["phones"] = phones
        # Categories
        cat_map = {
            "robbery": "robbery", "burglary": "burglary", "murder": "murder",
            "cybercrime": "cybercrime", "cyber": "cybercrime", "narcotics": "narcotics",
            "drugs": "narcotics", "kidnapping": "kidnapping", "assault": "assault",
        }
        for kw, cat in cat_map.items():
            if kw in query.lower():
                entities["crime_categories"].append(cat)
        return entities


class QueryExpander:
    async def expand(self, query: str, intent: dict, entities: dict) -> list:
        expansions = [query]
        synonyms = {
            "robbery": "theft dacoity loot",
            "cybercrime": "online fraud digital crime internet",
            "murder": "homicide killing death unnatural",
        }
        for cat in entities.get("crime_categories", []):
            if cat in synonyms:
                expansions.append(f"{query} {synonyms[cat]}")
        return expansions[:3]
