import { Patient, VitalSign, Prescription, LabTest, CardiologyReportData, Invoice, Referral, Appointment, RPMAlert } from '../types';

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'p-1',
    mrn: 'CRD-2026-0891',
    name: 'Ahmed Hassan',
    age: 62,
    dob: '1964-05-14',
    gender: 'Male',
    phone: '+20 100 234 5678',
    email: 'ahmed.hassan@example.com',
    address: 'Nasr City, Cairo, Egypt',
    status: 'Alert: High BP',
    bloodType: 'O+',
    primaryDiagnosis: 'Ischemic Heart Disease (Post-STEMI, DES LAD)',
    secondaryDiagnoses: ['Essential Hypertension (Stage 2)', 'Type 2 Diabetes Mellitus', 'Dyslipidemia'],
    riskFactors: ['Former Smoker (30 pack-years)', 'Family history of premature CAD', 'Sedentary Lifestyle'],
    allergies: ['Penicillin (mild rash)'],
    implantedDevices: ['Drug-Eluting Stent (LAD)'],
    lastVisit: '2026-10-18',
    nextAppointment: '2026-10-25'
  },
  {
    id: 'p-2',
    mrn: 'CRD-2026-0412',
    name: 'Fatma Ali',
    age: 58,
    dob: '1968-11-20',
    gender: 'Female',
    phone: '+20 111 876 5432',
    email: 'fatma.ali@example.com',
    address: 'Maadi, Cairo, Egypt',
    status: 'Pending Lab',
    bloodType: 'A+',
    primaryDiagnosis: 'Heart Failure with Reduced Ejection Fraction (HFrEF - EF 34%)',
    secondaryDiagnoses: ['Dilated Cardiomyopathy', 'NYHA Class II-III Dyspnea', 'Chronic Kidney Disease Stage 3a'],
    riskFactors: ['Hypertension', 'Post-menopausal'],
    allergies: ['None known'],
    implantedDevices: ['Biatrial monitor scheduled'],
    lastVisit: '2026-10-14',
    nextAppointment: '2026-10-28'
  },
  {
    id: 'p-3',
    mrn: 'CRD-2026-1033',
    name: 'Mohamed Ibrahim',
    age: 67,
    dob: '1959-03-08',
    gender: 'Male',
    phone: '+20 122 345 6789',
    email: 'mohamed.ibrahim@example.com',
    address: 'Dokki, Giza, Egypt',
    status: 'Alert: High BP',
    bloodType: 'B+',
    primaryDiagnosis: 'Persistent Atrial Fibrillation (CHA2DS2-VASc = 4)',
    secondaryDiagnoses: ['Severe Systemic Hypertension', 'Moderate Aortic Stenosis (Vmax 3.2 m/s)', 'Mild Sleep Apnea'],
    riskFactors: ['Hypertension > 15 years', 'Obesity (BMI 31.4)'],
    allergies: ['Sulfa drugs'],
    implantedDevices: ['None'],
    lastVisit: '2026-10-20',
    nextAppointment: '2026-10-24'
  },
  {
    id: 'p-4',
    mrn: 'CRD-2026-0774',
    name: 'Sarah Mansour',
    age: 45,
    dob: '1981-08-19',
    gender: 'Female',
    phone: '+20 109 456 7812',
    email: 'sarah.mansour@example.com',
    address: 'Heliopolis, Cairo, Egypt',
    status: 'Stable',
    bloodType: 'AB+',
    primaryDiagnosis: 'Hypertrophic Cardiomyopathy (Non-obstructive)',
    secondaryDiagnoses: ['Sinus Bradycardia (resting HR 52 bpm)', 'Mild Palpitations'],
    riskFactors: ['First-degree relative with sudden cardiac death at age 48'],
    allergies: ['Aspirin (gastric irritation)'],
    implantedDevices: ['Subcutaneous Holter (Reveal LINQ)'],
    lastVisit: '2026-10-10',
    nextAppointment: '2026-11-12'
  },
  {
    id: 'p-5',
    mrn: 'CRD-2026-1195',
    name: 'Tarek Mahmoud',
    age: 54,
    dob: '1972-01-30',
    gender: 'Male',
    phone: '+20 114 998 1234',
    email: 'tarek.mahmoud@example.com',
    address: 'Zamalek, Cairo, Egypt',
    status: 'Pending Lab',
    bloodType: 'O-',
    primaryDiagnosis: 'Unstable Angina (CCS Class III)',
    secondaryDiagnoses: ['Severe Hypercholesterolemia (LDL 184 mg/dL)', 'Microalbuminuria'],
    riskFactors: ['Active Smoker (20 cig/day)', 'High Stress Executive'],
    allergies: ['None known'],
    implantedDevices: ['None'],
    lastVisit: '2026-10-21',
    nextAppointment: '2026-10-23'
  }
];

