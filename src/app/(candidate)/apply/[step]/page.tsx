import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase/admin";
import { getApplicationByUserId } from "@/lib/firestore/services";
import { cookies } from "next/headers";
import {
  PersonalDetailsStep,
  ParentDetailsStep,
  AddressDetailsStep,
  EducationDetailsStep,
  CoursePreferencesStep,
  DocumentsStep,
  PreviewStep,
  DeclarationStep,
  PaymentStep,
} from "@/components/forms/steps";
import { Info, CheckCircle2 } from "lucide-react";

/* ── Step metadata ── */
const STEP_META: Record<number, { title: string; subtitle: string; disclaimer: string }> = {
  1: {
    title: "Personal Details",
    subtitle: "Enter your personal identification details as per official documents.",
    disclaimer:
      "Ensure all personal details match exactly with your Aadhaar card and Class 10 certificate. Discrepancies may result in rejection of application.",
  },
  2: {
    title: "Parent / Guardian Details",
    subtitle: "Provide details of your parent or legal guardian.",
    disclaimer:
      "Income certificate (if applicable) should be as per the current financial year. Parent information will be verified during document verification.",
  },
  3: {
    title: "Communication Address",
    subtitle: "Provide your permanent and correspondence addresses.",
    disclaimer:
      "Ensure the PIN code and district are correct. All official communications (admit card, result) will be sent to the correspondence address provided.",
  },
  4: {
    title: "Academic Qualification",
    subtitle: "Enter your Class 10 and Class 12 examination details.",
    disclaimer:
      "Marks entered must match your original mark sheets exactly. Any discrepancy discovered at the time of admission will result in cancellation.",
  },
  5: {
    title: "Course Preferences",
    subtitle: "Select your preferred B.Tech branch(es) in order of priority.",
    disclaimer:
      "Allotment of branch is subject to merit, category, and seat availability. Select all preferences carefully as changes after submission are not allowed.",
  },
  6: {
    title: "Document Upload",
    subtitle: "Upload scanned copies of all required documents.",
    disclaimer:
      "Photographs must be passport-size with white background (max 200 KB, JPEG/PNG). Certificates must be in PDF format (max 500 KB). Illegible or incomplete documents will be rejected.",
  },
  7: {
    title: "Application Preview",
    subtitle: "Review your complete application before final submission.",
    disclaimer:
      "Please verify all details carefully. Once you proceed past this step, you will not be able to edit your application. Click 'Edit' links to correct any information.",
  },
  8: {
    title: "Declaration",
    subtitle: "Read and accept the declaration before submission.",
    disclaimer:
      "By submitting this declaration, you certify that all information provided is true and accurate. False declaration will lead to immediate disqualification.",
  },
  9: {
    title: "Application Fee Payment",
    subtitle: "Pay the non-refundable application processing fee.",
    disclaimer:
      "Application fee is non-refundable under any circumstances. After successful payment, your application will be considered complete. Save the transaction ID for reference.",
  },
};

/* ── Page ── */
export default async function StepPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step: stepStr } = await params;
  const step = parseInt(stepStr);

  if (isNaN(step) || step < 1 || step > 9) {
    redirect("/apply/1");
  }

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
  if (!application) redirect("/candidate/dashboard");

  if (step > application.currentStep && step !== 1) {
    redirect(`/apply/${application.currentStep}`);
  }

  const meta = STEP_META[step];
  const isCompleted = (application.stepsCompleted || []).includes(step);

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
            Application Workflow Sequence
          </span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex-1">
            <h1
              className="text-3xl font-black tracking-tight mb-1"
              style={{ color: "var(--gov-navy)" }}
            >
              {meta.title}
            </h1>
            <p
              className="text-sm"
              style={{ color: "var(--gov-text-secondary)" }}
            >
              {meta.subtitle}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isCompleted && (
              <span
                className="gov-badge gov-badge-blue flex items-center gap-1"
              >
                <CheckCircle2 size={11} strokeWidth={3} aria-hidden="true" />
                Verified
              </span>
            )}
            <span
              className="gov-badge gov-badge-gray"
            >
              Stage 0{step} / 09
            </span>
          </div>
        </div>
      </div>

      {/* ── Form Content ── */}
      <div
        className="gov-card overflow-hidden mb-6"
        id={`step-${step}-form`}
        aria-label={`${meta.title} form`}
      >
        {renderStep(step, application)}
      </div>

      {/* ── Disclaimer ── */}
      <div className="gov-notice gov-notice-info flex items-start gap-3">
        <Info
          size={16}
          className="flex-shrink-0 mt-0.5"
          aria-hidden="true"
          style={{ color: "var(--gov-navy)" }}
        />
        <div>
          <p
            className="text-[10px] font-black uppercase tracking-widest mb-1"
            style={{ color: "var(--gov-navy)" }}
          >
            Administrative Advisory
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--gov-text-secondary)" }}>
            {meta.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Step renderer ── */
function renderStep(step: number, application: any) {
  const data = application.formData?.[`step${step}`] || {};

  switch (step) {
    case 1: return <PersonalDetailsStep applicationId={application.id} initialData={data} />;
    case 2: return <ParentDetailsStep applicationId={application.id} initialData={data} />;
    case 3: return <AddressDetailsStep applicationId={application.id} initialData={data} />;
    case 4: return <EducationDetailsStep applicationId={application.id} initialData={data} />;
    case 5: return <CoursePreferencesStep applicationId={application.id} initialData={data} />;
    case 6: return <DocumentsStep applicationId={application.id} initialData={data} />;
    case 7: return <PreviewStep applicationId={application.id} application={application} />;
    case 8: return <DeclarationStep applicationId={application.id} />;
    case 9: return <PaymentStep applicationId={application.id} application={application} />;
    default:
      return (
        <div className="p-8 text-center text-gray-400 text-sm">
          Step component not found.
        </div>
      );
  }
}
