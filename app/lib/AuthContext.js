"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { apiLogin, apiSignup } from "./api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("renoweb_jwt");
    if (storedToken && storedToken !== "undefined") {
      setToken(storedToken);
    }
    setIsInitializing(false);
  }, []);

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    setToken(data.access_token);
    localStorage.setItem("renoweb_jwt", data.access_token);
  };

  const signup = async (email, password) => {
    const data = await apiSignup(email, password);
    if (data && data.access_token) {
      setToken(data.access_token);
      localStorage.setItem("renoweb_jwt", data.access_token);
    } else {
      // If backend only creates user and doesn't return a token, log them in immediately
      await login(email, password);
    }
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("renoweb_jwt");
  };

  return (
    <AuthContext.Provider value={{ token, isInitializing, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
