import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Patient, 
  RPMAlert, 
  Appointment, 
  LabTest, 
  Prescription, 
  CardiologyReportData 
} from './types';
import { hasPermission } from './types/auth';
import { useAuth } from './contexts/AuthContext';
import { 
  fetchPatients, 
  fetchRPMAlerts, 
  fetchAppointments, 
  fetchLabs, 
  fetchPrescriptions, 
  subscribeToRPMAlerts 
} from './firebase/firestoreService';
import { LandingPage } from './components/LandingPage';
import { Navbar, NavigationTab } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { PatientProfile } from './components/PatientProfile';
import { PatientMobileDashboard } from './components/PatientMobileDashboard';
import { Calendar } from './components/Calendar';
import { SmartPrescription } from './components/SmartPrescription';
import { CardiologyReport } from './components/CardiologyReport';
import { PrintablePrescription } from './components/PrintablePrescription';
import { PrintableReport } from './components/PrintableReport';
import { LoginScreen } from './components/LoginScreen';
import { OnboardingModal } from './components/OnboardingModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AlertTriangle, Bell, CheckCircle2, X } from 'lucide-react';

export function App() {
  const { t } = useTranslation();
  const {
    user,
    firebaseUser,
    isLoading: authLoading,
    isAuthenticated,
    needsOnboarding,
    error: authError,
    signIn,
    signOut,
    completeOnboarding,
  } = useAuth();

  const [currentTab, setCurrentTab] = useState<NavigationTab>('landing');
  const [selectedPatientId, setSelectedPatientId] = useState<string>('p-1'); // Ahmed Hassan by default
  const [patients, setPatients] = useState<Patient[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<RPMAlert[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [labs, setLabs] = useState<LabTest[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [reports, setReports] = useState<CardiologyReportData[]>([]);

  // Live Toast Notification
  const [toastAlert, setToastAlert] = useState<RPMAlert | null>(null);

  // Standalone print preview triggers from top shortcuts
  const [standaloneRxPrint, setStandaloneRxPrint] = useState<Prescription | null>(null);
  const [standaloneReportPrint, setStandaloneReportPrint] = useState<CardiologyReportData | null>(null);

  // Load initial dataset when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadInitial() {
      const [patList, alertList, aptList, labList, rxList] = await Promise.all([
        fetchPatients(),
        fetchRPMAlerts(),
        fetchAppointments(),
        fetchLabs(),
        fetchPrescriptions(),
      ]);

      setPatients(patList);
      setActiveAlerts(alertList);
      setAppointments(aptList);
      setLabs(labList);
      setPrescriptions(rxList);
    }

    loadInitial();

    // Subscribe to Real-Time RPM Telemetry Alerts
    const unsubscribeAlerts = subscribeToRPMAlerts(updatedAlerts => {
      setActiveAlerts(updatedAlerts);

      // Check if there is an unacknowledged critical alert to display toast
      const latestCritical = updatedAlerts.find(a => !a.acknowledged && a.level === 'critical');
      if (latestCritical) {
        setToastAlert(latestCritical);
      }
    });

    return () => {
      unsubscribeAlerts();
    };
  }, [isAuthenticated]);

  // Auto-route patients to portal
  useEffect(() => {
    if (isAuthenticated && user?.role === 'patient' && currentTab === 'landing') {
      setCurrentTab('portal');
    }
  }, [isAuthenticated, user?.role, currentTab]);

  const activePatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // Navigation handlers
  const handleSelectTab = (tab: NavigationTab) => {
    if (!user) return;

    // Role-based navigation guards
    const role = user.role;
    if (tab === 'patients' && !hasPermission(role, 'view_patients') && !hasPermission(role, 'view_dashboard')) {
      return;
    }
    if (tab === 'prescription' && !hasPermission(role, 'manage_prescriptions')) {
      return;
    }
    if (tab === 'reports' && !hasPermission(role, 'view_reports')) {
      return;
    }
    if (tab === 'calendar' && !hasPermission(role, 'view_appointments')) {
      return;
    }
    if (tab === 'portal' && !hasPermission(role, 'view_portal') && role !== 'admin' && role !== 'doctor') {
      return;
    }
    if (tab === 'admin' && !hasPermission(role, 'view_admin_panel')) {
      return;
    }

    setCurrentTab(tab);
  };

  const handleOpenPatientProfile = (patientId: string) => {
    setSelectedPatientId(patientId);
    setCurrentTab('patients');
  };

  const handlePatientUpdated = (updated: Patient) => {
    setPatients(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handlePatientAdded = (newPat: Patient) => {
    setPatients(prev => [newPat, ...prev]);
    setSelectedPatientId(newPat.id);
  };

  // ─────────────────────────────────────
  // AUTH LOADING STATE
  // ─────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-semibold">{t('auth.loading', 'Loading Cardios...')}</p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────
  // NOT AUTHENTICATED → Show Login or Landing
  // ─────────────────────────────────────
  if (!isAuthenticated && !needsOnboarding) {
    // Show landing page with login option
    if (currentTab === 'landing') {
      return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
          <LandingPage
            onLaunchDashboard={() => setCurrentTab('login' as any)}
            onOpenPatientPortal={() => setCurrentTab('login' as any)}
          />
        </div>
      );
    }

    // Show login screen
    return (
      <LoginScreen
        onSignIn={signIn}
        error={authError}
        isLoading={authLoading}
      />
    );
  }

  // ─────────────────────────────────────
  // NEEDS ONBOARDING → Show Role Selection
  // ─────────────────────────────────────
  if (needsOnboarding && firebaseUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <OnboardingModal
          displayName={firebaseUser.displayName || 'User'}
          email={firebaseUser.email || ''}
          photoURL={firebaseUser.photoURL}
          onComplete={completeOnboarding}
          onCancel={signOut}
          isLoading={authLoading}
        />
      </div>
    );
  }

  // ─────────────────────────────────────
  // AUTHENTICATED → Role-Based Dashboard
  // ─────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Real-time Critical RPM Alert Floating Toast */}
      {toastAlert && hasPermission(user!.role, 'view_rpm_alerts') && (
        <div className="fixed bottom-6 ltr:right-6 rtl:left-6 z-50 max-w-md bg-rose-950 text-white p-4 rounded-2xl shadow-2xl border-2 border-rose-500 animate-bounce no-print">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping shrink-0" />
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  {t('common.toastAlertTitle')}
                </div>
                <div className="text-sm font-black text-white mt-0.5">
                  {toastAlert.patientName}: {toastAlert.reading}
                </div>
                <div className="text-[11px] text-rose-200 mt-1">
                  {toastAlert.type} • {t('common.cellularLink')}
                </div>
              </div>
            </div>
            <button
              onClick={() => setToastAlert(null)}
              className="text-rose-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 pt-3 border-t border-rose-900 flex justify-end gap-2">
            <button
              onClick={() => {
                setToastAlert(null);
                handleOpenPatientProfile(toastAlert.patientId);
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition"
            >
              {t('common.inspectChart')}
            </button>
          </div>
        </div>
      )}

      {/* Render Current View */}
      {currentTab === 'landing' ? (
        <LandingPage
          onLaunchDashboard={() => setCurrentTab('patients')}
          onOpenPatientPortal={() => setCurrentTab('portal')}
        />
      ) : currentTab === 'portal' ? (
        <PatientMobileDashboard
          patients={patients}
          activePatientId={selectedPatientId}
          onSelectPatient={id => setSelectedPatientId(id)}
          onVitalLogged={vital => {
            // Update patient status if alert triggered
            if (vital.isAlert) {
              setPatients(prev => prev.map(p => p.id === vital.patientId ? { ...p, status: 'Alert: High BP' } : p));
            }
          }}
          onBackToDoctorStation={() => setCurrentTab('patients')}
          prescriptions={prescriptions}
        />
      ) : (
        /* Clinical Workstation Layout with Shared Navbar */
        <div className="min-h-screen flex flex-col bg-slate-50">
          <Navbar
            currentTab={currentTab}
            onSelectTab={handleSelectTab}
            activeAlerts={activeAlerts}
            selectedPatientName={activePatient?.name}
            onOpenAlertsPanel={() => {
              setCurrentTab('patients');
            }}
            user={user}
            onSignOut={signOut}
          />

          <main className="flex-1 pb-16">
            {/* View: Admin Panel */}
            {currentTab === 'admin' && user?.role === 'admin' && (
              <AdminDashboard />
            )}

            {/* View: Patients Overview Table vs Specific Patient Profile */}
            {currentTab === 'patients' && (
              selectedPatientId ? (
                <PatientProfile
                  patient={activePatient}
                  onBackToDashboard={() => setSelectedPatientId('')}
                  onPatientUpdated={handlePatientUpdated}
                />
              ) : (
                <Dashboard
                  patients={patients}
                  activeAlerts={activeAlerts}
                  appointments={appointments}
                  labs={labs}
                  onSelectPatient={handleOpenPatientProfile}
                  onNavigateToCalendar={() => setCurrentTab('calendar')}
                  onNavigateToPortal={() => setCurrentTab('portal')}
                  onPatientAdded={handlePatientAdded}
                />
              )
            )}

            {/* View: Appointment Calendar */}
            {currentTab === 'calendar' && (
              <Calendar
                patients={patients}
                appointments={appointments}
                onAppointmentSaved={savedApt => {
                  setAppointments(prev => [savedApt, ...prev.filter(a => a.id !== savedApt.id)]);
                }}
                onSelectPatient={handleOpenPatientProfile}
              />
            )}

            {/* View: Smart Prescription Shortcut */}
            {currentTab === 'prescription' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                      {t('smartRx.selectPatientFor')}
                    </span>
                    <select
                      value={selectedPatientId}
                      onChange={e => setSelectedPatientId(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 font-black text-sm text-slate-900 bg-white"
                    >
                      {patients.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.mrn}) — {p.primaryDiagnosis}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <SmartPrescription
                  patient={activePatient}
                  onPrescriptionSaved={savedRx => {
                    setPrescriptions(prev => [savedRx, ...prev]);
                  }}
                  onOpenPrintPreview={rxToPrint => {
                    setStandaloneRxPrint(rxToPrint);
                  }}
                />
              </div>
            )}

            {/* View: Cardiology Reports Engine Shortcut */}
            {currentTab === 'reports' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                      {t('reports.diagnosticFor')}
                    </span>
                    <select
                      value={selectedPatientId}
                      onChange={e => setSelectedPatientId(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 font-black text-sm text-slate-900 bg-white"
                    >
                      {patients.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.mrn}) — {p.primaryDiagnosis}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <CardiologyReport
                  patient={activePatient}
                  reports={reports.filter(r => r.patientId === selectedPatientId)}
                  onReportSaved={savedRep => {
                    setReports(prev => [savedRep, ...prev]);
                  }}
                  onOpenPrintReport={repToPrint => {
                    setStandaloneReportPrint(repToPrint);
                  }}
                />
              </div>
            )}
          </main>

          {/* Standalone Print Modals */}
          {standaloneRxPrint && (
            <PrintablePrescription
              prescription={standaloneRxPrint}
              patient={activePatient}
              onClose={() => setStandaloneRxPrint(null)}
            />
          )}

          {standaloneReportPrint && (
            <PrintableReport
              report={standaloneReportPrint}
              patient={activePatient}
              onClose={() => setStandaloneReportPrint(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
