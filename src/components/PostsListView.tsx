import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  Edit3,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  MessageCircle,
  MoreVertical,
  Plus,
  Send,
  Share2,
  ThumbsUp,
  Trash2,
} from 'lucide-react';
import { useSuperPost } from '../context/SuperPostContext';
import { PLATFORM_CONFIGS } from '../data/platformConfigs';
import { PlatformId, PostItem, PostStatus } from '../types';

export const PostsListView: React.FC = () => {
  const {
    posts,
    openComposer,
    deletePost,
    updatePost,
    selectedPlatformFilter,
    setSelectedPlatformFilter,
    searchQuery,
    triggerCelebration,
  } = useSuperPost();

  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all');
  const [selectedPostForDetail, setSelectedPostForDetail] = useState<PostItem | null>(null);

  const filteredPosts = posts.filter((post) => {
    if (statusFilter !== 'all' && post.status !== statusFilter) return false;
    if (selectedPlatformFilter !== 'all' && !post.platforms.includes(selectedPlatformFilter)) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const contentMatch = post.content.toLowerCase().includes(q);
      const tagMatch = post.tags.some((t) => t.toLowerCase().includes(q));
      if (!contentMatch && !tagMatch) return false;
    }
    return true;
  });

  const getStatusBadge = (status: PostStatus) => {
    switch (status) {
      case 'published':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Published</span>
          </span>
        );
      case 'scheduled':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>Scheduled</span>
          </span>
        );
      case 'draft':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5" />
            <span>Draft</span>
          </span>
        );
      case 'failed':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold">
            <span>Failed</span>
          </span>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-y-auto bg-[#0b0f17] p-4 sm:p-6 space-y-6">
      {/* Top Banner & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Launches & Posts Queue</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-normal">
              {filteredPosts.length} posts
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Monitor, edit, and orchestrate all scheduled and published social broadcasts
          </p>
        </div>

        <button
          onClick={() => openComposer()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>New Launch</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-medium">
          {(['all', 'scheduled', 'published', 'draft'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st === 'all' ? 'All Launches' : st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Sort by: Date (Newest first)</span>
        </div>
      </div>

      {/* Posts List Cards */}
      {filteredPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-3xl border border-slate-800/80 bg-slate-900/30">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-3">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-slate-200">No posts found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mb-4">
            No posts match your active filter criteria. Clear filters or create your first scheduled broadcast.
          </p>
          <button
            onClick={() => openComposer()}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
          >
            Create SuperPost Now
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredPosts.map((post) => {
            const dateObj = new Date(post.scheduledAt);
            const dateFormatted = dateObj.toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
            const timeFormatted = dateObj.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={post.id}
                className="group relative p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Post Content & Channels */}
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  {/* Media Thumbnail preview if any */}
                  {post.mediaUrls.length > 0 ? (
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-800 bg-slate-950">
                      <img
                        src={post.mediaUrls[0]}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl shrink-0 border border-slate-800 bg-slate-950/60 flex items-center justify-center text-slate-600">
                      <FileText className="w-6 h-6" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    {/* Platforms Badges & Status */}
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        {post.platforms.map((pid) => (
                          <div
                            key={pid}
                            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-[10px] text-slate-300 font-medium"
                          >
                            <img
                              src={PLATFORM_CONFIGS[pid]?.icon || '/icons/platforms/x.png'}
                              alt={pid}
                              className="w-3 h-3 object-contain"
                            />
                            <span>{PLATFORM_CONFIGS[pid]?.name}</span>
                          </div>
                        ))}
                      </div>

                      {getStatusBadge(post.status)}

                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                      {post.content}
                    </p>

                    {/* Analytics stats if published */}
                    {post.analytics && (
                      <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1 text-slate-300 font-medium">
                          <Eye className="w-3.5 h-3.5 text-indigo-400" />
                          {post.analytics.impressions.toLocaleString()} views
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          {post.analytics.likes.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Share2 className="w-3 h-3" />
                          {post.analytics.shares.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {post.analytics.comments.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Date Time & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <div className="text-right">
                    <div className="text-xs font-semibold text-slate-200">
                      {dateFormatted}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" />
                      {timeFormatted}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openComposer(post)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Edit post"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        const duplicate = {
                          ...post,
                          content: `${post.content} (Copy)`,
                          scheduledAt: new Date(Date.now() + 86400000).toISOString(),
                          status: 'draft' as const,
                        };
                        openComposer(duplicate);
                      }}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      title="Duplicate post"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {post.status !== 'published' && (
                      <button
                        onClick={() => {
                          updatePost(post.id, {
                            status: 'published',
                            publishedAt: new Date().toISOString(),
                          });
                          triggerCelebration();
                        }}
                        className="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-emerald-400 transition-colors"
                        title="Publish immediately"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => deletePost(post.id)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-red-950/60 hover:text-red-400 text-slate-400 transition-colors"
                      title="Delete post"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
