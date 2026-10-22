import React, { useState } from 'react';
import { Patient, Prescription, Medication } from '../types';
import { CARDIOLOGY_DRUGS, PRESCRIPTION_TEMPLATES } from '../data/mockData';
import { savePrescription } from '../firebase/firestoreService';
import { 
  Pill, 
  Plus, 
  Trash2, 
  Sparkles, 
  Printer, 
  Check, 
  Search, 
  FileCheck2, 
  ChevronDown 
} from 'lucide-react';

interface SmartPrescriptionProps {
  patient: Patient;
  onPrescriptionSaved: (prescription: Prescription) => void;
  onOpenPrintPreview: (prescription: Prescription) => void;
}

export const SmartPrescription: React.FC<SmartPrescriptionProps> = ({
  patient,
  onPrescriptionSaved,
  onOpenPrintPreview
}) => {
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: `med-${Date.now()}-1`,
      name: 'Atorvastatin (Lipitor)',
      genericName: 'Atorvastatin Calcium',
      dosage: '80 mg',
      frequency: 'Once daily at bedtime',
      route: 'Oral',
      duration: '90 days',
      instructions: 'High-intensity statin therapy. Take consistently in evening.',
      indication: 'Cardiovascular Risk Reduction'
    },
    {
      id: `med-${Date.now()}-2`,
      name: 'Bisoprolol (Concor)',
      genericName: 'Bisoprolol Fumarate',
      dosage: '5 mg',
      frequency: 'Once daily in the morning',
      route: 'Oral',
      duration: '90 days',
      instructions: 'Target resting heart rate 60-70 bpm.',
      indication: 'Beta-Blockade / Ischemia Control'
    }
  ]);

  const [diagnosis, setDiagnosis] = useState(patient.primaryDiagnosis);
  const [clinicalNotes, setClinicalNotes] = useState(
    'Check daily BP and HR via Cardios Mobile RPM portal. Maintain strict salt restriction (<2g/day).'
  );
  const [nextFollowUp, setNextFollowUp] = useState(patient.nextAppointment || '2026-11-15');

  // Drug search / auto-complete state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDrug, setSelectedDrug] = useState<typeof CARDIOLOGY_DRUGS[0] | null>(null);
  const [customDosage, setCustomDosage] = useState('');
  const [customFreq, setCustomFreq] = useState('Once daily');
  const [customDuration, setCustomDuration] = useState('30 days');
  const [customInstructions, setCustomInstructions] = useState('');

  // Apply a template
  const applyTemplate = (templateIndex: number) => {
    const tmpl = PRESCRIPTION_TEMPLATES[templateIndex];
    if (!tmpl) return;

    const newMeds: Medication[] = tmpl.medications.map((m, i) => ({
      id: `med-${Date.now()}-${i}`,
      name: m.name,
      genericName: m.genericName,
      dosage: m.dosage,
      frequency: m.frequency,
      route: m.route,
      duration: m.duration,
      instructions: m.instructions,
      indication: tmpl.indication
    }));

    setMedications(newMeds);
  };

  // Add medication from auto-complete
  const handleAddMedication = () => {
    if (!selectedDrug && !searchQuery.trim()) return;

    const newMed: Medication = {
      id: `med-${Date.now()}`,
      name: selectedDrug ? selectedDrug.name : searchQuery.trim(),
      genericName: selectedDrug ? selectedDrug.generic : searchQuery.trim(),
      dosage: customDosage || (selectedDrug ? selectedDrug.dosages[0] : 'Standard dose'),
      frequency: customFreq,
      route: 'Oral',
      duration: customDuration,
      instructions: customInstructions,
      indication: selectedDrug ? selectedDrug.indication : 'Cardiology management'
    };

    setMedications([...medications, newMed]);
    setSelectedDrug(null);
    setSearchQuery('');
    setCustomDosage('');
    setCustomInstructions('');
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  // Save Prescription to Firestore and Trigger Print Preview
  const handleSaveAndPrint = async () => {
    const newPrescription: Prescription = {
      id: `rx-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      date: new Date().toISOString().split('T')[0],
      doctorName: 'Dr. Karim El-Sayed, MD, FESC',
      doctorLicense: 'EGY-MED-44912 / ESC #7821',
      clinicName: 'Cardios Heart Care Center & Tele-Cardiology Institute',
      diagnosis,
      medications,
      clinicalNotes,
      nextFollowUp
    };

    await savePrescription(newPrescription);
    onPrescriptionSaved(newPrescription);
    onOpenPrintPreview(newPrescription);
  };

  const filteredDrugs = CARDIOLOGY_DRUGS.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.generic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5 font-heading">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <Pill className="w-5 h-5" />
            </div>
            Smart Cardiology Prescription Engine
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Intelligent dosage auto-complete, guideline-directed templates & professional PDF printing
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSaveAndPrint}
            disabled={medications.length === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/30 transition disabled:opacity-50"
          >
            <Printer className="w-4 h-4" />
            Print / Export PDF
          </button>
        </div>
      </div>

      {/* GDMT Quick Templates */}
      <div className="my-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Guideline-Directed Medical Therapy (GDMT) Quick Templates:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESCRIPTION_TEMPLATES.map((tmpl, idx) => (
            <button
              key={idx}
              onClick={() => applyTemplate(idx)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-300 transition shadow-sm text-left flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 text-rose-600" />
              <span>{tmpl.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Drug Search & Auto-complete Form */}
      <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/30 mb-6">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5 text-rose-600" />
          <span>Add Medication (Cardiology Auto-Complete)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input with dropdown */}
          <div className="md:col-span-5 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                if (selectedDrug && e.target.value !== selectedDrug.name) {
                  setSelectedDrug(null);
                }
              }}
              placeholder="Search drug (e.g. Atorvastatin, Bisoprolol, Ramipril...)"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
            />

            {/* Autocomplete dropdown suggestions */}
            {searchQuery.trim().length > 0 && !selectedDrug && (
              <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white rounded-lg shadow-xl border border-slate-200 z-30 divide-y divide-slate-100 text-xs">
                {filteredDrugs.length > 0 ? (
                  filteredDrugs.map((drug, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setSelectedDrug(drug);
                        setSearchQuery(drug.name);
                        setCustomDosage(drug.dosages[0]);
                        setCustomFreq(drug.frequency);
                      }}
                      className="w-full text-left p-2.5 hover:bg-rose-50 transition flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{drug.name}</div>
                        <div className="text-[11px] text-slate-500">{drug.generic}</div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {drug.indication}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="p-3 text-slate-400 text-center">
                    No predefined cardiology drug found. You can add it as a custom item.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dosage Selector */}
          <div className="md:col-span-3">
            {selectedDrug ? (
              <select
                value={customDosage}
                onChange={e => setCustomDosage(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white font-medium"
              >
                {selectedDrug.dosages.map((d, i) => (
                  <option key={i} value={d}>
                    Dose: {d}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={customDosage}
                onChange={e => setCustomDosage(e.target.value)}
                placeholder="Dosage (e.g. 5 mg)"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
              />
            )}
          </div>

          {/* Frequency */}
          <div className="md:col-span-2">
            <input
              type="text"
              value={customFreq}
              onChange={e => setCustomFreq(e.target.value)}
              placeholder="Frequency"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
            />
          </div>

          {/* Add Button */}
          <div className="md:col-span-2">
            <button
              onClick={handleAddMedication}
              type="button"
              className="w-full h-full min-h-[36px] px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>

          {/* Additional instructions optional row */}
          <div className="md:col-span-8">
            <input
              type="text"
              value={customInstructions}
              onChange={e => setCustomInstructions(e.target.value)}
              placeholder="Special instructions (e.g. Take with dinner, monitor resting HR...)"
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
            />
          </div>

          <div className="md:col-span-4">
            <input
              type="text"
              value={customDuration}
              onChange={e => setCustomDuration(e.target.value)}
              placeholder="Duration (e.g. 90 days)"
              className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
            />
          </div>
        </div>
      </div>

      {/* Active Prescription Items List */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Current Prescribed Medications ({medications.length})
          </h3>
          <span className="text-xs text-slate-400">Drag or click delete to modify</span>
        </div>

        {medications.length === 0 ? (
          <div className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl text-xs">
            No medications added yet. Use auto-complete or select a GDMT template above.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {medications.map((med, idx) => (
              <div
                key={med.id}
                className="p-3.5 bg-white hover:bg-slate-50 transition flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{med.name}</div>
                    <div className="text-slate-500 text-[11px]">{med.genericName} • {med.route}</div>
                    <div className="text-slate-700 mt-0.5">
                      <span className="font-semibold text-rose-600">{med.dosage}</span> • {med.frequency} • <span className="text-slate-500 font-mono">{med.duration}</span>
                    </div>
                    {med.instructions && (
                      <div className="text-slate-500 italic text-[11px] mt-0.5">
                        Note: {med.instructions}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => removeMedication(med.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clinical Diagnosis & Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200 text-xs">
        <div>
          <label className="block font-bold text-slate-700 mb-1">Diagnosis Specification:</label>
          <input
            type="text"
            value={diagnosis}
            onChange={e => setDiagnosis(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-1">Scheduled Next Follow-Up:</label>
          <input
            type="date"
            value={nextFollowUp}
            onChange={e => setNextFollowUp(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block font-bold text-slate-700 mb-1">Directives for RPM & Home Monitoring:</label>
          <textarea
            rows={2}
            value={clinicalNotes}
            onChange={e => setClinicalNotes(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>
    </div>
  );
};
