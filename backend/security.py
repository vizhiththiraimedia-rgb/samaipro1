import os
import secrets
from datetime import datetime, timedelta
from typing import Optional
import bcrypt
import jwt
from dotenv import load_dotenv

load_dotenv()

IS_PRODUCTION = os.getenv("IS_PRODUCTION", "false").lower() == "true"

# JWT Settings
if IS_PRODUCTION:
    SECRET_KEY = os.environ["SECRET_KEY"]
else:
    SECRET_KEY = os.getenv("SECRET_KEY", secrets.token_urlsafe(32))

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15  # Zero-trust: short-lived access tokens

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against the hashed password"""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password: str) -> str:
    """Generate a bcrypt hash of the provided password"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status, Request
from jwt.exceptions import PyJWTError

# OAuth2 Scheme for Swagger UI and token extraction
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT Access Token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

if IS_PRODUCTION:
    SAM_MASTER_KEY = os.environ["SAM_MASTER_KEY"]
else:
    SAM_MASTER_KEY = os.getenv("SAM_MASTER_KEY", secrets.token_urlsafe(32))

def verify_master_key(provided_key: str) -> bool:
    """Verify system master admin key"""
    if not provided_key:
        return False
    return provided_key.strip() == SAM_MASTER_KEY.strip()

def get_current_user(
    request: Request,
    token: Optional[str] = Depends(OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False))
):
    """Secure authentication dependency supporting JWT tokens, API keys, and Master keys"""
    auth_header = request.headers.get("authorization")
    api_key_header = request.headers.get("x-api-key")
    
    extracted_token = token
    if not extracted_token and auth_header:
        if auth_header.lower().startswith("bearer "):
            extracted_token = auth_header[7:].strip()
        else:
            extracted_token = auth_header.strip()
            
    if not extracted_token and api_key_header:
        extracted_token = api_key_header.strip()
        
    if not extracted_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    # 1. System Master Admin Key (env-configured only, never hardcoded)
    if verify_master_key(extracted_token):
        return {"user_id": "admin_master", "role": "admin"}

    # 2. Dynamic Access Key (e.g. SAM-XXXX-XXXX or sk-samai-)
    if extracted_token.startswith("SAM-") or extracted_token.startswith("sk-samai-"):
        db = None
        try:
            from database import SessionLocal
            import models
            db = SessionLocal()
            key = db.query(models.AccessKey).filter(models.AccessKey.key_code == extracted_token).first()
            if key and key.status == "active":
                if not key.expires_at or key.expires_at > datetime.utcnow():
                    if key.max_uses == 0 or key.current_uses < key.max_uses:
                        key.current_uses += 1
                        db.commit()
                        return {"user_id": key.user_id or "key_user", "role": "staff"}
        except Exception:
            pass
        finally:
            if db is not None:
                db.close()

    # 3. Standard JWT Token
    try:
        payload = jwt.decode(extracted_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("user_id")
        role: str = payload.get("role")
        if user_id is None or role is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")
        return {"user_id": user_id, "role": role}
    except PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_optional_current_user(
    request: Request,
    token: Optional[str] = Depends(OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False))
):
    try:
        return get_current_user(request, token)
    except Exception:
        return None

def require_admin(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required")
    return current_user

def require_staff(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") not in ["admin", "staff"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Staff privileges required")
    return current_user




def require_api_credits(cost: int = 1):
    def dependency(request: Request, user: dict = Depends(get_current_user)):
        auth_header = request.headers.get("authorization")
        api_key_header = request.headers.get("x-api-key")
        
        extracted_token = api_key_header
        if not extracted_token and auth_header:
            if auth_header.lower().startswith("bearer "):
                extracted_token = auth_header[7:].strip()
            else:
                extracted_token = auth_header.strip()
                
        # System Master Admin bypasses billing (env-configured only)
        if verify_master_key(extracted_token):
            return user

        if extracted_token and extracted_token.startswith("sk-samai-"):
            from database import SessionLocal
            import models
            db = SessionLocal()
            key = db.query(models.AccessKey).filter(models.AccessKey.key_code == extracted_token).first()
            
            if not key or key.status != "active":
                db.close()
                raise HTTPException(status_code=401, detail="Invalid API Key")
                
            if key.api_credit_balance < cost:
                db.close()
                raise HTTPException(status_code=402, detail=f"Payment Required: Insufficient API Credits. Cost is {cost}, balance is {key.api_credit_balance}.")
                
            # Deduct credits
            key.api_credit_balance -= cost
            
            # Log usage
            usage_log = models.ApiUsageLog(
                key_id=key.id,
                endpoint=request.url.path,
                cost=cost,
                client_ip=request.client.host if request.client else "unknown"
            )
            db.add(usage_log)
            db.commit()
            db.close()
            return user
            
        # For legacy SAM- tokens or JWTs, allow for now or handle accordingly
        return user
    return dependency
