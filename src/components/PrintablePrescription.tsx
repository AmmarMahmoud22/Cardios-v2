import React from 'react';
import { Prescription, Patient } from '../types';
import { Heart, Stethoscope, Printer, X } from 'lucide-react';

interface PrintablePrescriptionProps {
  prescription: Prescription;
  patient: Patient;
  onClose?: () => void;
}

export const PrintablePrescription: React.FC<PrintablePrescriptionProps> = ({
  prescription,
  patient,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex justify-center p-4 sm:p-6 print:p-0 print:bg-white print:static print:inset-auto">
      {/* Container */}
      <div className="relative w-full max-w-3xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none print:w-full print:max-w-none">
        {/* On-screen Action Toolbar (Hidden in Print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="font-semibold text-sm">Official Cardiology Prescription Preview</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Export PDF
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Printable Prescription Body */}
        <div className="printable-area p-8 sm:p-12 font-sans bg-white">
          {/* Header */}
          <div className="border-b-2 border-rose-600 pb-6 flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-md print:border print:border-black">
                <Heart className="w-8 h-8 fill-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight uppercase">
                  {prescription.clinicName}
                </h1>
                <div className="text-xs text-rose-700 font-bold uppercase tracking-wider mt-0.5">
                  Cardiology, Interventional Cath Lab & Remote Patient Telemetry
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  License: {prescription.doctorLicense} | Tel: +20 2 2405 9900 | Emergency: 123
                </div>
              </div>
            </div>

            <div className="text-right">
              <h2 className="text-base font-bold text-slate-900">
                {prescription.doctorName}
              </h2>
              <div className="text-xs text-slate-600 font-medium">
                Consultant Interventional Cardiologist
              </div>
              <div className="text-[11px] text-slate-500">
                Fellow of the European Society of Cardiology (FESC)
              </div>
            </div>
          </div>

          {/* Patient Details Sub-header */}
          <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Patient Name:</span>
              <strong className="text-slate-900 text-sm font-bold">{patient.name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">MRN & DOB:</span>
              <strong className="text-slate-900">{patient.mrn} ({patient.age}y / {patient.gender})</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Date of Issue:</span>
              <strong className="text-slate-900">{prescription.date}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Blood Type / Allergies:</span>
              <strong className="text-rose-600">{patient.bloodType} | {patient.allergies.join(', ') || 'NKDA'}</strong>
            </div>

            <div className="col-span-2 sm:col-span-4 pt-2 border-t border-slate-200">
              <span className="text-slate-500">Primary Clinical Diagnosis: </span>
              <strong className="text-slate-900 font-semibold">{prescription.diagnosis}</strong>
            </div>
          </div>

          {/* Rx Symbol */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl font-serif font-black text-rose-700 italic">℞</span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Prescribed Pharmacotherapy Regimen
            </span>
          </div>

          {/* Medications Table / List */}
          <div className="space-y-4 mb-8">
            {prescription.medications.map((med, idx) => (
              <div
                key={med.id || idx}
                className="p-3.5 rounded-lg border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-bold text-slate-900">{med.name}</span>
                    <span className="text-[11px] text-slate-500 italic">({med.genericName})</span>
                  </div>
                  <div className="text-slate-700 pl-7">
                    <span className="font-semibold text-rose-700">Dosage: {med.dosage}</span> • {med.frequency} via {med.route}
                  </div>
                  {med.instructions && (
                    <div className="text-slate-600 pl-7 text-[11px] italic">
                      Instructions: {med.instructions}
                    </div>
                  )}
                </div>

                <div className="sm:text-right pl-7 sm:pl-0">
                  <span className="inline-block px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">
                    Duration: {med.duration}
                  </span>
                  {med.indication && (
                    <div className="text-[10px] text-slate-400 mt-1">
                      {med.indication}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Clinical Instructions & Follow-up */}
          {prescription.clinicalNotes && (
            <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100 text-xs text-slate-800 mb-8">
              <strong className="text-rose-900 block mb-1 font-bold">Special Lifestyle & RPM Telemetry Directives:</strong>
              <p className="leading-relaxed">{prescription.clinicalNotes}</p>
            </div>
          )}

          {/* Footer Signature & Stamp */}
          <div className="mt-12 pt-8 border-t-2 border-slate-200 grid grid-cols-2 gap-8 text-xs items-end">
            <div>
              <div className="text-slate-500">Scheduled Follow-up Consultation:</div>
              <div className="text-sm font-bold text-rose-700 mt-0.5">
                {prescription.nextFollowUp || 'In 4 weeks with home RPM log'}
              </div>
              <div className="text-[10px] text-slate-400 mt-2">
                * Bring this prescription & home BP records to each review visit.
              </div>
            </div>

            <div className="text-right flex flex-col items-end">
              <div className="w-48 border-b border-slate-400 pb-1 mb-1 text-center font-serif text-slate-600 italic">
                Dr. Karim El-Sayed
              </div>
              <div className="text-[11px] font-bold text-slate-800">
                Attending Cardiologist Signature & Stamp
              </div>
              <div className="text-[10px] text-slate-500">
                Cardios Digital Rx Validation ID: {prescription.id}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
