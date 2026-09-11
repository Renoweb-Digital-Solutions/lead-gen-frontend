"use client";

import { useState } from "react";
import { MessageSquarePlus } from "lucide-react";
import SupportTicketModal from "./SupportTicketModal";
import { useAuth } from "../lib/AuthContext";
import { usePathname } from "next/navigation";

export default function FloatingSupportButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { token, isInitializing } = useAuth();
  const pathname = usePathname();

  // Don't show on admin routes or if not logged in
  if (isInitializing || !token || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#023dbb] hover:bg-[#308fef] text-white rounded-full p-4 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center group"
      >
        <MessageSquarePlus className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      <SupportTicketModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
