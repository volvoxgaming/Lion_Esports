import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { AppNotification, timeAgo } from '@/store/mockData';

type NotifType = AppNotification['type'];

const NOTIF_ICON: Record<NotifType, { icon: string; color: string }> = {
  tournament_reminder: { icon: 'time-outline', color: '#FF3B30' },
  room_released: { icon: 'key-outline', color: '#5856D6' },
  result_published: { icon: 'podium-outline', color: '#F59E0B' },
  deposit_approved: { icon: 'checkmark-circle-outline', color: '#22C55E' },
  withdraw_approved: { icon: 'checkmark-circle-outline', color: '#22C55E' },
  announcement: { icon: 'megaphone-outline', color: '#007AFF' },
};

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { notifications, markNotificationsRead } = useApp();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom + 16;
  const unread = notifications.filter(n => !n.read).length;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.foreground }]}>Notifications</Text>
        {unread > 0 && (
          <TouchableOpacity onPress={markNotificationsRead} style={[styles.markAllBtn, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.markAllText, { color: colors.primary }]}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={n => n.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bottomPad, gap: 8, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const cfg = NOTIF_ICON[item.type] ?? NOTIF_ICON.announcement;
          return (
            <View style={[styles.notifCard, { backgroundColor: item.read ? colors.card : colors.card, borderColor: item.read ? colors.border : colors.primary + '44', borderLeftWidth: item.read ? 1 : 3, borderLeftColor: item.read ? colors.border : colors.primary }]}>
              <View style={[styles.notifIcon, { backgroundColor: cfg.color + '22' }]}>
                <Ionicons name={cfg.icon as any} size={20} color={cfg.color} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.notifTitleRow}>
                  <Text style={[styles.notifTitle, { color: colors.foreground }]}>{item.title}</Text>
                  {!item.read && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
                </View>
                <Text style={[styles.notifMsg, { color: colors.mutedForeground }]}>{item.message}</Text>
                <Text style={[styles.notifTime, { color: colors.mutedForeground }]}>{timeAgo(item.date)}</Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Ionicons name="notifications-off-outline" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No notifications</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 8, gap: 12 },
  backBtn: { padding: 4 },
  title: { flex: 1, fontSize: 22, fontFamily: 'Inter_700Bold' },
  markAllBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
  markAllText: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  notifCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14, borderRadius: 12, borderWidth: 1 },
  notifIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  notifTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  notifTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold', flex: 1 },
  unreadDot: { width: 7, height: 7, borderRadius: 4, flexShrink: 0 },
  notifMsg: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 18, marginBottom: 4 },
  notifTime: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 15, fontFamily: 'Inter_400Regular' },
});
