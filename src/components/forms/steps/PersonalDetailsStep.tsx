"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { savePersonalDetailsAction } from "@/lib/firestore/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FormField, FormCard, FormGrid, StepActions } from "@/components/ui";

const schema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  category: z.string().min(1, "Category is required"),
  bloodGroup: z.string().optional(),
  mobile: z.string().length(10, "Mobile number must be 10 digits"),
  aadhaar: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function PersonalDetailsStep({
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
      await savePersonalDetailsAction(applicationId, data);
      toast.success("Progress saved!");
      router.push("/apply/2");
    } catch (error: any) {
      toast.error(error.message || "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4 p-4">
      <FormCard title="Personal Information">
        <FormGrid>
          <FormField
            label="Full Name (as per Class X)"
            required
            error={errors.fullName?.message}
            className="sm:col-span-2"
          >
            <input
              {...register("fullName")}
              className="gov-input"
              placeholder="Enter your full name"
              autoComplete="name"
            />
          </FormField>

          <FormField label="Date of Birth" required error={errors.dob?.message}>
            <input {...register("dob")} type="date" className="gov-input" />
          </FormField>

          <FormField label="Gender" required error={errors.gender?.message}>
            <select {...register("gender")} className="gov-input">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </FormField>

          <FormField label="Category" required error={errors.category?.message}>
            <select {...register("category")} className="gov-input">
              <option value="">Select Category</option>
              <option value="GEN">General</option>
              <option value="OBC">OBC</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
              <option value="PWD">PWD</option>
              <option value="IDP">Internally Displaced Person (IDP)</option>
            </select>
          </FormField>

          <FormField label="Blood Group" error={errors.bloodGroup?.message}>
            <select {...register("bloodGroup")} className="gov-input">
              <option value="">Select</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </FormField>

          <FormField
            label="Mobile Number"
            required
            error={errors.mobile?.message}
          >
            <input
              {...register("mobile")}
              className="gov-input"
              placeholder="10-digit number"
              maxLength={10}
              inputMode="numeric"
              autoComplete="tel"
            />
          </FormField>

          <FormField
            label="Aadhaar Number (Optional)"
            error={errors.aadhaar?.message}
            className="sm:col-span-2"
          >
            <input
              {...register("aadhaar")}
              className="gov-input"
              placeholder="Enter 12-digit Aadhaar number"
              maxLength={12}
              inputMode="numeric"
            />
          </FormField>
        </FormGrid>

        <StepActions isLoading={isSaving} />
      </FormCard>
    </form>
  );
}
