"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, Settings, UserRound } from "lucide-react";
import { useAuth } from "../lib/AuthContext";
import AccountAvatar from "./AccountAvatar";
import s from "./AccountMenu.module.css";

export default function AccountMenu() {
  const { account, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const trigger = useRef(null);
  const panelId = useId();
  const name = account?.username || "Your account";

  useEffect(() => {
    if (!open) return;
    // # Listen only while expanded. Clicking outside dismisses the panel on
    // # touch devices as well as desktop, without intercepting other controls.
    const dismiss = (event) => {
      if (!root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);

  function handleKeys(event) {
    // # This is a navigation disclosure with ordinary links, not an ARIA menu:
    // # Tab follows the natural link order; Escape restores the trigger focus.
    if (event.key === "Escape") {
      setOpen(false);
      trigger.current?.focus();
    }
  }

  return (
    <div
      ref={root}
      className={s.root}
      onKeyDown={handleKeys}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") setOpen(true);
      }}
      onPointerLeave={() => {
        if (!root.current?.contains(document.activeElement)) setOpen(false);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        className={s.trigger}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Profile options for ${name}`}
        onClick={() => setOpen((value) => !value)}
      >
        <AccountAvatar
          picture={account?.picture}
          fallback={name.charAt(0).toUpperCase()}
          className={s.avatar}
        />
        <span className={s.triggerText}>Profile</span>
        <ChevronDown size={14} className={open ? s.chevronOpen : ""} />
      </button>
      <div id={panelId} hidden={!open} className={s.panel}>
        <div className={s.identity}>
          <strong>{name}</strong>
          <span>{account?.email || "Manage your account"}</span>
        </div>
        <nav aria-label="Account navigation" className={s.links}>
          <Link href="/profile" onClick={() => setOpen(false)}>
            <UserRound size={17} />
            <span>
              My profile<small>Your personal details</small>
            </span>
          </Link>
          <Link href="/settings" onClick={() => setOpen(false)}>
            <Settings size={17} />
            <span>
              Settings<small>Plans, billing & payments</small>
            </span>
          </Link>
        </nav>
        <button
          type="button"
          className={s.logout}
          onClick={() => {
            setOpen(false);
            logout();
            router.push("/");
          }}
        >
          <LogOut size={17} />
          Log out
        </button>
      </div>
    </div>
  );
}
