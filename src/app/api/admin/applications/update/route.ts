import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { updateApplicationStatus } from "@/lib/firestore/services";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "neslang.in@gmail.com").split(",");

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    if (!ADMIN_EMAILS.includes(decodedToken.email || "")) {
      return NextResponse.json({ success: false, error: "Access Denied" }, { status: 403 });
    }

    const { applicationId, status } = await request.json();

    if (!applicationId || !status) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    await updateApplicationStatus(applicationId, status);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin status update API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
