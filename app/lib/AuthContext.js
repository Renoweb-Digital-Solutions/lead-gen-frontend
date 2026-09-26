"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { apiLogin, apiSignup } from "./api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSuspended, setIsSuspended] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("renoweb_jwt");
    if (storedToken && storedToken !== "undefined") {
      setToken(storedToken);
      try {
        const payloadBase64 = storedToken.split('.')[1];
        const decoded = JSON.parse(atob(payloadBase64));
        setIsSuspended(!!decoded.is_suspended);
        setIsAdmin(!!decoded.is_admin);
      } catch (e) {}
    }
    setIsInitializing(false);
  }, []);

  const login = async (username, password) => {
    const data = await apiLogin(username, password);
    setToken(data.access_token);
    localStorage.setItem("renoweb_jwt", data.access_token);
    try {
      const payloadBase64 = data.access_token.split('.')[1];
      const decoded = JSON.parse(atob(payloadBase64));
      setIsSuspended(!!decoded.is_suspended);
      setIsAdmin(!!decoded.is_admin);
    } catch (e) {}
  };

  const signup = async (username, email, password) => {
    const data = await apiSignup(username, email, password);
    if (data && data.access_token) {
      setToken(data.access_token);
      localStorage.setItem("renoweb_jwt", data.access_token);
    } else {
      // If backend only creates user and doesn't return a token, log them in immediately
      await login(username, password); // We can login with username now
    }
  };

  const logout = () => {
    setToken(null);
    setIsSuspended(false);
    setIsAdmin(false);
    localStorage.removeItem("renoweb_jwt");
  };

  return (
    <AuthContext.Provider value={{ token, isInitializing, isSuspended, isAdmin, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
