import React, { useState } from 'react';
import { Referral, Patient } from '../types';
import { saveReferral } from '../firebase/firestoreService';
import { Share2, Plus, X, Building2, AlertCircle, CheckCircle2, Clock, Printer } from 'lucide-react';

interface ReferralModalProps {
  patient: Patient;
  referrals: Referral[];
  isOpen: boolean;
  onClose: () => void;
  onReferralSaved: (referral: Referral) => void;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({
  patient,
  referrals,
  isOpen,
  onClose,
  onReferralSaved
}) => {
  const [tab, setTab] = useState<'list' | 'new'>('list');

  // New Referral state
  const [facility, setFacility] = useState('Cairo Cardiac Interventional Suites / Prof. Dr. Sameh Farouk');
  const [specialty, setSpecialty] = useState<Referral['specialty']>('Cath Lab / Coronary Angiography');
  const [priority, setPriority] = useState<Referral['priority']>('Urgent');
  const [clinicalSummary, setClinicalSummary] = useState(
    `${patient.age}yo ${patient.gender} with ${patient.primaryDiagnosis}. Recent vital trends showed elevated BP and ischemic symptoms.`
  );
  const [reason, setReason] = useState(
    'Coronary angiography with physiological evaluation (FFR/IFR) and possible intervention.'
  );

  if (!isOpen) return null;

  const handleSaveReferral = async () => {
    const newRef: Referral = {
      id: `ref-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      referralDate: new Date().toISOString().split('T')[0],
      targetFacilityOrSpecialist: facility,
      specialty,
      priority,
      clinicalSummary,
      reasonForReferral: reason,
      status: 'Sent'
    };

    await saveReferral(newRef);
    onReferralSaved(newRef);
    setTab('list');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Share2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Specialist & Interventional Referral Management</h2>
              <div className="text-[11px] text-slate-400">
                Patient: {patient.name} ({patient.mrn})
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 pt-4 border-b border-slate-200 flex items-center gap-4 text-xs font-bold">
          <button
            onClick={() => setTab('list')}
            className={`pb-2.5 border-b-2 transition ${
              tab === 'list'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Active & Past Referrals ({referrals.length})
          </button>
          <button
            onClick={() => setTab('new')}
            className={`pb-2.5 border-b-2 transition flex items-center gap-1.5 ${
              tab === 'new'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Create Specialist Referral
          </button>
        </div>

        {/* Modal content */}
        <div className="p-6">
          {tab === 'list' ? (
            <div className="space-y-4">
              {referrals.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No referrals documented yet for this patient. Click "Create Specialist Referral" to refer.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                  {referrals.map(ref => (
                    <div key={ref.id} className="p-4 hover:bg-slate-50 transition space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-indigo-600" />
                          <strong className="text-slate-900 text-sm">{ref.targetFacilityOrSpecialist}</strong>
                          <span className="text-[11px] text-slate-400">({ref.referralDate})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            ref.priority === 'Stat / Emergency'
                              ? 'bg-rose-100 text-rose-700'
                              : ref.priority === 'Urgent'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {ref.priority}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                            {ref.status}
                          </span>
                        </div>
                      </div>

                      <div className="text-indigo-800 font-semibold text-[11px]">
                        Specialty Target: {ref.specialty}
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
                        <div><strong className="text-slate-700">Reason:</strong> {ref.reasonForReferral}</div>
                        <div className="text-slate-500 text-[11px]"><strong className="text-slate-600">Clinical Summary:</strong> {ref.clinicalSummary}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* New Referral Form */
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Specialist or Center:</label>
                  <input
                    type="text"
                    value={facility}
                    onChange={e => setFacility(e.target.value)}
                    placeholder="e.g. Cath Lab Suites, Prof. Dr. Sameh Farouk"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Specialty:</label>
                  <select
                    value={specialty}
                    onChange={e => setSpecialty(e.target.value as Referral['specialty'])}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
                  >
                    <option value="Cath Lab / Coronary Angiography">Cath Lab / Coronary Angiography (PCI)</option>
                    <option value="Cardiothoracic Surgery">Cardiothoracic Surgery (CABG / Valve)</option>
                    <option value="Electrophysiology">Electrophysiology (EP Study / Ablation / CRT-D)</option>
                    <option value="Cardiac MRI / CT">Cardiac MRI / Coronary CT Angiography</option>
                    <option value="Vascular Surgery">Peripheral Vascular Surgery</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Urgency / Priority Level:</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as Referral['priority'])}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold"
                  >
                    <option value="Routine">Routine Outpatient Referral</option>
                    <option value="Urgent">Urgent (Within 48-72 hours)</option>
                    <option value="Stat / Emergency">Stat / Emergency Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reason for Referral:</label>
                  <input
                    type="text"
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Clinical Background & Echo/ECG Findings:</label>
                  <textarea
                    rows={3}
                    value={clinicalSummary}
                    onChange={e => setClinicalSummary(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setTab('list')}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveReferral}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-md"
                >
                  Dispatch & Save Referral to Cloud
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
