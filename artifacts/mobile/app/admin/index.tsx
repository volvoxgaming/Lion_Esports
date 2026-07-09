import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { StatusBadge } from '@/components/StatusBadge';
import { formatCurrency, timeAgo } from '@/store/mockData';

const GOLD = '#FFD700';
const SUCCESS = '#22C55E';
const WARNING = '#F59E0B';

export default function AdminScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { tournaments, transactions, getPendingRequests, approveRequest, rejectRequest, deleteTournament, releaseRoom } = useApp();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom + 16;

  if (!user?.isAdmin) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, paddingTop: topPad + 16, paddingHorizontal: 16 }]}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 16 }}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.denied, { color: colors.primary }]}>Access Denied</Text>
      </View>
    );
  }

  const pending = getPendingRequests();
  const liveCount = tournaments.filter(t => t.status === 'Live').length;
  const totalPrize = tournaments.reduce((sum, t) => sum + t.prizePool, 0);

  const statsData = [
    { icon: 'trophy-outline', label: 'Tournaments', value: tournaments.length.toString(), color: '#FF3B30' },
    { icon: 'radio-button-on-outline', label: 'Live Now', value: liveCount.toString(), color: SUCCESS },
    { icon: 'cash-outline', label: 'Total Prizes', value: `₹${(totalPrize / 1000).toFixed(0)}K`, color: GOLD },
    { icon: 'time-outline', label: 'Pending', value: pending.length.toString(), color: WARNING },
  ];

  function handleApprove(txId: string) {
    Alert.alert('Approve Request', 'Confirm approval?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Approve', onPress: () => approveRequest(txId) },
    ]);
  }

  function handleReject(txId: string) {
    Alert.alert('Reject Request', 'Confirm rejection?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reject', style: 'destructive', onPress: () => rejectRequest(txId) },
    ]);
  }

  function handleDelete(tournamentId: string, title: string) {
    Alert.alert('Delete Tournament', `Delete "${title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTournament(tournamentId) },
    ]);
  }

  function handleReleaseRoom(tournamentId: string) {
    Alert.alert('Release Room Details', 'Enter room ID and password (demo: auto-fill)', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Release',
        onPress: () => {
          const id = 'R' + Math.floor(Math.random() * 999999).toString().padStart(6, '0');
          const pass = 'FF' + Math.floor(Math.random() * 9999).toString().padStart(4, '0');
          releaseRoom(tournamentId, id, pass);
          Alert.alert('Success', `Room ${id} released with password ${pass}`);
        },
      },
    ]);
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: bottomPad }} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <LinearGradient colors={['#1A0A0A', '#0B0B0B']} style={[styles.header, { paddingTop: topPad + 8 }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.foreground} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <View style={[styles.adminIcon, { backgroundColor: GOLD + '22' }]}>
              <Ionicons name="shield" size={24} color={GOLD} />
            </View>
            <View>
              <Text style={[styles.title, { color: colors.foreground }]}>Admin Panel</Text>
              <Text style={[styles.sub, { color: colors.mutedForeground }]}>Manage tournaments & users</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          {statsData.map(s => (
            <View key={s.label} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name={s.icon as any} size={20} color={s.color} />
              <Text style={[styles.statVal, { color: colors.foreground }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Pending Requests */}
        {pending.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Pending Requests</Text>
            <View style={styles.sectionContent}>
              {pending.map(tx => (
                <View key={tx.id} style={[styles.pendingCard, { backgroundColor: colors.card, borderColor: WARNING + '44' }]}>
                  <View style={[styles.pendingIcon, { backgroundColor: tx.type === 'deposit' ? SUCCESS + '22' : '#FF3B3022' }]}>
                    <Ionicons name={tx.type === 'deposit' ? 'arrow-down-circle-outline' : 'arrow-up-circle-outline'} size={20} color={tx.type === 'deposit' ? SUCCESS : '#FF3B30'} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.pendingDesc, { color: colors.foreground }]}>{tx.description}</Text>
                    <Text style={[styles.pendingTime, { color: colors.mutedForeground }]}>{timeAgo(tx.date)}</Text>
                  </View>
                  <Text style={[styles.pendingAmount, { color: tx.amount > 0 ? SUCCESS : '#FF3B30' }]}>
                    {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                  </Text>
                  <View style={styles.pendingActions}>
                    <TouchableOpacity onPress={() => handleApprove(tx.id)} style={[styles.approveBtn, { backgroundColor: SUCCESS + '22' }]}>
                      <Ionicons name="checkmark" size={16} color={SUCCESS} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleReject(tx.id)} style={[styles.rejectBtn, { backgroundColor: '#FF3B3022' }]}>
                      <Ionicons name="close" size={16} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Tournament Management */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Tournaments</Text>
            <TouchableOpacity onPress={() => router.push('/admin/create')} style={[styles.createBtn, { backgroundColor: colors.primary }]}>
              <Ionicons name="add" size={16} color="#FFFFFF" />
              <Text style={styles.createBtnText}>Create</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.sectionContent}>
            {tournaments.map(t => (
              <View key={t.id} style={[styles.tourCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.tourTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.tourTitle, { color: colors.foreground }]} numberOfLines={1}>{t.title}</Text>
                    <Text style={[styles.tourMode, { color: colors.mutedForeground }]}>{t.mode} · {t.map}</Text>
                  </View>
                  <StatusBadge status={t.status} />
                </View>
                <View style={styles.tourStats}>
                  <Text style={[styles.tourStat, { color: GOLD }]}>Prize: {formatCurrency(t.prizePool)}</Text>
                  <Text style={[styles.tourStat, { color: colors.mutedForeground }]}>Slots: {t.registeredPlayers}/{t.totalSlots}</Text>
                </View>
                <View style={styles.tourActions}>
                  {t.status === 'Upcoming' && (
                    <TouchableOpacity onPress={() => handleReleaseRoom(t.id)} style={[styles.actionChip, { backgroundColor: '#5856D633' }]}>
                      <Ionicons name="key-outline" size={13} color="#5856D6" />
                      <Text style={[styles.chipText, { color: '#5856D6' }]}>Release Room</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => router.push(`/admin/create?id=${t.id}`)} style={[styles.actionChip, { backgroundColor: colors.muted }]}>
                    <Ionicons name="pencil-outline" size={13} color={colors.foreground} />
                    <Text style={[styles.chipText, { color: colors.foreground }]}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(t.id, t.title)} style={[styles.actionChip, { backgroundColor: '#FF3B3022' }]}>
                    <Ionicons name="trash-outline" size={13} color="#FF3B30" />
                    <Text style={[styles.chipText, { color: '#FF3B30' }]}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  denied: { fontSize: 20, fontFamily: 'Inter_700Bold' },
  header: { paddingHorizontal: 16, paddingBottom: 20 },
  backBtn: { marginBottom: 12, alignSelf: 'flex-start' },
  headerContent: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  adminIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontFamily: 'Inter_700Bold' },
  sub: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, paddingTop: 16, gap: 8 },
  statCard: { width: '47%', marginHorizontal: '1.5%', padding: 16, borderRadius: 12, borderWidth: 1, alignItems: 'center', gap: 6 },
  statVal: { fontSize: 22, fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitle: { fontSize: 17, fontFamily: 'Inter_700Bold' },
  sectionContent: { gap: 8 },
  createBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8 },
  createBtnText: { color: '#FFFFFF', fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  pendingCard: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 12, borderWidth: 1 },
  pendingIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  pendingDesc: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  pendingTime: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },
  pendingAmount: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  pendingActions: { flexDirection: 'row', gap: 6 },
  approveBtn: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  rejectBtn: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  tourCard: { borderRadius: 12, borderWidth: 1, padding: 14, gap: 10 },
  tourTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  tourTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  tourMode: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  tourStats: { flexDirection: 'row', gap: 16 },
  tourStat: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  tourActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  actionChip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  chipText: { fontSize: 12, fontFamily: 'Inter_500Medium' },
});
