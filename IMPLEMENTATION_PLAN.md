# SAM AI — Implementation Plan: Multi-SaaS Architecture
*Version 2.0 — Updated 2026-09-04*

## Executive Summary

SAM AI already has a mature backend with 37+ AI agents, 30+ FastAPI routers, a multi-provider API hub, and a Next.js frontend with 25+ module pages. What's missing is the **public-facing SaaS layer** that turns these into individual revenue-generating services.

This plan covers:
1. **Project Organization** — "Sam AI Projects" master folder
2. **API Architecture** — Central REST API exposing all modules
3. **Backend Deployment** — cPanel (PHP/Python hybrid) as the source of truth
4. **Frontend Layer** — PHP master marketplace + standalone PHP sites per service
5. **Security & Billing** — API keys, credit-based billing, provider masking
6. **Roadmap** — Step-by-step implementation order

---

## 1. Project Organization: "Sam AI Projects" Folder Structure

```
samai/  (workspace root)
├── samai-core/                    # Core system (backend + api + frontend admin)
│   ├── backend/                   # FastAPI backend with all 37 agents + 30 routers
│   ├── frontend/                  # Next.js admin dashboard (existing)
│   ├── api/
│   │   └── index.py               # Vercel entry (simple health + crypto)
│   ├── requirements.txt
│   └── PROJECT_VISION.md
│
├── samai-projects/                # MASTER FOLDER for all standalone services
│   │
│   ├── samai-lk/                  # Master marketplace: samai.lk / samai.com
│   │   ├── index.php              # Catalog of all 35+ services
│   │   ├── pay/                   # Payment gateway integration
│   │   ├── auth/                  # User registration + login (shared)
│   │   └── assets/
│   │
│   ├── newsflash-pro/             # Standalone service: News Flash AI
│   │   ├── index.php              # Dedicated homepage
│   │   ├── register.php
│   │   ├── login.php
│   │   ├── dashboard.php
│   │   ├── api-client.php         # Calls /api/social-news/generate-post
│   │   └── config.php             # API key + endpoint config
│   │
│   ├── sam-coder/                 # Standalone service: Sam Coder
│   │   ├── index.php
│   │   ├── register.php
│   │   ├── login.php
│   │   ├── dashboard.php
│   │   ├── api-client.php
│   │   └── config.php
│   │
│   ├── sam-translate/             # Standalone service: Translation
│   │   ├── index.php
│   │   ├── ...
│   │
│   ├── sam-image/                 # Standalone service: Image Generation
│   ├── sam-voice/                 # Standalone service: Voice TTS/STT
│   ├── sam-video/                 # Standalone service: Video Generation
│   ├── sam-pdf/                   # Standalone service: PDF Studio
│   ├── sam-crypto/                # Standalone service: Crypto Analysis
│   ├── sam-flutter/               # Standalone service: Flutter Builder
│   ├── sam-seo/                   # Standalone service: SEO Optimizer
│   ├── sam-learn/                 # Standalone service: Learn & Cues
│   ├── sam-link/                  # Standalone service: Link Manager
│   ├── sam-itex/                  # Standalone service: I-Tex
│   ├── sam-orb/                   # Standalone service: ORB
│   ├── sam-paper/                 # Standalone service: Paper
│   ├── sam-audio/                 # Standalone service: Sam Audio
│   ├── sam-editor/                # Standalone service: Sam Editor
│   ├── sam-media/                 # Standalone service: Sam Media
│   ├── sam-pro/                   # Standalone service: Sam Pro
│   ├── sam-vocal/                 # Standalone service: Sam Vocal
│   ├── sam-vs/                    # Standalone service: Sam VS
│   ├── sam-bot/                   # Standalone service: MyBot
│   ├── sam-buffer/                # Standalone service: Buffer
│   ├── sam-xl/                    # Standalone service: Excel
│   ├── sam-img/                   # Standalone service: IMG
│   ├── sam-imgr/                  # Standalone service: IMGR
│   ├── sam-lagnova/               # Standalone service: Lagnova
│   ├── sam-plansam/               # Standalone service: Plan Sam
│   ├── ts-tradebot/               # Standalone service: TS TradeBot
│   ├── ts-chat/                   # Standalone service: TS Chat
│   ├── ts-holding/                # Standalone service: TS Holding
│   ├── ts-cues/                   # Standalone service: TS Cues
│   ├── ts-video/                  # Standalone service: TS Video
│   ├── 30-news/                   # Standalone service: 30 News
│   ├── espn/                      # Standalone service: 3es (ESPN)
│   ├── sri-lanka-ar/              # Standalone service: 18 AR Sri Lanka
│   ├── boatyt/                    # Standalone service: BoatYT
│   ├── sam-tools/                 # Standalone service: Sam Tools
│   └── templates/                 # SHARED template for all standalone sites
│       ├── php-template/          # Reusable PHP site skeleton
│       └── api-template/          # Reusable API wrapper skeleton
│
├── deployment/                    # Deployment configuration
│   ├── cpanel/                    # cPanel deployment packages (per service)
│   ├── vercel/                    # Vercel configs (for Next.js frontend)
│   └── docker/                    # Docker configs (future)
│
└── docs/                          # Documentation
    ├── api-registry.md            # Full API endpoint registry
    ├── service-catalog.md         # Catalog of all 35+ services
    ├── deployment-guide.md        # How to deploy each service
    └── security-model.md          # Security architecture
```

