import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform,
  TextInput, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import * as Haptics from 'expo-haptics';

const GOLD = '#FFD700';
const SUCCESS = '#22C55E';

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout, updateUser } = useAuth();
  const { joinedTournamentIds, unreadCount } = useApp();
  const [editing, setEditing] = useState(false);
  const [editUsername, setEditUsername] = useState(user?.username ?? '');

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 84 + 20 : insets.bottom + 80;

  function saveEdit() {
    if (!editUsername.trim()) return;
    updateUser({ username: editUsername.trim() });
    setEditing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  function handleLogout() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => { logout(); router.replace('/auth/login'); } },
    ]);
  }

  if (!user) return null;

  const menuItems = [
    { icon: 'notifications-outline', label: 'Notifications', badge: unreadCount, onPress: () => router.push('/notifications') },
    { icon: 'trophy-outline', label: 'My Tournaments', badge: joinedTournamentIds.length, onPress: () => router.push('/(tabs)/tournaments') },
    { icon: 'wallet-outline', label: 'Wallet', onPress: () => router.push('/(tabs)/wallet') },
    ...(user.isAdmin ? [{ icon: 'shield-outline', label: 'Admin Panel', isAdmin: true, onPress: () => router.push('/admin' as any) }] : []),
  ];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: bottomPad }} showsVerticalScrollIndicator={false}>

        {/* Header gradient */}
        <LinearGradient colors={['#1A0A0A', '#0B0B0B']} style={[styles.headerGrad, { paddingTop: topPad + 8 }]}>
          {/* Avatar */}
          <View style={styles.avatarWrap}>
            <LinearGradient colors={['#FF3B30', '#C00000']} style={styles.avatar}>
              <Ionicons name="person" size={36} color="#FFFFFF" />
            </LinearGradient>
            {user.isAdmin && (
              <View style={[styles.adminBadge, { backgroundColor: GOLD }]}>
                <Ionicons name="shield" size={10} color="#000" />
              </View>
            )}
          </View>

          {/* Username editing */}
          {editing ? (
            <View style={styles.editRow}>
              <TextInput
                style={[styles.editInput, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.input }]}
                value={editUsername}
                onChangeText={setEditUsername}
                autoFocus
              />
              <TouchableOpacity onPress={saveEdit} style={[styles.saveBtn, { backgroundColor: SUCCESS }]}>
                <Ionicons name="checkmark" size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEditing(false)}>
                <Ionicons name="close" size={18} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.nameRow}>
              <Text style={[styles.username, { color: colors.foreground }]}>{user.username}</Text>
              <TouchableOpacity onPress={() => { setEditing(true); setEditUsername(user.username); }}>
                <Ionicons name="pencil-outline" size={16} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>
          )}

          <Text style={[styles.uid, { color: colors.mutedForeground }]}>UID: {user.uid}</Text>
          <Text style={[styles.email, { color: colors.mutedForeground }]}>{user.email}</Text>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsSection}>
          <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: colors.foreground }]}>{user.matchesPlayed}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Matches</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: colors.foreground }]}>{user.wins}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Wins</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: GOLD }]}>₹{(user.earnings / 1000).toFixed(0)}K</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Earnings</Text>
            </View>
          </View>
        </View>

        {/* Menu */}
        <View style={[styles.menuCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              onPress={item.onPress}
              style={[styles.menuRow, i < menuItems.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: (item as any).isAdmin ? GOLD + '22' : colors.muted }]}>
                <Ionicons name={item.icon as any} size={20} color={(item as any).isAdmin ? GOLD : colors.foreground} />
              </View>
              <Text style={[styles.menuLabel, { color: (item as any).isAdmin ? GOLD : colors.foreground }]}>{item.label}</Text>
              {(item.badge ?? 0) > 0 && (
                <View style={[styles.menuBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.menuBadgeText}>{item.badge}</Text>
                </View>
              )}
              <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity onPress={handleLogout} style={[styles.logoutBtn, { backgroundColor: colors.card, borderColor: '#FF3B3044' }]} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerGrad: { alignItems: 'center', paddingBottom: 24, paddingHorizontal: 24, gap: 6 },
  avatarWrap: { position: 'relative', marginBottom: 8 },
  avatar: { width: 84, height: 84, borderRadius: 42, alignItems: 'center', justifyContent: 'center' },
  adminBadge: { position: 'absolute', bottom: 0, right: 0, width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  username: { fontSize: 22, fontFamily: 'Inter_700Bold' },
  editRow: { flexDirection: 'row', alignItems: 'center', gap: 8, width: '80%' },
  editInput: { flex: 1, fontSize: 18, fontFamily: 'Inter_600SemiBold', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  saveBtn: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  uid: { fontSize: 12, fontFamily: 'Inter_500Medium', letterSpacing: 0.5 },
  email: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  statsSection: { paddingHorizontal: 16, marginBottom: 12 },
  statsCard: { flexDirection: 'row', borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 18 },
  statNum: { fontSize: 20, fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },
  statDivider: { width: 1 },
  menuCard: { marginHorizontal: 16, borderRadius: 14, borderWidth: 1, overflow: 'hidden', marginBottom: 12 },
  menuRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  menuIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { fontSize: 15, fontFamily: 'Inter_500Medium' },
  menuBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10 },
  menuBadgeText: { color: '#FFFFFF', fontSize: 11, fontFamily: 'Inter_700Bold' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 16, padding: 16, borderRadius: 12, borderWidth: 1, justifyContent: 'center' },
  logoutText: { color: '#FF3B30', fontSize: 15, fontFamily: 'Inter_600SemiBold' },
});
