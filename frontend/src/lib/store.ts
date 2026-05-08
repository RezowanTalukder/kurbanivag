import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  address: {
    street: string;
    thana: string;
    district: string;
    division: string;
    landmark?: string;
  };
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        const { token, user } = res.data;
        set({ token, user, isAuthenticated: true });
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      },

      register: async (data) => {
        const res = await api.post('/auth/register', data);
        const { token, user } = res.data;
        set({ token, user, isAuthenticated: true });
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        delete api.defaults.headers.common['Authorization'];
      },

      hydrate: () => {
        const { token } = get();
        if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      },
    }),
    { name: 'kurbanivag-auth' }
  )
);
