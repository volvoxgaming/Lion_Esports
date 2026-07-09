export interface Tournament {
  id: string;
  title: string;
  mode: 'Solo' | 'Duo' | 'Squad' | 'Clash Squad' | 'BR Ranked' | 'CS Ranked';
  entryFee: number;
  prizePool: number;
  map: string;
  matchType: string;
  totalSlots: number;
  registeredPlayers: number;
  dateTime: string;
  status: 'Upcoming' | 'Live' | 'Finished';
  roomId?: string;
  roomPassword?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  kills: number;
  wins: number;
  earnings: number;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  date: string;
  isNew: boolean;
}

export interface AppNotification {
  id: string;
  type: 'tournament_reminder' | 'room_released' | 'result_published' | 'deposit_approved' | 'withdraw_approved' | 'announcement';
  title: string;
  message: string;
  date: string;
  read: boolean;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'entry_fee' | 'prize';
  amount: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

export interface MatchResult {
  userId: string;
  username: string;
  position: number;
  kills: number;
  points: number;
  prize: number;
}

export interface StoredUser {
  id: string;
  username: string;
  email: string;
  password: string;
  uid: string;
  matchesPlayed: number;
  wins: number;
  earnings: number;
  isAdmin: boolean;
}

export const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: 'T001',
    title: 'Solo Blitz Championship',
    mode: 'Solo',
    entryFee: 50,
    prizePool: 2000,
    map: 'Bermuda',
    matchType: 'Battle Royale',
    totalSlots: 48,
    registeredPlayers: 42,
    dateTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    status: 'Upcoming',
    roomId: 'R123456',
    roomPassword: 'FF2024',
  },
  {
    id: 'T002',
    title: 'Duo Mayhem Cup',
    mode: 'Duo',
    entryFee: 100,
    prizePool: 5000,
    map: 'Purgatory',
    matchType: 'Battle Royale',
    totalSlots: 25,
    registeredPlayers: 18,
    dateTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    status: 'Live',
    roomId: 'R789012',
    roomPassword: 'DUO2024',
  },
  {
    id: 'T003',
    title: 'Squad Showdown Finals',
    mode: 'Squad',
    entryFee: 200,
    prizePool: 10000,
    map: 'Alpine',
    matchType: 'Battle Royale',
    totalSlots: 12,
    registeredPlayers: 12,
    dateTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'Finished',
    roomId: 'R345678',
    roomPassword: 'SQD2024',
  },
  {
    id: 'T004',
    title: 'Clash Squad Pro League',
    mode: 'Clash Squad',
    entryFee: 150,
    prizePool: 7500,
    map: 'Bermuda',
    matchType: 'Clash Squad',
    totalSlots: 16,
    registeredPlayers: 10,
    dateTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    status: 'Upcoming',
  },
  {
    id: 'T005',
    title: 'BR Ranked Qualifier',
    mode: 'BR Ranked',
    entryFee: 0,
    prizePool: 3000,
    map: 'Purgatory',
    matchType: 'Ranked',
    totalSlots: 48,
    registeredPlayers: 38,
    dateTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    status: 'Upcoming',
  },
  {
    id: 'T006',
    title: 'CS Ranked Masters',
    mode: 'CS Ranked',
    entryFee: 75,
    prizePool: 4000,
    map: 'Bermuda',
    matchType: 'Clash Squad Ranked',
    totalSlots: 8,
    registeredPlayers: 6,
    dateTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    status: 'Live',
    roomId: 'R567890',
    roomPassword: 'CSR2024',
  },
  {
    id: 'T007',
    title: 'Solo Grand Prix',
    mode: 'Solo',
    entryFee: 100,
    prizePool: 8000,
    map: 'Alpine',
    matchType: 'Battle Royale',
    totalSlots: 48,
    registeredPlayers: 31,
    dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    status: 'Upcoming',
  },
  {
    id: 'T008',
    title: 'Squad Invitational',
    mode: 'Squad',
    entryFee: 500,
    prizePool: 25000,
    map: 'Bermuda',
    matchType: 'Battle Royale',
    totalSlots: 12,
    registeredPlayers: 8,
    dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'Upcoming',
  },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, userId: 'U1', username: 'ProKiller99', kills: 342, wins: 87, earnings: 45000 },
  { rank: 2, userId: 'U2', username: 'GhostSniper', kills: 298, wins: 74, earnings: 38000 },
  { rank: 3, userId: 'U3', username: 'FireStorm', kills: 276, wins: 68, earnings: 32000 },
  { rank: 4, userId: 'U4', username: 'NightHunter', kills: 254, wins: 61, earnings: 28000 },
  { rank: 5, userId: 'U5', username: 'ShadowWolf', kills: 231, wins: 55, earnings: 24000 },
  { rank: 6, userId: 'U6', username: 'BlazeMaster', kills: 215, wins: 49, earnings: 20000 },
  { rank: 7, userId: 'U7', username: 'IronFist', kills: 198, wins: 44, earnings: 17000 },
  { rank: 8, userId: 'U8', username: 'AceCommando', kills: 182, wins: 40, earnings: 14000 },
  { rank: 9, userId: 'U9', username: 'StormRider', kills: 167, wins: 36, earnings: 12000 },
  { rank: 10, userId: 'U10', username: 'PhoenixWing', kills: 154, wins: 33, earnings: 10000 },
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'A1',
    title: 'Season 5 Has Begun!',
    message: 'Season 5 is officially live! New tournaments, bigger prize pools, and exclusive rewards await. Join now and climb the ranks!',
    date: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    isNew: true,
  },
  {
    id: 'A2',
    title: 'Server Maintenance Notice',
    message: 'Scheduled maintenance on July 10, 2026 from 2:00 AM to 4:00 AM UTC. Tournaments in this window will be rescheduled.',
    date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    isNew: true,
  },
  {
    id: 'A3',
    title: 'New Map: Alpine Available',
    message: 'The Alpine map is now available for tournament play! Experience snow-covered terrain and new strategic positions.',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isNew: false,
  },
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'N1',
    type: 'tournament_reminder',
    title: 'Tournament Starting Soon',
    message: 'Solo Blitz Championship starts in 1 hour. Get ready!',
    date: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: 'N2',
    type: 'deposit_approved',
    title: 'Deposit Approved',
    message: 'Your deposit of ₹500 has been approved and added to your wallet.',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: 'N3',
    type: 'room_released',
    title: 'Room Details Available',
    message: 'Room ID and password for Duo Mayhem Cup are now available. Check Room Details.',
    date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: 'N4',
    type: 'result_published',
    title: 'Results Published',
    message: 'Match results for Squad Showdown Finals are now available. Check your placement!',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
];

