import React from 'react';
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { colors, spacing } from '../theme';

const androidTopInset = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

export default function ScreenContainer({ children, scroll = false, centered = false, compact = false, style, contentStyle }) {
  const content = [
    styles.content,
    compact && styles.compact,
    centered && styles.centered,
    contentStyle,
  ];

  return (
    <SafeAreaView style={[styles.safe, style]}>
      {scroll ? (
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={content}>
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
    paddingTop: androidTopInset,
  },
  fill: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  compact: {
    paddingTop: spacing.md,
  },
  centered: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