export const INITIAL_VITALS: VitalSign[] = [
  // Ahmed Hassan
  {
    id: 'v-101',
    patientId: 'p-1',
    timestamp: '2026-10-22T08:30:00Z',
    systolic: 168,
    diastolic: 98,
    heartRate: 88,
    spO2: 97,
    source: 'RPM Device',
    notes: 'Morning measurement after waking. Patient noted mild occipital headache.',
    isAlert: true,
    alertType: 'High BP'
  },
  {
    id: 'v-102',
    patientId: 'p-1',
    timestamp: '2026-10-21T19:45:00Z',
    systolic: 154,
    diastolic: 92,
    heartRate: 82,
    spO2: 98,
    source: 'Patient Portal',
    notes: 'Evening post-dinner check.'
  },
  {
    id: 'v-103',
    patientId: 'p-1',
    timestamp: '2026-10-20T08:15:00Z',
    systolic: 148,
    diastolic: 90,
    heartRate: 76,
    spO2: 97,
    source: 'RPM Device'
  },
  {
    id: 'v-104',
    patientId: 'p-1',
    timestamp: '2026-10-18T10:00:00Z',
    systolic: 142,
    diastolic: 86,
    heartRate: 74,
    spO2: 99,
    source: 'Clinic',
    notes: 'In-office automated Omron reading.'
  },
  {
    id: 'v-105',
    patientId: 'p-1',
    timestamp: '2026-10-15T09:00:00Z',
    systolic: 138,
    diastolic: 84,
    heartRate: 72,
    spO2: 98,
    source: 'RPM Device'
  },
  // Fatma Ali
  {
    id: 'v-201',
    patientId: 'p-2',
    timestamp: '2026-10-22T07:15:00Z',
    systolic: 112,
    diastolic: 72,
    heartRate: 64,
    spO2: 96,
    source: 'RPM Device',
    notes: 'Good adherence to Sacubitril/Valsartan.'
  },
  {
    id: 'v-202',
    patientId: 'p-2',
    timestamp: '2026-10-20T08:00:00Z',
    systolic: 118,
    diastolic: 76,
    heartRate: 68,
    spO2: 96,
    source: 'RPM Device'
  },
  // Mohamed Ibrahim
  {
    id: 'v-301',
    patientId: 'p-3',
    timestamp: '2026-10-22T09:10:00Z',
    systolic: 172,
    diastolic: 104,
    heartRate: 114,
    spO2: 95,
    source: 'RPM Device',
    isAlert: true,
    alertType: 'High BP',
    notes: 'Rapid ventricular response AF episode detected.'
  },
  {
    id: 'v-302',
    patientId: 'p-3',
    timestamp: '2026-10-21T14:30:00Z',
    systolic: 165,
    diastolic: 98,
    heartRate: 108,
    spO2: 96,
    source: 'Patient Portal'
  },
  // Sarah Mansour
  {
    id: 'v-401',
    patientId: 'p-4',
    timestamp: '2026-10-22T10:00:00Z',
    systolic: 116,
    diastolic: 74,
    heartRate: 54,
    spO2: 99,
    source: 'RPM Device',
    notes: 'Resting sinus bradycardia as expected with beta-blockade.'
  },
  // Tarek Mahmoud
  {
    id: 'v-501',
    patientId: 'p-5',
    timestamp: '2026-10-22T08:00:00Z',
    systolic: 145,
    diastolic: 92,
    heartRate: 84,
    spO2: 97,
    source: 'RPM Device'
  }
];

