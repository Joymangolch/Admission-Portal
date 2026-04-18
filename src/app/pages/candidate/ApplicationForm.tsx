import { useState, useCallback, useMemo, memo } from 'react';
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

// MEMOIZED PAGE COMPONENTS (Extracted outside main component for performance)

const Page1PersonalAndParentDetails = memo(({ formData, handleInputChange }: { formData: any; handleInputChange: (field: string, value: any) => void }) => (
  <div className="space-y-8">
    {/* Section 1: Personal Details */}
    <div>
      <h3 className="text-lg font-semibold mb-6">Personal Details</h3>
      <div className="space-y-4">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="Enter your full name"
          />
        </div>

        {/* DOB, Gender, Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="space-y-2">
            <Label htmlFor="dob" className="text-sm sm:text-base">Date of Birth *</Label>
            <Input
              id="dob"
              type="date"
              value={formData.dob}
              onChange={(e) => handleInputChange('dob', e.target.value)}
              className="text-sm"
            />
            <p className="text-xs text-gray-600 mt-1">
              Date should fall on or after 31/07/2000. For OBC: +3 years. For SC/ST/PWD: +5 years.
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Gender *</Label>
            <RadioGroup value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
              <div className="flex items-center space-x-3 sm:space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="mb-0 text-sm cursor-pointer">Male</Label>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="mb-0 text-sm cursor-pointer">Female</Label>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other" className="mb-0 text-sm cursor-pointer">Other</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobile" className="text-sm sm:text-base">Mobile Number *</Label>
            <Input
              id="mobile"
              type="tel"
              value={formData.mobile}
              onChange={(e) => handleInputChange('mobile', e.target.value)}
              placeholder="10-digit number"
              className="text-sm"
            />
          </div>
        </div>

        {/* Email, Nationality */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm sm:text-base">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="your.email@example.com"
              className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nationality" className="text-sm sm:text-base">Nationality *</Label>
            <Input
              id="nationality"
              value={formData.nationality}
              onChange={(e) => handleInputChange('nationality', e.target.value)}
              placeholder="e.g., Indian"
              className="text-sm"
            />
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label className="text-sm sm:text-base">Category *</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {CATEGORIES.map((cat) => (
              <div key={cat.value} className="flex items-center space-x-2">
                <Checkbox
                  id={cat.value}
                  checked={formData.category === cat.value}
                  onCheckedChange={() => handleInputChange('category', cat.value)}
                />
                <Label htmlFor={cat.value} className="mb-0 text-sm cursor-pointer">{cat.label}</Label>
              </div>
            ))}
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            PWD/IDP candidates should also mention their social category.
          </p>
        </div>
      </div>
    </div>

    {/* Section 2: Parent Details */}
    <div>
      <h3 className="text-lg font-semibold mb-4 sm:mb-6">Parent/Guardian Details</h3>
      <div className="space-y-4">
        {/* Father Name */}
        <div className="space-y-2">
          <Label htmlFor="fatherFullName" className="text-sm sm:text-base">Father's Full Name *</Label>
          <Input
            id="fatherFullName"
            value={formData.fatherFullName}
            onChange={(e) => handleInputChange('fatherFullName', e.target.value)}
            placeholder="Enter father's full name"
            className="text-sm"
          />
        </div>

        {/* Mother Name */}
        <div className="space-y-2">
          <Label htmlFor="motherFullName" className="text-sm sm:text-base">Mother's Full Name *</Label>
          <Input
            id="motherFullName"
            value={formData.motherFullName}
            onChange={(e) => handleInputChange('motherFullName', e.target.value)}
            placeholder="Enter mother's full name"
            className="text-sm"
          />
        </div>
      </div>
    </div>
  </div>
));
Page1PersonalAndParentDetails.displayName = 'Page1PersonalAndParentDetails';

const Page2AddressAndClassX = memo(({ formData, handleInputChange, addSubjectRow, removeSubjectRow, updateSubjectRow }: { 
  formData: any; 
  handleInputChange: (field: string, value: any) => void;
  addSubjectRow: (tableType: 'class10' | 'class12') => void;
  removeSubjectRow: (tableType: 'class10' | 'class12', id: string) => void;
  updateSubjectRow: (tableType: 'class10' | 'class12', id: string, key: keyof SubjectRow, value: string) => void;
}) => (
    <div className="space-y-8">
      {/* Section 2 continued: Guardian Contact */}
      <div>
        <h3 className="text-lg font-semibold mb-4 sm:mb-6">Guardian Contact Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-2">
            <Label htmlFor="guardianMobile" className="text-sm sm:text-base">Mobile Number *</Label>
            <Input
              id="guardianMobile"
              type="tel"
              value={formData.guardianMobile}
              onChange={(e) => handleInputChange('guardianMobile', e.target.value)}
              placeholder="10-digit number"
              className="text-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="guardianEmail" className="text-sm sm:text-base">Email Address</Label>
            <Input
              id="guardianEmail"
              type="email"
              value={formData.guardianEmail}
              onChange={(e) => handleInputChange('guardianEmail', e.target.value)}
              placeholder="optional@example.com"
              className="text-sm"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="presentCountry" className="text-sm sm:text-base">Country *</Label>
              <Input
                id="presentCountry"
                value={formData.presentCountry}
                onChange={(e) => handleInputChange('presentCountry', e.target.value)}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="presentState" className="text-sm sm:text-base">State *</Label>
              <Input
                id="presentState"
                value={formData.presentState}
                onChange={(e) => handleInputChange('presentState', e.target.value)}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="presentDistrict" className="text-sm sm:text-base">District *</Label>
              <Input
                id="presentDistrict"
                value={formData.presentDistrict}
                onChange={(e) => handleInputChange('presentDistrict', e.target.value)}
                className="text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="presentCity" className="text-sm sm:text-base">City *</Label>
              <Input
                id="presentCity"
                value={formData.presentCity}
                onChange={(e) => handleInputChange('presentCity', e.target.value)}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="presentLocality" className="text-sm sm:text-base">Locality *</Label>
              <Input
                id="presentLocality"
                value={formData.presentLocality}
                onChange={(e) => handleInputChange('presentLocality', e.target.value)}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="presentPincode" className="text-sm sm:text-base">Pin Code *</Label>
              <Input
                id="presentPincode"
                value={formData.presentPincode}
                onChange={(e) => handleInputChange('presentPincode', e.target.value)}
                maxLength={6}
                placeholder="6 digits"
                className="text-sm"
              />
            </div>
          </div>
        </div>

        {/* Same as Present Address Checkbox */}
        <div className="flex items-center space-x-2 mb-6 sm:mb-8">
          <Checkbox
            id="sameAsPresent"
            checked={formData.sameAsPresent}
            onCheckedChange={(checked) => handleInputChange('sameAsPresent', checked)}
          />
          <Label htmlFor="sameAsPresent" className="text-sm cursor-pointer">Permanent address same as present address</Label>
        </div>

        {/* Permanent Address */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm sm:text-base">Permanent Address *</h4>
          <div>
            <Textarea
              value={formData.permanentAddress}
              onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
              placeholder="Enter complete address"
              rows={3}
              disabled={formData.sameAsPresent}
              className="text-sm"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="permanentCountry" className="text-sm sm:text-base">Country *</Label>
              <Input
                id="permanentCountry"
                value={formData.permanentCountry}
                onChange={(e) => handleInputChange('permanentCountry', e.target.value)}
                disabled={formData.sameAsPresent}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permanentState" className="text-sm sm:text-base">State *</Label>
              <Input
                id="permanentState"
                value={formData.permanentState}
                onChange={(e) => handleInputChange('permanentState', e.target.value)}
                disabled={formData.sameAsPresent}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permanentDistrict" className="text-sm sm:text-base">District *</Label>
              <Input
                id="permanentDistrict"
                value={formData.permanentDistrict}
                onChange={(e) => handleInputChange('permanentDistrict', e.target.value)}
                disabled={formData.sameAsPresent}
                className="text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="permanentCity" className="text-sm sm:text-base">City</Label>
              <Input
                id="permanentCity"
                value={formData.permanentCity}
                onChange={(e) => handleInputChange('permanentCity', e.target.value)}
                disabled={formData.sameAsPresent}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permanentLocality" className="text-sm sm:text-base">Locality *</Label>
              <Input
                id="permanentLocality"
                value={formData.permanentLocality}
                onChange={(e) => handleInputChange('permanentLocality', e.target.value)}
                disabled={formData.sameAsPresent}
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permanentPincode" className="text-sm sm:text-base">Pin Code *</Label>
              <Input
                id="permanentPincode"
                value={formData.permanentPincode}
                onChange={(e) => handleInputChange('permanentPincode', e.target.value)}
                maxLength={6}
                placeholder="6 digits"
                disabled={formData.sameAsPresent}
                className="text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Class X */}
      <div>
        <h3 className="text-lg font-semibold mb-4 sm:mb-6">Educational Qualification - Class X</h3>
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="class10Board" className="text-sm sm:text-base">School/Institute & Board *</Label>
              <Input
                id="class10Board"
                value={formData.class10Board}
                onChange={(e) => handleInputChange('class10Board', e.target.value)}
                placeholder="e.g., Delhi Public School, CBSE"
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class10YearOfPassing" className="text-sm sm:text-base">Year of Passing *</Label>
              <Input
                id="class10YearOfPassing"
                type="number"
                value={formData.class10YearOfPassing}
                onChange={(e) => handleInputChange('class10YearOfPassing', e.target.value)}
                placeholder="2023"
                className="text-sm"
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
));
Page2AddressAndClassX.displayName = 'Page2AddressAndClassX';

const Page3ClassXIIJEEAndBranches = memo(({ formData, handleInputChange, addSubjectRow, removeSubjectRow, updateSubjectRow, formType }: {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  addSubjectRow: (tableType: 'class10' | 'class12') => void;
  removeSubjectRow: (tableType: 'class10' | 'class12', id: string) => void;
  updateSubjectRow: (tableType: 'class10' | 'class12', id: string, key: keyof SubjectRow, value: string) => void;
  formType: 'JEE' | 'NON-JEE';
}) => (
    <div className="space-y-8">
      {/* Section 4 continued: Class XII */}
      <div>
        <h3 className="text-lg font-semibold mb-4 sm:mb-6">Educational Qualification - Class XII</h3>
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="class12Board" className="text-sm sm:text-base">School/Institute & Board *</Label>
              <Input
                id="class12Board"
                value={formData.class12Board}
                onChange={(e) => handleInputChange('class12Board', e.target.value)}
                placeholder="e.g., Delhi Public School, CBSE"
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="class12YearOfPassing" className="text-sm sm:text-base">Year of Passing *</Label>
              <Input
                id="class12YearOfPassing"
                type="number"
                value={formData.class12YearOfPassing}
                onChange={(e) => handleInputChange('class12YearOfPassing', e.target.value)}
                placeholder="2025"
                className="text-sm"
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
          <h3 className="text-lg font-semibold mb-4 sm:mb-6">JEE Details</h3>
          <div className="space-y-2">
            <Label htmlFor="jeeScore" className="text-sm sm:text-base">JEE (Main) 2025 Total Score *</Label>
            <Input
              id="jeeScore"
              type="number"
              value={formData.jeeScore}
              onChange={(e) => handleInputChange('jeeScore', e.target.value)}
              placeholder="Enter total JEE score"
              className="text-sm"
            />
          </div>
        </div>
      )}

      {/* Section 6: Branch Preferences */}
      <div>
        <h3 className="text-lg font-semibold mb-4 sm:mb-6">Branch Preferences (Priority Wise) *</h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
          Preference should be given from the following five branches.
        </p>

        <div className="space-y-3 sm:space-y-4">
          {[1, 2, 3, 4, 5].map((priority) => (
            <div key={priority} className="space-y-2">
              <Label htmlFor={`priority${priority}`} className="text-sm sm:text-base">Priority {priority} *</Label>
              <Select
                value={formData[`priority${priority}` as keyof typeof formData] as string}
                onValueChange={(value) => handleInputChange(`priority${priority}`, value)}
              >
                <SelectTrigger className="text-sm">
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

        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs sm:text-sm font-semibold text-yellow-900">Important Notice:</p>
          <p className="text-xs sm:text-sm text-yellow-800 mt-2">
            Candidates are informed to fill the preference of the branches carefully. The preference once filled up and
            submitted cannot be changed in any case. The seats in different branches shall be allotted strictly as per
            the preference/priority indicated in the application form.
          </p>
        </div>
      </div>
    </div>
));
Page3ClassXIIJEEAndBranches.displayName = 'Page3ClassXIIJEEAndBranches';

const Page4DocumentsAndDeclaration = memo(({ formData, handleInputChange, formType }: {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  formType: 'JEE' | 'NON-JEE';
}) => (
    <div className="space-y-8">
      {/* Section 7: Documents */}
      <div>
        <h3 className="text-lg font-semibold mb-4 sm:mb-6">Documents to be Submitted</h3>
        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <Label htmlFor="class10Certificate" className="text-sm sm:text-base">
              Class 10 Certificate (HSLC) - Proof of DOB *
            </Label>
            <Input
              id="class10Certificate"
              type="file"
              onChange={(e) => handleInputChange('class10Certificate', e.target.files?.[0])}
              accept=".pdf,.jpg,.png"
              className="text-xs sm:text-sm"
            />
            <p className="text-xs text-gray-600">Self-attested photocopy</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="class10MarkSheet" className="text-sm sm:text-base">Class 10 Mark Sheet *</Label>
            <Input
              id="class10MarkSheet"
              type="file"
              onChange={(e) => handleInputChange('class10MarkSheet', e.target.files?.[0])}
              accept=".pdf,.jpg,.png"
              className="text-xs sm:text-sm"
            />
            <p className="text-xs text-gray-600">Self-attested photocopy</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="class12MarkSheet" className="text-sm sm:text-base">Class 12 Mark Sheet *</Label>
            <Input
              id="class12MarkSheet"
              type="file"
              onChange={(e) => handleInputChange('class12MarkSheet', e.target.files?.[0])}
              accept=".pdf,.jpg,.png"
              className="text-xs sm:text-sm"
            />
            <p className="text-xs text-gray-600">Self-attested photocopy</p>
          </div>

          {['SC', 'ST', 'OBC', 'IDP', 'PWD'].includes(formData.category) && (
            <div className="space-y-2">
              <Label htmlFor="categoryCertificate" className="text-sm sm:text-base">Category Certificate *</Label>
              <Input
                id="categoryCertificate"
                type="file"
                onChange={(e) => handleInputChange('categoryCertificate', e.target.files?.[0])}
                accept=".pdf,.jpg,.png"
                className="text-xs sm:text-sm"
              />
              <p className="text-xs text-gray-600">
                Mandatory if claiming reserved category seat
              </p>
            </div>
          )}

          {formType === 'JEE' && (
            <div className="space-y-2">
              <Label htmlFor="jeeScoreCard" className="text-sm sm:text-base">JEE (Main) 2025 Score Card *</Label>
              <Input
                id="jeeScoreCard"
                type="file"
                onChange={(e) => handleInputChange('jeeScoreCard', e.target.files?.[0])}
                accept=".pdf,.jpg,.png"
                className="text-xs sm:text-sm"
              />
            </div>
          )}
        </div>
      </div>

      {/* Section 8: Declaration */}
      <div>
        <h3 className="text-lg font-semibold mb-6">Declaration</h3>

        <div className="p-3 sm:p-6 bg-gray-50 rounded-lg border border-gray-200 mb-4 sm:mb-6">
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            I do hereby solemnly declare that the information given above is correct to the best of my knowledge and
            belief. I am fully aware that I must submit self-attested copies of the certificates of my educational
            qualifications/final transcripts failing which my admission will stand cancelled. I will not
            request/claim for change of my preference of branches mentioned above. I am also aware that providing
            incorrect information in the application form can result in the cancellation of my admission at any stage.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
          {/* Left Column */}
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="place" className="text-sm sm:text-base">Place *</Label>
              <Input
                id="place"
                value={formData.place}
                onChange={(e) => handleInputChange('place', e.target.value)}
                placeholder="City/District"
                className="text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="declarationDate" className="text-sm sm:text-base">Date *</Label>
              <Input
                id="declarationDate"
                type="date"
                value={formData.declarationDate}
                onChange={(e) => handleInputChange('declarationDate', e.target.value)}
                className="text-sm"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="signature" className="text-sm sm:text-base">Signature of Applicant *</Label>
              <Input
                id="signature"
                type="file"
                onChange={(e) => handleInputChange('signatureUpload', e.target.files?.[0])}
                accept=".jpg,.png,.pdf"
                className="text-xs sm:text-sm"
              />
              <p className="text-xs text-gray-600">JPG/PNG, max 200 KB</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Name of Applicant</Label>
              <div className="p-2 bg-gray-200 rounded border border-gray-300 text-xs sm:text-sm">
                {formData.fullName}
              </div>
            </div>
          </div>
        </div>

        {/* Declaration Agreement */}
        <div className="mt-4 sm:mt-6 flex items-start space-x-3">
          <Checkbox
            id="declarationAgreed"
            checked={formData.declarationAgreed}
            onCheckedChange={(checked) => handleInputChange('declarationAgreed', checked)}
          />
          <Label htmlFor="declarationAgreed" className="text-xs sm:text-sm cursor-pointer">
            I have read and agree to the above declaration *
          </Label>
        </div>
      </div>
    </div>
));
Page4DocumentsAndDeclaration.displayName = 'Page4DocumentsAndDeclaration';

export function ApplicationForm() {
  const { application, saveStep, submitApplication } = useApplication();
  const [currentStep, setCurrentStep] = useState(application.currentStep);
  const [formType, setFormType] = useState<'JEE' | 'NON-JEE'>('JEE');
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    // PAGE 1: Personal Details
    fullName: `${application.personalDetails.firstName || ''} ${application.personalDetails.middleName || ''} ${application.personalDetails.lastName || ''}`.trim() || '',
    dob: application.personalDetails.dob || '',
    gender: application.personalDetails.gender || '',
    mobile: application.personalDetails.mobile || '',
    email: application.personalDetails.email || '',
    nationality: application.personalDetails.nationality || '',
    category: application.personalDetails.category || '',

    // PAGE 1: Parent Details
    fatherFullName: `${application.parentDetails.fatherFirstName || ''} ${application.parentDetails.fatherMiddleName || ''} ${application.parentDetails.fatherLastName || ''}`.trim() || '',
    motherFullName: `${application.parentDetails.motherFirstName || ''} ${application.parentDetails.motherMiddleName || ''} ${application.parentDetails.motherLastName || ''}`.trim() || '',

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
      [field]: prev[field as keyof typeof prev].filter((row: SubjectRow) => row.id !== id)
    }));
  }, []);

  const updateSubjectRow = useCallback((tableType: 'class10' | 'class12', id: string, key: keyof SubjectRow, value: string) => {
    const field = tableType === 'class10' ? 'class10Subjects' : 'class12Subjects';
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].map((row: SubjectRow) =>
        row.id === id ? { ...row, [key]: value } : row
      )
    }));
  }, []);

  const handleNext = () => {
    if (validateStep(currentStep)) {
      const stepData = getStepData();
      saveStep(currentStep, stepData);
      setCurrentStep(currentStep + 1);
    } else {
      toast.error('Please complete all required fields');
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
            mobile: formData.mobile,
            email: formData.email,
            nationality: formData.nationality,
            category: formData.category
          },
          parentDetails: {
            fatherFullName: formData.fatherFullName,
            motherFullName: formData.motherFullName
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

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        // Page 1 validation
        return !!(
          formData.fullName &&
          formData.dob &&
          formData.gender &&
          formData.mobile &&
          formData.category &&
          formData.fatherFullName &&
          formData.motherFullName &&
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
        const hasValidSubjects = formData.class12Subjects.length > 0;
        const jeeValid = formType === 'NON-JEE' || (formType === 'JEE' && formData.jeeScore);
        const preferencesValid = formData.priority1 && formData.priority2 && formData.priority3 && formData.priority4 && formData.priority5;
        return !!(
          formData.class12Board &&
          formData.class12YearOfPassing &&
          hasValidSubjects &&
          jeeValid &&
          preferencesValid
        );
      case 3:
        // Page 4 validation
        return !!(
          formData.class10Certificate &&
          formData.class10MarkSheet &&
          formData.class12MarkSheet &&
          formData.place &&
          formData.declarationDate &&
          formData.signatureUpload &&
          formData.photoUpload &&
          formData.declarationAgreed
        );
      default:
        return false;
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

  const renderStep = useMemo(() => {
    switch (currentStep) {
      case 0:
        return <Page1PersonalAndParentDetails formData={formData} handleInputChange={handleInputChange} />;
      case 1:
        return <Page2AddressAndClassX formData={formData} handleInputChange={handleInputChange} addSubjectRow={addSubjectRow} removeSubjectRow={removeSubjectRow} updateSubjectRow={updateSubjectRow} />;
      case 2:
        return <Page3ClassXIIJEEAndBranches formData={formData} handleInputChange={handleInputChange} addSubjectRow={addSubjectRow} removeSubjectRow={removeSubjectRow} updateSubjectRow={updateSubjectRow} formType={formType} />;
      case 3:
        return <Page4DocumentsAndDeclaration formData={formData} handleInputChange={handleInputChange} formType={formType} />;
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
    <div className="w-full max-w-2xl sm:max-w-4xl mx-auto p-2 sm:p-4">
      {/* Form Header */}
      <Card className="border-t-4 border-t-blue-600 mb-4 sm:mb-6">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0">
            <div className="flex-1">
              <CardTitle className="text-xl sm:text-2xl">MTU B.Tech Application Form {formType}</CardTitle>
              <CardDescription className="mt-2 text-xs sm:text-sm">
                Manipur Technical University | {formType === 'JEE' ? 'JEE Pathway' : 'Non-JEE Pathway'}
              </CardDescription>
              <div className="mt-3 text-xs sm:text-sm space-y-1 text-gray-600">
                <p>
                  <strong>Form Submission Fee:</strong> {formType === 'JEE' ? 'Gen/OBC: ₹100 | SC/ST/PWD: ₹50' : 'Gen/OBC: ₹300 | SC/ST/PWD: ₹200'} | IDP: NIL
                </p>
                <p><strong>Last Date:</strong> 23rd May, 2025</p>
              </div>
            </div>
            <div className="border-2 border-dashed border-gray-400 rounded p-3 text-center w-24 sm:w-32 cursor-pointer hover:bg-gray-50 transition flex-shrink-0" onClick={() => document.getElementById('photoInput')?.click()}>
              {formData.photoPreview ? (
                <img src={formData.photoPreview} alt="Candidate" className="w-full h-24 sm:h-32 object-cover rounded" />
              ) : (
                <>
                  <div className="text-3xl sm:text-4xl text-gray-400">📷</div>
                  <p className="text-xs text-gray-600 mt-1 sm:mt-2">Upload photo</p>
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
        <CardContent className="p-3 sm:p-6">
          {/* Progress */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 text-xs sm:text-sm">
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
          <div className="flex justify-between mt-4 sm:mt-6 mb-6 sm:mb-8 overflow-x-auto pb-2">
            {stepTitles.map((title, index) => (
              <div key={index} className="flex flex-col items-center gap-1 sm:gap-2 flex-shrink-0">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold ${
                    index < currentStep
                      ? 'bg-green-500 text-white'
                      : index === currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index < currentStep ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : index + 1}
                </div>
                <span className="text-xs text-gray-600 hidden lg:block text-center max-w-[80px] sm:max-w-[100px]">
                  {title}
                </span>
              </div>
            ))}
          </div>

          {/* Form Content */}
          <div className="min-h-[500px] my-6 sm:my-8">{renderStep}</div>

          {/* Navigation Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-0 pt-6 sm:pt-8 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="text-sm"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {currentStep === TOTAL_STEPS - 1 ? (
              <Button
                onClick={handleSubmit}
                className="bg-green-600 hover:bg-green-700 text-sm"
                disabled={!formData.declarationAgreed}
              >
                Submit Application
                <Check className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-sm">
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
