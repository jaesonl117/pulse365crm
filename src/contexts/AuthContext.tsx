import { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, firebaseInit } from '../lib/firebase';
import { AuthContextType, UserProfile, RegisterData } from '../types/auth';
import { registerUser, signIn, signOut } from '../services/auth';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUserProfile = async (user: FirebaseUser) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserProfile(userDoc.data() as UserProfile);
      } else {
        console.warn('[AUTH] User profile not found for:', user.uid);
        setUserProfile(null);
      }
    } catch (error) {
      console.error('[AUTH] Error fetching user profile:', error);
      setError(error as Error);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Wait for Firebase to initialize before setting up auth
        await firebaseInit;
        console.log('[AUTH] Firebase initialized, setting up auth listener');
        
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
          console.log('[AUTH] Auth state changed:', user ? 'User logged in' : 'No user');
          setCurrentUser(user);
          if (user) {
            await fetchUserProfile(user);
          } else {
            setUserProfile(null);
          }
          setLoading(false);
        });

        return unsubscribe;
      } catch (error) {
        console.error('[AUTH] Error initializing auth:', error);
        setError(error as Error);
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signUp = async (data: RegisterData) => {
    await firebaseInit; // Ensure Firebase is initialized
    try {
      await registerUser(data);
      toast.success('Account created successfully!');
    } catch (error) {
      console.error('[AUTH] Registration error:', error);
      toast.error('Failed to create account');
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    await firebaseInit; // Ensure Firebase is initialized
    try {
      const user = await signIn(email, password);
      await fetchUserProfile(user);
      toast.success('Logged in successfully!');
    } catch (error) {
      console.error('[AUTH] Login error:', error);
      toast.error('Failed to log in');
      throw error;
    }
  };

  const logout = async () => {
    await firebaseInit; // Ensure Firebase is initialized
    try {
      await signOut();
      setUserProfile(null);
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('[AUTH] Logout error:', error);
      toast.error('Failed to log out');
      throw error;
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    signUp,
    login,
    logout,
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-600">Initializing application...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-50">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h2 className="mb-4 text-xl font-semibold text-red-600">Application Error</h2>
          <p className="mb-4 text-gray-600">
            There was a problem initializing the application. Please try refreshing the page.
          </p>
          <p className="text-sm text-gray-500">
            Error: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}