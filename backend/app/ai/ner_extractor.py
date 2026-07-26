"""
Pure Python Regex-based Named Entity Recognition (NER) Extractor for Karnataka Police (KSP) CCTNS queries.
Plain async method returning plain built-in Python dict without external dependencies.
"""

import re
from typing import Any, Dict, List


class NERExtractor:
    """
    Extracts criminal entities from law enforcement queries using pure Python regex:
      - persons: Suspect, victim, or officer names
      - fir_numbers: Formats like FIR-2024-089 or 104430006202600001
      - ipc_sections: Legal codes like 302, 307, 376, 420, 379, 498A
      - locations: Karnataka districts, cities, and police station areas
      - crime_types: Murder, theft, rape, cheating, robbery, etc.
    """

    def __init__(self):
        # Karnataka Districts & Major Areas
        self.location_keywords = [
            "bengaluru", "bangalore", "mysuru", "mysore", "mangaluru", "mangalore",
            "hubballi", "dharwad", "belagavi", "belgaum", "kalaburagi", "gulbarga",
            "shivamogga", "shimoga", "udupi", "ballari", "bellary", "tumakuru", "tumkur",
            "mandya", "hassan", "raichur", "bidar", "vijayapura", "bijapur", "chikkamagaluru",
            "kodagu", "madikeri", "indiranagar", "ashok nagar", "koramangala", "whitefield",
            "jayanagar", "kadri", "devaraja", "mg road", "brigade road"
        ]

        # Crime Categories
        self.crime_keywords = [
            "murder", "homicide", "attempt to murder", "killing", "rape", "sexual assault",
            "theft", "snatching", "robbery", "burglary", "dacoity", "cheating", "fraud",
            "scam", "dowry", "harassment", "extortion", "kidnapping", "assault",
            "cybercrime", "narcotics", "drugs", "ganja", "udr", "par"
        ]

        # Target IPC / Legal Sections
        self.known_ipc_sections = {
            "302", "307", "376", "379", "420", "498a", "498", "395", "397", "120b",
            "304", "323", "324", "341", "504", "506"
        }

    async def extract(self, query: str, *args: Any, **kwargs: Any) -> Dict[str, List[str]]:
        """
        Extract entities from query text.
        Returns a plain Python dict with keys: persons, fir_numbers, ipc_sections, locations, crime_types.
        """
        if not query or not isinstance(query, str):
            return {
                "persons": [],
                "fir_numbers": [],
                "ipc_sections": [],
                "locations": [],
                "crime_types": []
            }

        query_upper = query.upper()
        query_lower = query.lower()

        # 1. FIR Numbers (e.g., FIR-2024-089, FIR/2026/001, 104430006202600001)
        fir_patterns = [
            r"\bFIR[-/#\s]?\d{4}[-/#]?\d{2,6}\b",
            r"\bFIR[-/#\s]?\d{1,6}\b",
            r"\b\d{14,18}\b",
            r"\b\d{4}/\d{2,6}\b"
        ]
        fir_numbers = []
        for pat in fir_patterns:
            matches = re.findall(pat, query, flags=re.IGNORECASE)
            for m in matches:
                clean_fir = m.strip()
                if clean_fir not in fir_numbers:
                    fir_numbers.append(clean_fir)

        # 2. IPC / BNS Sections (e.g., 302, 307, 376, 420, 379, 498A)
        ipc_sections = []
        ipc_matches = re.findall(r"\b(?:IPC|SECTION|SEC\.?|U/S|BNS)?\s*(\d{3}[A-Z]?|\d{2}[A-Z]?)\b", query_upper)
        for code in ipc_matches:
            c_clean = code.strip().upper()
            if c_clean.lower() in self.known_ipc_sections or any(c_clean.startswith(k) for k in ["302", "307", "376", "379", "420", "498"]):
                if c_clean not in ipc_sections:
                    ipc_sections.append(c_clean)
        # Fallback check for exact section words in query
        for sec in ["302", "307", "376", "379", "420", "498A"]:
            if re.search(rf"\b{sec}\b", query_upper) and sec not in ipc_sections:
                ipc_sections.append(sec)

        # 3. Locations (Karnataka Districts & Police Stations)
        locations = []
        for loc in self.location_keywords:
            if re.search(rf"\b{re.escape(loc)}\b", query_lower):
                formatted_loc = "Bengaluru" if loc in ["bangalore", "bengaluru"] else loc.title()
                if formatted_loc not in locations:
                    locations.append(formatted_loc)

        # 4. Crime Types
        crime_types = []
        for crime in self.crime_keywords:
            if re.search(rf"\b{re.escape(crime)}\b", query_lower):
                if crime not in crime_types:
                    crime_types.append(crime)

        # 5. Persons (Capitalized names, e.g., "Ravi Kumar", "Manjunath Hiremath", "Basavaraj Patil")
        persons = []
        # Exclude location words and common command words from being matched as names
        excluded_words = {
            "FIR", "IPC", "BNS", "KARNATAKA", "POLICE", "STATION", "DISTRICT", "SECTION",
            "UNDER", "INVESTIGATION", "COURT", "ACCUSED", "SUSPECT", "VICTIM", "OFFICER",
            "INSPECTOR", "CONSTABLE", "BENGALURU", "BANGALORE", "MYSURU", "MYSORE",
            "MANGALURU", "HUBBALLI", "DHARWAD", "BELAGAVI", "MURDER", "THEFT", "ROBBERY",
            "RAPE", "CHEATING", "FRAUD", "SHOW", "LIST", "FIND", "WHO", "WHAT", "WHERE"
        }
        words = re.findall(r"\b[A-Za-z]+\b", query)
        i = 0
        while i < len(words) - 1:
            w1 = words[i]
            w2 = words[i + 1]
            if w1.istitle() and w2.istitle() and w1.upper() not in excluded_words and w2.upper() not in excluded_words:
                full_name = f"{w1} {w2}"
                if full_name not in persons:
                    persons.append(full_name)
                i += 2
            else:
                i += 1

        return {
            "persons": persons,
            "fir_numbers": fir_numbers,
            "ipc_sections": ipc_sections,
            "locations": locations,
            "crime_types": crime_types
        }
