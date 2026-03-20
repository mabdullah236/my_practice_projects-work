from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel
from datetime import datetime, timedelta
import uuid
import jwt # PyJWT

# --- IMPORTS ---
from services.auth.models import (
    User, PendingRegistration, UserSignup, VerifyOTP, 
    PasswordResetSession, ResetRequest, SendResetOTP, 
    VerifyResetOTP, CompleteReset, OTPLimit, UpdateProfileRequest
)
from services.auth.utils import (
    verify_password, create_access_token, get_password_hash, 
    generate_otp, send_verification_email, get_current_user, 
    send_email_utility, SECRET_KEY, ALGORITHM
)

router = APIRouter()

# --- HELPER: CHECK DAILY LIMIT ---
async def check_and_increment_otp(email: str):
    today_str = datetime.utcnow().strftime("%Y-%m-%d")
    record = await OTPLimit.find_one({"email": email})
    
    if not record or record.date != today_str:
        if record: await record.delete()
        new_record = OTPLimit(email=email, attempt_count=1, date=today_str) 
        await new_record.create()
        return 3
    if record.attempt_count >= 4:
        raise HTTPException(status_code=429, detail="Too many verification attempts.")
    record.attempt_count += 1
    await record.save()
    return 4 - record.attempt_count

# ================= LOGIN =================
class LoginRequest(BaseModel):
    email: str
    password: str

class AdminResetRequest(BaseModel):
    token: str
    new_password: str
    
@router.post("/login")
async def login(data: LoginRequest): 
    user = await User.find_one({"email": data.email})
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    access_token = create_access_token(data={"sub": str(user.id), "email": user.email})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {"email": user.email, "role": user.role, "first_name": user.first_name, "last_name": user.last_name, "avatar": user.avatar}
    }

# ================= FORGOT PASSWORD (OTP) =================
@router.post("/forgot-password/find")
async def find_account(data: ResetRequest):
    user = await User.find_one({"email": data.email})
    if not user:
        return {"found": True, "masked_phone": "No Phone Linked", "has_phone": False}
    masked_phone = "No Phone Linked"
    has_phone = False
    if hasattr(user, 'phone_number') and user.phone_number:
        phone = user.phone_number
        if len(phone) > 6: masked_phone = phone[:3] + "*******" + phone[-3:]
        else: masked_phone = phone
        has_phone = True
    return {"found": True, "masked_phone": masked_phone, "has_phone": has_phone}

@router.post("/forgot-password/send-otp")
async def send_reset_otp(data: SendResetOTP):
    remaining = await check_and_increment_otp(data.email)
    user = await User.find_one({"email": data.email})
    if not user: return {"message": f"OTP sent", "remaining": remaining}

    otp = generate_otp()
    await PasswordResetSession.find({"email": data.email}).delete()
    session = PasswordResetSession(email=data.email, otp=otp, reset_token="", expires_at=datetime.utcnow() + timedelta(minutes=5))
    await session.create()

    if data.method == "email": await send_verification_email(data.email, otp)
    elif data.method == "phone": print(f"\n[SMS] OTP {otp} to User Phone\n")
    return {"message": "OTP sent", "remaining": remaining}

@router.post("/forgot-password/verify")
async def verify_reset_otp(data: VerifyResetOTP):
    session = await PasswordResetSession.find_one({"email": data.email})
    if not session or session.otp != data.otp:
        raise HTTPException(status_code=400, detail="The code could not be verified.")
    reset_token = str(uuid.uuid4())
    session.reset_token = reset_token
    await session.save()
    return {"message": "Verified", "reset_token": reset_token}

@router.post("/forgot-password/reset")
async def complete_reset(data: CompleteReset):
    session = await PasswordResetSession.find_one({"email": data.email, "reset_token": data.reset_token})
    if not session: raise HTTPException(status_code=401, detail="Unauthorized Request.")
    user = await User.find_one({"email": data.email})
    if verify_password(data.new_password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Please choose a different password.")
    user.hashed_password = get_password_hash(data.new_password)
    await user.save()
    await session.delete()
    return {"message": "Password Reset Successfully."}

# ================= LINK SYSTEM (FIXED ROUTES) =================

# 1. SEND LINK
@router.post("/forgot-password/send-link")
async def send_reset_link_system(data: ResetRequest):
    user = await User.find_one({"email": data.email})
    if not user: return {"message": "If an account exists, a reset link has been sent."}

    # 5 MINUTE EXPIRY
    reset_token = create_access_token(
        data={"sub": user.email, "type": "reset_link"}, 
        expires_delta=timedelta(minutes=5)
    )

    reset_link = f"http://localhost:5173/reset-password-verify?token={reset_token}"
    email_body = f"""
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Password Reset Request</h2>
        <p>Click below to reset your password. This link expires in 5 minutes.</p>
        <a href="{reset_link}" style="background-color: #2563EB; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
    </div>
    """
    await send_email_utility(user.email, email_body)
    return {"message": "Link sent."}

# 2. VERIFY TOKEN (Simple Route)
@router.post("/verify-reset-token")
async def verify_link_token_only(data: dict):
    token = data.get("token")
    if not token: raise HTTPException(status_code=400, detail="Token missing")
    try:
        jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"valid": True}
    except Exception:
        raise HTTPException(status_code=400, detail="Link expired")

# 3. RESET PASSWORD (Simple Route)
@router.post("/reset-password-via-link")
async def reset_password_via_link(data: AdminResetRequest):
    try:
        payload = jwt.decode(data.token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub") or payload.get("email")
    except Exception:
        raise HTTPException(status_code=400, detail="Link expired or invalid")

    user = await User.find_one({"email": email})
    if not user: raise HTTPException(status_code=404, detail="User not found")

    if verify_password(data.new_password, user.hashed_password):
        raise HTTPException(status_code=400, detail="New password cannot be the same as the old password.")

    user.hashed_password = get_password_hash(data.new_password)
    await user.save()
    return {"message": "Password updated successfully"}

# ================= SIGNUP/PROFILE =================
@router.post("/signup")
async def signup(data: UserSignup):
    if await User.find_one({"email": data.email}): raise HTTPException(status_code=400, detail="Account already exist")
    hashed_pwd = get_password_hash(data.password)
    otp = generate_otp()
    existing_pending = await PendingRegistration.find_one({"email": data.email})
    if existing_pending: await existing_pending.delete()
    pending_user = PendingRegistration(email=data.email, otp=otp, user_data={"email": data.email, "first_name": data.first_name, "last_name": data.last_name, "role": data.role, "hashed_password": hashed_pwd})
    await pending_user.create()
    try: await send_verification_email(data.email, otp)
    except Exception: raise HTTPException(status_code=500, detail="Failed to send email.")
    return {"message": "Verification code sent"}

@router.post("/verify")
async def verify_email(data: VerifyOTP):
    record = await PendingRegistration.find_one({"email": data.email})
    if not record or record.otp != data.otp: raise HTTPException(status_code=400, detail="Invalid code.")
    new_user = User(**record.user_data)
    await new_user.create()
    await record.delete()
    return {"message": "Email verified!"}

@router.get("/me")
async def get_my_profile(current_user: User = Depends(get_current_user)):
    return {"id": str(current_user.id), "email": current_user.email, "first_name": current_user.first_name, "last_name": current_user.last_name, "avatar": current_user.avatar}

@router.put("/update-profile")
async def update_profile_avatar(data: UpdateProfileRequest, current_user: User = Depends(get_current_user)):
    current_user.avatar = data.avatar
    await current_user.save()
    return {"message": "Updated"}