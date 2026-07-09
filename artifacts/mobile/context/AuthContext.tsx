import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StoredUser, DEMO_USER, ADMIN_USER } from '@/store/mockData';

const USERS_KEY = '@ff_users';
const CURRENT_USER_KEY = '@ff_current_user';

export type User = Omit<StoredUser, 'password'>;

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(CURRENT_USER_KEY);
        if (stored) setUser(JSON.parse(stored));
      } catch {}
      setIsLoading(false);
    })();
  }, []);

  async function getUsers(): Promise<StoredUser[]> {
    const stored = await AsyncStorage.getItem(USERS_KEY);
    if (stored) return JSON.parse(stored);
    const defaults = [DEMO_USER, ADMIN_USER];
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(defaults));
    return defaults;
  }

  async function login(email: string, password: string) {
    const users = await getUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid email or password');
    const { password: _p, ...safeUser } = found;
    setUser(safeUser);
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
  }

  async function register(username: string, email: string, password: string) {
    const users = await getUsers();
    if (users.some(u => u.email === email)) throw new Error('Email already registered');
    const newUser: StoredUser = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      username,
      email,
      password,
      uid: 'FF' + Date.now().toString().slice(-9),
      matchesPlayed: 0,
      wins: 0,
      earnings: 0,
      isAdmin: false,
    };
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    const { password: _p, ...safeUser } = newUser;
    setUser(safeUser);
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
  }

  function logout() {
    setUser(null);
    AsyncStorage.removeItem(CURRENT_USER_KEY);
  }

  function updateUser(updates: Partial<User>) {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updated));
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
