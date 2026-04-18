import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useApplication } from '../../context/ApplicationContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Textarea } from '../../components/ui/textarea';
import { Progress } from '../../components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Check, ChevronLeft, ChevronRight, X, Plus } from 'lucide-react';
import { toast } from 'sonner';

const TOTAL_STEPS = 4;

// Branch options as per specification
const BRANCHES = [
  'Civil Engineering',
  'Computer Science and Engineering',
  'Electrical Engineering',
  'Electronics and Communication Engineering',
  'Mechanical Engineering'
];

// Category options
const CATEGORIES = [
  { value: 'GEN', label: 'GEN' },
  { value: 'OBC', label: 'OBC' },
  { value: 'SC', label: 'SC' },
  { value: 'ST', label: 'ST' },
  { value: 'PWD', label: 'PWD' },
  { value: 'TG', label: 'Transgender / Third Gender' },
  { value: 'IDP', label: 'IDP' }
];

interface SubjectRow {
  id: string;
  subject: string;
  fullMarks: string;
  marksObtained: string;
}

interface AcademicTable {
  board: string;
  yearOfPassing: string;
  subjects: SubjectRow[];
}

interface AcademicDetails {
  class10: AcademicTable;
  class12: AcademicTable;
}

interface PageComponentProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  addSubjectRow: (tableType: 'class10' | 'class12') => void;
  removeSubjectRow: (tableType: 'class10' | 'class12', id: string) => void;
  updateSubjectRow: (tableType: 'class10' | 'class12', id: string, key: keyof SubjectRow, value: string) => void;
  formType: 'JEE' | 'NON-JEE';
}

