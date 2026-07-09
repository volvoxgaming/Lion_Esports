import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { MOCK_RESULTS, formatCurrency } from '@/store/mockData';

const GOLD = '#FFD700';
const SILVER = '#C0C0C0';
const BRONZE = '#CD7F32';

function rankColor(pos: number) {
  if (pos === 1) return GOLD;
  if (pos === 2) return SILVER;
  if (pos === 3) return BRONZE;
  return '#888888';
}

export default function ResultsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tournaments } = useApp();
  const { user } = useAuth();

  const tournament = tournaments.find(t => t.id === id);
  const results = MOCK_RESULTS[id ?? ''] ?? [];
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 34 : insets.bottom + 16;
  const myResult = results.find(r => r.userId === user?.id);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: bottomPad, paddingTop: topPad + 12, paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>

        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.foreground} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.foreground }]}>Match Results</Text>
        {tournament && <Text style={[styles.sub, { color: colors.mutedForeground }]}>{tournament.title}</Text>}

        {results.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="podium-outline" size={48} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Results not yet published</Text>
          </View>
        ) : (
          <>
            {/* My Result */}
            {myResult && (
              <LinearGradient
                colors={[rankColor(myResult.position) + '44', rankColor(myResult.position) + '11']}
                style={[styles.myResult, { borderColor: rankColor(myResult.position) + '66' }]}
              >
                <Text style={[styles.myLabel, { color: rankColor(myResult.position) }]}>YOUR RESULT</Text>
                <View style={styles.myStats}>
                  <View style={styles.myStatItem}>
                    <Text style={[styles.myStatVal, { color: rankColor(myResult.position) }]}>#{myResult.position}</Text>
                    <Text style={[styles.myStatLabel, { color: colors.mutedForeground }]}>Position</Text>
                  </View>
                  <View style={styles.myStatItem}>
                    <Text style={[styles.myStatVal, { color: colors.foreground }]}>{myResult.kills}</Text>
                    <Text style={[styles.myStatLabel, { color: colors.mutedForeground }]}>Kills</Text>
                  </View>
                  <View style={styles.myStatItem}>
                    <Text style={[styles.myStatVal, { color: colors.foreground }]}>{myResult.points}</Text>
                    <Text style={[styles.myStatLabel, { color: colors.mutedForeground }]}>Points</Text>
                  </View>
                  <View style={styles.myStatItem}>
                    <Text style={[styles.myStatVal, { color: GOLD }]}>{formatCurrency(myResult.prize)}</Text>
                    <Text style={[styles.myStatLabel, { color: colors.mutedForeground }]}>Prize</Text>
                  </View>
                </View>
              </LinearGradient>
            )}

            {/* Results table header */}
            <View style={[styles.tableHeader, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.colH, { color: colors.mutedForeground, width: 36 }]}>POS</Text>
              <Text style={[styles.colH, { color: colors.mutedForeground, flex: 1 }]}>PLAYER</Text>
              <Text style={[styles.colH, { color: colors.mutedForeground, width: 40 }]}>KILLS</Text>
              <Text style={[styles.colH, { color: colors.mutedForeground, width: 48 }]}>POINTS</Text>
              <Text style={[styles.colH, { color: colors.mutedForeground, width: 60 }]}>PRIZE</Text>
            </View>

            {results.sort((a, b) => a.position - b.position).map((r, i) => {
              const rc = rankColor(r.position);
              const isMe = r.userId === user?.id;
              return (
                <View key={r.userId} style={[styles.resultRow, { backgroundColor: isMe ? rc + '22' : colors.card, borderColor: isMe ? rc + '66' : colors.border }]}>
                  <View style={[styles.posCircle, { backgroundColor: rc + '33' }]}>
                    <Text style={[styles.posText, { color: rc }]}>{r.position}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.playerName, { color: colors.foreground }]} numberOfLines={1}>{r.username}</Text>
                    {isMe && <Text style={[styles.youTag, { color: rc }]}>You</Text>}
                  </View>
                  <Text style={[styles.colVal, { color: colors.foreground, width: 40 }]}>{r.kills}</Text>
                  <Text style={[styles.colVal, { color: colors.foreground, width: 48 }]}>{r.points}</Text>
                  <Text style={[styles.colVal, { color: r.prize > 0 ? GOLD : colors.mutedForeground, width: 60, fontFamily: 'Inter_700Bold' }]}>
                    {r.prize > 0 ? formatCurrency(r.prize) : '-'}
                  </Text>
                </View>
              );
            })}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  backBtn: { marginBottom: 16, alignSelf: 'flex-start' },
  title: { fontSize: 24, fontFamily: 'Inter_700Bold', marginBottom: 4 },
  sub: { fontSize: 14, fontFamily: 'Inter_400Regular', marginBottom: 20 },
  empty: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 16, fontFamily: 'Inter_400Regular' },
  myResult: { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 20 },
  myLabel: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 1, marginBottom: 12 },
  myStats: { flexDirection: 'row', justifyContent: 'space-around' },
  myStatItem: { alignItems: 'center' },
  myStatVal: { fontSize: 20, fontFamily: 'Inter_700Bold' },
  myStatLabel: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },
  tableHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1, marginBottom: 4 },
  colH: { fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 0.8, textAlign: 'center' },
  resultRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 10, borderWidth: 1, marginBottom: 4, gap: 10 },
  posCircle: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  posText: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  playerName: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  youTag: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 0.5 },
  colVal: { fontSize: 14, fontFamily: 'Inter_500Medium', textAlign: 'center' },
});
