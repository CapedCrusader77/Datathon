"""
POLICEGPT - Golden Evaluation Dataset Creator
Generates a structured synthetic evaluation dataset ("Golden Set") of 8-10 diverse test cases
for testing Contextual Precision, Contextual Recall, Faithfulness, Answer Relevancy, and Citation Tracking.
"""
import json
import os
from typing import List, Dict, Any

GOLDEN_DATASET: List[Dict[str, Any]] = [
    {
        "test_id": "TC_001_EXACT_FIR_MATCH",
        "category": "Exact FIR Keyword Match",
        "input": "Provide details and suspect status for FIR CR-045/2024 filed in Koramangala.",
        "expected_context": [
            "FIR CR-045/2024 | Category: Robbery | Date Filed: 2024-03-10 | Crime Location: Koramangala 5th Block | District: Bangalore South | Summary: Armed robbery at petrol station. 3 suspects on motorcycles. ₹1,42,000 stolen. CCTV footage available.",
            "Suspect Ravi Kumar S (KSP-CR-2024-0001) | Main accused in CR-045/2024 | Repeat offender | Currently absconding | Gang: Bengaluru South Gang"
        ],
        "ground_truth": "FIR CR-045/2024 is an armed robbery case filed on 10-Mar-2024 in Koramangala 5th Block, Bangalore South, involving three masked suspects who stole ₹1,42,000 from a petrol station. The primary accused is Ravi Kumar S (KSP-CR-2024-0001), a known repeat offender associated with the Bengaluru South Gang, who is currently absconding [CR-045/2024].",
        "expected_citations": ["CR-045/2024"],
        "should_refuse": False,
        "metadata": {"language": "en", "complexity": "low"}
    },
    {
        "test_id": "TC_002_CROSS_CASE_LINK",
        "category": "Cross-Case Suspect Link Query",
        "input": "Which FIRs is repeat offender Ravi Kumar S linked to across Bangalore districts, and what is his modus operandi?",
        "expected_context": [
            "FIR CR-045/2024 | Category: Robbery | Date Filed: 2024-03-10 | Location: Koramangala 5th Block | Accused: Ravi Kumar S | Status: open | MO: Motorcycle getaway, armed robbery of commercial establishment.",
            "FIR CR-089/2023 | Category: Robbery | Date Filed: 2023-08-22 | Location: Whitefield | Accused: Ravi Kumar S | Status: chargesheeted | MO: Similar robbery with motorcycles used as escape vehicles.",
            "Suspect Profile: Ravi Kumar S | Criminal ID: KSP-CR-2024-0001 | Total FIRs: 12 | Gang: Bengaluru South Gang | Risk: Extreme"
        ],
        "ground_truth": "Ravi Kumar S (KSP-CR-2024-0001) is linked to multiple robbery cases across Bangalore, including FIR CR-045/2024 in Koramangala 5th Block and FIR CR-089/2023 in Whitefield [CR-045/2024, CR-089/2023]. His modus operandi involves armed robberies of commercial establishments using motorcycles as escape vehicles, operating with associates from the Bengaluru South Gang.",
        "expected_citations": ["CR-045/2024", "CR-089/2023"],
        "should_refuse": False,
        "metadata": {"language": "en", "complexity": "high"}
    },
    {
        "test_id": "TC_003_KANNADA_QUERY",
        "category": "Kannada / Multilingual Query",
        "input": "ಕೊರಮಂಗಲದಲ್ಲಿ ನಡೆದ ದರೋಡೆ ಪ್ರಕರಣದ (CR-045/2024) ವಿವರಗಳನ್ನು ತಿಳಿಸಿ.",
        "expected_context": [
            "FIR CR-045/2024 | Category: Robbery | Date Filed: 2024-03-10 | Crime Location: Koramangala 5th Block | Summary: Armed robbery at petrol station. ₹1,42,000 stolen. Accused: Ravi Kumar S."
        ],
        "ground_truth": "ಕೊರಮಂಗಲ 5ನೇ ಬ್ಲಾಕ್‌ನಲ್ಲಿ 10-Mar-2024 ರಂದು ನಡೆದ ದರೋಡೆ ಪ್ರಕರಣ (FIR CR-045/2024) ಪೆಟ್ರೋಲ್ ಬಂಕ್‌ನಲ್ಲಿ ₹1,42,000 ದರೋಡೆಗೆ ಸಂಬಂಧಿಸಿದೆ. ಮುಖ್ಯ ಆರೋಪಿ ರವಿ ಕುಮಾರ್ ಎಸ್ ಪ್ರಸ್ತುತ ತಲೆಮರೆಸಿಕೊಂಡಿದ್ದಾನೆ [CR-045/2024].",
        "expected_citations": ["CR-045/2024"],
        "should_refuse": False,
        "metadata": {"language": "kn", "complexity": "medium"}
    },
    {
        "test_id": "TC_004_OUT_OF_DOMAIN_REFUSAL",
        "category": "Out-of-Domain Refusal",
        "input": "Can you give me the recipe for Bangalore-style chicken biryani and list the top restaurants in Koramangala?",
        "expected_context": [],
        "ground_truth": "I am POLICEGPT, an AI investigation assistant for Karnataka State Police. I am strictly programmed to assist with official law enforcement queries, crime database searches, and FIR analysis. I cannot answer queries regarding food recipes, restaurant recommendations, or other non-police topics.",
        "expected_citations": [],
        "should_refuse": True,
        "metadata": {"language": "en", "complexity": "low"}
    },
    {
        "test_id": "TC_005_LEGAL_STATUTE_RECOMMENDATION",
        "category": "Legal IPC / BNS Statute Query",
        "input": "What are the recommended IPC and Bharatiya Nyaya Sanhita (BNS) sections for an armed robbery committed with a deadly weapon by multiple associates?",
        "expected_context": [
            "IPC Section 392: Punishment for robbery (up to 10 years rigorous imprisonment).",
            "IPC Section 397: Robbery, or dacoity, with attempt to cause death or grievous hurt (minimum 7 years imprisonment).",
            "IPC Section 34: Acts done by several persons in furtherance of common intention.",
            "BNS Section 309: Robbery provisions under Bharatiya Nyaya Sanhita.",
            "BNS Section 310: Dacoity preparation and gang robbery provisions."
        ],
        "ground_truth": "For armed robbery with a deadly weapon involving multiple associates, the applicable sections under the Indian Penal Code are IPC 392 (Robbery), IPC 397 (Robbery with deadly weapon, minimum 7 years), and IPC 34 (Common intention). Under the Bharatiya Nyaya Sanhita (BNS), the corresponding charges are BNS Section 309 (Robbery) and BNS Section 310 (Dacoity/Gang Robbery) [IPC-392, BNS-309].",
        "expected_citations": ["IPC-392", "BNS-309"],
        "should_refuse": False,
        "metadata": {"language": "en", "complexity": "medium"}
    },
    {
        "test_id": "TC_006_VEHICLE_INVESTIGATION",
        "category": "Vehicle Registration & Ownership Query",
        "input": "Who is the registered owner of white Hyundai i20 bearing registration number KA-01-AB-1234, and which cases is it linked to?",
        "expected_context": [
            "Vehicle Registration: KA-01-AB-1234 | Make/Model: Hyundai i20 | Color: White | Year: 2019 | Registered Owner: Ravi Kumar S (KSP-CR-2024-0001) | Stolen Status: False",
            "FIR Appearances: FIR CR-045/2024 (Koramangala Robbery - Escape Vehicle), FIR CR-089/2023 (Whitefield Robbery)"
        ],
        "ground_truth": "Vehicle KA-01-AB-1234 is a white 2019 Hyundai i20 registered to suspect Ravi Kumar S (KSP-CR-2024-0001). The vehicle is linked as a getaway car in two armed robbery cases: FIR CR-045/2024 in Koramangala and FIR CR-089/2023 in Whitefield [CR-045/2024, CR-089/2023].",
        "expected_citations": ["CR-045/2024", "CR-089/2023"],
        "should_refuse": False,
        "metadata": {"language": "en", "complexity": "medium"}
    },
    {
        "test_id": "TC_007_GANG_NETWORK_QUERY",
        "category": "Gang & Organized Crime Analysis",
        "input": "Give me an overview of the Bengaluru South Gang, its key leaders, and active crime specializations.",
        "expected_context": [
            "Gang Record: Bengaluru South Gang | Status: Active | Active Since: 2018 | Territory: Koramangala, Madiwala, Jayanagar | Total Members: 12 | Leader: Ravi Kumar S (KSP-CR-2024-0001) | Specializations: Commercial robbery, extortion, vehicle theft"
        ],
        "ground_truth": "The Bengaluru South Gang is an active organized criminal syndicate operating in Koramangala, Madiwala, and Jayanagar with approximately 12 known members. Led by repeat offender Ravi Kumar S (KSP-CR-2024-0001), the gang specializes in commercial armed robbery, extortion, and vehicle theft across Bangalore South [CR-045/2024].",
        "expected_citations": ["CR-045/2024"],
        "should_refuse": False,
        "metadata": {"language": "en", "complexity": "high"}
    },
    {
        "test_id": "TC_008_HALLUCINATION_TRAP",
        "category": "Hallucination Resistance / Missing Evidence",
        "input": "Did suspect Ravi Kumar S use an AK-47 assault rifle during the Koramangala petrol station robbery CR-045/2024?",
        "expected_context": [
            "FIR CR-045/2024 | Category: Robbery | Date Filed: 2024-03-10 | Crime Location: Koramangala 5th Block | Weapons Recovered: None specified | Evidence: CCTV footage shows suspects armed with handguns/country-made pistols, not rifles."
        ],
        "ground_truth": "No, the retrieved case evidence for FIR CR-045/2024 does not support the use of an AK-47 assault rifle. According to CCTV footage and FIR CR-045/2024 records, the suspects were armed with handguns/pistols during the Koramangala petrol station robbery [CR-045/2024].",
        "expected_citations": ["CR-045/2024"],
        "should_refuse": False,
        "metadata": {"language": "en", "complexity": "high"}
    }
]


def save_golden_dataset(output_path: str = None) -> str:
    """Saves the golden dataset JSON file to disk."""
    if output_path is None:
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        output_path = os.path.join(base_dir, "tests", "golden_dataset.json")

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(GOLDEN_DATASET, f, indent=2, ensure_ascii=False)
    print(f"[SUCCESS] Successfully generated Golden Dataset with {len(GOLDEN_DATASET)} test cases at: {output_path}")
    return output_path


if __name__ == "__main__":
    save_golden_dataset()
