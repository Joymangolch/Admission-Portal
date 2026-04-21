"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { savePreviewAction } from "@/lib/firestore/actions";
import { toast } from "react-hot-toast";
import { Printer, AlertTriangle } from "lucide-react";
import { FormCard, StepActions, FormGrid } from "@/components/ui";
 
export function PreviewStep({
  applicationId,
  application,
}: {
  applicationId: string;
  application: any;
}) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const formData = application.formData || {};
 
  const handleContinue = async () => {
    setIsSaving(true);
    try {
      await savePreviewAction(applicationId);
      router.push("/apply/8");
    } catch (error: any) {
      toast.error("Failed to advance progress");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <FormCard>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle
              size={20}
              className="flex-shrink-0 mt-0.5 text-primary"
              aria-hidden="true"
            />
            <div>
              <p className="font-bold text-sm uppercase tracking-tight text-primary">
                Review Your Application
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Review all information before final submission. Changes are not allowed after payment.
              </p>
            </div>
          </div>
          <button
            onClick={() => window.print()}
            className="gov-btn-secondary text-[11px] h-8 px-3 font-bold uppercase tracking-tight hidden lg:flex"
            aria-label="Print review"
          >
            <Printer size={14} aria-hidden="true" />
            Print Preview
          </button>
        </div>
      </FormCard>
 
      {/* Section-by-section preview */}
      <div className="flex flex-col gap-3">
        <PreviewSection
          title="Personal Details"
          step={1}
          data={formData.step1}
          router={router}
        />
        <PreviewSection
          title="Parent Details"
          step={2}
          data={formData.step2}
          router={router}
        />
        <PreviewSection
          title="Address Details"
          step={3}
          data={formData.step3}
          router={router}
        />
        <PreviewSection
          title="Academic Qualification"
          step={4}
          data={formData.step4}
          router={router}
        />
        <PreviewSection
          title="Course Preferences"
          step={5}
          data={formData.step5}
          router={router}
        />
        <PreviewSection
          title="Uploaded Documents"
          step={6}
          data={formData.step6?.documents}
          isDocuments
          router={router}
        />
      </div>
 
      <StepActions
        onBack={() => router.push("/apply/6")}
        primaryLabel="Continue to Declaration"
        onPrimary={handleContinue}
        isLoading={isSaving}
      />
    </div>
  );
}
 
/* ── Preview section card ── */
function PreviewSection({
  title,
  step,
  data,
  isDocuments,
  router,
}: {
  title: string;
  step: number;
  data: any;
  isDocuments?: boolean;
  router: ReturnType<typeof useRouter>;
}) {
  if (!data) return null;
 
  return (
    <FormCard 
      variant="preview" 
      title={title}
      className="relative"
    >
      <button
        type="button"
        onClick={() => router.push(`/apply/${step}`)}
        className="absolute top-4 right-5 text-[10px] font-black text-primary hover:underline uppercase tracking-widest"
      >
        Edit
      </button>
 
      <FormGrid cols={3}>
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <dt className="text-[10px] font-bold uppercase tracking-tight text-slate-400 mb-0.5">
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/_/g, " ")
                .trim()}
            </dt>
            <dd className="text-[13px] font-bold text-slate-700 leading-tight">
              {isDocuments ? (
                <a
                  href={value as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary transition-all"
                >
                  View Document
                </a>
              ) : (
                value?.toString() || "N/A"
              )}
            </dd>
          </div>
        ))}
      </FormGrid>
    </FormCard>
  );
}
