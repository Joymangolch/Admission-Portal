import crypto from "crypto";
import { jsPDF } from "jspdf";
import { Application } from "@/types";

const PDF_DOWNLOAD_SECRET = process.env.PDF_DOWNLOAD_SECRET || "development-pdf-secret";

export function createPdfDownloadToken(applicationId: string, expiresInMinutes = 60) {
  const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;
  const payload = `${applicationId}.${expiresAt}`;
  const signature = crypto.createHmac("sha256", PDF_DOWNLOAD_SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}.${signature}`).toString("base64url");
}

export function verifyPdfDownloadToken(token: string, applicationId: string) {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [tokenApplicationId, expiresAt, signature] = decoded.split(".");

    if (!tokenApplicationId || !expiresAt || !signature) return false;
    if (tokenApplicationId !== applicationId) return false;

    const expiresAtNumber = Number(expiresAt);
    if (!Number.isFinite(expiresAtNumber) || Date.now() > expiresAtNumber) return false;

    const expectedSignature = crypto
      .createHmac("sha256", PDF_DOWNLOAD_SECRET)
      .update(`${tokenApplicationId}.${expiresAt}`)
      .digest("hex");

    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  } catch {
    return false;
  }
}

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function addWrappedText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number) {
  const lines = doc.splitTextToSize(text, maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * 5;
}

function addSection(doc: jsPDF, title: string, data: Record<string, unknown>, y: number) {
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginBottom = 20;
  const maxWidth = 170;

  if (y > pageHeight - marginBottom) {
    doc.addPage();
    y = 20;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(title, 14, y);
  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  const entries = Object.entries(data || {});
  if (entries.length === 0) {
    doc.text("No data recorded", 14, y);
    return y + 8;
  }

  for (const [key, value] of entries) {
    const line = `${key}: ${formatValue(value)}`;
    y = addWrappedText(doc, line, 14, y, maxWidth) + 2;
    if (y > pageHeight - marginBottom) {
      doc.addPage();
      y = 20;
    }
  }

  return y + 4;
}

export async function generateApplicationReceiptPdf(application: Application) {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 18;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Manipur Technical University", pageWidth / 2, y, { align: "center" });
  y += 8;

  doc.setFontSize(13);
  doc.text("Submitted Application Receipt", pageWidth / 2, y, { align: "center" });
  y += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  y = addSection(doc, "Application Summary", {
    applicationNumber: application.applicationNumber,
    candidateName: application.formData?.step1?.fullName,
    status: application.status,
    paymentStatus: application.paymentStatus,
    paymentAmount: application.paymentAmount ? `₹${application.paymentAmount}` : undefined,
    paymentId: application.paymentId,
    orderId: application.lastPaymentOrderId || application.paymentOrderId,
  }, y);

  y = addSection(doc, "Personal Details", application.formData?.step1 || {}, y);
  y = addSection(doc, "Parent Details", application.formData?.step2 || {}, y);
  y = addSection(doc, "Address Details", application.formData?.step3 || {}, y);
  y = addSection(doc, "Education Details", application.formData?.step4 || {}, y);
  y = addSection(doc, "Course Preferences", application.formData?.step5 || {}, y);
  y = addSection(doc, "Declaration", application.formData?.step8 || {}, y);

  const paymentHistory = application.paymentHistory || [];
  if (paymentHistory.length > 0) {
    y = addSection(doc, "Payment History", {
      latestPayment: paymentHistory[paymentHistory.length - 1],
    }, y);
  }

  const pdfArrayBuffer = doc.output("arraybuffer");
  const buffer = Buffer.from(pdfArrayBuffer);
  const fileName = `${application.applicationNumber || application.id}-application.pdf`;

  return {
    buffer,
    fileName,
  };
}