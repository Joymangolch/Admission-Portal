import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { getApplicationByUserId, recordPaymentAttempt, assertApplicationCanStartPayment } from "@/lib/firestore/services";
import { createRazorpayOrder } from "@/lib/payment/razorpay";
import { calculateFee } from "@/lib/utils/payment";

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
    const { applicationId } = body || {};

    const application = await getApplicationByUserId(uid);
    if (!application) {
      return NextResponse.json({ success: false, error: "Application not found" }, { status: 404 });
    }

    if (applicationId && applicationId !== application.id) {
      return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 });
    }

    await assertApplicationCanStartPayment(application.id);

    const fee = calculateFee(application);
    
    if (fee === 0) {
      return NextResponse.json({ success: true, fee: 0, orderId: "FREE" });
    }

    const order = await createRazorpayOrder(fee, "INR", application.id);
    await recordPaymentAttempt(application.id, {
      orderId: order.id,
      amount: fee,
      status: "PENDING",
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      fee
    });
  } catch (error: any) {
    console.error("Payment create API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
