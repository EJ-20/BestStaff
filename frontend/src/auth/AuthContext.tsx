import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

type User = { id: number; name: string; department: string } | null;

type AuthContextValue = {
  user: User;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // bootstrap from localStorage
  useEffect(() => {
    const t = localStorage.getItem("beststaff_token");
    const u = localStorage.getItem("beststaff_user");
    if (t && u) {
      setToken(t);
      setUser(JSON.parse(u));
    }
    setLoading(false);
  }, []);

  async function login(email: string, password: string) {
    setError(null);
    try {
      // fake auth; replace with real API later
      const res = await fakeLogin(email, password);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem("beststaff_token", res.token);
      localStorage.setItem("beststaff_user", JSON.stringify(res.user));
    } catch (e: any) {
      setError(e?.message ?? "Login failed");
      throw e;
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("beststaff_token");
    localStorage.removeItem("beststaff_user");
  }

  const value = useMemo(() => ({ user, token, login, logout, loading, error }), [user, token, loading, error]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// --- temporary fake login ---
async function fakeLogin(email: string, password: string) {
  await new Promise(r => setTimeout(r, 300)); // tiny delay
  // super basic mock: any non-empty email/password works;
  // add a single special case to demo errors
  if (email === "fail@demo.com") {
    throw new Error("Invalid credentials");
  }
  return {
    token: "mock-jwt-token",
    user: { id: 99, name: "Erfan", department: "Computers" },
  };
}
