import React from 'react';
import { View, Text, FlatList, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { MOCK_LEADERBOARD, LeaderboardEntry } from '@/store/mockData';

const GOLD = '#FFD700';
const SILVER = '#C0C0C0';
const BRONZE = '#CD7F32';
const RANK_COLORS = [GOLD, SILVER, BRONZE];

function PodiumItem({ entry, height, isFirst }: { entry: LeaderboardEntry; height: number; isFirst?: boolean }) {
  const colors = useColors();
  const rc = RANK_COLORS[entry.rank - 1] ?? '#888';
  return (
    <View style={[styles.podiumItem, isFirst && styles.podiumFirst]}>
      <View style={[styles.crown, { opacity: entry.rank === 1 ? 1 : 0 }]}>
        <Ionicons name="ribbon" size={18} color={GOLD} />
      </View>
      <View style={[styles.avatar, { backgroundColor: rc + '33', borderColor: rc }]}>
        <Ionicons name="person" size={24} color={rc} />
      </View>
      <Text style={[styles.podiumName, { color: colors.foreground }]} numberOfLines={1}>{entry.username}</Text>
      <Text style={[styles.podiumEarnings, { color: rc }]}>₹{(entry.earnings / 1000).toFixed(0)}K</Text>
      <LinearGradient colors={[rc + '66', rc + '22']} style={[styles.pedestal, { height }]}>
        <Text style={[styles.pedestalRank, { color: rc }]}>#{entry.rank}</Text>
      </LinearGradient>
    </View>
  );
}

function LeaderRow({ entry, index }: { entry: LeaderboardEntry; index: number }) {
  const colors = useColors();
  const rc = index < 3 ? RANK_COLORS[index] : colors.mutedForeground;
  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <Text style={[styles.rowRank, { color: rc }]}>#{entry.rank}</Text>
      <View style={[styles.rowAvatar, { backgroundColor: colors.muted }]}>
        <Ionicons name="person" size={16} color={colors.mutedForeground} />
      </View>
      <Text style={[styles.rowName, { color: colors.foreground }]} numberOfLines={1}>{entry.username}</Text>
      <View style={styles.rowStats}>
        <Text style={[styles.rowKills, { color: colors.mutedForeground }]}>{entry.kills}K</Text>
        <Text style={[styles.rowWins, { color: colors.mutedForeground }]}>{entry.wins}W</Text>
        <Text style={[styles.rowEarnings, { color: GOLD }]}>₹{(entry.earnings / 1000).toFixed(0)}K</Text>
      </View>
    </View>
  );
}

export default function LeaderboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 84 + 20 : insets.bottom + 80;

  const top3 = MOCK_LEADERBOARD.slice(0, 3);
  const rest = MOCK_LEADERBOARD.slice(3);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <FlatList
        data={rest}
        keyExtractor={e => e.userId}
        contentContainerStyle={{ paddingBottom: bottomPad }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <>
            {/* Header */}
            <View style={[styles.header, { paddingTop: topPad + 8 }]}>
              <Text style={[styles.title, { color: colors.foreground }]}>Leaderboard</Text>
              <Text style={[styles.sub, { color: colors.mutedForeground }]}>Season 5 Rankings</Text>
            </View>

            {/* Podium */}
            <View style={styles.podium}>
              <PodiumItem entry={top3[1]} height={90} />
              <PodiumItem entry={top3[0]} height={120} isFirst />
              <PodiumItem entry={top3[2]} height={70} />
            </View>

            {/* Column headers */}
            <View style={[styles.colHeader, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.colText, { color: colors.mutedForeground, width: 36 }]}>RANK</Text>
              <Text style={[styles.colText, { color: colors.mutedForeground, flex: 1, marginLeft: 44 }]}>PLAYER</Text>
              <Text style={[styles.colText, { color: colors.mutedForeground }]}>KILLS</Text>
              <Text style={[styles.colText, { color: colors.mutedForeground }]}>WINS</Text>
              <Text style={[styles.colText, { color: colors.mutedForeground }]}>EARNED</Text>
            </View>
          </>
        )}
        renderItem={({ item, index }) => (
          <View style={[styles.listCard, { backgroundColor: colors.card }]}>
            <LeaderRow entry={item} index={index + 3} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 16 },
  title: { fontSize: 24, fontFamily: 'Inter_700Bold' },
  sub: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2 },
  podium: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', paddingHorizontal: 16, paddingBottom: 16, gap: 8 },
  podiumItem: { flex: 1, alignItems: 'center', gap: 4 },
  podiumFirst: { flex: 1.1 },
  crown: { marginBottom: 2 },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  podiumName: { fontSize: 12, fontFamily: 'Inter_700Bold', textAlign: 'center' },
  podiumEarnings: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  pedestal: { width: '100%', alignItems: 'center', justifyContent: 'center', borderRadius: 8, marginTop: 4 },
  pedestalRank: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  colHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, marginBottom: 1 },
  colText: { fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 0.8, textAlign: 'right' },
  listCard: { marginHorizontal: 0 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, gap: 8 },
  rowRank: { fontSize: 13, fontFamily: 'Inter_700Bold', width: 28 },
  rowAvatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  rowName: { flex: 1, fontSize: 14, fontFamily: 'Inter_500Medium' },
  rowStats: { flexDirection: 'row', gap: 12 },
  rowKills: { fontSize: 12, fontFamily: 'Inter_500Medium', textAlign: 'right', minWidth: 28 },
  rowWins: { fontSize: 12, fontFamily: 'Inter_500Medium', textAlign: 'right', minWidth: 24 },
  rowEarnings: { fontSize: 13, fontFamily: 'Inter_700Bold', textAlign: 'right', minWidth: 40 },
});
