export const DEPARTMENTS = [
  { id: "cse", name: "Computer Science & Engineering" },
  { id: "ece", name: "Electronics & Communication" },
  { id: "me", name: "Mechanical Engineering" },
  { id: "bt", name: "Biotechnology" },
  { id: "sh", name: "Science & Humanities" },
];

export const COURSES = [
  { id: "btech_cse", deptId: "cse", name: "B.Tech Computer Science" },
  { id: "btech_ai", deptId: "cse", name: "B.Tech AI & Machine Learning" },
  { id: "btech_ece", deptId: "ece", name: "B.Tech Electronics" },
  { id: "btech_me", deptId: "me", name: "B.Tech Mechanical" },
  { id: "mtech_cse", deptId: "cse", name: "M.Tech Computer Science" },
  { id: "msc_ph", deptId: "sh", name: "M.Sc. Physics" },
];

export const REQUIRED_DOCUMENTS = [
  { id: "photo", name: "Passport Size Photograph", required: true },
  { id: "marksheet_10", name: "10th Standard Marksheet", required: true },
  { id: "marksheet_12", name: "12th Standard Marksheet", required: true },
  { id: "ug_degree", name: "UG Degree Certificate", required: false },
];

export const ADMISSION_YEAR = 2026;
export const APPLICATION_FEE = 1000; // in INR
