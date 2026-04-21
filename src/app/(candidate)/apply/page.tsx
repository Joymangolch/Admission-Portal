import { adminAuth } from "@/lib/firebase/admin";
import { getApplicationByUserId } from "@/lib/firestore/services";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ApplyPage() {
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
  
  if (!application) {
    redirect("/candidate/dashboard");
  }

  const isFinalized = application.status === "PAID" || application.status === "APPROVED";

  if (isFinalized) {
    redirect("/apply/form-preview");
  }

  // Redirect to the current step or step 1
  redirect(`/apply/${application.currentStep || 1}`);
}
