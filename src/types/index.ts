export type PlatformId =
  | 'x'
  | 'linkedin'
  | 'instagram'
  | 'tiktok'
  | 'youtube'
  | 'facebook'
  | 'reddit'
  | 'pinterest'
  | 'threads'
  | 'bluesky'
  | 'telegram'
  | 'discord'
  | 'medium';

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  category: 'social' | 'video' | 'community' | 'blog';
  icon: string;
  color: string;
  charLimit: number;
  supportsVideo: boolean;
  supportsCarousel: boolean;
  supportsFirstComment: boolean;
  aspectRatios: string[];
  placeholderText: string;
}

export interface SocialAccount {
  id: string;
  platform: PlatformId;
  name: string;
  handle: string;
  avatarUrl: string;
  connected: boolean;
  followerCount: number;
  lastSync: string;
  health: 'healthy' | 'warning' | 'disconnected';
  type: 'profile' | 'page' | 'channel' | 'subreddit';
}

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed';

export interface PostItem {
  id: string;
  content: string;
  platforms: PlatformId[];
  targetAccountIds: string[];
  mediaUrls: string[];
  scheduledAt: string; // ISO string
  publishedAt?: string;
  status: PostStatus;
  firstComment?: string;
  tags: string[];
  analytics?: {
    impressions: number;
    likes: number;
    shares: number;
    comments: number;
    clicks: number;
  };
  platformCustomizations?: Partial<Record<PlatformId, string>>;
}

export interface MediaAsset {
  id: string;
  title: string;
  url: string;
  type: 'image' | 'video';
  sizeFormatted: string;
  uploadedAt: string;
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:5';
  tags: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Editor' | 'Viewer';
  avatarUrl: string;
  status: 'active' | 'invited';
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  plan: 'Free' | 'Pro' | 'Agency' | 'Lifetime';
  postsUsed: number;
  postsLimit: number;
  channelsConnected: number;
  channelsLimit: number;
}

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  enabled: boolean;
  frequency: string;
  promptTemplate: string;
}
