import Razorpay from "razorpay";
import crypto from "crypto";

export const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function createRazorpayOrder(amount: number, currency: string = "INR", receipt: string) {
  const options = {
    amount: amount * 100, // amount in the smallest currency unit
    currency,
    receipt,
  };
  return await razorpay.orders.create(options);
}

export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string) {
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
    .update(orderId + "|" + paymentId)
    .digest("hex");
    
  return expectedSignature === signature;
}

