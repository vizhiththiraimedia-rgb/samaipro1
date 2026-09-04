# Security & Key Rotation

## Status: Rotation Initiated — Action Required

On 2026-09-04, real API keys were discovered in local `.env` files (gitignored
but exposed on disk). The following rotation has been initiated automatically;
**you must complete the manual steps below before any system is used in
production**.

## What Was Rotated (Automatic)

All cryptographic secrets that can be regenerated without external dependency
have been replaced with fresh `secrets.token_urlsafe(48)` values:

| Secret | Status | New Value Location |
|---|---|---|
| `JWT_SECRET` | ✅ Rotated | `backend/.env`, `frontend/.env` |
| `JWT_REFRESH_SECRET` | ✅ Rotated | `backend/.env`, `frontend/.env` |
| `SAM_MASTER_KEY` | ✅ Rotated | `backend/.env` |
| `TELEGRAM_BOT_TOKEN` | ⚠️ Placeholder — regenerate manually | `backend/.env` |
| `OPENROUTER_API_KEY` | ⚠️ Placeholder — regenerate manually | `backend/.env` |
| `GROQ_API_KEY` | ⚠️ Placeholder — regenerate manually | `backend/.env` |
| `SAM_AI_TOKEN` (admin JWT) | ⚠️ Invalidate + re-mint after new JWT_SECRET | `frontend/.env` |

## What You Must Do Manually

External API keys cannot be rotated from inside this repo — you must visit each
provider's dashboard and generate new keys. After generating, replace the
`REDACTED_PENDING_*` placeholders in the respective `.env` files.

### 1. Telegram Bot Token

1. Open Telegram, message **@BotFather**
2. Send `/revoke` and select the SAM AI bot
3. Copy the new token into `backend/.env` → `TELEGRAM_BOT_TOKEN=`
4. Restart the backend

### 2. OpenRouter API Key

1. Go to https://openrouter.ai/keys
2. Delete the leaked key (prefix `sk-or-v1-9ead4785035e53cb...`)
3. Click **Create Key**, copy the new value
4. Paste into `backend/.env` → `OPENROUTER_API_KEY=`

### 3. Groq API Key

1. Go to https://console.groq.com/keys
2. Revoke the leaked key (suffix `...JiEMy`)
3. Create a new key
4. Paste into `backend/.env` → `GROQ_API_KEY=`

### 4. Admin JWT (`SAM_AI_TOKEN`)

The token in `frontend/.env` was an admin JWT (role=admin, exp=2037) signed with
the OLD `JWT_SECRET`. After step 1 above (new JWT_SECRET), the old token is
already invalid. To mint a new admin token for the frontend:

```bash
cd backend
python -c "
import jwt, datetime, os
from dotenv import load_dotenv
load_dotenv('.env')
payload = {'user_id': 'admin_sam_01', 'role': 'admin', 'exp': datetime.datetime.utcnow() + datetime.timedelta(days=365*10)}
print(jwt.encode(payload, os.environ['JWT_SECRET'], algorithm='HS256'))
"
```

Copy the printed token into `frontend/.env` → `SAM_AI_TOKEN=`.

### 5. Any Other Provider Keys You Were Using

The following services were also detected in earlier `.env` files but no live
keys were found in current `.env` — verify these are still safe:
- `GEMINI_API_KEY`
- `CLAUDE_API_KEY`
- `OPENAI_API_KEY`
- `INFERX_API_KEY`
- `ELEVENLABS_API_KEY`
- `HUGGINGFACE_API_KEY`
- `E2B_API_KEY`
- `TAVILY_API_KEY`

If you previously had keys for any of these in `cpanel_deploy_package/.env` or
similar files (now deleted), rotate them in the respective dashboards.

## What Was Already Fixed (Code-Level)

- ✅ Removed hardcoded `SAM-MASTER-ADMIN` and `guest_master_token_2026` tokens
  from all source code and docs
- ✅ CORS no longer uses `*` — explicit allowlist only
- ✅ Backend uses env-configured master key (`SAM_MASTER_KEY`) with no fallback
- ✅ Frontend no longer falls back to admin token on missing JWT
- ✅ `secrets.py` redacts secrets in logs (Fernet encryption at rest)
- ✅ `.gitignore` blocks all `.env*` files (except `.env.example`)

## Verification Checklist

After completing the manual rotations:

- [ ] Test login flow with new JWT_SECRET (existing tokens should fail)
- [ ] Test Telegram bot webhook with new bot token
- [ ] Test OpenRouter chat with new key (try `/api/chat/completions`)
- [ ] Test Groq chat with new key
- [ ] Verify no service uses the old keys (check `audit_logs` for failures)
- [ ] Confirm `.env*` files are gitignored (`git check-ignore backend/.env` should print the path)

## Git History

The OLD keys were never committed to git (verified — `.env` was always
gitignored). They were only present in local working copies on this machine.

If the old keys had previously been leaked elsewhere (shared screens, logs,
chat, etc.), treat them as compromised and rotate as above.

## Rotation Date

2026-09-04 — initial rotation
