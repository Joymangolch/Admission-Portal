import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { ensureUserAndApplication } from "@/lib/firestore/services";

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

    const { uid, email, name } = decodedToken;
    
    // Ensure user and application exist
    const data = await ensureUserAndApplication(uid, email || "", name || "Candidate");

    return NextResponse.json({
      success: true,
      data: {
        user: data.user,
        application: data.application
      }
    });
  } catch (error: any) {
    console.error("Auth verify API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
