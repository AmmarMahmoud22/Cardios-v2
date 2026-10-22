import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db, isFirestoreAvailable } from './config';
import { 
  Patient, 
  VitalSign, 
  Prescription, 
  LabTest, 
  CardiologyReportData, 
  Invoice, 
  Referral, 
  Appointment, 
  RPMAlert 
} from '../types';
import { 
  INITIAL_PATIENTS, 
  INITIAL_VITALS, 
  INITIAL_ALERTS, 
  INITIAL_PRESCRIPTIONS, 
  INITIAL_LABS, 
  INITIAL_REPORTS, 
  INITIAL_INVOICES, 
  INITIAL_REFERRALS, 
  INITIAL_APPOINTMENTS 
} from '../data/mockData';

// Local storage keys for resilient fallback / offline mode
const STORAGE_KEYS = {
  PATIENTS: 'cardios_patients_v1',
  VITALS: 'cardios_vitals_v1',
  ALERTS: 'cardios_alerts_v1',
  PRESCRIPTIONS: 'cardios_prescriptions_v1',
  LABS: 'cardios_labs_v1',
  REPORTS: 'cardios_reports_v1',
  INVOICES: 'cardios_invoices_v1',
  REFERRALS: 'cardios_referrals_v1',
  APPOINTMENTS: 'cardios_appointments_v1',
};

// In-memory cache & event listeners for real-time reactivity in both modes
type ListenerCallback<T> = (data: T) => void;
const alertListeners: Set<ListenerCallback<RPMAlert[]>> = new Set();
const vitalsListeners: Map<string, Set<ListenerCallback<VitalSign[]>>> = new Map();

function getLocalData<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(item);
  } catch {
    return defaultVal;
  }
}

function setLocalData<T>(key: string, data: T) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }
}

// Check and trigger RPM alert logic
export function checkVitalsForAlert(vital: VitalSign, patientName: string): RPMAlert | null {
  let isAlert = false;
  let alertType: RPMAlert['type'] = 'Critical High BP';
  let reading = `${vital.systolic}/${vital.diastolic} mmHg (HR ${vital.heartRate} bpm)`;
  let level: RPMAlert['level'] = 'warning';

  if (vital.systolic >= 160 || vital.diastolic >= 100) {
    isAlert = true;
    alertType = vital.systolic >= 180 || vital.diastolic >= 110 ? 'Hypertensive Urgency' : 'Critical High BP';
    level = 'critical';
  } else if (vital.heartRate >= 110) {
    isAlert = true;
    alertType = 'Severe Tachycardia';
    level = 'critical';
  } else if (vital.heartRate > 0 && vital.heartRate < 50) {
    isAlert = true;
    alertType = 'Severe Bradycardia';
    level = 'warning';
  }

  if (isAlert) {
    return {
      id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      patientId: vital.patientId,
      patientName,
      timestamp: vital.timestamp || new Date().toISOString(),
      type: alertType,
      reading,
      level,
      acknowledged: false,
      actionTaken: 'Real-time RPM telemetry flagged anomaly. Clinical review required.'
    };
  }
  return null;
}

// ---------------- PATIENTS ----------------
export async function fetchPatients(): Promise<Patient[]> {
  if (isFirestoreAvailable && db) {
    try {
      const snap = await getDocs(collection(db, 'patients'));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Patient));
      }
    } catch (e) {
      console.warn('Firestore fetchPatients failed, using local store:', e);
    }
  }
  return getLocalData(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
}

export async function fetchPatientById(id: string): Promise<Patient | null> {
  const all = await fetchPatients();
  return all.find(p => p.id === id) || null;
}

