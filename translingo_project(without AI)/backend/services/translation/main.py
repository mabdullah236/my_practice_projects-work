from fastapi import APIRouter, Depends
from services.auth.utils import get_current_user
from services.auth.models import User

router = APIRouter()

@router.get("/dashboard/stats")
async def get_translation_stats(current_user: User = Depends(get_current_user)):
    # 1. Name Logic: Try first_name -> full_name -> email prefix
    # getattr use kiya taake agar field na ho to crash na kare
    display_name = getattr(current_user, "first_name", 
                   getattr(current_user, "full_name", 
                   current_user.email.split("@")[0]))

    # 2. Return Only Necessary Data (Lightweight)
    return {
        "name": display_name.title(), # Name capitalize kar k bhejega
        "total_projects": 0, # Yahan baad mein DB count laga lena
        "completed": 0
    }

@router.post("/create")
async def create_translation_project(current_user: User = Depends(get_current_user)):
    return {"message": "Project created (Pending Implementation)"}