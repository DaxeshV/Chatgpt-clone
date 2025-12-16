## ChatGPT-like Expo App (Chant GPT)

A polished, interview-ready ChatGPT-style mobile chat experience built with **Expo**, **React Native**, **TypeScript**, **Zustand**, and **OpenRouter**. The UI closely mirrors the official ChatGPT mobile app, including markdown rendering, code blocks, typing indicator, and a simple voice playback mode.

### Setup

- **Install dependencies (yarn)**:

```bash
yarn
```

- **Install new runtime deps (if needed)**:

   ```bash
yarn add @react-native-async-storage/async-storage zustand react-native-markdown-display expo-speech
   ```

> If you already see these in `package.json`, just run `yarn` once at the project root.

- **Start the app**:

   ```bash
yarn start
# or
yarn android
```

The app is configured with **expo-router**. The primary chat experience lives in the `Home` tab and renders `ChatScreen`.

### Environment variables / API keys

Add your keys via `app.json` (or `app.config.*`) under `expo.extra`, or as Expo public env vars:

```json
{
  "expo": {
    "extra": {
      "OPENROUTER_API_KEY": "YOUR_OPENROUTER_KEY",
      "ELEVENLABS_API_KEY": "YOUR_ELEVENLABS_KEY_OPTIONAL"
    }
  }
}
```

Or, if you prefer Expo env vars, configure:

- **OpenRouter**: `EXPO_PUBLIC_OPENROUTER_API_KEY`
- **ElevenLabs (optional)**: `EXPO_PUBLIC_ELEVENLABS_API_KEY`

> Do **not** commit real keys to source control. Use local env files or Expo secrets.

### Architecture overview

- **Routing / entry**
  - `app/_layout.tsx`: root navigation stack config via `expo-router`.
  - `app/(tabs)/_layout.tsx`: bottom tab navigator; the `index` tab renders the chat UI.
  - `app/(tabs)/index.tsx`: thin wrapper that renders `ChatScreen` from `src`.

- **Core app (src)**
  - `src/App.tsx`: simple wrapper that renders `ChatScreen` (for non-router usage / clarity).
  - `src/screens/ChatScreen.tsx`: the main ChatGPT-like experience:
    - chat list with bubbles and markdown
    - typing indicator + loading spinner
    - auto-scroll to bottom
    - “Play voice” button for assistant messages
    - integrates store + OpenRouter service

- **Components**
  - `src/components/ChatBubble.tsx`: user/assistant bubbles, markdown rendering, code block styling, error state.
  - `src/components/MessageInput.tsx`: bottom input bar with send button, haptics, and keyboard-aware behavior.
  - `src/components/TypingIndicator.tsx`: animated three-dot typing indicator, styled to match ChatGPT.
  - `src/components/VoiceButton.tsx`: per-message “Play voice” pill with loading state.

- **State management**
  - `src/store/chatStore.ts`:
    - **Zustand** + **AsyncStorage** persistence
    - `messages` array with `{ id, role, content, createdAt, error? }`
    - `isTyping` flag
    - helpers: `addMessage`, `updateMessageContent`, `markMessageError`, `setTyping`, `clearConversation`
    - persisted under `chat:conversation` so chats survive app restarts.

- **Services**
  - `src/services/openRouter.ts`:
    - wraps **OpenRouter Chat Completions API**
    - uses model `gpt-4o-mini` by default
    - includes system prompt via helper
    - graceful error handling with informative messages.
  - `src/services/voice.ts`:
    - **Primary**: ElevenLabs TTS when `ELEVENLABS_API_KEY` is configured.
    - **Fallback**: `expo-speech` device TTS when no key or error occurs.

- **Theme / styling**
  - `src/theme/colors.ts`:
    - light/dark theme palettes
    - ChatGPT-like background, surfaces, accent, and subtle borders
    - dedicated colors for code blocks and typing dots.
  - `ChatScreen` uses `useColorScheme` hook to match system theme and adjusts status bar, backgrounds, and text colors.

- **Utils**
  - `src/utils/helpers.ts`:
    - `SYSTEM_PROMPT`: `"You are a helpful AI assistant."`
    - `buildOpenRouterMessages`: maps internal messages to OpenRouter format.
    - `uuid`: simple UUID generator compatible with native + web.

### Behavior details

- **Chat flow**
  - User sends a message via `MessageInput`.
  - Store immediately appends:
    - a **user** message
    - an empty **assistant** placeholder.
  - `sendChatCompletion` is called with the full history.
  - On success, `ChatScreen` **simulates streaming**:
    - content is revealed in slices, updating the assistant placeholder until it’s complete.
  - On failure, the assistant message is tagged with an `error` string and rendered beneath the bubble.

- **Typing / loading**
  - `isTyping` in the store drives:
    - three-dot `TypingIndicator` bubble
    - small `ActivityIndicator` inline
    - disabling the send button while the model is responding.

- **Markdown & code blocks**
  - Assistant messages are rendered with `react-native-markdown-display`.
  - Code blocks are styled with a dark background, subtle border, and monospace font.
  - Inline code and headings are also styled for a premium, ChatGPT-like feel.

- **Voice mode**
  - Each assistant message with content gets a `VoiceButton`.
  - On tap:
    - UI enters a short `loading` state for that specific message.
    - `speakText` is called:
      - If ElevenLabs key is set: request TTS audio from ElevenLabs (with graceful fallback).
      - Otherwise: use `expo-speech` to speak the text.
  - The current MVP does not yet stream ElevenLabs audio through `expo-av` – it falls back to device TTS while keeping the API integration point clean and extensible.

### Running on Android emulator

- Make sure Android Studio / emulator is installed and running.
- From the project root:

```bash
yarn android
```

This launches Metro and installs the app on the emulator. The `Home` tab will show the ChatGPT-style chat UI by default.


# Chatgpt-clone
