import React, { useState, useEffect } from 'react';
import { 
  Patient, 
  VitalSign, 
  Prescription, 
  LabTest, 
  CardiologyReportData, 
  Invoice, 
  Referral, 
  RPMAlert 
} from '../types';
import { 
  fetchVitals, 
  fetchPrescriptions, 
  fetchLabs, 
  fetchReports, 
  fetchInvoices, 
  fetchReferrals, 
  logVitalSign, 
  acknowledgeRPMAlert,
  subscribeToPatientVitals
} from '../firebase/firestoreService';
import { VitalsChart } from './VitalsChart';
import { SmartPrescription } from './SmartPrescription';
import { PrintablePrescription } from './PrintablePrescription';
import { CardiologyReport } from './CardiologyReport';
import { PrintableReport } from './PrintableReport';
import { LabReviewModal } from './LabReviewModal';
import { BillingModal } from './BillingModal';
import { ReferralModal } from './ReferralModal';
import { GeminiChat } from './GeminiChat';
import { 
  Heart, 
  Activity, 
  Pill, 
  FileText, 
  Sparkles, 
  CreditCard, 
  Share2, 
  AlertTriangle, 
  Plus, 
  Printer, 
  CheckCircle2, 
  ArrowLeft, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  Calendar 
} from 'lucide-react';

interface PatientProfileProps {
  patient: Patient;
  onBackToDashboard: () => void;
  onPatientUpdated: (patient: Patient) => void;
}

