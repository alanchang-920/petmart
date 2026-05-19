import { createContext, useCallback, useContext, useEffect, useState } from "react";
import storage from "../utils/storage";
import {
  getCurrentUser,
  loginUser as loginRequest,
  registerUser as registerRequest,
} from "../services/userService";

const AuthContext = createContext(null);

/**
 * AuthProvider owns the authenticated-user state and exposes
 * login / register / logout actions. Surfacing this via context means
 * pages and the header can read `currentUser` without prop-drilling.
 */
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => storage.getUser());

  // On mount, if we have a stored token, verify it by hitting /users/me.
  // Stale or revoked tokens get cleared so we don't render an admin shell
  // for a user the server no longer recognises.
  useEffect(() => {
    const token = storage.getToken();
    if (!token) return;

    let cancelled = false;
    (async () => {
      try {
        const me = await getCurrentUser();
        if (!cancelled) setCurrentUser(me);
      } catch (err) {
        console.error("Token invalid", err);
        if (!cancelled) {
          storage.logout();
          setCurrentUser(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await loginRequest(email, password);
    storage.saveAuth(data);
    const me = await getCurrentUser();
    setCurrentUser(me);
    return me;
  }, []);

  const register = useCallback((username, email, password) => {
    return registerRequest(username, email, password);
  }, []);

  const logout = useCallback(() => {
    storage.logout();
    setCurrentUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