export const MOCK_RESULTS: Record<string, MatchResult[]> = {
  T003: [
    { userId: 'U1', username: 'ProKiller99', position: 1, kills: 15, points: 35, prize: 5000 },
    { userId: 'U2', username: 'GhostSniper', position: 2, kills: 12, points: 29, prize: 3000 },
    { userId: 'demo', username: 'GameMaster', position: 3, kills: 8, points: 23, prize: 1500 },
    { userId: 'U3', username: 'FireStorm', position: 4, kills: 6, points: 17, prize: 500 },
  ],
};

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TR1', type: 'deposit', amount: 500, description: 'Wallet Deposit', status: 'approved', date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
  { id: 'TR2', type: 'entry_fee', amount: -50, description: 'Solo Blitz Championship Entry', status: 'approved', date: new Date(Date.now() - 60 * 60 * 1000).toISOString() },
  { id: 'TR3', type: 'prize', amount: 1500, description: 'Squad Showdown Finals - 3rd Place', status: 'approved', date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
  { id: 'TR4', type: 'withdraw', amount: -1000, description: 'Withdrawal Request', status: 'pending', date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() },
];

export const DEMO_USER: StoredUser = {
  id: 'demo',
  username: 'GameMaster',
  email: 'player@freefire.com',
  password: 'player123',
  uid: 'FF123456789',
  matchesPlayed: 47,
  wins: 12,
  earnings: 15500,
  isAdmin: false,
};

export const ADMIN_USER: StoredUser = {
  id: 'admin',
  username: 'Admin',
  email: 'admin@freefire.com',
  password: 'admin123',
  uid: 'FFADMIN001',
  matchesPlayed: 0,
  wins: 0,
  earnings: 0,
  isAdmin: true,
};

export function formatCurrency(amount: number): string {
  return `₹${Math.abs(amount).toLocaleString('en-IN')}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function getModeColor(mode: Tournament['mode']): string {
  const map: Record<Tournament['mode'], string> = {
    'Solo': '#FF3B30',
    'Duo': '#FF9500',
    'Squad': '#5856D6',
    'Clash Squad': '#AF52DE',
    'BR Ranked': '#34C759',
    'CS Ranked': '#007AFF',
  };
  return map[mode] ?? '#FF3B30';
}
