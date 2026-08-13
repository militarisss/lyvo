import React, { ReactNode } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from '@/theme';
import { ToastHost } from '@/components/Toast';
import { Glow } from '@/components/Glow';

/**
 * Sur grand écran (web desktop), l'app s'affiche dans un cadre format iPhone
 * centré. Sur mobile (natif ou navigateur de téléphone), plein écran normal.
 */
function PhoneShell({ children }: { children: ReactNode }) {
  const { width, height } = useWindowDimensions();
  const pathname = usePathname();
  // La landing et le back-office sont de vraies pages web pleine largeur.
  const fullBleed = pathname.startsWith('/landing') || pathname.startsWith('/admin');
  const desktop = Platform.OS === 'web' && width >= 560;
  if (!desktop || fullBleed) return <>{children}</>;
  return (
    <View style={shell.backdrop}>
      <Glow side="center" top={-120} />
      <View style={[shell.frame, { height: Math.min(height - 48, 880) }]}>{children}</View>
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <PhoneShell>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.bg },
            animation: 'slide_from_right',
          }}>
          <Stack.Screen name="index" options={{ animation: 'fade' }} />
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
          <Stack.Screen name="booking-confirmed/[id]" options={{ animation: 'fade_from_bottom', gestureEnabled: false }} />
        </Stack>
        <ToastHost />
      </PhoneShell>
    </SafeAreaProvider>
  );
}

const shell = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#040109',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  frame: {
    width: 402,
    maxWidth: '100%',
    borderRadius: 44,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.lineStrong,
    backgroundColor: colors.bg,
    shadowColor: colors.violet,
    shadowOpacity: 0.35,
    shadowRadius: 60,
    shadowOffset: { width: 0, height: 20 },
  },
});
