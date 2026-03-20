from beanie import Document
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Any, Dict
from datetime import datetime
# FIX: PyMongo se IndexModel import kiya hai taake crash na ho
from pymongo import IndexModel, ASCENDING

# --- 1. Main User Model ---
class User(Document):
    email: EmailStr
    hashed_password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    
    phone_number: Optional[str] = None
    avatar: Optional[str] = None
    role: str = "user"
    
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"
        # Simple Index
        indexes = [
            IndexModel([("email", ASCENDING)], unique=True)
        ]

# --- 2. Request Models ---
class UserSignup(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    phone: Optional[str] = None
    role: str = "user"

class VerifyOTP(BaseModel):
    email: EmailStr
    otp: str

class UpdateProfileRequest(BaseModel):
    avatar: str

# --- 3. Helper Models (DB Collections) ---
class PendingRegistration(Document):
    email: EmailStr
    otp: str
    user_data: Dict[str, Any]
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "pending_registrations"
        # FIX: Explicit IndexModel use kiya hai (Crash Proof)
        indexes = [
            IndexModel([("email", ASCENDING)]),
            IndexModel([("created_at", ASCENDING)], expireAfterSeconds=600) # 10 Mins Expiry
        ]

class PasswordResetSession(Document):
    email: EmailStr
    otp: str
    reset_token: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime

    class Settings:
        name = "password_resets"
        # FIX: Explicit IndexModel use kiya hai
        indexes = [
            IndexModel([("email", ASCENDING)]),
            IndexModel([("reset_token", ASCENDING)]),
            IndexModel([("expires_at", ASCENDING)], expireAfterSeconds=0) # Auto Delete when expired
        ]

class OTPLimit(Document):
    email: str
    attempt_count: int = 0
    date: str 

    class Settings:
        name = "otp_limits"
        indexes = [
            IndexModel([("email", ASCENDING)])
        ]

# --- Forgot Password Request Models ---
class ResetRequest(BaseModel):
    email: str

class SendResetOTP(BaseModel):
    email: str
    method: str

class VerifyResetOTP(BaseModel):
    email: str
    otp: str

class CompleteReset(BaseModel):
    email: str
    reset_token: str
    new_password: str