export type PatientStatus = 'Stable' | 'Alert: High BP' | 'Pending Lab' | 'Critical Arrhythmia' | 'Follow-up Due';

export interface VitalSign {
  id: string;
  patientId: string;
  timestamp: string; // ISO string
  systolic: number; // mmHg
  diastolic: number; // mmHg
  heartRate: number; // bpm
  spO2?: number; // %
  source: 'Clinic' | 'RPM Device' | 'Patient Portal';
  notes?: string;
  isAlert?: boolean;
  alertType?: 'High BP' | 'Low BP' | 'Tachycardia' | 'Bradycardia' | 'Normal';
}

export interface Medication {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  frequency: string;
  route: string;
  duration: string;
  instructions: string;
  indication?: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  doctorName: string;
  doctorLicense: string;
  clinicName: string;
  diagnosis: string;
  medications: Medication[];
  clinicalNotes?: string;
  nextFollowUp?: string;
}

export interface LabTest {
  id: string;
  patientId: string;
  testName: string; // e.g., 'Troponin I', 'NT-proBNP', 'Lipid Panel', 'Serum Creatinine'
  date: string;
  result: string;
  unit: string;
  referenceRange: string;
  status: 'Normal' | 'Abnormal' | 'Critical' | 'Pending Review';
  category: 'Cardiac Biomarkers' | 'Renal & Electrolytes' | 'Lipid & Metabolic' | 'Coagulation';
  notes?: string;
}

export interface CardiologyReportData {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  type: 'Echocardiogram' | '12-Lead ECG' | 'Holter 24h' | 'Stress Test';
  doctorName: string;
  indication: string;
  // Echo specific fields
  ejectionFraction?: number; // % (e.g. 55%)
  lvEndDiastolicDiam?: number; // mm
  lvEndSystolicDiam?: number; // mm
  wallMotionAbnormality?: string;
  valvularFindings?: string;
  diastolicFunction?: string;
  pericardialEffusion?: string;
  // ECG specific fields
  rhythm?: string; // e.g. "Normal Sinus Rhythm", "Atrial Fibrillation"
  rate?: number; // bpm
  prInterval?: number; // ms
  qrsDuration?: number; // ms
  qtcInterval?: number; // ms
  stSegment?: string;
  // Conclusions
  conclusions: string[];
  recommendations: string[];
}

export interface InvoiceItem {
  id: string;
  description: string;
  category: 'Consultation' | 'Diagnostic (ECG)' | 'Echocardiography' | 'RPM Subscription' | 'Lab Service';
  amount: number;
}

export interface Invoice {
  id: string;
  patientId: string;
  patientName: string;
  invoiceNumber: string;
  date: string;
  items: InvoiceItem[];
  totalAmount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  paymentMethod?: 'Cash' | 'Credit Card' | 'Insurance' | 'Bank Transfer';
  notes?: string;
}

export interface Referral {
  id: string;
  patientId: string;
  patientName: string;
  referralDate: string;
  targetFacilityOrSpecialist: string;
  specialty: 'Cath Lab / Coronary Angiography' | 'Cardiothoracic Surgery' | 'Electrophysiology' | 'Cardiac MRI / CT' | 'Vascular Surgery';
  priority: 'Routine' | 'Urgent' | 'Stat / Emergency';
  clinicalSummary: string;
  reasonForReferral: string;
  status: 'Sent' | 'Pending' | 'Completed';
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  type: 'Initial Consultation' | 'Echo Follow-up' | 'RPM Review' | 'Post-PCI Check' | 'Routine Checkup';
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'In Progress';
  reason: string;
  notes?: string;
}

export interface RPMAlert {
  id: string;
  patientId: string;
  patientName: string;
  timestamp: string;
  type: 'Critical High BP' | 'Severe Tachycardia' | 'Severe Bradycardia' | 'Hypertensive Urgency';
  reading: string; // e.g. "178/105 mmHg" or "132 bpm"
  level: 'critical' | 'warning';
  acknowledged: boolean;
  actionTaken?: string;
}

export interface Patient {
  id: string;
  mrn: string; // Medical Record Number
  name: string;
  age: number;
  dob: string;
  gender: 'Male' | 'Female';
  phone: string;
  email: string;
  address: string;
  status: PatientStatus;
  bloodType: string;
  primaryDiagnosis: string;
  secondaryDiagnoses: string[];
  riskFactors: string[];
  allergies: string[];
  implantedDevices?: string[]; // e.g. "Pacemaker", "ICD", "None"
  lastVisit: string;
  nextAppointment?: string;
  recentVitals?: VitalSign[];
}

export interface ChatMessage {
  id: string;
  sender: 'doctor' | 'ai' | 'patient';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}
