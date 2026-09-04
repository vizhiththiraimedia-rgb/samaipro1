# SAM AI v2 — Unified API Documentation

## Overview

The SAM AI v2 API is a secure, unified gateway to 35+ AI services. Each service is a standalone website with its own domain, registration, login, and payment gateway. All services connect to this central API using service-specific API keys.

## Base URL

- **Production:** `https://samai.com/api`
- **Staging:** `https://staging.sam.ai/api`
- **Local Dev:** `http://localhost:8000/api`

## Authentication

### Two-Layer Authentication

Every request requires **both**:

1. **Service API Key** — Identifies which standalone service is making the request
   - Header: `x-api-key: sk-samai-xxxxxxxxxxxxxxxx`
   - Generated via admin panel at `/admin/services`
   - Rotatable per service

2. **User JWT Token** — Identifies the end user
   - Header: `Authorization: Bearer <jwt_token>`
   - Obtained from `/auth/login`
   - 24-hour expiry, refreshable via `/auth/refresh`

### Authentication Flow

```
1. User registers at samai.com/auth/register (or via standalone service site)
2. User logs in at any service → POST /api/auth/login
3. API returns JWT token
4. All subsequent API calls include both x-api-key and Authorization: Bearer <jwt>
5. If credits reach zero, API returns 402 Payment Required
```

## Rate Limits

| Tier | API Key | Per-Minute | Per-Hour |
|------|---------|-----------|----------|
| Free | svc_... | 20 | 200 |
| Standard | svc_... | 60 | 1,000 |
| Premium | svc_... | 200 | 5,000 |

