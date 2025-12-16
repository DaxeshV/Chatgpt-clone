import React from 'react';

import { ChatScreen } from './screens/ChatScreen';

// This file is mainly here to satisfy the requested folder structure.
// The actual entry point is handled by expo-router, which renders `ChatScreen`
// via `app/(tabs)/index.tsx`.

export default function App() {
  return <ChatScreen />;
}


