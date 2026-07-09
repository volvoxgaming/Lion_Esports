import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    if (!email || !password) { setError('Please fill all fields'); return; }
    setLoading(true);
    setError('');
    try {
      await login(email.trim().toLowerCase(), password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/');
    } catch (e: any) {
      setError(e.message ?? 'Login failed');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  }

  const topPad = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: topPad + 24 }]} keyboardShouldPersistTaps="handled">

          {/* Logo */}
          <View style={styles.logoArea}>
            <LinearGradient colors={['#FF3B30', '#C00000']} style={styles.logoIcon}>
              <Ionicons name="flame" size={36} color="#FFFFFF" />
            </LinearGradient>
            <Text style={[styles.logoText, { color: colors.foreground }]}>BLAZEFIRE</Text>
            <Text style={[styles.logoSub, { color: colors.mutedForeground }]}>Tournament Platform</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={[styles.heading, { color: colors.foreground }]}>Sign In</Text>

            {error ? (
              <View style={[styles.errorBox, { backgroundColor: '#FF3B3022', borderColor: '#FF3B3066' }]}>
                <Ionicons name="alert-circle-outline" size={16} color="#FF3B30" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

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

            <View style={[styles.inputWrap, { backgroundColor: colors.input, borderColor: colors.border }]}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.mutedForeground} />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="Password"
                placeholderTextColor={colors.mutedForeground}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
              />
              <TouchableOpacity onPress={() => setShowPass(v => !v)}>
                <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.mutedForeground} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => router.push('/auth/forgot')} style={styles.forgotRow}>
              <Text style={[styles.linkText, { color: colors.primary }]}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
              <LinearGradient colors={['#FF3B30', '#C00000']} style={styles.loginBtn}>
                {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.loginBtnText}>SIGN IN</Text>}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.registerRow}>
              <Text style={[styles.mutedText, { color: colors.mutedForeground }]}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/register')}>
                <Text style={[styles.linkText, { color: colors.primary }]}>Register</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Demo hint */}
          <View style={[styles.demoBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.demoTitle, { color: colors.mutedForeground }]}>DEMO ACCOUNTS</Text>
            <Text style={[styles.demoLine, { color: colors.foreground }]}>Player: player@freefire.com / player123</Text>
            <Text style={[styles.demoLine, { color: colors.foreground }]}>Admin: admin@freefire.com / admin123</Text>
          </View>

          <View style={{ height: Platform.OS === 'web' ? 34 : insets.bottom + 16 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { paddingHorizontal: 24, flexGrow: 1 },
  logoArea: { alignItems: 'center', marginBottom: 40 },
  logoIcon: { width: 72, height: 72, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  logoText: { fontSize: 28, fontFamily: 'Inter_700Bold', letterSpacing: 4 },
  logoSub: { fontSize: 13, fontFamily: 'Inter_400Regular', letterSpacing: 2, marginTop: 4 },
  form: { gap: 14 },
  heading: { fontSize: 24, fontFamily: 'Inter_700Bold', marginBottom: 4 },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 10, borderWidth: 1 },
  errorText: { color: '#FF3B30', fontSize: 13, fontFamily: 'Inter_400Regular', flex: 1 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 14, borderRadius: 12, borderWidth: 1 },
  input: { flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular' },
  forgotRow: { alignSelf: 'flex-end' },
  loginBtn: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 4 },
  loginBtnText: { color: '#FFFFFF', fontSize: 15, fontFamily: 'Inter_700Bold', letterSpacing: 1 },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  mutedText: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  linkText: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  demoBox: { marginTop: 32, padding: 14, borderRadius: 12, borderWidth: 1, gap: 4 },
  demoTitle: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 1, marginBottom: 4 },
  demoLine: { fontSize: 12, fontFamily: 'Inter_400Regular' },
});