### Module-to-Service Mapping

Each existing backend module maps to a standalone service:

| Module Name | API Endpoint | Standalone Service | Domain Suggestion |
|---|---|---|---|
| Social Media | `/api/social/*` | NewsFlash Pro | newsflash.ai / newsflash.lk |
| Coding | `/api/coding/*` | Sam Coder | samm.coder / codecraft.lk |
| Translation | `/api/translate/*` | Sam Translate | samtrans.lk |
| Image | `/api/image/*` | Sam Image | samimg.ai / img.lk |
| Voice | `/api/voice/*` | Sam Voice | samvocal.lk / voice.ai |
| Video | `/api/media/video/*` | Sam Video | samvideo.lk / video.ai |
| PDF Studio | `/api/pdf-studio/*` | Sam PDF | sampdf.lk |
| Crypto | `/api/crypto/*` | Sam Crypto | samcrypto.lk |
| Astrology | `/api/astrology/*` | 30 Astro | astro.lk |
| Lead Gen | `/api/lead-gen/*` | Sam Lead | samlead.lk |
| Education | `/api/learning/*` | Sam Learn | learn.lk |
| Business | `/api/business/*` | Sam Pro | sampro.lk |
| SEO | `/api/seo/*` | Sam SEO | samseo.lk |
| Flutter | `/api/flutter/*` | Sam Flutter | samflutter.lk |
| Telegram | `/api/telegram/*` | Sam Bot | ambots.lk |
| ... | ... | ... | ... |

Full mapping of all 35+ modules is in `docs/api-registry.md`.

---

## 2. API Architecture & Backend Setup

### 2.1 Central API Hub (FastAPI)

The backend already has the infrastructure. It needs to be consolidated into a single production entry point.

**Entry Point:** `samai-core/backend/main.py` (consolidated from existing routers)

```python
# Key additions needed:
# - API Key authentication middleware (x-api-key header)
# - Credit-based billing middleware (returns 402 when credits exhausted)
# - Per-service rate limiting (already partially done via API Gateway)
# - Provider name masking (already done via ResponseSanitizationMiddleware)
# - Public API docs at /docs with schema masking
```

**Authentication Model:**
- Each standalone PHP site gets a unique **Service API Key** (e.g., `svc_newsflash_abc123`)
- Users register on the standalone site; the site forwards registration to the central API
- User JWT tokens are issued by the central API and cached/stored by the standalone site
- All API requests include `Authorization: Bearer <jwt>` + `x-api-key: <service_key>`
- When credits reach zero, API returns `402 Payment Required`

**Credit System:**
- Each API call deducts credits based on the module's cost tier:
  - **Free** (chat, general): 0 credits
  - **Standard** (translate, content, news, social, education): 1 credit
  - **Premium** (coding, image, video, voice, business, legal, automation): 2-5 credits
- Users purchase credit packs ($5/50 credits, $10/120 credits, $25/350 credits)
- Credit balance stored in MySQL `user_credits` table
- Payment gateway: Stripe (primary) + local options (e.g., local bank transfer for LK)

### 2.2 API Endpoints Structure

All existing routers already define endpoints. They need to be:
1. Consolidated under a single `/api/` prefix
2. Protected by API key middleware
3. Wrapped with credit-deduction middleware
4. Documented in OpenAPI format (auto-generated by FastAPI)

