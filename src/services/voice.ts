import * as Speech from 'expo-speech';
import Constants from 'expo-constants';

const ELEVENLABS_API_KEY =
  Constants.expoConfig?.extra?.ELEVENLABS_API_KEY ?? process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY;

// Simple TTS abstraction – uses ElevenLabs if configured, otherwise falls back to expo-speech.
export async function speakText(text: string) {
  if (!text?.trim()) return;

  // Fallback to device TTS if no external key configured.
  if (!ELEVENLABS_API_KEY) {
    Speech.stop();
    Speech.speak(text, { language: 'en-US', pitch: 1, rate: 0.98 });
    return;
  }

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/eleven_multilingual_v2', {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.4,
          similarity_boost: 0.8,
        },
      }),
    });

    if (!response.ok) {
      // Graceful fallback
      Speech.stop();
      Speech.speak(text, { language: 'en-US', pitch: 1, rate: 0.98 });
      return;
    }

    const arrayBuffer = await response.arrayBuffer();
    // In a real app, you’d pipe this into an audio player. For MVP, just fall back.
    // TODO: Stream ElevenLabs audio buffer via expo-av Audio.Sound.
    Speech.stop();
    Speech.speak(text, { language: 'en-US', pitch: 1, rate: 0.98 });
  } catch {
    Speech.stop();
    Speech.speak(text, { language: 'en-US', pitch: 1, rate: 0.98 });
  }
}


