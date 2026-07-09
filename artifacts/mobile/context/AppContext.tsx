import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Tournament, AppNotification, Announcement, Transaction,
  MOCK_TOURNAMENTS, MOCK_NOTIFICATIONS, MOCK_ANNOUNCEMENTS, MOCK_TRANSACTIONS,
} from '@/store/mockData';

const TOURNAMENTS_KEY = '@ff_tournaments_v2';
const JOINED_KEY = '@ff_joined_v2';
const WALLET_KEY = '@ff_wallet_v2';
const TRANSACTIONS_KEY = '@ff_transactions_v2';
const NOTIFICATIONS_KEY = '@ff_notifications_v2';

interface AppContextType {
  tournaments: Tournament[];
  joinedTournamentIds: string[];
  walletBalance: number;
  transactions: Transaction[];
  notifications: AppNotification[];
  announcements: Announcement[];
  unreadCount: number;
  joinTournament: (tournamentId: string) => Promise<string>;
  depositRequest: (amount: number) => void;
  withdrawRequest: (amount: number) => void;
  markNotificationsRead: () => void;
  createTournament: (t: Omit<Tournament, 'id'>) => void;
  updateTournament: (id: string, updates: Partial<Tournament>) => void;
  deleteTournament: (id: string) => void;
  releaseRoom: (tournamentId: string, roomId: string, password: string) => void;
  getPendingRequests: () => Transaction[];
  approveRequest: (transactionId: string) => void;
  rejectRequest: (transactionId: string) => void;
}

const AppContext = createContext<AppContextType>({} as AppContextType);

