import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { UserAccount } from '../types';

interface AuthContextType {
  user: UserAccount | null;
  firebaseUser: User | null;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, displayName: string) => Promise<void>;
  signInGuest: (guestCallsign?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateCallsign: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [user, setUser] = useState<UserAccount | null>(() => {
    const cached = localStorage.getItem('zero_inertia_guest_user');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        // Read user profile from Firestore or create if missing
        try {
          const userDocRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data();
            setUser({
              uid: fbUser.uid,
              email: fbUser.email,
              displayName: data.displayName || fbUser.displayName || 'Tactical Operative',
              photoURL: fbUser.photoURL,
              isAnonymous: fbUser.isAnonymous,
            });
          } else {
            const initialProfile: UserAccount = {
              uid: fbUser.uid,
              email: fbUser.email,
              displayName: fbUser.displayName || (fbUser.isAnonymous ? 'Guest Operative' : 'Tactical Operative'),
              photoURL: fbUser.photoURL,
              isAnonymous: fbUser.isAnonymous,
            };
            await setDoc(userDocRef, {
              ...initialProfile,
              currentStreak: 0,
              longestStreak: 0,
              totalActiveDays: 0,
              momentumScore: 100,
              badges: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }, { merge: true });
            setUser(initialProfile);
          }
        } catch (err) {
          console.warn('Firestore user fetch failed, using auth profile:', err);
          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || 'Tactical Operative',
            photoURL: fbUser.photoURL,
            isAnonymous: fbUser.isAnonymous,
          });
        }
      } else {
        // Check for local guest user session
        const localGuest = localStorage.getItem('zero_inertia_guest_user');
        if (localGuest) {
          try {
            setUser(JSON.parse(localGuest));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      localStorage.removeItem('zero_inertia_guest_user');
      setUser({
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName || 'Tactical Operative',
        photoURL: cred.user.photoURL,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, pass: string, displayName: string) => {
    setIsLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(cred.user, { displayName });
      // Send verification email
      await sendEmailVerification(cred.user).catch(() => {});
      const userRef = doc(db, 'users', cred.user.uid);
      await setDoc(userRef, {
        uid: cred.user.uid,
        email,
        displayName,
        currentStreak: 0,
        longestStreak: 0,
        totalActiveDays: 0,
        momentumScore: 100,
        badges: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      localStorage.removeItem('zero_inertia_guest_user');
      setUser({
        uid: cred.user.uid,
        email: cred.user.email,
        displayName,
        photoURL: null,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const cred = await signInWithPopup(auth, provider);
      localStorage.removeItem('zero_inertia_guest_user');
      // Ensure Firestore profile exists
      const userRef = doc(db, 'users', cred.user.uid);
      await setDoc(userRef, {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName || 'Tactical Operative',
        photoURL: cred.user.photoURL,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      setUser({
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName || 'Tactical Operative',
        photoURL: cred.user.photoURL,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email, {
      url: 'https://zero-inertia.vercel.app',
    });
  };

  const signInGuest = async (guestCallsign: string = 'Ghost Operative') => {
    try {
      // Try anonymous firebase auth
      const cred = await signInAnonymously(auth);
      await updateProfile(cred.user, { displayName: guestCallsign });
      const guestAccount: UserAccount = {
        uid: cred.user.uid,
        email: null,
        displayName: guestCallsign,
        isAnonymous: true,
      };
      setUser(guestAccount);
    } catch {
      // Offline / client fallback guest account
      const guestId = `guest-${Date.now()}`;
      const guestAccount: UserAccount = {
        uid: guestId,
        email: null,
        displayName: guestCallsign,
        isAnonymous: true,
      };
      localStorage.setItem('zero_inertia_guest_user', JSON.stringify(guestAccount));
      setUser(guestAccount);
    }
  };

  const logout = async () => {
    localStorage.removeItem('zero_inertia_guest_user');
    await signOut(auth);
    setUser(null);
  };

  const updateCallsign = async (name: string) => {
    if (!name.trim()) return;
    if (firebaseUser) {
      await updateProfile(firebaseUser, { displayName: name });
      try {
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          displayName: name,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch (e) {
        console.warn('Could not sync callsign to Firestore:', e);
      }
    }
    if (user) {
      const updated = { ...user, displayName: name };
      setUser(updated);
      if (user.isAnonymous) {
        localStorage.setItem('zero_inertia_guest_user', JSON.stringify(updated));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        isLoading,
        signIn,
        signUp,
        signInGuest,
        signInWithGoogle,
        sendPasswordReset,
        logout,
        updateCallsign,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
