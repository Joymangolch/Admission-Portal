import { adminAuth } from "@/lib/firebase/admin";
import { getApplicationByUserId } from "@/lib/firestore/services";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { PreviewStep } from "@/components/forms/steps";

export default async function FormPreviewPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) redirect("/login");

  let uid: string;
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    uid = decodedToken.uid;
  } catch {
    redirect("/login");
  }

  const application = await getApplicationByUserId(uid!);
  
  if (!application) {
    redirect("/candidate/dashboard");
  }

  const isFinalized = application.status === "PAID" || application.status === "APPROVED";

  // Security: only allow finalized applications to see this view
  if (!isFinalized) {
    redirect(`/apply/${application.currentStep || 1}`);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="h-5 w-1 rounded-full"
            style={{ background: "var(--gov-navy)" }}
          />
          <span
            className="text-[10px] font-black uppercase tracking-[0.2em]"
            style={{ color: "var(--gov-text-muted)" }}
          >
            Official Submission Record
          </span>
        </div>
        <div className="flex flex-col">
          <h1
            className="text-3xl font-black tracking-tight mb-1"
            style={{ color: "var(--gov-navy)" }}
          >
            Application Preview
          </h1>
          <p
            className="text-sm"
            style={{ color: "var(--gov-text-secondary)" }}
          >
            View-only summary of your submitted admission form for the academic year 2026-27.
          </p>
        </div>
      </div>

      <div className="gov-card overflow-hidden mb-6">
        <PreviewStep
          applicationId={application.id}
          application={application}
          readOnly={true}
        />
      </div>
    </div>
  );
}
