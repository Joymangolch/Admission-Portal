"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { MTUHeader } from "@/components/Navbar";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  ArrowRight,
  FileText,
  AlertTriangle,
  Info,
  Loader2,
  Calendar,
  BarChart2,
  UserPlus,
} from "lucide-react";
import { Application } from "@/types";
import { toast } from "react-hot-toast";

/* ────────────────────────────────────── */
const STEPS = [
  "Personal Details",
  "Parent Details",
  "Address",
  "Education",
  "Preferences",
  "Documents",
  "Preview",
  "Declaration",
  "Payment",
];

const STATUS_LABELS: Record<string, string> = {
  DRAFT: "Incomplete",
  SUBMITTED: "Submitted (Payment Pending)",
  PAID: "Application Complete",
  REVIEWING: "Under Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

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

/* ────────────────────────────────────── */
export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (authLoading) return;
      if (!user) { router.push("/login"); return; }

      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();
        if (result.success) {
          setApplication(result.data.application);
        } else {
          toast.error(result.error);
        }
      } catch {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--gov-bg)" }}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin" size={32} style={{ color: "var(--gov-navy)" }} />
          <p className="text-sm text-gray-500">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex min-h-screen flex-col" style={{ background: "var(--gov-bg)" }}>
        <MTUHeader role="candidate" />
        <main className="flex-1 max-w-screen-xl mx-auto w-full px-4 py-16 text-center">
          <div className="gov-card p-12 flex flex-col items-center gap-6 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center border-2 border-blue-100">
              <FileText size={32} className="text-[#08387F]" />
            </div>
            <h2 className="text-2xl font-black text-[#08387F] tracking-tight">No Active Application</h2>
            <p className="text-slate-500 font-medium">We couldn't find an active application for your account. Start your admission journey by initializing your application below.</p>
            <button 
              onClick={() => router.push("/apply/1")}
              className="gov-btn-primary py-4 px-10 flex items-center gap-3"
            >
              <UserPlus size={18} />
              <span className="font-black italic tracking-widest uppercase">Start New Application</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </main>
      </div>
    );
  }

  const completedCount = (application.stepsCompleted || []).length;
  const progressPct = Math.round((completedCount / 9) * 100);

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "var(--gov-bg)" }}>
      <MTUHeader role="candidate" />

      <div
        className="text-sm font-medium border-b shadow-sm"
        style={{
          background: "white",
          borderColor: "var(--gov-gray-mid)",
          color: "var(--gov-text-primary)",
        }}
        role="status"
        aria-label="Application information"
      >
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex flex-wrap gap-x-10 gap-y-2 items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
              <UserPlus size={14} className="text-[#08387F]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold leading-none">CANDIDATE</span>
              <strong className="text-sm tracking-tight">{user?.displayName || "—"}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
              <FileText size={14} className="text-[#08387F]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold leading-none">APPLICATION ID</span>
              <strong className="text-sm font-mono text-[#08387F] tracking-tight">{application.applicationNumber || "NOT ASSIGNED"}</strong>
            </div>
          </div>

          <div className="sm:ml-auto flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
              <Info size={14} className="text-[#08387F]" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold leading-none">STATE</span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#08387F]">
                {STATUS_LABELS[application.status] || application.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-screen-xl mx-auto w-full px-4 py-8">

        {/* ── Status Alerts ── */}
        {application.status === "DRAFT" && (
          <div className="bg-white border-l-4 border-[#08387F] shadow-md p-5 rounded-r-lg mb-8 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 flex-shrink-0">
              <AlertTriangle size={20} className="text-[#08387F]" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide mb-1">Registration Incomplete</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your application process is currently at the draft stage. Access your portal to finalize the 9-step submission before the **May 15, 2026** deadline.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: Progress & Actions ── */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            {/* Application Progress */}
            <div className="gov-card shadow-lg border-none overflow-hidden" id="application-progress">
              <div className="bg-[#08387F] p-5 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BarChart2 size={18} />
                  <h2 className="font-bold text-sm uppercase tracking-widest">Workflow Progress</h2>
                </div>
                <span className="text-[10px] font-black bg-white/20 px-3 py-1 rounded uppercase tracking-widest">
                  {completedCount} / 09 COMPLETED
                </span>
              </div>

              <div className="p-8 bg-white">
                {/* Progress bar */}
                <div className="mb-8">
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    <span>Current Completion Integrity</span>
                    <span className="text-[#08387F]">{progressPct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-4 p-1 flex items-center">
                    <div
                      className="h-2 rounded-full transition-all duration-700 shadow-sm"
                      style={{
                        width: `${progressPct}%`,
                        background: "linear-gradient(90deg, #08387F, #0a47a1)",
                      }}
                      role="progressbar"
                      aria-valuenow={progressPct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>

                {/* Step grid */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                  {STEPS.map((name, idx) => {
                    const stepNo = idx + 1;
                    const done = (application.stepsCompleted || []).includes(stepNo);
                    const active = stepNo === application.currentStep;
                    return (
                      <div
                        key={stepNo}
                        className="flex flex-col items-center gap-2 text-center group"
                      >
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center border-2 transition-all duration-300 ${
                            done 
                              ? "bg-white border-[#08387F] text-[#08387F] shadow-sm" 
                              : active 
                              ? "bg-[#08387F] border-[#08387F] text-white shadow-md scale-110" 
                              : "bg-slate-50 border-slate-200 text-slate-400 opacity-60"
                          }`}
                        >
                          {done ? <CheckCircle2 size={18} /> : <span className="text-sm font-black">{stepNo}</span>}
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-tight leading-tight max-w-[70px] ${active ? "text-[#08387F]" : "text-slate-400"}`}>{name}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Action button */}
                <div className="mt-10 flex flex-wrap gap-4 pt-6 border-t border-slate-50">
                  {application.status !== "PAID" && (
                    <button
                      onClick={() => router.push(`/apply/${application.currentStep || 1}`)}
                      className="gov-btn-primary flex items-center gap-3 py-4 px-8"
                    >
                      <span className="font-black italic tracking-widest">{application.currentStep === 1 ? "INITIALIZE SUBMISSION" : "RESUME WORKFLOW"}</span>
                      <ArrowRight size={18} />
                    </button>
                  )}
                  {application.status === "PAID" && (
                    <button
                      className="gov-btn-secondary flex items-center gap-3 py-4 px-8 border-2"
                    >
                      <Download size={18} className="text-[#08387F]" />
                      <span className="font-black italic tracking-widest text-[#08387F]">ARCHIVE CONFIRMATION</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InfoCard
                id="card-documents"
                icon={<FileText size={18} style={{ color: "var(--gov-navy)" }} />}
                label="Documents Uploaded"
                value={`${Object.keys(application.documents || {}).length} / 7`}
                note="Manage your uploaded certificates"
              />
              <InfoCard
                id="card-payment"
                icon={<CreditCard size={18} style={{ color: "var(--gov-green)" }} />}
                label="Application Fee"
                value={application.status === "PAID" ? "Paid ✓" : "Pending"}
                note={application.status === "PAID" ? "Payment received successfully" : "Fee payment required to submit"}
              />
            </div>
          </div>

          {/* ── Right: Notices & Schedule ── */}
          <div className="flex flex-col gap-8">

            {/* Important Notices */}
            <div className="gov-card shadow-lg border-none overflow-hidden" id="notices-panel">
              <div className="bg-[#08387F] p-4 text-white flex items-center gap-3">
                <AlertTriangle size={16} />
                <h3 className="font-bold text-xs uppercase tracking-widest">Priority Notices</h3>
              </div>
              <div className="p-6 flex flex-col gap-4 bg-white">
                <NoticeItem type="info" title="ADHAAR AUTHENTICATION">
                  Name on Aadhaar must match Class 10 records exactly.
                </NoticeItem>
                <NoticeItem type="info" title="BIOMETRIC PHOTOGRAPH">
                  Recent passport photo (white background) is mandatory.
                </NoticeItem>
                <NoticeItem type="info" title="LEGACY CERTIFICATES">
                  Verify all uploads are issued within the valid timeline.
                </NoticeItem>
              </div>
            </div>

            {/* Key Dates */}
            <div className="gov-card shadow-lg border-none overflow-hidden" id="key-dates-panel">
              <div className="bg-[#08387F] p-4 text-white flex items-center gap-3">
                <Calendar size={16} />
                <h3 className="font-bold text-xs uppercase tracking-widest">Portal Timeline</h3>
              </div>
              <div className="p-0 bg-white">
                <table className="w-full text-xs" aria-label="Key admission dates">
                  <tbody>
                    {[
                      { label: "Final Deadline", date: "May 15, 2026", highlight: true },
                      { label: "Correction window", date: "June 1, 2026", highlight: false },
                      { label: "Examination", date: "July 15, 2026", highlight: false },
                      { label: "Result publishing", date: "July 30, 2026", highlight: false },
                      { label: "Counselling phase", date: "Aug 10, 2026", highlight: false },
                    ].map((row) => (
                      <tr key={row.label} className="border-b border-slate-50 last:border-none">
                        <td className="p-4 text-slate-500 font-bold uppercase tracking-tighter">{row.label}</td>
                        <td
                          className="p-4 text-right font-black"
                          style={{ color: "#08387F" }}
                        >
                          {row.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Helpdesk */}
            <div className="bg-slate-50 p-6 rounded-lg border-2 border-dashed border-slate-200">
              <p className="font-black text-[10px] text-slate-400 uppercase tracking-widest mb-3">SYSTEM ASSISTANCE</p>
              <div className="flex flex-col gap-1 text-sm font-bold text-[#08387F]">
                <p>admissions@mtu.ac.in</p>
                <p>+91-385-2412345</p>
              </div>
              <p className="text-[10px] text-gray-400 mt-4 uppercase font-bold tracking-tighter">Availability: 09:00 — 17:00 (Mon-Sat)</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── Sub-components ── */

function InfoCard({
  id, icon, label, value, note,
}: {
  id?: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 hover:shadow-lg transition-all group" id={id}>
      <div className="flex items-center gap-4 mb-4">
        <div
          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-50 group-hover:bg-[#08387F] transition-colors"
        >
          <div className="group-hover:text-white transition-colors">{icon}</div>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">{label}</p>
          <p className="font-black text-xl tracking-tight text-slate-800">{value}</p>
        </div>
      </div>
      <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{note}</p>
    </div>
  );
}

function NoticeItem({
  type, title, children,
}: {
  type: "warn" | "info" | "error";
  title: string;
  children: React.ReactNode;
}): React.ReactElement {
  const variantClass =
    type === "warn"
      ? "gov-notice-warn"
      : type === "error"
      ? "gov-notice-error"
      : "gov-notice-info";

  return (
    <div className={`gov-notice ${variantClass}`}>
      {title && (
        <p className="font-bold text-[11px] uppercase tracking-widest mb-1">
          {title}
        </p>
      )}
      <p className="text-[12px] leading-relaxed">{children}</p>
    </div>
  );
}
