import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { saveApplicationStep } from "@/lib/firestore/services";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    if (!decodedToken) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    const { applicationId, step, data } = await request.json();

    if (!applicationId || !step || !data) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    await saveApplicationStep(applicationId, step, data);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Save step API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