**Current routers to consolidate** (all in `backend/routers/`):
```
auth.py, chat.py, coding.py, crypto.py, image.py, voice.py, media.py,
social_news.py, astrology.py, lead_gen.py, learning.py, pdf_studio.py,
pdf_translate.py, flutter_build.py, knowledge.py, seo.py, business.py,
finance.py, health.py, legal.py, email.py, resume.py, presentation.py,
research.py, story.py, recipe.py, tourism.py, content.py, document.py,
translate.py, analytics.py, security.py, security_auditor.py, apk_decomp.py,
automation.py, telegram_bot.py, mastermind.py, samtool.py, api_billing.py,
api_proxy.py, api_provider.py, gateway.py, developer.py, validation.py,
permissions.py, project.py, secrets.py, autonomous_hub.py, api_intelligence.py,
mt5_trader.py, multimodel.py, site_manager.py, communication.py,
auto_integrator.py, agency_workspace.py, agents.py
```

**New middleware to add:**
```python
# backend/middleware/api_key_auth.py
class APIKeyAuthMiddleware:
    - Validates x-api-key header against service API keys in DB
    - Injects service info into request.state
    - Returns 401 if invalid

# backend/middleware/credit_billing.py
class CreditBillingMiddleware:
    - Deducts credits after successful response
    - Returns 402 if credits insufficient before processing
    - Skips billing for free-tier endpoints
```

### 2.3 How Each Module Becomes a Public API

The existing `module_selector.py` already maps intents to endpoints. The `routers/` directory already has route definitions. What's needed is:

1. **API Registry** — A JSON file mapping each service to its endpoints:
```json
{
  "newsflash_pro": {
    "service_key": "svc_newsflash_abc123",
    "endpoints": [
      {"method": "POST", "path": "/api/social-news/generate-post", "cost": 2},
      {"method": "POST", "path": "/api/social-news/schedule", "cost": 1},
      {"method": "GET", "path": "/api/social-news/trending", "cost": 1}
    ]
  },
  "sam_coder": {
    "service_key": "svc_samcoder_xyz789",
    "endpoints": [
      {"method": "POST", "path": "/api/coding/generate", "cost": 5},
      {"method": "POST", "path": "/api/coding/review", "cost": 3},
      {"method": "POST", "/api/coding/fix", "cost": 4}
    ]
  }
}
```

2. **Service API Key generation** — Admin panel to generate/revoke keys per service

3. **Credit tracking tables** in MySQL:
```sql
CREATE TABLE service_api_keys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(100),
    api_key_hash VARCHAR(255),
    credits_granted INT DEFAULT 0,
    status ENUM('active','revoked'),
    created_at TIMESTAMP
);

CREATE TABLE user_credits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    service_name VARCHAR(100),
    balance INT DEFAULT 0,
    total_purchased INT DEFAULT 0,
    created_at TIMESTAMP
);

CREATE TABLE credit_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    service_name VARCHAR(100),
    amount INT,  -- positive = purchase, negative = deduction
    endpoint VARCHAR(255),
    request_id VARCHAR(255),
    created_at TIMESTAMP
);
```

---

## 3. Backend Deployment Strategy

### Recommendation: **Hybrid — cPanel (Primary) + Vercel (Frontend Admin Only)**

**Why not Vercel-only for the API?**
- Vercel serverless functions have a 60s timeout (Python), which kills long-running AI operations (video, image, research)
- Vercel doesn't support persistent background processes
- The existing `cpanel_deploy_package/` already has `passenger_wsgi.py` for cPanel WSGI deployment
- cPanel gives you full control over the Python environment, MySQL, and background processes

**Why keep Vercel for the admin frontend?**
- The Next.js admin dashboard (frontend/) is already deployed there
- It provides the best DX for the admin dashboard where Sam manages services
- No API exposure from Vercel — it only consumes the central API

**Architecture Diagram:**

