"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { saveEducationDetailsAction } from "@/lib/firestore/actions";
import { useRouter } from "next/navigation";
import { Loader2, ChevronRight, Info } from "lucide-react";
import { toast } from "react-hot-toast";
import { FormField, FormCard, FormGrid, StepActions, StatusBadge } from "@/components/ui";

const schema = z.object({
  class10Board: z.string().min(2, "Board name is required"),
  class10Year: z.string().length(4, "Year must be 4 digits"),
  class10Percent: z.string().min(1, "Percentage is required"),
  class12Board: z.string().min(2, "Board name is required"),
  class12Year: z.string().length(4, "Year must be 4 digits"),
  class12Percent: z.string().min(1, "Percentage is required"),
  jeeMainAppNo: z.string().optional(),
  jeeMainScore: z.string().optional(),
  isJEECandidate: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export function EducationDetailsStep({
  applicationId,
  initialData,
}: {
  applicationId: string;
  initialData: any;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || { isJEECandidate: false },
  });

  const isJEECandidate = watch("isJEECandidate");

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);
    try {
      await saveEducationDetailsAction(applicationId, data);
      toast.success("Progress saved!");
      router.push("/apply/5");
    } catch (error: any) {
      toast.error(error.message || "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4 p-4">
      {/* Class X */}
      <FormCard title="Class X Details">
        <FormGrid cols={3}>
          <FormField
            label="Board Name"
            required
            error={errors.class10Board?.message}
          >
            <input
              {...register("class10Board")}
              className="gov-input"
              placeholder="e.g. CBSE, BOSEM"
            />
          </FormField>
          <FormField
            label="Passing Year"
            required
            error={errors.class10Year?.message}
          >
            <input
              {...register("class10Year")}
              className="gov-input"
              placeholder="YYYY"
              maxLength={4}
              inputMode="numeric"
            />
          </FormField>
          <FormField
            label="Percentage / CGPA"
            required
            error={errors.class10Percent?.message}
          >
            <input
              {...register("class10Percent")}
              className="gov-input"
              placeholder="e.g. 85.00"
            />
          </FormField>
        </FormGrid>
      </FormCard>
 
      {/* Class XII */}
      <FormCard title="Class XII Details">
        <FormGrid cols={3}>
          <FormField
            label="Board Name"
            required
            error={errors.class12Board?.message}
          >
            <input
              {...register("class12Board")}
              className="gov-input"
              placeholder="e.g. CBSE, COHSEM"
            />
          </FormField>
          <FormField
            label="Passing Year"
            required
            error={errors.class12Year?.message}
          >
            <input
              {...register("class12Year")}
              className="gov-input"
              placeholder="YYYY"
              maxLength={4}
              inputMode="numeric"
            />
          </FormField>
          <FormField
            label="Percentage / CGPA"
            required
            error={errors.class12Percent?.message}
          >
            <input
              {...register("class12Percent")}
              className="gov-input"
              placeholder="e.g. 88.00"
            />
          </FormField>
        </FormGrid>
      </FormCard>
 
      {/* Admission Pathway */}
      <FormCard title="Admission Pathway">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Pathway Options</p>
          <StatusBadge variant="blue">
            <Info size={10} aria-hidden="true" />
            JEE candidates skip entrance exam
          </StatusBadge>
        </div>
 
        {/* JEE toggle card */}
        <div
          className="gov-card p-4 transition-colors"
          style={{
            background: isJEECandidate
              ? "var(--gov-navy-xlight)"
              : "var(--gov-bg)",
            borderColor: isJEECandidate
              ? "var(--gov-navy)"
              : "var(--gov-gray-border)",
          }}
        >
          <label
            htmlFor="isJEECandidate"
            className="flex items-start gap-4 cursor-pointer"
          >
            <input
              type="checkbox"
              id="isJEECandidate"
              {...register("isJEECandidate")}
              className="mt-1 h-5 w-5"
              style={{ accentColor: "var(--gov-navy)" }}
            />
            <div>
              <p
                className="text-sm font-bold"
                style={{ color: "var(--gov-text-primary)" }}
              >
                I have a valid JEE Main 2026 Score
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--gov-text-secondary)" }}
              >
                Entrance exam exemption will be applied upon verification
              </p>
            </div>
          </label>
 
          {isJEECandidate && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <FormGrid>
                <FormField
                  label="JEE Main Application Number"
                  error={errors.jeeMainAppNo?.message}
                >
                  <input
                    {...register("jeeMainAppNo")}
                    className="gov-input"
                    placeholder="Enter JEE application number"
                  />
                </FormField>
                <FormField
                  label="JEE Main Score (Percentile)"
                  error={errors.jeeMainScore?.message}
                >
                  <input
                    {...register("jeeMainScore")}
                    className="gov-input"
                    placeholder="e.g. 95.82"
                    inputMode="decimal"
                  />
                </FormField>
              </FormGrid>
            </div>
          )}
        </div>
      </FormCard>
 
      <StepActions
        onBack={() => router.push("/apply/3")}
        isLoading={isSaving}
      />
    </form>
  );
}
