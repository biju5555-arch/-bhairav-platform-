'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Message, DirectorTask, GeneratedAsset, Agent } from '@/types';

interface UseBhairavSocketReturn {
  messages: Message[];
  tasks: DirectorTask[];
  assets: GeneratedAsset[];
  agents: Agent[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://127.0.0.1:18789';

export function useBhairavSocket(): UseBhairavSocketReturn {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "🔱 Hello! I'm Bhairav, your Film Director AI. I can help you create video ads, generate images, voiceovers, and manage your creative workflow. What would you like to create today?",
      timestamp: new Date(),
    },
  ]);
  const [tasks, setTasks] = useState<DirectorTask[]>([]);
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);
  const [agents, setAgents] = useState<Agent[]>([
    { id: 'ideogram', name: 'Ideogram', status: 'idle', avatar: '🎨' },
    { id: 'runway', name: 'Runway', status: 'idle', avatar: '🎬' },
    { id: 'elevenlabs', name: 'ElevenLabs', status: 'idle', avatar: '🎙️' },
    { id: 'ghl', name: 'GoHighLevel', status: 'idle', avatar: '📊' },
  ]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionIdRef = useRef<string | null>(null);

  // Check connection on mount
  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const checkConnection = async () => {
    try {
      const response = await fetch(`${GATEWAY_URL}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      setIsConnected(response.ok);
      if (!response.ok) {
        setError('Gateway not responding');
      } else {
        setError(null);
      }
    } catch {
      setIsConnected(false);
      setError('Cannot connect to gateway');
    }
  };

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // For now, simulate a response - this will be connected to the real backend
      // In production, this would use WebSocket or SSE for real-time updates
      
      // Simulate agent working
      const updatedAgents = [...agents];
      const randomAgent = updatedAgents[Math.floor(Math.random() * updatedAgents.length)];
      randomAgent.status = 'working';
      randomAgent.currentTask = content.substring(0, 50);
      setAgents(updatedAgents);

      // Simulate response delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Reset agent status
      randomAgent.status = 'completed';
      randomAgent.currentTask = undefined;
      setAgents([...updatedAgents]);

      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `🔱 I understand you want to "${content}". Let me work on that for you. I'll coordinate with the necessary tools (Ideogram for images, Runway for video, ElevenLabs for voice) to create what you need.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsConnected(true);

      // Reset agent after delay
      setTimeout(() => {
        randomAgent.status = 'idle';
        setAgents([...updatedAgents]);
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `⚠️ Connection error: ${err instanceof Error ? err.message : 'Unknown error'}. Please try again.`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [agents]);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: "🔱 Chat cleared. Ready for a new project!",
        timestamp: new Date(),
      },
    ]);
  }, []);

  return {
    messages,
    tasks,
    assets,
    agents,
    isConnected,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}

export default useBhairavSocket;
