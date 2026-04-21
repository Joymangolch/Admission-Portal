"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { MTUHeader } from "@/components/Navbar";
import { Info, Loader2, ShieldCheck } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const { user, loginWithGoogle, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/candidate/dashboard");
    }
  }, [user, loading, router]);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch {
      // Error handled in context
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--gov-bg)" }}>
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin" size={32} style={{ color: "var(--gov-navy)" }} />
          <p className="text-sm font-medium text-gray-500">Verifying session…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col" style={{ background: "var(--gov-bg)" }}>
      <MTUHeader role="public" />

      <main className="flex-1 flex items-start justify-center pt-16 pb-20 px-4">
        <div className="w-full max-w-md">

          {/* ── Institution Identity ── */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-full shadow-lg relative bg-white border-2 border-blue-100">
              <div className="absolute inset-0 rounded-full border-4 border-[#08387F] opacity-10"></div>
              <Image src="/logo.png" alt="MTU Seal" width={72} height={72} className="object-contain relative z-10" />
            </div>
            <h1
              className="font-display text-2xl font-black tracking-tight"
              style={{ color: "var(--gov-navy)" }}
            >
              MANIPUR TECHNICAL UNIVERSITY
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="h-[1px] w-8 bg-slate-300"></div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Post-Graduate & Undergraduate Admissions</p>
              <div className="h-[1px] w-8 bg-slate-300"></div>
            </div>
          </div>

          {/* ── Login Panel ── */}
          <div className="gov-card overflow-hidden shadow-2xl border-none outline outline-1 outline-blue-100/50" id="login-panel">
            {/* Panel header */}
            <div className="gov-section-title m-0 text-center py-4"
              style={{ borderRadius: 0, marginBottom: 0, borderBottom: "1px solid var(--gov-gray-mid)", background: "var(--gov-navy)", color: "#fff", borderLeft: "none" }}>
              Candidate Log-in Portal
            </div>

            <div className="p-8 bg-white flex flex-col gap-6">

              {/* Info notice */}
              <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 text-xs text-blue-900 leading-relaxed font-medium flex items-start gap-3">
                <Info size={16} className="mt-0.5 flex-shrink-0 text-[#08387F]" />
                <p>
                  Please use your primary <strong>Google account</strong> for registration. Your progress will be linked to this identity throughout the admission cycle.
                </p>
              </div>

              {/* Google Sign-In Button */}
              <button
                id="btn-google-signin"
                onClick={handleLogin}
                className="w-full flex items-center justify-center gap-3 border-2 rounded-lg py-4 px-4 bg-white text-sm font-bold text-slate-800 hover:bg-slate-50 transition-all hover:border-[#08387F] hover:shadow-md group active:scale-[0.98]"
                style={{ borderColor: "var(--gov-gray-border)" }}
                aria-label="Sign in with Google"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="group-hover:text-[#08387F] transition-colors">Log-in with Google Security</span>
              </button>

              {/* Security note */}
              <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                <ShieldCheck size={12} className="text-emerald-600" />
                <span>End-to-End SSL Encryption Active</span>
              </div>

              <div className="h-[1px] w-full bg-slate-100"></div>

              {/* Terms */}
              <p className="text-[11px] text-slate-500 text-center leading-relaxed font-medium">
                Your privacy is paramount. By entering, you agree to the{" "}
                <a href="#" className="underline decoration-blue-200 hover:decoration-[#08387F] transition-all" style={{ color: "var(--gov-navy)" }}>
                  Terms of Admission
                </a>{" "}
                and{" "}
                <a href="#" className="underline decoration-blue-200 hover:decoration-[#08387F] transition-all" style={{ color: "var(--gov-navy)" }}>
                  Data Protection Policy
                </a>.
              </p>
            </div>
          </div>

          {/* ── Helpdesk ── */}
          <div className="mt-8 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Assistance:{" "}
            <a href="mailto:admissions@mtu.ac.in" className="hover:text-[#08387F] transition-colors underline decoration-slate-200" style={{ color: "var(--gov-navy)" }}>
              Get Technical Support
            </a>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer
        className="text-xs py-3 px-4 text-center border-t"
        style={{ background: "var(--gov-navy-dark)", color: "#93c5fd", borderColor: "rgba(255,255,255,0.1)" }}
      >
        © 2026 Manipur Technical University, Takyelpat, Imphal — 795004. All Rights Reserved.
      </footer>
    </div>
  );
}
