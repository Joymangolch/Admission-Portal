import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import {
  FileText,
  ChevronRight,
  Download,
  AlertCircle,
  Info,
  LayoutDashboard,
} from "lucide-react";

export const metadata = {
  title: "Manipur Technical University | Online Admission Portal 2026-27",
  description:
    "Official online admission portal of Manipur Technical University (MTU), Imphal. Apply for B.Tech, M.Tech and other programmes for the academic year 2026-27.",
};

const INSTRUCTIONS = [
  "Read the prospectus and eligibility criteria carefully before applying.",
  "Keep scanned copies of all documents ready (photograph, signature, certificates).",
  "Register with your Google account and fill all form fields accurately.",
  "Upload documents in JPEG/PNG (max 200 KB) or PDF (max 500 KB) format.",
  "Pay the non-refundable application fee via Razorpay (online payment only).",
  "Take a printout of the completed application form after payment.",
  "Candidates must bring the printout along with originals at the time of counselling.",
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "var(--gov-bg)" }}>
      <Navbar />
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-8">

        {/* ── Important Notice ── */}
        <div className="gov-notice gov-notice-warn mb-6 flex items-start gap-3">
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          <p className="text-sm">
            <strong>Admission 2026-27 is now open.</strong> Last date to apply online is{" "}
            <strong>May 15, 2026</strong>. Candidates are advised to submit applications before the deadline.
          </p>
        </div>

        {/* ── 2-Card Panel ── */}
        <div id="instructions" className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">

          {/* Card 1 — Instructions */}
          <div className="gov-card flex flex-col shadow-sm" id="card-instructions">
            <div
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
              style={{ background: "var(--gov-navy)", color: "#fff" }}
            >
              <Info size={13} />
              <span>Instructions to Apply</span>
            </div>
            <div className="flex-1 p-4 bg-white overflow-y-auto max-h-[340px] custom-scrollbar">
              <ol className="space-y-3" aria-label="Application instructions">
                {INSTRUCTIONS.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700 leading-snug">
                    <span
                      className="shrink-0 w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold mt-0.5 bg-slate-50 border border-slate-200 text-primary"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 mt-auto">
              <a
                href="/prospectus-2026.pdf"
                className="gov-btn-secondary w-full flex items-center justify-center gap-2 py-2 text-xs"
              >
                <Download size={13} />
                Download Information Bulletin
              </a>
            </div>
          </div>

          {/* Card 2 — Application Entry (merged Registration + Login) */}
          <div className="gov-card flex flex-col shadow-sm" id="card-apply">
            <div
              className="px-4 py-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-2"
              style={{ background: "var(--gov-navy)", color: "#fff" }}
            >
              <FileText size={13} />
              <span>Candidate Portal Access</span>
            </div>
            <div className="flex-1 p-6 bg-white flex flex-col gap-5">

              {/* What you can do */}
              <ul className="space-y-2">
                {[
                  "Start or resume your application",
                  "Upload required documents securely",
                  "Pay non-refundable application fee",
                  "Download your completed application form",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                    <ChevronRight size={13} className="text-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Eligibility note */}
              <div className="bg-blue-50/70 p-3 rounded border border-blue-100 text-xs text-blue-900 leading-relaxed">
                Eligibility: Passed 10+2 with PCM, minimum 45% aggregate, and a valid JEE or MTU entrance result.
              </div>

              <div className="mt-auto flex flex-col gap-3 pt-2">
                {/* Primary CTA — Google Sign-In */}
                <Link
                  href="/login"
                  id="btn-continue-google"
                  className="gov-btn-primary w-full flex items-center justify-center gap-2 py-3"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </Link>

                {/* Returning user shortcut */}
                <Link
                  href="/candidate/dashboard"
                  id="btn-go-dashboard"
                  className="w-full flex items-center justify-center gap-2 text-sm text-[#08387F] hover:underline py-1"
                >
                  <LayoutDashboard size={14} />
                  Already applied? Go to Dashboard →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Helpdesk ── */}
        <div className="gov-notice gov-notice-info flex items-start gap-2 mt-4 text-sm">
          <Info size={15} className="mt-0.5 shrink-0" />
          <p>
            Technical Support: <strong>admissions@mtu.ac.in</strong> | Call: <strong>+91-385-2412345</strong>
          </p>
        </div>

      </main>

      {/* ── Footer ── */}
      <footer
        className="border-t mt-auto"
        style={{ background: "var(--gov-navy-dark)", borderColor: "rgba(255,255,255,0.1)" }}
        role="contentinfo"
      >
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-medium text-blue-200 uppercase tracking-widest">
            © 2026 Manipur Technical University. Imphal — 795004.
          </p>
          <div className="flex gap-4">
            {["Privacy Policy", "Terms of Use", "Disclaimer"].map(link => (
              <a key={link} href="#" className="text-[11px] text-blue-300/60 hover:text-white transition-colors">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
