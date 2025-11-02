'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// Define the structure of the user profile derived from the session
interface UserProfile {
  role: string;
}

// Define the context type
interface AuthContextType {
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null; // Add state for holding the error message
  signOut: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  userProfile: null,
  loading: true,
  error: null,
  signOut: async () => {},
});

// Create the AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // State to hold the error
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const verifySession = async () => {
      setError(null); // Clear previous errors on navigation
      
      if (pathname.startsWith('/auth')) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/verify-session');
        const data = await res.json();

        if (!res.ok) {
          // If the response is not OK, throw an error with the detailed message from the server
          throw new Error(data.error + (data.detail ? ` (Details: ${data.detail})` : ''));
        }

        setUserProfile(data as UserProfile);

      } catch (err: any) {
        console.error("Session verification failed:", err.message);
        setError(err.message); // Set the error state so it can be displayed
        setUserProfile(null);

        // Only redirect for classic "not logged in" errors. 
        // For server configuration errors (like 500 or 404), we want to show the error message instead of looping.
        if (err.message.includes('Session cookie not found') || err.message.includes('Invalid or expired session cookie')) {
            router.push('/auth/signin');
        }

      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [pathname, router]);

  const signOut = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' });
    } catch (e) {
      console.error("Signout API call failed", e);
    } finally {
      window.location.href = '/auth/signin';
    }
  };

  const value = { userProfile, loading, error, signOut };

  // Now, the main view logic can decide what to show based on the state
  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div>Loading...</div> // Or a proper loading spinner
      ) : error ? (
        // If there's an error, display it prominently
        <div style={{ padding: '20px', color: 'red', backgroundColor: '#fdd' }}>
          <h1>Authentication Error</h1>
          <p>Could not verify your session. Please contact support.</p>
          <pre><strong>Error:</strong> {error}</pre>
        </div>
      ) : (
        // Only render children if loading is complete and there is no error
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
