"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";
import { apiSignup, apiRequestLoginOtp, apiVerifyLoginOtp, fetchAccountIdentity } from "./api";

const AuthContext = createContext();
const SESSION_EVENT = "simpleads:session-changed";

function decode(token) {
  // # Decode only for UI display; protected backend endpoints verify the signature.
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(base64), (value) => value.charCodeAt(0))));
  } catch { return null; }
}

function subscribe(listener) {
  // # Synchronize this tab and other tabs without effect-driven hydration writes.
  window.addEventListener("storage", listener);
  window.addEventListener(SESSION_EVENT, listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(SESSION_EVENT, listener);
  };
}

function readToken() {
  const token = localStorage.getItem("renoweb_jwt");
  const payload = token && decode(token);
  return payload?.exp * 1000 > Date.now() ? token : null;
}

const serverToken = () => null;
const hydrated = () => false;
const serverHydrating = () => true;

export function AuthProvider({ children }) {
  const token = useSyncExternalStore(subscribe, readToken, serverToken);
  const isInitializing = useSyncExternalStore(subscribe, hydrated, serverHydrating);
  const payload = token ? decode(token) : null;
  const [identity, setIdentity] = useState(null);

  useEffect(() => {
    // # Load shared account details for every sign-in method, including existing sessions.
    // # Bind results to their token so a late response cannot show another account.
    if (!token) return;
    let cancelled = false;
    fetchAccountIdentity().then((account) => {
      if (!cancelled) setIdentity({ token, account });
    }).catch(() => { /* # Keep token-based identity available when the API is offline. */ });
    return () => { cancelled = true; };
  }, [token]);

  const acceptVerifiedSession = (data) => {
    // # Only OTP verification supplies a session; starting a challenge cannot log in.
    if (!data?.access_token || !decode(data.access_token)) throw new Error("Invalid authentication session.");
    localStorage.setItem("renoweb_jwt", data.access_token);
    window.dispatchEvent(new Event(SESSION_EVENT));
  };
  const verifyLoginOtp = async (challenge, otp, username) => {
    const data = await apiVerifyLoginOtp(challenge, otp, username);
    acceptVerifiedSession(data);
    return data;
  };
  const logout = () => {
    localStorage.removeItem("renoweb_jwt");
    window.dispatchEvent(new Event(SESSION_EVENT));
  };

  return <AuthContext.Provider value={{ token, account: identity?.token === token ? identity.account : null, isInitializing, isSuspended: !!payload?.is_suspended, isAdmin: !!payload?.is_admin,
    login: apiRequestLoginOtp, requestLoginOtp: apiRequestLoginOtp, verifyLoginOtp,
    signup: apiSignup, logout, acceptVerifiedSession }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
