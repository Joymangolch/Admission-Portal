"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/lib/auth/AuthContext";
import { LogOut, Phone, Mail, Menu, X, ChevronDown } from "lucide-react";

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
function MainHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="main-header">
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-16 gap-6">
        {/* Logo + Name */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0" aria-label="MTU Admission Portal Home">
          <div className="relative h-10 w-10 flex-shrink-0">
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
            <span className="text-[10px] text-blue-200 font-bold tracking-[0.2em] uppercase mt-1">
              Admission Portal 2026-27
            </span>
          </div>
        </Link>

        {/* Right: Auth State */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {user ? (
            /* ── Logged In: show name + app number + logout ── */
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-white text-sm font-bold leading-none">
                  {user.displayName || user.email}
                </span>
                <span className="text-blue-200 text-xs font-medium mt-0.5">
                  {user.email}
                </span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold px-3 py-2 rounded transition-colors"
                aria-label="Sign out of your account"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            /* ── Not Logged In: show Login + Register ── */
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs font-bold px-3 py-2 rounded transition-colors"
              >
                Login
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-1.5 bg-[#08387F] hover:bg-[#0a47a1] text-white text-xs font-bold px-4 py-2 rounded transition-all shadow-sm hover:shadow-md border border-[#062b66]"
              >
                New Registration
              </Link>
            </div>
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

const NAV_LINKS: Record<UserRole, { label: string; href: string }[]> = {
  public: [
    { label: "Home", href: "/" },
    { label: "New Registration", href: "/login" },
    { label: "Login", href: "/login" },
    { label: "Instructions", href: "/#instructions" },
  ],
  candidate: [
    { label: "Dashboard", href: "/candidate/dashboard" },
    { label: "My Application", href: "/apply/1" },
    { label: "Payment Status", href: "/candidate/dashboard" },
    { label: "Download Form", href: "/candidate/dashboard" },
    { label: "Help", href: "/#instructions" },
  ],
  admin: [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Applications", href: "/admin/dashboard" },
    { label: "Verification Queue", href: "/admin/dashboard" },
    { label: "Reports", href: "/admin/dashboard" },
    { label: "Settings", href: "/admin/dashboard" },
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
        <div className="hidden md:flex items-center gap-3" role="menubar">
          {links.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
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
 
        {/* Role indicator pill + App Info (desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {applicationNumber && (
            <div className="flex items-center gap-3 pr-4 border-r border-gray-200">
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 leading-none">Application No.</span>
                <span className="text-[11px] font-bold text-blue-900 font-mono mt-0.5">{applicationNumber}</span>
              </div>
              {status && (
                <span className="gov-badge gov-badge-blue text-[9px] rounded-sm uppercase tracking-tighter">
                  {status}
                </span>
              )}
            </div>
          )}
          <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
            {role === "admin" ? "Admin Portal" : role === "candidate" ? "Candidate Portal" : "Public"}
          </span>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex items-center gap-2 py-3 text-sm font-semibold text-gray-600"
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
              className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 border-b border-gray-100"
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
}: {
  role?: UserRole;
  applicationNumber?: string;
  status?: string;
}) {
  return (
    <div className="sticky top-0 z-50 w-full shadow-md">
      <UtilityBar />
      <MainHeader />
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
}: {
  applicationNumber?: string;
  status?: string;
}) {
  const { user } = useAuth();
 
  // Role detection: check for admin cookie via document.cookie  
  // (The middleware sets user-role=admin cookie for admins)
  let role: UserRole = "public";
  if (user) {
    // Check for admin role via document.cookie (client-safe)
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
      <MainHeader />
      <AppNavbar role={role} applicationNumber={applicationNumber} status={status} />
    </div>
  );
}

/* ─────────────────────────────────────────
   LEGACY EXPORT (back-compat for Navbar import)
   ───────────────────────────────────────── */
export const Navbar = SmartMTUHeader;
