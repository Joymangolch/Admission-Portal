"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { MTUHeader } from "@/components/Navbar";
import {
  CheckCircle2,
  CreditCard,
  Download,
  ArrowRight,
  FileText,
  AlertTriangle,
  Loader2,
  BarChart2,
  UserPlus,
  Receipt,
  ShieldCheck,
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

function formatDate(val: any): string {
  if (!val) return "—";
  try {
    const d = val?.toDate ? val.toDate() : new Date(val);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function formatAmount(val?: number): string {
  if (!val) return "—";
  // The user expects the value to be displayed as a whole number (e.g. 300)
  return `₹${val.toLocaleString("en-IN")}`;
}

/* ────────────────────────────────────── */
export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
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
        <MTUHeader
          role="candidate"
          candidateName={user?.displayName || undefined}
        />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-16 text-center">
          <div className="gov-card p-12 flex flex-col items-center gap-6 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center border-2 border-blue-100">
              <FileText size={32} className="text-[#08387F]" />
            </div>
            <h2 className="text-2xl font-bold text-[#08387F] tracking-tight">No Active Application</h2>
            <p className="text-slate-500">We couldn&apos;t find an active application for your account. Start your admission journey by initializing your application below.</p>
            <button
              onClick={() => router.push("/apply/1")}
              className="gov-btn-primary py-3 px-8 flex items-center gap-3"
            >
              <UserPlus size={17} />
              <span className="font-semibold tracking-wide">Start New Application</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </main>
      </div>
    );
  }

  const isFinalized = application.status === "PAID" || application.status === "APPROVED";
  const completedCount = isFinalized ? 9 : (application.stepsCompleted || []).length;
  const progressPct = Math.round((completedCount / 9) * 100);

  const handleDownloadPDF = async () => {
    if (!user || !application) return;
    setIsDownloading(true);

    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/application/pdf?applicationId=${application.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || "Failed to download PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${application.applicationNumber || "application"}-form.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      toast.error(error.message || "Failed to download PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "var(--gov-bg)" }}>
      <MTUHeader
        role="candidate"
        applicationNumber={application.applicationNumber}
        status={application.status}
        candidateName={user?.displayName || undefined}
      />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">

        {/* ── Draft Alert ── */}
        {application.status === "DRAFT" && (
          <div className="bg-white border-l-4 border-[#08387F] shadow-sm p-4 rounded-r-lg mb-6 flex items-start gap-3">
            <AlertTriangle size={18} className="text-[#08387F] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Application Incomplete</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your application is currently a draft. Complete all 9 steps before the <strong>May 15, 2026</strong> deadline.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Progress & Actions ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Application Progress */}
            <div className="gov-card shadow-sm border-none overflow-hidden" id="application-progress">
              <div className="bg-[#08387F] p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart2 size={16} />
                  <h2 className="font-semibold text-sm tracking-wide">Application Progress</h2>
                </div>
                <span className="text-[11px] font-semibold bg-white/15 px-3 py-1 rounded tracking-wider">
                  {completedCount} / 9 Steps Completed
                </span>
              </div>

              <div className="p-6 bg-white">
                {/* Progress bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs font-semibold text-slate-400 mb-2">
                    <span>Completion</span>
                    <span className="text-[#08387F]">{progressPct}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 p-0.5 flex items-center">
                    <div
                      className="h-2 rounded-full transition-all duration-700"
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
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {STEPS.map((name, idx) => {
                    const stepNo = idx + 1;
                    const done = isFinalized || (application.stepsCompleted || []).includes(stepNo);
                    const active = !isFinalized && stepNo === application.currentStep;
                    return (
                      <div key={stepNo} className="flex flex-col items-center gap-1.5 text-center">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center border-2 transition-all duration-300 ${
                            done
                              ? "bg-white border-[#08387F] text-[#08387F]"
                              : active
                              ? "bg-[#08387F] border-[#08387F] text-white scale-105"
                              : "bg-slate-50 border-slate-200 text-slate-400 opacity-50"
                          }`}
                        >
                          {done ? <CheckCircle2 size={16} /> : <span className="text-xs font-semibold">{stepNo}</span>}
                        </div>
                        <span className={`text-[10px] font-medium uppercase tracking-tight leading-tight max-w-[70px] ${active ? "text-[#08387F]" : "text-slate-400"}`}>
                          {name}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Action buttons */}
                <div className="mt-8 flex flex-wrap gap-3 pt-5 border-t border-slate-100">
                  {!isFinalized && (
                    <button
                      onClick={() => router.push(`/apply/${application.currentStep || 1}`)}
                      className="gov-btn-primary flex items-center gap-2 py-3 px-6"
                    >
                      <span className="font-semibold">
                        {application.currentStep === 1 ? "Start Application" : "Resume Application"}
                      </span>
                      <ArrowRight size={16} />
                    </button>
                  )}
                  {isFinalized && (
                    <button
                      id="btn-download-application-pdf"
                      onClick={handleDownloadPDF}
                      disabled={isDownloading}
                      className="gov-btn-primary flex items-center gap-2 py-3 px-6"
                    >
                      <Download size={16} />
                      <span className="font-semibold">
                        {isDownloading ? "Downloading…" : "Download Application Form (PDF)"}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Documents Status Card */}
            <div className="gov-card shadow-sm overflow-hidden" id="card-documents">
              <div className="bg-[#08387F] p-4 text-white flex items-center gap-2">
                <FileText size={16} />
                <h3 className="font-semibold text-sm">Documents</h3>
              </div>
              <div className="p-5 bg-white flex items-center gap-4">
                {isFinalized ? (
                  <>
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center border-2 border-emerald-200 shrink-0">
                      <ShieldCheck size={18} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-emerald-700 text-sm">All Documents Verified ✓</p>
                      <p className="text-xs text-slate-500 mt-0.5">Your submitted documents have been accepted.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border-2 border-blue-100 shrink-0">
                      <FileText size={18} className="text-[#08387F]" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">
                        {Object.keys(application.documents || {}).length} document(s) uploaded
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {application.status === "DRAFT"
                          ? "Continue your application to upload remaining documents."
                          : "Documents are under review."}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Payment Details Card — shown only when paid */}
            {(isFinalized || application.paymentStatus === "SUCCESS") && (
              <div className="gov-card shadow-sm overflow-hidden" id="payment-summary">
                <div className="bg-[#08387F] p-4 text-white flex items-center gap-2">
                  <Receipt size={16} />
                  <h3 className="font-semibold text-sm">Payment Summary</h3>
                </div>
                <div className="p-5 bg-white">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Status</p>
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2 py-0.5 rounded">
                        <CheckCircle2 size={11} />
                        PAID
                      </span>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Amount</p>
                      <p className="text-sm font-semibold text-slate-800">
                        {formatAmount(application.paymentAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Transaction ID</p>
                      <p className="text-xs font-mono text-slate-700 break-all">
                        {application.paymentId || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Payment Date</p>
                      <p className="text-sm text-slate-700">{formatDate(application.paymentCompletedAt)}</p>
                    </div>
                  </div>
                  <button
                    id="btn-download-receipt"
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className="gov-btn-secondary flex items-center gap-2 text-sm"
                  >
                    <Download size={14} />
                    {isDownloading ? "Downloading…" : "Download Receipt"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Notices ── */}
          <div className="flex flex-col gap-6">

            {/* Application Fee Status */}
            <div className="gov-card shadow-sm overflow-hidden" id="card-payment">
              <div className="bg-[#08387F] p-4 text-white flex items-center gap-2">
                <CreditCard size={16} />
                <h3 className="font-semibold text-sm">Application Fee</h3>
              </div>
              <div className="p-5 bg-white">
                {isFinalized ? (
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-emerald-700">Payment Received</p>
                      <p className="text-xs text-slate-500 mt-0.5">Transaction verified successfully.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <CreditCard size={20} className="text-amber-500 shrink-0" />
                    <div>
                      <p className="font-semibold text-sm text-amber-700">Payment Pending</p>
                      <p className="text-xs text-slate-500 mt-0.5">Complete Step 9 to submit your application.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Priority Notices */}
            <div className="gov-card shadow-sm overflow-hidden" id="notices-panel">
              <div className="bg-[#08387F] p-4 text-white flex items-center gap-2">
                <AlertTriangle size={16} />
                <h3 className="font-semibold text-sm">Priority Notices</h3>
              </div>
              <div className="p-4 flex flex-col gap-3 bg-white">
                <NoticeItem type="info" title="Aadhaar Authentication">
                  Name on Aadhaar must match Class 10 records exactly.
                </NoticeItem>
                <NoticeItem type="info" title="Biometric Photograph">
                  Recent passport photo (white background) is mandatory.
                </NoticeItem>
                <NoticeItem type="info" title="Legacy Certificates">
                  Verify all uploads are issued within the valid timeline.
                </NoticeItem>
              </div>
            </div>

            {/* Helpdesk */}
            <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">System Assistance</p>
              <div className="flex flex-col gap-1 text-sm text-[#08387F] font-medium">
                <p>admissions@mtu.ac.in</p>
                <p>+91-385-2412345</p>
              </div>
              <p className="text-[10px] text-gray-400 mt-3 font-medium">Mon–Sat: 09:00 – 17:00</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ── Sub-components ── */

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
        <p className="font-semibold text-xs mb-1">{title}</p>
      )}
      <p className="text-xs leading-relaxed">{children}</p>
    </div>
  );
}
