# SAM AI — Deployment Guide

## Overview

SAM AI uses a **hybrid deployment model**:
- **Backend API**: FastAPI on cPanel (via Passenger WSGI)
- **Admin Dashboard**: Next.js on Vercel
- **Service Sites**: PHP on cPanel (one per service)

```
┌─────────────────┐     ┌──────────────────────────────────┐
│  Customers      │     │  samai.com (cPanel)               │
│  *.sam.ai       │────▶│  ├── API (FastAPI/Passenger)      │
│  newsflash.ai   │     │  ├── Master site (PHP) samai.lk  │
│  samm.coder     │     │  └── Service sites (PHP)          │
└─────────────────┘     └────────────┬───────────────────────┘
                                      │
┌─────────────────┐                   │ HTTPS (REST API)
│  Admin          │                   │ x-api-key + Bearer JWT
│  (internal)     │──────HTTPS────────┤
│  vercel.com     │                   │
└─────────────────┘                   │
                                      │
                            ┌─────────▼─────────┐
                            │  AI Providers      │
                            │ (Gemini, Claude,   │
                            │  OpenAI, Groq)     │
                            └───────────────────┘
```

---

## 1. Backend API Deployment (cpanel_deploy_package)

### Prerequisites

- cPanel hosting with Python 3.12 support
- "Setup Python App" feature enabled
- MySQL database
- SSL certificate (Let's Encrypt)

### Step 1: Create Python App in cPanel

1. Go to cPanel → Setup Python App
2. Create Application:
   - Python version: 3.12
   - App directory: `/home/samaiuser/samai-api`
   - App URL: `https://samai.com`
   - App startup file: `passenger_wsgi.py`
   - App entry point: `application`

### Step 2: Upload Files

Upload the contents of `samai-core/backend/` to `/home/samaiuser/samai-api/`:

```
samai-api/
├── main_production.py
├── passenger_wsgi.py
├── requirements.txt
├── .env.production
├── backend/
│   ├── core/
│   ├── agents/
│   ├── gateway/
│   ├── orchestrator/
│   ├── providers/
│   ├── routers/
│   ├── middleware/
│   ├── security_ext/
│   ├── tools/
│   ├── knowledge/
│   ├── analytics/
│   ├── permissions/
│   ├── models/
│   ├── models.py
│   └── database.py
├── logs/
└── __pycache__/
```

### Step 3: Install Dependencies

```bash
cd /home/samaiuser/samai-api
pip install -r requirements.txt
```

### Step 4: Configure Environment

Create `.env.production`:

```env
# Database
DATABASE_URL=mysql://samaiuser:sampass@localhost/samai_production

# API Keys
GEMINI_API_KEY=your_gemini_key
CLAUDE_API_KEY=your_claude_key
OPENAI_API_KEY=your_openai_key
GROQ_API_KEY=your_groq_key
OPENROUTER_API_KEY=your_openrouter_key
INFERX_API_KEY=your_inferx_key

# Security
API_KEY_SALT=your_random_salt_here
JWT_SECRET_KEY=your_jwt_secret_here
JWT_ALGORITHM=HS256

# Environment
ENVIRONMENT=production
ALLOWED_ORIGINS=samai.lk,samai.com,*.sam.ai
```

### Step 5: Start Application

```bash
# In cPanel Python App interface:
# Click "Start" to restart the application
```

---

## 2. PHP Service Sites Deployment

### Option A: Deploy All Services

```bash
cd samai-projects/deployment
python generate_service_site.py all --api-key-prefix svc
```

This generates all service sites in `samai-projects/`.

### Option B: Deploy Individual Service

```bash
cd samai-projects/deployment
python generate_service_site.py newsflash-pro --api-key sk-samai-xxx
```

### Step 1: Configure cPanel Domain

1. Go to cPanel → Subdomains or Addon Domains
2. Create domain: `newsflash.sam.ai` (or `newsflash.ai` if external domain)
3. Document root: `/home/samaiuser/samai-projects/newsflash-pro`

### Step 2: Upload Files

Copy the contents of `samai-projects/newsflash-pro/` to the document root.

### Step 3: Configure API Key

Edit `config.php` and set:

```php
define('SERVICE_KEY', 'sk-samai-xxx'); // Your service API key
define('SAMAI_API_BASE', 'https://samai.com');
```

### Step 4: Test

Visit `https://newsflash.sam.ai/` and test the registration flow.

---

## 3. Master Marketplace (samai.lk)

### Deployment

Same as service sites — upload to `samai-projects/samai-lk/` on cPanel.

### Master API Key

Generate a master key for the marketplace:

```bash
cd backend/
python generate_service_key.py samai-lk 10000 "Master marketplace key"
```

### Environment Variable

Set on cPanel:
```
SAMAI_MARKETPLACE_KEY=sk-samai-xxxxxxxxxxxxxxxx
```

---

## 4. Vercel Frontend (Admin Dashboard)

The Next.js admin dashboard stays on Vercel but only for internal/admin use.

### Deployment

```bash
cd frontend/
vercel --prod
```

### Environment Variables

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `https://samai.com/api` |
| `NEXT_PUBLIC_SAMAI_API_KEY` | (admin-only key) |

### Security

- No API routes exposed via Vercel
- All API calls go through `samai.com/api`
- Vercel handles only the UI rendering

---

## 5. Database Migration

### Initial Setup

```sql
-- Run these SQL commands in cPanel → phpMyAdmin or MySQL CLI

CREATE DATABASE samai_production;
CREATE USER 'samaiuser'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON samai_production.* TO 'samaiuser'@'localhost';
FLUSH PRIVILEGES;
```

### Auto-Migration

The backend auto-creates tables on first run via:
```python
models.Base.metadata.create_all(bind=engine)
```

### Manual Migration (for existing DB)

```bash
cd backend/
python -c "
from database import engine
import models
models.Base.metadata.create_all(bind=engine)
print('Tables created successfully')
"
```

---

## 6. SSL & DNS

### Required DNS Records

```
samai.com       → A record → your_cpanel_server_ip
samai.lk        → A record → your_cpanel_server_ip
*.sam.ai        → A record → your_cpanel_server_ip (wildcard)
newsflash.ai    → A record → your_cpanel_server_ip
sam.coder       → A record → your_cpanel_server_ip
...
```

### SSL

- Use cPanel's Let's Encrypt integration for automatic SSL
- Or use AWS Certificate Manager with a load balancer
- All traffic must be HTTPS (HSTS enabled)

---

## 7. Monitoring & Maintenance

### Health Check

```
GET https://samai.com/api/health
```

Expected response:
```json
{"status": "SAM AI Backend is Running 🚀"}
```

### Logs

- Backend logs: `/home/samaiuser/samai-api/logs/samai-api.log`
- cPanel error logs: `/etc/ea4/logs/samai-error_log`

### Backup Script

```bash
#!/bin/bash
# Daily backup script - add to cron
DATE=$(date +%Y%m%d)
mysqldump samai_production > /backup/samai_db_$DATE.sql
tar czf /backup/samai_files_$DATE.tar.gz /home/samaiuser/samai-projects/
```

### Cron Job

```bash
# Add to crontab (crontab -e)
0 2 * * * /home/samaiuser/backup_samai.sh
0 * * * * curl -s https://samai.com/api/health > /dev/null
```
