import React, { useState } from 'react';
import {
  BookOpen,
  Boxes,
  CheckCircle2,
  Code2,
  Cpu,
  Database,
  ExternalLink,
  FileCode2,
  GitBranch,
  Layers,
  Network,
  Rocket,
  ShieldAlert,
  Sparkles,
  Terminal,
  Workflow,
  X,
  Zap,
} from 'lucide-react';
import { useSuperPost } from '../context/SuperPostContext';

export const RepositoryAnalysisModal: React.FC = () => {
  const { repoAnalysisModalOpen, setRepoAnalysisModalOpen } = useSuperPost();
  const [activeSection, setActiveSection] = useState<'overview' | 'architecture' | 'orchestrator' | 'database' | 'superpost'>('overview');

  if (!repoAnalysisModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#0f172a] border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Postiz Repository Architecture Deep-Dive</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Analysis Verified
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Senior engineering inspection of the codebase, monorepo packages, and transition to SuperPost
              </p>
            </div>
          </div>

          <button
            onClick={() => setRepoAnalysisModalOpen(false)}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 py-2.5 border-b border-slate-800 bg-slate-950/60 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'overview' as const, label: 'Executive Overview', icon: BookOpen },
            { id: 'architecture' as const, label: 'Monorepo Stack (NestJS + Next.js)', icon: Boxes },
            { id: 'orchestrator' as const, label: 'Temporal.io Worker Engine', icon: Workflow },
            { id: 'database' as const, label: 'Prisma Schema & Integrations', icon: Database },
            { id: 'superpost' as const, label: 'SuperPost Deployment', icon: Rocket },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 leading-relaxed font-sans">
          {activeSection === 'overview' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-400" />
                  <span>What is Postiz?</span>
                </h4>
                <p>
                  Postiz (created by Gitroom) is an open-source, full-featured social media scheduling, automation, and analytics suite built to challenge closed enterprise solutions like Buffer, Hootsuite, and Sprout Social. It supports automated scheduling across <strong>28+ social media networks</strong>, including X/Twitter, LinkedIn (Profiles & Company Pages), Instagram (Direct, Carousel & Reels), TikTok, YouTube Shorts, Threads, Bluesky, Reddit, Pinterest, Telegram, Discord, and Mastodon.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Repository Type</span>
                  <div className="font-bold text-white text-sm">PNPM Monorepo</div>
                  <p className="text-[11px] text-slate-400">Turborepo-driven multi-service layout with shared libraries</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Background Engine</span>
                  <div className="font-bold text-white text-sm">Temporal.io Workers</div>
                  <p className="text-[11px] text-slate-400">Distributed, resilient stateful workflows with heartbeats</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Data Layer</span>
                  <div className="font-bold text-white text-sm">Prisma + PostgreSQL</div>
                  <p className="text-[11px] text-slate-400">Type-safe relational database with Redis caching</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Key Functional Pillars</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                  <li className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Omni-Channel Calendar:</strong> Visual scheduling grid with time slots, timezone adaptation, and instant previews.</span>
                  </li>
                  <li className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Platform-Specific Customizations:</strong> Real-time character counts, aspect ratio validations, and first-comment drops.</span>
                  </li>
                  <li className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>AI Copilot & Autonomous Agents:</strong> MCP relay integration, tone rewriting, hook generation, and thread formatting.</span>
                  </li>
                  <li className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Multi-Tenancy & RBAC:</strong> Workspaces, team memberships, role hierarchies (Owner, Admin, Editor, Viewer).</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeSection === 'architecture' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white">Monorepo Package & Service Layout</h4>
              <p>The repository uses <strong>pnpm workspaces</strong> to coordinate 4 application packages and 3 shared internal libraries:</p>

              <div className="space-y-3 font-mono text-[11px]">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-indigo-400 font-bold">📂 apps/backend (NestJS REST API)</div>
                  <div className="text-slate-400">
                    • Handles client requests, OAuth callbacks, JWT session verification.<br />
                    • Strict 3-tier layering: DTO → Controller → Service → Repository.<br />
                    • Public API gateway with rate-limiting, MCP server endpoint, and webhook dispatcher.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-sky-400 font-bold">📂 apps/frontend (Next.js / React)</div>
                  <div className="text-slate-400">
                    • SWR data fetching with custom hooks (`useFetch`).<br />
                    • Tailwind CSS + Mantine primitives.<br />
                    • Rich interactive views for Calendar, Launches, Analytics, Media Library, and Settings.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-purple-400 font-bold">📂 apps/orchestrator (Temporal.io Worker)</div>
                  <div className="text-slate-400">
                    • Executes background jobs, timed workflows, retry loops.<br />
                    • Activities: `post.activity.ts`, `media.activity.ts`, `clipping.activity.ts`, `email.activity.ts`.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-emerald-400 font-bold">📂 apps/extension (Chrome MV3 Extension)</div>
                  <div className="text-slate-400">
                    • Background service worker and content script for 1-click clipping from X, Reddit, and web articles directly into drafts.
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-amber-400 font-bold">📂 libraries/ (Shared Libraries)</div>
                  <div className="text-slate-400">
                    • `nestjs-libraries`: Prisma database client, 28+ social network providers, email & payment gateways.<br />
                    • `react-shared-libraries`: Form controls, Mantine wrapper, and i18n translation engine (15+ locales).<br />
                    • `helpers`: Subdomain routing, URL cleaners, and markdown sanitizers.
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'orchestrator' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Workflow className="w-4 h-4 text-purple-400" />
                <span>Temporal.io Distributed Workflows</span>
              </h4>
              <p>
                Unlike basic cron jobs, Postiz relies on <strong>Temporal.io</strong> for rock-solid distributed scheduling:
              </p>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 font-mono text-[11px]">
                <div className="text-purple-300 font-bold">Workflow Lifecycle (e.g. `post.workflow.v1.1.2.ts`)</div>
                <div className="space-y-1 text-slate-400">
                  <div>1. Post scheduled by user → Backend starts Temporal workflow with timer `sleep(scheduledTime - now)`</div>
                  <div>2. Timer awakens → Orchestrator executes `post.activity.ts` with exponential retry policy</div>
                  <div>3. Social provider API (e.g. Meta Graph API, X API v2) called with authorization token</div>
                  <div>4. If token expired, invokes `refresh.token.workflow.ts` automatically</div>
                  <div>5. After main post succeeds, timer waits 60s and executes `firstComment` activity</div>
                  <div>6. Analytics worker polls platform metrics 2h, 24h, and 7d post-launch</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px]">
                <strong>Developer Note from CLAUDE.md:</strong> Workflows must never be mutated in-place on `main`; new versions (e.g. v1.1.2) are published to preserve in-flight executions.
              </div>
            </div>
          )}

          {activeSection === 'database' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Prisma Schema & Relational Models</span>
              </h4>
              <p>
                The database schema located at `libraries/nestjs-libraries/src/database/prisma/schema.prisma` models a complete SaaS architecture:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-indigo-400">Organization & Tenancy</div>
                  <p className="text-slate-400">`Organization`, `OrganizationUser`, `Subscription`, `PricingTier` handle multi-user accounts and Stripe/RevenueCat billing.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-sky-400">Integrations & Credentials</div>
                  <p className="text-slate-400">`Integration` securely stores access tokens, refresh tokens, scopes, and target channel IDs per provider.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-pink-400">Posts & Publishing State</div>
                  <p className="text-slate-400">`Post`, `PostVersion`, `Tag`, `Comment` handle drafts, multi-platform copy variants, media attachments, and scheduling timestamps.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="font-bold text-emerald-400">Media & Analytics</div>
                  <p className="text-slate-400">`Media` stores storage keys and metadata (aspect ratios, formats); `Analytics` records impressions, likes, and click tracking.</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'superpost' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/40 to-violet-950/40 border border-indigo-500/30 space-y-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-indigo-400" />
                  <span>The SuperPost Evolution</span>
                </h4>
                <p>
                  Per your request, we transformed and deployed this platform under the sleek, modern brand <strong>SuperPost</strong>.
                </p>
              </div>

              <div className="space-y-2 text-[11px]">
                <div className="font-bold text-slate-300">Key Enhancements in this Deployment:</div>
                <ul className="list-disc pl-4 space-y-1 text-slate-400">
                  <li><strong>Refreshed Brand Identity:</strong> Sleek dark-mode aesthetic with SuperPost gradient badges, polished typography (Plus Jakarta Sans), and modern glassmorphism.</li>
                  <li><strong>Unified Interactive Studio:</strong> Fast browser-native calendar, multi-channel composer with real-time feed previews for X, LinkedIn, Instagram, TikTok, and YouTube.</li>
                  <li><strong>AI Copilot Integration:</strong> Built-in hook generation, tone adaptation, hashtag recommendation, and autonomous agent workflows.</li>
                  <li><strong>Local Persistence:</strong> All user actions—post scheduling, account linking, media uploads, and team modifications—persist reliably in browser storage.</li>
                  <li><strong>Complete Asset Library:</strong> Includes all native platform icons and graphics extracted directly from the upstream repository.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            Analysis conducted on postiz-app-main repository
          </span>
          <button
            onClick={() => setRepoAnalysisModalOpen(false)}
            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
