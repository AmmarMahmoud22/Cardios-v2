import React, { useState } from 'react';
import { Patient, RPMAlert, Appointment, LabTest } from '../types';
import { acknowledgeRPMAlert, savePatient } from '../firebase/firestoreService';
import { 
  Users, 
  Activity, 
  Clock, 
  AlertTriangle, 
  Calendar as CalendarIcon, 
  Search, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  Heart, 
  ShieldAlert, 
  ShieldCheck, 
  Filter, 
  UserPlus, 
  X 
} from 'lucide-react';

interface DashboardProps {
  patients: Patient[];
  activeAlerts: RPMAlert[];
  appointments: Appointment[];
  labs: LabTest[];
  onSelectPatient: (patientId: string) => void;
  onNavigateToCalendar: () => void;
  onNavigateToPortal: () => void;
  onPatientAdded: (newPatient: Patient) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  patients,
  activeAlerts,
  appointments,
  labs,
  onSelectPatient,
  onNavigateToCalendar,
  onNavigateToPortal,
  onPatientAdded
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // New Patient Form
  const [name, setName] = useState('');
  const [dob, setDob] = useState('1975-06-15');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [phone, setPhone] = useState('+20 100 000 0000');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('Cairo, Egypt');
  const [bloodType, setBloodType] = useState('A+');
  const [primaryDiagnosis, setPrimaryDiagnosis] = useState('Hypertension Stage 2 & Coronary Artery Disease');
  const [riskFactors, setRiskFactors] = useState('Smoking, Dyslipidemia');
  const [allergies, setAllergies] = useState('None');

  const unacknowledgedAlerts = activeAlerts.filter(a => !a.acknowledged);
  const pendingLabs = labs.filter(l => l.status === 'Pending Review');
  const todayAppointments = appointments.filter(a => a.date === '2026-10-22');

