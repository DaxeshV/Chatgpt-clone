import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Markdown from 'react-native-markdown-display';

import type { ChatMessage } from '../store/chatStore';
import { colors } from '../theme/colors';

type Props = {
  message: ChatMessage;
  isLastFromAssistant?: boolean;
  theme: 'light' | 'dark';
};

export const ChatBubble: React.FC<Props> = ({ message, theme }) => {
  const isUser = message.role === 'user';
  const palette = colors[theme];

  const bubbleStyle = [
    styles.bubble,
    {
      backgroundColor: isUser ? palette.userBubble : palette.assistantBubble,
      alignSelf: isUser ? 'flex-end' : 'flex-start',
      borderTopLeftRadius: isUser ? 18 : 4,
      borderTopRightRadius: isUser ? 4 : 18,
    },
  ];

  const textColor = isUser ? palette.textOnAccent : palette.textPrimary;

  return (
    <View style={styles.container}>
      <View style={bubbleStyle}>
        {isUser ? (
          <Text style={[styles.text, { color: textColor }]}>{message.content}</Text>
        ) : (
          <Markdown
            style={markdownStyles(palette, textColor)}
            mergeStyle
          >
            {message.content || '...'}
          </Markdown>
        )}
        {message.error ? <Text style={[styles.error, { color: palette.danger }]}>{message.error}</Text> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  bubble: {
    maxWidth: '88%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
  },
  text: {
    fontSize: 15,
    lineHeight: 20,
  },
  error: {
    marginTop: 6,
    fontSize: 12,
  },
});

const markdownStyles = (palette: (typeof colors)['light'] | (typeof colors)['dark'], textColor: string) =>
  StyleSheet.create({
    body: {
      color: textColor,
      fontSize: 15,
      lineHeight: 20,
    },
    paragraph: {
      marginTop: 0,
      marginBottom: 6,
    },
    bullet_list: {
      marginBottom: 4,
    },
    ordered_list: {
      marginBottom: 4,
    },
    code_block: {
      backgroundColor: palette.codeBackground,
      borderColor: palette.codeBorder,
      borderWidth: StyleSheet.hairlineWidth,
      borderRadius: 10,
      padding: 10,
      fontFamily: 'Courier',
      color: '#E5E7EB',
      marginVertical: 6,
    },
    code_inline: {
      backgroundColor: palette.codeBackground,
      borderRadius: 4,
      paddingHorizontal: 4,
      paddingVertical: 2,
      fontFamily: 'Courier',
      color: '#E5E7EB',
    },
    heading1: { fontSize: 22, fontWeight: '600', marginVertical: 4 },
    heading2: { fontSize: 20, fontWeight: '600', marginVertical: 4 },
    heading3: { fontSize: 18, fontWeight: '600', marginVertical: 4 },
    list_item: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    link: {
      color: palette.accent,
    },
  });


