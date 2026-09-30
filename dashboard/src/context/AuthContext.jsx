import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { getCurrentUser, login as loginRequest } from "../services/auth";
import { clearSession, readSession, saveSession } from "../services/session";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [initialSession] = useState(readSession);
  const [session, setSession] = useState(initialSession);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => { clearSession(); setSession(null); }, []);
  const login = useCallback(async (email, password) => {
    const result = await loginRequest(email, password);
    const provisionalSession = { token: result.token, user: result.user };

    // apiFetch reads the token from storage. Persist it before /me so that
    // the first authenticated request includes Authorization.
    saveSession(provisionalSession);
    try {
      const profile = await getCurrentUser();
      const nextSession = { token: result.token, user: { ...result.user, ...profile } };
      saveSession(nextSession); setSession(nextSession);
      return nextSession.user;
    } catch (error) {
      clearSession();
      throw error;
    }
  }, []);

  useEffect(() => {
    const restore = async () => {
      if (!initialSession?.token) { setLoading(false); return; }
      try {
        const profile = await getCurrentUser();
        const nextSession = { ...initialSession, user: { ...initialSession.user, ...profile } };
        saveSession(nextSession); setSession(nextSession);
      } catch {
        logout();
      } finally { setLoading(false); }
    };
    restore();
  }, [initialSession, logout]);

  const value = useMemo(() => ({
    user: session?.user || null,
    token: session?.token || null,
    loading,
    login,
    logout,
    hasPermission: (permission) => Boolean(session?.user?.isPlatformAdmin || session?.user?.permissions?.includes(permission)),
  }), [session, loading, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
