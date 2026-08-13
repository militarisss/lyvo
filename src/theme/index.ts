import { Platform, TextStyle, ViewStyle } from 'react-native';

/**
 * LYVO Design System — tokens
 * Dark luxury: fond noir/bleu nuit, violet électrique, glow subtils.
 */

export const colors = {
  bg: '#06020D',
  bg2: '#0D0716',
  card: '#130B20',
  cardHi: '#1B1029',
  overlay: 'rgba(6,2,13,0.72)',

  violet: '#7C2CFF',
  violetLight: '#A755FF',
  magenta: '#D44DFF',
  violetDim: 'rgba(124,44,255,0.16)',

  text: '#FFFFFF',
  textSoft: '#A9A2B3',
  textFaint: '#6F6683',

  line: 'rgba(167,85,255,0.14)',
  lineStrong: 'rgba(167,85,255,0.35)',

  success: '#3DDC97',
  successDim: 'rgba(61,220,151,0.14)',
  warning: '#FFB020',
  warningDim: 'rgba(255,176,32,0.14)',
  error: '#FF5C7A',
  errorDim: 'rgba(255,92,122,0.14)',

  gold: '#F0C568',
} as const;

export const gradients = {
  primary: ['#7C2CFF', '#D44DFF'] as [string, string],
  primarySoft: ['#5B1FC4', '#9E3BD9'] as [string, string],
  card: ['#1D1130', '#120A1E'] as [string, string],
  hero: ['#2A1547', '#0D0716'] as [string, string],
  gold: ['#F0C568', '#D9982F'] as [string, string],
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
} as const;

const fontFamily = Platform.select({ web: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', default: undefined });

export const type: Record<string, TextStyle> = {
  hero: { fontFamily, fontSize: 32, lineHeight: 38, fontWeight: '800', color: colors.text, letterSpacing: -0.6 },
  h1: { fontFamily, fontSize: 26, lineHeight: 32, fontWeight: '800', color: colors.text, letterSpacing: -0.4 },
  h2: { fontFamily, fontSize: 20, lineHeight: 26, fontWeight: '700', color: colors.text, letterSpacing: -0.2 },
  h3: { fontFamily, fontSize: 16, lineHeight: 22, fontWeight: '700', color: colors.text },
  body: { fontFamily, fontSize: 15, lineHeight: 21, fontWeight: '400', color: colors.text },
  bodySoft: { fontFamily, fontSize: 15, lineHeight: 21, fontWeight: '400', color: colors.textSoft },
  small: { fontFamily, fontSize: 13, lineHeight: 18, fontWeight: '400', color: colors.textSoft },
  tiny: { fontFamily, fontSize: 11, lineHeight: 14, fontWeight: '500', color: colors.textFaint },
  label: { fontFamily, fontSize: 11, lineHeight: 14, fontWeight: '700', color: colors.textSoft, letterSpacing: 1.2, textTransform: 'uppercase' },
  price: { fontFamily, fontSize: 17, lineHeight: 22, fontWeight: '800', color: colors.text, fontVariant: ['tabular-nums'] },
};

export const glow: Record<string, ViewStyle> = {
  violet: {
    shadowColor: colors.violet,
    shadowOpacity: 0.5,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  soft: {
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
};

export const card: ViewStyle = {
  backgroundColor: colors.card,
  borderRadius: radius.lg,
  borderWidth: 1,
  borderColor: colors.line,
};

export const hitSlop = { top: 10, bottom: 10, left: 10, right: 10 };
