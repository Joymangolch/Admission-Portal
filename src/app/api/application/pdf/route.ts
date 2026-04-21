import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { getApplicationById } from "@/lib/firestore/services";
import { generateApplicationReceiptPdf, verifyPdfDownloadToken } from "@/lib/pdf/server";

export async function GET(request: NextRequest) {
  try {
    const applicationId = request.nextUrl.searchParams.get("applicationId");
    const token = request.nextUrl.searchParams.get("token");

    if (!applicationId) {
      return NextResponse.json({ success: false, error: "Missing applicationId" }, { status: 400 });
    }

    const application = await getApplicationById(applicationId);
    if (!application) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
    }

    const authHeader = request.headers.get("Authorization");
    let authorized = false;

    if (authHeader?.startsWith("Bearer ")) {
      const idToken = authHeader.split("Bearer ")[1];
      const decodedToken = await adminAuth.verifyIdToken(idToken);
      authorized = decodedToken.uid === application.userId;
    } else if (token) {
      authorized = verifyPdfDownloadToken(token, applicationId);
    }

    if (!authorized) {
      return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 });
    }

    if (application.status !== "PAID" && application.paymentStatus !== "SUCCESS") {
      return NextResponse.json({ success: false, error: "Receipt available only after payment" }, { status: 409 });
    }

    const { buffer, fileName } = await generateApplicationReceiptPdf(application);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error: any) {
    console.error("Application PDF API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}