export const getSubmissionEmail = (name: string, appNo: string) => ({
  subject: `Application Submitted - ${appNo} | MTU Admissions`,
  html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #334155;">
      <h2 style="color: #2563eb;">Admission Application Submitted</h2>
      <p>Dear ${name},</p>
      <p>Your admission application for Manipur Technical University for the 2026-27 cycle has been successfully submitted.</p>
      <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0;">
        <p style="margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8;">Application Number</p>
        <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: 800; color: #0f172a;">${appNo}</p>
      </div>
      <p><strong>Next Step:</strong> Please log in to the portal to complete the application fee payment. Your application will only be processed after successful payment.</p>
      <p>Regards,<br>Registrar, MTU</p>
    </div>
  `
});

export const getPaymentEmail = (
  name: string,
  appNo: string,
  amount: number,
  options?: {
    orderId?: string;
    paymentId?: string;
    downloadUrl?: string;
  }
) => {
  const subject = `Payment Successful - ${appNo} | MTU Admissions`;
  const text = [
    `Dear ${name},`,
    `We have received your application fee of ₹${amount} for the MTU Admission Cycle 2026-27.`,
    options?.orderId ? `Order ID: ${options.orderId}` : null,
    options?.paymentId ? `Payment ID: ${options.paymentId}` : null,
    options?.downloadUrl ? `Download receipt: ${options.downloadUrl}` : null,
    `Regards,`,
    `Admissions Office, MTU`,
  ].filter(Boolean).join("\n");

  return {
    subject,
    text,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #334155;">
        <h2 style="color: #16a34a;">Application Fee Paid Successfully</h2>
        <p>Dear ${name},</p>
        <p>We have received your application fee of <strong>₹${amount}</strong> for the MTU Admission Cycle 2026-27.</p>
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #dcfce7;">
          <p style="margin: 0; font-size: 14px; font-weight: bold; color: #166534;">Payment Status: SUCCESS</p>
          ${options?.orderId ? `<p style="margin: 8px 0 0 0; font-size: 12px; color: #166534;">Order ID: ${options.orderId}</p>` : ""}
          ${options?.paymentId ? `<p style="margin: 4px 0 0 0; font-size: 12px; color: #166534;">Payment ID: ${options.paymentId}</p>` : ""}
        </div>
        <p>You can download the finalized application PDF from the dashboard.</p>
        ${options?.downloadUrl ? `<p><a href="${options.downloadUrl}" style="color: #2563eb; font-weight: bold;">Secure download link</a></p>` : ""}
        <p>Regards,<br>Admissions Office, MTU</p>
      </div>
    `,
  };
};
