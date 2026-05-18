import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';

export default function ScreenContainer({ children, scroll = false, centered = false, compact = false, style, contentStyle }) {
  const content = [
    styles.content,
    compact && styles.compact,
    centered && styles.centered,
    contentStyle,
  ];

  return (
    <SafeAreaView edges={['top', 'bottom', 'left', 'right']} style={[styles.safe, style]}>
      {scroll ? (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={content}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.fill, ...content]}>
          {children}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  fill: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl + spacing.xs,
    paddingBottom: spacing.xxl + spacing.lg,
  },
  compact: {
    paddingTop: spacing.xxl,
  },
  centered: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
