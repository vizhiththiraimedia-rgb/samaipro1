# SAM AI — Agent Guidelines

## Project Structure

```
samai/
├── samai-core/              # Core backend + frontend admin
│   ├── backend/              # FastAPI backend
│   │   ├── core/             # SamAICore orchestrator
│   │   ├── agents/           # 37 AI agent modules
│   │   ├── gateway/          # API Gateway (rate limiting, service discovery)
│   │   ├── orchestrator/     # Task router, intent classifier
│   │   ├── providers/        # LLM adapters (Gemini, Claude, OpenAI, etc.)
│   │   ├── routers/          # 30+ FastAPI routers
│   │   ├── middleware/       # Auth, security, billing middleware
│   │   ├── security_ext/     # Zero-trust, 2FA, sessions
│   │   ├── models.py         # SQLAlchemy models
│   │   ├── database.py       # DB connection
│   │   ├── main_production.py # Main API entry point
│   │   ├── passenger_wsgi.py # cPanel WSGI entry
│   │   └── main.py           # Alternative entry
│   ├── frontend/             # Next.js 16 admin dashboard
│   ├── api/                  # Vercel API entry (simple)
│   ├── requirements.txt
│   └── PROJECT_VISION.md
│
├── samai-projects/           # ALL standalone service sites + marketplace
│   ├── samai-lk/             # Master marketplace (samai.lk)
│   ├── newsflash-pro/        # Standalone service: NewsFlash
│   ├── sam-coder/            # Standalone service: Sam Coder
│   ├── sam-translate/        # ... (35+ service directories)
│   ├── ...
│   ├── templates/
│   │   └── php-template/     # Reusable PHP template
│   ├── api_registry.json     # Service-to-endpoint mapping
│   ├── deployment/           # Deployment configs
│   │   ├── cpanel/           # Per-service cPanel configs
│   │   ├── vercel/           # Vercel configs
│   │   └── generate_service_site.py
│   └── docs/
│       ├── api-documentation.md
│       ├── deployment-guide.md
│       └── security-model.md
│
├── .kilo/                    # Kilo config
├── .vercel/                  # Vercel config
├── AGENTS.md                 # This file
└── IMPLEMENTATION_PLAN.md
```

## Development Commands

### Backend (Local Development)

```bash
# Start the API server (local dev, port 8000)
cd backend/
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Or use the production entry point
uvicorn main_production:app --reload --port 8000

# Generate a new service API key
python generate_service_key.py newsflash-pro 1000 "NewsFlash Pro key"

# Run tests
python -m pytest tests/ -v

# Lint
ruff check .

# Type check
mypy backend/ --ignore-missing-imports
```

### Frontend (Next.js Admin)

```bash
cd frontend/
npm install
npm run dev    # Local dev on http://localhost:3000

# Build for production
npm run build
npm start

# Lint
npm run lint

# Deploy to Vercel
vercel --prod
```

### PHP Service Sites

```bash
# Generate a new service site from template
cd samai-projects/
python deployment/generate_service_site.py newsflash-pro --api-key sk-samai-xxx

# Deploy to cPanel: upload generated directory to document root
```

### Database

```bash
# Create tables
cd backend/
python -c "from database import engine; import models; models.Base.metadata.create_all(bind=engine)"

# View tables
mysql -u samaiuser -p samai_production -e "SHOW TABLES;"
```

### Deployment

```bash
# Deploy backend to cPanel
# 1. Upload backend/ to /home/samaiuser/samai-api/
# 2. Install requirements: pip install -r requirements.txt
# 3. Start via cPanel Python App interface

# Generate all service sites
python samai-projects/deployment/generate_service_site.py all

# Deploy to production
git add . && git commit -m "Deploy: ..." && git push
```

## Coding Conventions

### Python Backend

- **Style**: PEP 8, use `ruff` for linting
- **Type hints**: Required for all public functions
- **Docstrings**: Google style for all modules and classes
- **Imports**: Standard library first, then third-party, then local
- **Database**: Use SQLAlchemy ORM, always close sessions
- **Error handling**: Return HTTP 402 for insufficient credits, 401 for auth errors

### PHP Service Sites

- **Style**: PSR-12, use `php -l` for syntax checking
- **Security**: Always validate input, use `htmlspecialchars()` for output
- **API calls**: Use the `SamAI_API_Client` class, never raw cURL
- **Sessions**: Use `SamAI_Session` class for session management
- **Configuration**: All service-specific config in `config.php`

### Frontend (Next.js)

- **Style**: Follow existing patterns in `frontend/src/`
- **Components**: Use existing UI components in `frontend/src/components/ui/`
- **API calls**: Use `src/lib/api-helpers.ts` for API communication
- **Modules**: Each module under `app/modules/` follows the same pattern

## Key Architecture Decisions

1. **Backend stays on cPanel** — Python/FastAPI with Passenger WSGI for long-running AI tasks
2. **Vercel only for admin dashboard** — No API routes exposed, only UI rendering
3. **PHP for service sites** — Lightweight, cheap, per-domain, proven by `php_demo/index.php`
4. **Central credit system** — Single credit pool works across all services
5. **Provider masking** — Customers never see internal provider names (Gemini → "sam-ai-model")
6. **API key + JWT auth** — Two-layer auth for service-to-API communication

## Important Files to Know

- `backend/main_production.py` — Main API entry point
- `backend/routers/services.py` — Service catalog + billing endpoints
- `backend/middleware/api_key_auth.py` — API key + JWT auth middleware
- `backend/middleware/credit_billing.py` — Credit deduction + 402 responses
- `backend/middleware/security_middleware.py` — Security headers + provider masking
- `samai-projects/api_registry.json` — All 35+ services and their endpoints
- `samai-projects/templates/php-template/` — Reusable PHP service template
- `samai-projects/samai-lk/` — Master marketplace site

## Testing Strategy

1. **Backend**: Run `uvicorn main_production:app --reload`, test endpoints via `/docs`
2. **API key auth**: Test with `x-api-key` header
3. **402 billing**: Test with zero credits
4. **PHP sites**: Test registration → login → API call flow
5. **Integration**: Each PHP site should work independently
