import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Patient, VitalSign, Prescription } from '../types';
import { logVitalSign } from '../firebase/firestoreService';
import { 
  Heart, 
  Activity, 
  Smartphone, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Pill, 
  PhoneCall, 
  ArrowLeft, 
  User, 
  Sparkles,
  Calendar
} from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';

interface PatientMobileDashboardProps {
  patients: Patient[];
  activePatientId: string;
  onSelectPatient: (id: string) => void;
  onVitalLogged: (vital: VitalSign) => void;
  onBackToDoctorStation: () => void;
  prescriptions: Prescription[];
}

export const PatientMobileDashboard: React.FC<PatientMobileDashboardProps> = ({
  patients,
  activePatientId,
  onSelectPatient,
  onVitalLogged,
  onBackToDoctorStation,
  prescriptions
}) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language?.startsWith('ar');
  const patient = patients.find(p => p.id === activePatientId) || patients[0];

  const [systolic, setSystolic] = useState<number>(128);
  const [diastolic, setDiastolic] = useState<number>(82);
  const [heartRate, setHeartRate] = useState<number>(74);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<{
    type: 'success' | 'alert';
    message: string;
  } | null>(null);

  // Active prescriptions for this patient
  const patientRx = prescriptions.find(p => p.patientId === patient.id) || prescriptions[0];

  const handleSubmitVitals = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!systolic || !diastolic || !heartRate) return;

    setIsSubmitting(true);
    setSubmissionFeedback(null);

    const newVital: Omit<VitalSign, 'id'> = {
      patientId: patient.id,
      timestamp: new Date().toISOString(),
      systolic: Number(systolic),
      diastolic: Number(diastolic),
      heartRate: Number(heartRate),
      spO2: 98,
      source: 'Patient Portal',
      notes: notes.trim() || 'Logged via Cardios Mobile Patient App'
    };

    const saved = await logVitalSign(newVital, patient.name);
    onVitalLogged(saved);

    setIsSubmitting(false);

    if (saved.isAlert) {
      setSubmissionFeedback({
        type: 'alert',
        message: `⚠️ Alert Triggered: Your reading (${saved.systolic}/${saved.diastolic} mmHg) exceeds threshold and has been dispatched STAT to Dr. Karim El-Sayed's station.`
      });
    } else {
      setSubmissionFeedback({
        type: 'success',
        message: `✅ Perfect! Your vitals (${saved.systolic}/${saved.diastolic} mmHg, HR ${saved.heartRate} bpm) were synchronized with Cardios Cloud.`
      });
    }

    setNotes('');
  };

  const setPreset = (sys: number, dia: number, hr: number, testNote: string) => {
    setSystolic(sys);
    setDiastolic(dia);
    setHeartRate(hr);
    setNotes(testNote);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 flex flex-col items-center justify-center">
      {/* Top Bar for Switcher & Return */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 text-xs">
        <button
          onClick={onBackToDoctorStation}
          className="inline-flex items-center gap-2 font-semibold text-slate-300 hover:text-white bg-slate-900 px-3 py-2 rounded-xl border border-slate-800 transition"
        >
          <ArrowLeft className="w-4 h-4 text-rose-500 rtl:rotate-180" />
          <span>{t('portal.backToDoctorStation')}</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <LanguageSwitcher variant="navbar" />

          {/* Patient Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={patient.id}
              onChange={e => onSelectPatient(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mobile Device Frame Mockup */}
      <div className="w-full max-w-md bg-slate-900 border-2 border-slate-700/80 rounded-[36px] shadow-2xl shadow-rose-950/40 overflow-hidden flex flex-col text-left rtl:text-right">
        {/* Device Notch & Status Bar */}
        <div className="bg-slate-950 px-6 pt-3 pb-2 flex items-center justify-between text-[11px] text-slate-400">
          <span className="font-semibold text-slate-200 font-mono">9:41</span>
          <div className="w-20 h-4 bg-slate-900 rounded-full flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-slate-700" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-mono">5G RPM</span>
          </div>
        </div>

        {/* Patient App Header */}
        <div className="bg-gradient-to-b from-slate-950 to-slate-900 px-6 py-4 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cardio-600 to-rose-500 flex items-center justify-center shadow-md shadow-rose-900/30 shrink-0">
                <Heart className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white font-heading">{t('portal.headerTitle')}</h1>
                <p className="text-[11px] text-slate-400">{t('portal.headerSubtitle')}</p>
              </div>
            </div>

            <div className="ltr:text-right rtl:text-left">
              <div className="text-xs font-bold text-slate-200">{patient.name}</div>
              <div className="text-[10px] text-rose-400 font-mono">{patient.mrn}</div>
            </div>
          </div>
        </div>

        {/* Scrollable Portal Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[620px]">
          {/* Quick presets for demoing */}
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 text-slate-400 font-semibold mb-2 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('portal.simulateCuffSync')}:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPreset(124, 78, 70, isRtl ? 'فحص الصباح بعد الاستيقاظ. أشعر بالراحة.' : 'Morning check after waking. Feeling rested.')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 font-medium text-left rtl:text-right border border-slate-800 hover:border-emerald-500/40 transition text-[11px]"
              >
                🟢 {isRtl ? 'طبيعي (124/78)' : 'Normal (124/78)'}
              </button>
              <button
                type="button"
                onClick={() => setPreset(168, 102, 112, isRtl ? 'صداع وخفقان بعد مجهود خفيف.' : 'Headache and palpitations after light exertion.')}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-400 font-bold text-left rtl:text-right border border-slate-800 hover:border-rose-500/40 transition text-[11px]"
              >
                🔴 {isRtl ? 'إنذار حرج (168/102)' : 'Critical Alert (168/102)'}
              </button>
            </div>
          </div>

          {/* Vitals Log Form */}
          <form onSubmit={handleSubmitVitals} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-500" />
                {t('portal.logReading')}
              </h2>
              <span className="text-[11px] text-slate-400">{t('portal.activeRpmCuff')}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Systolic */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <label className="block text-[11px] text-slate-400 mb-1">{t('portal.systolic')} (mmHg)</label>
                <div className="flex items-baseline gap-1">
                  <input
                    type="number"
                    value={systolic}
                    onChange={e => setSystolic(Number(e.target.value))}
                    min="60"
                    max="260"
                    className="w-full text-2xl font-black bg-transparent text-white focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-500 font-mono">mmHg</span>
                </div>
              </div>

              {/* Diastolic */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <label className="block text-[11px] text-slate-400 mb-1">{t('portal.diastolic')} (mmHg)</label>
                <div className="flex items-baseline gap-1">
                  <input
                    type="number"
                    value={diastolic}
                    onChange={e => setDiastolic(Number(e.target.value))}
                    min="40"
                    max="180"
                    className="w-full text-2xl font-black bg-transparent text-white focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-500 font-mono">mmHg</span>
                </div>
              </div>

              {/* Heart Rate */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 col-span-2">
                <label className="block text-[11px] text-slate-400 mb-1">{t('portal.pulse')}</label>
                <div className="flex items-baseline gap-2">
                  <input
                    type="number"
                    value={heartRate}
                    onChange={e => setHeartRate(Number(e.target.value))}
                    min="30"
                    max="220"
                    className="w-full text-2xl font-black bg-transparent text-cyan-400 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-500 font-mono">bpm</span>
                </div>
              </div>

              {/* Symptoms / Note */}
              <div className="col-span-2">
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder={isRtl ? 'هل تشعر بأي أعراض؟ (مثل دوخة خفيفة، خفقان...)' : 'Any symptoms? (e.g. slight dizziness, palpitation...)'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cardio-600 via-rose-600 to-red-600 hover:from-cardio-500 hover:to-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <Send className="w-4 h-4 rtl:rotate-180" />
              {isSubmitting ? (isRtl ? 'جاري الإرسال للطبيب...' : 'Syncing to Doctor Station...') : t('portal.saveReading')}
            </button>
          </form>

          {/* Feedback banner */}
          {submissionFeedback && (
            <div
              className={`p-4 rounded-2xl text-xs leading-relaxed border ${
                submissionFeedback.type === 'alert'
                  ? 'bg-rose-950/80 border-rose-600/60 text-rose-200'
                  : 'bg-emerald-950/80 border-emerald-600/60 text-emerald-200'
              }`}
            >
              {submissionFeedback.message}
            </div>
          )}

          {/* My Prescriptions Widget */}
          {patientRx && patientRx.medications.length > 0 && (
            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Pill className="w-4 h-4 text-amber-400" />
                  <span>{t('portal.myPrescriptions')}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {patientRx.medications.length}
                </span>
              </div>

              <div className="space-y-2">
                {patientRx.medications.slice(0, 3).map((med, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 text-xs">
                    <div className="font-bold text-slate-200">{med.name}</div>
                    <div className="text-[11px] text-rose-300 font-medium">{med.dosage} • {med.frequency}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Direct Doctor & Clinic Contact */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-rose-950/30 to-slate-950 border border-slate-800 text-center text-xs space-y-2">
            <div className="text-slate-300 font-medium">{isRtl ? 'استشاري القلب المتابع:' : 'Attending Cardiologist:'}</div>
            <div className="text-sm font-bold text-white">{t('nav.doctorName')}, {t('nav.doctorTitle')}</div>
            <a
              href="https://wa.me/201146963589?text=Hello%20Dr.%20Karim,%20I%20am%20logging%20my%20vitals%20on%20Cardios."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition text-xs shadow-md shadow-emerald-950"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              {isRtl ? 'التواصل مع العيادة عبر واتساب' : 'Contact Clinic via WhatsApp'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
