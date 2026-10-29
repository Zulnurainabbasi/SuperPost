import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AIAgent,
  MediaAsset,
  PlatformId,
  PostItem,
  SocialAccount,
  TeamMember,
  Workspace,
} from '../types';
import {
  INITIAL_ACCOUNTS,
  INITIAL_AGENTS,
  INITIAL_MEDIA,
  INITIAL_MEMBERS,
  INITIAL_POSTS,
  INITIAL_WORKSPACES,
} from '../data/mockData';
import confetti from 'canvas-confetti';

interface SuperPostContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  posts: PostItem[];
  addPost: (post: Omit<PostItem, 'id'>) => PostItem;
  updatePost: (id: string, updates: Partial<PostItem>) => void;
  deletePost: (id: string) => void;
  accounts: SocialAccount[];
  toggleAccountConnection: (id: string) => void;
  connectAccount: (platform: PlatformId, handle: string, name: string) => void;
  disconnectAccount: (id: string) => void;
  media: MediaAsset[];
  addMediaAsset: (asset: Omit<MediaAsset, 'id' | 'uploadedAt'>) => void;
  deleteMediaAsset: (id: string) => void;
  workspaces: Workspace[];
  activeWorkspace: Workspace;
  setActiveWorkspace: (ws: Workspace) => void;
  teamMembers: TeamMember[];
  inviteMember: (email: string, role: TeamMember['role'], name: string) => void;
  removeMember: (id: string) => void;
  agents: AIAgent[];
  toggleAgent: (id: string) => void;
  composerOpen: boolean;
  composerInitialData: Partial<PostItem> | null;
  openComposer: (initialData?: Partial<PostItem>) => void;
  closeComposer: () => void;
  repoAnalysisModalOpen: boolean;
  setRepoAnalysisModalOpen: (open: boolean) => void;
  notificationDrawerOpen: boolean;
  setNotificationDrawerOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPlatformFilter: PlatformId | 'all';
  setSelectedPlatformFilter: (p: PlatformId | 'all') => void;
  triggerCelebration: () => void;
  resetToDefaults: () => void;
}

const STORAGE_KEY = 'superpost_data_v1';

const SuperPostContext = createContext<SuperPostContextType | undefined>(undefined);

export const SuperPostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('calendar');
  const [posts, setPosts] = useState<PostItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_posts`);
      return saved ? JSON.parse(saved) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  const [accounts, setAccounts] = useState<SocialAccount[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_accounts`);
      return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
    } catch {
      return INITIAL_ACCOUNTS;
    }
  });

  const [media, setMedia] = useState<MediaAsset[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_media`);
      return saved ? JSON.parse(saved) : INITIAL_MEDIA;
    } catch {
      return INITIAL_MEDIA;
    }
  });

  const [workspaces] = useState<Workspace[]>(INITIAL_WORKSPACES);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace>(INITIAL_WORKSPACES[0]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [agents, setAgents] = useState<AIAgent[]>(INITIAL_AGENTS);

  const [composerOpen, setComposerOpen] = useState(false);
  const [composerInitialData, setComposerInitialData] = useState<Partial<PostItem> | null>(null);
  const [repoAnalysisModalOpen, setRepoAnalysisModalOpen] = useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<PlatformId | 'all'>('all');

  // Persistence
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_posts`, JSON.stringify(posts));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [posts]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_accounts`, JSON.stringify(accounts));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [accounts]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_media`, JSON.stringify(media));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }, [media]);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#a855f7', '#ec4899', '#3b82f6', '#10b981'],
      });
    } catch (e) {
      console.log('Confetti triggered', e);
    }
  };

  const addPost = (postData: Omit<PostItem, 'id'>): PostItem => {
    const newPost: PostItem = {
      ...postData,
      id: `post-${Date.now()}`,
    };
    setPosts((prev) => [newPost, ...prev]);
    return newPost;
  };

  const updatePost = (id: string, updates: Partial<PostItem>) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, ...updates } : post))
    );
  };

  const deletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleAccountConnection = (id: string) => {
    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === id
          ? {
              ...acc,
              connected: !acc.connected,
              health: !acc.connected ? 'healthy' : 'disconnected',
            }
          : acc
      )
    );
  };

  const connectAccount = (platform: PlatformId, handle: string, name: string) => {
    const newAcc: SocialAccount = {
      id: `acc-${Date.now()}`,
      platform,
      name,
      handle: handle.startsWith('@') ? handle : `@${handle}`,
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=150&auto=format&fit=crop&q=80`,
      connected: true,
      followerCount: Math.floor(Math.random() * 25000) + 1200,
      lastSync: 'Just now',
      health: 'healthy',
      type: 'profile',
    };
    setAccounts((prev) => [...prev, newAcc]);
    triggerCelebration();
  };

  const disconnectAccount = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  const addMediaAsset = (asset: Omit<MediaAsset, 'id' | 'uploadedAt'>) => {
    const newAsset: MediaAsset = {
      ...asset,
      id: `med-${Date.now()}`,
      uploadedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    setMedia((prev) => [newAsset, ...prev]);
  };

  const deleteMediaAsset = (id: string) => {
    setMedia((prev) => prev.filter((m) => m.id !== id));
  };

  const inviteMember = (email: string, role: TeamMember['role'], name: string) => {
    const newMember: TeamMember = {
      id: `mem-${Date.now()}`,
      name: name || email.split('@')[0],
      email,
      role,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80`,
      status: 'invited',
    };
    setTeamMembers((prev) => [...prev, newMember]);
  };

  const removeMember = (id: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const toggleAgent = (id: string) => {
    setAgents((prev) =>
      prev.map((ag) => (ag.id === id ? { ...ag, enabled: !ag.enabled } : ag))
    );
  };

  const openComposer = (initialData?: Partial<PostItem>) => {
    setComposerInitialData(initialData || null);
    setComposerOpen(true);
  };

  const closeComposer = () => {
    setComposerOpen(false);
    setComposerInitialData(null);
  };

  const resetToDefaults = () => {
    setPosts(INITIAL_POSTS);
    setAccounts(INITIAL_ACCOUNTS);
    setMedia(INITIAL_MEDIA);
    setTeamMembers(INITIAL_MEMBERS);
    setAgents(INITIAL_AGENTS);
    localStorage.removeItem(`${STORAGE_KEY}_posts`);
    localStorage.removeItem(`${STORAGE_KEY}_accounts`);
    localStorage.removeItem(`${STORAGE_KEY}_media`);
  };

  return (
    <SuperPostContext.Provider
      value={{
        activeTab,
        setActiveTab,
        posts,
        addPost,
        updatePost,
        deletePost,
        accounts,
        toggleAccountConnection,
        connectAccount,
        disconnectAccount,
        media,
        addMediaAsset,
        deleteMediaAsset,
        workspaces,
        activeWorkspace,
        setActiveWorkspace,
        teamMembers,
        inviteMember,
        removeMember,
        agents,
        toggleAgent,
        composerOpen,
        composerInitialData,
        openComposer,
        closeComposer,
        repoAnalysisModalOpen,
        setRepoAnalysisModalOpen,
        notificationDrawerOpen,
        setNotificationDrawerOpen,
        searchQuery,
        setSearchQuery,
        selectedPlatformFilter,
        setSelectedPlatformFilter,
        triggerCelebration,
        resetToDefaults,
      }}
    >
      {children}
    </SuperPostContext.Provider>
  );
};

export const useSuperPost = () => {
  const context = useContext(SuperPostContext);
  if (!context) {
    throw new Error('useSuperPost must be used within a SuperPostProvider');
  }
  return context;
};
