"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  FileText,
  Loader2,
  Calendar,
  BarChart2,
  Settings,
  LogOut,
  ChevronRight,
  XCircle,
} from "lucide-react";
import { Application } from "@/types";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "next/image";

/* ── Sidebar nav items ── */
const ADMIN_NAV = [
  { label: "Dashboard", icon: BarChart2, href: "/admin/dashboard", active: true },
  { label: "All Applications", icon: FileText, href: "/admin/dashboard", active: false },
  { label: "Pending Verification", icon: Clock, href: "/admin/dashboard", active: false },
  { label: "Approved / Rejected", icon: CheckCircle2, href: "/admin/dashboard", active: false },
  { label: "Reports", icon: BarChart2, href: "/admin/dashboard", active: false },
  { label: "Settings", icon: Settings, href: "/admin/dashboard", active: false },
];

function statusBadgeClass(status: string) {
  switch (status) {
    case "PAID":
    case "APPROVED": return "gov-badge gov-badge-green";
    case "SUBMITTED": return "gov-badge gov-badge-blue";
    case "DRAFT": return "gov-badge gov-badge-amber";
    case "REJECTED": return "gov-badge gov-badge-red";
    default: return "gov-badge gov-badge-gray";
  }
}

/* ── Main Component ── */
export default function AdminDashboard() {
  const { user, loading: authLoading, logout } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchApps = async () => {
      if (authLoading) return;
      if (!user) { router.push("/login"); return; }

      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/admin/applications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (result.success) {
          setApplications(result.applications);
        } else {
          toast.error(result.error || "Failed to fetch applications");
        }
      } catch {
        toast.error("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [user, authLoading, router]);

  const filteredApps = applications.filter(
    (app) =>
      app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.formData?.step1?.fullName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: applications.length,
    paid: applications.filter((a) => a.status === "PAID").length,
    pending: applications.filter((a) => a.status === "SUBMITTED").length,
    draft: applications.filter((a) => a.status === "DRAFT").length,
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--gov-bg)" }}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin" size={32} style={{ color: "var(--gov-navy)" }} />
          <p className="text-sm text-gray-500">Loading admin panel…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ background: "var(--gov-bg)" }}>

      {/* ── Left Sidebar ── */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0 border-r"
        style={{
          width: "240px",
          background: "#fff",
          borderColor: "var(--gov-gray-border)",
        }}
        aria-label="Admin navigation"
        role="navigation"
      >
        {/* Sidebar Header */}
        <div
          className="px-6 py-8 border-b"
          style={{ background: "#08387F", borderColor: "var(--gov-navy-dark)" }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-white p-1.5 shadow-inner">
              <Image src="/logo.png" alt="MTU" width={32} height={32} className="object-contain" />
            </div>
            <div>
              <p className="text-white font-black text-sm leading-none tracking-tight">MTU ADMIN</p>
              <p className="text-blue-200 text-[9px] mt-1 font-bold uppercase tracking-widest">Portal System v3</p>
            </div>
          </div>
          <div className="bg-white/10 rounded-lg p-3 border border-white/5">
            <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-1">Session Identity</p>
            <p className="text-xs font-bold text-white truncate">{user?.displayName || "Administrator"}</p>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-6 px-3" role="menubar" aria-label="Admin menu">
          <p className="px-3 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Core Management</p>
          <div className="flex flex-col gap-1">
            {ADMIN_NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                role="menuitem"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold transition-all duration-200 group ${
                  item.active
                    ? "bg-blue-50 text-[#08387F] shadow-sm border border-blue-100"
                    : "text-slate-500 hover:bg-slate-50 hover:text-[#08387F]"
                }`}
              >
                <item.icon size={16} className={`transition-colors ${item.active ? "text-[#08387F]" : "text-slate-400 group-hover:text-[#08387F]"}`} />
                <span className="tracking-tight uppercase">{item.label}</span>
                {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#08387F]"></div>}
              </a>
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-6 border-t bg-slate-50/50" style={{ borderColor: "var(--gov-gray-mid)" }}>
          <button
            id="btn-admin-logout"
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-lg bg-white border border-slate-200 shadow-sm text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all active:scale-[0.98]"
            aria-label="Sign out of admin portal"
          >
            <LogOut size={14} />
            Terminate Session
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 px-8 py-10 overflow-y-auto" id="admin-main-content">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-1 bg-[#08387F] rounded-full"></div>
              <span className="text-[10px] font-black text-[#08387F] uppercase tracking-[0.2em]">Administrative Headquarters</span>
            </div>
            <h1 className="font-display text-4xl font-black tracking-tight" style={{ color: "var(--gov-navy)" }}>
              Consolidated Overview
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-2">
              Cycle 2026-27 admission intelligence & global metrics.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative group">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors text-slate-400 group-focus-within:text-[#08387F]"
              />
              <input
                id="admin-search"
                type="search"
                placeholder="Search registry indices..."
                className="pl-12 pr-6 py-4 text-xs font-bold uppercase tracking-widest border-2 rounded-xl transition-all outline-none focus:border-[#08387F] focus:shadow-lg focus:bg-white bg-slate-50 border-slate-100 placeholder:text-slate-300"
                style={{
                  width: "320px",
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search applications"
              />
            </div>
          </div>
        </div>

        {/* ── Stat Row ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10" role="region" aria-label="Summary statistics">
          <StatBox label="Total Registry" value={stats.total} icon={<Users size={20} />} />
          <StatBox label="Payment Verified" value={stats.paid} icon={<CheckCircle2 size={20} />} />
          <StatBox label="Awaiting Payment" value={stats.pending} icon={<Clock size={20} />} />
          <StatBox label="Draft Indices" value={stats.draft} icon={<AlertCircle size={20} />} />
        </div>

        {/* ── Applications Table ── */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden" id="applications-table">
          {/* Table header */}
          <div
            className="px-8 py-6 border-b flex items-center justify-between bg-slate-50/50"
          >
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-[#08387F]" />
              <h2 className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-500">
                Application Repository <span className="text-[#08387F] ml-2">[{filteredApps.length}]</span>
              </h2>
            </div>
            <button className="text-[10px] font-black uppercase tracking-widest text-[#08387F] border border-blue-100 px-4 py-2 rounded-lg bg-white shadow-sm hover:bg-blue-50 transition-all">
              Export Dataset
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse" aria-label="Applications table">
              <thead>
                <tr className="bg-white">
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">#</th>
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Identity</th>
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">System-ID</th>
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Classification</th>
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Timestamp</th>
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Status</th>
                  <th className="px-8 py-4 text-right text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Interaction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Search size={40} className="text-slate-200" />
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                          {searchTerm ? "No indices matching current parameters" : "Repository currently void"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app, idx) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-8 py-5 text-xs font-black text-slate-300">{idx + 1}</td>
                      <td className="px-4 py-5">
                        <div className="flex flex-col">
                          <p className="font-black text-sm text-slate-800 tracking-tight">
                            {app.formData?.step1?.fullName || <em className="text-slate-300">UNIDENTIFIED</em>}
                          </p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">
                            {app.formData?.step4?.isJEECandidate ? "JEE TRACK" : "UNIVERSITY ENTRANCE"}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-5 font-black font-mono text-xs text-[#08387F]">
                        {app.applicationNumber}
                      </td>
                      <td className="px-4 py-5">
                        <span className="text-[10px] font-black bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase tracking-tighter">
                          {app.formData?.step1?.category || "GENERAL"}
                        </span>
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500">
                          <Calendar size={12} className="text-slate-300" />
                          {app.updatedAt
                            ? new Date((app.updatedAt as any).seconds * 1000).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })
                            : "—"}
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                          app.status === 'PAID' ? 'bg-[#08387F] text-white shadow-sm' : 
                          app.status === 'SUBMITTED' ? 'bg-blue-50 text-[#08387F] border border-blue-100' : 
                          'bg-slate-50 text-slate-400'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button
                          id={`btn-view-app-${app.id}`}
                          onClick={() => router.push(`/admin/application/${app.id}`)}
                          className="inline-flex items-center gap-2 py-2 px-4 rounded-lg bg-white border-2 border-slate-100 text-[10px] font-black uppercase tracking-widest text-[#08387F] hover:bg-[#08387F] hover:text-white hover:border-[#08387F] transition-all group-hover:shadow-md active:scale-95"
                        >
                          Inspect
                          <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── StatBox ── */
function StatBox({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex items-center gap-5 hover:scale-105 transition-all outline outline-0 hover:outline-1 outline-[#08387F]/20">
      <div
        className="w-14 h-14 flex items-center justify-center rounded-xl bg-blue-50 text-[#08387F] shadow-inner border border-blue-100"
      >
        {icon}
      </div>
      <div>
        <p className="text-3xl font-black tracking-tighter text-slate-800">
          {value.toLocaleString()}
        </p>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
          {label}
        </p>
      </div>
    </div>
  );
}