export async function savePatient(patient: Patient): Promise<Patient> {
  if (isFirestoreAvailable && db) {
    try {
      await setDoc(doc(db, 'patients', patient.id), patient);
    } catch (e) {
      console.warn('Firestore savePatient failed:', e);
    }
  }
  const current = getLocalData<Patient[]>(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
  const idx = current.findIndex(p => p.id === patient.id);
  let updated: Patient[];
  if (idx >= 0) {
    updated = [...current];
    updated[idx] = patient;
  } else {
    updated = [patient, ...current];
  }
  setLocalData(STORAGE_KEYS.PATIENTS, updated);
  return patient;
}

// ---------------- VITALS & RPM ----------------
export async function fetchVitals(patientId?: string): Promise<VitalSign[]> {
  if (isFirestoreAvailable && db) {
    try {
      let q = query(collection(db, 'vitals'), orderBy('timestamp', 'desc'));
      if (patientId) {
        q = query(collection(db, 'vitals'), where('patientId', '==', patientId), orderBy('timestamp', 'desc'));
      }
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as VitalSign));
      }
    } catch (e) {
      console.warn('Firestore fetchVitals fallback:', e);
    }
  }
  const all = getLocalData<VitalSign[]>(STORAGE_KEYS.VITALS, INITIAL_VITALS);
  if (patientId) {
    return all.filter(v => v.patientId === patientId);
  }
  return all;
}

export async function logVitalSign(vital: Omit<VitalSign, 'id'>, patientName: string): Promise<VitalSign> {
  const newVital: VitalSign = {
    ...vital,
    id: `v-${Date.now()}`
  };

  const alert = checkVitalsForAlert(newVital, patientName);
  if (alert) {
    newVital.isAlert = true;
    newVital.alertType = alert.type === 'Severe Tachycardia' ? 'Tachycardia' : alert.type === 'Severe Bradycardia' ? 'Bradycardia' : 'High BP';
    await saveRPMAlert(alert);
  }

  if (isFirestoreAvailable && db) {
    try {
      await setDoc(doc(db, 'vitals', newVital.id), newVital);
    } catch (e) {
      console.warn('Firestore logVitalSign fallback:', e);
    }
  }

  const current = getLocalData<VitalSign[]>(STORAGE_KEYS.VITALS, INITIAL_VITALS);
  const updated = [newVital, ...current];
  setLocalData(STORAGE_KEYS.VITALS, updated);

  // Notify listeners for patient
  const patientListeners = vitalsListeners.get(newVital.patientId);
  if (patientListeners) {
    const filtered = updated.filter(v => v.patientId === newVital.patientId);
    patientListeners.forEach(cb => cb(filtered));
  }

  // Update patient status if alert
  if (alert) {
    const patients = await fetchPatients();
    const pat = patients.find(p => p.id === newVital.patientId);
    if (pat && pat.status !== 'Alert: High BP') {
      pat.status = 'Alert: High BP';
      await savePatient(pat);
    }
  }

  return newVital;
}

// ---------------- RPM ALERTS ----------------
export async function fetchRPMAlerts(): Promise<RPMAlert[]> {
  if (isFirestoreAvailable && db) {
    try {
      const snap = await getDocs(query(collection(db, 'rpm_alerts'), orderBy('timestamp', 'desc')));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as RPMAlert));
      }
    } catch (e) {
      console.warn('Firestore fetchRPMAlerts fallback:', e);
    }
  }
  return getLocalData(STORAGE_KEYS.ALERTS, INITIAL_ALERTS);
}

export async function saveRPMAlert(alert: RPMAlert): Promise<RPMAlert> {
  if (isFirestoreAvailable && db) {
    try {
      await setDoc(doc(db, 'rpm_alerts', alert.id), alert);
    } catch (e) {
      console.warn('Firestore saveRPMAlert fallback:', e);
    }
  }
  const current = getLocalData<RPMAlert[]>(STORAGE_KEYS.ALERTS, INITIAL_ALERTS);
  const updated = [alert, ...current.filter(a => a.id !== alert.id)];
  setLocalData(STORAGE_KEYS.ALERTS, updated);

  alertListeners.forEach(cb => cb(updated));
  return alert;
}

export async function acknowledgeRPMAlert(alertId: string, actionTaken?: string): Promise<void> {
  if (isFirestoreAvailable && db) {
    try {
      await updateDoc(doc(db, 'rpm_alerts', alertId), {
        acknowledged: true,
        actionTaken: actionTaken || 'Acknowledged by Cardiologist'
      });
    } catch (e) {
      console.warn('Firestore acknowledgeRPMAlert fallback:', e);
    }
  }
  const current = getLocalData<RPMAlert[]>(STORAGE_KEYS.ALERTS, INITIAL_ALERTS);
  const updated = current.map(a => a.id === alertId ? { ...a, acknowledged: true, actionTaken: actionTaken || 'Acknowledged by Cardiologist' } : a);
  setLocalData(STORAGE_KEYS.ALERTS, updated);
  alertListeners.forEach(cb => cb(updated));
}

