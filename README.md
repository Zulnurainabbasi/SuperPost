# 🚀 SuperPost — The Open Social Media Command Center

<div align="center">
  <img src="/icons/platforms/x.png" width="32" alt="X"/>
  <img src="/icons/platforms/linkedin.png" width="32" alt="LinkedIn"/>
  <img src="/icons/platforms/instagram.png" width="32" alt="Instagram"/>
  <img src="/icons/platforms/tiktok.png" width="32" alt="TikTok"/>
  <img src="/icons/platforms/youtube.png" width="32" alt="YouTube"/>
  <img src="/icons/platforms/threads.png" width="32" alt="Threads"/>
  <img src="/icons/platforms/bluesky.png" width="32" alt="Bluesky"/>
  <img src="/icons/platforms/facebook.png" width="32" alt="Facebook"/>
  <img src="/icons/platforms/reddit.png" width="32" alt="Reddit"/>
  <img src="/icons/platforms/pinterest.png" width="32" alt="Pinterest"/>
  <img src="/icons/platforms/telegram.png" width="32" alt="Telegram"/>
  <img src="/icons/platforms/discord.png" width="32" alt="Discord"/>
</div>

<br/>

**SuperPost** (evolution of the Postiz open-source platform) is a modern, self-hostable all-in-one social media management, automated scheduling, and analytics command center. Designed as an open, developer-first alternative to Buffer, Hootsuite, and Sprout Social.

---

## ⚡ 1-Click Deploy to Vercel

Deploy your own SuperPost instance to **Vercel** with zero configuration:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/gitroomhq/postiz-app&env=GEMINI_API_KEY,APP_URL,JWT_SECRET)

### Quick Vercel Setup:
1. Clone the repository or click the **Deploy with Vercel** button above.
2. In the Vercel Dashboard, configure the environment variables:
   - `GEMINI_API_KEY`: Your Google Gemini API key for instant AI hook generation & copilot drafting.
   - `APP_URL`: Your Vercel production domain (e.g., `https://superpost.vercel.app`).
   - `JWT_SECRET`: Random 32+ character hex string for session hashing.
3. Click **Deploy**. Vercel will build the frontend and deploy the serverless API handlers in `api/index.ts`.

---

## 🏗️ Architecture & Technical Analysis

SuperPost is built on an enterprise monorepo architecture:

```
superpost/
├── api/                    # Vercel Serverless Function entrypoints
├── apps/
│   ├── backend/            # NestJS REST API & Public Gateway
│   ├── orchestrator/       # Temporal.io Distributed Worker Engine
│   ├── frontend/           # Next.js 14/15 / React SPA + Tailwind CSS
│   ├── extension/          # Chromium MV3 Web Clipper Extension
│   └── sdk/                # @superpost/node TypeScript client SDK
├── libraries/
│   ├── nestjs-libraries/   # Prisma ORM, 28+ Social Providers, AI & Payments
│   ├── react-shared-libraries/ # Shared UI components & i18n localization
│   └── helpers/            # Subdomain routing, URL cleaners, markdown parsers
├── server.ts               # Full-Stack Express Server with Gemini AI Proxy
├── vercel.json             # Vercel deployment & rewrite configuration
└── src/                    # SuperPost unified studio frontend
```

### 1. Backend Architecture (NestJS / Express 3-Tier Pattern)
- **Layering Standard**: Strictly isolates concerns:
  `DTO (Data Transfer Object) → Controller (HTTP Routing) → Service (Business Logic) → Repository (Prisma/DB)`.
- **RBAC & Multi-Tenancy**: Built-in organization tenancy with role hierarchy (`Owner`, `Admin`, `Editor`, `Viewer`) guarded by CASL permissions.
- **MCP Server & Public Gateway**: Model Context Protocol (MCP) server endpoints allowing external AI agents (ChatGPT, Claude, Cursor) to programmatically schedule posts.

### 2. Database Schema (Prisma ORM + PostgreSQL)
SuperPost's data layer models real-world social publishing at scale:
- **`Organization` & `OrganizationUser`**: Multi-tenant workspace partitioning and team membership.
- **`Integration`**: Stores per-provider OAuth tokens, refresh tokens, scopes, and target channel IDs.
- **`Post` & `PostVersion`**: Supports drafts, scheduling timestamps, and channel-specific copy variants (e.g. 280 chars on X vs 3,000 on LinkedIn).
- **`Media` & `Analytics`**: Cloudflare R2 / S3 storage keys, aspect ratio validations, and engagement tracking (impressions, likes, comments, shares, link CTR).

### 3. Background Job Orchestration (Temporal.io)
SuperPost uses **Temporal.io stateful workflows** instead of basic cron jobs:
- `post.workflow.ts`: Computes exact sleep timers (`scheduledAt - Date.now()`) with automatic retry policies.
- `refresh.token.workflow.ts`: Continuously renews expiring OAuth credentials.
- `firstComment` timer: Automatically drops links and hashtags 60 seconds after publication.

### 4. Admin Management Portal
SuperPost includes an in-app **Root Admin Portal** accessible directly from the sidebar:
- **System Telemetry**: Real-time Node.js memory heap usage, server uptime, database query latency, and Redis queue status.
- **Global User Directory**: Inspect all registered accounts, change roles, and suspend/activate users.
- **Error Log Monitor**: Live stream of system exceptions, rate-limit warnings, and failed webhook attempts.
- **Provider Switchboard**: Toggle individual channel APIs (X API v2, Meta Graph, TikTok for Business, LinkedIn OAuth) across all workspaces.
- **REST API Tester**: Interactive console to test live endpoints (`/api/health`, `/api/admin/stats`, `/api/ai/generate`).

---

## 🔌 Supported Social Media Channels (28+)

| Channel | Features Supported | Char Limit |
|---|---|---|
| **X (Twitter)** | Tweets, Threads, Images, Video, Polls | 280 |
| **LinkedIn** | Personal Profiles, Company Pages, Carousels, First Comment | 3,000 |
| **Instagram** | Feed Photos, Carousels, Reels, First Comment | 2,200 |
| **TikTok** | Vertical Video (9:16), Music Tags, Commercial Disclosures | 2,200 |
| **YouTube** | YouTube Shorts, Descriptions, Tags, Thumbnails | 5,000 |
| **Facebook** | Pages, Media, Carousels, Comments | 63,206 |
| **Threads** | Posts, Threads, Images | 500 |
| **Bluesky** | AT Protocol Broadcasts, Images | 300 |
| **Reddit** | Subreddit Publishing, Flair, Titles | 40,000 |
| **Pinterest** | Pins, Destination URLs, Board Selection | 500 |
| **Telegram** | Broadcast Channels, Markdown Embeds | 4,096 |
| **Discord** | Webhook Announcements, Formatted Embeds | 2,000 |
| **Medium** | Long-form Thought Leadership Articles | 100,000 |

---

## 🛠️ Local Development

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env

# 3. Start development server (Port 3000)
npm run dev

# 4. Build for production
npm run build
```

---

## 📄 License
AGPL-3.0 / MIT Dual License. Designed & engineered for open-source social media autonomy.
