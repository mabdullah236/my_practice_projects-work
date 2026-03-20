from beanie import Document
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Translation(Document):
    user_email: str
    original_text: str
    translated_text: str
    source_lang: str
    target_lang: str
    status: str = "Completed"
    created_at: datetime = datetime.utcnow()

    class Settings:
        name = "translations"