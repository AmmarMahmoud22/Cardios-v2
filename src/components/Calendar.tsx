import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Appointment, Patient } from '../types';
import { saveAppointment } from '../firebase/firestoreService';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  CheckCircle2, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  FileText, 
  X 
} from 'lucide-react';

interface CalendarProps {
  patients: Patient[];
  appointments: Appointment[];
  onAppointmentSaved: (appointment: Appointment) => void;
  onSelectPatient: (patientId: string) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  patients,
  appointments,
  onAppointmentSaved,
  onSelectPatient
}) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language?.startsWith('ar');
  const [selectedDate, setSelectedDate] = useState('2026-10-22');
  const [filterType, setFilterType] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New appointment form state
  const [patientId, setPatientId] = useState(patients[0]?.id || 'p-1');
  const [date, setDate] = useState(selectedDate);
  const [time, setTime] = useState('11:00');
  const [type, setType] = useState<Appointment['type']>('Initial Consultation');
  const [reason, setReason] = useState('Comprehensive cardiac assessment & 12-lead ECG');
  const [notes, setNotes] = useState('Patient referred for baseline hemodynamic profile.');

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find(p => p.id === patientId) || patients[0];

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: pat.id,
      patientName: pat.name,
      date,
      time,
      type,
      status: 'Scheduled',
      reason,
      notes
    };

    await saveAppointment(newApt);
    onAppointmentSaved(newApt);
    setIsModalOpen(false);
  };

  const handleUpdateStatus = async (apt: Appointment, newStatus: Appointment['status']) => {
    const updated: Appointment = {
      ...apt,
      status: newStatus
    };
    await saveAppointment(updated);
    onAppointmentSaved(updated);
  };

  // Filter appointments
  const filteredAppointments = appointments.filter(apt => {
    if (filterType !== 'all' && apt.type !== filterType) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-left rtl:text-right">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5 font-heading">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
              <CalendarIcon className="w-5 h-5" />
            </div>
            {t('calendar.title')}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {t('calendar.subtitle')}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/30 transition"
        >
          <Plus className="w-4 h-4" />
          {t('calendar.bookAppointment')}
        </button>
      </div>

      {/* Filter and stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-left rtl:text-right">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">{t('calendar.todayAppointments')}</div>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {appointments.filter(a => a.date === '2026-10-22').length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <CalendarIcon className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">{t('dashboard.statActiveAlerts')}</div>
            <div className="text-2xl font-black text-cyan-600 mt-0.5">
              {appointments.filter(a => a.type === 'RPM Review').length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">{t('dashboard.postPci')}</div>
            <div className="text-2xl font-black text-indigo-600 mt-0.5">
              {appointments.filter(a => a.type === 'Post-PCI Check').length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">{t('calendar.echoSlot')}</div>
            <div className="text-2xl font-black text-amber-600 mt-0.5">
              {appointments.filter(a => a.type === 'Echo Follow-up').length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Appointment List / Schedule Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Controls Bar */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">{t('common.filter')}:</span>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-medium focus:outline-none"
            >
              <option value="all">{t('common.all')}</option>
              <option value="Initial Consultation">{isRtl ? 'كشف أول مرة' : 'Initial Consultation'}</option>
              <option value="Echo Follow-up">{isRtl ? 'متابعة إيكو' : 'Echo Follow-up'}</option>
              <option value="RPM Review">{isRtl ? 'مراجعة قياسات RPM' : 'RPM Review'}</option>
              <option value="Post-PCI Check">{isRtl ? 'متابعة بعد القسطرة' : 'Post-PCI Check'}</option>
            </select>
          </div>

          <div className="text-slate-500 font-medium">
            {filteredAppointments.length} {t('calendar.todayAppointments')}
          </div>
        </div>

        {/* Appointment Cards */}
        <div className="divide-y divide-slate-100">
          {filteredAppointments.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              No appointments matching this filter.
            </div>
          ) : (
            filteredAppointments.map(apt => {
              const isToday = apt.date === '2026-10-22';
              return (
                <div
                  key={apt.id}
                  className="p-5 hover:bg-slate-50 transition flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-start gap-4">
                    {/* Time Slot badge */}
                    <div className="text-center p-2.5 rounded-xl bg-slate-100 border border-slate-200 shrink-0 w-20">
                      <div className="font-black text-sm text-slate-900">{apt.time}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{apt.date}</div>
                      {isToday && (
                        <span className="inline-block mt-1 px-1.5 py-0.2 rounded bg-rose-600 text-white text-[9px] font-bold uppercase">
                          Today
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectPatient(apt.patientId)}
                          className="font-bold text-sm text-slate-900 hover:text-rose-600 transition"
                        >
                          {apt.patientName}
                        </button>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-700 text-[10px]">
                          {apt.type}
                        </span>
                      </div>

                      <div className="text-slate-700 font-medium">
                        Reason: {apt.reason}
                      </div>

                      {apt.notes && (
                        <div className="text-slate-500 italic text-[11px]">
                          Clinical Notes: {apt.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions & Status */}
                  <div className="flex items-center gap-3 md:self-center">
                    <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${
                      apt.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : apt.status === 'In Progress'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {apt.status}
                    </span>

                    <button
                      onClick={() => onSelectPatient(apt.patientId)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold transition"
                    >
                      Open Chart
                    </button>

                    {apt.status !== 'Completed' && (
                      <button
                        onClick={() => handleUpdateStatus(apt, 'Completed')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-sm font-bold flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-rose-500" />
                {t('calendar.bookAppointment')}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAppointment} className="p-6 space-y-4 text-xs text-left rtl:text-right">
              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('calendar.selectPatient')}:</label>
                <select
                  value={patientId}
                  onChange={e => setPatientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.mrn}) — {p.primaryDiagnosis}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('calendar.date')}:</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{t('calendar.time')}:</label>
                  <input
                    type="time"
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('calendar.type')}:</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as Appointment['type'])}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-medium"
                >
                  <option value="Initial Consultation">{isRtl ? 'كشف أولي' : 'Initial Consultation'}</option>
                  <option value="Echo Follow-up">{isRtl ? 'فحص صدى القلب (إيكو)' : 'Echo Diagnostic Follow-up'}</option>
                  <option value="RPM Review">{isRtl ? 'مراجعة المراقبة عن بُعد (RPM)' : 'RPM Telemetry Review'}</option>
                  <option value="Post-PCI Check">{isRtl ? 'متابعة بعد دعامة/قسطرة' : 'Post-PCI Coronary Check'}</option>
                  <option value="Routine Checkup">{isRtl ? 'فحص دوري روتيني' : 'Routine Cardiovascular Checkup'}</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('calendar.notes')}:</label>
                <input
                  type="text"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">{t('common.notes')}:</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 font-bold"
                >
                  {t('calendar.cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-md"
                >
                  {t('calendar.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
