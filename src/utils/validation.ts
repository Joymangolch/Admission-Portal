// Comprehensive form validation utilities matching PRD requirements

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Mobile number validation (Indian format)
export const validateMobileNumber = (mobile: string): boolean => {
  const indianMobileRegex = /^[6-9]\d{9}$/;
  return indianMobileRegex.test(mobile.replace(/\D/g, ''));
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Date of birth validation
export const validateDateOfBirth = (dob: string): boolean => {
  const date = new Date(dob);
  const age = new Date().getFullYear() - date.getFullYear();
  // Candidates should be at least 17 years old (Class XII pass requirement)
  return age >= 17 && age <= 80;
};

// PIN code validation (Indian format)
export const validatePinCode = (pin: string): boolean => {
  const pinRegex = /^[1-9]\d{5}$/;
  return pinRegex.test(pin.replace(/\D/g, ''));
};

// Percentage validation (0-100)
export const validatePercentage = (percentage: string): boolean => {
  const num = parseFloat(percentage);
  return !isNaN(num) && num >= 0 && num <= 100;
};

// JEE Score validation (0-300)
export const validateJEEScore = (score: string): boolean => {
  const num = parseFloat(score);
  return !isNaN(num) && num >= 0 && num <= 300;
};

// JEE Rank validation (1-1400000 approx)
export const validateJEERank = (rank: string): boolean => {
  const num = parseInt(rank);
  return !isNaN(num) && num > 0 && num <= 1500000;
};

// Percentile validation (0-100)
export const validatePercentile = (percentile: string): boolean => {
  const num = parseFloat(percentile);
  return !isNaN(num) && num >= 0 && num <= 100;
};

// OTP validation (6 digits)
export const validateOTP = (otp: string): boolean => {
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
};

// File type validation
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

// File size validation (in MB)
export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxBytes;
};

// Personal Details validation
export const validatePersonalDetails = (data: any): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!data.fullName?.trim()) {
    errors.push({ field: 'fullName', message: 'Full name is required' });
  } else if (data.fullName.length < 3) {
    errors.push({ field: 'fullName', message: 'Full name must be at least 3 characters' });
  }

  if (!data.dob) {
    errors.push({ field: 'dob', message: 'Date of birth is required' });
  } else if (!validateDateOfBirth(data.dob)) {
    errors.push({ field: 'dob', message: 'You must be at least 17 years old' });
  }

  if (!data.gender) {
    errors.push({ field: 'gender', message: 'Gender is required' });
  }

  if (!data.category) {
    errors.push({ field: 'category', message: 'Category is required' });
  }

  if (!data.email) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!validateEmail(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  if (!data.mobile) {
    errors.push({ field: 'mobile', message: 'Mobile number is required' });
  } else if (!validateMobileNumber(data.mobile)) {
    errors.push({ field: 'mobile', message: 'Invalid mobile number' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Academic Details validation
export const validateAcademicDetails = (data: any): ValidationResult => {
  const errors: ValidationError[] = [];

  const validateBoard = (board: string, subject: string) => {
    if (!board?.trim()) {
      errors.push({ field: `${subject}Board`, message: `${subject} board is required` });
      return false;
    }
    return true;
  };

  const validateMarks = (marks: string, totalMarks: string, subject: string) => {
    if (!marks) {
      errors.push({ field: `${subject}Marks`, message: `${subject} marks are required` });
      return false;
    }
    const marksNum = parseFloat(marks);
    const totalNum = parseFloat(totalMarks);
    if (isNaN(marksNum) || marksNum < 0 || marksNum > totalNum) {
      errors.push({ field: `${subject}Marks`, message: `Invalid marks for ${subject}` });
      return false;
    }
    return true;
  };

  // Class 10 validation
  if (!validateBoard(data.class10?.board, 'Class 10')) return { isValid: false, errors };
  if (!data.class10?.year) {
    errors.push({ field: 'class10Year', message: 'Class 10 year is required' });
  }

  // Class 12 validation (required)
  if (!validateBoard(data.class12?.board, 'Class 12')) return { isValid: false, errors };
  if (!data.class12?.year) {
    errors.push({ field: 'class12Year', message: 'Class 12 year is required' });
  }

  // Validate class 12 percentage for eligibility
  if (data.class12?.percentage) {
    if (!validatePercentage(data.class12.percentage)) {
      errors.push({ field: 'class12Percentage', message: 'Invalid percentage' });
    } else if (parseFloat(data.class12.percentage) < 50) {
      errors.push({ field: 'class12Percentage', message: 'Minimum 50% required in Class 12' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Course Preferences validation
export const validateCoursePreferences = (data: any): ValidationResult => {
  const errors: ValidationError[] = [];
  const courses = ['priority1', 'priority2', 'priority3', 'priority4', 'priority5'];
  const selectedCourses = new Set<string>();

  for (const course of courses) {
    if (!data[course]) {
      errors.push({ field: course, message: `${course} is required` });
    } else {
      if (selectedCourses.has(data[course])) {
        errors.push({ field: course, message: 'Duplicate course selection not allowed' });
      }
      selectedCourses.add(data[course]);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Declaration validation
export const validateDeclaration = (data: any): ValidationResult => {
  const errors: ValidationError[] = [];

  if (!data.agreed) {
    errors.push({ field: 'agreed', message: 'You must accept the declaration' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Address validation
export const validateAddress = (data: any): ValidationResult => {
  const errors: ValidationError[] = [];

  const validateAddressBlock = (block: any, prefix: string) => {
    if (!block?.address?.trim()) {
      errors.push({ field: `${prefix}Address`, message: `Address is required` });
    }
    if (!block?.city?.trim()) {
      errors.push({ field: `${prefix}City`, message: `City is required` });
    }
    if (!block?.state?.trim()) {
      errors.push({ field: `${prefix}State`, message: `State is required` });
    }
    if (!block?.pincode) {
      errors.push({ field: `${prefix}Pincode`, message: `PIN code is required` });
    } else if (!validatePinCode(block.pincode)) {
      errors.push({ field: `${prefix}Pincode`, message: `Invalid PIN code` });
    }
  };

  validateAddressBlock(data.present, 'present');
  if (!data.sameAsPresent) {
    validateAddressBlock(data.permanent, 'permanent');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Document validation
export const validateDocuments = (documents: any[]): ValidationResult => {
  const errors: ValidationError[] = [];
  const requiredDocs = ['photo', 'signature', 'class10Marksheet', 'class12Marksheet'];

  for (const doc of requiredDocs) {
    const document = documents.find(d => d.id === doc);
    if (!document?.file) {
      errors.push({ field: doc, message: `${doc} is required` });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Complete application validation
export const validateCompleteApplication = (applicationData: any): ValidationResult => {
  const allErrors: ValidationError[] = [];

  const personalResult = validatePersonalDetails(applicationData.personalDetails);
  const addressResult = validateAddress(applicationData.address);
  const academicResult = validateAcademicDetails(applicationData.academicDetails);
  const preferencesResult = validateCoursePreferences(applicationData.coursePreferences);
  const declarationResult = validateDeclaration(applicationData.declaration);

  allErrors.push(
    ...personalResult.errors,
    ...addressResult.errors,
    ...academicResult.errors,
    ...preferencesResult.errors,
    ...declarationResult.errors
  );

  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};
