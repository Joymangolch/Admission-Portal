import { adminDb } from "@/lib/firebase/admin";
import { Application, PortalSettings } from "@/types";

export const DEFAULT_PORTAL_SETTINGS: PortalSettings = {
  applicationCloseAt: "2026-05-15T23:59:59+05:30",
  correctionCloseAt: "2026-06-07T23:59:59+05:30",
  paymentCloseAt: "2026-06-07T23:59:59+05:30",
  allowEditsAfterPayment: false,
};

function asDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function getPortalSettings(): Promise<PortalSettings> {
  const settingsRef = adminDb.collection("internal").doc("portalSettings");
  const snapshot = await settingsRef.get();

  if (!snapshot.exists) {
    return DEFAULT_PORTAL_SETTINGS;
  }

  const data = snapshot.data() as Partial<PortalSettings> | undefined;
  return {
    ...DEFAULT_PORTAL_SETTINGS,
    ...data,
  };
}

export function isApplicationPaid(application: Application) {
  return application.status === "PAID" || application.paymentStatus === "SUCCESS";
}

export function canEditApplication(application: Application, settings: PortalSettings, now = new Date()) {
  if (isApplicationPaid(application)) return false;

  const deadline = application.status === "SUBMITTED"
    ? asDate(settings.correctionCloseAt)
    : asDate(settings.applicationCloseAt);

  if (!deadline) return true;
  return now.getTime() <= deadline.getTime();
}

export function canStartPayment(application: Application, settings: PortalSettings, now = new Date()) {
  if (isApplicationPaid(application)) return false;

  const deadline = asDate(settings.paymentCloseAt);
  if (!deadline) return true;
  return now.getTime() <= deadline.getTime();
}

export function isSettingsConsistent(settings: PortalSettings) {
  const applicationCloseAt = asDate(settings.applicationCloseAt);
  const correctionCloseAt = asDate(settings.correctionCloseAt);
  const paymentCloseAt = asDate(settings.paymentCloseAt);

  return Boolean(applicationCloseAt && correctionCloseAt && paymentCloseAt);
}