export function subscribeToRPMAlerts(callback: ListenerCallback<RPMAlert[]>): () => void {
  alertListeners.add(callback);
  // Send initial data immediately
  fetchRPMAlerts().then(callback);

  if (isFirestoreAvailable && db) {
    try {
      const unsubscribe = onSnapshot(query(collection(db, 'rpm_alerts'), orderBy('timestamp', 'desc')), snap => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as RPMAlert));
        callback(data);
      });
      return () => {
        alertListeners.delete(callback);
        unsubscribe();
      };
    } catch (e) {
      console.warn('Firestore onSnapshot listener fallback:', e);
    }
  }

  return () => {
    alertListeners.delete(callback);
  };
}

export function subscribeToPatientVitals(patientId: string, callback: ListenerCallback<VitalSign[]>): () => void {
  if (!vitalsListeners.has(patientId)) {
    vitalsListeners.set(patientId, new Set());
  }
  vitalsListeners.get(patientId)!.add(callback);
  fetchVitals(patientId).then(callback);

  return () => {
    vitalsListeners.get(patientId)?.delete(callback);
  };
}

// ---------------- PRESCRIPTIONS ----------------
export async function fetchPrescriptions(patientId?: string): Promise<Prescription[]> {
  if (isFirestoreAvailable && db) {
    try {
      let q = query(collection(db, 'prescriptions'), orderBy('date', 'desc'));
      if (patientId) {
        q = query(collection(db, 'prescriptions'), where('patientId', '==', patientId));
      }
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Prescription));
      }
    } catch (e) {
      console.warn('Firestore fetchPrescriptions fallback:', e);
    }
  }
  const all = getLocalData<Prescription[]>(STORAGE_KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS);
  return patientId ? all.filter(p => p.patientId === patientId) : all;
}

export async function savePrescription(prescription: Prescription): Promise<Prescription> {
  if (isFirestoreAvailable && db) {
    try {
      await setDoc(doc(db, 'prescriptions', prescription.id), prescription);
    } catch (e) {
      console.warn('Firestore savePrescription fallback:', e);
    }
  }
  const current = getLocalData<Prescription[]>(STORAGE_KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS);
  const updated = [prescription, ...current.filter(p => p.id !== prescription.id)];
  setLocalData(STORAGE_KEYS.PRESCRIPTIONS, updated);
  return prescription;
}

// ---------------- LAB TESTS ----------------
export async function fetchLabs(patientId?: string): Promise<LabTest[]> {
  if (isFirestoreAvailable && db) {
    try {
      let q = query(collection(db, 'labs'), orderBy('date', 'desc'));
      if (patientId) {
        q = query(collection(db, 'labs'), where('patientId', '==', patientId));
      }
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as LabTest));
      }
    } catch (e) {
      console.warn('Firestore fetchLabs fallback:', e);
    }
  }
  const all = getLocalData<LabTest[]>(STORAGE_KEYS.LABS, INITIAL_LABS);
  return patientId ? all.filter(l => l.patientId === patientId) : all;
}

export async function saveLabTest(lab: LabTest): Promise<LabTest> {
  if (isFirestoreAvailable && db) {
    try {
      await setDoc(doc(db, 'labs', lab.id), lab);
    } catch (e) {
      console.warn('Firestore saveLabTest fallback:', e);
    }
  }
  const current = getLocalData<LabTest[]>(STORAGE_KEYS.LABS, INITIAL_LABS);
  const updated = [lab, ...current.filter(l => l.id !== lab.id)];
  setLocalData(STORAGE_KEYS.LABS, updated);
  return lab;
}

// ---------------- CARDIOLOGY REPORTS ----------------
export async function fetchReports(patientId?: string): Promise<CardiologyReportData[]> {
  if (isFirestoreAvailable && db) {
    try {
      let q = query(collection(db, 'reports'), orderBy('date', 'desc'));
      if (patientId) {
        q = query(collection(db, 'reports'), where('patientId', '==', patientId));
      }
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as CardiologyReportData));
      }
    } catch (e) {
      console.warn('Firestore fetchReports fallback:', e);
    }
  }
  const all = getLocalData<CardiologyReportData[]>(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
  return patientId ? all.filter(r => r.patientId === patientId) : all;
}

