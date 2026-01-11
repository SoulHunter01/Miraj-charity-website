import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiJson, clearTokens, getAccessToken } from "../services/apiAuth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // {username,email,phone,cnic,avatar}
  const [loading, setLoading] = useState(true);

  const isAuthed = !!user;

  const fetchMe = async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const me = await apiJson("/api/auth/me/", { auth: true });
      setUser(me);
    } catch (e) {
      // token invalid/expired
      clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginWithTokens = async ({ access, refresh }) => {
    // store tokens
    localStorage.setItem("access_token", access);
    localStorage.setItem("refresh_token", refresh);
    setLoading(true);
    await fetchMe();
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthed,
      loading,
      refreshUser: fetchMe,
      loginWithTokens,
      logout,
    }),
    [user, isAuthed, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
