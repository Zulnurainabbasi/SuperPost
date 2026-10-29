import React from 'react';
import {
  Bookmark,
  CheckCircle2,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Music,
  Repeat2,
  Share,
  Share2,
  ThumbsUp,
} from 'lucide-react';
import { PlatformId } from '../types';
import { PLATFORM_CONFIGS } from '../data/platformConfigs';

interface LivePlatformPreviewProps {
  platform: PlatformId;
  content: string;
  mediaUrls: string[];
  firstComment?: string;
}

export const LivePlatformPreview: React.FC<LivePlatformPreviewProps> = ({
  platform,
  content,
  mediaUrls,
  firstComment,
}) => {
  const displayContent = content || 'Start typing in the composer to preview your post...';
  const hasMedia = mediaUrls.length > 0;

  // Format hashtags and mentions
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, lineIndex) => (
      <span key={lineIndex} className="block min-h-[1.25rem]">
        {line.split(' ').map((word, wordIndex) => {
          if (word.startsWith('#') || word.startsWith('@')) {
            return (
              <span key={wordIndex} className="text-indigo-400 font-medium">
                {word}{' '}
              </span>
            );
          }
          if (word.startsWith('http://') || word.startsWith('https://')) {
            return (
              <span key={wordIndex} className="text-sky-400 underline cursor-pointer">
                {word}{' '}
              </span>
            );
          }
          return word + ' ';
        })}
      </span>
    ));
  };

  if (platform === 'x') {
    return (
      <div className="rounded-2xl border border-slate-700/80 bg-black text-white p-4 shadow-xl max-w-md mx-auto font-sans">
        <div className="flex items-start gap-3">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80"
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-800"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-bold text-sm text-white truncate">SuperPost</span>
                <span className="text-sky-400 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 fill-sky-400 text-black" />
                </span>
                <span className="text-slate-500 text-xs truncate">@SuperPostApp</span>
                <span className="text-slate-500 text-xs">· Just now</span>
              </div>
              <MoreHorizontal className="w-4 h-4 text-slate-500" />
            </div>

            <div className="mt-2 text-[13.5px] leading-relaxed text-slate-100 whitespace-pre-wrap break-words">
              {renderFormattedText(displayContent)}
            </div>

            {hasMedia && (
              <div className="mt-3 rounded-xl overflow-hidden border border-slate-800 bg-slate-900">
                <img
                  src={mediaUrls[0]}
                  alt="Post media"
                  className="w-full max-h-72 object-cover"
                />
              </div>
            )}

            <div className="mt-4 flex items-center justify-between text-slate-500 max-w-sm text-xs">
              <div className="flex items-center gap-1.5 hover:text-sky-400 transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>24</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors">
                <Repeat2 className="w-4 h-4" />
                <span>12</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-pink-500 transition-colors">
                <Heart className="w-4 h-4" />
                <span>142</span>
              </div>
              <div className="flex items-center gap-1.5 hover:text-sky-400 transition-colors">
                <Bookmark className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1.5 hover:text-sky-400 transition-colors">
                <Share className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (platform === 'linkedin') {
    return (
      <div className="rounded-2xl border border-slate-700/80 bg-[#1b222d] text-white p-4 shadow-xl max-w-md mx-auto font-sans">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=100&auto=format&fit=crop&q=80"
              alt="LinkedIn author"
              className="w-11 h-11 rounded-lg object-cover ring-1 ring-slate-700"
            />
            <div>
              <div className="flex items-center gap-1 font-bold text-sm text-slate-100">
                SuperPost Media Inc.
                <span className="text-[10px] text-slate-400 font-normal">• 1st</span>
              </div>
              <div className="text-[11px] text-slate-400">
                18,450 followers • 2h • Edited
              </div>
            </div>
          </div>
          <MoreHorizontal className="w-4 h-4 text-slate-400" />
        </div>

        <div className="text-[13px] leading-relaxed text-slate-200 whitespace-pre-wrap break-words mb-3">
          {renderFormattedText(displayContent)}
        </div>

        {hasMedia && (
          <div className="rounded-lg overflow-hidden border border-slate-700 bg-slate-900 mb-3">
            <img
              src={mediaUrls[0]}
              alt="LinkedIn media"
              className="w-full max-h-72 object-cover"
            />
          </div>
        )}

        <div className="flex items-center justify-between py-2 border-t border-b border-slate-700/60 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <span className="flex -space-x-1">
              <span className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[9px] text-white">👍</span>
              <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-[9px] text-white">❤️</span>
              <span className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-[9px] text-white">💡</span>
            </span>
            <span className="ml-1 text-[11px]">89</span>
          </div>
          <div className="text-[11px]">18 comments • 4 reposts</div>
        </div>

        <div className="flex items-center justify-around pt-2 text-slate-300 text-xs font-semibold">
          <div className="flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-slate-800 cursor-pointer">
            <ThumbsUp className="w-4 h-4" />
            <span>Like</span>
          </div>
          <div className="flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-slate-800 cursor-pointer">
            <MessageCircle className="w-4 h-4" />
            <span>Comment</span>
          </div>
          <div className="flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-slate-800 cursor-pointer">
            <Repeat2 className="w-4 h-4" />
            <span>Repost</span>
          </div>
          <div className="flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-slate-800 cursor-pointer">
            <Share2 className="w-4 h-4" />
            <span>Send</span>
          </div>
        </div>

        {firstComment && (
          <div className="mt-3 pt-3 border-t border-slate-800 bg-slate-900/50 p-2.5 rounded-lg text-xs">
            <div className="font-semibold text-slate-300 mb-1 flex items-center gap-1">
              <span>SuperPost (Author First Comment):</span>
            </div>
            <div className="text-slate-400">{firstComment}</div>
          </div>
        )}
      </div>
    );
  }

  if (platform === 'instagram') {
    return (
      <div className="rounded-2xl border border-slate-700/80 bg-black text-white p-3.5 shadow-xl max-w-sm mx-auto font-sans">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600">
              <img
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100&auto=format&fit=crop&q=80"
                alt="Instagram author"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-black"
              />
            </div>
            <div>
              <div className="font-bold text-xs text-white">superpost.hq</div>
              <div className="text-[10px] text-slate-400">Original audio</div>
            </div>
          </div>
          <MoreHorizontal className="w-4 h-4 text-slate-400" />
        </div>

        {/* Media Frame */}
        <div className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800 aspect-square flex items-center justify-center">
          {hasMedia ? (
            <img
              src={mediaUrls[0]}
              alt="Instagram visual"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center text-slate-500 text-xs">
              <span className="text-3xl mb-2">📸</span>
              <span>Instagram requires an image or video asset. Upload or select one in Media!</span>
            </div>
          )}
        </div>

        {/* Action icons */}
        <div className="flex items-center justify-between py-2.5">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-white hover:text-pink-500 transition-colors" />
            <MessageCircle className="w-5 h-5 text-white" />
            <Share2 className="w-5 h-5 text-white" />
          </div>
          <Bookmark className="w-5 h-5 text-white" />
        </div>

        <div className="text-xs font-bold text-white mb-1.5">1,248 likes</div>

        <div className="text-xs leading-relaxed text-slate-200">
          <span className="font-bold text-white mr-1.5">superpost.hq</span>
          {renderFormattedText(displayContent)}
        </div>

        {firstComment && (
          <div className="mt-2 text-[11px] text-slate-400">
            <span className="font-bold text-slate-300 mr-1.5">superpost.hq</span>
            {firstComment}
          </div>
        )}
      </div>
    );
  }

  if (platform === 'tiktok') {
    return (
      <div className="rounded-3xl border border-slate-700/80 bg-black text-white p-3 shadow-2xl max-w-xs mx-auto aspect-[9/16] flex flex-col justify-between relative overflow-hidden font-sans">
        {/* Background Image / Video Frame */}
        {hasMedia ? (
          <img
            src={mediaUrls[0]}
            alt="TikTok media"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-indigo-950/60 to-black flex items-center justify-center p-4 text-center text-xs text-slate-400">
            Select a vertical 9:16 video or photo for TikTok preview
          </div>
        )}

        <div className="relative z-10 flex items-center justify-center text-xs font-bold text-white/80 py-2">
          Following | <span className="text-white border-b-2 border-white pb-0.5 ml-1">For You</span>
        </div>

        {/* Right side floating interactions */}
        <div className="relative z-10 self-end flex flex-col items-center gap-4 mr-1">
          <div className="flex flex-col items-center gap-1">
            <div className="w-9 h-9 rounded-full bg-slate-800/80 backdrop-blur-md flex items-center justify-center">
              <Heart className="w-5 h-5 fill-white text-white" />
            </div>
            <span className="text-[10px] font-bold">48.2K</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="w-9 h-9 rounded-full bg-slate-800/80 backdrop-blur-md flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-bold">892</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="w-9 h-9 rounded-full bg-slate-800/80 backdrop-blur-md flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-bold">4.2K</span>
          </div>

          <div className="w-8 h-8 rounded-full bg-slate-900 ring-2 ring-slate-700 overflow-hidden animate-spin">
            <img
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80"
              alt="Vinyl"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Bottom Overlay with Caption */}
        <div className="relative z-10 bg-gradient-to-t from-black via-black/80 to-transparent p-3 pt-6 rounded-b-2xl">
          <div className="font-bold text-sm text-white mb-1">@superpost_daily</div>
          <p className="text-xs text-slate-100 line-clamp-3 leading-snug mb-2">
            {displayContent}
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <Music className="w-3.5 h-3.5 animate-pulse" />
            <span className="truncate">Original Sound - SuperPost Beats</span>
          </div>
        </div>
      </div>
    );
  }

  // Fallback generic card for Threads, Bluesky, Reddit, etc.
  const config = PLATFORM_CONFIGS[platform];
  return (
    <div className="rounded-2xl border border-slate-700/80 bg-slate-900/90 text-white p-4 shadow-xl max-w-md mx-auto font-sans">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <img
            src={config.icon}
            alt={config.name}
            className="w-6 h-6 rounded-md object-contain"
          />
          <div>
            <div className="font-bold text-xs text-white">{config.name} Preview</div>
            <div className="text-[10px] text-slate-400">Publish target</div>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
          Max {config.charLimit.toLocaleString()} chars
        </span>
      </div>

      <div className="py-3 text-xs leading-relaxed text-slate-200 whitespace-pre-wrap break-words">
        {renderFormattedText(displayContent)}
      </div>

      {hasMedia && (
        <div className="rounded-xl overflow-hidden border border-slate-800 bg-black mt-2">
          <img
            src={mediaUrls[0]}
            alt="Media preview"
            className="w-full max-h-64 object-cover"
          />
        </div>
      )}

      {firstComment && (
        <div className="mt-3 p-2 rounded-lg bg-slate-800/60 border border-slate-700 text-xs text-slate-300">
          <div className="font-bold text-[10px] text-indigo-400 mb-0.5">First Comment:</div>
          <div>{firstComment}</div>
        </div>
      )}
    </div>
  );
};
