import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, ScrollView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { LinearGradient } from 'expo-linear-gradient';

export default function ForgotScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  function handleSubmit() {
    if (!email) return;
    setSent(true);
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: topPad + 24 }]} keyboardShouldPersistTaps="handled">

          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={colors.foreground} />
          </TouchableOpacity>

          <View style={styles.iconWrap}>
            <LinearGradient colors={['#FF3B30', '#C00000']} style={styles.iconCircle}>
              <Ionicons name="key-outline" size={32} color="#FFFFFF" />
            </LinearGradient>
          </View>

          <Text style={[styles.heading, { color: colors.foreground }]}>Reset Password</Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>
            Enter your email address and we'll send you a reset link.
          </Text>

          {sent ? (
            <View style={[styles.successBox, { backgroundColor: '#22C55E22', borderColor: '#22C55E44' }]}>
              <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
              <Text style={styles.successText}>Reset link sent! Check your email.</Text>
            </View>
          ) : (
            <>
              <View style={[styles.inputWrap, { backgroundColor: colors.input, borderColor: colors.border }]}>
                <Ionicons name="mail-outline" size={18} color={colors.mutedForeground} />
                <TextInput
                  style={[styles.input, { color: colors.foreground }]}
                  placeholder="Email address"
                  placeholderTextColor={colors.mutedForeground}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <TouchableOpacity onPress={handleSubmit} activeOpacity={0.85} style={{ marginTop: 8 }}>
                <LinearGradient colors={['#FF3B30', '#C00000']} style={styles.btn}>
                  <Text style={styles.btnText}>SEND RESET LINK</Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
            <Text style={[styles.linkText, { color: colors.primary }]}>Back to Sign In</Text>
          </TouchableOpacity>

          <View style={{ height: Platform.OS === 'web' ? 34 : insets.bottom + 16 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 24, flexGrow: 1 },
  backBtn: { marginBottom: 32, alignSelf: 'flex-start' },
  iconWrap: { alignItems: 'center', marginBottom: 24 },
  iconCircle: { width: 72, height: 72, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  heading: { fontSize: 26, fontFamily: 'Inter_700Bold', marginBottom: 8 },
  sub: { fontSize: 14, fontFamily: 'Inter_400Regular', lineHeight: 20, marginBottom: 24 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 14, borderRadius: 12, borderWidth: 1 },
  input: { flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular' },
  btn: { padding: 16, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#FFFFFF', fontSize: 15, fontFamily: 'Inter_700Bold', letterSpacing: 1 },
  successBox: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 16, borderRadius: 12, borderWidth: 1 },
  successText: { color: '#22C55E', fontSize: 14, fontFamily: 'Inter_500Medium', flex: 1 },
  backLink: { alignItems: 'center', marginTop: 24 },
  linkText: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
});
