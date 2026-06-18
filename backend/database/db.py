import os
from pathlib import Path
from typing import Dict, Any, Optional, List
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def save_project(user_id: str, title: str, idea: str) -> str:
    result = supabase.table("projects").insert({
        "user_id": user_id,
        "title": title,
        "idea_text": idea
    }).execute()
    return result.data[0]["id"]

def save_specification(project_id: str, spec_data: Dict[str, Any]) -> None:
    supabase.table("specifications").insert({
        "project_id": project_id,
        "business_analysis": spec_data.get("business_analysis"),
        "dev_concerns": spec_data.get("dev_concerns"),
        "qa_concerns": spec_data.get("qa_concerns"),
        "security_concerns": spec_data.get("security_concerns"),
        "ux_concerns": spec_data.get("ux_concerns"),
        "final_spec": spec_data.get("final_spec"),
    }).execute()