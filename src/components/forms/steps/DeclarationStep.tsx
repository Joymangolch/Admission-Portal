"use client";

import React, { useState } from "react";
import { submitApplicationAction } from "@/lib/firestore/actions";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import { FormCard, StepActions } from "@/components/ui";

export function DeclarationStep({
  applicationId,
}: {
  applicationId: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!agreed) {
      toast.error("Please accept the declaration to proceed.");
      return;
    }
    setIsSubmitting(true);
    try {
      await submitApplicationAction(applicationId);
      toast.success("Application submitted successfully!");
      router.push("/apply/9");
    } catch (error: any) {
      toast.error(error.message || "Failed to submit");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Icon Area */}
      <FormCard>
        <div className="flex flex-col items-center text-center py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600 mb-4 border border-green-100">
            <ShieldCheck size={24} aria-hidden="true" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Final Declaration</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Read the following statements carefully before submitting your application. 
            All declarations are mandatory.
          </p>
        </div>
      </FormCard>
 
      {/* Declaration body */}
      <FormCard title="Mandatory Statements">
        <ol className="flex flex-col divide-y divide-slate-50">
          {[
            "I hereby declare that the information provided in this application is true and complete to the best of my knowledge and belief.",
            "I understand that if any information is found to be false or incorrect at any stage, my candidature/admission may be cancelled without any notice.",
            "I agree to abide by the rules and regulations of Manipur Technical University as amended from time to time.",
            "I understand that the application fee is non-refundable."
          ].map((text, idx) => (
            <li key={idx} className="flex gap-3 py-3 items-start animate-fade-in group hover:bg-slate-50/50 transition-colors px-2 rounded">
              <span className="font-black text-primary text-[11px] leading-tight mt-0.5">0{idx + 1}.</span>
              <p className="text-[13px] font-semibold text-slate-600 leading-relaxed">{text}</p>
            </li>
          ))}
        </ol>
 
        {/* Agreement checkbox */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <label
            className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
              agreed ? "bg-primary/5 border-primary/20" : "bg-slate-50 border-slate-100 hover:border-slate-200"
            }`}
          >
            <input
              type="checkbox"
              id="declaration"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary h-5 w-5"
              style={{ accentColor: "var(--gov-navy)" }}
            />
            <span className="text-[13px] font-bold text-slate-700 leading-tight">
              I agree to the above declaration and confirm that all details provided in this form are correct and verified.
            </span>
          </label>
        </div>
      </FormCard>
 
      <StepActions
        onBack={() => router.push("/apply/7")}
        primaryLabel="Submit & Proceed to Payment"
        onPrimary={handleSubmit}
        isLoading={isSubmitting}
        disabled={!agreed}
      />
    </div>
  );
}
