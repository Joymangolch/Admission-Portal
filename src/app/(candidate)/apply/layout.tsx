import React from "react";
import { adminAuth } from "@/lib/firebase/admin";
import { getApplicationByUserId } from "@/lib/firestore/services";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { MTUHeader } from "@/components/Navbar";
import { ApplicationShell } from "@/components/forms/steps/ApplicationShell";
 
export default async function ApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
  if (!application) redirect("/candidate/dashboard");
 
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "var(--gov-bg)" }}>
      {/* MTU Header with candidate nav */}
      <MTUHeader 
        role="candidate" 
        applicationNumber={application.applicationNumber} 
        status={application.status || "DRAFT"} 
      />
 
      {/* Body: Sidebar + Content wrapped in Client Shell */}
      <ApplicationShell application={application}>
        {children}
      </ApplicationShell>
    </div>
  );
}
