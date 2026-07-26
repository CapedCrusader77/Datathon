"""
Pure Python Query Expander for Karnataka Police (KSP) CCTNS queries.
Plain async method returning plain built-in Python list without external dependencies.
"""

import re
from typing import Any, Dict, List, Optional


class QueryExpander:
    """
    Expands law enforcement search queries with Kannada/English synonyms,
    IPC section codes, and related criminal terminology.
    Example: "murder" -> ["murder", "homicide", "302", "killing", "ಕೊಲೆ"]
    """

    def __init__(self):
        # Crime term -> list of synonyms, IPC sections, and Kannada translations
        self.synonym_map = {
            "murder": ["murder", "homicide", "302", "killing", "ಕೊಲೆ", " IPC 302"],
            "homicide": ["murder", "homicide", "302", "killing", "ಕೊಲೆ"],
            "attempt to murder": ["attempt to murder", "307", "assault", "ಕೊಲೆ ಯತ್ನ", "IPC 307"],
            "rape": ["rape", "sexual assault", "376", "ಅತ್ಯಾಚಾರ", "IPC 376"],
            "sexual assault": ["rape", "sexual assault", "376", "ಅತ್ಯಾಚಾರ"],
            "theft": ["theft", "snatching", "379", "robbery", "stolen", "ಕಳ್ಳತನ", "IPC 379"],
            "snatching": ["snatching", "theft", "379", "chain snatching", "ಕಳ್ಳತನ"],
            "cheating": ["cheating", "fraud", "420", "scam", "financial fraud", "ವಂಚನೆ", "IPC 420"],
            "fraud": ["cheating", "fraud", "420", "scam", "financial fraud", "ವಂಚನೆ"],
            "scam": ["cheating", "fraud", "420", "scam", "ವಂಚನೆ"],
            "dowry": ["dowry harassment", "498a", "cruelty", "domestic violence", "ವರದಕ್ಷಿಣೆ", "IPC 498A"],
            "harassment": ["dowry harassment", "498a", "harassment", "cruelty", "ವರದಕ್ಷಿಣೆ ಕಿರುಕುಳ"],
            "robbery": ["robbery", "dacoity", "395", "397", "burglary", "loot", "ಸುಲಿಗೆ", "IPC 395"],
            "dacoity": ["dacoity", "robbery", "395", "armed robbery", "ಡಕೈತಿ"],
            "burglary": ["burglary", "house break-in", "theft", "379", "ಕನ್ನ ಕಳ್ಳತನ"],
            "narcotics": ["narcotics", "drugs", "ganja", "ndps", "cannabis", "ಮಾದಕ ದ್ರವ್ಯ"],
            "drugs": ["narcotics", "drugs", "ganja", "ndps", "cannabis", "ಮಾದಕ ದ್ರವ್ಯ"],
            "ganja": ["ganja", "narcotics", "drugs", "ndps", "cannabis", "ಗಾಂಜಾ"],
            "cybercrime": ["cybercrime", "online fraud", "phishing", "digital crime", "ಸೈಬರ್ ಅಪರಾಧ"],
            "cyber": ["cybercrime", "online fraud", "phishing", "digital crime", "ಸೈಬರ್ ಅಪರಾಧ"],
            "kidnapping": ["kidnapping", "abduction", "363", "apaharaṇa", "ಅಪಹರಣ"],
            "extortion": ["extortion", "blackmail", "384", "ಸುಲಿಗೆ", "ಬೆದರಿಕೆ"],
            "assault": ["assault", "physical violence", "323", "324", "ಹಲ್ಲೆ"],
        }

    async def expand(
        self,
        query: str,
        intent: Optional[Dict[str, Any]] = None,
        entities: Optional[Dict[str, Any]] = None,
        *args: Any,
        **kwargs: Any
    ) -> List[str]:
        """
        Expand search query with synonyms, IPC sections, and Kannada translations.
        Returns a plain Python list of expanded query strings.
        """
        if not query or not isinstance(query, str):
            return []

        expanded_terms: List[str] = []

        # 1. Always include the exact original query first
        clean_query = query.strip()
        expanded_terms.append(clean_query)

        query_lower = clean_query.lower()

        # 2. Check for direct keyword matches in synonym map
        for term, synonyms in self.synonym_map.items():
            if re.search(rf"\b{re.escape(term)}\b", query_lower):
                for syn in synonyms:
                    if syn not in expanded_terms:
                        expanded_terms.append(syn)

        # 3. If entities were passed (from engine.py), include crime_types and ipc_sections
        if entities and isinstance(entities, dict):
            for cat in entities.get("crime_types", []):
                cat_lower = str(cat).lower()
                if cat_lower in self.synonym_map:
                    for syn in self.synonym_map[cat_lower]:
                        if syn not in expanded_terms:
                            expanded_terms.append(syn)

            for sec in entities.get("ipc_sections", []):
                sec_str = str(sec).upper()
                sec_query = f"IPC {sec_str}"
                if sec_query not in expanded_terms:
                    expanded_terms.append(sec_query)

        return expanded_terms
