import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: any | null;
  isLoading: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true);
    } else {
      setIsLoading(false);
      setUser(session?.user || null);
    }
  }, [session, status]);

  // Check if user is admin
  const isAdmin = user?.role === "admin";

  // Check if user is editor (or admin, as admins have editor privileges)
  const isEditor = user?.role === "editor" || user?.role === "admin";

  // Login with email and password
  const login = async (email: string, password: string) => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        console.error("Login error:", result.error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    await signIn("google", { callbackUrl: "/admin/dashboard" });
  };

  // Logout
  const logout = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAdmin,
    isEditor,
    login,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook for using the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
