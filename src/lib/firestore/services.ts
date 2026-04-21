import { adminDb } from "@/lib/firebase/admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { UserProfile, Application, ApplicationStatus, PaymentStatus } from "@/types";
import {
  canEditApplication,
  canStartPayment,
  getPortalSettings,
  isApplicationPaid,
} from "@/lib/portal/settings";

/**
 * Helper to serialize Firestore data for Client Components
 * Converts Timestamps to ISO strings recursively
 */
function serialize<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  // Handle Firestore Timestamp
  if (obj instanceof Timestamp) {
    return obj.toDate().toISOString() as any;
  }

  // Handle Array
  if (Array.isArray(obj)) {
    return obj.map(serialize) as any;
  }

  // Handle Object
  const serializedObj: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      serializedObj[key] = serialize((obj as any)[key]);
    }
  }
  return serializedObj;
}


/**
 * Generates a unique application number in the format MTU-2026-XXXXXX
 */
export async function generateApplicationNumber() {
  const metadataRef = adminDb.doc("internal/metadata");
  
  return await adminDb.runTransaction(async (transaction: any) => {
    const metadataDoc = await transaction.get(metadataRef);
    let nextNumber = 1;
    
    if (metadataDoc.exists) {
      nextNumber = metadataDoc.data()?.lastApplicationNumber + 1;
    }
    
    transaction.set(metadataRef, { lastApplicationNumber: nextNumber }, { merge: true });
    
    const formattedNumber = nextNumber.toString().padStart(6, "0");
    return `MTU-2026-${formattedNumber}`;
  });
}

/**
 * Creates or gets a user profile and initializes an application if it doesn't exist
 */
export async function ensureUserAndApplication(uid: string, email: string, name: string) {
  const userRef = adminDb.collection("users").doc(uid);
  const userSnap = await userRef.get();
  
  if (!userSnap.exists) {
    // New user, create profile and app
    const applicationNumber = await generateApplicationNumber();
    
    const userProfile: UserProfile = {
      uid,
      email,
      name,
      applicationNumber,
      createdAt: FieldValue.serverTimestamp(),
    };
    
    await userRef.set(userProfile);
    
    const appRef = adminDb.collection("applications").doc();
    const application: Application = {
      id: appRef.id,
      userId: uid,
      applicationNumber,
      status: "DRAFT",
      paymentStatus: "NOT_STARTED",
      currentStep: 1,
      stepsCompleted: [],
      formData: {},
      paymentAttempts: 0,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };
    
    await appRef.set(application);
    return { user: userProfile, application };
  }
  
  // Existing user, find application
  const querySnapshot = await adminDb.collection("applications")
    .where("userId", "==", uid)
    .get();
  
  let application = querySnapshot.docs[0]?.data() as Application;
  
  if (!application) {
    // If user exists but has no application for some reason, create one
    const applicationNumber = (userSnap.data() as UserProfile).applicationNumber || await generateApplicationNumber();
    const appRef = adminDb.collection("applications").doc();
    application = {
      id: appRef.id,
      userId: uid,
      applicationNumber,
      status: "DRAFT",
      paymentStatus: "NOT_STARTED",
      currentStep: 1,
      stepsCompleted: [],
      formData: {},
      paymentAttempts: 0,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    } as Application;
    
    await appRef.set(application);
  } else {
    // Ensure ID is included (it should be, but let's be safe)
    application.id = querySnapshot.docs[0].id;
  }
  
  return serialize({ user: userSnap.data() as UserProfile, application });
}

/**
 * Gets an application by ID
 */
export async function getApplicationById(applicationId: string) {
  const appRef = adminDb.collection("applications").doc(applicationId);
  const appSnap = await appRef.get();
  
  if (!appSnap.exists) return null;
  return serialize({ id: appSnap.id, ...appSnap.data() } as Application);
}

/**
 * Gets an application by User ID
 */
export async function getApplicationByUserId(userId: string) {
  const querySnapshot = await adminDb.collection("applications")
    .where("userId", "==", userId)
    .limit(1)
    .get();
  
  if (querySnapshot.empty) return null;
  const doc = querySnapshot.docs[0];
  return serialize({ id: doc.id, ...doc.data() } as Application);
}

/**
 * Saves a step's data to the application
 */
