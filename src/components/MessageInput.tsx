import React, { useState } from 'react';
import { Keyboard, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';

type Props = {
  disabled?: boolean;
  onSend: (text: string) => void;
  theme: 'light' | 'dark';
};

export const MessageInput: React.FC<Props> = ({ disabled, onSend, theme }) => {
  const [value, setValue] = useState('');
  const palette = colors[theme];

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSend(trimmed);
    setValue('');
    Keyboard.dismiss();
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderTopColor: palette.borderSubtle,
          backgroundColor: palette.background,
        },
      ]}
    >
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: palette.inputBackground,
            borderColor: palette.inputBorder,
          },
        ]}
      >
        <TextInput
          style={[styles.input, { color: palette.textPrimary }]}
          value={value}
          onChangeText={setValue}
          placeholder="Message ChatGPT"
          placeholderTextColor={palette.textSecondary}
          multiline
          editable={!disabled}
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={disabled || !value.trim()}
          style={[
            styles.sendButton,
            {
              backgroundColor: disabled || !value.trim() ? palette.borderSubtle : palette.accent,
            },
          ]}
        >
          <Ionicons name="arrow-up" size={18} color={palette.textOnAccent} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: -1 },
    shadowRadius: 6,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 15,
    maxHeight: 120,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});


