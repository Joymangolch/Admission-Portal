import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const body = await request.json();
    const { applicationId, type, fileUrl, fileName } = body;

    if (!applicationId || !type || !fileUrl) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    // Save document metadata to Firestore
    const docRef = adminDb.collection("documents").doc();
    await docRef.set({
      id: docRef.id,
      userId: uid,
      applicationId,
      type,
      fileUrl,
      name: fileName,
      createdAt: FieldValue.serverTimestamp(),
    });

    // Update application stepsCompleted and currentStep if needed
    const appRef = adminDb.collection("applications").doc(applicationId);
    await appRef.update({
      [`documents.${type}`]: fileUrl,
      updatedAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error: any) {
    console.error("Document upload API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
