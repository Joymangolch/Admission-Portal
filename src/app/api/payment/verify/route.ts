import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { updateApplicationStatus, getApplicationById } from "@/lib/firestore/services";
import { verifyRazorpaySignature } from "@/lib/payment/razorpay";
import { sendEmail } from "@/lib/email/sendgrid";
import { getPaymentEmail } from "@/lib/email/templates";
import { calculateFee } from "@/lib/utils/payment";


export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    await adminAuth.verifyIdToken(idToken);

    const body = await request.json();
    const { orderId, paymentId, signature, applicationId } = body;

    // Handle free applications (IDP)
    if (orderId === "FREE" && !paymentId) {
       await updateApplicationStatus(applicationId, "PAID");
       return NextResponse.json({ success: true });
    }

    const isValid = verifyRazorpaySignature(orderId, paymentId, signature);

    if (!isValid) {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
    }

    // Update application status to PAID
    await updateApplicationStatus(applicationId, "PAID");

    // Send payment confirmation email
    try {
      const application = await getApplicationById(applicationId);
      if (application) {
        const decodedToken = await adminAuth.verifyIdToken(idToken);
        const fee = calculateFee(application);
        const name = application.formData?.step1?.fullName || "Candidate";
        const { subject, html } = getPaymentEmail(name, application.applicationNumber, fee);
        await sendEmail(decodedToken.email!, subject, subject, html);
      }
    } catch (err) {
      console.error("Failed to send payment email:", err);
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Payment verify API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
