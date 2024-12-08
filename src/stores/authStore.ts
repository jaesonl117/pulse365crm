import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, RegisterTenantData } from '../types/auth';
import { api } from '../lib/axios';
import { toast } from 'react-hot-toast';

interface AuthState {
  user: User | null;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  initialize: () => Promise<void>;
  register: (data: RegisterTenantData) => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      isInitialized: false,
      isLoading: true,
      error: null,

      initialize: async () => {
        try {
          set({ isLoading: true });
          const token = localStorage.getItem('auth_token');
          
          if (!token) {
            set({ isInitialized: true, isLoading: false });
            return;
          }

          const response = await api.post('/auth/validate-token', { token });
          set({ 
            user: response.data.user,
            isInitialized: true,
            isLoading: false 
          });
        } catch (error) {
          localStorage.removeItem('auth_token');
          set({ 
            user: null,
            error: 'Session expired',
            isInitialized: true,
            isLoading: false 
          });
        }
      },

   register: async (data) => {
        try {
          set({ isLoading: true, error: null });
          
          console.log('Sending registration request:', data);
          
          const response = await api.post('/register-tenant', data);
          console.log('Registration response:', response.data);
          
          const { user, token } = response.data;
          
          localStorage.setItem('auth_token', token);
          set({ 
            user,
            isLoading: false,
            isInitialized: true 
          });
          
          toast.success('Registration successful!');
        } catch (error: any) {
          console.error('Registration error:', error);
          const message = error.response?.data?.message || 'Registration failed';
          set({ 
            error: message,
            isLoading: false,
            isInitialized: true 
          });
          toast.error(message);
          throw error;
        }
      },

      setUser: (user) => set({ user }),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setInitialized: (initialized) => set({ isInitialized: initialized })
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ 
        user: state.user,
        isInitialized: state.isInitialized 
      }),
    }
  )
);