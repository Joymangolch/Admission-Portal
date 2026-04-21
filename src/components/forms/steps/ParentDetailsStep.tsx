"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { saveParentDetailsAction } from "@/lib/firestore/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FormField, FormCard, FormGrid, StepActions } from "@/components/ui";

const schema = z.object({
  fatherName: z.string().min(3, "Father's name is required"),
  fatherOccupation: z.string().optional(),
  motherName: z.string().min(3, "Mother's name is required"),
  motherOccupation: z.string().optional(),
  guardianName: z.string().optional(),
  emergencyContact: z
    .string()
    .length(10, "Emergency contact must be 10 digits"),
});

type FormData = z.infer<typeof schema>;

export function ParentDetailsStep({
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
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);
    try {
      await saveParentDetailsAction(applicationId, data);
      toast.success("Progress saved!");
      router.push("/apply/3");
    } catch (error: any) {
      toast.error(error.message || "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4 p-4">
      <FormCard title="Parent / Guardian Information">
        <FormGrid>
          <FormField
            label="Father's Full Name"
            required
            error={errors.fatherName?.message}
          >
            <input
              {...register("fatherName")}
              className="gov-input"
              placeholder="Enter father's name"
            />
          </FormField>

          <FormField
            label="Father's Occupation"
            error={errors.fatherOccupation?.message}
          >
            <input
              {...register("fatherOccupation")}
              className="gov-input"
              placeholder="e.g. Farmer, Engineer, etc."
            />
          </FormField>

          <FormField
            label="Mother's Full Name"
            required
            error={errors.motherName?.message}
          >
            <input
              {...register("motherName")}
              className="gov-input"
              placeholder="Enter mother's name"
            />
          </FormField>

          <FormField
            label="Mother's Occupation"
            error={errors.motherOccupation?.message}
          >
            <input
              {...register("motherOccupation")}
              className="gov-input"
              placeholder="e.g. Homemaker, Teacher, etc."
            />
          </FormField>

          <FormField
            label="Guardian Name (Optional)"
            error={errors.guardianName?.message}
          >
            <input
              {...register("guardianName")}
              className="gov-input"
              placeholder="Enter guardian's name"
            />
          </FormField>

          <FormField
            label="Emergency Contact Number"
            required
            error={errors.emergencyContact?.message}
          >
            <input
              {...register("emergencyContact")}
              className="gov-input"
              placeholder="10-digit number"
              maxLength={10}
              inputMode="numeric"
            />
          </FormField>
        </FormGrid>

        <StepActions
          onBack={() => router.push("/apply/1")}
          isLoading={isSaving}
        />
      </FormCard>
    </form>
  );
}
