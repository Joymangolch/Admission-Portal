import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { getApplicationById, finalizePaymentSuccess } from "@/lib/firestore/services";
import { verifyRazorpaySignature } from "@/lib/payment/razorpay";
import { sendEmail } from "@/lib/email/sendgrid";
import { getPaymentEmail } from "@/lib/email/templates";
import { calculateFee } from "@/lib/utils/payment";
import { createPdfDownloadToken, generateApplicationReceiptPdf } from "@/lib/pdf/server";


export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    const body = await request.json();
    const { orderId, paymentId, signature, applicationId } = body;

    if (!applicationId) {
      return NextResponse.json({ success: false, error: "Missing applicationId" }, { status: 400 });
    }

    const application = await getApplicationById(applicationId);
    if (!application) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
    }

    if (application.userId !== decodedToken.uid) {
      return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 });
    }

    if (application.status === "PAID" && application.paymentStatus === "SUCCESS") {
      return NextResponse.json({ success: true, alreadyPaid: true });
    }

    // Handle free applications (IDP)
    if (orderId === "FREE" && !paymentId) {
      const { application: finalizedApplication, isNewlyFinalized } = await finalizePaymentSuccess(applicationId, {
        orderId,
        paymentId: "FREE",
        amount: 0,
      });

      if (!isNewlyFinalized) {
        return NextResponse.json({ success: true, alreadyPaid: true });
      }

      const pdfToken = createPdfDownloadToken(applicationId);
      const { buffer, fileName } = await generateApplicationReceiptPdf(finalizedApplication);

      try {
        const name = finalizedApplication.formData?.step1?.fullName || "Candidate";
        const fee = calculateFee(finalizedApplication);
        const downloadUrl = `/api/application/pdf?applicationId=${applicationId}&token=${pdfToken}`;
        const { subject, html, text } = getPaymentEmail(name, finalizedApplication.applicationNumber, fee, {
          orderId,
          paymentId: "FREE",
          downloadUrl,
        });

        await sendEmail(decodedToken.email!, subject, text, html, {
          attachments: [
            {
              content: buffer.toString("base64"),
              filename: fileName,
              type: "application/pdf",
              disposition: "attachment",
            },
          ],
        });
      } catch (err) {
        console.error("Failed to send payment email:", err);
      }

      return NextResponse.json({ success: true });
    }

    const isValid = verifyRazorpaySignature(orderId, paymentId, signature);

    if (!isValid) {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
    }

    const { application: finalizedApplication, isNewlyFinalized } = await finalizePaymentSuccess(applicationId, {
      orderId,
      paymentId,
      amount: calculateFee(application),
    });

    if (!isNewlyFinalized) {
      return NextResponse.json({ success: true, alreadyPaid: true });
    }

    const pdfToken = createPdfDownloadToken(applicationId);
    const { buffer, fileName } = await generateApplicationReceiptPdf(finalizedApplication);

    // Send payment confirmation email
    try {
      const fee = calculateFee(finalizedApplication);
      const name = finalizedApplication.formData?.step1?.fullName || "Candidate";
      const downloadUrl = `/api/application/pdf?applicationId=${applicationId}&token=${pdfToken}`;
      const { subject, html, text } = getPaymentEmail(name, finalizedApplication.applicationNumber, fee, {
        orderId,
        paymentId,
        downloadUrl,
      });
      await sendEmail(decodedToken.email!, subject, text, html, {
        attachments: [
          {
            content: buffer.toString("base64"),
            filename: fileName,
            type: "application/pdf",
            disposition: "attachment",
          },
        ],
      });
    } catch (err) {
      console.error("Failed to send payment email:", err);
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Payment verify API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
