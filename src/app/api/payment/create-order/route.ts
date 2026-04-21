import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/payment/razorpay";
import { adminAuth } from "@/lib/firebase/admin";

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { applicationId, amount = 1000 } = await request.json(); // Default 1000 INR

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_${applicationId}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      }
    });
  } catch (error: any) {
    console.error("Create order API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
