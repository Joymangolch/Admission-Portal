import { adminDb } from "@/lib/firebase/admin";
import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { UserProfile, Application, ApplicationStatus } from "@/types";

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
      currentStep: 1,
      stepsCompleted: [],
      formData: {},
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
      currentStep: 1,
      stepsCompleted: [],
      formData: {},
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

