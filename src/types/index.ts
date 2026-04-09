export interface LearnerInfo {
  firstName: string;
  surname: string;
  dob: string;
  grade: string;
  gender: string;
  address: string;
  previousSchool?: string;
}

export interface ParentInfo {
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  emergencyContact: string;
}

export interface HealthHistory {
  allergies: string;
  conditions: string;
  medication: string;
  disabilities: string;
  doctorDetails: string;
  emergencyConsent: boolean;
}

export interface Consent {
  popia: boolean;
  policy: boolean;
  photoConsent: 'Yes' | 'No';
}

export interface ApplicationDocuments {
  birthCertificateUrl: string;
  reportCardUrl: string;
  guardianIdUrl: string;
  healthCertificateUrl: string;
  doctorDeclarationUrl: string;
  transferDocumentUrl?: string;
}

export interface Application {
  id?: string;
  applicationNumber: string;
  status: 'Received' | 'In Review' | 'Missing Docs' | 'Accepted' | 'Waitlisted' | 'Rejected';
  studentNumber?: string;
  learnerInfo: LearnerInfo;
  parentInfo: ParentInfo;
  healthHistory: HealthHistory;
  documents: ApplicationDocuments;
  consent: Consent;
  createdAt: string;
  notes?: string;
}

export interface Payment {
  id?: string;
  invoiceNumber: string;
  type: 'Fee' | 'Shop';
  learnerName: string;
  studentNumber?: string;
  grade?: string;
  amount: number;
  period?: string;
  status: 'Pending' | 'Paid' | 'Failed';
  method: 'PayFast' | 'EFT';
  proofUrl?: string;
  createdAt: string;
}

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  variants: string[];
  imageUrl: string;
}

export interface SchoolDocument {
  id?: string;
  title: string;
  category: string;
  url: string;
  publishDate: string;
  visibility: 'Published' | 'Draft' | 'Archived';
  grades: string[];
  pinned: boolean;
}

export interface Staff {
  id?: string;
  name: string;
  role: string;
  photoUrl: string;
  grade?: string;
}
