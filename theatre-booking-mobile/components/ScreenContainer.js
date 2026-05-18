import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { colors, spacing } from '../theme';

export default function ScreenContainer({ children, scroll = false, centered = false, style, contentStyle }) {
  const content = [
    styles.content,
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
  },
  fill: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  centered: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
