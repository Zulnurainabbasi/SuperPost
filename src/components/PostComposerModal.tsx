import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Check,
  Clock,
  Eye,
  FileImage,
  Flame,
  Hash,
  HelpCircle,
  Image,
  Layers,
  MessageSquare,
  Plus,
  Send,
  Sparkles,
  Trash2,
  Upload,
  Wand2,
  X,
  Zap,
} from 'lucide-react';
import { useSuperPost } from '../context/SuperPostContext';
import { PLATFORM_CONFIGS } from '../data/platformConfigs';
import { PlatformId, PostItem } from '../types';
import { LivePlatformPreview } from './LivePlatformPreview';

export const PostComposerModal: React.FC = () => {
  const {
    composerOpen,
    composerInitialData,
    closeComposer,
    addPost,
    updatePost,
    accounts,
    media,
    triggerCelebration,
  } = useSuperPost();

  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformId[]>(['x', 'linkedin']);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [firstComment, setFirstComment] = useState('');
  const [showFirstComment, setShowFirstComment] = useState(false);
  const [tags, setTags] = useState<string[]>(['Growth', 'SuperPost']);
  const [tagInput, setTagInput] = useState('');
  const [scheduledDate, setScheduledDate] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('14:30');
  const [activePreviewPlatform, setActivePreviewPlatform] = useState<PlatformId>('x');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  // Initialize or reset form
  useEffect(() => {
    if (composerOpen) {
      if (composerInitialData) {
        setContent(composerInitialData.content || '');
        setSelectedPlatforms(
          composerInitialData.platforms && composerInitialData.platforms.length > 0
            ? composerInitialData.platforms
            : ['x', 'linkedin']
        );
        setMediaUrls(composerInitialData.mediaUrls || []);
        setFirstComment(composerInitialData.firstComment || '');
        setShowFirstComment(Boolean(composerInitialData.firstComment));
        setTags(composerInitialData.tags || ['SuperPost']);

        if (composerInitialData.scheduledAt) {
          const d = new Date(composerInitialData.scheduledAt);
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, '0');
          const dd = String(d.getDate()).padStart(2, '0');
          setScheduledDate(`${yyyy}-${mm}-${dd}`);

          const hh = String(d.getHours()).padStart(2, '0');
          const min = String(d.getMinutes()).padStart(2, '0');
          setScheduledTime(`${hh}:${min}`);
        } else {
          setDefaultSchedule();
        }
      } else {
        setContent('');
        setSelectedPlatforms(['x', 'linkedin']);
        setMediaUrls([]);
        setFirstComment('');
        setShowFirstComment(false);
        setTags(['Growth', 'SuperPost']);
        setDefaultSchedule();
      }
    }
  }, [composerOpen, composerInitialData]);

  // Sync preview platform with first selected platform
  useEffect(() => {
    if (selectedPlatforms.length > 0 && !selectedPlatforms.includes(activePreviewPlatform)) {
      setActivePreviewPlatform(selectedPlatforms[0]);
    }
  }, [selectedPlatforms, activePreviewPlatform]);

  const setDefaultSchedule = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    setScheduledDate(`${yyyy}-${mm}-${dd}`);
    setScheduledTime('14:30');
  };

  if (!composerOpen) return null;

  const togglePlatform = (p: PlatformId) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter((item) => item !== p));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim().replace(/^#/, '')]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (t: string) => {
    setTags(tags.filter((item) => item !== t));
  };

  // AI Assistance logic
  const handleAiAction = async (action: string) => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, context: content }),
      });
      const data = await res.json();
      if (data && data.text) {
        if (action === 'hashtags') {
          setContent((prev) => `${prev.trim()}\n\n${data.text.trim()}`);
        } else {
          setContent(data.text);
        }
      }
    } catch {
      if (action === 'hook') {
        const hook = "🔥 Stop wasting hours on social media.\n\nHere is how to automate 28+ channels in 15 minutes:";
        setContent((prev) => (prev ? `${hook}\n\n${prev}` : `${hook}\n\n1. Batch write your ideas\n2. Schedule at peak engagement times\n3. Repurpose automatically into clips and threads.`));
      } else if (action === 'hashtags') {
        const generatedTags = ['#SocialMediaStrategy', '#GrowthMarketing', '#SaaSGrowth', '#ContentCreator', '#Automation'];
        setContent((prev) => `${prev.trim()}\n\n${generatedTags.join(' ')}`);
      } else if (action === 'professional') {
        setContent((prev) =>
          prev
            ? `In today's fast-moving market, consistency is the true differentiator.\n\n${prev}\n\nHow is your organization approaching cross-channel reach this quarter?`
            : "Strategic social distribution requires intentional architecture, not sporadic updates. Here are 3 key frameworks we implemented this quarter..."
        );
      } else if (action === 'bold') {
        setContent((prev) =>
          `Hot take: Most social media advice is completely outdated.\n\n${prev || "If your content doesn't challenge assumptions, it gets lost in the feed."}\n\nWhat do you think?`
        );
      }
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSavePost = (publishNow = false) => {
    if (!content.trim() && mediaUrls.length === 0) return;

    let scheduledIso: string;
    if (publishNow) {
      scheduledIso = new Date().toISOString();
    } else {
      const [yearStr, monthStr, dayStr] = scheduledDate.split('-');
      const [hoursStr, minutesStr] = scheduledTime.split(':');
      const target = new Date(
        parseInt(yearStr),
        parseInt(monthStr) - 1,
        parseInt(dayStr),
        parseInt(hoursStr) || 12,
        parseInt(minutesStr) || 0
      );
      scheduledIso = target.toISOString();
    }

    const postPayload = {
      content,
      platforms: selectedPlatforms,
      targetAccountIds: accounts
        .filter((a) => a.connected && selectedPlatforms.includes(a.platform))
        .map((a) => a.id),
      mediaUrls,
      scheduledAt: scheduledIso,
      publishedAt: publishNow ? scheduledIso : undefined,
      status: publishNow ? ('published' as const) : ('scheduled' as const),
      firstComment: showFirstComment ? firstComment : undefined,
      tags,
    };

    if (composerInitialData?.id) {
      updatePost(composerInitialData.id, postPayload);
    } else {
      addPost(postPayload);
    }

    triggerCelebration();
    closeComposer();
  };

  // Determine character limits status
  const limitsStatus = selectedPlatforms.map((pid) => {
    const config = PLATFORM_CONFIGS[pid];
    const len = content.length;
    const isExceeded = len > config.charLimit;
    return {
      pid,
      name: config.name,
      len,
      limit: config.charLimit,
      isExceeded,
    };
  });

  const hasExceededLimit = limitsStatus.some((s) => s.isExceeded);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-3xl bg-[#0f172a] border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{composerInitialData?.id ? 'Edit Social Post' : 'New SuperPost'}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Omni-Composer
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Craft, preview, and distribute to multiple networks simultaneously
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher on mobile/tablet */}
            <div className="flex items-center bg-slate-800/80 p-1 rounded-xl text-xs font-semibold lg:hidden">
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  activeTab === 'edit' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`}
              >
                Editor
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                  activeTab === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            </div>

            <button
              onClick={closeComposer}
              className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Channels Selector Ribbon */}
        <div className="px-5 py-3 border-b border-slate-800/80 bg-slate-950/60 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
              Publish To:
            </span>
            {(Object.keys(PLATFORM_CONFIGS) as PlatformId[]).map((pid) => {
              const cfg = PLATFORM_CONFIGS[pid];
              const isSelected = selectedPlatforms.includes(pid);

              return (
                <button
                  key={pid}
                  onClick={() => togglePlatform(pid)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-indigo-600/20 border border-indigo-500 text-white shadow-sm shadow-indigo-500/10 ring-1 ring-indigo-500/30'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <img
                    src={cfg.icon}
                    alt={cfg.name}
                    className="w-4 h-4 rounded-xs object-contain"
                  />
                  <span>{cfg.name}</span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Main Body (Editor + Live Preview side-by-side on lg) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto">
          {/* Left Column: Editor & Options */}
          <div
            className={`p-5 space-y-4 lg:col-span-7 border-r border-slate-800/80 flex flex-col justify-between ${
              activeTab === 'preview' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <div className="space-y-4">
              {/* AI Assistance Quick Prompts */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-semibold text-violet-400 flex items-center gap-1 mr-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Magic:
                </span>
                <button
                  onClick={() => handleAiAction('hook')}
                  disabled={isAiLoading}
                  className="px-2.5 py-1 rounded-lg bg-violet-950/40 hover:bg-violet-900/60 border border-violet-500/30 text-violet-300 text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1"
                >
                  <Wand2 className="w-3 h-3" />
                  <span>Hookify</span>
                </button>
                <button
                  onClick={() => handleAiAction('hashtags')}
                  disabled={isAiLoading}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1"
                >
                  <Hash className="w-3 h-3" />
                  <span>Auto-Hashtags</span>
                </button>
                <button
                  onClick={() => handleAiAction('professional')}
                  disabled={isAiLoading}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 text-[11px] font-medium transition-all cursor-pointer"
                >
                  LinkedIn Tone
                </button>
                <button
                  onClick={() => handleAiAction('bold')}
                  disabled={isAiLoading}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 text-[11px] font-medium transition-all cursor-pointer"
                >
                  Bold Hook
                </button>
              </div>

              {/* Text Area */}
              <div className="relative">
                <textarea
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What would you like to share with your audience? SuperPost supports threads, carousel attachments, hashtags and auto-formatting..."
                  className="w-full rounded-2xl bg-slate-900/90 border border-slate-700/80 p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none font-sans leading-relaxed"
                />

                {/* Character counts pills */}
                <div className="mt-2 flex items-center gap-2 flex-wrap text-[11px]">
                  {limitsStatus.map((st) => (
                    <span
                      key={st.pid}
                      className={`px-2 py-0.5 rounded-md font-mono ${
                        st.isExceeded
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30 font-bold'
                          : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                      }`}
                    >
                      {st.name}: {st.len}/{st.limit}
                    </span>
                  ))}
                </div>
              </div>

              {/* Media Attachments */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <FileImage className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Media Attachments</span>
                  </label>
                  <button
                    onClick={() => setShowMediaPicker(!showMediaPicker)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                  >
                    <span>{showMediaPicker ? 'Hide Library' : 'Pick from Media Library'}</span>
                  </button>
                </div>

                {/* Media Preview list */}
                {mediaUrls.length > 0 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-1">
                    {mediaUrls.map((url, i) => (
                      <div key={i} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-slate-700 shrink-0 bg-slate-950">
                        <img src={url} alt={`media-${i}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => setMediaUrls(mediaUrls.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 p-1 rounded-md bg-black/70 hover:bg-red-600 text-white transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Media Library Picker Drawer */}
                {showMediaPicker && (
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="text-[11px] text-slate-400 font-medium">Select an asset from your library:</div>
                    <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto">
                      {media.map((asset) => (
                        <div
                          key={asset.id}
                          onClick={() => {
                            if (!mediaUrls.includes(asset.url)) {
                              setMediaUrls([...mediaUrls, asset.url]);
                            }
                          }}
                          className="group relative rounded-lg overflow-hidden border border-slate-800 hover:border-indigo-500 cursor-pointer aspect-video bg-slate-900"
                        >
                          <img src={asset.url} alt={asset.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[10px] text-white font-bold">
                            + Add
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* First Comment Accordion */}
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => setShowFirstComment(!showFirstComment)}
                  className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Schedule First Comment</span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    (Perfect for LinkedIn external links & Instagram hashtags)
                  </span>
                </button>

                {showFirstComment && (
                  <input
                    type="text"
                    value={firstComment}
                    onChange={(e) => setFirstComment(e.target.value)}
                    placeholder="Enter first comment text or link to auto-post immediately after launch..."
                    className="w-full rounded-xl bg-slate-900/80 border border-slate-700/80 px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                )}
              </div>

              {/* Tags Section */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Campaign & Category Tags</span>
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300"
                    >
                      <span>#{t}</span>
                      <button
                        onClick={() => handleRemoveTag(t)}
                        className="text-slate-500 hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      placeholder="Add tag..."
                      className="w-24 bg-slate-900 border border-slate-700/70 rounded-lg px-2 py-0.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={handleAddTag}
                      className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Scheduling Controls */}
            <div className="pt-4 mt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span>Schedule For:</span>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSavePost(false)}
                    disabled={hasExceededLimit || (!content.trim() && mediaUrls.length === 0)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Schedule Post</span>
                  </button>

                  <button
                    onClick={() => handleSavePost(true)}
                    disabled={hasExceededLimit || (!content.trim() && mediaUrls.length === 0)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Live Preview */}
          <div
            className={`p-5 lg:col-span-5 bg-slate-950/40 flex flex-col justify-between overflow-y-auto ${
              activeTab === 'edit' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Real-Time Feed Preview</span>
                </span>

                {/* Preview Platform Switcher */}
                <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
                  {selectedPlatforms.map((pid) => (
                    <button
                      key={pid}
                      onClick={() => setActivePreviewPlatform(pid)}
                      className={`p-1.5 rounded-lg transition-all ${
                        activePreviewPlatform === pid
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'opacity-60 hover:opacity-100 text-slate-400'
                      }`}
                      title={PLATFORM_CONFIGS[pid]?.name}
                    >
                      <img
                        src={PLATFORM_CONFIGS[pid]?.icon}
                        alt={pid}
                        className="w-3.5 h-3.5 object-contain"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Feed Preview Card */}
              <div className="py-2">
                <LivePlatformPreview
                  platform={activePreviewPlatform}
                  content={content}
                  mediaUrls={mediaUrls}
                  firstComment={showFirstComment ? firstComment : undefined}
                />
              </div>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>
                Simulating live feed algorithm layout for {PLATFORM_CONFIGS[activePreviewPlatform]?.name}.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
