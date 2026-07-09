import React from 'react';
import {
  View, Text, ScrollView, FlatList, TouchableOpacity,
  StyleSheet, Platform, Image, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { TournamentCard } from '@/components/TournamentCard';
import { MOCK_LEADERBOARD, timeAgo } from '@/store/mockData';

const { width: SCREEN_W } = Dimensions.get('window');
const GOLD = '#FFD700';
const SILVER = '#C0C0C0';
const BRONZE = '#CD7F32';

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { tournaments, joinedTournamentIds, announcements, unreadCount } = useApp();

  const liveTournaments = tournaments.filter(t => t.status === 'Live');
  const upcomingTournaments = tournaments.filter(t => t.status === 'Upcoming');
  const topPlayers = MOCK_LEADERBOARD.slice(0, 3);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 84 + 20 : insets.bottom + 80;

  const rankColors = [GOLD, SILVER, BRONZE];

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: bottomPad }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: topPad + 8 }]}>
          <View style={styles.headerLeft}>
            <LinearGradient colors={['#FF3B30', '#C00000']} style={styles.headerLogo}>
              <Ionicons name="flame" size={18} color="#FFFFFF" />
            </LinearGradient>
            <View>
              <Text style={[styles.appName, { color: colors.foreground }]}>BLAZEFIRE</Text>
              <Text style={[styles.greeting, { color: colors.mutedForeground }]}>
                Welcome, {user?.username ?? 'Player'}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => router.push('/notifications')} style={styles.bellBtn}>
            <Ionicons name="notifications-outline" size={24} color={colors.foreground} />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Hero Banner */}
        <View style={styles.hero}>
          <Image source={require('@/assets/images/hero_banner.jpg')} style={styles.heroImage} resizeMode="cover" />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)', '#0B0B0B']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroContent}>
            <Text style={styles.heroLabel}>SEASON 5</Text>
            <Text style={styles.heroTitle}>Battle for Glory</Text>
            <Text style={styles.heroSub}>₹2,50,000+ in prize pools this season</Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/tournaments')}
              activeOpacity={0.85}
            >
              <LinearGradient colors={['#FF3B30', '#C00000']} style={styles.heroCta}>
                <Text style={styles.heroCtaText}>JOIN TOURNAMENT</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Live Now */}
        {liveTournaments.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <Text style={styles.sectionTitle}>LIVE NOW</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/(tabs)/tournaments')}>
                <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={liveTournaments}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={t => t.id}
              contentContainerStyle={styles.hList}
              renderItem={({ item }) => (
                <TournamentCard
                  tournament={item}
                  compact
                  joined={joinedTournamentIds.includes(item.id)}
                  onPress={() => router.push(`/tournament/${item.id}`)}
                />
              )}
            />
          </View>
        )}

        {/* Upcoming */}
        {upcomingTournaments.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>UPCOMING</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/tournaments')}>
                <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={upcomingTournaments}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={t => t.id}
              contentContainerStyle={styles.hList}
              renderItem={({ item }) => (
                <TournamentCard
                  tournament={item}
                  compact
                  joined={joinedTournamentIds.includes(item.id)}
                  onPress={() => router.push(`/tournament/${item.id}`)}
                />
              )}
            />
          </View>
        )}

        {/* Top Players */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>TOP PLAYERS</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/leaderboard')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>Full board</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.leaderCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {topPlayers.map((player, i) => (
              <View key={player.userId} style={[styles.playerRow, i < topPlayers.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                <Text style={[styles.rank, { color: rankColors[i] }]}>#{player.rank}</Text>
                <Text style={[styles.playerName, { color: colors.foreground }]} numberOfLines={1}>{player.username}</Text>
                <View style={styles.playerStats}>
                  <Text style={[styles.statVal, { color: rankColors[i] }]}>₹{(player.earnings / 1000).toFixed(0)}K</Text>
                  <Text style={[styles.statSub, { color: colors.mutedForeground }]}>{player.wins}W · {player.kills}K</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Announcements */}
        {announcements.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>ANNOUNCEMENTS</Text>
            <View style={{ gap: 10 }}>
              {announcements.map(ann => (
                <View key={ann.id} style={[styles.annCard, { backgroundColor: colors.card, borderColor: ann.isNew ? colors.primary + '66' : colors.border }]}>
                  {ann.isNew && <View style={[styles.newDot, { backgroundColor: colors.primary }]} />}
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.annTitle, { color: colors.foreground }]}>{ann.title}</Text>
                    <Text style={[styles.annMsg, { color: colors.mutedForeground }]} numberOfLines={2}>{ann.message}</Text>
                    <Text style={[styles.annTime, { color: colors.mutedForeground }]}>{timeAgo(ann.date)}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 8 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerLogo: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  appName: { fontSize: 16, fontFamily: 'Inter_700Bold', letterSpacing: 2 },
  greeting: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  bellBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 4, right: 4, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: '#FF3B30', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  badgeText: { color: '#FFFFFF', fontSize: 9, fontFamily: 'Inter_700Bold' },
  hero: { height: 220, marginBottom: 8, position: 'relative', overflow: 'hidden' },
  heroImage: { width: '100%', height: '100%', position: 'absolute' },
  heroContent: { position: 'absolute', bottom: 20, left: 20, right: 20 },
  heroLabel: { color: '#FF3B30', fontSize: 11, fontFamily: 'Inter_700Bold', letterSpacing: 2, marginBottom: 4 },
  heroTitle: { color: '#FFFFFF', fontSize: 28, fontFamily: 'Inter_700Bold', lineHeight: 32 },
  heroSub: { color: 'rgba(255,255,255,0.75)', fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 4, marginBottom: 14 },
  heroCta: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10, alignSelf: 'flex-start' },
  heroCtaText: { color: '#FFFFFF', fontSize: 13, fontFamily: 'Inter_700Bold', letterSpacing: 0.5 },
  section: { paddingHorizontal: 16, marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 12, fontFamily: 'Inter_700Bold', letterSpacing: 1.5, color: '#FFFFFF' },
  seeAll: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  liveIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#FF3B30' },
  hList: { gap: 12, paddingRight: 16 },
  leaderCard: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  playerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 },
  rank: { fontSize: 14, fontFamily: 'Inter_700Bold', width: 28 },
  playerName: { flex: 1, fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  playerStats: { alignItems: 'flex-end' },
  statVal: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  statSub: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  annCard: { flexDirection: 'row', padding: 14, borderRadius: 12, borderWidth: 1, gap: 10 },
  newDot: { width: 7, height: 7, borderRadius: 4, marginTop: 5, flexShrink: 0 },
  annTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold', marginBottom: 3 },
  annMsg: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 18 },
  annTime: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 4 },
});
