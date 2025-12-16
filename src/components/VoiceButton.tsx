import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';

type Props = {
  loading?: boolean;
  onPress: () => void;
  theme: 'light' | 'dark';
};

export const VoiceButton: React.FC<Props> = ({ loading, onPress, theme }) => {
  const palette = colors[theme];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          borderColor: palette.borderSubtle,
          backgroundColor: palette.surface,
        },
      ]}
    >
      <View style={styles.left}>
        <Ionicons name="volume-high-outline" size={18} color={palette.textPrimary} />
        <Text style={[styles.label, { color: palette.textPrimary }]}>Play voice</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="small" color={palette.accent} />
      ) : (
        <Ionicons name="play" size={18} color={palette.accent} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    marginLeft: 12,
    marginBottom: 6,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 13,
  },
});