Rate limit headers are returned on every request:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`

## Credit System

Credits are deducted per API call based on the endpoint used. Credits never expire.

### Credit Packs

| Credits (total) | Price (USD) | Price (LKR) | Per-Credit |
|-----------------|-------------|-------------|------------|
| 50              | $5          | 1,500       | $0.100     |
| 130 (120+10)    | $10         | 3,000       | $0.077     |
| 400 (350+50)    | $25         | 7,500       | $0.063     |
| 950 (800+150)   | $55         | 16,500      | $0.058     |
| 2,200 (1,800+400)| $100       | 30,000      | $0.045     |

### Credit Costs by Service

| Service | Endpoint | Cost (credits) |
|---------|----------|---------------|
| NewsFlash Pro | POST /social-news/generate-post | 2 |
| Sam Coder | POST /coding/generate | 5 |
| Sam Coder | POST /coding/review | 3 |
| Sam Translate | POST /translate/text | 1 |
| Sam Image Studio | POST /image/generate | 5 |
| Sam Image Studio | POST /image/analyze | 3 |
| Sam Audio Studio | POST /voice/tts | 2 |
| Sam Video Studio | POST /media/video/generate | 10 |
| Sam PDF Studio | POST /pdf-studio/extract | 2 |
| Sam Crypto Pro | GET /crypto/market | 1 |
| AstroSage Studio | POST /astrology/birth-chart | 3 |
| Sam LeadGen | POST /leads/find | 5 |
| Sam SEO Pro | POST /seo/analyze | 3 |
| Sam Flutter Builder | POST /flutter/generate | 5 |
| NewsFlash Pro (30 News) | POST /social-news/flash | 2 |
| TS TradeBot | POST /crypto/signal | 5 |
| ORB (AI Council) | POST /agents/council/debate | 10 |
| ... | ... | ... |

Full mapping in `samai-projects/api_registry.json`.

## API Endpoints

### Auth (`/api/auth`)

#### POST /api/auth/register
Register a new user account.

**Request:**
```json
{
    "email": "user@example.com",
    "password": "securepassword123",
    "name": "John Doe"
}
```

**Response (200):**
```json
{
    "status": "success",
    "data": {
        "user": {"id": "uuid", "email": "user@example.com", "name": "John Doe"},
        "access_token": "eyJhbGciOiJIUzI1NiIs...",
        "expires_in": 86400,
        "credits": 50
    }
}
```

#### POST /api/auth/login
Login and receive JWT token.

**Request:**
```json
{
    "email": "user@example.com",
    "password": "securepassword123"
}
```

#### POST /api/auth/refresh
Refresh an expired JWT token.

**Request:**
```json
{
    "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Services (`/api/services`)

#### GET /api/services/catalog
Public. Returns catalog of all available services.

**Response:**
```json
{
    "status": "success",
    "data": [
        {
            "service_name": "NewsFlash Pro",
            "service_slug": "newsflash-pro",
            "description": "Generate AI social media posts from news URLs",
            "endpoint_prefix": "/social-news",
            "cost_tier": "standard",
            "theme_color": "#ef4444",
            "endpoints": [...]
        }
    ]
}
```

#### GET /api/services/catalog/{service_slug}
Public. Returns info for a specific service.

#### GET /api/services/credits/balance
Returns the authenticated user's credit balance for the service identified by the API key.

**Headers:** `x-api-key`, `Authorization: Bearer <jwt>`

**Response:**
```json
{
    "status": "success",
    "data": {
        "user_id": "uuid",
        "service_name": "NewsFlash Pro",
        "balance": 48,
        "total_purchased": 50,
        "total_used": 2
    }
}
```

#### GET /api/services/credits/history?limit=50
Returns the authenticated user's credit transaction history.

#### GET /api/services/credits/packs
Public. Returns available credit packs.

#### POST /api/services/credits/purchase
Purchase credits (initiates payment flow).

**Request:**
```json
{
    "credit_pack": 120
}
```

### Chat (`/api/chat`)

#### POST /api/chat/completions
General AI chat with context routing.

**Request:**
```json
{
    "message": "Explain the theory of relativity in simple terms",
    "project_id": "optional-project-id",
    "mode": "auto",
    "chat_history": []
}
```

**Response:**
```json
{
    "status": "success",
    "data": {
        "response": "The theory of relativity...",
        "model": "sam-ai-model",
        "provider": "sam-ai-provider-v2",
        "usage": {"input_tokens": 15, "output_tokens": 243}
    }
}
```

### Coding (`/api/coding`)

#### POST /api/coding/generate
Generate code from a description.

**Request:**
```json
{
    "prompt": "Create a React component that displays a counter with increment and decrement buttons",
    "language": "react",
    "project_id": "optional"
}
```

#### POST /api/coding/review
Review and suggest improvements to existing code.

#### POST /api/coding/fix
Fix bugs in provided code.

### Social News (`/api/social-news`)

#### POST /api/social-news/generate-post
Generate a social media post from a news URL.

**Request:**
```json
{
    "url": "https://example.com/news/ai-breakthrough",
    "language": "en",
    "tone": "professional"
}
```

**Response:**
```json
{
    "status": "success",
    "data": {
        "post": "🚀 BREAKING: AI breakthrough announced...",
        "image": "https://cdn.sam.ai/...",
        "hashtags": ["#AI", "#Tech"]
    }
}
```

### Image (`/api/image`)

#### POST /api/image/generate
Generate an image from a text prompt.

**Request:**
```json
{
    "prompt": "A futuristic city at sunset, cyberpunk style, 4k",
    "style": "digital_art",
    "size": "1024x1024",
    "n": 1
}
```

#### POST /api/image/analyze
Analyze an uploaded image.

### Voice (`/api/voice`)

#### POST /api/voice/tts
Convert text to speech.

**Request:**
```json
{
    "text": "Hello, this is a test.",
    "voice": "en-US-Jenny",
    "output_format": "mp3"
}
```

#### POST /api/voice/stt
Transcribe audio to text.

### Crypto (`/api/crypto`)

#### GET /api/crypto/market
Get live cryptocurrency market data.

#### GET /api/crypto/news
Get latest crypto news.

### Astrology (`/api/astrology`)

#### POST /api/astrology/birth-chart
Generate a Vedic birth chart.

### SEO (`/api/seo`)

#### POST /api/seo/analyze
Analyze SEO for a URL.

### Business (`/api/business`)

#### POST /api/business/market-analysis
Generate a market analysis report.

### Telegram (`/api/telegram`)

#### POST /api/telegram/webhook
Telegram bot webhook endpoint.

## Error Codes

| Code | Error | Description |
|------|-------|-------------|
| 200 | — | Success |
| 400 | Bad Request | Invalid request body |
| 401 | Unauthorized | Missing or invalid API key / JWT |
| 402 | Payment Required | Insufficient credits |
| 403 | Forbidden | API key valid but no access to this endpoint |
| 404 | Not Found | Endpoint not found |
| 429 | Rate Limit Exceeded | Too many requests, try again later |
| 500 | Internal Server Error | Server error, please try again |
| 503 | Service Unavailable | AI provider unavailable, retry later |
| 504 | Gateway Timeout | Request timed out |

## Provider Masking

In production mode, internal provider names are masked:

- `gemini-1.5-pro` → `sam-ai-model`
- `gpt-4o`, `o1` → `sam-ai-model`
- `deepseek-v4-flash` → `sam-ai-model`
- `OpenAI`, `Google`, `Anthropic` → `SAM AI Provider`

This ensures customers never know which AI provider powers their request.

## PHP Integration Example

```php
<?php
$api_base = "https://samai.com/api";
$service_key = "sk-samai-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";
$jwt_token = "eyJhbGciOiJIUzI1NiIs..."; // from login

$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => $api_base . "/social-news/generate-post",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode([
        "url" => "https://example.com/news",
        "language" => "en"
    ]),
    CURLOPT_HTTPHEADER => [
        "x-api-key: " . $service_key,
        "Authorization: Bearer " . $jwt_token,
        "Content-Type: application/json",
    ]),
]);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($http_code === 402) {
    echo "Payment Required: Please purchase more credits.";
} elseif ($http_code === 200) {
    $result = json_decode($response, true);
    echo $result['data']['post'];
}
?>
```
