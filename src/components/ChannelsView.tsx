import React, { useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  ExternalLink,
  Globe,
  Plus,
  Radio,
  RefreshCw,
  ShieldCheck,
  Trash2,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { useSuperPost } from '../context/SuperPostContext';
import { PLATFORM_CONFIGS } from '../data/platformConfigs';
import { PlatformId, SocialAccount } from '../types';

export const ChannelsView: React.FC = () => {
  const {
    accounts,
    toggleAccountConnection,
    connectAccount,
    disconnectAccount,
  } = useSuperPost();

  const [connectModalPlatform, setConnectModalPlatform] = useState<PlatformId | null>(null);
  const [handleInput, setHandleInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const connectedList = accounts.filter((a) => a.connected);

  const handleStartConnect = (platform: PlatformId) => {
    setConnectModalPlatform(platform);
    setHandleInput('');
    setNameInput('');
  };

  const handleCompleteOAuth = () => {
    if (!connectModalPlatform) return;
    setIsAuthorizing(true);

    setTimeout(() => {
      const config = PLATFORM_CONFIGS[connectModalPlatform];
      const finalName = nameInput.trim() || `${config.name} Official`;
      const finalHandle = handleInput.trim() || `@superpost_${connectModalPlatform}`;

      connectAccount(connectModalPlatform, finalHandle, finalName);
      setIsAuthorizing(false);
      setConnectModalPlatform(null);
    }, 800);
  };

  const handleSyncAccount = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      setSyncingId(null);
    }, 900);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-y-auto bg-[#0b0f17] p-4 sm:p-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Connected Channels & Integrations</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-normal">
              {connectedList.length} Connected
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Connect and manage direct publishing credentials across 28+ networks
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>OAuth 2.0 PKCE Enforced</span>
          </div>
        </div>
      </div>

      {/* Active Connected Accounts Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Active Connected Channels ({connectedList.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {connectedList.map((acc) => {
            const cfg = PLATFORM_CONFIGS[acc.platform];
            const isSyncing = syncingId === acc.id;

            return (
              <div
                key={acc.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={acc.avatarUrl}
                        alt={acc.name}
                        className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-700"
                      />
                      <img
                        src={cfg.icon}
                        alt={cfg.name}
                        className="w-5 h-5 rounded-md object-contain absolute -bottom-1 -right-1 ring-2 ring-slate-900 bg-black p-0.5"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-white truncate max-w-[140px]">
                        {acc.name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[140px] font-mono">
                        {acc.handle}
                      </div>
                    </div>
                  </div>

                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Followers</span>
                    <span className="font-bold text-white font-mono">
                      {acc.followerCount.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Status</span>
                    <span className="text-slate-300 flex items-center gap-1">
                      {acc.lastSync}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => handleSyncAccount(acc.id)}
                    className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync'}</span>
                  </button>

                  <button
                    onClick={() => disconnectAccount(acc.id)}
                    className="text-xs text-slate-500 hover:text-red-400 transition-colors p-1"
                    title="Disconnect account"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Available Platforms to Connect Catalog */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-400" />
              <span>Available Platforms Directory</span>
            </h3>
            <p className="text-xs text-slate-400">
              Select any of the supported channels to link via instant OAuth
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {(Object.keys(PLATFORM_CONFIGS) as PlatformId[]).map((pid) => {
            const cfg = PLATFORM_CONFIGS[pid];
            const isAlreadyConnected = accounts.some(
              (a) => a.platform === pid && a.connected
            );

            return (
              <div
                key={pid}
                className="p-3.5 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 p-2 flex items-center justify-center border border-slate-800 shrink-0">
                    <img
                      src={cfg.icon}
                      alt={cfg.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-white truncate">
                      {cfg.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {cfg.category.toUpperCase()} • Max {cfg.charLimit > 10000 ? 'Unlimited' : cfg.charLimit} chars
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleStartConnect(pid)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                    isAlreadyConnected
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                  }`}
                >
                  {isAlreadyConnected ? '+ Add Another' : 'Connect'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulated OAuth Connect Modal */}
      {connectModalPlatform && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-[#0f172a] border border-slate-700 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setConnectModalPlatform(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 p-3 mx-auto flex items-center justify-center shadow-lg">
                <img
                  src={PLATFORM_CONFIGS[connectModalPlatform].icon}
                  alt={PLATFORM_CONFIGS[connectModalPlatform].name}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-base font-bold text-white">
                Authorize {PLATFORM_CONFIGS[connectModalPlatform].name}
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                SuperPost needs authorization to publish posts, upload media, and retrieve engagement analytics.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Account Display Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp Official"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Username / Handle
                </label>
                <input
                  type="text"
                  placeholder="@handle or company/id"
                  value={handleInput}
                  onChange={(e) => setHandleInput(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5 text-[11px] text-slate-400">
              <div className="font-semibold text-slate-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Requested Scopes:</span>
              </div>
              <ul className="list-disc pl-4 space-y-0.5 text-[10px]">
                <li>Publish content and schedule queues</li>
                <li>Upload video and carousel media assets</li>
                <li>Read engagement statistics and view metrics</li>
              </ul>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setConnectModalPlatform(null)}
                className="w-1/2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteOAuth}
                disabled={isAuthorizing}
                className="w-1/2 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1.5"
              >
                {isAuthorizing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Authorizing...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Link</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
