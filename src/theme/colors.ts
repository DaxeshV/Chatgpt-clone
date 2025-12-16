export type ThemeScheme = 'light' | 'dark';

export const colors = {
  light: {
    background: '#F5F5F7',
    surface: '#FFFFFF',
    userBubble: '#10A37F',
    assistantBubble: '#FFFFFF',
    borderSubtle: '#E2E2E8',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textOnAccent: '#FFFFFF',
    inputBackground: '#FFFFFF',
    inputBorder: '#D1D5DB',
    accent: '#10A37F',
    danger: '#EF4444',
    codeBackground: '#111827',
    codeBorder: '#1F2933',
    typingDot: '#9CA3AF',
  },
  dark: {
    background: '#050509',
    surface: '#15151F',
    userBubble: '#10A37F',
    assistantBubble: '#15151F',
    borderSubtle: '#27273A',
    textPrimary: '#F9FAFB',
    textSecondary: '#9CA3AF',
    textOnAccent: '#FFFFFF',
    inputBackground: '#050509',
    inputBorder: '#27273A',
    accent: '#10A37F',
    danger: '#F97373',
    codeBackground: '#020617',
    codeBorder: '#111827',
    typingDot: '#6B7280',
  },
} as const;