  const handleRegisterPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    const newPatient: Patient = {
      id: `p-${Date.now()}`,
      mrn: `CRD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name.trim(),
      age: age || 50,
      dob,
      gender,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      address,
      status: 'Stable',
      bloodType,
      primaryDiagnosis,
      secondaryDiagnoses: ['Essential Hypertension'],
      riskFactors: riskFactors.split(',').map(s => s.trim()).filter(Boolean),
      allergies: allergies.split(',').map(s => s.trim()).filter(Boolean),
      implantedDevices: ['None'],
      lastVisit: new Date().toISOString().split('T')[0],
      nextAppointment: '2026-11-20'
    };

    await savePatient(newPatient);
    onPatientAdded(newPatient);
    setIsRegisterModalOpen(false);
    setName('');
  };

  const handleAcknowledgeAlert = async (alertId: string) => {
    await acknowledgeRPMAlert(alertId, 'Acknowledged by Dr. Karim El-Sayed in clinical dashboard');
  };

  // Filter patients
  const filteredPatients = patients.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.primaryDiagnosis.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Live Clinical Telemetry Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading mt-1">
            Cardiologist Practice Station
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time RPM telemetry alerts, guideline-directed pharmacotherapy, and diagnostic echocardiography
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRegisterModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30 transition transform hover:-translate-y-0.5"
          >
            <UserPlus className="w-4 h-4" />
            Register Patient
          </button>
          <button
            onClick={onNavigateToPortal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition"
          >
            <Activity className="w-4 h-4 text-emerald-600" />
            Launch Mobile RPM
          </button>
        </div>
      </div>

      {/* Key Metrics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Active Patients */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Active Registered Patients</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900 font-heading">
            {patients.length}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
            <span className="text-emerald-600 font-bold">100% Continuous RPM</span> enabled
          </div>
        </div>

        {/* Metric 2: RPM Alerts */}
        <div className={`p-5 rounded-2xl border shadow-sm transition ${
          unacknowledgedAlerts.length > 0
            ? 'bg-gradient-to-br from-rose-50 to-white border-rose-300 ring-2 ring-rose-500/20'
            : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Real-Time RPM Alerts</span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
              unacknowledgedAlerts.length > 0 ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-100 text-slate-600'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-black text-rose-600 font-heading">
            {unacknowledgedAlerts.length}
          </div>
          <div className="mt-2 text-[11px] text-rose-700 font-bold flex items-center gap-1">
            {unacknowledgedAlerts.length > 0 ? (
              <span>Requires immediate clinical review</span>
            ) : (
              <span className="text-emerald-600">All telemetry within limits</span>
            )}
          </div>
        </div>

        {/* Metric 3: Pending Lab Results */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Pending STAT Lab Results</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-black text-amber-600 font-heading">
            {pendingLabs.length}
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Troponin & NT-proBNP in central lab
          </div>
        </div>

        {/* Metric 4: Today's Appointments */}
        <div
          onClick={onNavigateToCalendar}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Today's Appointments</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-105 transition flex items-center justify-center font-bold">
              <CalendarIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900 font-heading">
            {todayAppointments.length}
          </div>
          <div className="mt-2 text-[11px] text-indigo-600 font-bold flex items-center gap-1">
            <span>View Schedule</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
          </div>
        </div>
      </div>

      {/* Real-Time Active RPM Alerts Panel */}
      {unacknowledgedAlerts.length > 0 && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-6 shadow-md shadow-rose-950/5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-rose-950 font-heading">
                  Active Real-Time RPM Telemetry Alerts ({unacknowledgedAlerts.length})
                </h2>
                <p className="text-xs text-rose-800">
                  Critical high BP or heart rate readings synchronized from home cellular monitors
                </p>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-rose-600 text-white font-bold animate-ping">
              STAT ACTION
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unacknowledgedAlerts.map(alert => (
              <div
                key={alert.id}
                className="bg-white p-4 rounded-xl border border-rose-200 shadow-sm flex flex-col justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => onSelectPatient(alert.patientId)}
                      className="font-bold text-sm text-slate-900 hover:text-rose-600 transition"
                    >
                      {alert.patientName}
                    </button>
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-black text-[10px]">
                      {alert.type}
                    </span>
                  </div>

                  <div className="mt-2 text-rose-600 font-black text-base">
                    {alert.reading}
                  </div>

                  <div className="text-[11px] text-slate-500 mt-1">
                    Received: {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {alert.actionTaken}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onSelectPatient(alert.patientId)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition"
                  >
                    View Chart
                  </button>
                  <button
                    onClick={() => handleAcknowledgeAlert(alert.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Acknowledge
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Patient Overview Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Search & Filter Bar */}
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-extrabold text-slate-900 font-heading">
              Registered Patients Directory
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
              {filteredPatients.length} Active Records
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search patient, MRN, diagnosis..."
                className="pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-rose-500 w-60"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-lg transition ${
                  statusFilter === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('Alert: High BP')}
                className={`px-3 py-1 rounded-lg transition ${
                  statusFilter === 'Alert: High BP' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600'
                }`}
              >
                Alerts
              </button>
              <button
                onClick={() => setStatusFilter('Pending Lab')}
                className={`px-3 py-1 rounded-lg transition ${
                  statusFilter === 'Pending Lab' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600'
                }`}
              >
                Pending Labs
              </button>
              <button
                onClick={() => setStatusFilter('Stable')}
                className={`px-3 py-1 rounded-lg transition ${
                  statusFilter === 'Stable' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600'
                }`}
              >
                Stable
              </button>
            </div>
          </div>
        </div>

        {/* Patient Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Patient Name & MRN</th>
                <th className="py-4 px-6">DOB & Age</th>
                <th className="py-4 px-6">Primary Cardiology Diagnosis</th>
                <th className="py-4 px-6">Status Badge</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No matching patients found.
                  </td>
                </tr>
              ) : (
                filteredPatients.map(patient => (
                  <tr
                    key={patient.id}
                    className="hover:bg-slate-50/80 transition group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 font-bold flex items-center justify-center shrink-0 group-hover:bg-rose-100 group-hover:text-rose-700 transition">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <button
                            onClick={() => onSelectPatient(patient.id)}
                            className="font-bold text-sm text-slate-900 hover:text-rose-600 transition text-left"
                          >
                            {patient.name}
                          </button>
                          <div className="text-[11px] text-slate-400 font-mono">{patient.mrn}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-slate-600">
                      <div className="font-medium text-slate-800">{patient.dob}</div>
                      <div className="text-[11px] text-slate-400">{patient.age}y • {patient.gender}</div>
                    </td>

                    <td className="py-4 px-6 max-w-xs">
                      <div className="font-medium text-slate-800 line-clamp-1">{patient.primaryDiagnosis}</div>
                      <div className="text-[11px] text-slate-400">
                        Blood: <strong className="text-rose-600 font-semibold">{patient.bloodType}</strong> • Next visit: {patient.nextAppointment || 'TBD'}
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        patient.status === 'Alert: High BP'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : patient.status === 'Pending Lab'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {patient.status === 'Alert: High BP' ? (
                          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                        ) : (
                          <ShieldCheck className="w-3.5 h-3.5" />
                        )}
                        {patient.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => onSelectPatient(patient.id)}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-rose-600 transition shadow-sm"
                      >
                        <span>View Profile</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Patient Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-sm font-bold flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-rose-500" />
                Register New Cardiology Patient
              </h2>
              <button onClick={() => setIsRegisterModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRegisterPatient} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Full Patient Name:</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Mahmoud Youssef"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date of Birth:</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender:</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as 'Male' | 'Female')}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number:</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Blood Type:</label>
                  <select
                    value={bloodType}
                    onChange={e => setBloodType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
                  >
                    <option value="O+">O+</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O-">O-</option>
                    <option value="A-">A-</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Primary Cardiology Diagnosis:</label>
                  <input
                    type="text"
                    value={primaryDiagnosis}
                    onChange={e => setPrimaryDiagnosis(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Risk Factors (comma-separated):</label>
                  <input
                    type="text"
                    value={riskFactors}
                    onChange={e => setRiskFactors(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Known Allergies:</label>
                  <input
                    type="text"
                    value={allergies}
                    onChange={e => setAllergies(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-md"
                >
                  Register & Create MRN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
