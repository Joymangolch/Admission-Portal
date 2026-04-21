"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { saveAddressDetailsAction } from "@/lib/firestore/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FormField, FormCard, FormGrid, StepActions } from "@/components/ui";

const schema = z.object({
  permanentAddress: z.string().min(5, "Address is too short"),
  permanentCity: z.string().min(2, "City is required"),
  permanentState: z.string().min(2, "State is required"),
  permanentPincode: z.string().length(6, "Pincode must be 6 digits"),
  sameAsPermanent: z.boolean(),
  correspondenceAddress: z.string().min(5, "Address is too short"),
  correspondenceCity: z.string().min(2, "City is required"),
  correspondenceState: z.string().min(2, "State is required"),
  correspondencePincode: z.string().length(6, "Pincode must be 6 digits"),
});

type FormData = z.infer<typeof schema>;

export function AddressDetailsStep({
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
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || { sameAsPermanent: false },
  });

  const sameAsPermanent = watch("sameAsPermanent");
  const permanentAddress = watch("permanentAddress");
  const permanentCity = watch("permanentCity");
  const permanentState = watch("permanentState");
  const permanentPincode = watch("permanentPincode");

  useEffect(() => {
    if (sameAsPermanent) {
      setValue("correspondenceAddress", permanentAddress);
      setValue("correspondenceCity", permanentCity);
      setValue("correspondenceState", permanentState);
      setValue("correspondencePincode", permanentPincode);
    }
  }, [
    sameAsPermanent,
    permanentAddress,
    permanentCity,
    permanentState,
    permanentPincode,
    setValue,
  ]);

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);
    try {
      await saveAddressDetailsAction(applicationId, data);
      toast.success("Progress saved!");
      router.push("/apply/4");
    } catch (error: any) {
      toast.error(error.message || "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4 p-4">
      {/* Permanent Address */}
      <FormCard title="Permanent Address">
        <FormGrid>
          <FormField
            label="Full Address (House/Street/Locality)"
            required
            error={errors.permanentAddress?.message}
            className="sm:col-span-2"
          >
            <textarea
              {...register("permanentAddress")}
              className="gov-input h-auto min-h-[80px]"
              rows={2}
              placeholder="Enter your complete permanent address"
            />
          </FormField>
          <FormField label="City / Town" error={errors.permanentCity?.message}>
            <input
              {...register("permanentCity")}
              className="gov-input"
              placeholder="e.g. Imphal"
            />
          </FormField>
          <FormField label="State" error={errors.permanentState?.message}>
            <input
              {...register("permanentState")}
              className="gov-input"
              placeholder="e.g. Manipur"
            />
          </FormField>
          <FormField label="Pincode" required error={errors.permanentPincode?.message}>
            <input
              {...register("permanentPincode")}
              className="gov-input"
              placeholder="6-digit pincode"
              maxLength={6}
              inputMode="numeric"
            />
          </FormField>
        </FormGrid>
 
        {/* Same-as-permanent toggle */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3">
          <div className="relative flex items-center">
            <input
              type="checkbox"
              id="sameAsPermanent"
              {...register("sameAsPermanent")}
              className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-slate-300 checked:bg-[#08387F] checked:border-[#08387F] transition-all"
            />
            <svg
              className="absolute h-3 w-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <label
            htmlFor="sameAsPermanent"
            className="text-xs font-bold cursor-pointer select-none uppercase tracking-tight text-slate-600"
          >
            Correspondence address is same as permanent address
          </label>
        </div>
      </FormCard>
 
      {/* Correspondence Address */}
      {!sameAsPermanent && (
        <FormCard title="Correspondence Address" className="animate-in fade-in slide-in-from-top-2 duration-300">
          <FormGrid>
            <FormField
              label="Full Address"
              required
              error={errors.correspondenceAddress?.message}
              className="sm:col-span-2"
            >
              <textarea
                {...register("correspondenceAddress")}
                className="gov-input h-auto min-h-[80px]"
                rows={2}
                placeholder="Enter your correspondence address"
              />
            </FormField>
            <FormField
              label="City / Town"
              error={errors.correspondenceCity?.message}
            >
              <input
                {...register("correspondenceCity")}
                className="gov-input"
                placeholder="e.g. Imphal"
              />
            </FormField>
            <FormField
              label="State"
              error={errors.correspondenceState?.message}
            >
              <input
                {...register("correspondenceState")}
                className="gov-input"
                placeholder="e.g. Manipur"
              />
            </FormField>
            <FormField
              label="Pincode"
              required
              error={errors.correspondencePincode?.message}
            >
              <input
                {...register("correspondencePincode")}
                className="gov-input"
                placeholder="6-digit pincode"
                maxLength={6}
                inputMode="numeric"
              />
            </FormField>
          </FormGrid>
        </FormCard>
      )}
 
      <StepActions
        onBack={() => router.push("/apply/2")}
        isLoading={isSaving}
      />
    </form>
  );
}
