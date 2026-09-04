"""
SAM AI - API Key Authentication Middleware

Validates service API keys sent via x-api-key header.
Each standalone PHP site (newsflash.ai, samm.com, etc.) gets a unique
service API key that identifies it to the central API.

Also validates user JWT tokens for user-scoped operations.
"""

import os
import hashlib
import hmac
from typing import Dict, Any, Optional
from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from database import SessionLocal
import models


class APIKeyAuthMiddleware:
    """Middleware to validate service API keys from x-api-key header."""

    def __init__(self):
        self._service_cache: Dict[str, dict] = {}

    def _hash_key(self, api_key: str) -> str:
        salt = os.getenv("API_KEY_SALT", "sam-ai-salt-v1")
        return hashlib.sha256(f"{salt}:{api_key}".encode()).hexdigest()

    def validate_service_key(self, api_key: str) -> dict:
        """Validate a service API key and return service info."""
        if not api_key:
            raise HTTPException(status_code=401, detail="Missing x-api-key header")

        key_hash = self._hash_key(api_key)

        db = SessionLocal()
        try:
            service_record = db.query(models.ServiceAPIKey).filter(
                models.ServiceAPIKey.api_key_hash == key_hash,
                models.ServiceAPIKey.is_active == True
            ).first()

            if not service_record:
                raise HTTPException(status_code=401, detail="Invalid API key")

            service_info = {
                "service_name": service_record.service_name,
                "service_slug": service_record.service_slug,
                "credits_balance": service_record.credits_balance,
                "is_active": service_record.is_active,
            }

            return service_info
        finally:
            db.close()

    def validate_service_key_no_db(self, api_key: str) -> dict:
        """Validate service API key without database (from cache/env)."""
        if not api_key:
            raise HTTPException(status_code=401, detail="Missing x-api-key header")

        key_hash = self._hash_key(api_key)
        cached = self._service_cache.get(key_hash)

        if cached:
            return cached

        raise HTTPException(status_code=401, detail="Invalid API key")


# FastAPI dependency for API key validation
security = HTTPBearer(auto_error=False)
api_key_auth = APIKeyAuthMiddleware()


def get_api_key(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> dict:
    """
    Extract and validate the service API key from x-api-key header.
    Also optionally validates JWT from Authorization header.
    """
    api_key = request.headers.get("x-api-key")
    if not api_key:
        raise HTTPException(status_code=401, detail="Missing x-api-key header")

    service_info = api_key_auth.validate_service_key(api_key)

    request.state.service_info = service_info
    request.state.service_name = service_info["service_name"]
    request.state.api_key_hash = api_key_auth._hash_key(api_key)

    return service_info


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> Optional[dict]:
    """
    Extract and validate JWT token from Authorization header.
    Returns user info if valid, None if no token.
    """
    if not credentials:
        return None

    from backend.security_ext.refresh_tokens import token_manager

    try:
        payload = token_manager.decode_token(credentials.credentials)
        return {
            "user_id": payload.get("user_id"),
            "email": payload.get("email"),
            "role": payload.get("role", "user"),
        }
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


def require_service_and_user(
    service: dict = Depends(get_api_key),
    user: Optional[dict] = Depends(get_current_user)
) -> dict:
    """
    Dependency that requires both a valid service API key and user JWT.
    Used for user-scoped operations.
    """
    if not user:
        raise HTTPException(
            status_code=401,
            detail="User authentication required. Send Authorization: Bearer <jwt>"
        )
    return {"service": service, "user": user}
