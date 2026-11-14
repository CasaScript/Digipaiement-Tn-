import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, onIdTokenChanged, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<string | null>;
  signOut: () => Promise<void>;
  getFreshToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (nextUser) {
        try {
          const idToken = await nextUser.getIdToken();
          setToken(idToken);
        } catch {
          setToken(null);
        }
      } else {
        setToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const idToken = await result.user.getIdToken();
      setUser(result.user);
      setToken(idToken);
      return idToken;
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      if (err?.code === 'auth/popup-closed-by-user') {
        setAuthError('Connexion annulée.');
      } else {
        setAuthError('Impossible de finaliser la connexion Google. Veuillez réessayer.');
      }
      return null;
    }
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setToken(null);
  }, []);

  const getFreshToken = useCallback(async () => {
    if (!auth.currentUser) return null;
    const idToken = await auth.currentUser.getIdToken();
    setToken(idToken);
    return idToken;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        authError,
        signInWithGoogle,
        signOut,
        getFreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