export const INITIAL_ALERTS: RPMAlert[] = [
  {
    id: 'alert-1',
    patientId: 'p-1',
    patientName: 'Ahmed Hassan',
    timestamp: '2026-10-22T08:30:00Z',
    type: 'Critical High BP',
    reading: '168/98 mmHg (HR 88 bpm)',
    level: 'critical',
    acknowledged: false,
    actionTaken: 'Patient contacted; instructed to take extra dose of Ramipril 5mg and recheck in 2 hours.'
  },
  {
    id: 'alert-2',
    patientId: 'p-3',
    patientName: 'Mohamed Ibrahim',
    timestamp: '2026-10-22T09:10:00Z',
    type: 'Severe Tachycardia',
    reading: '172/104 mmHg (HR 114 bpm)',
    level: 'critical',
    acknowledged: false,
    actionTaken: 'Triggered rapid AF protocol review. Teleconsultation recommended.'
  }
];

export const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-101',
    patientId: 'p-1',
    patientName: 'Ahmed Hassan',
    date: '2026-10-18',
    doctorName: 'Dr. Karim El-Sayed, MD, FESC',
    doctorLicense: 'EGY-MED-44912 / ESC #7821',
    clinicName: 'Cardios Heart Care Center & Tele-Cardiology Institute',
    diagnosis: 'Post-STEMI (LAD Stent), Stage 2 Hypertension, Dyslipidemia',
    medications: [
      {
        id: 'm-1',
        name: 'Atorvastatin (Lipitor)',
        genericName: 'Atorvastatin Calcium',
        dosage: '80 mg',
        frequency: 'Once daily at bedtime',
        route: 'Oral',
        duration: '90 days',
        instructions: 'High-intensity statin therapy. Take consistently in the evening.',
        indication: 'Secondary Prevention / Lipid Lowering'
      },
      {
        id: 'm-2',
        name: 'Aspirin (Cardipirin)',
        genericName: 'Acetylsalicylic Acid',
        dosage: '81 mg',
        frequency: 'Once daily after lunch',
        route: 'Oral',
        duration: '90 days',
        instructions: 'Take with food to minimize GI irritation.',
        indication: 'Antiplatelet / Post-PCI'
      },
      {
        id: 'm-3',
        name: 'Ticagrelor (Brilinta)',
        genericName: 'Ticagrelor',
        dosage: '90 mg',
        frequency: 'Twice daily (every 12 hours)',
        route: 'Oral',
        duration: '90 days',
        instructions: 'Dual antiplatelet therapy for 12 months post-DES.',
        indication: 'P2Y12 Inhibitor'
      },
      {
        id: 'm-4',
        name: 'Ramipril (Tritace)',
        genericName: 'Ramipril',
        dosage: '5 mg',
        frequency: 'Once daily in the morning',
        route: 'Oral',
        duration: '30 days',
        instructions: 'Titration to 10mg planned after lab check (eGFR & K+).',
        indication: 'ACE Inhibitor / BP Control'
      },
      {
        id: 'm-5',
        name: 'Bisoprolol (Concor)',
        genericName: 'Bisoprolol Fumarate',
        dosage: '5 mg',
        frequency: 'Once daily in the morning',
        route: 'Oral',
        duration: '90 days',
        instructions: 'Target resting heart rate 60-70 bpm.',
        indication: 'Cardioselective Beta-Blocker'
      }
    ],
    clinicalNotes: 'Maintain home blood pressure monitoring via Cardios RPM. Maintain strict salt restriction (<2g sodium/day).',
    nextFollowUp: '2026-10-25'
  }
];

