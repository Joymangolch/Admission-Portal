"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { saveCoursePreferencesAction } from "@/lib/firestore/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FormField, FormCard, FormGrid, StepActions } from "@/components/ui";

const branches = [
  "Civil Engineering",
  "Computer Science and Engineering (CSE)",
  "Electrical Engineering",
  "Electronics and Communication Engineering (ECE)",
  "Mechanical Engineering",
];

const schema = z.object({
  branch1: z.string().min(1, "Preference 1 is required"),
  branch2: z.string().min(1, "Preference 2 is required"),
  branch3: z.string().min(1, "Preference 3 is required"),
  branch4: z.string().min(1, "Preference 4 is required"),
  branch5: z.string().min(1, "Preference 5 is required"),
});

type FormData = z.infer<typeof schema>;

export function CoursePreferencesStep({
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
    defaultValues: initialData,
  });

  const selected = [
    watch("branch1"),
    watch("branch2"),
    watch("branch3"),
    watch("branch4"),
    watch("branch5"),
  ];

  const onSubmit = async (data: FormData) => {
    const unique = new Set(Object.values(data));
    if (unique.size !== 5) {
      toast.error("Please select a different branch for each preference.");
      return;
    }
    setIsSaving(true);
    try {
      await saveCoursePreferencesAction(applicationId, data);
      toast.success("Progress saved!");
      router.push("/apply/6");
    } catch (error: any) {
      toast.error(error.message || "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4 p-4">
      <FormCard title="Course Preferences">
        {/* Instruction notice */}
        <div className="gov-notice gov-notice-info text-xs p-3">
          <p>
            <strong>Preference Selection:</strong> Select preferred branches in order of priority (1 is highest). Each preference must be different.
          </p>
        </div>
 
        <FormGrid cols={2}>
          {([1, 2, 3, 4, 5] as const).map((num) => (
            <div key={num} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
              {/* Rank badge */}
              <div
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded bg-primary text-xs font-bold text-white"
                aria-label={`Priority ${num}`}
              >
                {num}
              </div>
 
              <FormField
                label={`Preference ${num}`}
                required
                error={(errors as any)[`branch${num}`]?.message}
                className="flex-1"
              >
                <select
                  {...register(`branch${num}` as any)}
                  className="gov-input"
                >
                  <option value="">Select Branch</option>
                  {branches.map((branch) => (
                    <option
                      key={branch}
                      value={branch}
                      disabled={
                        selected.includes(branch) &&
                        selected.indexOf(branch) !== num - 1
                      }
                    >
                      {branch}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
          ))}
        </FormGrid>
 
        <StepActions
          onBack={() => router.push("/apply/4")}
          isLoading={isSaving}
        />
      </FormCard>
    </form>
  );
}
