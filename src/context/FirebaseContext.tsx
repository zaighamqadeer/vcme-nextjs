"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, OperationType, handleFirestoreError } from '../firebase';

interface UserProfile {
  uid: string;
  hearts: number;
  hp: number;
  level: number;
  xp?: number;
  isPro?: boolean;
  hasFinished?: boolean;
  currentChapterIndex: number;
  currentLessonIndex: number;
  completedLessons: string[];
  completedCourses?: string[];
  selectedCourseId?: string;
  displayName?: string;
  email?: string;
}

interface FirebaseContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const LOCAL_STORAGE_KEY = 'vibecode_progress';

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load local progress initially
  useEffect(() => {
    const localProgress = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localProgress && !user) {
      try {
        setProfile(JSON.parse(localProgress));
      } catch (e) {
        console.error("Failed to parse local progress", e);
      }
    }
  }, [user]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        // If logged out, keep local profile if exists, otherwise null
        const localProgress = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localProgress) {
          setProfile(JSON.parse(localProgress));
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribeProfile = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const cloudProfile = docSnap.data() as UserProfile;
        
        // Robust Sync: Merge local progress if it's further ahead or has more completed lessons
        const localProgressStr = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localProgressStr) {
          try {
            const localProfile = JSON.parse(localProgressStr) as UserProfile;
            const hasMoreProgress = 
              localProfile.currentChapterIndex > cloudProfile.currentChapterIndex ||
              (localProfile.currentChapterIndex === cloudProfile.currentChapterIndex && localProfile.currentLessonIndex > cloudProfile.currentLessonIndex) ||
              (localProfile.completedLessons?.length > (cloudProfile.completedLessons?.length || 0));

            if (hasMoreProgress) {
              console.log("Local progress is ahead, syncing to cloud...");
              const mergedProfile = {
                ...cloudProfile,
                ...localProfile,
                completedLessons: Array.from(new Set([...(cloudProfile.completedLessons || []), ...(localProfile.completedLessons || [])])),
                completedCourses: Array.from(new Set([...(cloudProfile.completedCourses || []), ...(localProfile.completedCourses || [])])),
                uid: user.uid, // Ensure UID is correct
                updatedAt: serverTimestamp()
              };
              setDoc(userDocRef, mergedProfile, { merge: true })
                .then(() => localStorage.removeItem(LOCAL_STORAGE_KEY))
                .catch(err => handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`));
              setProfile(mergedProfile);
            } else {
              setProfile(cloudProfile);
              localStorage.removeItem(LOCAL_STORAGE_KEY); // Cloud is ahead or equal, clear local
            }
          } catch (e) {
            setProfile(cloudProfile);
          }
        } else {
          setProfile(cloudProfile);
        }
      } else {
        // Initialize profile if it doesn't exist, using local progress if available
        const localProgressStr = localStorage.getItem(LOCAL_STORAGE_KEY);
        let initialProfile: UserProfile = {
          uid: user.uid,
          hearts: 5,
          hp: 100,
          level: 1,
          currentChapterIndex: 0,
          currentLessonIndex: 0,
          completedLessons: [],
          completedCourses: [],
          selectedCourseId: 'vibe-coding',
          displayName: user.displayName || '',
          email: user.email || '',
          isPro: false
        };

        if (localProgressStr) {
          try {
            const localProfile = JSON.parse(localProgressStr);
            initialProfile = { ...initialProfile, ...localProfile, uid: user.uid };
          } catch (e) {}
        }

        setDoc(userDocRef, { ...initialProfile, updatedAt: serverTimestamp() })
          .then(() => localStorage.removeItem(LOCAL_STORAGE_KEY))
          .catch(err => handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`));
        setProfile(initialProfile);
      }
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
      setLoading(false);
    });

    return () => unsubscribeProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const defaultProfile: UserProfile = {
      uid: user?.uid || 'guest',
      hearts: 5,
      hp: 100,
      level: 1,
      currentChapterIndex: 0,
      currentLessonIndex: 0,
      completedLessons: [],
      completedCourses: [],
      selectedCourseId: 'vibe-coding',
      xp: 0,
      isPro: false
    };

    const newProfile = profile ? { ...profile, ...updates } : { ...defaultProfile, ...updates };
    setProfile(newProfile);

    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      try {
        await setDoc(userDocRef, { ...updates, updatedAt: serverTimestamp() }, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
      }
    } else {
      // Save to local storage if not logged in
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newProfile));
    }
  };

  const signInWithGoogle = async () => {
    const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    const { createUserWithEmailAndPassword } = await import('firebase/auth');
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error("Error signing up with email", error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error("Error signing in with email", error);
      throw error;
    }
  };

  const logout = async () => {
    const { signOut } = await import('firebase/auth');
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <FirebaseContext.Provider value={{ user, profile, loading, updateProfile, signInWithGoogle, signUpWithEmail, signInWithEmail, logout }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};