export const INITIAL_LABS: LabTest[] = [
  {
    id: 'lab-1',
    patientId: 'p-1',
    testName: 'High-Sensitivity Troponin I',
    date: '2026-10-18',
    result: '14.2',
    unit: 'ng/L',
    referenceRange: '< 19.8 ng/L',
    status: 'Normal',
    category: 'Cardiac Biomarkers',
    notes: 'Post-PCI baseline within normal limits.'
  },
  {
    id: 'lab-2',
    patientId: 'p-1',
    testName: 'Lipid Profile (LDL-C)',
    date: '2026-10-18',
    result: '112',
    unit: 'mg/dL',
    referenceRange: '< 55 mg/dL (Very High Risk)',
    status: 'Abnormal',
    category: 'Lipid & Metabolic',
    notes: 'Needs aggressive reduction to reach target <55 mg/dL.'
  },
  {
    id: 'lab-3',
    patientId: 'p-1',
    testName: 'Serum Creatinine & eGFR',
    date: '2026-10-18',
    result: '1.1 mg/dL (eGFR 78)',
    unit: 'mg/dL',
    referenceRange: '0.7 - 1.2 mg/dL',
    status: 'Normal',
    category: 'Renal & Electrolytes'
  },
  {
    id: 'lab-4',
    patientId: 'p-2',
    testName: 'NT-proBNP (B-Type Natriuretic)',
    date: '2026-10-21',
    result: 'Pending Analysis',
    unit: 'pg/mL',
    referenceRange: '< 125 pg/mL',
    status: 'Pending Review',
    category: 'Cardiac Biomarkers',
    notes: 'Specimen in central lab. Evaluating heart failure compensation.'
  },
  {
    id: 'lab-5',
    patientId: 'p-5',
    testName: 'High-Sensitivity Troponin T',
    date: '2026-10-21',
    result: 'Pending Run (STAT)',
    unit: 'ng/L',
    referenceRange: '< 14 ng/L',
    status: 'Pending Review',
    category: 'Cardiac Biomarkers',
    notes: 'Rule out non-ST elevation acute coronary syndrome.'
  }
];

export const INITIAL_REPORTS: CardiologyReportData[] = [
  {
    id: 'rep-echo-01',
    patientId: 'p-1',
    patientName: 'Ahmed Hassan',
    date: '2026-10-18',
    type: 'Echocardiogram',
    doctorName: 'Dr. Karim El-Sayed, MD, FESC',
    indication: 'Post-PCI follow-up, assessment of left ventricular function and regional wall motion.',
    ejectionFraction: 48,
    lvEndDiastolicDiam: 54,
    lvEndSystolicDiam: 38,
    wallMotionAbnormality: 'Hypokinesia of the mid and apical anterior walls and cardiac apex (LAD territory). Other segments normokinetic.',
    valvularFindings: 'Mild mitral regurgitation (grade 1/4). Aortic valve trileaflet with no stenosis or regurgitation. Normal tricuspid valve.',
    diastolicFunction: 'Grade 1 diastolic dysfunction (impaired relaxation, E/A ratio 0.72).',
    pericardialEffusion: 'No pericardial effusion or intracardiac thrombus detected.',
    conclusions: [
      'Moderately reduced Left Ventricular Systolic Function (LVEF ~48%).',
      'Antero-apical regional wall motion abnormalities consistent with prior LAD infarction.',
      'Mild functional mitral regurgitation secondary to annular remodelling.',
      'No intracardiac masses or pericardial effusion.'
    ],
    recommendations: [
      'Continue guideline-directed medical therapy (GDMT) including ACEi, beta-blocker, and high-intensity statin.',
      'Repeat Transthoracic Echocardiogram in 3 to 6 months to assess myocardial recovery.',
      'Enroll in outpatient cardiac rehabilitation program.'
    ]
  },
  {
    id: 'rep-ecg-01',
    patientId: 'p-1',
    patientName: 'Ahmed Hassan',
    date: '2026-10-18',
    type: '12-Lead ECG',
    doctorName: 'Dr. Karim El-Sayed, MD, FESC',
    indication: 'Routine outpatient post-PCI rhythm and ischemia screening.',
    rhythm: 'Normal Sinus Rhythm',
    rate: 74,
    prInterval: 162,
    qrsDuration: 94,
    qtcInterval: 428,
    stSegment: 'Pathological Q-waves in V1-V3. T-wave inversion in V2-V4 resolving compared to acute phase. No acute ST elevations.',
    conclusions: [
      'Sinus rhythm at 74 bpm.',
      'Evolutionary anterior wall myocardial infarction with stable Q waves in V1-V3.',
      'No ventricular ectopy or new conduction block.'
    ],
    recommendations: [
      'Maintain continuous RPM telemetry monitoring.',
      'Immediate medical evaluation if recurrent chest tightness or palpitations occur.'
    ]
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-101',
    patientId: 'p-1',
    patientName: 'Ahmed Hassan',
    invoiceNumber: 'INV-2026-0089',
    date: '2026-10-18',
    items: [
      { id: 'item-1', description: 'Comprehensive Cardiology Consultation & Clinical Exam', category: 'Consultation', amount: 120 },
      { id: 'item-2', description: 'Transthoracic Echocardiogram (TTE) with Doppler & Strain', category: 'Echocardiography', amount: 250 },
      { id: 'item-3', description: '12-Lead Electrocardiogram (ECG) with Digital Interpretation', category: 'Diagnostic (ECG)', amount: 50 },
      { id: 'item-4', description: 'Monthly Cardios Remote Patient Monitoring (RPM) Device & Cellular Link', category: 'RPM Subscription', amount: 80 }
    ],
    totalAmount: 500,
    status: 'Paid',
    paymentMethod: 'Credit Card',
    notes: 'Covered under PrimeHealth Cardiology Preferred Tier.'
  },
  {
    id: 'inv-102',
    patientId: 'p-3',
    patientName: 'Mohamed Ibrahim',
    invoiceNumber: 'INV-2026-0092',
    date: '2026-10-20',
    items: [
      { id: 'item-5', description: 'Urgent Arrhythmia Evaluation & 12-Lead ECG', category: 'Diagnostic (ECG)', amount: 90 },
      { id: 'item-6', description: 'Follow-up Cardiology Visit', category: 'Consultation', amount: 80 }
    ],
    totalAmount: 170,
    status: 'Pending',
    notes: 'Pending patient payment gateway processing.'
  }
];

