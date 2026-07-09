import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { TournamentCard } from '@/components/TournamentCard';
import { Tournament } from '@/store/mockData';

type Filter = 'All' | 'Live' | 'Upcoming' | 'Finished';
const FILTERS: Filter[] = ['All', 'Live', 'Upcoming', 'Finished'];

export default function TournamentsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { tournaments, joinedTournamentIds } = useApp();
  const [filter, setFilter] = useState<Filter>('All');

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 84 + 20 : insets.bottom + 80;

  const filtered = filter === 'All' ? tournaments : tournaments.filter(t => t.status === filter);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Tournaments</Text>
      </View>

      {/* Filter Tabs */}
      <View style={[styles.filterRow, { borderBottomColor: colors.border }]}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterTab, filter === f && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
          >
            <Text style={[styles.filterText, { color: filter === f ? colors.primary : colors.mutedForeground }]}>{f}</Text>
            {f !== 'All' && (
              <View style={[styles.filterBadge, {
                backgroundColor: f === 'Live' ? '#FF3B3033' : f === 'Upcoming' ? '#F59E0B33' : '#88888833',
              }]}>
                <Text style={[styles.filterCount, { color: f === 'Live' ? '#FF3B30' : f === 'Upcoming' ? '#F59E0B' : '#888888' }]}>
                  {tournaments.filter(t => t.status === f).length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={t => t.id}
        contentContainerStyle={[styles.list, { paddingBottom: bottomPad }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 16 }}>
            <TournamentCard
              tournament={item}
              fullWidth
              joined={joinedTournamentIds.includes(item.id)}
              onPress={() => router.push(`/tournament/${item.id}`)}
            />
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No tournaments found</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 12 },
  title: { fontSize: 24, fontFamily: 'Inter_700Bold' },
  filterRow: { flexDirection: 'row', borderBottomWidth: 1, paddingHorizontal: 16 },
  filterTab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 5, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  filterText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  filterBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  filterCount: { fontSize: 10, fontFamily: 'Inter_700Bold' },
  list: { paddingTop: 16 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 15, fontFamily: 'Inter_400Regular' },
});
