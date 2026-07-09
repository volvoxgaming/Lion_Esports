import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { StatusBadge } from '@/components/StatusBadge';
import { formatCurrency, formatDateTime, getModeColor } from '@/store/mockData';
import * as Haptics from 'expo-haptics';

const GOLD = '#FFD700';
const SUCCESS = '#22C55E';

export default function TournamentDetailScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tournaments, joinedTournamentIds, walletBalance, joinTournament } = useApp();
  const [joining, setJoining] = useState(false);

  const tournament = tournaments.find(t => t.id === id);
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom + 16;

  if (!tournament) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, paddingTop: topPad + 16 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.notFound}>
          <Text style={[styles.notFoundText, { color: colors.mutedForeground }]}>Tournament not found</Text>
        </View>
      </View>
    );
  }

  const joined = joinedTournamentIds.includes(tournament.id);
  const modeColor = getModeColor(tournament.mode);
  const slotsLeft = tournament.totalSlots - tournament.registeredPlayers;
  const isFull = slotsLeft === 0;
  const canShowRoom = tournament.status === 'Live' && tournament.roomId;
  const isFinished = tournament.status === 'Finished';

  async function handleJoin() {
    if (joining || !tournament) return;
    if (tournament.entryFee > walletBalance) {
      Alert.alert('Insufficient Balance', `You need ${formatCurrency(tournament.entryFee)} but have ${formatCurrency(walletBalance)}.\n\nPlease deposit funds in your wallet.`, [
        { text: 'Go to Wallet', onPress: () => router.push('/(tabs)/wallet') },
        { text: 'Cancel', style: 'cancel' },
      ]);
      return;
    }
    Alert.alert(
      'Confirm Registration',
      `Entry fee of ${formatCurrency(tournament.entryFee)} will be deducted from your wallet.\n\nWallet after: ${formatCurrency(walletBalance - tournament.entryFee)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setJoining(true);
            const result = await joinTournament(tournament.id);
            setJoining(false);
            if (result === 'success') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert('Registered!', `You've joined ${tournament.title}. Good luck!`);
            } else if (result === 'full') {
              Alert.alert('Tournament Full', 'No slots available.');
            } else if (result === 'already_joined') {
              Alert.alert('Already Registered', 'You are already in this tournament.');
            }
          },
        },
      ],
    );
  }

  const infoRows = [
    { icon: 'map-outline', label: 'Map', value: tournament.map },
    { icon: 'game-controller-outline', label: 'Match Type', value: tournament.matchType },
    { icon: 'people-outline', label: 'Slots', value: `${tournament.registeredPlayers}/${tournament.totalSlots}` },
    { icon: 'time-outline', label: 'Date & Time', value: formatDateTime(tournament.dateTime) },
  ];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: bottomPad }} showsVerticalScrollIndicator={false}>

        {/* Banner */}
        <LinearGradient
          colors={[modeColor + 'BB', modeColor + '55', '#0B0B0B']}
          style={[styles.banner, { paddingTop: topPad + 12 }]}
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={styles.bannerContent}>
            <View style={styles.modeRow}>
              <View style={[styles.modeBadge, { backgroundColor: modeColor + '33', borderColor: modeColor + '66' }]}>
                <Text style={[styles.modeText, { color: modeColor }]}>{tournament.mode}</Text>
              </View>
              <StatusBadge status={tournament.status} size="md" />
            </View>
            <Text style={styles.tourTitle}>{tournament.title}</Text>
          </View>
        </LinearGradient>

        {/* Prize & Fee highlights */}
        <View style={styles.highlights}>
          <LinearGradient colors={['#1E1500', '#0B0B0B']} style={[styles.highlightCard, { borderColor: GOLD + '44' }]}>
            <Ionicons name="trophy" size={20} color={GOLD} />
            <Text style={[styles.hlLabel, { color: colors.mutedForeground }]}>Prize Pool</Text>
            <Text style={[styles.hlValue, { color: GOLD }]}>{formatCurrency(tournament.prizePool)}</Text>
          </LinearGradient>
          <LinearGradient colors={['#1A0A0A', '#0B0B0B']} style={[styles.highlightCard, { borderColor: colors.primary + '44' }]}>
            <Ionicons name="wallet-outline" size={20} color={colors.primary} />
            <Text style={[styles.hlLabel, { color: colors.mutedForeground }]}>Entry Fee</Text>
            <Text style={[styles.hlValue, { color: colors.foreground }]}>
              {tournament.entryFee === 0 ? 'FREE' : formatCurrency(tournament.entryFee)}
            </Text>
          </LinearGradient>
        </View>

        {/* Info rows */}
        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {infoRows.map((row, i) => (
            <View key={row.label} style={[styles.infoRow, i < infoRows.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
              <Ionicons name={row.icon as any} size={16} color={colors.mutedForeground} />
              <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>{row.label}</Text>
              <Text style={[styles.infoValue, { color: colors.foreground }]}>{row.value}</Text>
            </View>
          ))}
          {/* Slots progress */}
          <View style={styles.slotBar}>
            <View style={[styles.slotFill, { width: `${(tournament.registeredPlayers / tournament.totalSlots) * 100}%` as any, backgroundColor: modeColor }]} />
          </View>
        </View>

        {/* Action area */}
        <View style={styles.actionArea}>
          {joined ? (
            <View style={styles.joinedBlock}>
              <View style={[styles.joinedBanner, { backgroundColor: SUCCESS + '22', borderColor: SUCCESS + '44' }]}>
                <Ionicons name="checkmark-circle" size={24} color={SUCCESS} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.joinedTitle, { color: SUCCESS }]}>You're Registered!</Text>
                  <Text style={[styles.joinedSub, { color: colors.mutedForeground }]}>Check back for room details before match time</Text>
                </View>
              </View>
              {canShowRoom && (
                <TouchableOpacity onPress={() => router.push(`/room/${tournament.id}`)} activeOpacity={0.85}>
                  <LinearGradient colors={['#FF3B30', '#C00000']} style={styles.actionBtn}>
                    <Ionicons name="key-outline" size={18} color="#FFFFFF" />
                    <Text style={styles.actionBtnText}>VIEW ROOM DETAILS</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
              {isFinished && (
                <TouchableOpacity onPress={() => router.push(`/results/${tournament.id}`)} activeOpacity={0.85}>
                  <LinearGradient colors={['#5856D6', '#4040B0']} style={styles.actionBtn}>
                    <Ionicons name="podium-outline" size={18} color="#FFFFFF" />
                    <Text style={styles.actionBtnText}>VIEW RESULTS</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          ) : isFinished ? (
            <View style={[styles.finishedBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="flag-outline" size={24} color={colors.mutedForeground} />
              <Text style={[styles.finishedText, { color: colors.mutedForeground }]}>Tournament has ended</Text>
            </View>
          ) : isFull ? (
            <View style={[styles.fullBox, { backgroundColor: '#FF3B3011', borderColor: '#FF3B3033' }]}>
              <Ionicons name="close-circle-outline" size={24} color={colors.primary} />
              <Text style={[styles.fullText, { color: colors.primary }]}>No slots available</Text>
            </View>
          ) : (
            <View style={styles.joinBlock}>
              <View style={[styles.walletHint, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Ionicons name="wallet-outline" size={16} color={colors.mutedForeground} />
                <Text style={[styles.walletText, { color: colors.mutedForeground }]}>
                  Your balance: {formatCurrency(walletBalance)} · Entry: {formatCurrency(tournament.entryFee)}
                </Text>
              </View>
              <TouchableOpacity onPress={handleJoin} disabled={joining} activeOpacity={0.85}>
                <LinearGradient colors={['#FF3B30', '#C00000']} style={styles.actionBtn}>
                  <Ionicons name="enter-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.actionBtnText}>{joining ? 'REGISTERING...' : 'JOIN TOURNAMENT'}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { fontSize: 16, fontFamily: 'Inter_400Regular' },
  banner: { paddingHorizontal: 16, paddingBottom: 24 },
  backBtn: { marginBottom: 16, alignSelf: 'flex-start', padding: 4 },
  bannerContent: { gap: 10 },
  modeRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  modeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  modeText: { fontSize: 12, fontFamily: 'Inter_700Bold', letterSpacing: 0.5 },
  tourTitle: { color: '#FFFFFF', fontSize: 26, fontFamily: 'Inter_700Bold', lineHeight: 30 },
  highlights: { flexDirection: 'row', paddingHorizontal: 16, gap: 12, marginBottom: 12 },
  highlightCard: { flex: 1, alignItems: 'center', padding: 16, borderRadius: 14, borderWidth: 1, gap: 4 },
  hlLabel: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  hlValue: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  infoCard: { marginHorizontal: 16, borderRadius: 14, borderWidth: 1, overflow: 'hidden', marginBottom: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 10 },
  infoLabel: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular' },
  infoValue: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  slotBar: { height: 3, backgroundColor: 'rgba(255,255,255,0.1)', margin: 12, borderRadius: 2, overflow: 'hidden' },
  slotFill: { height: '100%', borderRadius: 2 },
  actionArea: { paddingHorizontal: 16 },
  joinedBlock: { gap: 12 },
  joinedBanner: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 16, borderRadius: 12, borderWidth: 1 },
  joinedTitle: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  joinedSub: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 12 },
  actionBtnText: { color: '#FFFFFF', fontSize: 15, fontFamily: 'Inter_700Bold', letterSpacing: 0.5 },
  finishedBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 20, borderRadius: 12, borderWidth: 1 },
  finishedText: { fontSize: 15, fontFamily: 'Inter_500Medium' },
  fullBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 20, borderRadius: 12, borderWidth: 1 },
  fullText: { fontSize: 15, fontFamily: 'Inter_500Medium' },
  joinBlock: { gap: 10 },
  walletHint: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 10, borderWidth: 1 },
  walletText: { fontSize: 12, fontFamily: 'Inter_400Regular', flex: 1 },
});
