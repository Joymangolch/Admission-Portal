"use server";

import { revalidatePath } from "next/cache";
import { 
  saveApplicationStep, 
  updateApplicationStatus, 
  getApplicationById 
} from "./services";
import { z } from "zod";
import { adminAuth } from "@/lib/firebase/admin";
import { sendEmail } from "@/lib/email/sendgrid";
import { getSubmissionEmail } from "@/lib/email/templates";
import { cookies } from "next/headers";


// Schemas for each Step
const PersonalDetailsSchema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  category: z.string().min(1, "Category is required"),
  bloodGroup: z.string().optional(),
  mobile: z.string().length(10, "Mobile number must be 10 digits"),
  aadhaar: z.string().optional(),
});

const ParentDetailsSchema = z.object({
  fatherName: z.string().min(3, "Father's name is required"),
  fatherOccupation: z.string().optional(),
  motherName: z.string().min(3, "Mother's name is required"),
  motherOccupation: z.string().optional(),
  guardianName: z.string().optional(),
  emergencyContact: z.string().length(10, "Emergency contact must be 10 digits"),
});

const AddressDetailsSchema = z.object({
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

const EducationDetailsSchema = z.object({
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

const CoursePreferencesSchema = z.object({
  branch1: z.string().min(1, "Preference 1 is required"),
  branch2: z.string().min(1, "Preference 2 is required"),
  branch3: z.string().min(1, "Preference 3 is required"),
  branch4: z.string().min(1, "Preference 4 is required"),
  branch5: z.string().min(1, "Preference 5 is required"),
});

const DocumentsSchema = z.object({
  documents: z.record(z.string(), z.string().url({ message: "Invalid document URL" })),
});



// Server Actions
export async function savePersonalDetailsAction(applicationId: string, data: any) {
  const validatedData = PersonalDetailsSchema.parse(data);
  await saveApplicationStep(applicationId, 1, validatedData);
  revalidatePath("/(candidate)/apply", "layout");
  return { success: true };
}

export async function saveParentDetailsAction(applicationId: string, data: any) {
  const validatedData = ParentDetailsSchema.parse(data);
  await saveApplicationStep(applicationId, 2, validatedData);
  revalidatePath("/(candidate)/apply", "layout");
  return { success: true };
}

export async function saveAddressDetailsAction(applicationId: string, data: any) {
  const validatedData = AddressDetailsSchema.parse(data);
  await saveApplicationStep(applicationId, 3, validatedData);
  revalidatePath("/(candidate)/apply", "layout");
  return { success: true };
}

export async function saveEducationDetailsAction(applicationId: string, data: any) {
  const validatedData = EducationDetailsSchema.parse(data);
  await saveApplicationStep(applicationId, 4, validatedData);
  revalidatePath("/(candidate)/apply", "layout");
  return { success: true };
}

export async function saveCoursePreferencesAction(applicationId: string, data: any) {
  const validatedData = CoursePreferencesSchema.parse(data);
  await saveApplicationStep(applicationId, 5, validatedData);
  revalidatePath("/(candidate)/apply", "layout");
  return { success: true };
}

export async function saveDocumentsAction(applicationId: string, data: any) {
  const validatedData = DocumentsSchema.parse(data);
  await saveApplicationStep(applicationId, 6, validatedData);
  revalidatePath("/(candidate)/apply", "layout");
  return { success: true };
}
 
export async function savePreviewAction(applicationId: string) {
  // Mark step 7 as viewed. This will increment currentStep to 8 via services.saveApplicationStep
  await saveApplicationStep(applicationId, 7, { viewed: true });
  revalidatePath("/(candidate)/apply", "layout");
  return { success: true };
}


export async function submitApplicationAction(applicationId: string) {
  const application = await getApplicationById(applicationId);
  if (!application) throw new Error("Application not found");
  
  // Save step 8 (Declaration) data implicitly as empty/complete
  await saveApplicationStep(applicationId, 8, { agreed: true, submittedAt: new Date().toISOString() });
  await updateApplicationStatus(applicationId, "SUBMITTED");
  
  // Get user email for notification
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  if (token) {
    try {
      const decodedToken = await adminAuth.verifyIdToken(token);
      const name = application.formData?.step1?.fullName || "Candidate";
      const { subject, html } = getSubmissionEmail(name, application.applicationNumber);
      await sendEmail(decodedToken.email!, subject, subject, html);
    } catch (err) {
      console.error("Failed to send submission email:", err);
    }
  }

  revalidatePath("/(candidate)/apply", "layout");
  revalidatePath("/candidate/dashboard");
  return { success: true };
}


