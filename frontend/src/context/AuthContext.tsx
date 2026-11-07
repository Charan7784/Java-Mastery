import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Account,
  hasUsers as getHasUsers,
  loginUser,
  logoutUser,
  registerUser,
  restoreUser,
} from "../lib/api";

interface AuthContextValue {
  user: Account | null;
  loading: boolean;
  hasUsers: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Account | null>(null);
  const [hasUsers, setHasUsers] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([restoreUser(), getHasUsers()]).then(([account, exists]) => {
      if (active) { setUser(account); setHasUsers(exists); }
    }).catch(() => { if (active) setHasUsers(false); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function login(email: string, password: string) {
    const account = await loginUser(email, password);
    setUser(account);
    setHasUsers(true);
  }

  async function register(fullName: string, email: string, password: string) {
    await registerUser(fullName, email, password);
    setHasUsers(await getHasUsers());
  }

  function logout() {
    void logoutUser();
    setUser(null);
  }

  const value = useMemo(() => ({ user, loading, hasUsers, login, register, logout }), [user, loading, hasUsers]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