export const INITIAL_REFERRALS: Referral[] = [
  {
    id: 'ref-101',
    patientId: 'p-1',
    patientName: 'Ahmed Hassan',
    referralDate: '2026-10-18',
    targetFacilityOrSpecialist: 'Cairo Cardiac Interventional Suites / Prof. Dr. Sameh Farouk',
    specialty: 'Cath Lab / Coronary Angiography',
    priority: 'Routine',
    clinicalSummary: '62yo M with anterior STEMI status post primary PCI to mid-LAD with DES 3 months ago. Mild residual exertional dyspnea.',
    reasonForReferral: 'Staged evaluation of intermediate 60% lesion in distal Circumflex artery with FFR / physiological assessment.',
    status: 'Sent'
  },
  {
    id: 'ref-102',
    patientId: 'p-2',
    patientName: 'Fatma Ali',
    referralDate: '2026-10-14',
    targetFacilityOrSpecialist: 'Heart Failure & Transplant Center / Dr. Mona Zaki',
    specialty: 'Electrophysiology',
    priority: 'Urgent',
    clinicalSummary: '58yo F with dilated cardiomyopathy, LVEF 34%, LBBB with QRS duration 154 ms on optimal medical therapy > 3 months.',
    reasonForReferral: 'Evaluation for Cardiac Resynchronization Therapy Defibrillator (CRT-D) implantation.',
    status: 'Pending'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    patientId: 'p-1',
    patientName: 'Ahmed Hassan',
    date: '2026-10-22',
    time: '14:30',
    type: 'Post-PCI Check',
    status: 'In Progress',
    reason: 'Review RPM high BP alert and medication titration.',
    notes: 'Patient logged elevated morning BP 168/98 mmHg.'
  },
  {
    id: 'apt-2',
    patientId: 'p-3',
    patientName: 'Mohamed Ibrahim',
    date: '2026-10-22',
    time: '16:00',
    type: 'RPM Review',
    status: 'Scheduled',
    reason: 'Atrial fibrillation rate control check & telemetry report.',
    notes: 'Holter 24h results ready.'
  },
  {
    id: 'apt-3',
    patientId: 'p-5',
    patientName: 'Tarek Mahmoud',
    date: '2026-10-23',
    time: '11:00',
    type: 'Initial Consultation',
    status: 'Scheduled',
    reason: 'STAT evaluation of exertional angina and pending troponins.',
    notes: 'Prepare referral to Cath Lab if positive.'
  },
  {
    id: 'apt-4',
    patientId: 'p-2',
    patientName: 'Fatma Ali',
    date: '2026-10-28',
    time: '10:00',
    type: 'Echo Follow-up',
    status: 'Scheduled',
    reason: 'Review NT-proBNP and CRT-D referral discussion.'
  }
];

