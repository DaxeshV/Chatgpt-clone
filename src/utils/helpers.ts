import type { ChatMessage } from '../store/chatStore';

export const SYSTEM_PROMPT = 'You are a helpful AI assistant.';

export const buildOpenRouterMessages = (messages: ChatMessage[]) => {
  return [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  ];
};

export const uuid = () => {
  // Small UUID helper that is stable and works on native & web.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};


