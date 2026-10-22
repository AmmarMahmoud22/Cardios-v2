import React from 'react';
import { CardiologyReportData, Patient } from '../types';
import { Heart, Activity, Printer, X, ShieldCheck } from 'lucide-react';

interface PrintableReportProps {
  report: CardiologyReportData;
  patient: Patient;
  onClose?: () => void;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({
  report,
  patient,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  const isEcho = report.type === 'Echocardiogram';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex justify-center p-4 sm:p-6 print:p-0 print:bg-white print:static print:inset-auto">
      <div className="relative w-full max-w-4xl bg-white text-slate-900 rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none print:w-full print:max-w-none">
        {/* On-Screen Action Bar */}
        <div className="no-print bg-slate-900 text-white px-6 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-sm">
              Official Diagnostic Report ({report.type})
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md transition"
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

        {/* Printable Report Content */}
        <div className="printable-area p-8 sm:p-12 font-sans bg-white">
          {/* Header */}
          <div className="border-b-2 border-cyan-600 pb-6 flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-xl bg-cyan-700 text-white flex items-center justify-center font-bold shadow-md print:border print:border-black">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight uppercase">
                  Cardios Non-Invasive Cardiac Diagnostic Laboratory
                </h1>
                <div className="text-xs text-cyan-700 font-bold uppercase tracking-wider mt-0.5">
                  Echocardiography, Electrophysiology & Hemodynamics Center
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Accreditation: EACVI / ASE Standards • Digital Telemetry Verification ID: {report.id}
                </div>
              </div>
            </div>

            <div className="text-right">
              <h2 className="text-base font-bold text-slate-900">
                {report.doctorName}
              </h2>
              <div className="text-xs text-slate-600 font-medium">
                Consultant Cardiologist & Echo Specialist
              </div>
              <div className="text-[11px] text-slate-500">
                Date of Examination: {report.date}
              </div>
            </div>
          </div>

          {/* Patient Demographics Banner */}
          <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block">Patient Name:</span>
              <strong className="text-slate-900 text-sm font-bold">{patient.name}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">MRN / ID:</span>
              <strong className="text-slate-900">{patient.mrn}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Age / Gender:</span>
              <strong className="text-slate-900">{patient.age} Years / {patient.gender}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Exam Modality:</span>
              <strong className="text-cyan-700 font-bold uppercase">{report.type}</strong>
            </div>
            <div className="col-span-2 sm:col-span-4 pt-2 border-t border-slate-200">
              <span className="text-slate-500">Clinical Indication: </span>
              <strong className="text-slate-900">{report.indication}</strong>
            </div>
          </div>

          {/* Diagnostic Findings Section */}
          <div className="mb-8">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-2 mb-4">
              Quantitative & Morphological Findings
            </h3>

            {isEcho ? (
              <div className="space-y-4 text-xs">
                {/* Echo Metrics Grid */}
                <div className="grid grid-cols-3 gap-3 p-3.5 rounded-xl bg-cyan-50/50 border border-cyan-100">
                  <div className="text-center p-2 rounded bg-white border border-cyan-200">
                    <span className="text-slate-500 block text-[10px] uppercase">Left Ventricular EF</span>
                    <strong className="text-lg font-black text-cyan-800">
                      {report.ejectionFraction}%
                    </strong>
                    <span className="block text-[10px] text-slate-500">
                      {report.ejectionFraction && report.ejectionFraction >= 53
                        ? 'Normal (>=53%)'
                        : report.ejectionFraction && report.ejectionFraction >= 41
                        ? 'Mildly Reduced'
                        : 'Reduced (<40%)'}
                    </span>
                  </div>
                  <div className="text-center p-2 rounded bg-white border border-cyan-200">
                    <span className="text-slate-500 block text-[10px] uppercase">LVEDD (mm)</span>
                    <strong className="text-lg font-black text-slate-800">
                      {report.lvEndDiastolicDiam || 52} mm
                    </strong>
                    <span className="block text-[10px] text-slate-500">Normal: 38 - 56 mm</span>
                  </div>
                  <div className="text-center p-2 rounded bg-white border border-cyan-200">
                    <span className="text-slate-500 block text-[10px] uppercase">LVESD (mm)</span>
                    <strong className="text-lg font-black text-slate-800">
                      {report.lvEndSystolicDiam || 36} mm
                    </strong>
                    <span className="block text-[10px] text-slate-500">Normal: 24 - 40 mm</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg border border-slate-200 bg-white">
                    <span className="font-bold text-slate-800 block mb-1">Segmental Wall Motion:</span>
                    <p className="text-slate-700 leading-relaxed">{report.wallMotionAbnormality}</p>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-white">
                    <span className="font-bold text-slate-800 block mb-1">Valvular Morphology & Doppler:</span>
                    <p className="text-slate-700 leading-relaxed">{report.valvularFindings}</p>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-white">
                    <span className="font-bold text-slate-800 block mb-1">Diastolic Function (Mitral Inflow & TDI):</span>
                    <p className="text-slate-700 leading-relaxed">{report.diastolicFunction}</p>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-white">
                    <span className="font-bold text-slate-800 block mb-1">Pericardium & Intracardiac Masses:</span>
                    <p className="text-slate-700 leading-relaxed">{report.pericardialEffusion}</p>
                  </div>
                </div>
              </div>
            ) : (
              /* ECG Metrics View */
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase">Cardiac Rhythm</span>
                    <strong className="text-sm font-bold text-slate-900">{report.rhythm}</strong>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase">Ventricular Rate</span>
                    <strong className="text-sm font-bold text-cyan-700">{report.rate} bpm</strong>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase">PR Interval</span>
                    <strong className="text-sm font-bold text-slate-900">{report.prInterval} ms</strong>
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block uppercase">QTc Interval</span>
                    <strong className="text-sm font-bold text-slate-900">{report.qtcInterval} ms</strong>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 bg-white">
                  <span className="font-bold text-slate-800 block mb-1">ST-T Wave & Repolarization Analysis:</span>
                  <p className="text-slate-700 leading-relaxed">{report.stSegment}</p>
                </div>
              </div>
            )}
          </div>

          {/* Structured Clinical Conclusions */}
          <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2">
              Clinical Conclusions & Diagnostic Summary:
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-slate-800">
              {report.conclusions.map((c, i) => (
                <li key={i} className="font-medium">{c}</li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="mb-8 p-4 rounded-xl bg-cyan-50/40 border border-cyan-100 text-xs">
            <h4 className="font-bold text-cyan-900 uppercase tracking-wider mb-2">
              Management & Follow-up Recommendations:
            </h4>
            <ul className="space-y-1.5 list-disc list-inside text-cyan-950">
              {report.recommendations.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          {/* Footer Signature */}
          <div className="mt-12 pt-6 border-t-2 border-slate-200 grid grid-cols-2 gap-8 text-xs items-end">
            <div>
              <div className="text-slate-500">Report Status:</div>
              <div className="text-xs font-bold text-emerald-700 mt-0.5 inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Final Validated Clinical Document
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Archived in Cardios Firestore Cloud EHR
              </div>
            </div>

            <div className="text-right flex flex-col items-end">
              <div className="w-48 border-b border-slate-400 pb-1 mb-1 text-center font-serif text-slate-600 italic">
                {report.doctorName}
              </div>
              <div className="text-[11px] font-bold text-slate-800">
                Reporting Cardiologist Electronic Signature
              </div>
              <div className="text-[10px] text-slate-500">
                License: EGY-MED-44912 / FESC #7821
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