// Cardiology Drug Database for Intelligent Auto-complete
export const CARDIOLOGY_DRUGS = [
  { name: 'Atorvastatin (Lipitor)', generic: 'Atorvastatin Calcium', dosages: ['10 mg', '20 mg', '40 mg', '80 mg'], frequency: 'Once daily at bedtime', indication: 'Lipid lowering / Statin' },
  { name: 'Rosuvastatin (Crestor)', generic: 'Rosuvastatin Zinc', dosages: ['5 mg', '10 mg', '20 mg', '40 mg'], frequency: 'Once daily at bedtime', indication: 'High-intensity Statin' },
  { name: 'Bisoprolol (Concor)', generic: 'Bisoprolol Fumarate', dosages: ['2.5 mg', '5 mg', '10 mg'], frequency: 'Once daily in the morning', indication: 'Beta-1 selective blocker' },
  { name: 'Carvedilol (Dilatrend)', generic: 'Carvedilol', dosages: ['3.125 mg', '6.25 mg', '12.5 mg', '25 mg'], frequency: 'Twice daily with food', indication: 'Alpha & Beta blocker (Heart Failure)' },
  { name: 'Metoprolol Succinate (Betaloc ZOK)', generic: 'Metoprolol Succinate ER', dosages: ['25 mg', '50 mg', '100 mg', '200 mg'], frequency: 'Once daily in the morning', indication: 'Long-acting Beta blocker' },
  { name: 'Ramipril (Tritace)', generic: 'Ramipril', dosages: ['2.5 mg', '5 mg', '10 mg'], frequency: 'Once daily', indication: 'ACE Inhibitor' },
  { name: 'Perindopril (Coversyl)', generic: 'Perindopril Arginine', dosages: ['2.5 mg', '5 mg', '10 mg'], frequency: 'Once daily in the morning', indication: 'ACE Inhibitor' },
  { name: 'Sacubitril / Valsartan (Entresto)', generic: 'Sacubitril/Valsartan', dosages: ['24/26 mg', '49/51 mg', '97/103 mg'], frequency: 'Twice daily', indication: 'ARNI (HFrEF first-line)' },
  { name: 'Valsartan (Tareg / Diovan)', generic: 'Valsartan', dosages: ['80 mg', '160 mg', '320 mg'], frequency: 'Once or twice daily', indication: 'Angiotensin Receptor Blocker' },
  { name: 'Amlodipine (Norvasc)', generic: 'Amlodipine Besylate', dosages: ['2.5 mg', '5 mg', '10 mg'], frequency: 'Once daily in the evening', indication: 'Dihydropyridine CCB' },
  { name: 'Empagliflozin (Jardiance)', generic: 'Empagliflozin', dosages: ['10 mg', '25 mg'], frequency: 'Once daily in the morning', indication: 'SGLT2 Inhibitor (Heart Failure & CAD)' },
  { name: 'Dapagliflozin (Forxiga)', generic: 'Dapagliflozin', dosages: ['10 mg'], frequency: 'Once daily in the morning', indication: 'SGLT2 Inhibitor' },
  { name: 'Spironolactone (Aldactone)', generic: 'Spironolactone', dosages: ['25 mg', '50 mg'], frequency: 'Once daily with meals', indication: 'Mineralocorticoid receptor antagonist' },
  { name: 'Eplerenone (Inspra)', generic: 'Eplerenone', dosages: ['25 mg', '50 mg'], frequency: 'Once daily', indication: 'Selective MRA' },
  { name: 'Aspirin (Cardipirin / Aspocid)', generic: 'Acetylsalicylic Acid', dosages: ['75 mg', '81 mg', '100 mg'], frequency: 'Once daily with meals', indication: 'Antiplatelet' },
  { name: 'Clopidogrel (Plavix)', generic: 'Clopidogrel Bisulfate', dosages: ['75 mg'], frequency: 'Once daily', indication: 'P2Y12 Antiplatelet' },
  { name: 'Ticagrelor (Brilinta)', generic: 'Ticagrelor', dosages: ['60 mg', '90 mg'], frequency: 'Twice daily', indication: 'P2Y12 Inhibitor (ACS)' },
  { name: 'Apixaban (Eliquis)', generic: 'Apixaban', dosages: ['2.5 mg', '5 mg'], frequency: 'Twice daily', indication: 'DOAC Anticoagulant (AF / DVT)' },
  { name: 'Rivaroxaban (Xarelto)', generic: 'Rivaroxaban', dosages: ['10 mg', '15 mg', '20 mg'], frequency: 'Once daily with evening meal', indication: 'DOAC Anticoagulant' },
  { name: 'Furosemide (Lasix)', generic: 'Furosemide', dosages: ['20 mg', '40 mg', '80 mg'], frequency: 'Morning on empty stomach', indication: 'Loop Diuretic' }
];

