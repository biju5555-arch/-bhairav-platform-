'use client';

import { useState } from 'react';
import LeftSidebar from '@/components/layout/LeftSidebar';
import RightSidebar from '@/components/layout/RightSidebar';
import ChatInterface from '@/components/chat/ChatInterface';
import { useBhairavSocket } from '@/hooks/useBhairavSocket';
import { DirectorTask, GeneratedAsset } from '@/types';

export default function Home() {
  const { messages, tasks: socketTasks, assets: socketAssets, agents, isConnected, isLoading, sendMessage, clearMessages } = useBhairavSocket();

  // Sample data for demo - will be replaced by real data from socket
  const [tasks, setTasks] = useState<DirectorTask[]>([
    {
      id: '1',
      name: 'Generate BuildSage ad image',
      status: 'completed',
      progress: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Create voiceover script',
      status: 'processing',
      progress: 65,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      name: 'Render final video',
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const [assets, setAssets] = useState<GeneratedAsset[]>([
    {
      id: '1',
      name: 'buildsage_hero.png',
      type: 'image',
      url: '/assets/buildsage_hero.png',
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'contractor_scene.mp4',
      type: 'video',
      url: '/assets/contractor_scene.mp4',
      createdAt: new Date(),
    },
    {
      id: '3',
      name: 'voiceover_v1.mp3',
      type: 'audio',
      url: '/assets/voiceover_v1.mp3',
      createdAt: new Date(),
    },
  ]);

  const [selectedTaskId, setSelectedTaskId] = useState<string | undefined>();

  const handleNewProject = () => {
    clearMessages();
    setSelectedTaskId(undefined);
  };

  const handleSelectTask = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  return (
    <div className="flex h-screen bg-zinc-900 text-white">
      {/* Left Sidebar - Tasks & Navigation */}
      <LeftSidebar
        tasks={tasks}
        onNewProject={handleNewProject}
        onSelectTask={handleSelectTask}
        selectedTaskId={selectedTaskId}
      />

      {/* Main Chat Interface */}
      <ChatInterface
        messages={messages}
        isLoading={isLoading}
        isConnected={isConnected}
        onSendMessage={sendMessage}
      />

      {/* Right Sidebar - Agents, Progress & Assets */}
      <RightSidebar
        tasks={tasks}
        assets={assets}
        agents={agents}
        isConnected={isConnected}
      />
    </div>
  );
}