export function ApplicationForm() {
  const { application, saveStep, submitApplication } = useApplication();
  const [currentStep, setCurrentStep] = useState(application.currentStep);
  const [formType, setFormType] = useState<'JEE' | 'NON-JEE'>('JEE');
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    // PAGE 1: Personal Details
    firstName: application.personalDetails.firstName || '',
    middleName: application.personalDetails.middleName || '',
    lastName: application.personalDetails.lastName || '',
    dob: application.personalDetails.dob || '',
    gender: application.personalDetails.gender || '',
    mobile: application.personalDetails.mobile || '',
    email: application.personalDetails.email || '',
    nationality: application.personalDetails.nationality || '',
    category: application.personalDetails.category || '',

    // PAGE 1: Parent Details
    fatherFirstName: application.parentDetails.fatherFirstName || '',
    fatherMiddleName: application.parentDetails.fatherMiddleName || '',
    fatherLastName: application.parentDetails.fatherLastName || '',
    motherFirstName: application.parentDetails.motherFirstName || '',
    motherMiddleName: application.parentDetails.motherMiddleName || '',
    motherLastName: application.parentDetails.motherLastName || '',

    // PAGE 2: Guardian Contact
    guardianMobile: application.parentDetails.guardianMobile || '',
    guardianEmail: application.parentDetails.guardianEmail || '',

    // PAGE 2: Present Address
    presentAddress: application.address.present?.address || '',
    presentCountry: application.address.present?.country || 'India',
    presentState: application.address.present?.state || '',
    presentDistrict: application.address.present?.district || '',
    presentCity: application.address.present?.city || '',
    presentLocality: application.address.present?.locality || '',
    presentPincode: application.address.present?.pincode || '',

    // PAGE 2: Permanent Address
    permanentAddress: application.address.permanent?.address || '',
    permanentCountry: application.address.permanent?.country || 'India',
    permanentState: application.address.permanent?.state || '',
    permanentDistrict: application.address.permanent?.district || '',
    permanentCity: application.address.permanent?.city || '',
    permanentLocality: application.address.permanent?.locality || '',
    permanentPincode: application.address.permanent?.pincode || '',
    sameAsPresent: false,

    // PAGE 2: Class X (table data)
    class10Board: application.academicDetails.class10?.board || '',
    class10YearOfPassing: application.academicDetails.class10?.year || '',
    class10Subjects: (application.academicDetails.class10?.subjects || []) as SubjectRow[],

    // PAGE 3: Class XII (table data)
    class12Board: application.academicDetails.class12?.board || '',
    class12YearOfPassing: application.academicDetails.class12?.year || '',
    class12Subjects: (application.academicDetails.class12?.subjects || []) as SubjectRow[],

    // PAGE 3: JEE Details (JEE only)
    jeeScore: application.jeeDetails?.jeeScore || '',

    // PAGE 3: Branch Preferences
    priority1: application.coursePreferences.priority1 || '',
    priority2: application.coursePreferences.priority2 || '',
    priority3: application.coursePreferences.priority3 || '',
    priority4: application.coursePreferences.priority4 || '',
    priority5: application.coursePreferences.priority5 || '',

    // PAGE 4: Documents
    class10Certificate: null as File | null,
    class10MarkSheet: null as File | null,
    class12MarkSheet: null as File | null,
    categoryCertificate: null as File | null,
    jeeScoreCard: null as File | null,

    // PAGE 4: Declaration
    place: '',
    declarationDate: '',
    signatureUpload: null as File | null,
    declarationAgreed: false,

    // Photo Upload
    photoUpload: null as File | null,
    photoPreview: ''
  });

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto-fill permanent address if same as present
      if (field === 'sameAsPresent' && value === true) {
        return {
          ...updated,
          permanentAddress: prev.presentAddress,
          permanentCountry: prev.presentCountry,
          permanentState: prev.presentState,
          permanentDistrict: prev.presentDistrict,
          permanentCity: prev.presentCity,
          permanentLocality: prev.presentLocality,
          permanentPincode: prev.presentPincode
        };
      }
      return updated;
    });
  }, []);

  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500000) {
        toast.error('Photo size should be less than 500 KB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          photoUpload: file,
          photoPreview: reader.result as string
        }));
        toast.success('Photo uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const addSubjectRow = useCallback((tableType: 'class10' | 'class12') => {
    const field = tableType === 'class10' ? 'class10Subjects' : 'class12Subjects';
    setFormData((prev) => ({
      ...prev,
      [field]: [
        ...prev[field as keyof typeof prev],
        {
          id: Date.now().toString(),
          subject: '',
          fullMarks: '',
          marksObtained: ''
        }
      ]
    }));
  }, []);

  const removeSubjectRow = useCallback((tableType: 'class10' | 'class12', id: string) => {
    const field = tableType === 'class10' ? 'class10Subjects' : 'class12Subjects';
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as SubjectRow[]).filter((row) => row.id !== id)
    }));
  }, []);

  const updateSubjectRow = useCallback((tableType: 'class10' | 'class12', id: string, key: keyof SubjectRow, value: string) => {
    const field = tableType === 'class10' ? 'class10Subjects' : 'class12Subjects';
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as SubjectRow[]).map((row) =>
        row.id === id ? { ...row, [key]: value } : row
      )
    }));
  }, []);

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        // Page 1 validation
        return !!(
          formData.firstName &&
          formData.lastName &&
          formData.dob &&
          formData.gender &&
          formData.mobile &&
          formData.category &&
          formData.fatherFirstName &&
          formData.fatherLastName &&
          formData.motherFirstName &&
          formData.motherLastName &&
          formData.nationality
        );
      case 1:
        // Page 2 validation
        return !!(
          formData.presentAddress &&
          formData.presentCity &&
          formData.presentLocality &&
          formData.presentPincode &&
          formData.permanentAddress &&
          formData.permanentLocality &&
          formData.permanentPincode &&
          formData.class10Board &&
          formData.class10YearOfPassing &&
          formData.class10Subjects.length > 0
        );
      case 2:
        // Page 3 validation
        return !!(
          formData.class12Board &&
          formData.class12YearOfPassing &&
          formData.class12Subjects.length > 0 &&
          (formType === 'NON-JEE' || formData.jeeScore) &&
          formData.priority1 &&
          formData.priority2 &&
          formData.priority3 &&
          formData.priority4 &&
          formData.priority5
        );
      case 3:
        // Page 4 validation
        return !!(
          formData.declarationAgreed &&
          formData.place &&
          formData.declarationDate &&
          formData.signatureUpload
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      toast.error('Please fill all required fields');
      return;
    }

    const stepData = getStepData();
    saveStep(currentStep + 1, stepData);

    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
      toast.success('Progress saved');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepData = () => {
    switch (currentStep) {
      case 0:
        return {
          personalDetails: {
            firstName: formData.firstName,
            middleName: formData.middleName,
            lastName: formData.lastName,
            dob: formData.dob,
            gender: formData.gender,
            mobile: formData.mobile,
            email: formData.email,
            nationality: formData.nationality,
            category: formData.category
          },
          parentDetails: {
            fatherFirstName: formData.fatherFirstName,
            fatherMiddleName: formData.fatherMiddleName,
            fatherLastName: formData.fatherLastName,
            motherFirstName: formData.motherFirstName,
            motherMiddleName: formData.motherMiddleName,
            motherLastName: formData.motherLastName
          }
        };
      case 1:
        return {
          parentDetails: {
            guardianMobile: formData.guardianMobile,
            guardianEmail: formData.guardianEmail
          },
          address: {
            present: {
              address: formData.presentAddress,
              country: formData.presentCountry,
              state: formData.presentState,
              district: formData.presentDistrict,
              city: formData.presentCity,
              locality: formData.presentLocality,
              pincode: formData.presentPincode
            },
            permanent: {
              address: formData.permanentAddress,
              country: formData.permanentCountry,
              state: formData.permanentState,
              district: formData.permanentDistrict,
              city: formData.permanentCity,
              locality: formData.permanentLocality,
              pincode: formData.permanentPincode
            }
          },
          academicDetails: {
            class10: {
              board: formData.class10Board,
              year: formData.class10YearOfPassing,
              subjects: formData.class10Subjects
            }
          }
        };
      case 2:
        return {
          academicDetails: {
            class12: {
              board: formData.class12Board,
              year: formData.class12YearOfPassing,
              subjects: formData.class12Subjects
            }
          },
          jeeDetails: formType === 'JEE' ? { jeeScore: formData.jeeScore } : {},
          coursePreferences: {
            priority1: formData.priority1,
            priority2: formData.priority2,
            priority3: formData.priority3,
            priority4: formData.priority4,
            priority5: formData.priority5
          }
        };
      case 3:
        return {
          documents: {
            class10Certificate: formData.class10Certificate,
            class10MarkSheet: formData.class10MarkSheet,
            class12MarkSheet: formData.class12MarkSheet,
            categoryCertificate: formData.categoryCertificate,
            jeeScoreCard: formType === 'JEE' ? formData.jeeScoreCard : null
          },
          declaration: {
            place: formData.place,
            date: formData.declarationDate,
            signature: formData.signatureUpload,
            agreed: formData.declarationAgreed
          }
        };
      default:
        return {};
    }
  };

  const handleSubmit = () => {
    if (!validateStep(3)) {
      toast.error('Please complete all required fields');
      return;
    }

    const stepData = getStepData();
    saveStep(TOTAL_STEPS, stepData);
    submitApplication();
    toast.success('Application submitted successfully!');
    navigate('/dashboard');
  };

  // Render nested component for Page 1
  const Page1PersonalAndParentDetails = () => (
    <div className="space-y-8">
      {/* Section 1: Personal Details */}
      <div>
        <h3 className="text-lg font-semibold mb-6">Personal Details</h3>
        <div className="space-y-4">
          {/* First, Middle, Last Name */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="First name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                value={formData.middleName}
                onChange={(e) => handleInputChange('middleName', e.target.value)}
                placeholder="Middle name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Last name"
              />
            </div>
          </div>

          {/* DOB, Gender, Mobile */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth *</Label>
              <Input
                id="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => handleInputChange('dob', e.target.value)}
              />
              <p className="text-xs text-gray-600 mt-1">
                Date should fall on or after 31/07/2000. For OBC: +3 years relaxation. For SC/ST/PWD: +5 years.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Gender *</Label>
              <RadioGroup value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male" className="mb-0">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female" className="mb-0">Female</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="mb-0">Other</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number *</Label>
              <Input
                id="mobile"
                type="tel"
                value={formData.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                placeholder="10-digit number"
              />
            </div>
          </div>

          {/* Email, Nationality */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality *</Label>
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) => handleInputChange('nationality', e.target.value)}
                placeholder="e.g., Indian"
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Category *</Label>
            <div className="grid grid-cols-2 gap-4">
              {CATEGORIES.map((cat) => (
                <div key={cat.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={cat.value}
                    checked={formData.category === cat.value}
                    onCheckedChange={() => handleInputChange('category', cat.value)}
                  />
                  <Label htmlFor={cat.value} className="mb-0">{cat.label}</Label>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-2">
              PWD/IDP candidates should also mention their social category.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Parent Details */}
      <div>
        <h3 className="text-lg font-semibold mb-6">Parent/Guardian Details</h3>
        <div className="space-y-4">
          {/* Father Name */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fatherFirstName">Father's First Name *</Label>
              <Input
                id="fatherFirstName"
                value={formData.fatherFirstName}
                onChange={(e) => handleInputChange('fatherFirstName', e.target.value)}
                placeholder="First name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fatherMiddleName">Father's Middle Name</Label>
              <Input
                id="fatherMiddleName"
                value={formData.fatherMiddleName}
                onChange={(e) => handleInputChange('fatherMiddleName', e.target.value)}
                placeholder="Middle name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fatherLastName">Father's Last Name *</Label>
              <Input
                id="fatherLastName"
                value={formData.fatherLastName}
                onChange={(e) => handleInputChange('fatherLastName', e.target.value)}
                placeholder="Last name"
              />
            </div>
          </div>

          {/* Mother Name */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="motherFirstName">Mother's First Name *</Label>
              <Input
                id="motherFirstName"
                value={formData.motherFirstName}
                onChange={(e) => handleInputChange('motherFirstName', e.target.value)}
                placeholder="First name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motherMiddleName">Mother's Middle Name</Label>
              <Input
                id="motherMiddleName"
                value={formData.motherMiddleName}
                onChange={(e) => handleInputChange('motherMiddleName', e.target.value)}
                placeholder="Middle name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="motherLastName">Mother's Last Name *</Label>
              <Input
                id="motherLastName"
                value={formData.motherLastName}
                onChange={(e) => handleInputChange('motherLastName', e.target.value)}
                placeholder="Last name"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render nested component for Page 2
  const Page2AddressAndClassX = () => (
    <div className="space-y-8">
      {/* Section 2 continued: Guardian Contact */}
      <div>
        <h3 className="text-lg font-semibold mb-6">Guardian Contact Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="guardianMobile">Mobile Number *</Label>
            <Input
              id="guardianMobile"
              type="tel"
              value={formData.guardianMobile}
              onChange={(e) => handleInputChange('guardianMobile', e.target.value)}
              placeholder="10-digit number"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianEmail">Email Address</Label>
            <Input
              id="guardianEmail"
              type="email"
              value={formData.guardianEmail}
              onChange={(e) => handleInputChange('guardianEmail', e.target.value)}
              placeholder="optional@example.com"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Address Details */}
      <div>
        <h3 className="text-lg font-semibold mb-6">Address Details</h3>

        {/* Present Address */}
        <div className="space-y-4 mb-8">
          <h4 className="font-medium">Present Address / Relief Camp Details *</h4>
          <div>
            <Textarea
              value={formData.presentAddress}
              onChange={(e) => handleInputChange('presentAddress', e.target.value)}
              placeholder="Enter complete address"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="presentCountry">Country *</Label>
              <Input
                id="presentCountry"
                value={formData.presentCountry}
                onChange={(e) => handleInputChange('presentCountry', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="presentState">State *</Label>
              <Input
                id="presentState"
                value={formData.presentState}
                onChange={(e) => handleInputChange('presentState', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="presentDistrict">District *</Label>
              <Input
                id="presentDistrict"
                value={formData.presentDistrict}
                onChange={(e) => handleInputChange('presentDistrict', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="presentCity">City *</Label>
              <Input
                id="presentCity"
                value={formData.presentCity}
                onChange={(e) => handleInputChange('presentCity', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="presentLocality">Locality *</Label>
              <Input
                id="presentLocality"
                value={formData.presentLocality}
                onChange={(e) => handleInputChange('presentLocality', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="presentPincode">Pin Code *</Label>
              <Input
                id="presentPincode"
                value={formData.presentPincode}
                onChange={(e) => handleInputChange('presentPincode', e.target.value)}
                maxLength={6}
                placeholder="6 digits"
              />
            </div>
          </div>
        </div>

        {/* Same as Present Address Checkbox */}
        <div className="flex items-center space-x-2 mb-8">
          <Checkbox
            id="sameAsPresent"
            checked={formData.sameAsPresent}
            onCheckedChange={(checked) => handleInputChange('sameAsPresent', checked)}
          />
          <Label htmlFor="sameAsPresent">Permanent address same as present address</Label>
        </div>

        {/* Permanent Address */}
        <div className="space-y-4">
          <h4 className="font-medium">Permanent Address *</h4>
          <div>
            <Textarea
              value={formData.permanentAddress}
              onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
              placeholder="Enter complete address"
              rows={3}
              disabled={formData.sameAsPresent}
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="permanentCountry">Country *</Label>
              <Input
                id="permanentCountry"
                value={formData.permanentCountry}
                onChange={(e) => handleInputChange('permanentCountry', e.target.value)}
                disabled={formData.sameAsPresent}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permanentState">State *</Label>
              <Input
                id="permanentState"
                value={formData.permanentState}
                onChange={(e) => handleInputChange('permanentState', e.target.value)}
                disabled={formData.sameAsPresent}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permanentDistrict">District *</Label>
              <Input
                id="permanentDistrict"
                value={formData.permanentDistrict}
                onChange={(e) => handleInputChange('permanentDistrict', e.target.value)}
                disabled={formData.sameAsPresent}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="permanentCity">City</Label>
              <Input
                id="permanentCity"
                value={formData.permanentCity}
                onChange={(e) => handleInputChange('permanentCity', e.target.value)}
                disabled={formData.sameAsPresent}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permanentLocality">Locality *</Label>
              <Input
                id="permanentLocality"
                value={formData.permanentLocality}
                onChange={(e) => handleInputChange('permanentLocality', e.target.value)}
                disabled={formData.sameAsPresent}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permanentPincode">Pin Code *</Label>
              <Input
                id="permanentPincode"
                value={formData.permanentPincode}
                onChange={(e) => handleInputChange('permanentPincode', e.target.value)}
                maxLength={6}
                placeholder="6 digits"
                disabled={formData.sameAsPresent}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Class X */}
      <div>
        <h3 className="text-lg font-semibold mb-6">Educational Qualification - Class X</h3>
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="class10Board">School/Institute & Board *</Label>
              <Input
                id="class10Board"
                value={formData.class10Board}
                onChange={(e) => handleInputChange('class10Board', e.target.value)}
                placeholder="e.g., Delhi Public School, CBSE"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class10YearOfPassing">Year of Passing *</Label>
              <Input
                id="class10YearOfPassing"
                type="number"
                value={formData.class10YearOfPassing}
                onChange={(e) => handleInputChange('class10YearOfPassing', e.target.value)}
                placeholder="2023"
              />
            </div>
          </div>
        </div>

        {/* Class X Subjects Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Full Marks</TableHead>
                <TableHead>Marks Obtained</TableHead>
                <TableHead className="w-12">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formData.class10Subjects.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Input
                      value={row.subject}
                      onChange={(e) => updateSubjectRow('class10', row.id, 'subject', e.target.value)}
                      placeholder="Subject name"
                      className="border-0"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={row.fullMarks}
                      onChange={(e) => updateSubjectRow('class10', row.id, 'fullMarks', e.target.value)}
                      placeholder="Marks"
                      className="border-0"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={row.marksObtained}
                      onChange={(e) => updateSubjectRow('class10', row.id, 'marksObtained', e.target.value)}
                      placeholder="Marks"
                      className="border-0"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSubjectRow('class10', row.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addSubjectRow('class10')}
          className="mt-4"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Subject
        </Button>
      </div>
    </div>
  );

  // Render nested component for Page 3
  const Page3ClassXIIJEEAndBranches = () => (
    <div className="space-y-8">
      {/* Section 4 continued: Class XII */}
      <div>
        <h3 className="text-lg font-semibold mb-6">Educational Qualification - Class XII</h3>
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="class12Board">School/Institute & Board *</Label>
              <Input
                id="class12Board"
                value={formData.class12Board}
                onChange={(e) => handleInputChange('class12Board', e.target.value)}
                placeholder="e.g., Delhi Public School, CBSE"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class12YearOfPassing">Year of Passing *</Label>
              <Input
                id="class12YearOfPassing"
                type="number"
                value={formData.class12YearOfPassing}
                onChange={(e) => handleInputChange('class12YearOfPassing', e.target.value)}
                placeholder="2025"
              />
            </div>
          </div>
        </div>

        {/* Class XII Subjects Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-100">
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Full Marks</TableHead>
                <TableHead>Marks Obtained</TableHead>
                <TableHead className="w-12">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formData.class12Subjects.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Input
                      value={row.subject}
                      onChange={(e) => updateSubjectRow('class12', row.id, 'subject', e.target.value)}
                      placeholder="Subject name"
                      className="border-0"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={row.fullMarks}
                      onChange={(e) => updateSubjectRow('class12', row.id, 'fullMarks', e.target.value)}
                      placeholder="Marks"
                      className="border-0"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={row.marksObtained}
                      onChange={(e) => updateSubjectRow('class12', row.id, 'marksObtained', e.target.value)}
                      placeholder="Marks"
                      className="border-0"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSubjectRow('class12', row.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addSubjectRow('class12')}
          className="mt-4"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Subject
        </Button>
      </div>

      {/* Section 5: JEE Details (JEE only) */}
      {formType === 'JEE' && (
        <div>
          <h3 className="text-lg font-semibold mb-6">JEE Details</h3>
          <div className="space-y-2">
            <Label htmlFor="jeeScore">JEE (Main) 2025 Total Score *</Label>
            <Input
              id="jeeScore"
              type="number"
              value={formData.jeeScore}
              onChange={(e) => handleInputChange('jeeScore', e.target.value)}
              placeholder="Enter total JEE score"
            />
          </div>
        </div>
      )}

      {/* Section 6: Branch Preferences */}
      <div>
        <h3 className="text-lg font-semibold mb-6">Branch Preferences (Priority Wise) *</h3>
        <p className="text-sm text-gray-600 mb-4">
          Preference should be given from the following five branches.
        </p>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((priority) => (
            <div key={priority} className="space-y-2">
              <Label htmlFor={`priority${priority}`}>Priority {priority} *</Label>
              <Select
                value={formData[`priority${priority}` as keyof typeof formData] as string}
                onValueChange={(value) => handleInputChange(`priority${priority}`, value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {BRANCHES.map((branch) => (
                    <SelectItem key={branch} value={branch}>
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm font-semibold text-yellow-900">Important Notice:</p>
          <p className="text-sm text-yellow-800 mt-2">
            Candidates are informed to fill the preference of the branches carefully. The preference once filled up and
            submitted cannot be changed in any case. The seats in different branches shall be allotted strictly as per
            the preference/priority indicated in the application form.
          </p>
        </div>
      </div>
    </div>
  );

  // Render nested component for Page 4
  const Page4DocumentsAndDeclaration = () => (
    <div className="space-y-8">
      {/* Section 7: Documents */}
      <div>
        <h3 className="text-lg font-semibold mb-6">Documents to be Submitted</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="class10Certificate">
              Class 10 Certificate (HSLC) - Proof of DOB *
            </Label>
            <Input
              id="class10Certificate"
              type="file"
              onChange={(e) => handleInputChange('class10Certificate', e.target.files?.[0])}
              accept=".pdf,.jpg,.png"
            />
            <p className="text-xs text-gray-600">Self-attested photocopy</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="class10MarkSheet">Class 10 Mark Sheet *</Label>
            <Input
              id="class10MarkSheet"
              type="file"
              onChange={(e) => handleInputChange('class10MarkSheet', e.target.files?.[0])}
              accept=".pdf,.jpg,.png"
            />
            <p className="text-xs text-gray-600">Self-attested photocopy</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="class12MarkSheet">Class 12 Mark Sheet *</Label>
            <Input
              id="class12MarkSheet"
              type="file"
              onChange={(e) => handleInputChange('class12MarkSheet', e.target.files?.[0])}
              accept=".pdf,.jpg,.png"
            />
            <p className="text-xs text-gray-600">Self-attested photocopy</p>
          </div>

          {['SC', 'ST', 'OBC', 'IDP', 'PWD', 'TG'].includes(formData.category) && (
            <div className="space-y-2">
              <Label htmlFor="categoryCertificate">Category Certificate *</Label>
              <Input
                id="categoryCertificate"
                type="file"
                onChange={(e) => handleInputChange('categoryCertificate', e.target.files?.[0])}
                accept=".pdf,.jpg,.png"
              />
              <p className="text-xs text-gray-600">
                Mandatory if claiming reserved category seat
              </p>
            </div>
          )}

          {formType === 'JEE' && (
            <div className="space-y-2">
              <Label htmlFor="jeeScoreCard">JEE (Main) 2025 Score Card *</Label>
              <Input
                id="jeeScoreCard"
                type="file"
                onChange={(e) => handleInputChange('jeeScoreCard', e.target.files?.[0])}
                accept=".pdf,.jpg,.png"
              />
            </div>
          )}
        </div>
      </div>

      {/* Section 8: Declaration */}
      <div>
        <h3 className="text-lg font-semibold mb-6">Declaration</h3>

        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 mb-6">
          <p className="text-sm text-gray-700 leading-relaxed">
            I do hereby solemnly declare that the information given above is correct to the best of my knowledge and
            belief. I am fully aware that I must submit self-attested copies of the certificates of my educational
            qualifications/final transcripts failing which my admission will stand cancelled. I will not
            request/claim for change of my preference of branches mentioned above. I am also aware that providing
            incorrect information in the application form can result in the cancellation of my admission at any stage.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="place">Place *</Label>
              <Input
                id="place"
                value={formData.place}
                onChange={(e) => handleInputChange('place', e.target.value)}
                placeholder="City/District"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="declarationDate">Date *</Label>
              <Input
                id="declarationDate"
                type="date"
                value={formData.declarationDate}
                onChange={(e) => handleInputChange('declarationDate', e.target.value)}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="signature">Signature of Applicant *</Label>
              <Input
                id="signature"
                type="file"
                onChange={(e) => handleInputChange('signatureUpload', e.target.files?.[0])}
                accept=".jpg,.png,.pdf"
              />
              <p className="text-xs text-gray-600">JPG/PNG, max 200 KB</p>
            </div>
            <div className="space-y-2">
              <Label>Name of Applicant</Label>
              <div className="p-2 bg-gray-200 rounded border border-gray-300">
                {formData.firstName} {formData.middleName} {formData.lastName}
              </div>
            </div>
          </div>
        </div>

        {/* Declaration Agreement */}
        <div className="mt-6 flex items-start space-x-3">
          <Checkbox
            id="declarationAgreed"
            checked={formData.declarationAgreed}
            onCheckedChange={(checked) => handleInputChange('declarationAgreed', checked)}
          />
          <Label htmlFor="declarationAgreed" className="text-sm">
            I have read and agree to the above declaration *
          </Label>
        </div>
      </div>
    </div>
  );

  const renderStep = useMemo(() => {
    switch (currentStep) {
      case 0:
        return <Page1PersonalAndParentDetails />;
      case 1:
        return <Page2AddressAndClassX />;
      case 2:
        return <Page3ClassXIIJEEAndBranches />;
      case 3:
        return <Page4DocumentsAndDeclaration />;
      default:
        return null;
    }
  }, [currentStep, formData, handleInputChange, addSubjectRow, removeSubjectRow, updateSubjectRow, formType]);

  const stepTitles = [
    'Personal & Parent Details',
    'Address & Class X',
    'Class XII, JEE & Branches',
    'Documents & Declaration'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Form Header */}
      <Card className="border-t-4 border-t-blue-600 mb-6">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">MTU B.Tech Application Form {formType}</CardTitle>
              <CardDescription className="mt-2">
                Manipur Technical University | {formType === 'JEE' ? 'JEE Pathway' : 'Non-JEE Pathway'}
              </CardDescription>
              <div className="mt-3 text-sm space-y-1 text-gray-600">
                <p>
                  <strong>Form Submission Fee:</strong> {formType === 'JEE' ? 'Gen/OBC: ₹100 | SC/ST/PWD: ₹50' : 'Gen/OBC: ₹300 | SC/ST/PWD: ₹200'} | IDP: NIL
                </p>
                <p><strong>Last Date:</strong> 23rd May, 2025</p>
              </div>
            </div>
            <div className="border-2 border-dashed border-gray-400 rounded p-4 text-center w-32 cursor-pointer hover:bg-gray-50 transition" onClick={() => document.getElementById('photoInput')?.click()}>
              {formData.photoPreview ? (
                <img src={formData.photoPreview} alt="Candidate" className="w-full h-32 object-cover rounded" />
              ) : (
                <>
                  <div className="text-4xl text-gray-400">📷</div>
                  <p className="text-xs text-gray-600 mt-2">Click to upload photo</p>
                </>
              )}
              <input
                id="photoInput"
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Progress */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-semibold">
                Page {currentStep + 1} of {TOTAL_STEPS}: {stepTitles[currentStep]}
              </span>
              <span className="text-gray-600">
                {Math.round(((currentStep + 1) / TOTAL_STEPS) * 100)}% Complete
              </span>
            </div>
            <Progress value={((currentStep + 1) / TOTAL_STEPS) * 100} />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between mt-6 mb-8">
            {stepTitles.map((title, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    index < currentStep
                      ? 'bg-green-500 text-white'
                      : index === currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index < currentStep ? <Check className="w-5 h-5" /> : index + 1}
                </div>
                <span className="text-xs text-gray-600 hidden md:block text-center max-w-[100px]">
                  {title}
                </span>
              </div>
            ))}
          </div>

          {/* Form Content */}
          <div className="min-h-[500px] my-8">{renderStep}</div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep === TOTAL_STEPS - 1 ? (
              <Button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700"
                disabled={!formData.declarationAgreed}
              >
                Submit Application
                <Check className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
