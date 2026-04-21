import { Application, EducationDetails, PersonalDetails } from "@/types";

export function calculateFee(application: Application) {
  const personal = application.formData?.step1 as PersonalDetails;
  const education = application.formData?.step4 as EducationDetails;
  
  if (!personal || !education) return 0;
  
  const isReserved = ["SC", "ST", "PWD"].includes(personal.category);
  const isIDP = personal.category === "IDP";
  const isJEE = education.isJEECandidate;
  
  if (isIDP) return 0;
  
  if (isJEE) {
    return isReserved ? 50 : 100;
  } else {
    return isReserved ? 200 : 300;
  }
}
