"use client";

import { AuthProvider } from "./lib/AuthContext";
import FloatingSupportButton from "./components/FloatingSupportButton";

export default function ClientProviders({ children }) {
  return (
    <AuthProvider>
      {children}
      <FloatingSupportButton />
    </AuthProvider>
  );
}
