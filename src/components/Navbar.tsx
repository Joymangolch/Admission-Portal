"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/auth/AuthContext";
import { LogOut, Phone, Mail, Menu, Download } from "lucide-react";

/* ─────────────────────────────────────────
   TOP UTILITY BAR
   ───────────────────────────────────────── */
function UtilityBar() {
  const [fontSize, setFontSize] = useState<"normal" | "large" | "larger">("normal");

  const applyFontSize = (size: "normal" | "large" | "larger") => {
    const map = { normal: "100%", large: "112%", larger: "125%" };
    document.documentElement.style.fontSize = map[size];
    setFontSize(size);
  };

  return (
    <div className="utility-bar">
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-8">
        {/* Left: Contact */}
        <div className="flex items-center gap-4">
          <a
            href="tel:+913852412345"
            className="flex items-center gap-2"
            aria-label="Call admissions helpdesk"
          >
            <Phone size={10} />
            <span className="text-[10px] font-bold tracking-tight">+91-385-2412345</span>
          </a>
          <span className="text-white/20 select-none">|</span>
          <a
            href="mailto:admissions@mtu.ac.in"
            className="flex items-center gap-2"
            aria-label="Email admissions"
          >
            <Mail size={10} />
            <span className="text-[10px] font-bold tracking-tight">admissions@mtu.ac.in</span>
          </a>
        </div>

        {/* Right: Accessibility */}
        <div className="flex items-center gap-1" aria-label="Text size controls">
          <span className="text-white/40 text-[10px] font-bold mr-1 hidden sm:inline uppercase">Text Size:</span>
          <button
            onClick={() => applyFontSize("normal")}
            className={`w-6 h-5 flex items-center justify-center rounded text-[10px] font-black border transition-colors ${
              fontSize === "normal"
                ? "border-white/60 text-white bg-white/10"
                : "border-transparent text-white/50 hover:text-white"
            }`}
            aria-label="Normal text size"
            aria-pressed={fontSize === "normal"}
          >
            A
          </button>
          <button
            onClick={() => applyFontSize("large")}
            className={`w-6 h-5 flex items-center justify-center rounded text-[10px] font-black border transition-colors ${
              fontSize === "large"
                ? "border-white/60 text-white bg-white/10"
                : "border-transparent text-white/50 hover:text-white"
            }`}
            aria-label="Large text size"
            aria-pressed={fontSize === "large"}
          >
            A+
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN HEADER
   ───────────────────────────────────────── */
function MainHeader({ candidateName, applicationNumber, status }: {
  candidateName?: string;
  applicationNumber?: string;
  status?: string;
}) {
  const { user, logout } = useAuth();
  const displayName = candidateName || user?.displayName || user?.email;

  return (
    <header className="main-header">
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-16 gap-6">
        {/* Logo + Name */}
        <Link href="/" className="flex items-center gap-3 shrink-0" aria-label="MTU Admission Portal Home">
          <div className="relative h-10 w-10 shrink-0">
            <Image
              src="/logo.png"
              alt="Manipur Technical University Seal"
              fill
              sizes="40px"
              className="object-contain"
              priority
            />
          </div>
          <div className="flex flex-col justify-center">
            <span
              className="font-display text-white leading-none text-base font-black tracking-tight"
              aria-level={1}
            >
              MANIPUR TECHNICAL UNIVERSITY
            </span>
            <span className="text-[10px] text-blue-200 font-semibold tracking-[0.2em] uppercase mt-1">
              Admission Portal 2026-27
            </span>
          </div>
        </Link>

        {/* Right: Auth State */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            /* ── Logged In: candidate identity + sign out ── */
            <div className="flex items-center gap-3">
              {/* Candidate Identity Chip */}
              {displayName && (
                <div className="hidden sm:flex flex-col items-end gap-0.5">
                  <span className="text-white text-[13px] font-semibold leading-none">
                    {displayName}
                  </span>
                  {applicationNumber && (
                    <span className="text-blue-200 text-[10px] font-mono tracking-wider">
                      Application No: {applicationNumber}
                    </span>
                  )}
                </div>
              )}
              {status && (
                <span className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                  status === 'PAID' || status === 'APPROVED'
                    ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30'
                    : 'bg-white/10 text-blue-200 border border-white/20'
                }`}>
                  {status === 'PAID' || status === 'APPROVED' ? 'FINALIZED' : 'IN PROGRESS'}
                </span>
              )}
              <button
                onClick={logout}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-medium px-3 py-2 rounded transition-colors"
                aria-label="Sign out of your account"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            /* ── Not Logged In: single entry point ── */
            <Link
              href="/login"
              className="flex items-center gap-1.5 bg-white text-[#08387F] text-xs font-semibold px-4 py-2 rounded transition-all shadow-sm hover:shadow-md hover:bg-blue-50"
            >
              Continue with Google
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────
   ROLE-BASED APPLICATION NAVBAR
   ───────────────────────────────────────── */
type UserRole = "public" | "candidate" | "admin";

const NAV_LINKS: Record<UserRole, { label: string; href: string; exact?: boolean }[]> = {
  public: [
    { label: "Home", href: "/", exact: true },
  ],
  candidate: [
    { label: "Dashboard", href: "/candidate/dashboard", exact: true },
    { label: "My Application", href: "/apply", exact: false },
  ],
  admin: [
    { label: "Dashboard", href: "/admin/dashboard", exact: true },
    { label: "Applications", href: "/admin/dashboard", exact: true },
    { label: "Verification Queue", href: "/admin/dashboard", exact: true },
    { label: "Reports", href: "/admin/dashboard", exact: true },
    { label: "Settings", href: "/admin/dashboard", exact: true },
  ],
};

function AppNavbar({
  role,
  applicationNumber,
  status,
}: {
  role: UserRole;
  applicationNumber?: string;
  status?: string;
}) {
  const pathname = usePathname();
  const links = NAV_LINKS[role];
  const [mobileOpen, setMobileOpen] = useState(false);
 
  return (
    <nav className="app-navbar" aria-label="Application navigation">
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1" role="menubar">
          {links.map((link) => {
            // Strict exact matching so only one item is ever active
            const isActive = link.exact
              ? pathname === link.href || pathname === link.href.split('#')[0]
              : pathname.startsWith(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                role="menuitem"
                className={`app-nav-link ${isActive ? "active" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
 
        {/* Role indicator (desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-[0.15em]">
            {role === "admin" ? "Admin" : "Candidate Portal"}
          </span>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex items-center gap-2 py-3 text-sm font-medium text-gray-600"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          <Menu size={18} />
          <span>Menu</span>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white" role="menu">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              role="menuitem"
              className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 border-b border-gray-100"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

/* ─────────────────────────────────────────
   ASSEMBLED MTU HEADER (Public — no auth)
   ───────────────────────────────────────── */
export function MTUHeader({
  role = "public",
  applicationNumber,
  status,
  candidateName,
}: {
  role?: UserRole;
  applicationNumber?: string;
  status?: string;
  candidateName?: string;
}) {
  return (
    <div className="sticky top-0 z-50 w-full shadow-md">
      <UtilityBar />
      <MainHeader candidateName={candidateName} applicationNumber={applicationNumber} status={status} />
      <AppNavbar role={role} applicationNumber={applicationNumber} status={status} />
    </div>
  );
}
 
/* ─────────────────────────────────────────
   SMART HEADER (auto-detects role from auth)
   ───────────────────────────────────────── */
export function SmartMTUHeader({
  applicationNumber,
  status,
  candidateName,
}: {
  applicationNumber?: string;
  status?: string;
  candidateName?: string;
}) {
  const { user } = useAuth();
 
  let role: UserRole = "public";
  if (user) {
    if (typeof document !== "undefined") {
      const isAdmin = document.cookie.includes("user-role=admin");
      role = isAdmin ? "admin" : "candidate";
    } else {
      role = "candidate";
    }
  }
 
  return (
    <div className="sticky top-0 z-50 w-full shadow-md">
      <UtilityBar />
      <MainHeader candidateName={candidateName} applicationNumber={applicationNumber} status={status} />
      <AppNavbar role={role} applicationNumber={applicationNumber} status={status} />
    </div>
  );
}

/* ─────────────────────────────────────────
   LEGACY EXPORT (back-compat for Navbar import)
   ───────────────────────────────────────── */
export const Navbar = SmartMTUHeader;