export const PatientProfile: React.FC<PatientProfileProps> = ({
  patient,
  onBackToDashboard,
  onPatientUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'prescription' | 'reports' | 'billing' | 'referrals'>('overview');

  // Loaded Patient Data
  const [vitals, setVitals] = useState<VitalSign[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [labs, setLabs] = useState<LabTest[]>([]);
  const [reports, setReports] = useState<CardiologyReportData[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);

  // Modals
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [isReferralOpen, setIsReferralOpen] = useState(false);
  const [isLabReviewOpen, setIsLabReviewOpen] = useState(false);

  // Print Preview Modals
  const [printingPrescription, setPrintingPrescription] = useState<Prescription | null>(null);
  const [printingReport, setPrintingReport] = useState<CardiologyReportData | null>(null);

  // Quick Vitals Entry Form State
  const [quickSystolic, setQuickSystolic] = useState<number>(130);
  const [quickDiastolic, setQuickDiastolic] = useState<number>(85);
  const [quickHR, setQuickHR] = useState<number>(76);
  const [quickNotes, setQuickNotes] = useState('In-clinic automated check');
  const [isLoggingVital, setIsLoggingVital] = useState(false);

  // Load patient data dynamically based on patient.id
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      const [vits, rxs, lb, rep, inv, ref] = await Promise.all([
        fetchVitals(patient.id),
        fetchPrescriptions(patient.id),
        fetchLabs(patient.id),
        fetchReports(patient.id),
        fetchInvoices(patient.id),
        fetchReferrals(patient.id),
      ]);

      if (isMounted) {
        setVitals(vits);
        setPrescriptions(rxs);
        setLabs(lb);
        setReports(rep);
        setInvoices(inv);
        setReferrals(ref);
      }
    }

    loadData();

    // Subscribe to real-time vitals for this patient
    const unsub = subscribeToPatientVitals(patient.id, updatedVitals => {
      if (isMounted) setVitals(updatedVitals);
    });

    return () => {
      isMounted = false;
      unsub();
    };
  }, [patient.id]);

  // Handle Quick Log Vitals
  const handleQuickLogVitals = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSystolic || !quickDiastolic || !quickHR) return;

    setIsLoggingVital(true);
    const newVital: Omit<VitalSign, 'id'> = {
      patientId: patient.id,
      timestamp: new Date().toISOString(),
      systolic: Number(quickSystolic),
      diastolic: Number(quickDiastolic),
      heartRate: Number(quickHR),
      spO2: 98,
      source: 'Clinic',
      notes: quickNotes
    };

    const saved = await logVitalSign(newVital, patient.name);
    setVitals(prev => [saved, ...prev]);
    setIsLoggingVital(false);

    if (saved.isAlert) {
      onPatientUpdated({ ...patient, status: 'Alert: High BP' });
    }
  };

  const latestVital = vitals[0];
  const pendingLabsCount = labs.filter(l => l.status === 'Pending Review').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Back and breadcrumb */}
      <div className="flex items-center justify-between no-print">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm transition"
        >
          <ArrowLeft className="w-4 h-4 text-rose-600" />
          <span>Back to All Patients</span>
        </button>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* AI Clinical Assistant Trigger */}
          <button
            onClick={() => setIsAIChatOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cardio-600 to-orange-500 hover:from-cardio-500 hover:to-orange-400 shadow-md shadow-rose-900/20 transition transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4" />
            Consult AI Assistant
          </button>

          {/* Billing */}
          <button
            onClick={() => setIsBillingOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition"
          >
            <CreditCard className="w-4 h-4 text-emerald-600" />
            Billing & Invoices
          </button>

          {/* Referral */}
          <button
            onClick={() => setIsReferralOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition"
          >
            <Share2 className="w-4 h-4 text-indigo-600" />
            Refer Specialist
          </button>

          {/* Review Labs */}
          <button
            onClick={() => setIsLabReviewOpen(true)}
            className="relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition"
          >
            <Clock className="w-4 h-4 text-amber-500" />
            Review Labs
            {pendingLabsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping ml-1" />
            )}
          </button>
        </div>
      </div>

      {/* Patient Header Demographics Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cardio-600 to-rose-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-rose-900/30 shrink-0">
              {patient.name.split(' ').map(n => n[0]).join('')}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight font-heading">
                  {patient.name}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-bold">
                  {patient.mrn}
                </span>

                {/* Status badge */}
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
                  patient.status === 'Alert: High BP'
                    ? 'bg-rose-100 text-rose-800 border border-rose-200'
                    : patient.status === 'Pending Lab'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  {patient.status === 'Alert: High BP' ? (
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                  ) : (
                    <ShieldCheck className="w-3.5 h-3.5" />
                  )}
                  {patient.status}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                <span><strong>DOB:</strong> {patient.dob} ({patient.age}y / {patient.gender})</span>
                <span>•</span>
                <span><strong>Blood:</strong> <span className="font-bold text-rose-600">{patient.bloodType}</span></span>
                <span>•</span>
                <span><strong>Phone:</strong> {patient.phone}</span>
                <span>•</span>
                <span><strong>City:</strong> {patient.address}</span>
              </div>

              <div className="pt-2 text-xs text-slate-800">
                <span className="text-slate-500 font-medium">Primary Diagnosis: </span>
                <strong className="text-slate-900 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                  {patient.primaryDiagnosis}
                </strong>
              </div>
            </div>
          </div>

          {/* Quick Metrics / Key Telemetry readout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 shrink-0 text-xs">
            <div className="text-center p-2 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase">Latest BP</span>
              <strong className={`text-base font-black ${
                latestVital && latestVital.systolic >= 160 ? 'text-rose-600' : 'text-slate-900'
              }`}>
                {latestVital ? `${latestVital.systolic}/${latestVital.diastolic}` : '—'}
              </strong>
              <span className="text-[10px] text-slate-400 block">mmHg</span>
            </div>

            <div className="text-center p-2 rounded-lg bg-white border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase">Heart Rate</span>
              <strong className="text-base font-black text-cyan-600">
                {latestVital ? `${latestVital.heartRate}` : '—'}
              </strong>
              <span className="text-[10px] text-slate-400 block">bpm</span>
            </div>

            <div className="text-center p-2 rounded-lg bg-white border border-slate-200 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-500 block uppercase">Next Visit</span>
              <strong className="text-xs font-bold text-indigo-700 block mt-1">
                {patient.nextAppointment || 'Nov 12, 2026'}
              </strong>
            </div>
          </div>
        </div>

        {/* Clinical Tags & Risk Factors */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold text-[11px]">Risk Profile:</span>
          {patient.riskFactors.map((rf, idx) => (
            <span key={idx} className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium">
              {rf}
            </span>
          ))}
          {patient.allergies.length > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold border border-rose-200">
              Allergies: {patient.allergies.join(', ')}
            </span>
          )}
          {patient.implantedDevices && patient.implantedDevices.length > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 text-[11px] font-bold border border-cyan-200">
              Device: {patient.implantedDevices.join(', ')}
            </span>
          )}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-2 overflow-x-auto no-print">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Vitals Trends & RPM Telemetry</span>
        </button>

        <button
          onClick={() => setActiveTab('prescription')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'prescription'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>Smart Prescription Engine</span>
          {prescriptions.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 text-[10px]">
              {prescriptions.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'reports'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Echo & ECG Diagnostic Reports</span>
          {reports.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-cyan-100 text-cyan-700 text-[10px]">
              {reports.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('billing')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'billing'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Practice Invoices ({invoices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('referrals')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === 'referrals'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Cath Lab & Referrals ({referrals.length})</span>
        </button>
      </div>

      {/* Tab 1: Overview & Telemetry */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Active RPM Alert Banner if high BP */}
          {patient.status === 'Alert: High BP' && (
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-rose-950 text-sm">
                    Active Telemetry Alert: Elevated Blood Pressure Detected
                  </h3>
                  <p className="text-xs text-rose-800 mt-0.5">
                    Recent reading of <strong>{latestVital?.systolic}/{latestVital?.diastolic} mmHg</strong> exceeds stage 2 threshold. Recommend clinical review or medication titration.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAIChatOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-white border border-rose-200 text-rose-700 font-bold text-xs hover:bg-rose-50 transition"
                >
                  AI Recommendations
                </button>
                <button
                  onClick={async () => {
                    onPatientUpdated({ ...patient, status: 'Stable' });
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-500 transition"
                >
                  Acknowledge Alert
                </button>
              </div>
            </div>
          )}

          {/* Vitals Trend Chart */}
          <VitalsChart vitals={vitals} />

          {/* Quick Entry Form & Pending Labs Overview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Log Vitals Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm font-heading">
                  <Activity className="w-4 h-4 text-rose-600" />
                  Log Vitals Quick Entry
                </h3>
                <span className="text-[10px] text-slate-400">Clinic / In-Person</span>
              </div>

              <form onSubmit={handleQuickLogVitals} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Systolic (mmHg):</label>
                    <input
                      type="number"
                      value={quickSystolic}
                      onChange={e => setQuickSystolic(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Diastolic (mmHg):</label>
                    <input
                      type="number"
                      value={quickDiastolic}
                      onChange={e => setQuickDiastolic(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-slate-900 focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Heart Rate (bpm):</label>
                  <input
                    type="number"
                    value={quickHR}
                    onChange={e => setQuickHR(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-cyan-600 focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Encounter Notes:</label>
                  <input
                    type="text"
                    value={quickNotes}
                    onChange={e => setQuickNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-700"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoggingVital}
                  className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Save Reading to Patient Chart
                </button>
              </form>
            </div>

            {/* Pending Diagnostic Labs Preview Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm font-heading">
                  <Clock className="w-4 h-4 text-amber-500" />
                  Cardiac Laboratory Results ({labs.length})
                </h3>
                <button
                  onClick={() => setIsLabReviewOpen(true)}
                  className="text-xs text-rose-600 hover:underline font-bold"
                >
                  Review All
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                {labs.slice(0, 3).map(lab => (
                  <div
                    key={lab.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{lab.testName}</div>
                      <div className="text-[11px] text-slate-500">
                        {lab.date} • Ref: {lab.referenceRange}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-slate-900">{lab.result} {lab.unit}</div>
                      <span className={`text-[10px] font-bold ${
                        lab.status === 'Pending Review'
                          ? 'text-amber-600'
                          : lab.status === 'Abnormal'
                          ? 'text-rose-600'
                          : 'text-emerald-600'
                      }`}>
                        {lab.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Prescriptions Preview Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm font-heading">
                  <Pill className="w-4 h-4 text-rose-600" />
                  Active Medications
                </h3>
                <button
                  onClick={() => setActiveTab('prescription')}
                  className="text-xs text-rose-600 hover:underline font-bold"
                >
                  Modify Rx
                </button>
              </div>

              {prescriptions[0] && prescriptions[0].medications.length > 0 ? (
                <div className="space-y-2 text-xs">
                  {prescriptions[0].medications.slice(0, 4).map((m, i) => (
                    <div key={i} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="font-bold text-slate-900">{m.name}</div>
                      <div className="text-slate-600 text-[11px] font-medium">{m.dosage} • {m.frequency}</div>
                    </div>
                  ))}
                  <button
                    onClick={() => setPrintingPrescription(prescriptions[0])}
                    className="w-full mt-2 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5 text-rose-600" />
                    Print Current Prescription PDF
                  </button>
                </div>
              ) : (
                <div className="p-6 text-center text-slate-400 text-xs">
                  No active prescription found. Switch to Smart Prescription tab to generate one.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Smart Prescription Engine */}
      {activeTab === 'prescription' && (
        <SmartPrescription
          patient={patient}
          onPrescriptionSaved={savedRx => {
            setPrescriptions(prev => [savedRx, ...prev]);
          }}
          onOpenPrintPreview={rxToPrint => {
            setPrintingPrescription(rxToPrint);
          }}
        />
      )}

      {/* Tab 3: Cardiology Reports Engine */}
      {activeTab === 'reports' && (
        <CardiologyReport
          patient={patient}
          reports={reports}
          onReportSaved={savedRep => {
            setReports(prev => [savedRep, ...prev]);
          }}
          onOpenPrintReport={repToPrint => {
            setPrintingReport(repToPrint);
          }}
        />
      )}

      {/* Tab 4: Billing & Invoices */}
      {activeTab === 'billing' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              Patient Invoices & Practice Billing Records
            </h2>
            <button
              onClick={() => setIsBillingOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Create New Invoice
            </button>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
            {invoices.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                No invoices found for this patient.
              </div>
            ) : (
              invoices.map(inv => (
                <div key={inv.id} className="p-4 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 font-mono">{inv.invoiceNumber}</span>
                    <span className="text-slate-400 ml-2">({inv.date})</span>
                    <div className="text-slate-600 mt-1">
                      {inv.items.map(it => it.description).join(', ')}
                    </div>
                  </div>
                  <div className="text-right">
                    <strong className="text-sm font-black text-slate-900">${inv.totalAmount.toFixed(2)}</strong>
                    <div className={`text-[11px] font-bold ${
                      inv.status === 'Paid' ? 'text-emerald-600' : 'text-amber-600'
                    }`}>
                      {inv.status}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Specialist Referrals */}
      {activeTab === 'referrals' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-indigo-600" />
              Tertiary Care & Specialist Referrals
            </h2>
            <button
              onClick={() => setIsReferralOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              New Referral
            </button>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
            {referrals.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                No referrals logged for this patient.
              </div>
            ) : (
              referrals.map(ref => (
                <div key={ref.id} className="p-4 space-y-1">
                  <div className="flex justify-between items-center">
                    <strong className="text-slate-900 text-sm">{ref.targetFacilityOrSpecialist}</strong>
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-[10px]">
                      {ref.priority}
                    </span>
                  </div>
                  <div className="text-indigo-800 font-semibold">{ref.specialty}</div>
                  <p className="text-slate-600">{ref.reasonForReferral}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Lab Review Modal */}
      <LabReviewModal
        patient={patient}
        labs={labs}
        isOpen={isLabReviewOpen}
        onClose={() => setIsLabReviewOpen(false)}
        onLabUpdated={updatedLab => {
          setLabs(prev => {
            const idx = prev.findIndex(l => l.id === updatedLab.id);
            if (idx >= 0) {
              const cp = [...prev];
              cp[idx] = updatedLab;
              return cp;
            }
            return [updatedLab, ...prev];
          });
        }}
      />

      {/* Billing Modal */}
      <BillingModal
        patient={patient}
        invoices={invoices}
        isOpen={isBillingOpen}
        onClose={() => setIsBillingOpen(false)}
        onInvoiceSaved={savedInv => {
          setInvoices(prev => [savedInv, ...prev]);
        }}
      />

      {/* Referral Modal */}
      <ReferralModal
        patient={patient}
        referrals={referrals}
        isOpen={isReferralOpen}
        onClose={() => setIsReferralOpen(false)}
        onReferralSaved={savedRef => {
          setReferrals(prev => [savedRef, ...prev]);
        }}
      />

      {/* AI Clinical Assistant Chat Modal */}
      <GeminiChat
        patient={patient}
        vitals={vitals}
        prescriptions={prescriptions}
        labs={labs}
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
      />

      {/* Printable Prescription Modal */}
      {printingPrescription && (
        <PrintablePrescription
          prescription={printingPrescription}
          patient={patient}
          onClose={() => setPrintingPrescription(null)}
        />
      )}

      {/* Printable Report Modal */}
      {printingReport && (
        <PrintableReport
          report={printingReport}
          patient={patient}
          onClose={() => setPrintingReport(null)}
        />
      )}
    </div>
  );
};
