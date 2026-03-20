import os
import smtplib # Real Email k liye
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from typing import Union, Any
from jose import jwt 
import jwt as pyjwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from services.auth.models import User 

# --- CONFIGURATION ---
SECRET_KEY = "YOUR_SUPER_SECRET_KEY_CHANGE_ME" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# --- PASSWORD UTILS ---
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# --- OTP UTILS ---
def generate_otp():
    import random
    return str(random.randint(100000, 999999))

# --- TOKEN UTILS ---
def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({"exp": expire})
    encoded_jwt = pyjwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# --- EMAIL UTILS (REAL SMTP) ---

async def send_verification_email(email_to: str, otp: str):
    """
    Sends OTP via Real Email using SMTP.
    """
    html_content = f"""
    <html>
        <body>
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Email Verification</h2>
                <p>Your verification code is:</p>
                <h1 style="color: #2563EB; letter-spacing: 5px;">{otp}</h1>
                <p>This code will expire in 5 minutes.</p>
            </div>
        </body>
    </html>
    """
    # Reusing the utility function
    await send_email_utility(email_to, html_content)
    return True

async def send_email_utility(email_to: str, body_html: str):
    """
    Sends Real Email using credentials from .env
    """
    try:
        # 1. Load Credentials from Environment
        sender_email = os.getenv("MAIL_USERNAME")
        sender_password = os.getenv("MAIL_PASSWORD")
        smtp_server = os.getenv("MAIL_SERVER", "smtp.gmail.com")
        smtp_port = int(os.getenv("MAIL_PORT", 587))

        if not sender_email or not sender_password:
            print("[WARNING] Email credentials missing in .env. Printing to console:")
            print(body_html)
            return False

        # 2. Prepare Message
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = email_to
        msg['Subject'] = "Security Notification" # Subject change kr skty ho context k hisab se

        msg.attach(MIMEText(body_html, 'html'))

        # 3. Connect & Send
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        text = msg.as_string()
        server.sendmail(sender_email, email_to, text)
        server.quit()
        
        print(f"[SUCCESS] Email sent to {email_to}")
        return True

    except Exception as e:
        print(f"[ERROR] Failed to send email: {e}")
        return False

# --- DEPENDENCIES ---
async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = pyjwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub") or payload.get("email")
        if email is None:
            raise credentials_exception
    except pyjwt.PyJWTError:
        raise credentials_exception
        
    user = await User.find_one({"email": email})
    if user is None:
        raise credentials_exception
    return user