import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Tournament } from '@/store/mockData';

const STATUS_CONFIG = {
  Live: { bg: '#FF3B3022', border: '#FF3B3066', text: '#FF3B30', dot: '#FF3B30', label: 'LIVE' },
  Upcoming: { bg: '#F59E0B22', border: '#F59E0B66', text: '#F59E0B', dot: '#F59E0B', label: 'UPCOMING' },
  Finished: { bg: '#88888822', border: '#88888844', text: '#888888', dot: '#888888', label: 'FINISHED' },
};

interface Props {
  status: Tournament['status'];
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: Props) {
  const config = STATUS_CONFIG[status];
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (status !== 'Live') return;
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.2, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [status]);

  return (
    <View style={[styles.badge, { backgroundColor: config.bg, borderColor: config.border }, size === 'md' && styles.badgeMd]}>
      <Animated.View style={[styles.dot, { backgroundColor: config.dot }, status === 'Live' && { opacity: pulse }]} />
      <Text style={[styles.text, { color: config.text }, size === 'md' && styles.textMd]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeMd: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  text: {
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.8,
  },
  textMd: {
    fontSize: 11,
  },
});
