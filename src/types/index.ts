export type ApplicationStatus = 
  | "DRAFT" 
  | "SUBMITTED" 
  | "PAID" 
  | "UNDER_REVIEW" 
  | "APPROVED" 
  | "REJECTED" 
  | "EXAM_ELIGIBLE" 
  | "RESULT_PUBLISHED";

export type PaymentStatus =
  | "NOT_STARTED"
  | "PENDING"
  | "FAILED"
  | "SUCCESS";

export interface PortalSettings {
  applicationCloseAt: string;
  correctionCloseAt: string;
  paymentCloseAt: string;
  allowEditsAfterPayment: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  applicationNumber: string;
  createdAt: any;
}

export interface Application {
  id: string;
  userId: string;
  applicationNumber: string;
  status: ApplicationStatus;
  paymentStatus?: PaymentStatus;
  currentStep: number;
  stepsCompleted: number[];
  formData: Record<string, any>;
  documents?: Record<string, string>;
  paymentAttempts?: number;
  lastPaymentOrderId?: string;
  paymentOrderId?: string;
  paymentAmount?: number;
  paymentId?: string;
  paymentCompletedAt?: any;
  paymentVerifiedAt?: any;
  paymentHistory?: Array<{
    orderId: string;
    paymentId?: string;
    amount: number;
    status: PaymentStatus;
    createdAt?: any;
    verifiedAt?: any;
    error?: string;
  }>;
  pdfUrl?: string;
  pdfGeneratedAt?: any;
  rejectionReason?: string;
  createdAt: any;
  updatedAt: any;
}

export interface DocumentMetadata {
  id: string;
  userId: string;
  applicationId: string;
  type: string; // e.g., 'class10_marksheet', 'photo', 'signature'
  fileUrl: string;
  name: string;
  createdAt: any;
}

// Form Data Interfaces for each Step
export interface PersonalDetails {
  fullName: string;
  dob: string;
  gender: string;
  category: string;
  bloodGroup?: string;
  mobile: string;
  aadhaar?: string;
}

export interface ParentDetails {
  fatherName: string;
  fatherOccupation?: string;
  motherName: string;
  motherOccupation?: string;
  guardianName?: string;
  emergencyContact: string;
}

export interface AddressDetails {
  permanentAddress: string;
  permanentCity: string;
  permanentState: string;
  permanentPincode: string;
  sameAsPermanent: boolean;
  correspondenceAddress: string;
  correspondenceCity: string;
  correspondenceState: string;
  correspondencePincode: string;
}

export interface EducationDetails {
  class10Board: string;
  class10Year: string;
  class10Percent: string;
  class12Board: string;
  class12Year: string;
  class12Percent: string;
  jeeMainAppNo?: string;
  jeeMainScore?: string;
  isJEECandidate: boolean;
}

export interface CoursePreferences {
  branch1: string;
  branch2: string;
  branch3: string;
  branch4: string;
  branch5: string;
}

