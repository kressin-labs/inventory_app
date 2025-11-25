import { createContext, useContext, useEffect, useState } from "react";
import { getCurrentUser, logout as apiLogout } from "../api/authApi";

type AuthUser = {
  username: string;
  role: "ADMIN" | "USER";
};

type AuthContextType = {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Load user on page load
  useEffect(() => {
    (async () => {
      const me = await getCurrentUser();
      if (me) {
        setUser({ username: me.username, role: me.role as "ADMIN" | "USER" });
      }
    })();
  }, []);

  async function logout() {
    await apiLogout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
