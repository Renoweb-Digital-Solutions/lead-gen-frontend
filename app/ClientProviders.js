"use client";

import { AuthProvider } from "./lib/AuthContext";
import FloatingSupportButton from "./components/FloatingSupportButton";
import FeedbackWidget from "./components/FeedbackWidget";
import { useSessionState } from "./hooks/useSessionState";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ClientProviders({ children }) {
  const [isDark] = useSessionState("renoweb-theme-dark", false);
  const pathname = usePathname();

  useEffect(() => {
    // Only allow dark mode on dashboard and profile routes
    const isDashboardRoute = pathname !== "/" && !pathname?.startsWith("/admin");
    
    if (isDark && isDashboardRoute) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, [isDark, pathname]);

  return (
    <AuthProvider>
      {children}
      <FloatingSupportButton />
      {/* # Feedback lives inside authentication and stays independent of pipeline execution. */}
      <FeedbackWidget />
    </AuthProvider>
  );
}