```
                    ┌─────────────────────────────────────────┐
                    │         INTERNET (Customers)            │
                    └──────────────────┬──────────────────────┘
                                       │
                    DNS (samai.lk, newsflash.ai, samm.coder...)
                                       │
         ┌──────────────────────────────┴──────────────────────────────┐
         │                        LOAD BALANCER                        │
         │                    samai.com (primary)                     │
         └──────┬──────────────────┬──────────────────┬──────────────┘
                │                  │                  │
        ┌───────▼──────┐   ┌───────▼────────┐  ┌──────▼────────────┐
        │ samai.lk     │   │ newsflash.ai   │  │ samm.coder        │
        │ (PHP Master  │   │ (PHP Standalone│  │ (PHP Standalone   │
        │ Marketplace)  │   │ Service Site)  │  │ Service Site)     │
        │               │   │                │  │                   │
        │ • Catalog     │   │ • Dedicated    │  │ • Dedicated       │
        │ • Billing     │   │   Homepage     │  │   Homepage        │
        │ • Auth        │   │ • Register     │  │ • Register        │
        │ • API Keys    │   │ • Login        │  │ • Login           │
        │               │   │ • Dashboard    │  │ • Dashboard       │
        └───────┬──────┘   │ • Payments     │  │ • Payments        │
                │          └───────┬────────┘  └───────┬───────────┘
                │                  │                   │
                └──────────┬───────┴───────────────────┘
                           │
                           │ HTTPS (REST API)
                           │ x-api-key + Bearer JWT
                           │
                ┌──────────▼──────────┐
                │   samai.com API      │  ←─ FastAPI on cPanel
                │   (Production)       │     (passenger_wsgi.py)
                │                      │
                │  • API Gateway       │
                │  • Provider Adapters │
                │  • All 37 Agents     │
                │  • MySQL Database    │
                │  • Redis (cache)     │
                └──────────┬──────────┘
                           │
                ┌──────────▼──────────┐
                │  AI Providers        │
                │ (Gemini, Claude,      │
                │  OpenAI, Groq, etc.)  │
                └──────────────────────┘

                    ┌──────────────────────┐
                    │  vercel.com (admin)  │  ←─ Next.js Dashboard (internal)
                    │  samai.com/admin      │     (NOT customer-facing API)
                    └──────────────────────┘
```

### 3.1 cPanel Deployment Details

**Backend (Python/FastAPI):**
- Use `passenger_wsgi.py` (already exists in `cpanel_deploy_package/`)
- Python 3.12 via cPanel's "Setup Python App"
- Install dependencies from `requirements.txt`
- Configure `.env.production` with all API keys
- Set up Let's Encrypt SSL
- Use gunicorn workers (4-8) behind Passenger

**File Structure on cPanel:**
```
/home/samaiuser/
├── samai-api/              # Main API (FastAPI)
│   ├── backend/
│   ├── api_hub.py
│   ├── main.py
│   ├── passenger_wsgi.py
│   ├── requirements.txt
│   └── .env
│
├── samai-lk/               # Master marketplace (PHP)
│   └── ...
│
├── samai-services/
│   ├── newsflash-pro/
│   ├── sam-coder/
│   └── ... (each standalone PHP site)
│
└── samai-admin/            # Vercel deployment (Next.js)
    └── (symlink or separate deployment)
```

**Nginx Config (per service domain):**
```nginx
# samai.com (main API)
server_name samai.com api.sam.ai;
root /home/samaiuser/samai-api;
# ... passenger_wsgi.py config

# newsflash.ai (standalone service)
server_name newsflash.ai www.newsflash.ai;
root /home/samaiuser/samai-services/newsflash-pro;
index index.php;
# ... PHP-FPM config
```

### 3.2 Vercel Deployment (Frontend Admin Only)

The Next.js admin dashboard stays on Vercel but is configured to:
- Only expose the admin interface (no API routes that leak)
- Connect to the backend API at `https://samai.com/api/`
- Use environment variable `NEXT_PUBLIC_API_URL=https://samai.com/api`

**vercel.json for admin:**
```json
{
  "cleanUrls": true,
  "env": {
    "NEXT_PUBLIC_API_URL": "https://samai.com/api"
  },
  "routes": [
    {
      "src": "/admin/(.*)",
      "dest": "/$1"
    }
  ]
}
```

---

## 4. Frontend Layer: PHP Sites

### 4.1 Master Marketplace (`samai.lk`)

Built with PHP, connected to the central API.

**Key pages:**
- `/` — Catalog of all 35+ services (cards with descriptions, pricing, demo)
- `/service/{slug}` — Detail page per service with screenshots and pricing
- `/pricing` — Credit pack store (Stripe + local payment options)
- `/auth/register` — User registration (creates account via API)
- `/auth/login` — User login (gets JWT from API)
- `/account` — User dashboard (credit balance, API keys, purchase history)
- `/admin` — Admin panel (manage services, API keys, view analytics)

