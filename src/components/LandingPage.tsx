import React from 'react';
import { 
  Heart, 
  Activity, 
  ShieldCheck, 
  FileText, 
  Smartphone, 
  Stethoscope, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Users, 
  Award,
  Sparkles,
  ChevronRight,
  TrendingUp,
  MessageCircle
} from 'lucide-react';

interface LandingPageProps {
  onLaunchDashboard: () => void;
  onOpenPatientPortal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchDashboard, onOpenPatientPortal }) => {
  const WHATSAPP_URL = "https://wa.me/201146963589?text=Hello%20Cardios%20Team,%20I%20would%20like%20to%20book%20a%20live%20demo.";

  const comparisonData = [
    {
      feature: 'Cardiology-Specialized Diagnostic Workflows (Echo & 12-Lead ECG)',
      cardios: true,
      altibbi: false,
      detail: 'Tailored measurements: LVEF, LV diameters, wall motion scores & automated ECG wave interpretation.'
    },
    {
      feature: 'Real-Time Remote Patient Monitoring (RPM) Telemetry Alerts',
      cardios: true,
      altibbi: false,
      detail: 'Instant automated red alerts for Hypertensive Crisis (>160/100 mmHg) and Tachycardia.'
    },
    {
      feature: 'Smart Cardiology Prescription Engine & Dosage Auto-Complete',
      cardios: true,
      altibbi: false,
      detail: 'Curated cardiology formulary with GDMT templates (HFrEF, Post-PCI DAPT, Anticoagulation).'
    },
    {
      feature: 'One-Click Official PDF Prescription & Cardiac Report Printing',
      cardios: true,
      altibbi: false,
      detail: 'Clean print styling with doctor header, clinic logo, digital signature & zero UI clutter.'
    },
    {
      feature: 'Integrated Cardiac AI Clinical Assistant',
      cardios: true,
      altibbi: false,
      detail: 'Guideline-grounded (ESC/AHA) instant vital trend analysis and multi-turn clinical recommendations.'
    },
    {
      feature: 'Dedicated Mobile Patient RPM Portal (Direct BP & HR Sync)',
      cardios: true,
      altibbi: 'Limited',
      detail: 'Two-way synchronization between home monitoring devices and clinic dashboard.'
    },
    {
      feature: 'Multi-Disciplinary Cardiac Referrals (Cath Lab, EP, Cardiac Surgery)',
      cardios: true,
      altibbi: false,
      detail: 'Structured clinical referral summaries tailored for tertiary intervention centers.'
    },
    {
      feature: 'Integrated Practice Billing & Cardiac Procedure Invoicing',
      cardios: true,
      altibbi: 'Generic',
      detail: 'Pre-coded billing for Echo, Holter, Stress Testing, and monthly cellular RPM service tiers.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-rose-500 selection:text-white">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-cardio-900 via-rose-950 to-slate-900 border-b border-rose-900/40 px-4 py-2.5 text-xs sm:text-sm text-center font-medium text-rose-200 flex items-center justify-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping" />
        <span className="font-semibold text-white">Next-Gen Release:</span> Cardios v2.4 with Automated Echo EF Engine & Real-Time RPM Sync is live.
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="underline hover:text-white ml-2 inline-flex items-center gap-1 font-bold">
          Book Demo via WhatsApp <ArrowRight className="w-3 h-3" />
        </a>
      </div>

      {/* Navigation Header */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cardio-600 to-rose-500 flex items-center justify-center shadow-lg shadow-rose-900/40 ring-2 ring-rose-400/20">
            <Heart className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-white font-heading">Cardios</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono font-semibold">EHR & RPM</span>
            </div>
            <p className="text-[11px] text-slate-400">Cardiovascular Practice Intelligence</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#comparison" className="hover:text-white transition">Altibbi Comparison</a>
          <a href="#telemetry" className="hover:text-white transition">RPM Telemetry</a>
          <a href="#specialties" className="hover:text-white transition">Clinical Modules</a>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenPatientPortal}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition"
          >
            <Smartphone className="w-4 h-4 text-emerald-400" />
            Patient Portal
          </button>
          <button 
            onClick={onLaunchDashboard}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-cardio-600 to-rose-600 hover:from-cardio-500 hover:to-rose-500 shadow-lg shadow-rose-600/30 transition transform hover:-translate-y-0.5"
          >
            <Stethoscope className="w-4 h-4" />
            Launch Dashboard
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 overflow-hidden">
        {/* Glow & Radial Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-cardio-700/20 via-rose-600/10 to-indigo-600/10 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/10 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-xs sm:text-sm font-medium text-slate-300 mb-8 shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            Designed specifically for Cardiologists, Cath Labs & Heart Clinics
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto font-heading leading-tight">
            Cardiology-First <span className="bg-gradient-to-r from-rose-400 via-cardio-400 to-orange-300 bg-clip-text text-transparent">EHR & RPM</span> Platform
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Eliminate generic telemedicine friction with an integrated cardiovascular operating system. Real-time patient telemetry, guideline-directed smart prescriptions, automated Echocardiography & ECG reporting, and instant patient follow-ups.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onLaunchDashboard}
              className="px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-cardio-600 via-rose-600 to-red-600 hover:from-cardio-500 hover:to-rose-500 shadow-xl shadow-rose-600/30 flex items-center gap-3 transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Activity className="w-5 h-5 animate-pulse text-white" />
              Launch Dashboard
              <ChevronRight className="w-5 h-5 text-rose-200" />
            </button>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl text-base font-bold text-emerald-300 bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/40 hover:border-emerald-400 flex items-center gap-3 shadow-lg shadow-emerald-950/40 transition transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-5 h-5 text-emerald-400" />
              Book Demo via WhatsApp
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>ESC & ACC/AHA Guideline Aligned</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              <span>HIPAA & HL7/FHIR Data Standard</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Real-Time Cellular RPM Sync</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Specialized Drug Formulary</span>
            </div>
          </div>

          {/* Interactive Hero Preview Mockup */}
          <div className="mt-16 max-w-5xl mx-auto rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900/90 p-3 sm:p-4 border border-slate-700/80 shadow-2xl shadow-rose-950/40">
            <div className="bg-slate-950 rounded-xl overflow-hidden border border-slate-800 text-left">
              {/* Window Bar */}
              <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs text-slate-400 font-mono ml-2">cardios-clinical-station // Ahmed Hassan (MRN: CRD-2026-0891)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                    LIVE RPM ALERT: 168/98 mmHg
                  </span>
                </div>
              </div>

              {/* Mock Dashboard Preview Content */}
              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 bg-gradient-to-b from-slate-950 to-slate-900">
                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>Active Telemetry</span>
                    <Heart className="w-4 h-4 text-rose-500" />
                  </div>
                  <div className="text-2xl font-bold text-white">168 / 98 <span className="text-xs text-slate-400 font-normal">mmHg</span></div>
                  <div className="mt-2 text-xs text-rose-400 flex items-center gap-1 font-medium">
                    <TrendingUp className="w-3 h-3" /> Exceeds Stage 2 target (+28 mmHg)
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800 flex justify-between text-xs text-slate-300">
                    <span>Heart Rate: <strong className="text-white">88 bpm</strong></span>
                    <span>SpO2: <strong className="text-emerald-400">97%</strong></span>
                  </div>
                </div>

                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>Automated Echo Summary</span>
                    <Activity className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">LVEF: 48% <span className="text-xs text-amber-400 font-normal">(Mild-Mod Reduction)</span></div>
                  <p className="mt-2 text-xs text-slate-300 line-clamp-2">
                    Antero-apical hypokinesia LAD territory. Mild functional MR.
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-cyan-400 font-medium">
                    <span>TTE Protocol Complete</span>
                    <span className="text-slate-400">Dr. Karim El-Sayed</span>
                  </div>
                </div>

                <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>Smart Prescription Engine</span>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-sm font-semibold text-white">GDMT Post-PCI Protocol</div>
                  <div className="mt-2 space-y-1 text-xs text-slate-300">
                    <div>• Atorvastatin 80mg QHS</div>
                    <div>• Aspirin 81mg + Ticagrelor 90mg</div>
                    <div>• Ramipril 5mg (Titration due)</div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-emerald-400 font-medium">Auto-calculated</span>
                    <span className="text-slate-400 text-[10px]">Print-ready PDF</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Cards */}
      <section id="features" className="py-20 bg-slate-950 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest text-rose-500 font-bold mb-2">Architected For Cardiology Excellence</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
              Everything Your Heart Clinic Needs in One Unified OS
            </p>
            <p className="mt-4 text-slate-400">
              General EHRs force cardiologists to squeeze complex hemodynamic and diagnostic data into generic text boxes. Cardios gives every cardiac procedure its dedicated high-precision cockpit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 transition group">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Real-Time RPM & Alert Engine</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Connect patient cellular BP cuffs and wearable monitors directly to your clinical station. Receive immediate red alerts when systolic BP exceeds 160 or severe arrhythmia strikes.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Echocardiography & ECG Engine</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Automated clinical summaries for 2D Transthoracic Echo (LVEF, wall motion, valves) and 12-lead ECGs with one-click exportable PDF reporting for referring physicians.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Intelligent Smart Prescriptions</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Fast auto-complete for brand and generic cardiac drugs with pre-configured guideline dosage templates for Heart Failure (GDMT), Post-PCI DAPT, and Hypertension.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Mobile Patient Portal & Telemetry</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Zero-install mobile web dashboard for patients to record daily morning/evening BP readings, review active medications, and maintain doctor communication.
              </p>
            </div>

            {/* Card 5 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Cath Lab & Surgery Referrals</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Direct referral management for coronary angiography, catheterization labs, cardiac MRI, electrophysiology, and cardiothoracic surgery centers with live status tracking.
              </p>
            </div>

            {/* Card 6 */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-rose-500/50 transition group">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Practice Invoicing & Scheduling</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Built-in billing module with itemized cardiac procedure codes (TTE, ECG, Holter 24h, RPM subscription) and an interactive appointment scheduling calendar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table: Cardios vs General Telemedicine (Altibbi) */}
      <section id="comparison" className="py-24 bg-slate-900 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-semibold mb-3">
              Detailed Competitive Analysis
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
              Cardios vs. General Telemedicine Platforms (e.g., Altibbi)
            </h2>
            <p className="mt-4 text-slate-400">
              Why leading cardiology clinics and catheterization teams switch from generic telemedicine portals to Cardios.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/90">
                  <th className="py-5 px-6 font-bold text-slate-300 w-1/2">Clinical Capability & Workflow</th>
                  <th className="py-5 px-6 font-extrabold text-rose-400 bg-rose-950/30 border-x border-rose-900/30 text-center w-1/4">
                    <div className="flex items-center justify-center gap-2">
                      <Heart className="w-4 h-4 text-rose-400 fill-rose-500/20" />
                      <span>Cardios</span>
                    </div>
                    <span className="text-[10px] text-rose-300/80 font-normal">Cardiology-First EHR</span>
                  </th>
                  <th className="py-5 px-6 font-bold text-slate-400 text-center w-1/4">
                    <span>Altibbi & General Telemedicine</span>
                    <span className="block text-[10px] text-slate-500 font-normal">General Multi-Specialty</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {comparisonData.map((row, index) => (
                  <tr key={index} className="hover:bg-slate-900/50 transition">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-white">{row.feature}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{row.detail}</div>
                    </td>
                    <td className="py-4 px-6 text-center bg-rose-950/10 border-x border-rose-900/20">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Native / Specialized
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {row.altibbi === true ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          Supported
                        </div>
                      ) : row.altibbi === 'Limited' || row.altibbi === 'Generic' ? (
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium">
                          {row.altibbi} (Non-cardiac)
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 text-xs">
                          <XCircle className="w-3.5 h-3.5 text-slate-500" />
                          Not Available
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 bg-gradient-to-b from-slate-900 via-rose-950/40 to-slate-950 border-t border-slate-800 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="w-16 h-16 rounded-2xl bg-cardio-600/20 border border-cardio-500/30 flex items-center justify-center mx-auto mb-6 text-cardio-400">
            <Heart className="w-8 h-8 animate-pulse text-cardio-500" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading">
            Upgrade Your Cardiology Practice Today
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
            Experience real-time RPM telemetry, seamless prescription generation, and automated cardiac reports in action.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onLaunchDashboard}
              className="px-8 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-cardio-600 to-rose-600 hover:from-cardio-500 hover:to-rose-500 shadow-xl shadow-rose-600/30 flex items-center gap-2"
            >
              <Stethoscope className="w-5 h-5" />
              Launch Doctor Station
            </button>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl text-base font-bold text-emerald-300 bg-emerald-950 border border-emerald-500/40 hover:bg-emerald-900/80 flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5 text-emerald-400" />
              Book Demo (+20 114 696 3589)
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-950 border-t border-slate-800/80 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <Heart className="w-4 h-4 text-rose-500" />
            <span className="font-bold text-slate-200">Cardios Platform</span> — Dedicated Cardiovascular Operating System.
          </div>
          <div>
            Built with React, Vite, Tailwind CSS, & Cloud Firestore. ESC / AHA Guideline Compliant.
          </div>
        </div>
      </footer>
    </div>
  );
};
