import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  ChevronDown,
  Flame,
  Globe,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react';
import { useSuperPost } from '../context/SuperPostContext';
import { PLATFORM_CONFIGS } from '../data/platformConfigs';
import { PlatformId } from '../types';

export const Header: React.FC = () => {
  const {
    activeWorkspace,
    workspaces,
    setActiveWorkspace,
    openComposer,
    setRepoAnalysisModalOpen,
    searchQuery,
    setSearchQuery,
    selectedPlatformFilter,
    setSelectedPlatformFilter,
    notificationDrawerOpen,
    setNotificationDrawerOpen,
    posts,
  } = useSuperPost();

  const [workspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  const scheduledCount = posts.filter((p) => p.status === 'scheduled').length;

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-slate-800/80 bg-[#0f172a]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Brand & Workspace Selector */}
      <div className="flex items-center gap-4 sm:gap-6 min-w-0">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
            <Zap className="w-5 h-5 text-white fill-white" />
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ring-slate-900"></span>
            </span>
          </div>

          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                SuperPost
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-none">
              Social Command Center
            </p>
          </div>
        </div>

        {/* Workspace Dropdown */}
        <div className="relative">
          <button
            onClick={() => setWorkspaceDropdownOpen(!workspaceDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60 hover:border-slate-600 text-xs text-slate-200 transition-colors shadow-sm"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="truncate max-w-[130px] sm:max-w-[180px] font-medium">
              {activeWorkspace.name}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {workspaceDropdownOpen && (
            <div className="absolute left-0 mt-2 w-64 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-2xl p-2 z-50 backdrop-blur-xl">
              <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Workspaces
              </div>
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    setActiveWorkspace(ws);
                    setWorkspaceDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-colors ${
                    activeWorkspace.id === ws.id
                      ? 'bg-indigo-600/20 text-indigo-300 font-medium border border-indigo-500/30'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex flex-col items-start truncate">
                    <span className="truncate font-semibold">{ws.name}</span>
                    <span className="text-[10px] text-slate-400">
                      {ws.channelsConnected} channels • {ws.plan}
                    </span>
                  </div>
                  {activeWorkspace.id === ws.id && (
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center Search & Filter */}
      <div className="hidden md:flex items-center gap-2 max-w-md w-full">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search posts, tags, or channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-700/50 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Platform Filter Button */}
        <div className="relative">
          <button
            onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors ${
              selectedPlatformFilter !== 'all'
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                : 'bg-slate-900/60 border-slate-700/50 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="capitalize">
              {selectedPlatformFilter === 'all' ? 'All Channels' : selectedPlatformFilter}
            </span>
          </button>

          {filterDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-2xl p-2 z-50 backdrop-blur-xl">
              <button
                onClick={() => {
                  setSelectedPlatformFilter('all');
                  setFilterDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-xs ${
                  selectedPlatformFilter === 'all'
                    ? 'bg-indigo-600/20 text-indigo-300 font-medium'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>All 28+ Channels</span>
                {selectedPlatformFilter === 'all' && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                )}
              </button>
              <div className="my-1 border-t border-slate-800" />
              {(Object.keys(PLATFORM_CONFIGS) as PlatformId[]).map((pid) => (
                <button
                  key={pid}
                  onClick={() => {
                    setSelectedPlatformFilter(pid);
                    setFilterDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-xs ${
                    selectedPlatformFilter === pid
                      ? 'bg-indigo-600/20 text-indigo-300 font-medium'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <img
                    src={PLATFORM_CONFIGS[pid].icon}
                    alt={PLATFORM_CONFIGS[pid].name}
                    className="w-4 h-4 rounded-sm object-contain"
                  />
                  <span className="truncate">{PLATFORM_CONFIGS[pid].name}</span>
                  {selectedPlatformFilter === pid && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions, Repo Analysis & CTA */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Architecture & Repo Analysis trigger */}
        <button
          onClick={() => setRepoAnalysisModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-950/40 hover:bg-violet-900/50 border border-violet-500/30 text-violet-300 text-xs font-semibold transition-all hover:scale-[1.02] shadow-sm shadow-violet-500/10 cursor-pointer"
          title="Inspect Postiz to SuperPost Architecture & codebase deep-dive"
        >
          <Terminal className="w-3.5 h-3.5 text-violet-400" />
          <span className="hidden lg:inline">Repo Analysis</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
          </span>
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => setNotificationDrawerOpen(!notificationDrawerOpen)}
          className="relative p-2 rounded-xl bg-slate-900/60 border border-slate-700/50 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {scheduledCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-slate-900">
              {scheduledCount}
            </span>
          )}
        </button>

        {/* Create Post Button */}
        <button
          onClick={() => openComposer()}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 ring-1 ring-white/20 transition-all hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Create Post</span>
        </button>
      </div>
    </header>
  );
};