**How it connects:**
```php
// All API calls go to: https://samai.com/api/
$api_base = "https://samai.com/api";
$headers = [
    "Authorization: Bearer {$jwt_token}",
    "x-api-key: {$service_key}",  // samai-lk gets its own service key
    "Content-Type: application/json"
];
```

### 4.2 Standalone Service Site Template

A reusable PHP template found at `samai-projects/templates/php-template/`. Each service copies this template and customizes:

**Template structure:**
```
templates/php-template/
├── config.php           # Service name, API endpoint, display config
├── index.php            # Homepage (service-specific hero + features)
├── register.php         # Registration form → API POST /auth/register
├── login.php            # Login form → API POST /auth/login
├── dashboard.php        # Main app UI (calls service-specific API endpoints)
├── billing.php          # Purchase credits → API POST /payments/charge
├── logout.php           # Clears session
├── api-client.php       # Reusable PHP class for API calls (with retry, error handling)
├── auth-check.php       # Middleware: verifies JWT, checks credits, returns 402 page
├── assets/
│   ├── css/
│   │   ├── style.css
│   │   └── service.css  # Service-specific theme colors
│   └── js/
│       └── app.js       # Frontend logic, API calls
└── includes/
    ├── header.php
    ├── footer.php
    └── functions.php    # Shared PHP utilities
```

**config.php (customized per service):**
```php
<?php
$service_config = [
    'service_name' => 'NewsFlash Pro',
    'service_slug' => 'newsflash-pro',
    'service_key' => 'svc_newsflash_abc123',
    'api_base' => 'https://samai.com/api',
    'api_endpoints' => [
        'generate_post' => '/social-news/generate-post',
        'schedule_post' => '/social-news/schedule',
        'trending' => '/social-news/trending',
    ],
    'credit_costs' => [
        'generate_post' => 2,
        'schedule_post' => 1,
        'trending' => 1,
    ],
    'theme_color' => '#ef4444',
    'primary_color' => '#dc2626',
];
?>
```

**The PHP Demo Pattern (from `php_demo/index.php` — already working):**
The existing `php_demo/index.php` demonstrates the exact pattern. Each standalone site will follow this structure:
1. PHP page collects user input (news URL, prompt, etc.)
2. PHP server-side code sends cURL request to `https://samai.com/api/{endpoint}` with `x-api-key` header
3. If API returns 402, show "Payment Required: Please recharge"
4. If API returns 200, render the result
5. Registration/login handled through API auth endpoints

### 4.3 Service Count & Assignment

The user mentioned ~35-40 services. Here's the confirmed mapping:

**From the user's list (35+ services):**
1. 30 News → `/api/social-news/*`
2. 3es → `/api/coding/*` (ESPN integration)
3. 30 Network → `/api/knowledge/*`
4. 30 → `/api/chat/*` (general)
5. 18ar Sri Lanka → `/api/tourism/*` (18th Amendment research)
6. BoatYT → `/api/media/video/*` (YouTube boat content)
7. Buffer → `/api/social/*` (buffer scheduling)
8. Excel → `/api/analytics/*` (data analysis)
9. IMG → `/api/image/generate`
10. IMGR → `/api/image/analyze`
11. Lagnova → `/api/astrology/*` (horoscope)
12. Learn & Cues → `/api/learning/*`
13. Link → `/api/knowledge/search`
14. I-Tex → `/api/document/*` (text extraction)
15. MyBot → `/api/agents/*`
16. ORB → `/api/agents/council`
17. Paper → `/api/research/*`
18. PDF → `/api/pdf-studio/*`
19. PDF Editor → `/api/pdf-studio/edit`
20. Plan Sam → `/api/plan/*`
21. Sam Coder → `/api/coding/*`
22. Sam Audio → `/api/voice/tts`
23. Sam Editor → `/api/media/content`
24. Sam Media → `/api/media/*`
25. Sam Pro → `/api/business/*`
26. Sam Vocal → `/api/voice/stt`
27. Sam VS → `/api/validation/*`
28. TS TradeBot → `/api/crypto/*`
29. TS Chat → `/api/chat/*`
30. TS Holding → `/api/knowledge/*` (master portal)
31. TS Cues → `/api/knowledge/train`
32. TS Video → `/api/media/video/*`