export function AppProvider({ children }: { children: ReactNode }) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [joinedTournamentIds, setJoinedTournamentIds] = useState<string[]>([]);
  const [walletBalance, setWalletBalance] = useState(500);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [announcements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS);

  useEffect(() => {
    (async () => {
      try {
        const [ts, joined, wallet, txs, notifs] = await Promise.all([
          AsyncStorage.getItem(TOURNAMENTS_KEY),
          AsyncStorage.getItem(JOINED_KEY),
          AsyncStorage.getItem(WALLET_KEY),
          AsyncStorage.getItem(TRANSACTIONS_KEY),
          AsyncStorage.getItem(NOTIFICATIONS_KEY),
        ]);
        setTournaments(ts ? JSON.parse(ts) : MOCK_TOURNAMENTS);
        setJoinedTournamentIds(joined ? JSON.parse(joined) : []);
        setWalletBalance(wallet ? JSON.parse(wallet) : 500);
        setTransactions(txs ? JSON.parse(txs) : MOCK_TRANSACTIONS);
        setNotifications(notifs ? JSON.parse(notifs) : MOCK_NOTIFICATIONS);
      } catch {}
    })();
  }, []);

  function save<T>(key: string, value: T) {
    AsyncStorage.setItem(key, JSON.stringify(value)).catch(() => {});
  }

  async function joinTournament(tournamentId: string): Promise<string> {
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) throw new Error('Tournament not found');
    if (joinedTournamentIds.includes(tournamentId)) return 'already_joined';
    if (tournament.registeredPlayers >= tournament.totalSlots) return 'full';
    if (walletBalance < tournament.entryFee) return 'insufficient_balance';

    const newBalance = walletBalance - tournament.entryFee;
    const newJoined = [...joinedTournamentIds, tournamentId];
    const tx: Transaction = {
      id: Date.now().toString(),
      type: 'entry_fee',
      amount: -tournament.entryFee,
      description: `${tournament.title} Entry`,
      status: 'approved',
      date: new Date().toISOString(),
    };
    const updatedTournaments = tournaments.map(t =>
      t.id === tournamentId ? { ...t, registeredPlayers: t.registeredPlayers + 1 } : t,
    );
    const newTransactions = [tx, ...transactions];
    const newNotification: AppNotification = {
      id: Date.now().toString() + 'n',
      type: 'tournament_reminder',
      title: 'Registration Successful',
      message: `You've joined ${tournament.title}. Good luck!`,
      date: new Date().toISOString(),
      read: false,
    };
    const newNotifications = [newNotification, ...notifications];

    setWalletBalance(newBalance);
    setJoinedTournamentIds(newJoined);
    setTournaments(updatedTournaments);
    setTransactions(newTransactions);
    setNotifications(newNotifications);
    save(WALLET_KEY, newBalance);
    save(JOINED_KEY, newJoined);
    save(TOURNAMENTS_KEY, updatedTournaments);
    save(TRANSACTIONS_KEY, newTransactions);
    save(NOTIFICATIONS_KEY, newNotifications);
    return 'success';
  }

  function depositRequest(amount: number) {
    const tx: Transaction = {
      id: Date.now().toString(),
      type: 'deposit',
      amount,
      description: 'Wallet Deposit Request',
      status: 'pending',
      date: new Date().toISOString(),
    };
    const newTransactions = [tx, ...transactions];
    setTransactions(newTransactions);
    save(TRANSACTIONS_KEY, newTransactions);
  }

  function withdrawRequest(amount: number) {
    if (walletBalance < amount) return;
    const tx: Transaction = {
      id: Date.now().toString(),
      type: 'withdraw',
      amount: -amount,
      description: 'Withdrawal Request',
      status: 'pending',
      date: new Date().toISOString(),
    };
    const newBalance = walletBalance - amount;
    const newTransactions = [tx, ...transactions];
    setWalletBalance(newBalance);
    setTransactions(newTransactions);
    save(WALLET_KEY, newBalance);
    save(TRANSACTIONS_KEY, newTransactions);
  }

  function markNotificationsRead() {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    save(NOTIFICATIONS_KEY, updated);
  }

  function createTournament(t: Omit<Tournament, 'id'>) {
    const newT: Tournament = { ...t, id: 'T' + Date.now().toString() };
    const updated = [newT, ...tournaments];
    setTournaments(updated);
    save(TOURNAMENTS_KEY, updated);
  }

  function updateTournament(id: string, updates: Partial<Tournament>) {
    const updated = tournaments.map(t => (t.id === id ? { ...t, ...updates } : t));
    setTournaments(updated);
    save(TOURNAMENTS_KEY, updated);
  }

  function deleteTournament(id: string) {
    const updated = tournaments.filter(t => t.id !== id);
    setTournaments(updated);
    save(TOURNAMENTS_KEY, updated);
  }

  function releaseRoom(tournamentId: string, roomId: string, password: string) {
    updateTournament(tournamentId, { roomId, roomPassword: password });
    const notif: AppNotification = {
      id: Date.now().toString(),
      type: 'room_released',
      title: 'Room Details Released',
      message: 'Room ID and password are now available for your upcoming match.',
      date: new Date().toISOString(),
      read: false,
    };
    const newNotifications = [notif, ...notifications];
    setNotifications(newNotifications);
    save(NOTIFICATIONS_KEY, newNotifications);
  }

  function getPendingRequests(): Transaction[] {
    return transactions.filter(t => t.status === 'pending');
  }

  function approveRequest(transactionId: string) {
    const tx = transactions.find(t => t.id === transactionId);
    if (!tx) return;
    let newBalance = walletBalance;
    if (tx.type === 'deposit') newBalance += tx.amount;
    const updated = transactions.map(t =>
      t.id === transactionId ? { ...t, status: 'approved' as const } : t,
    );
    setTransactions(updated);
    setWalletBalance(newBalance);
    save(TRANSACTIONS_KEY, updated);
    save(WALLET_KEY, newBalance);
  }

  function rejectRequest(transactionId: string) {
    const tx = transactions.find(t => t.id === transactionId);
    if (!tx) return;
    let newBalance = walletBalance;
    if (tx.type === 'withdraw') newBalance += Math.abs(tx.amount);
    const updated = transactions.map(t =>
      t.id === transactionId ? { ...t, status: 'rejected' as const } : t,
    );
    setTransactions(updated);
    setWalletBalance(newBalance);
    save(TRANSACTIONS_KEY, updated);
    save(WALLET_KEY, newBalance);
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      tournaments, joinedTournamentIds, walletBalance, transactions,
      notifications, announcements, unreadCount,
      joinTournament, depositRequest, withdrawRequest, markNotificationsRead,
      createTournament, updateTournament, deleteTournament, releaseRoom,
      getPendingRequests, approveRequest, rejectRequest,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
