import Constants from 'expo-constants';

import { OPENROUTER_BASE_URL, OPENROUTER_MODEL } from '../config';
import type { ChatMessage } from '../store/chatStore';
import { buildOpenRouterMessages } from '../utils/helpers';

const OPENROUTER_API_KEY =
  Constants.expoConfig?.extra?.OPENROUTER_API_KEY ?? process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;

export type OpenRouterChatCompletion = {
  content: string;
};

export async function sendChatCompletion(history: ChatMessage[]): Promise<OpenRouterChatCompletion> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('Missing OpenRouter API key. Set it in app config / env.');
  }

  const payload = {
    model: OPENROUTER_MODEL,
    messages: buildOpenRouterMessages(history),
  };

  // NOTE:
  // Browsers (including Expo Web) forbid manually setting the `Referer` header.
  // Using the custom `HTTP-Referer` header recommended for server-side usage
  // can cause `Network request failed` errors on web builds.
  //
  // To keep things working across native + web, we only send the required
  // headers here. This is enough for OpenRouter to work.
  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'X-Title': 'Chant GPT Clone',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || `OpenRouter error: ${response.status}`);
  }

  const json = (await response.json()) as any;
  const content: string =
    json.choices?.[0]?.message?.content ??
    json.choices?.[0]?.message?.[0]?.content ??
    'Sorry, I could not generate a response.';

  return { content };
}