**From existing frontend modules (25+):**
Also include: Flutter Studio, Lead Gen, Security Auditor, Site Manager, Communication Cloud, APK Decompiler, Web Editor IDE, Project Memory, Automation Hub, AI Intelligence, Agency Workspace, Admin Keys

Total: ~40 standalone services.

---

## 5. Security & Privacy Strategy

### 5.1 API Security

| Layer | Method | Existing? | Action Needed |
|---|---|---|---|
| API Key Auth | `x-api-key` header validated per request | Partial (php_demo uses it) | Add `api_key_auth.py` middleware |
| User Auth | JWT Bearer token | Yes (backend has auth.py router) | Wire up to standalone sites |
| Rate Limiting | Token bucket per API key | Yes (API Gateway) | Configure per-service limits |
| Provider Masking | Replace model/provider names | Yes (ResponseSanitizationMiddleware) | Enable in production |
| Request Signing | HMAC signature | Partial (security_ext/request_signing.py) | Enable for payment endpoints |
| 2FA | TOTP/OTP | Partial (security_ext/two_factor.py) | Enable for admin panel |

### 5.2 Deployment Security

- **.htaccess** on each PHP site to prevent directory listing
- **Environment variables** for all secrets (never in code)
- **API keys hashed** in DB (bcrypt), never stored plaintext
- **SSL mandatory** on all domains
- **Source code private** — all repos in private GitHub, no public commits of secrets
- **cPanel isolation** — each service in its own subdomain/directory

### 5.3 Privacy

- No Vercel API keys exposed — frontend calls samai.com API
- All AI provider keys stay on the server (backend)
- Provider names masked in responses (gemini → "sam-ai-model")
- User data isolated per project (existing project_brain architecture)

---

## 6. Implementation Roadmap

### Phase 1: Consolidate Backend (Week 1-2)
1. Create `samai-core/backend/main.py` — consolidate all routers into single FastAPI app
2. Add `api_key_auth.py` middleware (validate service API keys)
3. Add `credit_billing.py` middleware (deduct credits, return 402)
4. Add MySQL tables for `service_api_keys`, `user_credits`, `credit_transactions`
5. Add API endpoint to generate/revoke service API keys
6. Test with existing `php_demo/index.php`

### Phase 2: Master Marketplace PHP Site (Week 2-3)
1. Create `samai-projects/samai-lk/` directory
2. Build `index.php` (catalog of all services)
3. Build `auth/register.php` and `auth/login.php`
4. Build `pricing.php` (credit packs with Stripe)
5. Build `account.php` (credit balance, API keys, purchase history)
6. Build `includes/api-client.php` (reusable API wrapper)

### Phase 3: Standalone Site Template (Week 3)
1. Create `samai-projects/templates/php-template/`
2. Build the full template (config.php, index.php, register.php, login.php, dashboard.php, billing.php, api-client.php, auth-check.php)
3. Deploy to one service first (e.g., NewsFlash Pro)
4. Test end-to-end: register → login → use API → 402 when credits run out

### Phase 4: Deploy All Services (Week 4-5)
1. Create a script to generate standalone PHP sites from the template
2. Assign unique service API keys to each from the admin panel
3. Configure cPanel domains/subdomains for each service
4. Set up DNS records for each domain

### Phase 5: Production & Monitoring (Week 5-6)
1. Set up monitoring (UptimeRobot for API health)
2. Set up logging (backend logs to file, error tracking)
3. Configure backups (daily MySQL dump, daily file backup)
4. Set up Stripe webhooks for credit purchases
5. Test failover between AI providers
6. Document everything in `docs/`

---

## 7. Key Decisions Summary

| Decision | Choice | Rationale |
|---|---|---|
| API hosting | cPanel (Python/Passenger) | Long-running AI tasks, full control, existing package |
| Admin dashboard | Vercel (Next.js) | Existing deployment, internal use only |
| Service frontends | PHP (cPanel) | Lightweight, cheap, per-domain, proven by php_demo |
| Authentication | Central JWT + Service API Keys | Single source of truth, masked providers |
| Billing | Stripe + local options | Credit system, 402 responses |
| Domains | One per service (subdomains OK) | Independent marketing, user isolation |
| Code privacy | Private GitHub repos | No source exposure |
