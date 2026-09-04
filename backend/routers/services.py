"""
SAM AI - Service Management API Routes

Endpoints for:
- Catalog of all available services
- Service API key generation (admin)
- Credit balance checking
- Service-specific endpoint listing
- Billing and subscription management
"""

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import HTTPBearer
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
import uuid
import hashlib
import os
import json

from database import SessionLocal, get_db
from models import ServiceAPIKey, UserCredits, CreditTransaction, ServiceSubscription, AccessKey
from middleware.api_key_auth import get_api_key, get_current_user, api_key_auth

router = APIRouter(prefix="/api/services", tags=["services"])


class ServiceInfo(BaseModel):
    service_name: str
    service_slug: str
    description: str
    endpoint_prefix: str
    cost_tier: str
    theme_color: str
    endpoints: List[dict]


class CreditBalanceResponse(BaseModel):
    user_id: str
    service_name: str
    balance: int
    total_purchased: int
    total_used: int


class APIKeyResponse(BaseModel):
    service_name: str
    service_slug: str
    api_key: str
    api_key_prefix: str
    credits_balance: int


# Load service registry
REGISTRY_PATH = os.path.join(os.path.dirname(__file__), "..", "samai-projects", "api_registry.json")


def load_registry() -> dict:
    try:
        with open(REGISTRY_PATH, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return {"services": {}}


def hash_api_key(api_key: str) -> str:
    salt = os.getenv("API_KEY_SALT", "sam-ai-salt-v1")
    return hashlib.sha256(f"{salt}:{api_key}".encode()).hexdigest()


@router.get("/catalog", response_model=List[ServiceInfo])
def get_service_catalog():
    """Public endpoint: returns catalog of all available services."""
    registry = load_registry()
    services = []
    for key, info in registry.get("services", {}).items():
        services.append(ServiceInfo(
            service_name=info["service_name"],
            service_slug=info["service_slug"],
            description=info["description"],
            endpoint_prefix=info["endpoint_prefix"],
            cost_tier=info["cost_tier"],
            theme_color=info["theme_color"],
            endpoints=info.get("endpoints", []),
        ))
    return services


@router.get("/catalog/{service_slug}", response_model=ServiceInfo)
def get_service_info(service_slug: str):
    """Public endpoint: returns info for a specific service."""
    registry = load_registry()
    for key, info in registry.get("services", {}).items():
        if info["service_slug"] == service_slug:
            return ServiceInfo(
                service_name=info["service_name"],
                service_slug=info["service_slug"],
                description=info["description"],
                endpoint_prefix=info["endpoint_prefix"],
                cost_tier=info["cost_tier"],
                theme_color=info["theme_color"],
                endpoints=info.get("endpoints", []),
            )
    raise HTTPException(status_code=404, detail="Service not found")


@router.get("/credits/balance", response_model=CreditBalanceResponse)
def get_credit_balance(
    request: Request,
    service: dict = Depends(get_api_key),
    user: dict = Depends(get_current_user),
):
    """Get user's credit balance for a specific service."""
    db = SessionLocal()
    try:
        credits = db.query(UserCredits).filter(
            UserCredits.user_id == user["user_id"],
            UserCredits.service_name == service["service_name"],
        ).first()

        if not credits:
            return CreditBalanceResponse(
                user_id=user["user_id"],
                service_name=service["service_name"],
                balance=0,
                total_purchased=0,
                total_used=0,
            )

        return CreditBalanceResponse(
            user_id=credits.user_id,
            service_name=credits.service_name,
            balance=credits.balance,
            total_purchased=credits.total_purchased,
            total_used=credits.total_used,
        )
    finally:
        db.close()


@router.get("/credits/history")
def get_credit_history(
    request: Request,
    service: dict = Depends(get_api_key),
    user: dict = Depends(get_current_user),
    limit: int = 50,
):
    """Get user's credit transaction history."""
    db = SessionLocal()
    try:
        transactions = db.query(CreditTransaction).filter(
            CreditTransaction.user_id == user["user_id"],
            CreditTransaction.service_name == service["service_name"],
        ).order_by(CreditTransaction.created_at.desc()).limit(limit).all()

        return {
            "transactions": [
                {
                    "id": t.id,
                    "amount": t.amount,
                    "credits_used": t.credits_used,
                    "credits_before": t.credits_before,
                    "credits_after": t.credits_after,
                    "endpoint": t.endpoint,
                    "status": t.status,
                    "created_at": t.created_at.isoformat() if t.created_at else None,
                }
                for t in transactions
            ]
        }
    finally:
        db.close()


@router.post("/keys/generate", response_model=APIKeyResponse)
def generate_service_key(
    service_slug: str,
    description: Optional[str] = None,
    credits_granted: int = 1000,
    admin: dict = Depends(get_current_user),
):
    """Admin endpoint: generate a new API key for a standalone service."""
    if admin.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    db = SessionLocal()
    try:
        # Generate a secure API key
        raw_key = f"sk-samai-{uuid.uuid4().hex[:16]}-{uuid.uuid4().hex[:16]}"
        key_hash = hash_api_key(raw_key)
        key_prefix = raw_key[:16]

        # Get service name from registry
        registry = load_registry()
        service_name_from_registry = service_slug
        for key, info in registry.get("services", {}).items():
            if info["service_slug"] == service_slug:
                service_name_from_registry = info["service_name"]
                break

        new_key = ServiceAPIKey(
            service_name=service_name_from_registry,
            service_slug=service_slug,
            api_key_hash=key_hash,
            api_key_prefix=key_prefix,
            credits_balance=credits_granted,
            is_active=True,
            description=description,
            created_by=admin["user_id"],
        )
        db.add(new_key)
        db.commit()
        db.refresh(new_key)

        return APIKeyResponse(
            service_name=new_key.service_name,
            service_slug=new_key.service_slug,
            api_key=raw_key,
            api_key_prefix=key_prefix,
            credits_balance=new_key.credits_balance,
        )
    finally:
        db.close()


@router.post("/credits/purchase")
def purchase_credits(
    request: Request,
    service: dict = Depends(get_api_key),
    user: dict = Depends(get_current_user),
    credit_pack: int = 120,  # must match a valid pack
):
    """Purchase credits (calls Stripe/PayHere internally)."""
    db = SessionLocal()
    try:
        # Find or create user credits record
        credits = db.query(UserCredits).filter(
            UserCredits.user_id == user["user_id"],
            UserCredits.service_name == service["service_name"],
        ).first()

        if not credits:
            credits = UserCredits(
                user_id=user["user_id"],
                service_name=service["service_name"],
                balance=0,
                total_purchased=0,
                total_used=0,
            )
            db.add(credits)
            db.flush()

        # Add credits
        credits.balance += credit_pack
        credits.total_purchased += credit_pack
        credits.last_purchase_at = datetime.utcnow()

        # Log transaction
        transaction = CreditTransaction(
            user_id=user["user_id"],
            service_name=service["service_name"],
            credits_used=0,
            credits_before=credits.balance - credit_pack,
            credits_after=credits.balance,
            amount=credit_pack,
            status="purchase_pending",
            reference_id=f"pack_{credit_pack}",
        )
        db.add(transaction)
        db.commit()

        return {
            "status": "success",
            "message": f"Added {credit_pack} credits to your account",
            "new_balance": credits.balance,
            "checkout_url": f"/pay/stripe?pack={credit_pack}&service={service['service_name']}",
        }
    finally:
        db.close()


@router.get("/credits/packs")
def get_credit_packs():
    """Public endpoint: get available credit packs."""
    return {
        "packs": [
            {"credits": 50, "price_usd": 5, "price_lk": 1500, "bonus": 0},
            {"credits": 120, "price_usd": 10, "price_lk": 3000, "bonus": 10},
            {"credits": 350, "price_usd": 25, "price_lk": 7500, "bonus": 50},
            {"credits": 800, "price_usd": 55, "price_lk": 16500, "bonus": 150},
            {"credits": 1800, "price_usd": 100, "price_lk": 30000, "bonus": 400},
        ]
    }


@router.get("/usage/stats")
def get_usage_stats(
    request: Request,
    service: dict = Depends(get_api_key),
    user: dict = Depends(get_current_user),
):
    """Get usage statistics for the current user on a service."""
    db = SessionLocal()
    try:
        from sqlalchemy import func, extract
        from datetime import datetime, timedelta

        now = datetime.utcnow()
        week_ago = now - timedelta(days=7)

        total_requests = db.query(
            func.count(CreditTransaction.id)
        ).filter(
            CreditTransaction.user_id == user["user_id"],
            CreditTransaction.service_name == service["service_name"],
            CreditTransaction.created_at >= week_ago,
        ).scalar()

        total_credits_used = db.query(
            func.sum(CreditTransaction.credits_used)
        ).filter(
            CreditTransaction.user_id == user["user_id"],
            CreditTransaction.service_name == service["service_name"],
            CreditTransaction.created_at >= week_ago,
        ).scalar() or 0

        return {
            "period": "last_7_days",
            "requests": total_requests,
            "credits_used": total_credits_used,
            "service": service["service_name"],
        }
    finally:
        db.close()
