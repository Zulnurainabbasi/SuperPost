import React from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  ExternalLink,
  Flame,
  Radio,
  Sparkles,
  X,
} from 'lucide-react';
import { useSuperPost } from '../context/SuperPostContext';
import { PLATFORM_CONFIGS } from '../data/platformConfigs';

export const NotificationDrawer: React.FC = () => {
  const {
    notificationDrawerOpen,
    setNotificationDrawerOpen,
    posts,
    openComposer,
    setActiveTab,
  } = useSuperPost();

  if (!notificationDrawerOpen) return null;

  const scheduled = posts.filter((p) => p.status === 'scheduled');

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md h-full bg-[#0f172a] border-l border-slate-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Notifications & Queue</h3>
              <p className="text-[11px] text-slate-400">Scheduled launches & channel alerts</p>
            </div>
          </div>
          <button
            onClick={() => setNotificationDrawerOpen(false)}
            className="p-1 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5">
          {/* Smart Tip Alert */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-500/30 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Flame className="w-4 h-4" />
              <span>Audience Peak Window Active</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Wednesday afternoons show +42% higher click-through on X and LinkedIn. Schedule your next launch now.
            </p>
            <button
              onClick={() => {
                setNotificationDrawerOpen(false);
                openComposer();
              }}
              className="mt-2 text-xs text-amber-400 hover:underline font-semibold"
            >
              Draft post for peak time →
            </button>
          </div>

          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider pt-2">
            Upcoming Scheduled Queue ({scheduled.length})
          </div>

          {scheduled.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No posts currently in queue.
            </div>
          ) : (
            scheduled.map((p) => {
              const d = new Date(p.scheduledAt);
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    setNotificationDrawerOpen(false);
                    openComposer(p);
                  }}
                  className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all space-y-2"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1">
                      {p.platforms.map((pid) => (
                        <img
                          key={pid}
                          src={PLATFORM_CONFIGS[pid]?.icon || '/icons/platforms/x.png'}
                          alt={pid}
                          className="w-3.5 h-3.5 object-contain"
                        />
                      ))}
                    </div>
                    <span className="text-slate-400 font-mono text-[10px] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {d.toLocaleDateString([], { month: 'short', day: 'numeric' })}{' '}
                      {d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed font-normal">
                    {p.content}
                  </p>
                </div>
              );
            })
          )}

          {/* System status item */}
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>All 8 Channels Synced</span>
            </div>
            <p className="text-[11px] text-slate-400">
              OAuth tokens refreshed. Temporal background queue worker is operating normally.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <button
            onClick={() => {
              setNotificationDrawerOpen(false);
              setActiveTab('posts');
            }}
            className="text-xs text-indigo-400 hover:underline font-semibold"
          >
            View Full Queue
          </button>
          <button
            onClick={() => setNotificationDrawerOpen(false)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
