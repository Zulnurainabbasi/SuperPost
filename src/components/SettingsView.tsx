import React, { useState } from 'react';
import {
  Check,
  Clock,
  Code,
  Copy,
  Globe,
  Key,
  Link,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  Webhook,
  Zap,
} from 'lucide-react';
import { useSuperPost } from '../context/SuperPostContext';

export const SettingsView: React.FC = () => {
  const { resetToDefaults } = useSuperPost();
  const [selectedTimezone, setSelectedTimezone] = useState('UTC-07:00 (Pacific Time)');
  const [shortlinkProvider, setShortlinkProvider] = useState<'dub' | 'kutt' | 'linkdrip' | 'none'>('dub');
  const [apiKey, setApiKey] = useState('sp_live_948a7b1c3e5d8f0293a67c4');
  const [copiedKey, setCopiedKey] = useState(false);
  const [savedSettings, setSavedSettings] = useState(false);

  const [webhooks, setWebhooks] = useState([
    {
      id: 'wh-1',
      url: 'https://n8n.mycompany.com/webhook/superpost-events',
      events: ['post.published', 'post.failed'],
      active: true,
    },
    {
      id: 'wh-2',
      url: 'https://hooks.zapier.com/hooks/catch/12498/postiz',
      events: ['post.created'],
      active: true,
    },
  ]);
  const [newWebhookUrl, setNewWebhookUrl] = useState('');

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 1500);
  };

  const handleRegenerateKey = () => {
    const newK = `sp_live_${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`;
    setApiKey(newK);
  };

  const handleAddWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebhookUrl.trim()) return;

    setWebhooks([
      ...webhooks,
      {
        id: `wh-${Date.now()}`,
        url: newWebhookUrl.trim(),
        events: ['post.published'],
        active: true,
      },
    ]);
    setNewWebhookUrl('');
  };

  const handleDeleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter((w) => w.id !== id));
  };

  const handleSave = () => {
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-y-auto bg-[#0b0f17] p-4 sm:p-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Platform Settings & Automation</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure system timezones, URL shortening providers, developer APIs and webhook dispatchers
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
        >
          {savedSettings ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{savedSettings ? 'Saved Changes!' : 'Save Settings'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timezone & Localization */}
        <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Timezone & Publishing Clock</span>
          </h3>
          <p className="text-xs text-slate-400">
            All calendar time slots and auto-queue times adapt to this workspace timezone.
          </p>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Active Timezone
            </label>
            <select
              value={selectedTimezone}
              onChange={(e) => setSelectedTimezone(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="UTC-07:00 (Pacific Time)">UTC-07:00 (US & Canada Pacific Time)</option>
              <option value="UTC-04:00 (Eastern Time)">UTC-04:00 (US & Canada Eastern Time)</option>
              <option value="UTC+00:00 (London, GMT)">UTC+00:00 (London, Dublin, Lisbon)</option>
              <option value="UTC+01:00 (Central European)">UTC+01:00 (Berlin, Paris, Amsterdam)</option>
              <option value="UTC+05:30 (India Standard Time)">UTC+05:30 (Mumbai, New Delhi)</option>
              <option value="UTC+08:00 (Singapore, HK)">UTC+08:00 (Singapore, Hong Kong, Perth)</option>
              <option value="UTC+09:00 (Tokyo)">UTC+09:00 (Tokyo, Seoul)</option>
            </select>
          </div>
        </div>

        {/* Shortlink Provider Selection */}
        <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Link className="w-4 h-4 text-indigo-400" />
            <span>URL Shortener & Click Tracking</span>
          </h3>
          <p className="text-xs text-slate-400">
            Automatically shorten links in posts with custom branded domains and UTM campaign parameters.
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              { id: 'dub' as const, name: 'Dub.co (Recommended)', badge: 'Fastest' },
              { id: 'kutt' as const, name: 'Kutt.it', badge: 'Open-Source' },
              { id: 'linkdrip' as const, name: 'LinkDrip', badge: 'Self-Hosted' },
              { id: 'none' as const, name: 'Raw URLs (No Shortening)', badge: 'Direct' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setShortlinkProvider(p.id)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  shortlinkProvider === p.id
                    ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500/30'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-semibold text-xs text-white">{p.name}</div>
                <div className="text-[10px] text-indigo-300 mt-1">{p.badge}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Public Developer API Keys */}
        <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-indigo-400" />
              <span>Public REST API Token</span>
            </h3>
            <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-400">
              v2.1
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Use this bearer token to trigger SuperPost programmatic post creation from n8n, Make.com, or CLI.
          </p>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={apiKey}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-indigo-300 focus:outline-none"
            />
            <button
              onClick={handleCopyApiKey}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Copy API key"
            >
              {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handleRegenerateKey}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Regenerate token"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Webhooks Manager */}
        <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Webhook className="w-4 h-4 text-indigo-400" />
              <span>Outgoing Webhooks</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">
              {webhooks.length} Active
            </span>
          </div>

          <form onSubmit={handleAddWebhook} className="flex gap-2">
            <input
              type="url"
              placeholder="https://your-service.com/webhook"
              value={newWebhookUrl}
              onChange={(e) => setNewWebhookUrl(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shrink-0"
            >
              Add Hook
            </button>
          </form>

          <div className="space-y-2 max-h-36 overflow-y-auto">
            {webhooks.map((wh) => (
              <div
                key={wh.id}
                className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <span className="font-mono text-slate-300 truncate block text-[11px]">
                    {wh.url}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Events: {wh.events.join(', ')}
                  </span>
                </div>
                <button
                  onClick={() => handleDeleteWebhook(wh.id)}
                  className="text-slate-500 hover:text-red-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reset State Option */}
      <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center justify-between flex-wrap gap-4 text-xs">
        <div>
          <span className="font-bold text-slate-300 block">Reset State to Defaults</span>
          <span className="text-slate-500 text-[11px]">
            Clears local storage modifications and restores the initial SuperPost mock sample state.
          </span>
        </div>
        <button
          onClick={resetToDefaults}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-red-950/60 hover:text-red-300 text-slate-400 font-semibold transition-colors"
        >
          Reset Demo Data
        </button>
      </div>
    </div>
  );
};
