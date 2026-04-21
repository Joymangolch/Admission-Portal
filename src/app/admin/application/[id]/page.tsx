import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase/admin";
import { getApplicationById } from "@/lib/firestore/services";
import { cookies } from "next/headers";
import { Navbar } from "@/components/Navbar";
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  FileText, 
  User, 
  GraduationCap, 
  MapPin, 
  Home
} from "lucide-react";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "neslang.in@gmail.com").split(",");

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) redirect("/login");

  let decodedToken;
  try {
    decodedToken = await adminAuth.verifyIdToken(token);
    if (!ADMIN_EMAILS.includes(decodedToken.email || "")) {
      redirect("/candidate/dashboard");
    }
  } catch (err) {
    redirect("/login");
  }

  const application = await getApplicationById(id);

  if (!application) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">Application not found</h2>
        </div>
      </div>
    );
  }

  const formData = application.formData || {};

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50 pb-20">
      <Navbar />
      
      <main className="mx-auto w-full max-w-7xl px-8 py-12">
        {/* ── Top Navigation & Actions ── */}
        <div className="mb-12 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div>
            <a href="/admin/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-[#08387F] transition-all mb-4 group">
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
              Back to Registry Index
            </a>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-8 w-1.5 bg-[#08387F] rounded-full"></div>
              <span className="text-[10px] font-black text-[#08387F] uppercase tracking-[0.2em]">Application Intelligence Dossier</span>
            </div>
            <h1 className="font-display text-5xl font-black tracking-tighter" style={{ color: "var(--gov-navy)" }}>
              {formData.step1?.fullName || "Registry Entry"}
            </h1>
            <p className="text-sm font-bold text-slate-400 mt-2 flex items-center gap-2 font-mono">
              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-500 uppercase text-[10px]">Reference</span>
              {application.applicationNumber}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-3 rounded-xl bg-white border-2 border-slate-100 px-8 py-4 text-[11px] font-black text-slate-600 uppercase tracking-widest transition-all hover:bg-slate-50 hover:border-slate-200 active:scale-95 shadow-sm">
              <XCircle size={18} className="text-slate-400" />
              Flag for Correction
            </button>
            <button className="flex items-center gap-3 rounded-xl bg-[#08387F] px-10 py-4 text-[11px] font-black text-white uppercase tracking-[0.15em] transition-all hover:bg-blue-800 hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-900/20">
              <CheckCircle size={18} strokeWidth={3} />
              Verify & Finalize
            </button>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          {/* Main Intelligence Profile */}
          <div className="lg:col-span-8 space-y-10">
            <DetailSection title="Core Identity Indices" icon={<User size={18} />} data={formData.step1} />
            <DetailSection title="Academic History Registry" icon={<GraduationCap size={18} />} data={formData.step4} />
            <DetailSection title="Geospatial & Contact Parameters" icon={<MapPin size={18} />} data={formData.step3} />
            
            <div className="rounded-[2.5rem] bg-white p-10 shadow-2xl shadow-slate-200/50 border border-slate-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#08387F]">
                  <Home size={22} />
                </div>
                <h3 className="font-display text-2xl font-black text-slate-800 tracking-tight">Academic Preferences</h3>
              </div>
              <div className="grid gap-4">
                {[1,2,3,4,5].map(num => (
                  <div key={num} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-50 group hover:border-blue-100 transition-all">
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded bg-white flex items-center justify-center text-[10px] font-black text-slate-300 border border-slate-100 group-hover:text-[#08387F] group-hover:border-blue-100">0{num}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority Index</span>
                    </div>
                    <span className="text-sm font-black text-slate-700 tracking-tight">
                      {formData.step5?.[`branch${num}`] || "UNSPECIFIED"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Evidentiary Documentation Sidebar */}
          <div className="lg:col-span-4 space-y-10">
            <div className="rounded-[2.5rem] bg-[#08387F] p-10 text-white shadow-2xl shadow-blue-900/30 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <h3 className="font-display text-2xl font-black mb-10 relative z-10">Evidentiary Documentation</h3>
              <div className="space-y-4 relative z-10">
                {Object.entries((application as any).formData.step6?.documents || {}).map(([type, url]) => (
                  <a 
                    key={type} 
                    href={url as string} 
                    target="_blank" 
                    className="flex items-center justify-between p-5 bg-white/10 rounded-2xl hover:bg-white/20 transition-all border border-white/10 group/link"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center group-hover/link:bg-white/20 transition-all">
                        <FileText size={18} className="text-blue-100" />
                      </div>
                      <span className="text-[10px] font-black truncate max-w-[150px] uppercase tracking-widest">{type.replace(/_/g, " ")}</span>
                    </div>
                    <ExternalLink size={16} className="text-blue-200 opacity-50 group-hover/link:opacity-100 transition-opacity" />
                  </a>
                ))}
                {(!application.formData.step6?.documents || Object.keys(application.formData.step6.documents).length === 0) && (
                  <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/5 border-dashed">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-300">No Evidence Found</p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[2rem] bg-white p-8 shadow-xl border border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-[#08387F] animate-pulse"></div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</span>
              </div>
              <p className="text-xs font-bold text-slate-600 leading-relaxed italic">
                &quot;Digital credentials and evidentiary documents have been cached and are ready for administrative verification.&quot;
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function DetailSection({ title, icon, data }: { title: string; icon: React.ReactNode; data: any }) {
  if (!data) return null;
  return (
    <div className="rounded-[2.5rem] bg-white p-10 shadow-2xl shadow-slate-200/50 border border-slate-100">
      <div className="flex items-center gap-4 mb-10 border-b border-slate-50 pb-8">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#08387F]">
          {icon}
        </div>
        <h3 className="font-display text-2xl font-black text-slate-800 tracking-tight">{title}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-10">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <dt className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">{key.replace(/([A-Z])/g, ' $1')}</dt>
            <dd className="text-sm font-black text-slate-700 tracking-tight">{value?.toString() || "—"}</dd>
          </div>
        ))}
      </div>
    </div>
  );
}
