# Security Model

## Overview

SAM AI implements a defense-in-depth security strategy with multiple layers of protection.

---

## 1. API Authentication

### Service API Keys

Each standalone PHP service site gets a unique API key:
- Format: `sk-samai-{uuid16}-{uuid16}`
- Hashed with SHA-256 + salt before storage
- Validated via `x-api-key` header on every request
- Stored in `service_api_keys` table (hashed, never plaintext)

### User Authentication (JWT)

- Users register/login via central API
- JWT tokens issued with 24-hour expiry
- Refresh tokens for session persistence
- Tokens validated on every API request
- All tokens are scoped per service

### Token Structure

```
Header: { "alg": "HS256", "typ": "JWT" }
Payload: {
    "user_id": "uuid",
    "email": "user@example.com",
    "role": "user",
    "service": "newsflash-pro",
    "exp": 1234567890,
    "iat": 1234567000,
}
```

---

## 2. Authorization

### Role-Based Access Control (RBAC)

| Role | Permissions |
|------|------------|
| user | Use services, manage own credits |
| staff | All user + generate API keys, view analytics |
| admin | All staff + manage services, system config, user management |

### Per-Service Permissions

Each service API key is scoped to specific endpoints:
- `svc_newsflash_xxx` → only `/api/social-news/*` endpoints
- `svc_samcoder_xxx` → only `/api/coding/*` endpoints

### Permission Check Flow

```
1. Request arrives with x-api-key + Authorization: Bearer
2. API Key Auth middleware validates service key → service_info in request.state
3. JWT Auth middleware validates token → user_info in request.state
4. Permission Engine checks if user can access the endpoint
5. Credit Billing middleware checks balance → 402 if insufficient
6. Request proceeds to the endpoint handler
```

---

## 3. Rate Limiting

Implemented at two levels:

### Service-Level Rate Limiting
- Per API key: token bucket algorithm
- Free tier: 20 req/min
- Standard tier: 60 req/min
- Premium tier: 200 req/min

### User-Level Rate Limiting
- Per user per service: sliding window
- Prevents abuse by individual users

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 85
X-RateLimit-Reset: 2026-09-04T20:00:00Z
```

When exceeded → HTTP 429 with `Retry-After` header.

---

## 4. Provider Masking

In production mode, internal provider names are masked:

| Internal Name | Masked Name |
|--------------|-------------|
| `gemini-1.5-pro` | `sam-ai-model` |
| `gpt-4o` | `sam-ai-model` |
| `deepseek-v4-flash` | `sam-ai-model` |
| `OpenAI` | `SAM AI Provider` |
| `Google` | `SAM AI Provider` |
| `Anthropic` | `SAM AI Provider` |
| `DeepSeek` | `SAM AI Provider` |

Implemented via `ResponseSanitizationMiddleware` in `backend/middleware/security_middleware.py`.

---

## 5. Network Security

### HTTPS Only
- All traffic encrypted with TLS 1.3
- HSTS header with 1-year max-age
- No HTTP fallback

### CORS Policy
Production mode restricts CORS to known domains:
```
samai.lk, samai.com, *.sam.ai
```

### IP Whitelisting
- Admin endpoints restricted to known IP ranges
- Service keys can have IP whitelist attached
- Webhook endpoints validate source IPs

### Request Signing
- Payment endpoints require HMAC signature
- All state-changing operations validate request origin

---

## 6. Data Protection

### At Rest
- MySQL database encrypted with AES-256
- API keys hashed with SHA-256 + random salt
- Passwords hashed with bcrypt (via passlib)
- Sensitive fields (refresh tokens) encrypted

### In Transit
- TLS 1.3 for all API traffic
- JWT tokens signed with HS256
- No plaintext secrets in code or config files

### Secrets Management
- All secrets loaded from environment variables
- `.env.production` file never committed to git
- `.gitignore` excludes `.env*` files

---

## 7. Application-Level Security

### Zero-Trust Architecture
Every request is validated regardless of source:
1. API key validation
2. JWT token validation
3. Service scope check
4. Permission check
5. Rate limit check
6. Credit balance check

### Audit Logging
All API requests are logged:
- Request ID, service, endpoint, user ID
- Response status, latency
- IP address, user agent
- Stored in `audit_logs` table

### Two-Factor Authentication (Admin)
Admin accounts can enable TOTP 2FA:
- Google Authenticator compatible
- Recovery codes generated
- Required for admin panel access

---

## 8. Deployment Security

### cPanel Configuration
- Each service on its own subdomain
- `.htaccess` prevents directory listing
- Config files denied from web access
- PHP execution disabled in upload directories

### Source Code Protection
- All GitHub repos are private
- No secrets committed to version control
- `.gitignore` excludes: `.env`, `__pycache__`, `*.pyc`, `venv/`, `logs/`

### Environment Isolation
```
Development:  samai.local   (HTTP, no masking)
Staging:      staging.sam.ai (HTTPS, masking enabled)
Production:   samai.com     (HTTPS, masking enabled, rate limiting)
```

---

## 9. Incident Response

### Security Events
- All security events logged to `security_events` table
- Suspicious activity triggers alerts
- Rate limit violations logged

### Breach Response
1. Immediately revoke affected API keys
2. Rotate master JWT secret
3. Audit all recent requests
4. Notify affected users
5. Post-mortem documentation

### Key Rotation
- Service API keys: rotate manually via admin panel
- JWT secret: rotate monthly (set JWT_ROTATION_DAYS=30)
- AI provider keys: rotate via environment variables

---

## 10. Compliance Checklist

- [x] HTTPS everywhere (TLS 1.3)
- [x] API keys hashed at rest
- [x] Provider names masked in responses
- [x] Rate limiting per service and user
- [x] Credit-based billing with 402 responses
- [x] Audit logging for all requests
- [x] No secrets in source code
- [x] CORS restricted to known domains
- [x] Security headers (HSTS, X-Frame-Options, etc.)
- [x] 2FA for admin accounts
- [ ] GDPR compliance (data export/delete)
- [ ] SOC 2 Type II certification
- [ ] Penetration testing schedule
