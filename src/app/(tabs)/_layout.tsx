import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@/theme';
import { useT } from '@/services/i18n';
import { useChat } from '@/stores/chat';
import { tapLight } from '@/utils/haptics';

const ICONS: Record<string, { on: keyof typeof Ionicons.glyphMap; off: keyof typeof Ionicons.glyphMap }> = {
  index: { on: 'home', off: 'home-outline' },
  explore: { on: 'compass', off: 'compass-outline' },
  bookings: { on: 'calendar', off: 'calendar-outline' },
  messages: { on: 'chatbubble', off: 'chatbubble-outline' },
  profile: { on: 'person', off: 'person-outline' },
};

interface TabBarProps {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: {
    emit: (e: { type: string; target?: string; canPreventDefault?: boolean }) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
}

function TabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const { t } = useT();
  const unread = useChat((s) => s.conversations.reduce((n, c) => n + c.unread, 0));
  const labels: Record<string, string> = {
    index: t('home'),
    explore: t('explore'),
    bookings: t('bookings'),
    messages: t('messages'),
    profile: t('profile'),
  };

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {state.routes.map((route, i) => {
        const focused = state.index === i;
        const icons = ICONS[route.name];
        if (!icons) return null;
        return (
          <Pressable
            key={route.key}
            onPress={() => {
              tapLight();
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
            }}
            style={styles.item}>
            <View>
              <Ionicons name={focused ? icons.on : icons.off} size={22} color={focused ? colors.violetLight : colors.textFaint} />
              {route.name === 'messages' && unread > 0 && (
                <View style={styles.dot}>
                  <Text style={styles.dotText}>{unread}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.label, focused && { color: colors.violetLight }]}>{labels[route.name]}</Text>
            {focused && <View style={styles.indicator} />}
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...(props as unknown as TabBarProps)} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.bg } }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="bookings" />
      <Tabs.Screen name="messages" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.bg2,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 10,
    paddingHorizontal: spacing.sm,
  },
  item: { flex: 1, alignItems: 'center', gap: 3 },
  label: { fontSize: 10, fontWeight: '600', color: colors.textFaint },
  indicator: { width: 14, height: 3, borderRadius: 2, backgroundColor: colors.violet, marginTop: 1 },
  dot: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: colors.magenta,
    minWidth: 15,
    height: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  dotText: { color: '#fff', fontSize: 9, fontWeight: '800' },
});
