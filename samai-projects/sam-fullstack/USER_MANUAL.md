# Sam FullStack Builder — User Manual

## Table of Contents
1. [Getting Started](#1-getting-started)
2. [Architecture Overview](#2-architecture-overview)
3. [Dashboard Guide](#3-dashboard-guide)
4. [The 8 Development Stages](#4-the-8-development-stages)
5. [Sample Workflows](#5-sample-workflows)
6. [Credit System](#6-credit-system)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Getting Started

### Account Setup
1. Visit [sam-fullstack.sam.ai](https://sam-fullstack.sam.ai)
2. Click **Get Started** and create an account with your email
3. You'll receive **50 free credits** on sign-up
4. Top up credits via the Billing page

### Signing In
- Click **Sign In** on the top-right
- Enter your email and password
- After login, your credit balance appears in the header

---

## 2. Architecture Overview

```
User (sam-fullstack.sam.ai)
       →  SAM AI Central API (samai.com/api)
       →  AI Providers (Gemini / Claude / OpenAI)
       →  Provider masking (customers never see internal names)
```

| Layer        | Technology                  |
|-------------|-------------------------------|
| Frontend    | Next.js + TypeScript + Tailwind CSS |
| Backend     | Node.js / Next.js API Routes  |
| Database    | PostgreSQL (primary) / MySQL  |
| ORM         | Prisma                       |
| Auth        | NextAuth.js / JWT            |
| Deployment  | Vercel / VPS (cPanel)        |
| Security    | HTTPS + Rate Limiting + Input Validation |

---

## 3. Dashboard Guide

The dashboard is organized as a **vertical stage sidebar** on the left with a **main content area** on the right.

### Sidebar
- **8 Development Stages** — Each stage is a clickable tab with its credit cost badge
- **Current Credit Balance** displayed at the top
- **Buy Credits** — Navigate to the billing page
- **Logout** — End your session

### Main Panel
- **Stage Header** — Title, icon, description, and credit cost
- **Form Section** — Input fields specific to the selected stage
- **Result Section** — Generated output with syntax highlighting
  - **Download** — Save output as a `.txt` file
  - **Copy** — Copy output to clipboard

### Navigation
- **Previous Stage** / **Next Stage** buttons at the bottom let you move through the workflow sequentially

---

## 4. The 8 Development Stages

| Stage | Cost | Description | Key Outputs |
|-------|------|-------------|-------------|
| **1. Requirements & Planning** | 3 | Analyze requirements, plan features & architecture | Project plan, tech stack, feature list, DB schema outline |
| **2. Project Scaffold** | 25 | Generate complete project structure & codebase | Full Next.js project with all directories, config files, package.json |
| **3. Frontend Development** | 10 | Build responsive UI components | Reusable React components, Tailwind styles, page layouts |
| **4. Backend & API** | 10 | Generate REST API endpoints & server logic | API routes, controllers, request/response schemas |
| **5. Database Design** | 8 | Design database schema & models | Prisma schema, SQL migrations, table relationships |
| **6. Authentication & Security** | 8 | JWT/OAuth, RBAC, sessions | Auth system, role definitions, middleware, security config |
| **7. Admin Dashboard** | 12 | Content & user management dashboard | Admin pages, data tables, charts, CMS components |
| **8. Deployment & CI/CD** | 6 | Production deployment configuration | Vercel config, Dockerfile, CI/CD workflows, env vars |

### Recommended Order
1. **Plan** → 2. **Database** → 3. **Backend** → 4. **Auth** → 5. **Frontend** → 6. **Admin** → 7. **Scaffold** → 8. **Deploy**

> You can also use stages independently — each operates standalone and integrates with the central API.

---

## 5. Sample Workflows

### Build a Complete SaaS Dashboard

1. **Plan** (`3` credits)
   - Prompt: `"Build a subscription billing SaaS dashboard for managing Stripe payments, customer accounts, and analytics. Target audience: SaaS founders."`

2. **Database** (`8` credits)
   - Prompt: `"Design a PostgreSQL schema for subscription billing with users, subscriptions, invoices, and payment methods."`

3. **Backend** (`10` credits)
   - Prompt: `"Create REST API endpoints for subscription CRUD, user management, and analytics queries."`

4. **Auth** (`8` credits)
   - Prompt: `"Implement JWT-based authentication with roles: admin, user, billing_admin."`

5. **Frontend** (`10` credits)
   - Prompt: `"Build a dark-mode dashboard with subscription cards, revenue charts, and a customer table."`

6. **Admin** (`12` credits)
   - Prompt: `"Generate an admin panel with user management, subscription overview, and system settings."`

10. **Deploy** (`6` credits)
    - Prompt: `"Set up Vercel deployment with CI/CD from GitHub, environment variables for Stripe and database URLs."`

**Total: 57 credits** for a production-ready SaaS application.

---

### Build a Full-Stack Portfolio Site

1. **Plan** → `"A personal portfolio site for a photographer with a gallery, about page, and contact form"`
2. **Scaffold** → Generate the complete Next.js project
3. **Deploy** → Configure Vercel with a custom domain

**Total: ~34 credits** for a live portfolio site.

---

## 6. Credit System

- **Pay only for what you use** — no subscriptions
- Credits **never expire** while your account is active
- Credits are **shared across all 50+ SAM AI services**
- If you run out of credits, the system shows a **payment required** screen prompting you to top up

### Credit Packs
| Credits | Price (USD) | Price (LKR) | Bonus |
|---------|-------------|-------------|-------|
| 50      | $5          | 1,500        | —     |
| 130     | $10         | 3,000        | +10   |
| 400     | $25         | 7,500        | +50   |
| 950     | $55         | 16,500       | +150  |
| 2,200   | $100        | 30,000       | +400  |

---

## 7. Troubleshooting

### Insufficient Credits
- **Error**: "Insufficient Credits" on the generate button
- **Fix**: Visit the Billing page to purchase a credit pack

### API Error on Generate
- **Cause**: Network timeout or service overload
- **Fix**: Retry the request. If it persists, contact support at enterprise@samai.com

### Output Not Displaying
- **Cause**: The AI returned an unexpected response format
- **Fix**: Check the raw JSON in the result section. You can also try rephrasing your prompt

### Login Issues
- Ensure your email is verified (check spam folder)
- Reset your password via the login page

### Deployment Issues
- Verify environment variables are set in your hosting provider
- Check that the API key is configured correctly
- Contact support with your domain details

---

**Support**: support@samai.com | **API Docs**: samai.com/docs | **Status**: status.samai.com
