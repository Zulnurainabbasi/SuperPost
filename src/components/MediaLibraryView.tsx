import React, { useState } from 'react';
import {
  ExternalLink,
  Eye,
  FileImage,
  FolderOpen,
  Image as ImageIcon,
  Play,
  Plus,
  Trash2,
  UploadCloud,
  Video,
  X,
  Zap,
} from 'lucide-react';
import { useSuperPost } from '../context/SuperPostContext';
import { MediaAsset } from '../types';

export const MediaLibraryView: React.FC = () => {
  const { media, addMediaAsset, deleteMediaAsset, openComposer } = useSuperPost();
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [newAssetUrl, setNewAssetUrl] = useState('');
  const [newAssetTitle, setNewAssetTitle] = useState('');
  const [newAssetType, setNewAssetType] = useState<'image' | 'video'>('image');
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);

  const filteredMedia = media.filter((m) => {
    if (filterType !== 'all' && m.type !== filterType) return false;
    return true;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssetUrl.trim()) return;

    addMediaAsset({
      title: newAssetTitle.trim() || 'Uploaded Media Asset',
      url: newAssetUrl.trim(),
      type: newAssetType,
      sizeFormatted: '1.2 MB',
      aspectRatio: '16:9',
      tags: ['Uploaded'],
    });

    setNewAssetUrl('');
    setNewAssetTitle('');
    setUploadModalOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] overflow-y-auto bg-[#0b0f17] p-4 sm:p-6 space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Media Assets & Cloud Storage</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-normal">
              {filteredMedia.length} assets
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Store and organize high-res visual assets, video reels, and AI generated creatives
          </p>
        </div>

        <button
          onClick={() => setUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Media</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs font-medium w-fit">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            filterType === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          All Assets ({media.length})
        </button>
        <button
          onClick={() => setFilterType('image')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            filterType === 'image' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Images</span>
        </button>
        <button
          onClick={() => setFilterType('video')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            filterType === 'video' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Videos</span>
        </button>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredMedia.map((asset) => (
          <div
            key={asset.id}
            className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-indigo-500/60 transition-all shadow-md flex flex-col"
          >
            <div className="relative aspect-square w-full overflow-hidden bg-slate-950 flex items-center justify-center">
              <img
                src={asset.url}
                alt={asset.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {asset.type === 'video' && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                    <Play className="w-4 h-4 fill-white ml-0.5" />
                  </div>
                </div>
              )}

              {/* Hover quick action overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                <div className="flex justify-end gap-1">
                  <button
                    onClick={() => setPreviewAsset(asset)}
                    className="p-1 rounded-md bg-black/60 hover:bg-slate-800 text-white transition-colors"
                    title="Inspect asset"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteMediaAsset(asset.id)}
                    className="p-1 rounded-md bg-black/60 hover:bg-red-600 text-white transition-colors"
                    title="Delete asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => openComposer({ mediaUrls: [asset.url] })}
                  className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold flex items-center justify-center gap-1 shadow-sm"
                >
                  <Plus className="w-3 h-3" />
                  <span>Use in Post</span>
                </button>
              </div>
            </div>

            <div className="p-2.5">
              <div className="text-xs font-semibold text-slate-200 truncate" title={asset.title}>
                {asset.title}
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                <span>{asset.aspectRatio}</span>
                <span>{asset.sizeFormatted}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleUploadSubmit}
            className="relative w-full max-w-md rounded-3xl bg-[#0f172a] border border-slate-700 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-indigo-400" />
                <span>Upload Media Asset</span>
              </h3>
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="p-1 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Asset Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Product Demo Reel Oct 2026"
                  value={newAssetTitle}
                  onChange={(e) => setNewAssetTitle(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Image or Video URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newAssetUrl}
                  onChange={(e) => setNewAssetUrl(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Media Type
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setNewAssetType('image')}
                    className={`flex-1 py-1.5 rounded-xl border text-xs font-semibold ${
                      newAssetType === 'image'
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Image
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewAssetType('video')}
                    className={`flex-1 py-1.5 rounded-xl border text-xs font-semibold ${
                      newAssetType === 'video'
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Video
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="w-1/2 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20"
              >
                Add to Library
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Asset Preview Full Modal */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#0f172a] border border-slate-700 shadow-2xl p-5 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="font-bold text-sm text-white">{previewAsset.title}</div>
              <button
                onClick={() => setPreviewAsset(null)}
                className="p-1 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-black max-h-[60vh] flex items-center justify-center">
              <img
                src={previewAsset.url}
                alt={previewAsset.title}
                className="w-full h-full object-contain max-h-[58vh]"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-slate-400">
                Uploaded {previewAsset.uploadedAt} • {previewAsset.sizeFormatted} • {previewAsset.aspectRatio}
              </div>

              <button
                onClick={() => {
                  setPreviewAsset(null);
                  openComposer({ mediaUrls: [previewAsset.url] });
                }}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Post with this Asset</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
