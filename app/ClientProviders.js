"use client";

import { AuthProvider } from "./lib/AuthContext";

export default function ClientProviders({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
