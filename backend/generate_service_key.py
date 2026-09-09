"""
SAM AI - API Key Generation Utility

Run this script to generate service API keys for standalone PHP service sites.
Keys are hashed and stored in the database; only the raw key is shown once.

Usage:
    python generate_service_key.py <service_slug> <credits_granted> <description>

Example:
    python generate_service_key.py newsflash-pro 1000 "NewsFlash Pro service key"
"""

import sys
import os
import uuid
import hashlib

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal
import models


def hash_api_key(api_key: str) -> str:
    salt = os.getenv("API_KEY_SALT", "sam-ai-salt-v1")
    return hashlib.sha256(f"{salt}:{api_key}".encode()).hexdigest()


def generate_service_key(service_slug: str, credits_granted: int = 1000, description: str = None):
    """Generate a new service API key and store it in the database."""
    db = SessionLocal()

    try:
        # Generate raw key
        raw_key = f"sk-samai-{uuid.uuid4().hex[:16]}-{uuid.uuid4().hex[:16]}"
        key_hash = hash_api_key(raw_key)
        key_prefix = raw_key[:16]

        # Check if service already has a key
        existing = db.query(models.ServiceAPIKey).filter(
            models.ServiceAPIKey.service_name == service_slug
        ).first()

        if existing and existing.status == 'active':
            print(f"WARNING: Service '{service_slug}' already has an active key.")
            print(f"Revoking old key...")
            existing.status = 'revoked'
            existing.revoked_at = __import__("datetime").datetime.utcnow()
            db.commit()

        new_key = models.ServiceAPIKey(
            service_name=service_slug.replace("-", " ").title(),
            api_key_hash=key_hash,
            credits_granted=credits_granted,
            status="active",
        )
        db.add(new_key)
        db.commit()

        print(f"\n{'='*60}")
        print(f"Service API Key Generated Successfully")
        print(f"{'='*60}")
        print(f"  Service Slug:    {service_slug}")
        print(f"  Service Name:    {new_key.service_name}")
        print(f"  API Key:         {raw_key}")
        print(f"  API Key Prefix:  {key_prefix}")
        print(f"  Credits Granted: {credits_granted}")
        print(f"{'='*60}")
        print(f"\nIMPORTANT: Store this key securely. It will not be shown again.")
        print(f"Add this to your PHP site's config.php as the API key.\n")

        return raw_key

    finally:
        db.close()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate_service_key.py <service_slug> [credits] [description]")
        print("\nExample: python generate_service_key.py newsflash-pro 1000 'NewsFlash Pro key'")
        print("\nAvailable services can be found in samai-projects/api_registry.json")
        sys.exit(1)

    slug = sys.argv[1]
    credits = int(sys.argv[2]) if len(sys.argv) > 2 else 1000
    desc = sys.argv[3] if len(sys.argv) > 3 else None

    generate_service_key(slug, credits, desc)