export async function saveApplicationStep(applicationId: string, step: number, data: any) {
  const appRef = adminDb.collection("applications").doc(applicationId);
  const appSnap = await appRef.get();
  
  if (!appSnap.exists) throw new Error("Application not found");
  
  const currentApp = appSnap.data() as Application;
  const portalSettings = await getPortalSettings();

  if (!canEditApplication(currentApp, portalSettings)) {
    throw new Error("Application is locked and can no longer be edited");
  }

  const stepsCompleted = Array.from(new Set([...(currentApp.stepsCompleted || []), step]));
  
  await appRef.update({
    [`formData.step${step}`]: data,
    currentStep: Math.max(currentApp.currentStep, step + 1), // Advance if completing current or future step
    stepsCompleted,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

/**
 * Updates application status
 */
export async function updateApplicationStatus(applicationId: string, status: ApplicationStatus) {
  const appRef = adminDb.collection("applications").doc(applicationId);
  await appRef.update({
    status,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function assertApplicationCanStartPayment(applicationId: string) {
  const app = await getApplicationById(applicationId);
  if (!app) {
    throw new Error("Application not found");
  }

  const portalSettings = await getPortalSettings();
  if (!canStartPayment(app, portalSettings)) {
    throw new Error("Payment window has closed or the application is already paid");
  }

  return app;
}

/**
 * Helper to remove undefined values from payment history entries before Firestore storage
 * Firestore does not allow undefined values in documents
 */
function cleanPaymentHistoryEntry(entry: any) {
  return Object.fromEntries(
    Object.entries(entry).filter(([_, value]) => value !== undefined)
  );
}

export async function recordPaymentAttempt(applicationId: string, payment: {
  orderId: string;
  amount: number;
  status: PaymentStatus;
  paymentId?: string;
  error?: string;
}) {
  const appRef = adminDb.collection("applications").doc(applicationId);
  const appSnap = await appRef.get();

  if (!appSnap.exists) throw new Error("Application not found");

  const currentApp = appSnap.data() as Application;
  const paymentHistory = [
    ...(currentApp.paymentHistory || []),
    cleanPaymentHistoryEntry({
      orderId: payment.orderId,
      paymentId: payment.paymentId,
      amount: payment.amount,
      status: payment.status,
      error: payment.error,
      createdAt: new Date(),
    }),
  ];

  await appRef.update({
    paymentStatus: payment.status,
    lastPaymentOrderId: payment.orderId,
    paymentOrderId: payment.orderId,
    paymentAmount: payment.amount,
    paymentAttempts: (currentApp.paymentAttempts || 0) + 1,
    paymentHistory,
    updatedAt: FieldValue.serverTimestamp(),
  });
}

export async function finalizePaymentSuccess(applicationId: string, payment: {
  orderId: string;
  paymentId: string;
  amount: number;
}) {
  const appRef = adminDb.collection("applications").doc(applicationId);
  return await adminDb.runTransaction(async (transaction: any) => {
    const appSnap = await transaction.get(appRef);

    if (!appSnap.exists) throw new Error("Application not found");

    const currentApp = appSnap.data() as Application;
    if (isApplicationPaid(currentApp) && currentApp.paymentId === payment.paymentId) {
      return {
        application: serialize({ ...currentApp, id: appSnap.id } as Application),
        isNewlyFinalized: false,
      };
    }

    const paymentHistory = [
      ...(currentApp.paymentHistory || []),
      cleanPaymentHistoryEntry({
        orderId: payment.orderId,
        paymentId: payment.paymentId,
        amount: payment.amount,
        status: "SUCCESS" as PaymentStatus,
        createdAt: new Date(),
        verifiedAt: new Date(),
      }),
    ];

    const updatedApplication = {
      ...currentApp,
      status: "PAID" as ApplicationStatus,
      paymentStatus: "SUCCESS" as PaymentStatus,
      paymentId: payment.paymentId,
      lastPaymentOrderId: payment.orderId,
      paymentOrderId: payment.orderId,
      paymentAmount: payment.amount,
      paymentCompletedAt: FieldValue.serverTimestamp(),
      paymentVerifiedAt: FieldValue.serverTimestamp(),
      pdfUrl: "/api/application/pdf",
      pdfGeneratedAt: FieldValue.serverTimestamp(),
      paymentHistory,
      updatedAt: FieldValue.serverTimestamp(),
    } as Application;

    transaction.update(appRef, {
      status: updatedApplication.status,
      paymentStatus: updatedApplication.paymentStatus,
      paymentId: updatedApplication.paymentId,
      lastPaymentOrderId: updatedApplication.lastPaymentOrderId,
      paymentOrderId: updatedApplication.paymentOrderId,
      paymentAmount: updatedApplication.paymentAmount,
      paymentCompletedAt: updatedApplication.paymentCompletedAt,
      paymentVerifiedAt: updatedApplication.paymentVerifiedAt,
      pdfUrl: updatedApplication.pdfUrl,
      pdfGeneratedAt: updatedApplication.pdfGeneratedAt,
      paymentHistory: updatedApplication.paymentHistory,
      updatedAt: updatedApplication.updatedAt,
    });

    return {
      application: serialize({ ...updatedApplication, id: appSnap.id } as Application),
      isNewlyFinalized: true,
    };
  });
}

export async function markPaymentFailure(applicationId: string, payment: {
  orderId: string;
  amount: number;
  error?: string;
}) {
  await recordPaymentAttempt(applicationId, {
    orderId: payment.orderId,
    amount: payment.amount,
    status: "FAILED",
    error: payment.error,
  });
}

