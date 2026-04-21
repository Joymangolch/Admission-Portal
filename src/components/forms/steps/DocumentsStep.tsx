"use client";

import React, { useState } from "react";
import { DocumentUpload } from "@/components/forms/DocumentUpload";
import { saveDocumentsAction } from "@/lib/firestore/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FormCard, StepActions } from "@/components/ui";



const BASE_DOCS = [
  { type: "class10_marksheet", label: "Class X Marksheet" },
  { type: "class12_marksheet", label: "Class XII Marksheet" },
  { type: "passport_photo", label: "Passport Size Photograph" },
  { type: "signature", label: "Specimen Signature" },
];

const CATEGORY_MAP: Record<string, string> = {
  OBC: "OBC Certificate",
  SC: "SC Certificate",
  ST: "ST Certificate",
  PWD: "PWD Certificate",
  IDP: "Internally Displaced Person (IDP) Certificate",
};

export function DocumentsStep({
  applicationId,
  initialData,
  category,
  isJEECandidate,
}: {
  applicationId: string;
  initialData: any;
  category?: string;
  isJEECandidate?: boolean;
}) {
  const router = useRouter();
  const [uploaded, setUploaded] = useState<Record<string, string>>(
    initialData?.documents || {}
  );

  // Dynamically build required docs
  const activeDocs = [...BASE_DOCS];

  if (category && category !== "GEN" && CATEGORY_MAP[category]) {
    activeDocs.push({ type: "category_cert", label: CATEGORY_MAP[category] });
  }

  if (isJEECandidate) {
    activeDocs.push({ type: "jee_scorecard", label: "JEE Main Scorecard" });
  }

  const handleUploadSuccess = (type: string, url: string) => {
    setUploaded((prev) => ({ ...prev, [type]: url }));
  };

  const handleContinue = async () => {
    const missing = activeDocs.filter(
      (doc) => !uploaded[doc.type]
    );
    if (missing.length > 0) {
      toast.error(`Please upload: ${missing.map((m) => m.label).join(", ")}`);
      return;
    }
    try {
      await saveDocumentsAction(applicationId, { documents: uploaded });
      toast.success("Documents saved!");
      router.push("/apply/7");
    } catch (error: any) {
      toast.error(error.message || "Failed to save progress");
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Upload guidelines */}
      <FormCard title="Upload Guidelines" description="Ensuring document validity">
        <div className="gov-notice gov-notice-warn text-xs p-3">
          <ul className="space-y-1 list-disc ml-4 font-medium text-slate-700">
            <li>Documents must be clearly scans of original certificates.</li>
            <li>File formats: PDF, JPG, or PNG. Maximum size: 5 MB per file.</li>
            <li>Ensure the file is upright and readable before uploading.</li>
          </ul>
        </div>
      </FormCard>
 
      <FormCard title="Required Documents">
        <div className="flex flex-col divide-y divide-slate-50">
          {activeDocs.map((doc) => (
            <DocumentUpload
              key={doc.type}
              applicationId={applicationId}
              type={doc.type}
              label={doc.label}
              initialValue={uploaded[doc.type]}
              onUploadSuccess={(url) => handleUploadSuccess(doc.type, url)}
            />
          ))}
        </div>
      </FormCard>
 
      <StepActions
        onBack={() => router.push("/apply/5")}
        primaryLabel="Continue to Preview"
        onPrimary={handleContinue}
      />
    </div>
  );
}