export async function saveReport(report: CardiologyReportData): Promise<CardiologyReportData> {
  if (isFirestoreAvailable && db) {
    try {
      await setDoc(doc(db, 'reports', report.id), report);
    } catch (e) {
      console.warn('Firestore saveReport fallback:', e);
    }
  }
  const current = getLocalData<CardiologyReportData[]>(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
  const updated = [report, ...current.filter(r => r.id !== report.id)];
  setLocalData(STORAGE_KEYS.REPORTS, updated);
  return report;
}

// ---------------- INVOICES ----------------
export async function fetchInvoices(patientId?: string): Promise<Invoice[]> {
  if (isFirestoreAvailable && db) {
    try {
      let q = query(collection(db, 'invoices'), orderBy('date', 'desc'));
      if (patientId) {
        q = query(collection(db, 'invoices'), where('patientId', '==', patientId));
      }
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Invoice));
      }
    } catch (e) {
      console.warn('Firestore fetchInvoices fallback:', e);
    }
  }
  const all = getLocalData<Invoice[]>(STORAGE_KEYS.INVOICES, INITIAL_INVOICES);
  return patientId ? all.filter(i => i.patientId === patientId) : all;
}

export async function saveInvoice(invoice: Invoice): Promise<Invoice> {
  if (isFirestoreAvailable && db) {
    try {
      await setDoc(doc(db, 'invoices', invoice.id), invoice);
    } catch (e) {
      console.warn('Firestore saveInvoice fallback:', e);
    }
  }
  const current = getLocalData<Invoice[]>(STORAGE_KEYS.INVOICES, INITIAL_INVOICES);
  const updated = [invoice, ...current.filter(i => i.id !== invoice.id)];
  setLocalData(STORAGE_KEYS.INVOICES, updated);
  return invoice;
}

// ---------------- REFERRALS ----------------
export async function fetchReferrals(patientId?: string): Promise<Referral[]> {
  if (isFirestoreAvailable && db) {
    try {
      let q = query(collection(db, 'referrals'), orderBy('referralDate', 'desc'));
      if (patientId) {
        q = query(collection(db, 'referrals'), where('patientId', '==', patientId));
      }
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Referral));
      }
    } catch (e) {
      console.warn('Firestore fetchReferrals fallback:', e);
    }
  }
  const all = getLocalData<Referral[]>(STORAGE_KEYS.REFERRALS, INITIAL_REFERRALS);
  return patientId ? all.filter(r => r.patientId === patientId) : all;
}

export async function saveReferral(referral: Referral): Promise<Referral> {
  if (isFirestoreAvailable && db) {
    try {
      await setDoc(doc(db, 'referrals', referral.id), referral);
    } catch (e) {
      console.warn('Firestore saveReferral fallback:', e);
    }
  }
  const current = getLocalData<Referral[]>(STORAGE_KEYS.REFERRALS, INITIAL_REFERRALS);
  const updated = [referral, ...current.filter(r => r.id !== referral.id)];
  setLocalData(STORAGE_KEYS.REFERRALS, updated);
  return referral;
}

// ---------------- APPOINTMENTS ----------------
export async function fetchAppointments(): Promise<Appointment[]> {
  if (isFirestoreAvailable && db) {
    try {
      const snap = await getDocs(query(collection(db, 'appointments'), orderBy('date', 'asc')));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as Appointment));
      }
    } catch (e) {
      console.warn('Firestore fetchAppointments fallback:', e);
    }
  }
  return getLocalData(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
}

export async function saveAppointment(appointment: Appointment): Promise<Appointment> {
  if (isFirestoreAvailable && db) {
    try {
      await setDoc(doc(db, 'appointments', appointment.id), appointment);
    } catch (e) {
      console.warn('Firestore saveAppointment fallback:', e);
    }
  }
  const current = getLocalData<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  const updated = [appointment, ...current.filter(a => a.id !== appointment.id)];
  setLocalData(STORAGE_KEYS.APPOINTMENTS, updated);
  return appointment;
}
