import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
  Flame,
  Plus,
  Share2,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useSuperPost } from '../context/SuperPostContext';
import { PLATFORM_CONFIGS } from '../data/platformConfigs';
import { PlatformId, PostItem } from '../types';

export const CalendarView: React.FC = () => {
  const {
    posts,
    openComposer,
    selectedPlatformFilter,
    setSelectedPlatformFilter,
    searchQuery,
  } = useSuperPost();

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');

  // Month calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Prev month padding days
  const prevMonthDays = new Date(year, month, 0).getDate();
  const paddingDaysCount = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Start week on Monday

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Filter posts
  const filteredPosts = posts.filter((post) => {
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

  // Get posts for specific date
  const getPostsForDate = (checkDate: Date) => {
    const y = checkDate.getFullYear();
    const m = checkDate.getMonth();
    const d = checkDate.getDate();

    return filteredPosts.filter((post) => {
      const pDate = new Date(post.scheduledAt);
      return (
        pDate.getFullYear() === y &&
        pDate.getMonth() === m &&
        pDate.getDate() === d
      );
    });
  };

  const isToday = (checkDate: Date) => {
    const now = new Date();
    return (
      checkDate.getFullYear() === now.getFullYear() &&
      checkDate.getMonth() === now.getMonth() &&
      checkDate.getDate() === now.getDate()
    );
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-[#0b0f17]">
      {/* Calendar Action Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/40 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-700/60 rounded-xl p-1 shadow-sm">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Today
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {monthNames[month]} <span className="text-slate-400 font-normal">{year}</span>
          </h2>
        </div>

        {/* View Toggle & Quick AI suggestions */}
        <div className="flex items-center gap-3">
          {/* Smart Heatmap Tip */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Peak Engagement: 11:30 AM & 6:00 PM</span>
          </div>

          {/* Month / Week switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-700/60 rounded-xl p-1 text-xs font-medium">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'month'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewMode === 'week'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Week
            </button>
          </div>

          <button
            onClick={() => openComposer()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Schedule Post</span>
          </button>
        </div>
      </div>

      {/* Weekdays Header */}
      <div className="grid grid-cols-7 border-b border-slate-800/80 bg-slate-900/60 text-center py-2 text-xs font-semibold text-slate-400 tracking-wider uppercase">
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div className="text-indigo-400/80">Sat</div>
        <div className="text-indigo-400/80">Sun</div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-5 gap-px bg-slate-800/40 overflow-y-auto">
        {/* Padding days from previous month */}
        {Array.from({ length: paddingDaysCount }).map((_, index) => {
          const dayNum = prevMonthDays - paddingDaysCount + index + 1;
          const prevDate = new Date(year, month - 1, dayNum);
          const dayPosts = getPostsForDate(prevDate);

          return (
            <div
              key={`prev-${index}`}
              className="bg-[#0c101a]/40 p-2 min-h-[110px] flex flex-col justify-between opacity-40 hover:opacity-75 transition-opacity"
            >
              <span className="text-xs text-slate-500 font-medium">{dayNum}</span>
              {dayPosts.length > 0 && (
                <div className="text-[10px] text-slate-500">
                  {dayPosts.length} post{dayPosts.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
          );
        })}

        {/* Days of current month */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const dayNum = index + 1;
          const currentCellDate = new Date(year, month, dayNum);
          const dayPosts = getPostsForDate(currentCellDate);
          const today = isToday(currentCellDate);

          return (
            <div
              key={`day-${dayNum}`}
              onClick={() => {
                const targetDate = new Date(year, month, dayNum, 14, 0);
                openComposer({ scheduledAt: targetDate.toISOString() });
              }}
              className={`group relative bg-[#0f172a]/70 hover:bg-[#162035]/90 p-2 min-h-[110px] flex flex-col transition-colors cursor-pointer border-t border-transparent hover:border-indigo-500/30 ${
                today ? 'ring-1 ring-inset ring-indigo-500/50 bg-indigo-950/20' : ''
              }`}
            >
              {/* Day Number & Quick Add Button */}
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    today
                      ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/30'
                      : 'text-slate-300 group-hover:text-white'
                  }`}
                >
                  {dayNum}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const targetDate = new Date(year, month, dayNum, 14, 0);
                    openComposer({ scheduledAt: targetDate.toISOString() });
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white transition-opacity shadow-sm"
                  title="Schedule post on this day"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Scheduled Posts in this day */}
              <div className="space-y-1.5 overflow-y-auto max-h-[105px] pr-0.5">
                {dayPosts.map((post) => {
                  const timeStr = new Date(post.scheduledAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <div
                      key={post.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        openComposer(post);
                      }}
                      className="group/card p-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/50 shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-1">
                          {post.platforms.slice(0, 3).map((pid) => (
                            <img
                              key={pid}
                              src={PLATFORM_CONFIGS[pid]?.icon || '/icons/platforms/x.png'}
                              alt={pid}
                              className="w-3.5 h-3.5 rounded-xs object-contain"
                            />
                          ))}
                          {post.platforms.length > 3 && (
                            <span className="text-[9px] text-slate-400 font-bold">
                              +{post.platforms.length - 3}
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5 text-slate-500" />
                          {timeStr}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-200 line-clamp-2 leading-snug font-normal">
                        {post.content}
                      </p>

                      {post.status === 'published' && (
                        <div className="mt-1 flex items-center gap-1 text-[9px] text-emerald-400 font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Published
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
