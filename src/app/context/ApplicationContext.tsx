import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ApplicationStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';

export interface PersonalDetails {
  fullName: string;
  dob: string;
  gender: string;
  category: string;
  email: string;
  mobile: string;
}

export interface ParentDetails {
  fatherName: string;
  motherName: string;
  guardianMobile: string;
  guardianEmail: string;
}

export interface Address {
  present: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  permanent: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export interface AcademicDetails {
  class10: {
    board: string;
    marks: string;
    percentage: string;
    year: string;
  };
  class12: {
    board: string;
    marks: string;
    percentage: string;
    year: string;
  };
}

export interface JEEDetails {
  hasJEE: boolean;
  rollNumber?: string;
  rank?: string;
  percentile?: string;
}

export interface CoursePreferences {
  priority1: string;
  priority2: string;
  priority3: string;
  priority4: string;
  priority5: string;
}

export interface Declaration {
  agreed: boolean;
  signature?: string;
}

export interface ApplicationData {
  currentStep: number;
  status: ApplicationStatus;
  personalDetails: Partial<PersonalDetails>;
  parentDetails: Partial<ParentDetails>;
  address: Partial<Address>;
  academicDetails: Partial<AcademicDetails>;
  jeeDetails: Partial<JEEDetails>;
  coursePreferences: Partial<CoursePreferences>;
  declaration: Partial<Declaration>;
  documents: {
    photo?: File | null;
    signature?: File | null;
    class10Marksheet?: File | null;
    class12Marksheet?: File | null;
    jeeScorecard?: File | null;
    category?: File | null;
  };
}

interface ApplicationContextType {
  application: ApplicationData;
  updateApplication: (data: Partial<ApplicationData>) => void;
  saveStep: (step: number, data: any) => void;
  submitApplication: () => void;
  resetApplication: () => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

const initialApplication: ApplicationData = {
  currentStep: 0,
  status: 'draft',
  personalDetails: {},
  parentDetails: {},
  address: { present: {}, permanent: {} } as any,
  academicDetails: { class10: {}, class12: {} } as any,
  jeeDetails: { hasJEE: false },
  coursePreferences: {},
  declaration: { agreed: false },
  documents: {}
};

export function ApplicationProvider({ children }: { children: ReactNode }) {
  const [application, setApplication] = useState<ApplicationData>(initialApplication);

  const updateApplication = (data: Partial<ApplicationData>) => {
    setApplication(prev => ({ ...prev, ...data }));
  };

  const saveStep = (step: number, data: any) => {
    setApplication(prev => ({
      ...prev,
      currentStep: step,
      ...data
    }));
  };

  const submitApplication = () => {
    setApplication(prev => ({
      ...prev,
      status: 'submitted'
    }));
  };

  const resetApplication = () => {
    setApplication(initialApplication);
  };

  return (
    <ApplicationContext.Provider
      value={{ application, updateApplication, saveStep, submitApplication, resetApplication }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}

export function useApplication() {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error('useApplication must be used within an ApplicationProvider');
  }
  return context;
}
