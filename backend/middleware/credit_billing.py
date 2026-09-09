"""
SAM AI - Credit Billing Middleware

Deducts credits from user accounts after successful API responses.
Returns 402 Payment Required when credits are insufficient.
"""

import time
import json
import re
from typing import Dict, Any, Optional
from fastapi import Request, HTTPException, Response
from fastapi.routing import APIRoute
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from database import SessionLocal
import models


class CreditBillingMiddleware(BaseHTTPMiddleware):
    """
    Middleware that:
    1. Checks user credit balance before processing (returns 402 if insufficient)
    2. Deducts credits after successful response based on endpoint cost tier
    3. Logs the transaction
    """

    # Endpoint cost mapping (credits per call)
    # Format: { "regex_pattern": cost }
    ENDPOINT_COSTS = {
        # Chat - FREE
        r"^/api/chat$": 0,
        r"^/api/chat/completions$": 1,  # general chat costs 1
        r"^/api/chat/team$": 1,

        # Coding - PREMIUM
        r"^/api/coding/generate$": 5,
        r"^/api/coding/review$": 3,
        r"^/api/coding/fix$": 4,
        r"^/api/coding/explain$": 3,
        r"^/api/flutter/generate$": 5,
        r"^/api/flutter/refactor$": 4,

        # Image - PREMIUM
        r"^/api/image/generate$": 5,
        r"^/api/image/quick$": 5,
        r"^/api/image/advanced$": 8,
        r"^/api/image/analyze$": 3,
        r"^/api/image/edit$": 4,

        # Voice - PREMIUM / STANDARD
        r"^/api/voice/tts$": 2,
        r"^/api/voice/stt$": 2,
        r"^/api/voice/podcast$": 4,
        r"^/api/voice/transcribe$": 2,

        # Video - PREMIUM
        r"^/api/media/video/generate$": 10,
        r"^/api/media/video/produce$": 10,
        r"^/api/media/video/edit$": 8,
        r"^/api/media/video/analyze$": 5,
        r"^/api/media/video/youtube$": 8,

        # Documents - STANDARD
        r"^/api/pdf-studio/extract$": 2,
        r"^/api/pdf-studio/summarize$": 3,
        r"^/api/pdf-studio/translate$": 4,
        r"^/api/pdf-studio/edit$": 3,
        r"^/api/document/extract$": 2,
        r"^/api/translate/text$": 1,
        r"^/api/translate/document$": 3,

        # Social / News - STANDARD
        r"^/api/social-news/generate-post$": 2,
        r"^/api/social-news/schedule$": 1,
        r"^/api/social-news/trending$": 1,
        r"^/api/social-news/flash$": 2,
        r"^/api/social/queue$": 1,
        r"^/api/social/schedule$": 2,

        # Crypto - STANDARD / PREMIUM
        r"^/api/crypto/market$": 1,
        r"^/api/crypto/news$": 1,
        r"^/api/crypto/analyze$": 3,
        r"^/api/crypto/signal$": 5,
        r"^/api/crypto/portfolio$": 3,

        # Research - PREMIUM
        r"^/api/research/analyze$": 5,
        r"^/api/research/write$": 6,
        r"^/api/research/ar18$": 3,

        # Business - PREMIUM
        r"^/api/business/market-analysis$": 8,
        r"^/api/business/finance-plan$": 6,
        r"^/api/business/report$": 5,

        # SEO - PREMIUM
        r"^/api/seo/analyze$": 3,
        r"^/api/seo/keywords$": 2,
        r"^/api/seo/content$": 2,

        # Knowledge - STANDARD
        r"^/api/knowledge/search$": 1,
        r"^/api/knowledge/add$": 1,
        r"^/api/knowledge/internal$": 2,

        # Education - STANDARD
        r"^/api/learning/explain$": 2,
        r"^/api/learning/quiz$": 1,
        r"^/api/learning/tutor$": 3,
        r"^/api/learning/cues$": 1,

        # Lead Gen - PREMIUM
        r"^/api/leads/find$": 5,
        r"^/api/leads/scrape$": 3,

        # Astrology - STANDARD / PREMIUM
        r"^/api/astrology/birth-chart$": 3,
        r"^/api/astrology/horoscope$": 1,
        r"^/api/astrology/dasha$": 2,
        r"^/api/astrology/full-chart$": 5,

        # Planning - STANDARD
        r"^/api/plan/decompose$": 2,
        r"^/api/plan/timeline$": 2,

        # Council / Agents - PREMIUM
        r"^/api/agents/council/debate$": 10,

        # Media / Editing - STANDARD / PREMIUM
        r"^/api/media/caption$": 1,
        r"^/api/media/resize$": 1,
        r"^/api/media/template$": 2,

        # Analytics - STANDARD
        r"^/api/analytics/analyze$": 3,
        r"^/api/analytics/generate$": 2,

        # Agent Tools - FREE / STANDARD
        r"^/api/tools/whois$": 0,
        r"^/api/tools/ping$": 0,
        r"^/api/tools/monitor$": 1,

        # Validation - STANDARD
        r"^/api/validation/check$": 1,

        # Telegram - FREE / STANDARD
        r"^/api/telegram/webhook$": 0,
        r"^/api/telegram/send$": 1,

        # Sports - STANDARD
        r"^/api/sports/scores$": 1,
        r"^/api/sports/analysis$": 3,
    }

    def _get_cost_for_path(self, path: str) -> int:
        for pattern, cost in self.ENDPOINT_COSTS.items():
            if re.match(pattern, path):
                return cost
        return 1  # default cost

    def _is_free_endpoint(self, path: str) -> bool:
        cost = self._get_cost_for_path(path)
        return cost == 0

    async def dispatch(self, request: Request, call_next):
        # Skip billing for health checks, docs, and webhook endpoints
        if request.url.path in ("/health", "/api/health", "/docs", "/redoc", "/openapi.json"):
            return await call_next(request)

        # Get service info from API key middleware (already validated)
        service_info = getattr(request.state, "service_info", None)
        user_info = getattr(request.state, "user_info", None)

        # Determine the cost
        cost = self._get_cost_for_path(request.url.path)

        # Skip credit deduction for service-to-service calls without user
        # (service keys have their own credit pool)
        if user_info:
            # Check user credit balance
            db = SessionLocal()
            try:
                user_credits = db.query(models.UserCredit).filter(
                    models.UserCredit.user_id == user_info["user_id"],
                    models.UserCredit.service_name == service_info["service_name"]
                ).first()

                if user_credits and user_credits.balance < cost:
                    # Log the failed attempt
                    transaction = models.CreditTransaction(
                        user_id=user_info["user_id"],
                        service_name=service_info["service_name"],
                        endpoint=request.url.path,
                        credits_used=0,
                        credits_before=user_credits.balance,
                        credits_after=user_credits.balance,
                        amount=-cost,
                        status="denied_insufficient_funds",
                        request_method=request.method,
                    )
                    db.add(transaction)
                    db.commit()

                    return JSONResponse(
                        status_code=402,
                        content={
                            "status": "error",
                            "error": "Payment Required",
                            "message": f"Insufficient credits. This call costs {cost} credit(s). "
                                       f"Current balance: {user_credits.balance} credits.",
                            "cost_required": cost,
                            "current_balance": user_credits.balance,
                            "purchase_url": "https://samai.com/pricing"
                        }
                    )
            finally:
                db.close()

        # Process the request
        response = await call_next(request)

        # Deduct credits after successful response (status 200)
        if response.status_code == 200 and cost > 0:
            db = SessionLocal()
            try:
                if user_info:
                    user_credits = db.query(models.UserCredit).filter(
                        models.UserCredit.user_id == user_info["user_id"],
                        models.UserCredit.service_name == service_info["service_name"]
                    ).first()

                    if user_credits:
                        user_credits.balance -= cost
                        db.commit()

                        transaction = models.CreditTransaction(
                            user_id=user_info["user_id"],
                            service_name=service_info["service_name"],
                            endpoint=request.url.path,
                            credits_used=cost,
                            credits_before=user_credits.balance + cost,
                            credits_after=user_credits.balance,
                            amount=-cost,
                            status="success",
                            request_method=request.method,
                        )
                        db.add(transaction)
                        db.commit()
            finally:
                db.close()

        return response


def get_endpoint_cost(path: str) -> int:
    """Helper function to get cost for an endpoint path."""
    middleware = CreditBillingMiddleware.__new__(CreditBillingMiddleware)
    return middleware._get_cost_for_path(path)
