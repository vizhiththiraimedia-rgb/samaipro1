# SAM AI Projects

All 43 standalone AI services, the master marketplace, and deployment tooling for the SAM AI ecosystem.

## Structure

```
samai-projects/
├── api_registry.json              # Maps all 35+ services to API endpoints
├── samai-lk/                      # Master marketplace (samai.lk)
│   ├── index.php                 # Service catalog
│   ├── pricing.php               # Credit pack store
│   ├── account.php               # User dashboard
│   ├── auth/register.php         # Registration (via central API)
│   ├── auth/login.php            # Login (via central API)
│   └── assets/
├── newsflash-pro/                 # Standalone service: NewsFlash Pro
│   ├── index.php                 # Dedicated homepage
│   ├── register.php              # Service-specific registration
│   ├── login.php                 # Service-specific login
│   ├── dashboard.php             # AI tool interface
│   ├── billing.php               # Credit purchase
│   ├── config.php                # Service config (API key, theme, endpoints)
│   └── includes/
│       ├── api-client.php        # SamAI_API_Client class
│       ├── auth-check.php        # Auth middleware (402 handling)
│       ├── header.php
│       └── footer.php
├── sam-coder/                     # Standalone service: Sam Coder
├── sam-translate/                 # Standalone service: Sam Translate
├── sam-image/                     # Standalone service: Sam Image Studio
├── ... (40+ more service directories)
│
├── templates/
│   └── php-template/              # Reusable PHP template (copy this to create a new service)
│       ├── config.php
│       ├── index.php
│       ├── register.php
│       ├── login.php
│       ├── dashboard.php
│       ├── billing.php
│       ├── logout.php
│       ├── .htaccess
│       ├── includes/
│       │   ├── api-client.php
│       │   ├── auth-check.php
│       │   ├── header.php
│       │   └── footer.php
│       └── assets/
│           ├── css/style.css
│           ├── css/service.css
│           └── js/app.js
│
├── deployment/
│   ├── generate_service_site.py   # Script to generate a new service site
│   ├── cpanel/                    # Per-service cPanel deployment configs
│   └── vercel/                    # Vercel configs for admin dashboard
│
└── docs/
    ├── api-documentation.md      # Full API reference
    ├── deployment-guide.md       # How to deploy each service
    ├── security-model.md         # Security architecture
    └── service-catalog.md        # Complete service listing
```

## Quick Start

### Generate a new service site

```bash
cd samai-projects/deployment
python generate_service_site.py newsflash-pro --api-key sk-samai-xxx --domain https://newsflash.sam.ai
```

### Deploy to cPanel

1. Create a subdomain or addon domain in cPanel
2. Upload the service directory to the document root
3. Set the `SERVICE_KEY` in `config.php` (or use `.htaccess` for env vars)
4. Test: visit `https://your-domain.com/`

### Generate all service sites at once

```bash
cd samai-projects/deployment
python generate_service_site.py all
```

## How It Works

```
User → newsflash.sam.ai (PHP site) → samai.com/api (FastAPI)
                                               ↓
                    ┌────────────────────────────────────────┐
                    │  1. Service API Key validated           │
                    │  2. User JWT validated                  │
                    │  3. Credit balance checked (→ 402?)     │
                    │  4. Request routed to AI agent          │
                    │  5. Credits deducted (after response)   │
                    │  6. Response returned (providers masked)│
                    └────────────────────────────────────────┘
                                               ↓
                    AI Provider (Gemini/Claude/OpenAI/etc.)
```

## Service API Key Generation

```bash
cd backend/
python generate_service_key.py newsflash-pro 1000 "NewsFlash Pro key"
```

Output:
```
Service:      NewsFlash Pro
API Key:      sk-samai-abc123-def456
Credits:      1000
```

The raw key is shown once. Store it in the service's `config.php`.

## Credit System

Each API call deducts credits based on the endpoint:
- **Free** (0 credits): Health checks, basic info
- **Standard** (1-3 credits): Translation, social posts, simple generation
- **Premium** (5-10 credits): Image/video generation, code generation, complex analysis

When credits reach zero, the API returns HTTP 402. The PHP site shows a "Payment Required" page.
