# SAM AI — Service Catalog

Complete catalog of all 35+ standalone services available in the SAM AI ecosystem.

## Service List

| # | Service Name | URL Slug | Endpoint Prefix | Category | Credit Cost | Description |
|---|-------------|----------|-----------------|----------|------------|-------------|
| 1 | **NewsFlash Pro** | `newsflash-pro` | `/social-news` | Content | 1-2 | Generate AI social media posts from news URLs |
| 2 | **Sam Coder** | `sam-coder` | `/coding` | Developer | 3-5 | AI code generation, review, and debugging |
| 3 | **Sam Translate** | `sam-translate` | `/translate` | Utility | 1-3 | Translate between Sinhala, Tamil, and English |
| 4 | **Sam Image Studio** | `sam-image` | `/image` | Media | 3-8 | AI image generation and editing |
| 5 | **Sam Audio Studio** | `sam-voice` | `/voice` | Media | 2 | Text-to-speech and speech-to-text |
| 6 | **Sam Video Studio** | `sam-video` | `/media/video` | Media | 5-10 | AI video generation and editing |
| 7 | **Sam PDF Studio** | `sam-pdf` | `/pdf-studio` | Utility | 2-4 | PDF processing, extraction, and editing |
| 8 | **Sam Crypto Pro** | `sam-crypto` | `/crypto` | Finance | 1-5 | Cryptocurrency market analysis and signals |
| 9 | **AstroSage Studio** | `astrosage` | `/astrology` | Lifestyle | 1-5 | Vedic astrology charts and predictions |
| 10 | **Sam LeadGen** | `sam-lead` | `/leads` | Business | 3-5 | AI-powered lead generation and outreach |
| 11 | **Sam Learn & Cues** | `sam-learn` | `/learning` | Education | 1-3 | Personalized learning and tutoring |
| 12 | **Sam Pro** | `sam-pro` | `/business` | Business | 5-8 | Business intelligence and financial analysis |
| 13 | **Sam SEO Pro** | `sam-seo` | `/seo` | Marketing | 2-3 | SEO optimization and keyword research |
| 14 | **Sam Flutter Builder** | `sam-flutter` | `/flutter` | Developer | 4-5 | Generate Flutter widgets and mobile UI |
| 15 | **Sam Bot (Telegram)** | `sam-boter` | `/telegram` | Utility | 0-1 | Telegram bot for AI commands |
| 16 | **Sam Editor Studio** | `sam-edit` | `/media` | Media | 1 | Rich media content editing |
| 17 | **Sam Media Studio** | `sam-media` | `/media` | Media | 2 | All-in-one media content creation |
| 18 | **Buffer Sam** | `buffer-sam` | `/social` | Content | 1-2 | Social media scheduling buffer |
| 19 | **Excel Sam** | `excel-sam` | `/analytics` | Analytics | 2-3 | AI-powered spreadsheet analysis |
| 20 | **IMG Sam** | `img-sam` | `/image` | Media | 5 | Quick image generation tool |
| 21 | **IMGR Sam** | `imgr-sam` | `/image` | Media | 8 | Advanced image generation with custom settings |
| 22 | **Lagnova** | `lagnova` | `/astrology` | Lifestyle | 5 | Vedic astrology and prediction platform |
| 23 | **Link Sam** | `link-sam` | `/knowledge` | Utility | 1 | Knowledge linking and document management |
| 24 | **I-Tex** | `itex-sam` | `/document` | Utility | 2 | Text extraction and document intelligence |
| 25 | **MyBot** | `mybot-sam` | `/chat` | Chat | 1 | Personal AI assistant bot |
| 26 | **ORB** | `orb-sam` | `/agents/council` | AI | 10 | AI Council - multi-perspective analysis |
| 27 | **Paper Sam** | `paper-sam` | `/research` | Research | 5-6 | AI research paper analysis and writing |
| 28 | **Plan Sam** | `plansam` | `/plan` | Productivity | 2 | Task planning and project decomposition |
| 29 | **Sam Audio** | `sam-audio` | `/voice` | Media | 4 | Audio processing and podcast generation |
| 30 | **Sam Vocal** | `sam-vocal` | `/voice` | Media | 2 | Voice command and vocal AI interface |
| 31 | **Sam VS** | `sam-vs` | `/validation` | Utility | 1 | Output validation and quality assurance |
| 32 | **Sam Tools** | `samt-tools` | `/tools` | Free | 0 | Utility tools (WHOIS, ping, etc.) |
| 33 | **TS TradeBot** | `tradesam` | `/crypto` | Finance | 3-5 | AI crypto trading bot and signals |
| 34 | **TS Chat** | `chatsam` | `/chat` | Chat | 1 | Team chat with AI assistance |
| 35 | **TS Holdings** | `holdingsam` | `/knowledge` | Enterprise | 2 | Corporate knowledge and holdings portal |
| 36 | **TS Cues** | `cues-sam` | `/learning` | Education | 1 | AI-powered learning cues and reminders |
| 37 | **TS Video** | `videosam` | `/media/video` | Media | 10 | AI video production and editing suite |
| 38 | **30 News** | `30news` | `/social-news` | Content | 2 | News flash generation with 30-second format |
| 39 | **3ES (ESPN)** | `3es` | `/sports` | Sports | 1-3 | ESPN sports analytics and news |
| 40 | **30 Network** | `30network` | `/tools` | Utility | 1 | Network monitoring and management |
| 41 | **30 App** | `30app` | `/app` | Free | 0 | General 30-series application platform |
| 42 | **18AR Sri Lanka** | `18ar-lk` | `/research` | Research | 3 | 18th Amendment research - Sri Lanka |
| 43 | **BoatYT** | `boatyt` | `/media/video` | Media | 8 | YouTube boat content automation |

## Cost Tiers

### Free (0 credits)
- Chat, general conversation
- WHOIS lookup, network ping
- Telegram bot webhook
- Dashboard overview

### Standard (1-3 credits)
- Translation, knowledge search
- Social post generation
- Crypto market data
- Learning/tutoring
- Document extraction

### Premium (3-10 credits)
- Code generation, review, fix
- Image generation and analysis
- Video generation and editing
- Business intelligence
- Market analysis
- Lead generation
- AI Council debates

## Domains

All services are accessible via:
- `{service_slug}.sam.ai` (primary)
- `{service_slug}.samai.lk` (alias)
- `{custom_domain}` (if purchased separately)

Example: `newsflash-pro.sam.ai` → NewsFlash Pro standalone site

## API Access

Every service connects to the central API:
```
https://samai.com/api/
```

With headers:
```
x-api-key: svc_{service_slug}_{random_key}
Authorization: Bearer {jwt_token}
```

## Full Technical Details

See `api_registry.json` for the complete endpoint mapping with credit costs.
See `docs/api-documentation.md` for the full API reference.
