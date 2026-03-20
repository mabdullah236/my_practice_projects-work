from fastapi import APIRouter, HTTPException, Depends
from typing import List
# CORRECTED IMPORTS (backend. hata diya) 👇
from services.admin.models import TeamMember, TeamMemberCreate, DashboardStats
from services.auth.models import User

# Admin Routes
router = APIRouter()

# --- PUBLIC ROUTES (About Page k liye) ---
@router.get("/team", response_model=List[TeamMember])
async def get_team_members():
    return await TeamMember.find_all().to_list()

# --- ADMIN ONLY ROUTES ---

@router.post("/team")
async def add_team_member(member: TeamMemberCreate):
    new_member = TeamMember(
        name=member.name,
        role=member.role,
        image_url=member.image_url
    )
    await new_member.create()
    return new_member

@router.delete("/team/{member_id}")
async def delete_team_member(member_id: str):
    member = await TeamMember.get(member_id)
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    await member.delete()
    return {"message": "Deleted successfully"}

@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats():
    # Real calculations based on DB
    user_count = await User.count()
    
    # Mock Data for Graph (Abhi Translations DB me save ni ho rhi, is liye dummy)
    return DashboardStats(
        total_users=user_count,
        total_translations=12540,
        active_plans={"Free": 80, "Pro": 15, "Business": 5},
        revenue=2450.00
    )