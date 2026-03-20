from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from typing import List
import os
import traceback  # <--- Added for better error tracking
from dotenv import load_dotenv

# --- IMPORTS ---
# Auth Imports
from services.auth.models import (
    User, 
    PendingRegistration, 
    PasswordResetSession, 
    OTPLimit 
    # Note: UpdateProfileRequest yahan nahi hona chahiye, wo DB table nahi hai
)
from services.auth.main import router as auth_router

# Admin Imports
from services.admin.models import TeamMember
from services.admin.main import router as admin_router

# Translation Imports
from services.translation.main import router as translation_router

# --- DATA LOADING STRATEGY ---
try:
    import pytz
    import pycountry
    USING_LIBRARIES = True
    print("[INFO] Libraries loaded successfully: pytz, pycountry")
except ImportError as e:
    USING_LIBRARIES = False
    print(f"[WARN] Libraries not found ({e}). Using Backup Data.")

# Environment Variables
load_dotenv()

app = FastAPI(title="TransLingo Gateway")

# --- CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Frontend URL yahan allow ho raha hai
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- DATABASE CONNECTION ---
@app.on_event("startup")
async def app_init():
    mongo_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017/translingo_db")
    
    try:
        db_client = AsyncIOMotorClient(mongo_url)
        
        # Beanie Initialization
        await init_beanie(
            database=db_client.translingo_db, 
            document_models=[
                User, 
                PendingRegistration, 
                PasswordResetSession, 
                OTPLimit, 
                TeamMember
            ]
        )
        print(f"[INFO] Connected to MongoDB at {mongo_url}")
        print("[INFO] Database Models Initialized: User, PendingRegistration, OTPLimit, TeamMember")
        
    except Exception as e:
        # Detailed Error Printing
        print(f"[ERROR] Failed to connect to MongoDB: {e}")
        traceback.print_exc() # <--- Yeh asli error dikhayega console mein

# --- REGISTER ROUTES ---
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(admin_router, prefix="/api/v1/admin", tags=["Admin"])
app.include_router(translation_router, prefix="/api/v1/translation", tags=["Translation"])


# --- UTILS (Backup Data) ---
BACKUP_COUNTRIES = ["United States", "Pakistan", "India", "United Kingdom", "Canada"]
BACKUP_LANGUAGES = ["English", "Urdu", "Arabic", "Spanish"]

@app.get("/")
def root():
    return {"message": "TransLingo Gateway is Running", "library_mode": USING_LIBRARIES}

@app.get("/api/v1/utils/countries", response_model=List[str])
def get_countries():
    data = []
    if USING_LIBRARIES:
        try:
            data = [country.name for country in pycountry.countries]
        except: pass
    return sorted(list(set(data + BACKUP_COUNTRIES)))

@app.get("/api/v1/utils/languages", response_model=List[str])
def get_languages():
    return BACKUP_LANGUAGES