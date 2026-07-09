import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { Tournament, getModeColor, formatCurrency } from '@/store/mockData';
import { StatusBadge } from './StatusBadge';

interface Props {
  tournament: Tournament;
  onPress: () => void;
  compact?: boolean;
  fullWidth?: boolean;
  joined?: boolean;
}

export function TournamentCard({ tournament, onPress, compact, fullWidth, joined }: Props) {
  const colors = useColors();
  const modeColor = getModeColor(tournament.mode);
  const slotsLeft = tournament.totalSlots - tournament.registeredPlayers;
  const slotsPercent = tournament.registeredPlayers / tournament.totalSlots;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, fullWidth ? styles.full : styles.compact]}
    >
      <LinearGradient
        colors={[modeColor + 'CC', modeColor + '33', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.banner}
      >
        <View style={styles.bannerRow}>
          <View style={[styles.modeBadge, { backgroundColor: modeColor + '33', borderColor: modeColor + '66' }]}>
            <Text style={[styles.modeText, { color: modeColor }]}>{tournament.mode}</Text>
          </View>
          <StatusBadge status={tournament.status} />
        </View>
        <Text style={styles.title} numberOfLines={2}>{tournament.title}</Text>
        <View style={styles.mapRow}>
          <Ionicons name="map-outline" size={12} color="rgba(255,255,255,0.7)" />
          <Text style={styles.mapText}>{tournament.map}</Text>
        </View>
      </LinearGradient>

      <View style={styles.body}>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>PRIZE</Text>
            <Text style={[styles.statValue, { color: colors.gold }]}>{formatCurrency(tournament.prizePool)}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.stat}>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>ENTRY</Text>
            <Text style={[styles.statValue, { color: colors.foreground }]}>
              {tournament.entryFee === 0 ? 'FREE' : formatCurrency(tournament.entryFee)}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.stat}>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>SLOTS</Text>
            <Text style={[styles.statValue, { color: slotsLeft === 0 ? colors.destructive : colors.foreground }]}>
              {slotsLeft === 0 ? 'FULL' : `${slotsLeft} left`}
            </Text>
          </View>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${slotsPercent * 100}%` as any, backgroundColor: modeColor }]} />
        </View>

        {joined && (
          <View style={[styles.joinedBadge, { backgroundColor: colors.success + '22', borderColor: colors.success + '44' }]}>
            <Ionicons name="checkmark-circle" size={14} color={colors.success} />
            <Text style={[styles.joinedText, { color: colors.success }]}>Registered</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const colors_static = {
  gold: '#FFD700',
  success: '#22C55E',
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    width: 220,
  },
  compact: {
    width: 220,
  },
  full: {
    width: '100%' as any,
  },
  banner: {
    padding: 14,
    minHeight: 110,
    justifyContent: 'space-between',
  },
  bannerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  modeText: {
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    marginTop: 8,
  },
  mapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  mapText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  body: {
    padding: 12,
    gap: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 9,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 28,
  },
  progressBar: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  joinedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  joinedText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
  },
});
