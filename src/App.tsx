/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { SuperPostProvider, useSuperPost } from './context/SuperPostContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CalendarView } from './components/CalendarView';
import { PostsListView } from './components/PostsListView';
import { AnalyticsView } from './components/AnalyticsView';
import { ChannelsView } from './components/ChannelsView';
import { MediaLibraryView } from './components/MediaLibraryView';
import { AgentsCopilotView } from './components/AgentsCopilotView';
import { TeamView } from './components/TeamView';
import { BillingView } from './components/BillingView';
import { SettingsView } from './components/SettingsView';
import { AdminView } from './components/AdminView';
import { PostComposerModal } from './components/PostComposerModal';
import { RepositoryAnalysisModal } from './components/RepositoryAnalysisModal';
import { NotificationDrawer } from './components/NotificationDrawer';

const AppContent: React.FC = () => {
  const { activeTab, openComposer } = useSuperPost();

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K or simply 'c' when not inside an input/textarea
      if (
        (e.key === 'k' && (e.metaKey || e.ctrlKey)) ||
        (e.key === 'c' &&
          !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName))
      ) {
        e.preventDefault();
        openComposer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openComposer]);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'calendar':
        return <CalendarView />;
      case 'posts':
        return <PostsListView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'channels':
        return <ChannelsView />;
      case 'media':
        return <MediaLibraryView />;
      case 'agents':
        return <AgentsCopilotView />;
      case 'team':
        return <TeamView />;
      case 'billing':
        return <BillingView />;
      case 'admin':
        return <AdminView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <CalendarView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] flex flex-col text-slate-100">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-hidden flex flex-col">
          {renderActiveView()}
        </main>
      </div>

      {/* Overlays & Modals */}
      <PostComposerModal />
      <RepositoryAnalysisModal />
      <NotificationDrawer />
    </div>
  );
};

export default function App() {
  return (
    <SuperPostProvider>
      <AppContent />
    </SuperPostProvider>
  );
}
