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
      try {
        const payloadBase64 = storedToken.split('.')[1];
        const decoded = JSON.parse(atob(payloadBase64));
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("renoweb_jwt");
          setToken(null);
        } else {
          setToken(storedToken);
          setIsSuspended(!!decoded.is_suspended);
          setIsAdmin(!!decoded.is_admin);
        }
      } catch (e) {
        localStorage.removeItem("renoweb_jwt");
        setToken(null);
      }
    }
    setIsInitializing(false);
  }, []);

  const setAuthFromToken = (data) => {
    setToken(data.access_token);
    localStorage.setItem("renoweb_jwt", data.access_token);
    try {
      const payloadBase64 = data.access_token.split('.')[1];
      const decoded = JSON.parse(atob(payloadBase64));
      setIsSuspended(!!decoded.is_suspended);
      setIsAdmin(!!decoded.is_admin);
    } catch (e) {}
  };

  const login = async (username, password) => {
    const data = await apiLogin(username, password);
    setAuthFromToken(data);
  };

  const requestLoginOtp = async (username, password) => {
    // This is just a pass-through to apiRequestLoginOtp in api.js
    // Wait, I need to import it at the top of the file!
    const { apiRequestLoginOtp } = await import('./api');
    return await apiRequestLoginOtp(username, password);
  };

  const verifyLoginOtp = async (username, password, otp) => {
    const { apiVerifyLoginOtp } = await import('./api');
    const data = await apiVerifyLoginOtp(username, password, otp);
    setAuthFromToken(data);
  };

  const signup = async (username, email, password) => {
    const data = await apiSignup(username, email, password);
    if (data && data.access_token) {
      setAuthFromToken(data);
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
    <AuthContext.Provider value={{ token, isInitializing, isSuspended, isAdmin, login, requestLoginOtp, verifyLoginOtp, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
