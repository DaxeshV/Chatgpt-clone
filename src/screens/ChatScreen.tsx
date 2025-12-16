import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';

import { ChatBubble } from '../components/ChatBubble';
import { MessageInput } from '../components/MessageInput';
import { TypingIndicator } from '../components/TypingIndicator';
import { VoiceButton } from '../components/VoiceButton';
import { sendChatCompletion } from '../services/openRouter';
import { speakText } from '../services/voice';
import { normalizeError } from '../services/errors';
import { colors } from '../theme/colors';
import { useChatStore } from '../store/chatStore';
import { uuid } from '../utils/helpers';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const ChatScreen: React.FC = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = colors[colorScheme];

  const { messages, isTyping, addMessage, updateMessageContent, markMessageError, setTyping } = useChatStore();
  const [voiceLoadingId, setVoiceLoadingId] = useState<string | null>(null);

  const scrollViewRef = useRef<ScrollView | null>(null);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    // auto-scroll when messages change
    const timeout = setTimeout(scrollToBottom, 80);
    return () => clearTimeout(timeout);
  }, [messages.length, isTyping]);

  const handleSend = useCallback(
    async (text: string) => {
      const userMessage = addMessage({
        id: uuid(),
        role: 'user',
        content: text,
      });

      const assistantId = uuid();
      addMessage({
        id: assistantId,
        role: 'assistant',
        content: '',
      });

      setTyping(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      try {
        const { content } = await sendChatCompletion([...messages, userMessage]);

        // Simulate streaming by progressively updating the assistant message.
        let index = 0;
        const step = Math.max(8, Math.floor(content.length / 40));

        const interval = setInterval(() => {
          index += step;
          if (index >= content.length) {
            updateMessageContent(assistantId, content);
            clearInterval(interval);
          } else {
            updateMessageContent(assistantId, content.slice(0, index));
          }
        }, 30);
      } catch (err: unknown) {
        const friendlyMessage = normalizeError(
          err,
          'Something went wrong while contacting the model. Please try again.',
        );
        markMessageError(assistantId, friendlyMessage);
      } finally {
        setTyping(false);
      }
    },
    [addMessage, markMessageError, messages, setTyping, updateMessageContent],
  );

  const handlePlayVoice = useCallback(
    async (id: string, text: string) => {
      if (!text) return;
      setVoiceLoadingId(id);
      try {
        await speakText(text);
      } finally {
        setVoiceLoadingId((current) => (current === id ? null : current));
      }
    },
    [],
  );

  const isEmpty = messages.length === 0;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <View style={[styles.header, { backgroundColor: palette.background }]}>
          <Text style={[styles.title, { color: palette.textPrimary }]}>ChatGPT</Text>
          <Text style={[styles.subtitle, { color: palette.textSecondary }]}>Powered by OpenRouter</Text>
        </View>

        <View style={styles.flex}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={[
              styles.scrollContent,
              { backgroundColor: palette.background },
            ]}
            keyboardShouldPersistTaps="handled"
          >
            {isEmpty ? (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyTitle, { color: palette.textPrimary }]}>
                  What can I help you with today?
                </Text>
                <Text style={[styles.emptySubtitle, { color: palette.textSecondary }]}>
                  Ask coding questions, brainstorm ideas, or debug issues just like the real ChatGPT app.
                </Text>
              </View>
            ) : (
              messages.map((m) => (
                <View key={m.id}>
                  <ChatBubble message={m} theme={colorScheme} />
                  {m.role === 'assistant' && !!m.content && !m.error && (
                    <VoiceButton
                      theme={colorScheme}
                      loading={voiceLoadingId === m.id}
                      onPress={() => handlePlayVoice(m.id, m.content)}
                    />
                  )}
                </View>
              ))
            )}

            <TypingIndicator visible={isTyping} theme={colorScheme} />

            {isTyping && (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color={palette.accent} />
              </View>
            )}
          </ScrollView>
        </View>

        <MessageInput theme={colorScheme} onSend={handleSend} disabled={isTyping} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  loadingRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  emptyState: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
});


