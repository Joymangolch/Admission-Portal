import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { Application } from "@/types";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "neslang.in@gmail.com").split(",");

export async function GET(request: NextRequest) {
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

    const snapshot = await adminDb.collection("applications")
      .orderBy("updatedAt", "desc")
      .get();
      
    const applications = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    })) as Application[];

    return NextResponse.json({ success: true, applications });
  } catch (error: any) {
    console.error("Admin applications API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
