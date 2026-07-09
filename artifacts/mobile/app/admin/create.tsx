import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Platform, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { Tournament } from '@/store/mockData';
import * as Haptics from 'expo-haptics';

const MODES: Tournament['mode'][] = ['Solo', 'Duo', 'Squad', 'Clash Squad', 'BR Ranked', 'CS Ranked'];
const STATUSES: Tournament['status'][] = ['Upcoming', 'Live', 'Finished'];
const MAPS = ['Bermuda', 'Purgatory', 'Alpine', 'Kalahari', 'Nexterra'];

export default function CreateTournamentScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { tournaments, createTournament, updateTournament } = useApp();
  const { id: editId } = useLocalSearchParams<{ id?: string }>();
  const editTournament = editId ? tournaments.find(t => t.id === editId) : null;

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom + 16;

  const [title, setTitle] = useState('');
  const [mode, setMode] = useState<Tournament['mode']>('Solo');
  const [entryFee, setEntryFee] = useState('');
  const [prizePool, setPrizePool] = useState('');
  const [map, setMap] = useState('Bermuda');
  const [matchType, setMatchType] = useState('Battle Royale');
  const [totalSlots, setTotalSlots] = useState('48');
  const [dateTime, setDateTime] = useState('');
  const [status, setStatus] = useState<Tournament['status']>('Upcoming');

  useEffect(() => {
    if (editTournament) {
      setTitle(editTournament.title);
      setMode(editTournament.mode);
      setEntryFee(editTournament.entryFee.toString());
      setPrizePool(editTournament.prizePool.toString());
      setMap(editTournament.map);
      setMatchType(editTournament.matchType);
      setTotalSlots(editTournament.totalSlots.toString());
      setDateTime(editTournament.dateTime);
      setStatus(editTournament.status);
    } else {
      const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
      setDateTime(d.toISOString());
    }
  }, [editId]);

  if (!user?.isAdmin) {
    router.back();
    return null;
  }

  function handleSave() {
    if (!title.trim()) { Alert.alert('Error', 'Tournament title is required'); return; }
    const fee = parseFloat(entryFee) || 0;
    const prize = parseFloat(prizePool) || 0;
    const slots = parseInt(totalSlots) || 48;

    const data: Omit<Tournament, 'id'> = {
      title: title.trim(),
      mode,
      entryFee: fee,
      prizePool: prize,
      map,
      matchType,
      totalSlots: slots,
      registeredPlayers: editTournament?.registeredPlayers ?? 0,
      dateTime: dateTime || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status,
    };

    if (editTournament) {
      updateTournament(editTournament.id, data);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Updated', 'Tournament has been updated.', [{ text: 'OK', onPress: () => router.back() }]);
    } else {
      createTournament(data);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Created', 'Tournament has been created.', [{ text: 'OK', onPress: () => router.back() }]);
    }
  }

  const inputStyle = [styles.input, { color: colors.foreground, backgroundColor: colors.input, borderColor: colors.border }];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: bottomPad, paddingHorizontal: 16, paddingTop: topPad + 8 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.foreground} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.foreground }]}>{editTournament ? 'Edit Tournament' : 'Create Tournament'}</Text>
        </View>

        {/* Title */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>Tournament Title</Text>
          <TextInput style={inputStyle} placeholder="e.g. Solo Grand Prix Season 5" placeholderTextColor={colors.mutedForeground} value={title} onChangeText={setTitle} />
        </View>

        {/* Mode */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>Game Mode</Text>
          <View style={styles.chipRow}>
            {MODES.map(m => (
              <TouchableOpacity key={m} onPress={() => setMode(m)} style={[styles.chip, { backgroundColor: mode === m ? colors.primary : colors.card, borderColor: mode === m ? colors.primary : colors.border }]}>
                <Text style={[styles.chipText, { color: mode === m ? '#FFFFFF' : colors.foreground }]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Entry Fee & Prize Pool */}
        <View style={styles.row}>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>Entry Fee (₹)</Text>
            <TextInput style={inputStyle} placeholder="0" placeholderTextColor={colors.mutedForeground} value={entryFee} onChangeText={setEntryFee} keyboardType="numeric" />
          </View>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>Prize Pool (₹)</Text>
            <TextInput style={inputStyle} placeholder="0" placeholderTextColor={colors.mutedForeground} value={prizePool} onChangeText={setPrizePool} keyboardType="numeric" />
          </View>
        </View>

        {/* Map */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>Map</Text>
          <View style={styles.chipRow}>
            {MAPS.map(m => (
              <TouchableOpacity key={m} onPress={() => setMap(m)} style={[styles.chip, { backgroundColor: map === m ? colors.primary + '33' : colors.card, borderColor: map === m ? colors.primary : colors.border }]}>
                <Text style={[styles.chipText, { color: map === m ? colors.primary : colors.foreground }]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Match Type & Slots */}
        <View style={styles.row}>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>Match Type</Text>
            <TextInput style={inputStyle} placeholder="Battle Royale" placeholderTextColor={colors.mutedForeground} value={matchType} onChangeText={setMatchType} />
          </View>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={[styles.label, { color: colors.mutedForeground }]}>Total Slots</Text>
            <TextInput style={inputStyle} placeholder="48" placeholderTextColor={colors.mutedForeground} value={totalSlots} onChangeText={setTotalSlots} keyboardType="numeric" />
          </View>
        </View>

        {/* Status */}
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>Status</Text>
          <View style={styles.chipRow}>
            {STATUSES.map(s => (
              <TouchableOpacity key={s} onPress={() => setStatus(s)} style={[styles.chip, {
                backgroundColor: status === s ? (s === 'Live' ? '#FF3B30' : s === 'Upcoming' ? '#F59E0B' : '#888888') + '33' : colors.card,
                borderColor: status === s ? (s === 'Live' ? '#FF3B30' : s === 'Upcoming' ? '#F59E0B' : '#888888') : colors.border,
              }]}>
                <Text style={[styles.chipText, {
                  color: status === s ? (s === 'Live' ? '#FF3B30' : s === 'Upcoming' ? '#F59E0B' : '#888888') : colors.foreground,
                }]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save */}
        <TouchableOpacity onPress={handleSave} activeOpacity={0.85} style={{ marginTop: 12 }}>
          <LinearGradient colors={['#FF3B30', '#C00000']} style={styles.saveBtn}>
            <Ionicons name={editTournament ? 'save-outline' : 'add-circle-outline'} size={20} color="#FFFFFF" />
            <Text style={styles.saveBtnText}>{editTournament ? 'SAVE CHANGES' : 'CREATE TOURNAMENT'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
  backBtn: { padding: 4 },
  title: { fontSize: 20, fontFamily: 'Inter_700Bold' },
  field: { marginBottom: 16 },
  label: { fontSize: 12, fontFamily: 'Inter_600SemiBold', letterSpacing: 0.5, marginBottom: 8 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, fontFamily: 'Inter_400Regular' },
  row: { flexDirection: 'row', gap: 12 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8, borderWidth: 1 },
  chipText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 12 },
  saveBtnText: { color: '#FFFFFF', fontSize: 15, fontFamily: 'Inter_700Bold', letterSpacing: 0.5 },
});
