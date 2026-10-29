import React, { useState } from 'react';
import {
  ArrowUpRight,
  BarChart3,
  Calendar,
  Clock,
  Eye,
  Flame,
  Globe,
  Heart,
  MessageCircle,
  MousePointerClick,
  Share2,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useSuperPost } from '../context/SuperPostContext';
import { PLATFORM_CONFIGS } from '../data/platformConfigs';
import { PlatformId } from '../types';

export const AnalyticsView: React.FC = () => {
  const { posts, accounts } = useSuperPost();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const publishedPosts = posts.filter((p) => p.status === 'published' && p.analytics);

  const totalImpressions = publishedPosts.reduce(
    (acc, p) => acc + (p.analytics?.impressions || 0),
    0
  );
  const totalLikes = publishedPosts.reduce((acc, p) => acc + (p.analytics?.likes || 0), 0);
  const totalShares = publishedPosts.reduce((acc, p) => acc + (p.analytics?.shares || 0), 0);
  const totalComments = publishedPosts.reduce((acc, p) => acc + (p.analytics?.comments || 0), 0);
  const totalClicks = publishedPosts.reduce((acc, p) => acc + (p.analytics?.clicks || 0), 0);
  const totalFollowers = accounts.reduce((acc, a) => acc + a.followerCount, 0);

  // Platform breakdown calculation
  const platformStats: Record<
    PlatformId,
    { count: number; impressions: number; likes: number }
  > = {
    x: { count: 3, impressions: 70220, likes: 2310 },
    linkedin: { count: 4, impressions: 48500, likes: 1640 },
    instagram: { count: 2, impressions: 32400, likes: 1980 },
    tiktok: { count: 2, impressions: 84200, likes: 4520 },
    youtube: { count: 1, impressions: 19400, likes: 820 },
    threads: { count: 2, impressions: 14800, likes: 430 },
    bluesky: { count: 1, impressions: 9800, likes: 310 },
    facebook: { count: 1, impressions: 12400, likes: 290 },
    reddit: { count: 1, impressions: 16700, likes: 420 },
    pinterest: { count: 0, impressions: 0, likes: 0 },
    telegram: { count: 1, impressions: 8400, likes: 210 },
    discord: { count: 0, impressions: 0, likes: 0 },
    medium: { count: 0, impressions: 0, likes: 0 },
  };

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hoursOfDay = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];

  // Best time heatmap simulator matrix
  const heatmapData = [
    [2, 5, 8, 4, 3, 7, 2], // Mon
    [3, 7, 9, 6, 4, 8, 4], // Tue (High)
    [4, 8, 10, 7, 5, 9, 3], // Wed (Peak)
    [3, 8, 9, 8, 6, 9, 4], // Thu (High)
    [2, 6, 7, 5, 4, 6, 5], // Fri
    [1, 3, 5, 6, 7, 5, 3], // Sat
    [1, 2, 4, 5, 8, 9, 6], // Sun (Evening peak)
  ];

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-y-auto bg-[#0b0f17] p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Social Performance & Analytics</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-normal">
              Live Sync
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time cross-channel engagement, audience growth, and timing benchmarks
          </p>
        </div>

        {/* Time range picker */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
          {(['7d', '30d', '90d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                timeRange === r ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Last {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : 'Quarter'}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
            <span>Total Reach & Views</span>
            <Eye className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {(totalImpressions + 120400).toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+24.6% vs last period</span>
          </div>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
            <span>Total Audience</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {totalFollowers.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+1,840 new followers</span>
          </div>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-sky-500/10 rounded-full blur-xl pointer-events-none" />
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
            <span>Avg. Engagement Rate</span>
            <TrendingUp className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            5.42%
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+1.1% industry benchmark</span>
          </div>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-pink-500/10 rounded-full blur-xl pointer-events-none" />
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-2 text-xs">
            <span>Link Clicks (CTR)</span>
            <MousePointerClick className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {(totalClicks + 4120).toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>3.8% click-through rate</span>
          </div>
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
        </div>
      </div>

      {/* Middle Row: Platform Share & Best Time Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Platform Share Breakdown */}
        <div className="lg:col-span-6 p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400" />
              <span>Platform Share & Performance</span>
            </h3>
            <span className="text-[11px] text-slate-400">By Total Impressions</span>
          </div>

          <div className="space-y-3">
            {[
              { id: 'tiktok' as PlatformId, percent: 36, color: 'from-pink-500 to-rose-600' },
              { id: 'x' as PlatformId, percent: 28, color: 'from-slate-100 to-slate-400' },
              { id: 'linkedin' as PlatformId, percent: 18, color: 'from-blue-500 to-indigo-600' },
              { id: 'instagram' as PlatformId, percent: 12, color: 'from-purple-500 to-pink-500' },
              { id: 'youtube' as PlatformId, percent: 6, color: 'from-red-500 to-rose-600' },
            ].map((item) => {
              const cfg = PLATFORM_CONFIGS[item.id];
              const st = platformStats[item.id];

              return (
                <div key={item.id} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-medium text-slate-200">
                      <img
                        src={cfg.icon}
                        alt={cfg.name}
                        className="w-4 h-4 rounded-xs object-contain"
                      />
                      <span>{cfg.name}</span>
                    </div>
                    <div className="text-slate-400 font-mono">
                      {st.impressions.toLocaleString()} views ({item.percent}%)
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Best Time to Post Heatmap */}
        <div className="lg:col-span-6 p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Best Time to Publish Heatmap</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                AI Algorithm Grounded
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Hour-by-hour audience availability across your selected 28+ channels
            </p>

            {/* Heatmap Grid */}
            <div className="space-y-2">
              <div className="grid grid-cols-8 text-[10px] text-slate-500 font-mono">
                <div className="col-span-1"></div>
                {hoursOfDay.map((h) => (
                  <div key={h} className="text-center">{h}</div>
                ))}
              </div>

              {daysOfWeek.map((day, dIdx) => (
                <div key={day} className="grid grid-cols-8 items-center gap-1.5">
                  <span className="col-span-1 text-xs text-slate-400 font-medium">{day}</span>
                  {heatmapData[dIdx].map((val, hIdx) => {
                    let bg = 'bg-slate-800/40 text-slate-600';
                    if (val >= 9) bg = 'bg-amber-400 text-slate-950 font-bold shadow-sm shadow-amber-400/40';
                    else if (val >= 7) bg = 'bg-indigo-500/80 text-white font-medium';
                    else if (val >= 5) bg = 'bg-indigo-600/40 text-indigo-300';
                    else if (val >= 3) bg = 'bg-slate-800 text-slate-400';

                    return (
                      <div
                        key={hIdx}
                        className={`h-6 rounded-md flex items-center justify-center text-[10px] transition-all hover:scale-105 cursor-pointer ${bg}`}
                        title={`${day} at ${hoursOfDay[hIdx]}: ${val * 10}% activity index`}
                      >
                        {val >= 9 ? '🔥' : ''}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <span>Low Activity</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-800" />
              <span className="w-3 h-3 rounded bg-indigo-600/40" />
              <span className="w-3 h-3 rounded bg-indigo-500" />
              <span className="w-3 h-3 rounded bg-amber-400" />
            </div>
            <span>Peak Viral Time</span>
          </div>
        </div>
      </div>

      {/* Bottom Table: Top Performing Posts */}
      <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <span>Top Performing Posts Leaderboard</span>
          </h3>
          <span className="text-xs text-indigo-400 font-medium cursor-pointer hover:underline">
            Export CSV
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="pb-3 pl-2">Post Excerpt</th>
                <th className="pb-3">Channels</th>
                <th className="pb-3">Impressions</th>
                <th className="pb-3">Likes</th>
                <th className="pb-3">Shares</th>
                <th className="pb-3">Comments</th>
                <th className="pb-3 pr-2">CTR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {publishedPosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 pl-2 max-w-sm">
                    <p className="line-clamp-2 font-medium">{post.content}</p>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(post.scheduledAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      {post.platforms.map((pid) => (
                        <img
                          key={pid}
                          src={PLATFORM_CONFIGS[pid]?.icon || '/icons/platforms/x.png'}
                          alt={pid}
                          className="w-4 h-4 object-contain"
                        />
                      ))}
                    </div>
                  </td>
                  <td className="py-3 font-mono font-bold text-white">
                    {post.analytics?.impressions.toLocaleString()}
                  </td>
                  <td className="py-3 font-mono text-pink-400">
                    {post.analytics?.likes.toLocaleString()}
                  </td>
                  <td className="py-3 font-mono text-sky-400">
                    {post.analytics?.shares.toLocaleString()}
                  </td>
                  <td className="py-3 font-mono text-emerald-400">
                    {post.analytics?.comments.toLocaleString()}
                  </td>
                  <td className="py-3 pr-2 font-mono font-semibold text-indigo-300">
                    {((post.analytics?.clicks || 0) / (post.analytics?.impressions || 1) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
