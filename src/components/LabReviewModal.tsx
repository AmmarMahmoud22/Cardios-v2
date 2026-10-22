import React, { useState } from 'react';
import { LabTest, Patient } from '../types';
import { saveLabTest } from '../firebase/firestoreService';
import { FileCheck, X, Plus, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface LabReviewModalProps {
  patient: Patient;
  labs: LabTest[];
  isOpen: boolean;
  onClose: () => void;
  onLabUpdated: (updatedLab: LabTest) => void;
}

export const LabReviewModal: React.FC<LabReviewModalProps> = ({
  patient,
  labs,
  isOpen,
  onClose,
  onLabUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'review' | 'order'>('review');
  const [selectedLab, setSelectedLab] = useState<LabTest | null>(labs[0] || null);

  // New Lab Order Form
  const [testName, setTestName] = useState('NT-proBNP (B-Type Natriuretic)');
  const [category, setCategory] = useState<LabTest['category']>('Cardiac Biomarkers');
  const [resultVal, setResultVal] = useState('');
  const [unit, setUnit] = useState('pg/mL');
  const [refRange, setRefRange] = useState('< 125 pg/mL');
  const [status, setStatus] = useState<LabTest['status']>('Pending Review');
  const [notes, setNotes] = useState('Evaluate heart failure compensation and GDMT titration.');

  if (!isOpen) return null;

  const handleCreateLab = async () => {
    const newLab: LabTest = {
      id: `lab-${Date.now()}`,
      patientId: patient.id,
      testName,
      date: new Date().toISOString().split('T')[0],
      result: resultVal || 'Pending Analysis',
      unit,
      referenceRange: refRange,
      status,
      category,
      notes
    };

    await saveLabTest(newLab);
    onLabUpdated(newLab);
    setSelectedLab(newLab);
    setActiveTab('review');
    setResultVal('');
  };

  const handleUpdateStatus = async (lab: LabTest, newStatus: LabTest['status'], newResult?: string) => {
    const updated: LabTest = {
      ...lab,
      status: newStatus,
      result: newResult !== undefined ? newResult : lab.result
    };
    await saveLabTest(updated);
    onLabUpdated(updated);
    if (selectedLab?.id === lab.id) {
      setSelectedLab(updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center">
              <FileCheck className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold">Cardiac Diagnostic Laboratory Review</h2>
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

        {/* Tab Switcher */}
        <div className="px-6 pt-4 border-b border-slate-200 flex items-center gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('review')}
            className={`pb-2.5 border-b-2 transition ${
              activeTab === 'review'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Review Diagnostic Results ({labs.length})
          </button>
          <button
            onClick={() => setActiveTab('order')}
            className={`pb-2.5 border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'order'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Order / Record New Lab Test
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {activeTab === 'review' ? (
            <div className="space-y-4">
              {labs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No laboratory tests recorded yet. Click "Order New Lab Test" to add one.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {labs.map(lab => {
                    const isPending = lab.status === 'Pending Review' || lab.result.includes('Pending');
                    const isCritical = lab.status === 'Critical' || lab.status === 'Abnormal';

                    return (
                      <div
                        key={lab.id}
                        className="p-4 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">{lab.testName}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              {lab.category}
                            </span>
                            <span className="text-[11px] text-slate-400">({lab.date})</span>
                          </div>
                          <div className="text-slate-700">
                            Result:{' '}
                            <strong className={`text-sm ${isCritical ? 'text-rose-600 font-bold' : isPending ? 'text-amber-600 font-semibold' : 'text-slate-900'}`}>
                              {lab.result} {lab.unit}
                            </strong>{' '}
                            <span className="text-slate-500 text-[11px]">
                              (Reference Range: {lab.referenceRange})
                            </span>
                          </div>
                          {lab.notes && (
                            <div className="text-slate-500 italic text-[11px]">{lab.notes}</div>
                          )}
                        </div>

                        {/* Status badge & action */}
                        <div className="flex items-center gap-2 sm:self-center">
                          {isPending ? (
                            <button
                              onClick={() => {
                                const val = prompt(`Enter received result value for ${lab.testName} (${lab.unit}):`, '125');
                                if (val) handleUpdateStatus(lab, 'Normal', val);
                              }}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition flex items-center gap-1.5"
                            >
                              <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                              Update Pending Result
                            </button>
                          ) : (
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                              isCritical ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {isCritical ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                              {lab.status}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Order Form */
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cardiac Biomarker / Lab Test:</label>
                  <select
                    value={testName}
                    onChange={e => {
                      const val = e.target.value;
                      setTestName(val);
                      if (val.includes('Troponin')) {
                        setUnit('ng/L');
                        setRefRange('< 14 ng/L');
                        setCategory('Cardiac Biomarkers');
                      } else if (val.includes('BNP')) {
                        setUnit('pg/mL');
                        setRefRange('< 125 pg/mL');
                        setCategory('Cardiac Biomarkers');
                      } else if (val.includes('Lipid')) {
                        setUnit('mg/dL');
                        setRefRange('LDL-C < 55 mg/dL');
                        setCategory('Lipid & Metabolic');
                      } else if (val.includes('Creatinine')) {
                        setUnit('mg/dL');
                        setRefRange('0.7 - 1.2 mg/dL');
                        setCategory('Renal & Electrolytes');
                      }
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
                  >
                    <option value="High-Sensitivity Troponin I">High-Sensitivity Troponin I (hs-cTnI)</option>
                    <option value="High-Sensitivity Troponin T">High-Sensitivity Troponin T (STAT ACS)</option>
                    <option value="NT-proBNP (B-Type Natriuretic)">NT-proBNP (Heart Failure Marker)</option>
                    <option value="Lipid Profile (LDL-C / HDL / Trig)">Lipid Panel (Target LDL &lt; 55)</option>
                    <option value="Serum Creatinine & eGFR">Serum Creatinine & eGFR (CKD Screening)</option>
                    <option value="Serum Potassium (K+)">Serum Potassium (K+ Monitoring for ARNI/MRA)</option>
                    <option value="D-Dimer (Pulmonary Embolism)">D-Dimer (Quantitative)</option>
                    <option value="Glycated Hemoglobin (HbA1c)">Glycated Hemoglobin (HbA1c)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Result (Optional if Pending):</label>
                  <input
                    type="text"
                    value={resultVal}
                    onChange={e => setResultVal(e.target.value)}
                    placeholder="e.g. 14.2 or leave empty for Pending"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit of Measurement:</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reference Range:</label>
                  <input
                    type="text"
                    value={refRange}
                    onChange={e => setRefRange(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Review Status:</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as LabTest['status'])}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="Pending Review">Pending Review (STAT Lab)</option>
                    <option value="Normal">Normal</option>
                    <option value="Abnormal">Abnormal</option>
                    <option value="Critical">Critical Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Clinical Indication / Notes:</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('review')}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateLab}
                  className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-md"
                >
                  Save Lab Record to Cloud
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
