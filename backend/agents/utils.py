import json
import logging
import re
from typing import Dict, Any

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s"
)

logger = logging.getLogger("specforge")


def extract_json(text: str) -> Dict[str, Any]:
    if not text:
        raise ValueError("Empty response received")

    cleaned = re.sub(r"```json|```", "", text).strip()

    start = cleaned.find("{")
    end = cleaned.rfind("}")

    if start == -1 or end == -1:
        raise ValueError("No valid JSON object found")

    json_text = cleaned[start:end + 1]

    json_text = re.sub(r",\s*}", "}", json_text)
    json_text = re.sub(r",\s*]", "]", json_text)
    json_text = re.sub(r"[\x00-\x1F\x7F]", "", json_text)

    try:
        parsed = json.loads(json_text)
        if not isinstance(parsed, dict):
            raise ValueError("JSON root must be object")
        return parsed
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid JSON format: {e}")


def estimate_cost(input_tokens: int, output_tokens: int) -> float:
    input_cost = (input_tokens / 1_000_000) * 3
    output_cost = (output_tokens / 1_000_000) * 15
    return round(input_cost + output_cost, 6)