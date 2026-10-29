import React from 'react';
import {
  BarChart3,
  Bot,
  Calendar,
  CreditCard,
  FileText,
  FolderOpen,
  HelpCircle,
  Layers,
  Radio,
  Settings,
  ShieldAlert,
  Sparkles,
  Terminal,
  Users,
} from 'lucide-react';
import { useSuperPost } from '../context/SuperPostContext';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    posts,
    accounts,
    setRepoAnalysisModalOpen,
  } = useSuperPost();

  const scheduledCount = posts.filter((p) => p.status === 'scheduled').length;
  const connectedAccountsCount = accounts.filter((a) => a.connected).length;

  const navItems = [
    {
      id: 'calendar',
      label: 'Calendar',
      icon: Calendar,
      badge: scheduledCount > 0 ? scheduledCount : undefined,
      description: 'Schedule & visualize',
    },
    {
      id: 'posts',
      label: 'Launches',
      icon: FileText,
      description: 'Drafts, queue & logs',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      description: 'Cross-channel insights',
    },
    {
      id: 'channels',
      label: 'Channels',
      icon: Radio,
      badge: `${connectedAccountsCount} active`,
      description: '28+ platforms',
    },
    {
      id: 'media',
      label: 'Media Library',
      icon: FolderOpen,
      description: 'Images, videos & audio',
    },
    {
      id: 'agents',
      label: 'AI Copilot & Agents',
      icon: Bot,
      highlight: true,
      description: 'Autonomous workflows',
    },
    {
      id: 'team',
      label: 'Team & RBAC',
      icon: Users,
      description: 'Workspaces & roles',
    },
    {
      id: 'billing',
      label: 'Plans & Billing',
      icon: CreditCard,
      description: 'Lifetime & Pro tiers',
    },
    {
      id: 'admin',
      label: 'Admin Portal',
      icon: ShieldAlert,
      badge: 'Root',
      description: 'System health & user mgmt',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'Webhooks & API keys',
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800/80 bg-[#0b0f17]/95 flex flex-col justify-between p-3.5 h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="space-y-6">
        {/* Navigation list */}
        <div className="space-y-1">
          <div className="px-3 pb-1 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            Menu
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/25 to-violet-600/20 text-white border border-indigo-500/30 shadow-md shadow-indigo-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-indigo-500 text-white shadow-sm shadow-indigo-500/30'
                        : item.highlight
                        ? 'bg-violet-950/60 text-violet-400 group-hover:bg-violet-900/60'
                        : 'bg-slate-800/70 text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-left truncate">
                    <div className="truncate font-medium">{item.label}</div>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-indigo-500/30 text-indigo-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Repository Analysis Callout Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-b from-indigo-950/40 via-slate-900/60 to-slate-900/90 border border-indigo-500/20 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300">
              <Terminal className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-200">
              Postiz → SuperPost
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
            Full codebase architectural breakdown & monorepo analysis report.
          </p>
          <button
            onClick={() => setRepoAnalysisModalOpen(true)}
            className="w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Read Architecture Report</span>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] text-slate-500 px-2">
          <span>Engine Status</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Operational
          </span>
        </div>
        <div className="px-2 text-[10px] text-slate-600">
          SuperPost v2.1.0-alpha • Temporal Queues Active
        </div>
      </div>
    </aside>
  );
};
