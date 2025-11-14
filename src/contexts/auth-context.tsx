
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, User } from "firebase/auth";
import { app } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

// Define the shape of the user profile, which now includes all Auth claims and Firestore data
interface UserProfile {
  uid: string;
  email?: string;
  role: string;
  [key: string]: any;
}

// Define the shape of the context
interface AuthContextType {
  userProfile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);

  useEffect(() => {
    // This is the new, primary authentication check.
    const fetchUserOnLoad = async () => {
      try {
        // Call the new server endpoint to get the user's state.
        const response = await fetch('/api/auth/me');
        const profile = await response.json();

        if (profile && profile.uid) {
          setUserProfile(profile as UserProfile);
        } else {
          setUserProfile(null);
        }
      } catch (error) {
        console.error("Failed to fetch user on load:", error);
        setUserProfile(null);
      } finally {
        // No matter what, stop loading.
        setLoading(false);
      }
    };

    fetchUserOnLoad();

  }, []); // Run only once on initial component mount

  // Signs the user out
  const signOut = async () => {
    try {
      // 1. Call the backend API to clear the session cookie
      await fetch("/api/auth/session", { method: "GET" });

      // 2. Clear the local state
      setUserProfile(null);

    } catch (error) {
      console.error("Error signing out: ", error);
    } finally {
      // 3. Redirect to sign-in to ensure a clean state
      window.location.assign("/auth/signin");
    }
  };

  const value = { userProfile, loading, signOut };

  // Show a global loading spinner while we verify the user's session.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
