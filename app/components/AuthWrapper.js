"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/AuthContext";

export default function AuthWrapper({ children }) {
  const { token, isInitializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isInitializing && !token) {
      router.push("/");
    }
  }, [token, isInitializing, router]);

  if (isInitializing || !token) {
    return <div className="flex h-screen items-center justify-center bg-gray-50">Loading...</div>;
  }

  return children;
}

