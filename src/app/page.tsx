import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import {
  FileText,
  UserPlus,
  LogIn,
  ChevronRight,
  Download,
  AlertCircle,
  CalendarDays,
  Info,
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

const IMPORTANT_DATES = [
  { label: "Notification Released", date: "April 1, 2026" },
  { label: "Online Application Opens", date: "April 5, 2026" },
  { label: "Last Date to Apply", date: "May 15, 2026" },
  { label: "Correction Window", date: "June 1–7, 2026" },
  { label: "Admit Card Download", date: "July 1, 2026" },
  { label: "Entrance Examination", date: "July 15, 2026" },
  { label: "Result Declaration", date: "July 30, 2026" },
  { label: "Counselling Begins", date: "August 10, 2026" },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "var(--gov-bg)" }}>
      <Navbar />
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-8">

        {/* ── Important Notice ── */}
        <div className="gov-notice gov-notice-warn mb-4 flex items-start gap-2 text-xs">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <p>
            <strong>Admission 2026-27 is now open.</strong> Last date to apply online is{" "}
            <strong>May 15, 2026</strong>. Candidates are advised to submit applications before the deadline.
          </p>
        </div>

        {/* ── 3-Card Panel ── */}
        <div id="instructions" className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

          {/* Card 1 — Instructions */}
          <div className="gov-card flex flex-col shadow-sm" id="card-instructions">
            <div className="px-4 py-3 text-xs font-black uppercase tracking-tight flex items-center gap-2" style={{ background: "var(--gov-navy)", color: "#fff" }}>
              <Info size={12} />
              <span>Instructions to Apply</span>
            </div>
            <div className="flex-1 p-4 bg-white overflow-y-auto max-h-[320px] custom-scrollbar">
              <ol className="space-y-3" aria-label="Application instructions">
                {INSTRUCTIONS.map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-[13px] text-slate-700 leading-snug font-semibold">
                    <span
                      className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center text-[10px] font-black mt-0.5 bg-slate-50 border border-slate-200 text-primary"
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
                className="gov-btn-secondary w-full flex items-center justify-center gap-2 py-2 text-[11px] font-bold uppercase"
              >
                <Download size={12} />
                Information Bulletin
              </a>
            </div>
          </div>

          {/* Card 2 — New Registration */}
          <div className="gov-card flex flex-col shadow-sm" id="card-registration">
            <div className="px-4 py-3 text-xs font-black uppercase tracking-tight flex items-center gap-2" style={{ background: "var(--gov-navy)", color: "#fff" }}>
              <UserPlus size={12} />
              <span>New Registration</span>
            </div>
            <div className="flex-1 p-4 bg-white flex flex-col gap-4">
              <div className="bg-blue-50/50 p-3 rounded border border-blue-100 text-[11px] text-blue-900 leading-relaxed font-bold uppercase tracking-tight">
                New applicants must register using a valid Google account.
              </div>

              <div className="space-y-2">
                <p className="font-black text-slate-400 uppercase tracking-tighter text-[10px]">Eligibility:</p>
                <ul className="space-y-2">
                  {[
                    "Passed 10+2 with PCM",
                    "Min 45% aggregate",
                    "Valid JEE or MTU result",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[13px] font-bold text-slate-600">
                      <ChevronRight size={12} className="text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-4">
                <Link
                  href="/login"
                  id="btn-new-registration"
                  className="gov-btn-primary w-full flex items-center justify-center gap-2 py-3 text-[11px] font-black uppercase tracking-widest"
                >
                  <UserPlus size={14} />
                  Register Now
                </Link>
              </div>
            </div>
          </div>

          {/* Card 3 — Login Hub */}
          <div className="gov-card flex flex-col shadow-sm" id="card-login">
            <div className="px-4 py-3 text-xs font-black uppercase tracking-tight flex items-center gap-2" style={{ background: "var(--gov-navy)", color: "#fff" }}>
              <LogIn size={12} />
              <span>Login Hub</span>
            </div>
            <div className="flex-1 p-4 bg-white flex flex-col gap-4">
              <div className="bg-blue-50/50 p-3 rounded border border-blue-100 text-[11px] text-blue-900 leading-relaxed font-bold uppercase tracking-tight">
                Access your ongoing application. Progress is saved automatically.
              </div>

              <div className="space-y-2">
                <p className="font-black text-slate-400 uppercase tracking-tighter text-[10px]">Shortcuts:</p>
                <ul className="space-y-2">
                  {[
                    "Resume saved form",
                    "Status tracking",
                    "Print application",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[13px] font-bold text-slate-600">
                      <ChevronRight size={12} className="text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-4">
                <Link
                  href="/login"
                  id="btn-candidate-login"
                  className="gov-btn-primary w-full flex items-center justify-center gap-2 py-3 text-[11px] font-black uppercase tracking-widest"
                >
                  <LogIn size={14} />
                  Login with Google
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Important Dates ── */}
        <div className="gov-card shadow-sm border-none overflow-hidden" id="important-dates">
          <div className="px-4 py-3 text-xs font-black uppercase tracking-tight flex items-center gap-2"
            style={{ background: "#08387F", color: "#fff" }}>
            <CalendarDays size={12} />
            <span>Important Dates — 2026-27</span>
          </div>
          <div className="overflow-x-auto">
            <table className="gov-table text-[13px]" aria-label="Important dates">
              <thead>
                <tr>
                  <th scope="col" className="w-16 text-center">S.No.</th>
                  <th scope="col">Event / Activity</th>
                  <th scope="col">Date / Schedule</th>
                </tr>
              </thead>
              <tbody>
                {IMPORTANT_DATES.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="text-center font-bold text-slate-400">{i + 1}.</td>
                    <td className="font-bold text-slate-700">{row.label}</td>
                    <td className="font-black text-primary uppercase tracking-tight">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Helpdesk ── */}
        <div className="gov-notice gov-notice-info flex items-start gap-2 mt-4 text-[11px] font-bold uppercase tracking-tight">
          <Info size={14} className="mt-0.5 flex-shrink-0" />
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
          <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">
            © 2026 Manipur Technical University. Imphal — 795004.
          </p>
          <div className="flex gap-4">
            {["Privacy Policy", "Terms of Use", "Disclaimer"].map(link => (
              <a key={link} href="#" className="text-[10px] font-bold text-blue-300/60 hover:text-white transition-colors uppercase tracking-[0.2em]">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
