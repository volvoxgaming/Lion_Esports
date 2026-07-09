import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList,
  TextInput, Platform, KeyboardAvoidingView, ScrollView, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { Transaction, formatCurrency, timeAgo } from '@/store/mockData';
import * as Haptics from 'expo-haptics';

type TxFilter = 'All' | 'Deposits' | 'Withdrawals' | 'Entry Fees' | 'Prizes';
const TX_FILTERS: TxFilter[] = ['All', 'Deposits', 'Withdrawals', 'Entry Fees', 'Prizes'];
const SUCCESS = '#22C55E';
const WARNING = '#F59E0B';

function filterTx(txs: Transaction[], f: TxFilter): Transaction[] {
  if (f === 'All') return txs;
  if (f === 'Deposits') return txs.filter(t => t.type === 'deposit');
  if (f === 'Withdrawals') return txs.filter(t => t.type === 'withdraw');
  if (f === 'Entry Fees') return txs.filter(t => t.type === 'entry_fee');
  if (f === 'Prizes') return txs.filter(t => t.type === 'prize');
  return txs;
}

function txIcon(type: Transaction['type']) {
  if (type === 'deposit') return 'arrow-down-circle-outline';
  if (type === 'withdraw') return 'arrow-up-circle-outline';
  if (type === 'entry_fee') return 'trophy-outline';
  if (type === 'prize') return 'star-outline';
  return 'swap-horizontal-outline';
}

function txColor(type: Transaction['type'], status: Transaction['status']) {
  if (status === 'rejected') return '#888888';
  if (type === 'deposit' || type === 'prize') return SUCCESS;
  return '#FF3B30';
}

