"""
SAM AI - Main API Entry Point (Production)

Consolidates all routers, middleware, and security into a single FastAPI app.
Deployed via passenger_wsgi.py on cPanel (Python 3.12 + Passenger).

This is the production API that all standalone PHP service sites connect to.
"""

import os
import sys

# Ensure backend is in path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import logging

from database import SessionLocal, engine
import models

# Import middleware
from middleware.security_middleware import SecurityHeadersMiddleware, ResponseSanitizationMiddleware
from middleware.api_key_auth import get_api_key
from middleware.credit_billing import CreditBillingMiddleware

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Create logs directory if it doesn't exist
os.makedirs(os.path.join(os.path.dirname(__file__), "logs"), exist_ok=True)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler(os.path.join(os.path.dirname(__file__), "logs", "samai-api.log")),
        logging.StreamHandler(sys.stdout),
    ]
)
logger = logging.getLogger("samai-api")

# Initialize FastAPI app
app = FastAPI(
    title="SAM AI Centralized API",
    description="Central API for all 35+ SAM AI standalone services",
    version="2.0.0",
    openapi_url="/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS - restrict in production
IS_PRODUCTION = os.getenv("ENVIRONMENT", "production") == "production"
DEFAULT_ORIGINS = "https://samai.com,https://www.samai.com,https://samai.lk,https://www.samai.lk,https://*.sam.ai"
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", DEFAULT_ORIGINS).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "https://samai.com",
        "https://www.samai.com",
        "https://samai.lk",
        "https://www.samai.lk",
        "https://*.sam.ai",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security middleware
app.add_middleware(SecurityHeadersMiddleware)
if IS_PRODUCTION:
    app.add_middleware(ResponseSanitizationMiddleware)

# Credit billing middleware (must come after API key auth)
app.add_middleware(CreditBillingMiddleware)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all incoming requests."""
    start_time = __import__("time").time()

    # Extract service info from API key (validated by middleware)
    response = await call_next(request)

    process_time = (__import__("time").time() - start_time) * 1000
    logger.info(
        f"{request.method} {request.url.path} - "
        f"Status: {response.status_code} - "
        f"Time: {process_time:.1f}ms"
    )

    return response


# Register all routers
def register_routers():
    """Register all API routers."""
    from routers import (
        auth, chat, coding, crypto, image, voice, media,
        social_news, astrology, lead_gen, learning, pdf_studio,
        pdf_translate, flutter_build, knowledge, seo, business,
        finance, health, legal, email, resume, presentation,
        research, story, recipe, tourism, content, document,
        translate, analytics, security, apk_decomp, automation,
        telegram_bot, mastermind, samtool, api_billing, api_proxy,
        api_provider, gateway, developer, validation, permissions,
        project, secrets, autonomous_hub, ai_intelligence, mt5_trader,
        multimodel, site_manager, communication, auto_integrator,
        agency_workspace, agents, services
    )

    routers = [
        ("auth", auth.router),
        ("chat", chat.router),
        ("coding", coding.router),
        ("crypto", crypto.router),
        ("image", image.router),
        ("voice", voice.router),
        ("media", media.router),
        ("social_news", social_news.router),
        ("astrology", astrology.router),
        ("lead_gen", lead_gen.router),
        ("learning", learning.router),
        ("pdf_studio", pdf_studio.router),
        ("pdf_translate", pdf_translate.router),
        ("flutter_build", flutter_build.router),
        ("knowledge", knowledge.router),
        ("seo", seo.router),
        ("business", business.router),
        ("finance", finance.router),
        ("health", health.router),
        ("legal", legal.router),
        ("email", email.router),
        ("resume", resume.router),
        ("presentation", presentation.router),
        ("research", research.router),
        ("story", story.router),
        ("recipe", recipe.router),
        ("tourism", tourism.router),
        ("content", content.router),
        ("document", document.router),
        ("translate", translate.router),
        ("analytics", analytics.router),
        ("security", security.router),
        ("apk_decomp", apk_decomp.router),
        ("automation", automation.router),
        ("telegram_bot", telegram_bot.router),
        ("mastermind", mastermind.router),
        ("samtool", samtool.router),
        ("api_billing", api_billing.router),
        ("api_proxy", api_proxy.router),
        ("api_provider", api_provider.router),
        ("gateway", gateway.router),
        ("developer", developer.router),
        ("validation", validation.router),
        ("permissions", permissions.router),
        ("project", project.router),
        ("secrets", secrets.router),
        ("autonomous_hub", autonomous_hub.router),
        ("ai_intelligence", ai_intelligence.router),
        ("mt5_trader", mt5_trader.router),
        ("multimodel", multimodel.router),
        ("site_manager", site_manager.router),
        ("communication", communication.router),
        ("auto_integrator", auto_integrator.router),
        ("agency_workspace", agency_workspace.router),
        ("agents", agents.router),
        ("services", services.router),
    ]

    # Routers that require API key + user auth
    protected_routers = set([
        "chat", "coding", "crypto", "image", "voice", "media",
        "social_news", "astrology", "lead_gen", "learning", "pdf_studio",
        "pdf_translate", "flutter_build", "knowledge", "seo", "business",
        "finance", "health", "legal", "email", "resume", "presentation",
        "research", "story", "recipe", "tourism", "content", "document",
        "translate", "analytics", "apk_decomp", "automation", "mastermind",
        "samtool", "validation", "multimodel", "autonomous_hub",
        "ai_intelligence", "mt5_trader", "site_manager",
    ])

    for name, router in routers:
        if name in protected_routers:
            app.include_router(router, prefix="/api", dependencies=[Depends(get_api_key)])
        else:
            app.include_router(router, prefix="/api")

try:
    register_routers()
    logger.info("All routers registered successfully")
except Exception as e:
    logger.error(f"Router registration error: {e}")


# Health check endpoints (no auth required)
@app.get("/health")
@app.get("/api/health")
def health_check():
    return {"status": "SAM AI API is Running", "version": "2.0.0"}


@app.get("/")
def root():
    return {
        "service": "SAM AI Centralized API",
        "version": "2.0.0",
        "documentation": "/docs",
        "status": "operational"
    }


# Error handlers
@app.exception_handler(402)
async def payment_required_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=402,
        content={
            "status": "error",
            "error": "Payment Required",
            "message": "Insufficient credits. Please purchase more at samai.com/pricing",
            "purchase_url": "https://samai.com/pricing"
        }
    )


@app.exception_handler(401)
async def unauthorized_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=401,
        content={
            "status": "error",
            "error": "Unauthorized",
            "message": "Invalid or missing API key. Include x-api-key header.",
            "docs": "https://samai.com/docs/api"
        }
    )


@app.exception_handler(403)
async def forbidden_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=403,
        content={
            "status": "error",
            "error": "Forbidden",
            "message": "You do not have permission to access this resource."
        }
    )


# WSGI application for passenger_wsgi.py
def app_factory():
    return app


if __name__ == "__main__":
    import uvicorn
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", "8000"))
    uvicorn.run(app, host=host, port=port)
