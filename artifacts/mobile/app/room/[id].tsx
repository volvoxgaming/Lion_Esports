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
import { formatDateTime } from '@/store/mockData';
import * as Haptics from 'expo-haptics';
import * as Clipboard from 'expo-clipboard';

export default function RoomScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tournaments, joinedTournamentIds } = useApp();
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  const tournament = tournaments.find(t => t.id === id);
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom + 16;

  async function copyText(text: string, isId: boolean) {
    await Clipboard.setStringAsync(text);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (isId) { setCopiedId(true); setTimeout(() => setCopiedId(false), 2000); }
    else { setCopiedPass(true); setTimeout(() => setCopiedPass(false), 2000); }
  }

  if (!tournament) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, paddingTop: topPad + 16, paddingHorizontal: 16 }]}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 16 }}>
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <Text style={[styles.notFound, { color: colors.mutedForeground }]}>Tournament not found</Text>
      </View>
    );
  }

  const isJoined = joinedTournamentIds.includes(tournament.id);
  const hasRoom = !!tournament.roomId;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: bottomPad, paddingTop: topPad + 12, paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>

        {/* Back button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.foreground }]}>Room Details</Text>
        <Text style={[styles.sub, { color: colors.mutedForeground }]}>{tournament.title}</Text>

        {!isJoined ? (
          <View style={[styles.alertBox, { backgroundColor: '#FF3B3022', borderColor: '#FF3B3066' }]}>
            <Ionicons name="alert-circle-outline" size={20} color="#FF3B30" />
            <Text style={styles.alertText}>You are not registered for this tournament.</Text>
          </View>
        ) : !hasRoom ? (
          <View style={[styles.alertBox, { backgroundColor: '#F59E0B22', borderColor: '#F59E0B66' }]}>
            <Ionicons name="time-outline" size={20} color="#F59E0B" />
            <View style={{ flex: 1 }}>
              <Text style={[styles.alertText, { color: '#F59E0B' }]}>Room details not yet released</Text>
              <Text style={[styles.alertSub, { color: colors.mutedForeground }]}>Room ID and password will be available 10 minutes before match start.</Text>
            </View>
          </View>
        ) : (
          <>
            {/* Room ID */}
            <View style={[styles.roomCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.roomLabel, { color: colors.mutedForeground }]}>ROOM ID</Text>
              <View style={styles.roomValueRow}>
                <Text style={[styles.roomValue, { color: colors.foreground }]}>{tournament.roomId}</Text>
                <TouchableOpacity
                  onPress={() => copyText(tournament.roomId!, true)}
                  style={[styles.copyBtn, { backgroundColor: copiedId ? '#22C55E33' : colors.muted }]}
                >
                  <Ionicons name={copiedId ? 'checkmark' : 'copy-outline'} size={18} color={copiedId ? '#22C55E' : colors.foreground} />
                  <Text style={[styles.copyText, { color: copiedId ? '#22C55E' : colors.foreground }]}>{copiedId ? 'Copied!' : 'Copy'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Password */}
            <View style={[styles.roomCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.roomLabel, { color: colors.mutedForeground }]}>PASSWORD</Text>
              <View style={styles.roomValueRow}>
                <Text style={[styles.roomValue, { color: colors.foreground }]}>{tournament.roomPassword}</Text>
                <TouchableOpacity
                  onPress={() => copyText(tournament.roomPassword!, false)}
                  style={[styles.copyBtn, { backgroundColor: copiedPass ? '#22C55E33' : colors.muted }]}
                >
                  <Ionicons name={copiedPass ? 'checkmark' : 'copy-outline'} size={18} color={copiedPass ? '#22C55E' : colors.foreground} />
                  <Text style={[styles.copyText, { color: copiedPass ? '#22C55E' : colors.foreground }]}>{copiedPass ? 'Copied!' : 'Copy'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Match Time */}
            <View style={[styles.timeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Ionicons name="time-outline" size={18} color="#FF3B30" />
              <View>
                <Text style={[styles.timeLabel, { color: colors.mutedForeground }]}>Match Start Time</Text>
                <Text style={[styles.timeValue, { color: colors.foreground }]}>{formatDateTime(tournament.dateTime)}</Text>
              </View>
            </View>

            {/* Tips */}
            <LinearGradient colors={['#1A0A0A', '#0B0B0B']} style={[styles.tipCard, { borderColor: '#FF3B3033' }]}>
              <Text style={[styles.tipTitle, { color: colors.mutedForeground }]}>MATCH TIPS</Text>
              <View style={styles.tipRow}>
                <Ionicons name="checkmark-circle-outline" size={14} color="#FF3B30" />
                <Text style={[styles.tipText, { color: colors.mutedForeground }]}>Join the room 5 minutes before start</Text>
              </View>
              <View style={styles.tipRow}>
                <Ionicons name="checkmark-circle-outline" size={14} color="#FF3B30" />
                <Text style={[styles.tipText, { color: colors.mutedForeground }]}>Do not share room credentials</Text>
              </View>
              <View style={styles.tipRow}>
                <Ionicons name="checkmark-circle-outline" size={14} color="#FF3B30" />
                <Text style={[styles.tipText, { color: colors.mutedForeground }]}>Ensure stable internet connection</Text>
              </View>
            </LinearGradient>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  notFound: { fontSize: 16, fontFamily: 'Inter_400Regular' },
  backBtn: { marginBottom: 16, alignSelf: 'flex-start' },
  title: { fontSize: 24, fontFamily: 'Inter_700Bold', marginBottom: 4 },
  sub: { fontSize: 14, fontFamily: 'Inter_400Regular', marginBottom: 24 },
  alertBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  alertText: { color: '#FF3B30', fontSize: 14, fontFamily: 'Inter_500Medium', flex: 1 },
  alertSub: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 4 },
  roomCard: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 12 },
  roomLabel: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 1, marginBottom: 8 },
  roomValueRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  roomValue: { fontSize: 24, fontFamily: 'Inter_700Bold', letterSpacing: 3 },
  copyBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  copyText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  timeCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 16 },
  timeLabel: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  timeValue: { fontSize: 16, fontFamily: 'Inter_600SemiBold', marginTop: 2 },
  tipCard: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 8 },
  tipTitle: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 1, marginBottom: 4 },
  tipRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tipText: { fontSize: 13, fontFamily: 'Inter_400Regular', flex: 1 },
});
