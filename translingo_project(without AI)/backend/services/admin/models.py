from beanie import Document
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class TeamMember(Document):
    name: str
    role: str
    image_url: str  # URL to avatar image
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "team_members"

# API Request Schemas
class TeamMemberCreate(BaseModel):
    name: str
    role: str
    image_url: str = "https://ui-avatars.com/api/?background=random" 

class DashboardStats(BaseModel):
    total_users: int
    total_translations: int
    active_plans: dict
    revenue: float