export const colors = {
  background: '#151114',
  backgroundAlt: '#1d171b',
  surface: '#261d22',
  surfaceRaised: '#30242a',
  border: '#4a363f',
  borderSoft: '#5a434c',
  text: '#fff4df',
  textMuted: '#cfbea7',
  textSubtle: '#9f8d7c',
  primary: '#8f1f2f',
  primaryPressed: '#731827',
  accent: '#d6a84f',
  accentSoft: '#f4dfad',
  danger: '#c84b4b',
  dangerPressed: '#9f3737',
  success: '#54a477',
  info: '#7fb2d9',
  input: '#1f181d',
  white: '#ffffff',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  pill: 999,
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
};

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
};

export const typography = {
  title: {
    color: colors.text,
    fontSize: fontSizes.xl,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: fontSizes.md,
    lineHeight: 22,
  },
  label: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
    fontWeight: '700',
  },
};
