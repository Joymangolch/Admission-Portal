import { useState } from 'react';
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
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const TOTAL_STEPS = 7;

export function ApplicationForm() {
  const { application, saveStep, submitApplication } = useApplication();
  const [currentStep, setCurrentStep] = useState(application.currentStep);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    fullName: application.personalDetails.fullName || '',
    dob: application.personalDetails.dob || '',
    gender: application.personalDetails.gender || '',
    category: application.personalDetails.category || '',
    email: application.personalDetails.email || '',
    mobile: application.personalDetails.mobile || '',

    // Step 2: Parent Details
    fatherName: application.parentDetails.fatherName || '',
    motherName: application.parentDetails.motherName || '',
    guardianMobile: application.parentDetails.guardianMobile || '',
    guardianEmail: application.parentDetails.guardianEmail || '',

    // Step 3: Address
    presentAddress: application.address.present?.address || '',
    presentCity: application.address.present?.city || '',
    presentState: application.address.present?.state || '',
    presentPincode: application.address.present?.pincode || '',
    permanentAddress: application.address.permanent?.address || '',
    permanentCity: application.address.permanent?.city || '',
    permanentState: application.address.permanent?.state || '',
    permanentPincode: application.address.permanent?.pincode || '',
    sameAsPresent: false,

    // Step 4: Academic Details
    class10Board: application.academicDetails.class10?.board || '',
    class10Marks: application.academicDetails.class10?.marks || '',
    class10Percentage: application.academicDetails.class10?.percentage || '',
    class10Year: application.academicDetails.class10?.year || '',
    class12Board: application.academicDetails.class12?.board || '',
    class12Marks: application.academicDetails.class12?.marks || '',
    class12Percentage: application.academicDetails.class12?.percentage || '',
    class12Year: application.academicDetails.class12?.year || '',

    // Step 5: JEE Details
    hasJEE: application.jeeDetails.hasJEE || false,
    jeeRollNumber: application.jeeDetails.rollNumber || '',
    jeeRank: application.jeeDetails.rank || '',
    jeePercentile: application.jeeDetails.percentile || '',

    // Step 6: Course Preferences
    priority1: application.coursePreferences.priority1 || '',
    priority2: application.coursePreferences.priority2 || '',
    priority3: application.coursePreferences.priority3 || '',
    priority4: application.coursePreferences.priority4 || '',
    priority5: application.coursePreferences.priority5 || '',

    // Step 7: Declaration
    agreed: application.declaration.agreed || false
  });

  const courses = [
    'Computer Science & Engineering',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Information Technology',
    'Chemical Engineering',
    'Biotechnology',
    'Artificial Intelligence & ML'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Auto-fill permanent address if same as present
    if (field === 'sameAsPresent' && value === true) {
      setFormData((prev) => ({
        ...prev,
        permanentAddress: prev.presentAddress,
        permanentCity: prev.presentCity,
        permanentState: prev.presentState,
        permanentPincode: prev.presentPincode
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!(formData.fullName && formData.dob && formData.gender && formData.category);
      case 1:
        return !!(formData.fatherName && formData.motherName);
      case 2:
        return !!(formData.presentAddress && formData.presentCity && formData.permanentAddress);
      case 3:
        return !!(formData.class10Board && formData.class12Board);
      case 4:
        return formData.hasJEE ? !!(formData.jeeRollNumber && formData.jeeRank) : true;
      case 5:
        return !!(formData.priority1 && formData.priority2 && formData.priority3);
      case 6:
        return formData.agreed;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      toast.error('Please fill all required fields');
      return;
    }

    // Save current step data
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
            fullName: formData.fullName,
            dob: formData.dob,
            gender: formData.gender,
            category: formData.category,
            email: formData.email,
            mobile: formData.mobile
          }
        };
      case 1:
        return {
          parentDetails: {
            fatherName: formData.fatherName,
            motherName: formData.motherName,
            guardianMobile: formData.guardianMobile,
            guardianEmail: formData.guardianEmail
          }
        };
      case 2:
        return {
          address: {
            present: {
              address: formData.presentAddress,
              city: formData.presentCity,
              state: formData.presentState,
              pincode: formData.presentPincode
            },
            permanent: {
              address: formData.permanentAddress,
              city: formData.permanentCity,
              state: formData.permanentState,
              pincode: formData.permanentPincode
            }
          }
        };
      case 3:
        return {
          academicDetails: {
            class10: {
              board: formData.class10Board,
              marks: formData.class10Marks,
              percentage: formData.class10Percentage,
              year: formData.class10Year
            },
            class12: {
              board: formData.class12Board,
              marks: formData.class12Marks,
              percentage: formData.class12Percentage,
              year: formData.class12Year
            }
          }
        };
      case 4:
        return {
          jeeDetails: {
            hasJEE: formData.hasJEE,
            rollNumber: formData.jeeRollNumber,
            rank: formData.jeeRank,
            percentile: formData.jeePercentile
          }
        };
      case 5:
        return {
          coursePreferences: {
            priority1: formData.priority1,
            priority2: formData.priority2,
            priority3: formData.priority3,
            priority4: formData.priority4,
            priority5: formData.priority5
          }
        };
      case 6:
        return {
          declaration: {
            agreed: formData.agreed
          }
        };
      default:
        return {};
    }
  };

  const handleSubmit = () => {
    if (!formData.agreed) {
      toast.error('Please accept the declaration');
      return;
    }

    submitApplication();
    toast.success('Application submitted successfully!');
    navigate('/dashboard');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Personal Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth *</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleInputChange('dob', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Gender *</Label>
                <RadioGroup value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Other</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="obc">OBC</SelectItem>
                    <SelectItem value="sc">SC</SelectItem>
                    <SelectItem value="st">ST</SelectItem>
                    <SelectItem value="ews">EWS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => handleInputChange('mobile', e.target.value)}
                  placeholder="9876543210"
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Parent/Guardian Details</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fatherName">Father's Name *</Label>
                <Input
                  id="fatherName"
                  value={formData.fatherName}
                  onChange={(e) => handleInputChange('fatherName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motherName">Mother's Name *</Label>
                <Input
                  id="motherName"
                  value={formData.motherName}
                  onChange={(e) => handleInputChange('motherName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guardianMobile">Guardian's Mobile</Label>
                <Input
                  id="guardianMobile"
                  type="tel"
                  value={formData.guardianMobile}
                  onChange={(e) => handleInputChange('guardianMobile', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guardianEmail">Guardian's Email</Label>
                <Input
                  id="guardianEmail"
                  type="email"
                  value={formData.guardianEmail}
                  onChange={(e) => handleInputChange('guardianEmail', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Address Details</h3>
            
            <div className="space-y-4">
              <h4 className="font-medium">Present Address *</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="presentAddress">Address</Label>
                  <Textarea
                    id="presentAddress"
                    value={formData.presentAddress}
                    onChange={(e) => handleInputChange('presentAddress', e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="presentCity">City</Label>
                  <Input
                    id="presentCity"
                    value={formData.presentCity}
                    onChange={(e) => handleInputChange('presentCity', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="presentState">State</Label>
                  <Input
                    id="presentState"
                    value={formData.presentState}
                    onChange={(e) => handleInputChange('presentState', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="presentPincode">Pincode</Label>
                  <Input
                    id="presentPincode"
                    value={formData.presentPincode}
                    onChange={(e) => handleInputChange('presentPincode', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="sameAsPresent"
                checked={formData.sameAsPresent}
                onCheckedChange={(checked) => handleInputChange('sameAsPresent', checked)}
              />
              <Label htmlFor="sameAsPresent">Permanent address same as present address</Label>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Permanent Address *</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="permanentAddress">Address</Label>
                  <Textarea
                    id="permanentAddress"
                    value={formData.permanentAddress}
                    onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                    rows={3}
                    disabled={formData.sameAsPresent}
                  />
                </div>
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
                  <Label htmlFor="permanentState">State</Label>
                  <Input
                    id="permanentState"
                    value={formData.permanentState}
                    onChange={(e) => handleInputChange('permanentState', e.target.value)}
                    disabled={formData.sameAsPresent}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="permanentPincode">Pincode</Label>
                  <Input
                    id="permanentPincode"
                    value={formData.permanentPincode}
                    onChange={(e) => handleInputChange('permanentPincode', e.target.value)}
                    disabled={formData.sameAsPresent}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Academic Details</h3>
            
            <div className="space-y-4">
              <h4 className="font-medium">Class 10 Details *</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="class10Board">Board</Label>
                  <Input
                    id="class10Board"
                    value={formData.class10Board}
                    onChange={(e) => handleInputChange('class10Board', e.target.value)}
                    placeholder="CBSE / State Board"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class10Year">Year of Passing</Label>
                  <Input
                    id="class10Year"
                    type="number"
                    value={formData.class10Year}
                    onChange={(e) => handleInputChange('class10Year', e.target.value)}
                    placeholder="2023"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class10Marks">Marks Obtained</Label>
                  <Input
                    id="class10Marks"
                    value={formData.class10Marks}
                    onChange={(e) => handleInputChange('class10Marks', e.target.value)}
                    placeholder="450"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class10Percentage">Percentage</Label>
                  <Input
                    id="class10Percentage"
                    value={formData.class10Percentage}
                    onChange={(e) => handleInputChange('class10Percentage', e.target.value)}
                    placeholder="90.00"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Class 12 Details (PCM) *</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="class12Board">Board</Label>
                  <Input
                    id="class12Board"
                    value={formData.class12Board}
                    onChange={(e) => handleInputChange('class12Board', e.target.value)}
                    placeholder="CBSE / State Board"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class12Year">Year of Passing</Label>
                  <Input
                    id="class12Year"
                    type="number"
                    value={formData.class12Year}
                    onChange={(e) => handleInputChange('class12Year', e.target.value)}
                    placeholder="2025"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class12Marks">Marks Obtained</Label>
                  <Input
                    id="class12Marks"
                    value={formData.class12Marks}
                    onChange={(e) => handleInputChange('class12Marks', e.target.value)}
                    placeholder="450"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class12Percentage">Percentage</Label>
                  <Input
                    id="class12Percentage"
                    value={formData.class12Percentage}
                    onChange={(e) => handleInputChange('class12Percentage', e.target.value)}
                    placeholder="85.00"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">JEE Main Details</h3>
            
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="hasJEE"
                checked={formData.hasJEE}
                onCheckedChange={(checked) => handleInputChange('hasJEE', checked)}
              />
              <Label htmlFor="hasJEE">I have appeared for JEE Main</Label>
            </div>

            {formData.hasJEE && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jeeRollNumber">JEE Roll Number *</Label>
                  <Input
                    id="jeeRollNumber"
                    value={formData.jeeRollNumber}
                    onChange={(e) => handleInputChange('jeeRollNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jeeRank">JEE Rank *</Label>
                  <Input
                    id="jeeRank"
                    type="number"
                    value={formData.jeeRank}
                    onChange={(e) => handleInputChange('jeeRank', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jeePercentile">Percentile</Label>
                  <Input
                    id="jeePercentile"
                    value={formData.jeePercentile}
                    onChange={(e) => handleInputChange('jeePercentile', e.target.value)}
                  />
                </div>
              </div>
            )}

            {!formData.hasJEE && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-gray-700">
                  You will be considered for admission based on your Class 12 marks (PCM).
                  Minimum 60% aggregate required.
                </p>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Course Preferences</h3>
            <p className="text-sm text-gray-600 mb-4">
              Select up to 5 courses in order of preference
            </p>
            
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((priority) => (
                <div key={priority} className="space-y-2">
                  <Label htmlFor={`priority${priority}`}>
                    Priority {priority} {priority <= 3 && '*'}
                  </Label>
                  <Select
                    value={formData[`priority${priority}` as keyof typeof formData] as string}
                    onValueChange={(value) => handleInputChange(`priority${priority}`, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course} value={course}>
                          {course}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Declaration</h3>
            
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
              <h4 className="font-medium">Application Summary</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {formData.fullName}</p>
                <p><strong>Date of Birth:</strong> {formData.dob}</p>
                <p><strong>Category:</strong> {formData.category?.toUpperCase()}</p>
                <p><strong>JEE Candidate:</strong> {formData.hasJEE ? 'Yes' : 'No'}</p>
                <p><strong>First Preference:</strong> {formData.priority1}</p>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium mb-2">Important Instructions</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>All information provided must be accurate and verifiable</li>
                <li>Upload all required documents after form submission</li>
                <li>Keep your application number safe for future reference</li>
                <li>Document verification is mandatory</li>
              </ul>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreed"
                checked={formData.agreed}
                onCheckedChange={(checked) => handleInputChange('agreed', checked)}
              />
              <Label htmlFor="agreed" className="text-sm">
                I hereby declare that all the information provided above is true and correct to the best of my knowledge.
                I understand that any false information may lead to cancellation of my admission. *
              </Label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const stepTitles = [
    'Personal Details',
    'Parent Details',
    'Address',
    'Academic Details',
    'JEE Details',
    'Course Preferences',
    'Declaration'
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>B.Tech Application Form 2026</CardTitle>
          <CardDescription>Complete all steps to submit your application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">
                Step {currentStep + 1} of {TOTAL_STEPS}: {stepTitles[currentStep]}
              </span>
              <span className="text-gray-600">
                {Math.round(((currentStep + 1) / TOTAL_STEPS) * 100)}% Complete
              </span>
            </div>
            <Progress value={((currentStep + 1) / TOTAL_STEPS) * 100} />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between">
            {stepTitles.map((title, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    index < currentStep
                      ? 'bg-green-500 text-white'
                      : index === currentStep
                      ? 'bg-[#1E3A8A] text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <span className="text-xs text-gray-600 hidden md:block text-center max-w-[80px]">
                  {title}
                </span>
              </div>
            ))}
          </div>

          {/* Form Content */}
          <div className="min-h-[400px]">{renderStep()}</div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
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
                disabled={!formData.agreed}
              >
                Submit Application
                <Check className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleNext} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
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
