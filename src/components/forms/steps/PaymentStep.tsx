"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { CreditCard, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import { FormCard, StepActions } from "@/components/ui";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function PaymentStep({
  applicationId,
  application,
}: {
  applicationId: string;
  application: any;
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handlePayment = async () => {
    if (!user) return;
    setIsProcessing(true);
    try {
      const token = await user.getIdToken();
      const createRes = await fetch("/api/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ applicationId }),
      });
      const createData = await createRes.json();
      if (!createData.success) throw new Error(createData.error);

      if (createData.orderId === "FREE") {
        await verifyPayment(token, "FREE", "", "");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: createData.amount,
        currency: createData.currency,
        name: "Manipur Technical University",
        description: `Admission Fee - ${application.applicationNumber}`,
        order_id: createData.orderId,
        handler: async (response: any) => {
          await verifyPayment(
            token,
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature
          );
        },
        prefill: {
          name: application.formData?.step1?.fullName || user.displayName,
          email: user.email,
          contact: application.formData?.step1?.mobile,
        },
        theme: { color: "#08387F" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        toast.error("Payment failed. Please try again.");
        setIsProcessing(false);
      });
      rzp.open();
    } catch (error: any) {
      toast.error(error.message || "Payment initialization failed");
      setIsProcessing(false);
    }
  };

  const verifyPayment = async (
    token: string,
    orderId: string,
    paymentId: string,
    signature: string
  ) => {
    try {
      const verifyRes = await fetch("/api/payment/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId, paymentId, signature, applicationId }),
      });
      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        toast.success("Payment Successful!");
        router.push("/candidate/dashboard");
      } else {
        throw new Error(verifyData.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Payment verification failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const fee = calculateFeeLocally(application);

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Icon Area */}
      <FormCard>
        <div className="flex flex-col items-center text-center py-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-primary mb-4 border border-slate-100">
            <CreditCard size={24} aria-hidden="true" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Application Fee Payment</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Process your admission fee securely via Razorpay. Your data is protected by industrial-grade encryption.
          </p>
        </div>
      </FormCard>
 
      {/* Summary Card */}
      <FormCard title="Payment Summary">
        <div className="flex flex-col divide-y divide-slate-50 overflow-hidden">
          <SummaryRow label="Application Number" value={application.applicationNumber} />
          <SummaryRow label="Candidate Name" value={application.formData?.step1?.fullName} />
          <SummaryRow label="Admission Category" value={application.formData?.step1?.category} />
        </div>
 
        <div className="mt-4 pt-4 flex justify-between items-center border-t border-slate-100">
          <span className="text-[13px] font-bold text-slate-500 uppercase tracking-tight">Payable Amount</span>
          <span className="text-3xl font-black text-primary">₹{fee}</span>
        </div>
      </FormCard>
 
      {/* Notice Area */}
      <FormCard>
        <div className="gov-notice gov-notice-success flex items-start gap-3 p-3">
          <ShieldCheck size={16} className="text-green-600 mt-0.5" aria-hidden="true" />
          <p className="text-[11px] font-bold text-green-700 leading-tight uppercase tracking-tight">
            Secure Transaction: 256-bit SSL Encrypted. MTU does not store sensitive card data.
          </p>
        </div>
      </FormCard>
 
      <StepActions
        onBack={() => router.push("/apply/8")}
        primaryLabel={isProcessing ? "Processing..." : "Complete Payment"}
        onPrimary={handlePayment}
        isLoading={isProcessing}
      />
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) {
  return (
    <div className="flex justify-between items-center">
      <span
        className="text-xs font-bold uppercase tracking-wider"
        style={{ color: "var(--gov-text-muted)" }}
      >
        {label}
      </span>
      <span
        className="text-sm font-semibold"
        style={{ color: "var(--gov-text-primary)" }}
      >
        {value || "—"}
      </span>
    </div>
  );
}

function calculateFeeLocally(application: any) {
  const personal = application.formData?.step1;
  const education = application.formData?.step4;
  if (!personal || !education) return 0;
  const isReserved = ["SC", "ST", "PWD"].includes(personal.category);
  const isIDP = personal.category === "IDP";
  const isJEE = education.isJEECandidate;
  if (isIDP) return 0;
  if (isJEE) return isReserved ? 50 : 100;
  return isReserved ? 200 : 300;
}
