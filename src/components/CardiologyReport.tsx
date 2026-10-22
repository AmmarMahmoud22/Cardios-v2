import React, { useState } from 'react';
import { Patient, CardiologyReportData } from '../types';
import { saveReport } from '../firebase/firestoreService';
import { 
  FileText, 
  Activity, 
  Printer, 
  Sparkles, 
  CheckCircle, 
  Sliders, 
  RotateCcw 
} from 'lucide-react';

interface CardiologyReportProps {
  patient: Patient;
  reports: CardiologyReportData[];
  onReportSaved: (report: CardiologyReportData) => void;
  onOpenPrintReport: (report: CardiologyReportData) => void;
}

export const CardiologyReport: React.FC<CardiologyReportProps> = ({
  patient,
  reports,
  onReportSaved,
  onOpenPrintReport
}) => {
  const [reportType, setReportType] = useState<'Echocardiogram' | '12-Lead ECG'>('Echocardiogram');

  // Echo Fields
  const [indication, setIndication] = useState(
    patient.primaryDiagnosis || 'Evaluation of left ventricular function and regional wall motion'
  );
  const [ef, setEf] = useState<number>(48);
  const [lvedd, setLvedd] = useState<number>(54);
  const [lvesd, setLvesd] = useState<number>(38);
  const [wallMotion, setWallMotion] = useState(
    'Hypokinesia of the mid and apical anterior walls and cardiac apex (LAD territory). Other segments normokinetic.'
  );
  const [valves, setValves] = useState(
    'Mild mitral regurgitation (grade 1/4). Aortic valve trileaflet with no significant stenosis. Normal tricuspid valve.'
  );
  const [diastolic, setDiastolic] = useState('Grade 1 diastolic dysfunction (impaired relaxation, E/A 0.72).');
  const [pericardium, setPericardium] = useState('No pericardial effusion or intracardiac thrombus detected.');

  // ECG Fields
  const [rhythm, setRhythm] = useState('Normal Sinus Rhythm');
  const [rate, setRate] = useState(74);
  const [prInterval, setPrInterval] = useState(162);
  const [qrsDuration, setQrsDuration] = useState(94);
  const [qtcInterval, setQtcInterval] = useState(428);
  const [stSegment, setStSegment] = useState(
    'Pathological Q-waves in V1-V3. T-wave inversion in V2-V4 resolving. No acute ST elevations.'
  );

  // Auto-generate conclusions based on current inputs
  const generateConclusions = (): string[] => {
    if (reportType === 'Echocardiogram') {
      const efCategory = ef >= 53 ? 'Preserved' : ef >= 41 ? 'Mildly Reduced' : 'Moderately to Severely Reduced';
      return [
        `Left Ventricular Systolic Function is ${efCategory} with estimated LVEF of ~${ef}%.`,
        wallMotion.includes('Hypokinesia') ? 'Regional wall motion abnormalities present suggestive of ischemic territory involvement.' : 'Normal global and regional wall motion.',
        valves.includes('regurgitation') ? 'Mild functional valvular regurgitation documented.' : 'Valvular anatomy and hemodynamics within normal limits.',
        pericardium
      ];
    } else {
      return [
        `${rhythm} with resting ventricular rate of ${rate} bpm.`,
        `Conduction intervals: PR ${prInterval} ms, QRS ${qrsDuration} ms, QTc ${qtcInterval} ms.`,
        stSegment
      ];
    }
  };

  const generateRecommendations = (): string[] => {
    if (reportType === 'Echocardiogram') {
      return [
        'Maintain guideline-directed medical therapy (GDMT) including neurohormonal blockade.',
        'Repeat Transthoracic Echocardiogram in 3-6 months to assess cardiac remodelling.',
        'Continuous remote blood pressure monitoring via Cardios RPM.'
      ];
    } else {
      return [
        'Routine RPM continuous rhythm tracking.',
        'Seek urgent medical attention if palpitations, syncope, or presyncope occur.'
      ];
    }
  };

  const handleGenerateAndSave = async () => {
    const newReport: CardiologyReportData = {
      id: `rep-${reportType === 'Echocardiogram' ? 'echo' : 'ecg'}-${Date.now()}`,
      patientId: patient.id,
      patientName: patient.name,
      date: new Date().toISOString().split('T')[0],
      type: reportType,
      doctorName: 'Dr. Karim El-Sayed, MD, FESC',
      indication,
      ejectionFraction: reportType === 'Echocardiogram' ? ef : undefined,
      lvEndDiastolicDiam: reportType === 'Echocardiogram' ? lvedd : undefined,
      lvEndSystolicDiam: reportType === 'Echocardiogram' ? lvesd : undefined,
      wallMotionAbnormality: reportType === 'Echocardiogram' ? wallMotion : undefined,
      valvularFindings: reportType === 'Echocardiogram' ? valves : undefined,
      diastolicFunction: reportType === 'Echocardiogram' ? diastolic : undefined,
      pericardialEffusion: reportType === 'Echocardiogram' ? pericardium : undefined,
      rhythm: reportType === '12-Lead ECG' ? rhythm : undefined,
      rate: reportType === '12-Lead ECG' ? rate : undefined,
      prInterval: reportType === '12-Lead ECG' ? prInterval : undefined,
      qrsDuration: reportType === '12-Lead ECG' ? qrsDuration : undefined,
      qtcInterval: reportType === '12-Lead ECG' ? qtcInterval : undefined,
      stSegment: reportType === '12-Lead ECG' ? stSegment : undefined,
      conclusions: generateConclusions(),
      recommendations: generateRecommendations()
    };

    await saveReport(newReport);
    onReportSaved(newReport);
    onOpenPrintReport(newReport);
  };

  // Quick preset loader
  const loadPreset = (preset: 'post-stemi' | 'hfref' | 'normal' | 'af') => {
    if (preset === 'post-stemi') {
      setReportType('Echocardiogram');
      setEf(46);
      setLvedd(55);
      setLvesd(40);
      setWallMotion('Antero-apical and mid-septal hypokinesia LAD territory.');
      setValves('Mild mitral regurgitation secondary to LV remodelling.');
    } else if (preset === 'hfref') {
      setReportType('Echocardiogram');
      setEf(32);
      setLvedd(64);
      setLvesd(52);
      setWallMotion('Diffuse global hypokinesia with marked left ventricular dilation.');
      setValves('Moderate functional mitral and tricuspid regurgitation.');
    } else if (preset === 'af') {
      setReportType('12-Lead ECG');
      setRhythm('Atrial Fibrillation with Rapid Ventricular Response');
      setRate(118);
      setQrsDuration(92);
      setQtcInterval(440);
      setStSegment('Absence of P-waves with irregularly irregular R-R intervals and diffuse non-specific ST depression.');
    } else {
      setReportType('Echocardiogram');
      setEf(60);
      setLvedd(48);
      setLvesd(30);
      setWallMotion('Normal wall motion across all coronary territories.');
      setValves('Normal valve structure and physiologic flow velocities.');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2.5 font-heading">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700">
              <Activity className="w-5 h-5" />
            </div>
            Cardiology Diagnostic Reports Engine
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Automated Echocardiogram & ECG report generation with clinical conclusions and one-click PDF printing
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGenerateAndSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-cyan-700 hover:bg-cyan-600 shadow-md shadow-cyan-700/20 transition"
          >
            <Printer className="w-4 h-4" />
            Generate & Print Report PDF
          </button>
        </div>
      </div>

      {/* Modality Selector & Quick Presets */}
      <div className="my-5 flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setReportType('Echocardiogram')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              reportType === 'Echocardiogram'
                ? 'bg-cyan-700 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-4 h-4" />
            2D Echocardiogram (TTE)
          </button>
          <button
            onClick={() => setReportType('12-Lead ECG')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              reportType === '12-Lead ECG'
                ? 'bg-cyan-700 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            12-Lead ECG Interpretation
          </button>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-medium">Auto-fill preset:</span>
          <button
            onClick={() => loadPreset('post-stemi')}
            className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium"
          >
            Post-STEMI LAD
          </button>
          <button
            onClick={() => loadPreset('hfref')}
            className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium"
          >
            HFrEF (EF 32%)
          </button>
          <button
            onClick={() => loadPreset('af')}
            className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium"
          >
            Atrial Fibrillation
          </button>
          <button
            onClick={() => loadPreset('normal')}
            className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium"
          >
            Normal
          </button>
        </div>
      </div>

      {/* Form Fields depending on Modality */}
      {reportType === 'Echocardiogram' ? (
        <div className="space-y-4">
          {/* EF Slider & Dimension Inputs */}
          <div className="p-4 rounded-xl bg-cyan-50/40 border border-cyan-100 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-800">
                <span>Left Ventricular EF (%):</span>
                <span className="text-cyan-800 text-sm font-black">{ef}%</span>
              </div>
              <input
                type="range"
                min="15"
                max="75"
                value={ef}
                onChange={e => setEf(Number(e.target.value))}
                className="w-full accent-cyan-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Severe (&lt;35%)</span>
                <span>Moderate (36-49%)</span>
                <span>Normal (&gt;=50%)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">LVEDD (mm):</label>
              <input
                type="number"
                value={lvedd}
                onChange={e => setLvedd(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-600 bg-white"
              />
              <span className="text-[10px] text-slate-400">Normal: 38 - 56 mm</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">LVESD (mm):</label>
              <input
                type="number"
                value={lvesd}
                onChange={e => setLvesd(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-600 bg-white"
              />
              <span className="text-[10px] text-slate-400">Normal: 24 - 40 mm</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Segmental Wall Motion Analysis:</label>
              <textarea
                rows={2}
                value={wallMotion}
                onChange={e => setWallMotion(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-600"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1">Valvular Morphology & Color Doppler:</label>
              <textarea
                rows={2}
                value={valves}
                onChange={e => setValves(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-600"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1">Diastolic Function (Mitral E/A & TDI e'):</label>
              <textarea
                rows={2}
                value={diastolic}
                onChange={e => setDiastolic(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-600"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1">Pericardium & Effusion:</label>
              <textarea
                rows={2}
                value={pericardium}
                onChange={e => setPericardium(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-600"
              />
            </div>
          </div>
        </div>
      ) : (
        /* ECG Form */
        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="block font-bold text-slate-800 mb-1">Cardiac Rhythm:</label>
              <input
                type="text"
                value={rhythm}
                onChange={e => setRhythm(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-600"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1">Heart Rate (bpm):</label>
              <input
                type="number"
                value={rate}
                onChange={e => setRate(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-600"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1">PR Interval (ms):</label>
              <input
                type="number"
                value={prInterval}
                onChange={e => setPrInterval(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-600"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1">QRS Duration (ms):</label>
              <input
                type="number"
                value={qrsDuration}
                onChange={e => setQrsDuration(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-600"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 mb-1">QTc Interval (ms):</label>
              <input
                type="number"
                value={qtcInterval}
                onChange={e => setQtcInterval(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">ST-T Wave & Repolarization Findings:</label>
            <textarea
              rows={2}
              value={stSegment}
              onChange={e => setStSegment(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-cyan-600"
            />
          </div>
        </div>
      )}

      {/* Automated Diagnostic Summary Preview */}
      <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4 text-cyan-600" />
          <span>Automated Guideline Conclusions (Generated in Real-Time):</span>
        </div>
        <ul className="space-y-1 text-xs text-slate-700 list-disc list-inside">
          {generateConclusions().map((item, idx) => (
            <li key={idx} className="font-medium">{item}</li>
          ))}
        </ul>
      </div>

      {/* Historical Reports List for this patient */}
      {reports.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-200">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Saved Cardiac Diagnostic Reports ({reports.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reports.map(rep => (
              <div
                key={rep.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-cyan-300 hover:shadow-sm transition flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-cyan-600" />
                    <span>{rep.type}</span>
                    <span className="text-[11px] text-slate-500 font-normal">({rep.date})</span>
                  </div>
                  <div className="text-slate-600 text-[11px] mt-0.5 line-clamp-1">
                    {rep.conclusions[0]}
                  </div>
                </div>
                <button
                  onClick={() => onOpenPrintReport(rep)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 transition flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print PDF
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
