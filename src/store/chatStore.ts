import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ChatRole = 'system' | 'user' | 'assistant';

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
  error?: string;
};

type ChatState = {
  messages: ChatMessage[];
  isTyping: boolean;
  addMessage: (msg: Omit<ChatMessage, 'createdAt'> & { createdAt?: number }) => ChatMessage;
  updateMessageContent: (id: string, content: string) => void;
  markMessageError: (id: string, error: string) => void;
  setTyping: (value: boolean) => void;
  clearConversation: () => void;
};

const STORAGE_KEY = 'chat:conversation';

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      isTyping: false,
      addMessage: (msg) => {
        const message: ChatMessage = {
          createdAt: msg.createdAt ?? Date.now(),
          ...msg,
        };
        set((state) => ({ messages: [...state.messages, message] }));
        return message;
      },
      updateMessageContent: (id, content) => {
        set((state) => ({
          messages: state.messages.map((m) => (m.id === id ? { ...m, content } : m)),
        }));
      },
      markMessageError: (id, error) => {
        set((state) => ({
          messages: state.messages.map((m) => (m.id === id ? { ...m, error } : m)),
        }));
      },
      setTyping: (value) => set({ isTyping: value }),
      clearConversation: () => set({ messages: [] }),
    }),
    {
      name: STORAGE_KEY,
      getStorage: () => AsyncStorage,
      partialize: (state) => ({ messages: state.messages }),
    },
  ),
);


