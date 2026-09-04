from fastapi import APIRouter, Depends, HTTPException, Security
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
import models
import security
from uuid import uuid4

router = APIRouter(
    prefix="/api-billing",
    tags=["API Billing & Management"]
)

class KeyCreateRequest(BaseModel):
    user_id: str
    initial_credits: int
    service_tier: str = "basic"

@router.post("/generate-key")
def generate_api_key(
    req: KeyCreateRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(security.get_current_user)
):
    """
    Called by PHP backend when a user purchases credits.
    Requires an admin user (or system master key).
    """
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Only Master Admin can generate API keys")
        
    # Generate secure sk-samai key
    new_key_code = f"sk-samai-{uuid4().hex}"
    
    db_key = models.AccessKey(
        key_code=new_key_code,
        api_credit_balance=req.initial_credits,
        service_tier=req.service_tier,
        user_id=req.user_id,
        key_type="api_key",
        max_uses=0
    )
    db.add(db_key)
    db.commit()
    db.refresh(db_key)
    
    return {
        "api_key": new_key_code,
        "credits": db_key.api_credit_balance,
        "user_id": db_key.user_id
    }

@router.get("/balance")
def get_balance(
    db: Session = Depends(get_db),
    current_user: dict = Depends(security.get_current_user),
    api_key: str = Security(security.OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False))
):
    """Check remaining API credits"""
    key = db.query(models.AccessKey).filter(models.AccessKey.key_code == api_key).first()
    if not key:
        raise HTTPException(status_code=404, detail="Key not found")
        
    return {
        "api_key": key.key_code,
        "balance": key.api_credit_balance,
        "tier": key.service_tier
    }