export default function WalletScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { walletBalance, transactions, depositRequest, withdrawRequest } = useApp();
  const [action, setAction] = useState<null | 'deposit' | 'withdraw'>(null);
  const [amount, setAmount] = useState('');
  const [txFilter, setTxFilter] = useState<TxFilter>('All');

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const bottomPad = Platform.OS === 'web' ? 84 + 20 : insets.bottom + 80;
  const filtered = filterTx(transactions, txFilter);

  function handleAction() {
    const val = parseFloat(amount);
    if (!val || val <= 0) { Alert.alert('Invalid Amount', 'Please enter a valid amount.'); return; }
    if (action === 'withdraw' && val > walletBalance) { Alert.alert('Insufficient Balance', 'You don\'t have enough balance.'); return; }
    if (action === 'deposit') {
      depositRequest(val);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Request Submitted', 'Your deposit request has been submitted and is pending approval.');
    } else {
      withdrawRequest(val);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Request Submitted', 'Your withdrawal request has been submitted and is pending approval.');
    }
    setAction(null);
    setAmount('');
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{ paddingBottom: bottomPad }} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={[styles.header, { paddingTop: topPad + 8 }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>Wallet</Text>
        </View>

        {/* Balance Card */}
        <View style={styles.balancePad}>
          <LinearGradient colors={['#1E1E1E', '#2A1010']} style={[styles.balanceCard, { borderColor: colors.border }]}>
            <View style={styles.balanceRow}>
              <View style={[styles.balanceIcon, { backgroundColor: '#FF3B3022' }]}>
                <Ionicons name="wallet-outline" size={22} color="#FF3B30" />
              </View>
              <Text style={[styles.balanceLabel, { color: colors.mutedForeground }]}>Available Balance</Text>
            </View>
            <Text style={[styles.balanceAmount, { color: colors.foreground }]}>{formatCurrency(walletBalance)}</Text>
            <Text style={[styles.balanceSub, { color: colors.mutedForeground }]}>All amounts in Indian Rupees</Text>
          </LinearGradient>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            onPress={() => { setAction(action === 'deposit' ? null : 'deposit'); setAmount(''); }}
            style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: action === 'deposit' ? SUCCESS : colors.border }]}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-down-circle-outline" size={24} color={SUCCESS} />
            <Text style={[styles.actionLabel, { color: colors.foreground }]}>Deposit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { setAction(action === 'withdraw' ? null : 'withdraw'); setAmount(''); }}
            style={[styles.actionBtn, { backgroundColor: colors.card, borderColor: action === 'withdraw' ? '#FF3B30' : colors.border }]}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-up-circle-outline" size={24} color="#FF3B30" />
            <Text style={[styles.actionLabel, { color: colors.foreground }]}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* Inline Form */}
        {action && (
          <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.formTitle, { color: colors.foreground }]}>
              {action === 'deposit' ? 'Deposit Amount' : 'Withdraw Amount'}
            </Text>
            <View style={[styles.amountInput, { backgroundColor: colors.input, borderColor: colors.border }]}>
              <Text style={[styles.rupee, { color: colors.mutedForeground }]}>₹</Text>
              <TextInput
                style={[styles.amountText, { color: colors.foreground }]}
                placeholder="0"
                placeholderTextColor={colors.mutedForeground}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                autoFocus
              />
            </View>
            {action === 'deposit' && (
              <Text style={[styles.formNote, { color: colors.mutedForeground }]}>
                Requests are reviewed within 24 hours.
              </Text>
            )}
            {action === 'withdraw' && (
              <Text style={[styles.formNote, { color: colors.mutedForeground }]}>
                Available: {formatCurrency(walletBalance)}
              </Text>
            )}
            <View style={styles.formActions}>
              <TouchableOpacity onPress={() => setAction(null)} style={[styles.cancelBtn, { borderColor: colors.border }]}>
                <Text style={[styles.cancelText, { color: colors.mutedForeground }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAction} activeOpacity={0.85} style={{ flex: 1 }}>
                <LinearGradient colors={['#FF3B30', '#C00000']} style={styles.submitBtn}>
                  <Text style={styles.submitText}>SUBMIT REQUEST</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Transaction History */}
        <View style={styles.txSection}>
          <Text style={[styles.txTitle, { color: colors.foreground }]}>Transaction History</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.txFilters}>
            {TX_FILTERS.map(f => (
              <TouchableOpacity
                key={f}
                onPress={() => setTxFilter(f)}
                style={[styles.txFilter, { backgroundColor: txFilter === f ? colors.primary : colors.card, borderColor: txFilter === f ? colors.primary : colors.border }]}
              >
                <Text style={[styles.txFilterText, { color: txFilter === f ? '#FFFFFF' : colors.mutedForeground }]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {filtered.length === 0 ? (
            <View style={styles.emptyTx}>
              <Ionicons name="receipt-outline" size={40} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No transactions</Text>
            </View>
          ) : (
            filtered.map(tx => (
              <View key={tx.id} style={[styles.txItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[styles.txIcon, { backgroundColor: txColor(tx.type, tx.status) + '22' }]}>
                  <Ionicons name={txIcon(tx.type) as any} size={20} color={txColor(tx.type, tx.status)} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.txDesc, { color: colors.foreground }]}>{tx.description}</Text>
                  <View style={styles.txMeta}>
                    <Text style={[styles.txTime, { color: colors.mutedForeground }]}>{timeAgo(tx.date)}</Text>
                    <View style={[styles.txStatus, { backgroundColor: tx.status === 'approved' ? SUCCESS + '22' : tx.status === 'rejected' ? '#FF3B3022' : WARNING + '22' }]}>
                      <Text style={[styles.txStatusText, { color: tx.status === 'approved' ? SUCCESS : tx.status === 'rejected' ? '#FF3B30' : WARNING }]}>
                        {tx.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={[styles.txAmount, { color: txColor(tx.type, tx.status) }]}>
                  {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                </Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 12 },
  title: { fontSize: 24, fontFamily: 'Inter_700Bold' },
  balancePad: { paddingHorizontal: 16, marginBottom: 16 },
  balanceCard: { borderRadius: 16, padding: 20, borderWidth: 1, gap: 6 },
  balanceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  balanceIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  balanceLabel: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  balanceAmount: { fontSize: 40, fontFamily: 'Inter_700Bold' },
  balanceSub: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  actionRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 12, marginBottom: 16 },
  actionBtn: { flex: 1, alignItems: 'center', gap: 6, paddingVertical: 16, borderRadius: 12, borderWidth: 1 },
  actionLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  formCard: { marginHorizontal: 16, marginBottom: 16, padding: 16, borderRadius: 14, borderWidth: 1, gap: 12 },
  formTitle: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  amountInput: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 14, borderRadius: 10, borderWidth: 1 },
  rupee: { fontSize: 20, fontFamily: 'Inter_700Bold' },
  amountText: { flex: 1, fontSize: 24, fontFamily: 'Inter_700Bold' },
  formNote: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  formActions: { flexDirection: 'row', gap: 10 },
  cancelBtn: { flex: 0.4, alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 1, paddingVertical: 12 },
  cancelText: { fontSize: 14, fontFamily: 'Inter_500Medium' },
  submitBtn: { padding: 12, borderRadius: 10, alignItems: 'center' },
  submitText: { color: '#FFFFFF', fontSize: 13, fontFamily: 'Inter_700Bold', letterSpacing: 0.5 },
  txSection: { paddingHorizontal: 16, gap: 10 },
  txTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', marginBottom: 2 },
  txFilters: { marginBottom: 4 },
  txFilter: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, marginRight: 8 },
  txFilterText: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  emptyTx: { alignItems: 'center', paddingVertical: 32, gap: 8 },
  emptyText: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  txItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 12, borderWidth: 1 },
  txIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  txDesc: { fontSize: 14, fontFamily: 'Inter_500Medium', marginBottom: 4 },
  txMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  txTime: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  txStatus: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  txStatusText: { fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 0.5 },
  txAmount: { fontSize: 15, fontFamily: 'Inter_700Bold' },
});
