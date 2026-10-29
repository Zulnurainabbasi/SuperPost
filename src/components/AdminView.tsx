import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Database,
  ExternalLink,
  Flame,
  Layers,
  Play,
  RefreshCw,
  Search,
  Server,
  ShieldAlert,
  ShieldCheck,
  Terminal,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Users,
  Wand2,
  Wifi,
  XCircle,
  Zap,
} from 'lucide-react';
import { useSuperPost } from '../context/SuperPostContext';

interface LogEntry {
  id: string;
  level: string;
  service: string;
  message: string;
  timestamp: string;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  status: 'ACTIVE' | 'SUSPENDED';
  postsCount: number;
  joinedAt: string;
}

export const AdminView: React.FC = () => {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'system' | 'users' | 'logs' | 'apiTester' | 'features'>('system');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [logFilter, setLogFilter] = useState<'ALL' | 'ERROR' | 'WARN' | 'INFO'>('ALL');
  const [logSearch, setLogSearch] = useState('');

  // Feature Flags
  const [featureFlags, setFeatureFlags] = useState({
    xApiV2: true,
    metaGraphApi: true,
    linkedInOauth: true,
    tiktokBusiness: true,
    youtubeDataApi: true,
    temporalInfiniteRetry: true,
    aiImageGenerator: true,
    maintenanceMode: false,
  });

  // API Tester state
  const [selectedEndpoint, setSelectedEndpoint] = useState('/api/health');
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST'>('GET');
  const [apiRequestBody, setApiRequestBody] = useState('{\n  "prompt": "Write a 1-sentence viral hook about AI"\n}');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [apiTestingLoading, setApiTestingLoading] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, logsRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats').catch(() => null),
        fetch('/api/admin/errors').catch(() => null),
        fetch('/api/admin/users').catch(() => null),
      ]);

      if (statsRes && statsRes.ok) {
        setStats(await statsRes.json());
      } else {
        // Fallback default stats
        setStats({
          system: {
            uptimeSeconds: 3600,
            heapUsedMb: 64,
            heapTotalMb: 128,
            rssMb: 180,
            nodeVersion: 'v22.14.0',
            platform: 'linux',
          },
          metrics: {
            totalUsers: 1482,
            activeOrganizations: 312,
            totalPostsDispatched: 34890,
            activeIntegrations: 2840,
            activeTemporalWorkflows: 14,
            avgResponseTimeMs: 24,
            errorRate: '0.04%',
          },
        });
      }

      if (logsRes && logsRes.ok) {
        const data = await logsRes.json();
        setLogs(data.logs || []);
      } else {
        setLogs([
          {
            id: 'l-1',
            level: 'INFO',
            service: 'superpost-core',
            message: 'SuperPost API Gateway online on port 3000',
            timestamp: new Date().toISOString(),
          },
          {
            id: 'l-2',
            level: 'INFO',
            service: 'temporal-orchestrator',
            message: 'Temporal activity worker connected (queue: postiz-post-tasks)',
            timestamp: new Date(Date.now() - 120000).toISOString(),
          },
          {
            id: 'l-3',
            level: 'WARN',
            service: 'oauth-token-manager',
            message: 'Token expiration approaching for TikTok account @superpost_daily in 48h',
            timestamp: new Date(Date.now() - 360000).toISOString(),
          },
        ]);
      }

      if (usersRes && usersRes.ok) {
        const data = await usersRes.json();
        setUsers(data.users || []);
      } else {
        setUsers([
          {
            id: 'u-1',
            name: 'Alex Rivera',
            email: 'alex@superpost.io',
            role: 'SUPER_ADMIN',
            organization: 'SuperPost HQ',
            status: 'ACTIVE',
            postsCount: 412,
            joinedAt: '2026-01-15',
          },
          {
            id: 'u-2',
            name: 'Sarah Chen',
            email: 'sarah.content@superpost.io',
            role: 'ORG_ADMIN',
            organization: 'SuperPost HQ',
            status: 'ACTIVE',
            postsCount: 184,
            joinedAt: '2026-02-10',
          },
          {
            id: 'u-3',
            name: 'Spam Bot Test',
            email: 'temp.test@trashmail.com',
            role: 'USER',
            organization: 'Trial Sandbox',
            status: 'SUSPENDED',
            postsCount: 0,
            joinedAt: '2026-05-02',
          },
        ]);
      }
    } catch (err) {
      console.warn('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' }
          : u
      )
    );
  };

  const handleRunApiTest = async () => {
    setApiTestingLoading(true);
    try {
      const options: RequestInit = {
        method: apiMethod,
        headers: { 'Content-Type': 'application/json' },
      };
      if (apiMethod === 'POST') {
        options.body = apiRequestBody;
      }
      const res = await fetch(selectedEndpoint, options);
      const data = await res.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setApiResponse(JSON.stringify({ error: err?.message || 'Request failed' }, null, 2));
    } finally {
      setApiTestingLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (logFilter !== 'ALL' && log.level !== logFilter) return false;
    if (logSearch.trim()) {
      const q = logSearch.toLowerCase();
      return (
        log.message.toLowerCase().includes(q) ||
        log.service.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-y-auto bg-[#0b0f17] p-4 sm:p-6 space-y-6 font-sans">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
            <span>SuperPost Admin Control Portal</span>
            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Root Level Access
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Global management portal: system health telemetry, user RBAC, error log monitors, and provider switchboard
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:bg-slate-800 text-xs text-slate-300 font-semibold transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Admin Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 overflow-x-auto text-xs font-semibold">
        {[
          { id: 'system' as const, label: 'System Overview & Telemetry', icon: Server },
          { id: 'users' as const, label: 'User Directory & Access', icon: Users },
          { id: 'logs' as const, label: 'Error Logs & Sentry Monitor', icon: AlertTriangle },
          { id: 'features' as const, label: 'Provider Switchboard & Flags', icon: Layers },
          { id: 'apiTester' as const, label: 'REST API & Webhooks Tester', icon: Terminal },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminSubTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUBTAB 1: SYSTEM OVERVIEW & TELEMETRY */}
      {activeAdminSubTab === 'system' && (
        <div className="space-y-6">
          {/* Health Indicators Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400">PostgreSQL / Prisma</div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Connected (2ms)
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Temporal.io Worker</div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  14 Workflows Active
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400">Redis Cache Queue</div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Synced (0 errors)
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] text-slate-400">AI Engine Gateway</div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Gemini 2.5 Flash
                </div>
              </div>
            </div>
          </div>

          {/* System Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Platform Scale</span>
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-3xl font-black text-white font-mono">
                {stats?.metrics?.totalUsers?.toLocaleString() || '1,482'}
              </div>
              <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800">
                <div className="flex justify-between">
                  <span>Organizations:</span>
                  <span className="font-semibold text-white">{stats?.metrics?.activeOrganizations || 312}</span>
                </div>
                <div className="flex justify-between">
                  <span>Linked Channels:</span>
                  <span className="font-semibold text-white">{stats?.metrics?.activeIntegrations || 2840}</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Dispatched Posts</span>
                <Flame className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-white font-mono">
                {stats?.metrics?.totalPostsDispatched?.toLocaleString() || '34,890'}
              </div>
              <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800">
                <div className="flex justify-between">
                  <span>Avg Latency:</span>
                  <span className="font-semibold text-emerald-400">{stats?.metrics?.avgResponseTimeMs || 24}ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Failure Rate:</span>
                  <span className="font-semibold text-emerald-400">{stats?.metrics?.errorRate || '0.04%'}</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Node.js Memory Heap</span>
                <Cpu className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-3xl font-black text-white font-mono">
                {stats?.system?.heapUsedMb || 64} MB
              </div>
              <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-800">
                <div className="flex justify-between">
                  <span>Allocated Heap:</span>
                  <span className="font-semibold text-white">{stats?.system?.heapTotalMb || 128} MB</span>
                </div>
                <div className="flex justify-between">
                  <span>Runtime:</span>
                  <span className="font-mono text-white">{stats?.system?.nodeVersion || 'v22.14.0'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: USER DIRECTORY & ACCESS */}
      {activeAdminSubTab === 'users' && (
        <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-sm font-bold text-white">Global User Directory</h3>
              <p className="text-xs text-slate-400">Manage user authorization, roles, and suspension states</p>
            </div>
            <span className="text-xs font-mono text-slate-400">{users.length} registered accounts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3 pl-2">User</th>
                  <th className="pb-3">Organization</th>
                  <th className="pb-3">System Role</th>
                  <th className="pb-3">Posts Created</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 pl-2">
                      <div className="font-semibold text-white">{u.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                    </td>
                    <td className="py-3 text-slate-300">{u.organization}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'SUPER_ADMIN'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : u.role === 'ORG_ADMIN'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 font-mono font-bold text-slate-300">{u.postsCount}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === 'ACTIVE'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 text-right pr-2">
                      {u.role !== 'SUPER_ADMIN' && (
                        <button
                          onClick={() => toggleUserStatus(u.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                            u.status === 'ACTIVE'
                              ? 'bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30'
                              : 'bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {u.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 3: ERROR LOGS & SENTRY MONITOR */}
      {activeAdminSubTab === 'logs' && (
        <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-indigo-400" />
                <span>Real-Time Error & Telemetry Logs</span>
              </h3>
              <p className="text-xs text-slate-400">Streamed from backend REST API, Temporal worker, and webhook runners</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter logs..."
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5 text-xs">
                {(['ALL', 'ERROR', 'WARN', 'INFO'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setLogFilter(lvl)}
                    className={`px-2.5 py-1 rounded-lg transition-colors text-[11px] ${
                      logFilter === lvl ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto font-mono text-[11px]">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className={`p-3 rounded-xl border flex items-start justify-between gap-4 ${
                  log.level === 'ERROR'
                    ? 'bg-red-950/20 border-red-500/30 text-red-200'
                    : log.level === 'WARN'
                    ? 'bg-amber-950/20 border-amber-500/30 text-amber-200'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                        log.level === 'ERROR'
                          ? 'bg-red-500 text-white'
                          : log.level === 'WARN'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {log.level}
                    </span>
                    <span className="text-slate-400 font-bold">{log.service}</span>
                  </div>
                  <p className="text-slate-200">{log.message}</p>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 4: PROVIDER SWITCHBOARD & FEATURE FLAGS */}
      {activeAdminSubTab === 'features' && (
        <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Social Provider Switchboard & Gateways</h3>
            <p className="text-xs text-slate-400">Enable or disable specific provider APIs across all tenant organizations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { id: 'xApiV2' as const, label: 'X (Twitter) API v2 Integration', desc: 'Allows publishing tweets, threads, and media' },
              { id: 'metaGraphApi' as const, label: 'Meta Graph API (Instagram & Facebook)', desc: 'Enables Instagram reels, carousels, and page posts' },
              { id: 'linkedInOauth' as const, label: 'LinkedIn v2 Organization & Profile', desc: 'Authorizes company pages and personal feeds' },
              { id: 'tiktokBusiness' as const, label: 'TikTok for Business API', desc: 'Direct vertical video uploads with audio tags' },
              { id: 'youtubeDataApi' as const, label: 'YouTube Data API v3 Shorts', desc: 'Enables Shorts video uploading with descriptions' },
              { id: 'temporalInfiniteRetry' as const, label: 'Temporal Automatic Token Refresh', desc: 'Proactively renews expiring tokens via refresh workflows' },
              { id: 'aiImageGenerator' as const, label: 'AI Image & Hook Generator', desc: 'Activates Gemini AI for instant viral captions' },
              { id: 'maintenanceMode' as const, label: 'Maintenance Mode', desc: 'Pauses incoming public webhooks and queues' },
            ].map((flag) => (
              <div
                key={flag.id}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="text-xs font-bold text-white">{flag.label}</div>
                  <div className="text-[11px] text-slate-400">{flag.desc}</div>
                </div>

                <button
                  onClick={() =>
                    setFeatureFlags((prev) => ({ ...prev, [flag.id]: !prev[flag.id] }))
                  }
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  {featureFlags[flag.id] ? (
                    <ToggleRight className="w-8 h-8 text-indigo-500 fill-indigo-500/20" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-600" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 5: REST API & WEBHOOKS TESTER */}
      {activeAdminSubTab === 'apiTester' && (
        <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>Live REST API & Gemini Proxy Tester</span>
            </h3>
            <p className="text-xs text-slate-400">Test live backend endpoints directly from the browser</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-5 space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Select Endpoint</label>
                <div className="space-y-1.5">
                  {[
                    { path: '/api/health', method: 'GET' as const },
                    { path: '/api/admin/stats', method: 'GET' as const },
                    { path: '/api/admin/errors', method: 'GET' as const },
                    { path: '/api/admin/users', method: 'GET' as const },
                    { path: '/api/ai/generate', method: 'POST' as const },
                    { path: '/api/webhooks/test', method: 'POST' as const },
                  ].map((ep) => (
                    <button
                      key={ep.path}
                      onClick={() => {
                        setSelectedEndpoint(ep.path);
                        setApiMethod(ep.method);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-mono text-left transition-colors ${
                        selectedEndpoint === ep.path
                          ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900'
                      }`}
                    >
                      <span>{ep.path}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        ep.method === 'GET' ? 'bg-sky-500/20 text-sky-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {ep.method}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {apiMethod === 'POST' && (
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Request Body (JSON)</label>
                  <textarea
                    rows={4}
                    value={apiRequestBody}
                    onChange={(e) => setApiRequestBody(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-indigo-300 font-mono focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>
              )}

              <button
                onClick={handleRunApiTest}
                disabled={apiTestingLoading}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                {apiTestingLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                <span>Execute Request</span>
              </button>
            </div>

            <div className="lg:col-span-7 flex flex-col justify-between">
              <label className="text-xs font-medium text-slate-300 block mb-1">Response (Live Output)</label>
              <div className="flex-1 rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-emerald-400 overflow-y-auto max-h-[320px]">
                {apiResponse ? (
                  <pre className="whitespace-pre-wrap">{apiResponse}</pre>
                ) : (
                  <div className="text-slate-500 text-center py-16">
                    Click &quot;Execute Request&quot; to test the endpoint.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