export const PRESCRIPTION_TEMPLATES = [
  {
    name: 'Post-PCI Dual Antiplatelet & Secondary Prevention',
    indication: 'Acute Coronary Syndrome status post Drug-Eluting Stent',
    medications: [
      { name: 'Aspirin (Cardipirin)', genericName: 'Acetylsalicylic Acid', dosage: '81 mg', frequency: 'Once daily after lunch', route: 'Oral', duration: '90 days', instructions: 'Take with food.' },
      { name: 'Ticagrelor (Brilinta)', genericName: 'Ticagrelor', dosage: '90 mg', frequency: 'Twice daily (q12h)', route: 'Oral', duration: '90 days', instructions: 'Dual antiplatelet for 12 months.' },
      { name: 'Atorvastatin (Lipitor)', genericName: 'Atorvastatin Calcium', dosage: '80 mg', frequency: 'Once daily at bedtime', route: 'Oral', duration: '90 days', instructions: 'Target LDL < 55 mg/dL.' },
      { name: 'Bisoprolol (Concor)', genericName: 'Bisoprolol Fumarate', dosage: '5 mg', frequency: 'Once daily', route: 'Oral', duration: '90 days', instructions: 'Target resting HR 60-70 bpm.' }
    ]
  },
  {
    name: 'Heart Failure GDMT Quadruple Therapy',
    indication: 'HFrEF (EF < 40%) Guideline-Directed Medical Therapy',
    medications: [
      { name: 'Sacubitril / Valsartan (Entresto)', genericName: 'Sacubitril/Valsartan', dosage: '49/51 mg', frequency: 'Twice daily', route: 'Oral', duration: '30 days', instructions: 'ARNI first line. Monitor BP and K+.' },
      { name: 'Bisoprolol (Concor)', genericName: 'Bisoprolol Fumarate', dosage: '2.5 mg', frequency: 'Once daily', route: 'Oral', duration: '30 days', instructions: 'Titrate slowly every 2-4 weeks.' },
      { name: 'Empagliflozin (Jardiance)', genericName: 'Empagliflozin', dosage: '10 mg', frequency: 'Once daily in morning', route: 'Oral', duration: '30 days', instructions: 'Maintain hydration.' },
      { name: 'Spironolactone (Aldactone)', genericName: 'Spironolactone', dosage: '25 mg', frequency: 'Once daily with meals', route: 'Oral', duration: '30 days', instructions: 'Recheck K+ and creatinine in 2 weeks.' }
    ]
  },
  {
    name: 'Stage 2 Hypertension Dual Combination',
    indication: 'Uncontrolled blood pressure > 160/100 mmHg',
    medications: [
      { name: 'Ramipril (Tritace)', genericName: 'Ramipril', dosage: '10 mg', frequency: 'Once daily in morning', route: 'Oral', duration: '60 days', instructions: 'Daily RPM log required.' },
      { name: 'Amlodipine (Norvasc)', genericName: 'Amlodipine Besylate', dosage: '5 mg', frequency: 'Once daily in evening', route: 'Oral', duration: '60 days', instructions: 'Monitor for mild pedal edema.' }
    ]
  },
  {
    name: 'Atrial Fibrillation Stroke Prevention & Rate Control',
    indication: 'Non-valvular AF with CHA2DS2-VASc score >= 2',
    medications: [
      { name: 'Apixaban (Eliquis)', genericName: 'Apixaban', dosage: '5 mg', frequency: 'Twice daily', route: 'Oral', duration: '90 days', instructions: 'Strict compliance without skipping doses.' },
      { name: 'Bisoprolol (Concor)', genericName: 'Bisoprolol Fumarate', dosage: '5 mg', frequency: 'Once daily in morning', route: 'Oral', duration: '90 days', instructions: 'Target resting HR < 80 bpm.' }
    ]
  }
];
