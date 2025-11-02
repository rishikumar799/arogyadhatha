'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getRedirectResult, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase'; // CORRECTED: Import auth directly
import { Loader2 } from 'lucide-react';

// Define the UserProfile structure
interface UserProfile {
  role: string;
}

// Define the AuthContext structure
interface AuthContextType {
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType>({
  userProfile: null,
  loading: true,
  error: null,
  signOut: async () => {},
});

// The main authentication provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // NOTE: We no longer need getAuth(app) because auth is imported directly.

    // First, handle the result of a sign-in redirect.
    getRedirectResult(auth)
      .then(async (result) => {
        if (result) {
          // A user has just signed in. Create their session.
          const idToken = await result.user.getIdToken();
          const response = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
          });

          if (response.ok) {
            // Session created successfully. Force a hard reload to ensure
            // the new session state is picked up cleanly.
            window.location.assign('/');
          } else {
            // Failed to create session, report the error.
            const errorData = await response.json();
            throw new Error(errorData.error || 'Session creation failed.');
          }
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });

    // This listener handles ongoing session verification and logouts.
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
            // A Firebase user exists. Verify our backend session cookie.
            try {
                const response = await fetch('/api/auth/verify-session');
                if (response.ok) {
                    const profile = await response.json();
                    setUserProfile(profile);
                } else {
                    // Session is invalid or expired. Clear local state.
                    setUserProfile(null);
                }
            } catch (e: any) {
                setError("Failed to connect to the server for session verification.");
                setUserProfile(null);
            }
        } else {
            // No Firebase user. Ensure local state is cleared.
            setUserProfile(null);
        }
        setLoading(false);
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  // This effect handles redirection based on the auth state.
  useEffect(() => {
    if (!loading && !userProfile && !pathname.startsWith('/auth')) {
      router.push('/auth/signin');
    }
  }, [userProfile, loading, pathname, router]);

  // Define the sign-out logic
  const signOut = async () => {
    setLoading(true);
    try {
      await auth.signOut(); // Sign out from Firebase
      await fetch('/api/auth/signout', { method: 'POST' }); // Sign out from backend
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUserProfile(null);
      window.location.href = '/auth/signin'; // Force redirect to sign-in
    }
  };

  return (
    <AuthContext.Provider value={{ userProfile, loading, error, signOut }}>
      {loading ? (
        <div className="flex h-screen w-full items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div style={{ padding: '20px', color: 'red', backgroundColor: '#fdd' }}>
            <h1>Authentication Error</h1>
            <p>{error}</p>
            <button onClick={signOut}>Try Signing Out</button>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

// Export the useAuth hook for easy consumption
export const useAuth = () => useContext(AuthContext);
