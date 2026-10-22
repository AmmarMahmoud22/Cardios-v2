import React from 'react';
import { 
  Heart, 
  Users, 
  Calendar as CalendarIcon, 
  Smartphone, 
  Pill, 
  FileText, 
  AlertTriangle, 
  Home, 
  Stethoscope, 
  Bell 
} from 'lucide-react';
import { RPMAlert } from '../types';

export type NavigationTab = 'patients' | 'calendar' | 'portal' | 'prescription' | 'reports' | 'landing';

interface NavbarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  activeAlerts: RPMAlert[];
  onOpenAlertsPanel?: () => void;
  selectedPatientName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  activeAlerts,
  onOpenAlertsPanel,
  selectedPatientName
}) => {
  const unacknowledgedCount = activeAlerts.filter(a => !a.acknowledged).length;

  const navItems = [
    { id: 'patients' as const, label: 'Patients', icon: Users, badge: null },
    { id: 'calendar' as const, label: 'Calendar', icon: CalendarIcon, badge: '4 Today' },
    { id: 'portal' as const, label: 'Patient Portal', icon: Smartphone, badge: 'Mobile RPM' },
    { id: 'prescription' as const, label: 'Smart Prescription', icon: Pill, badge: null },
    { id: 'reports' as const, label: 'Cardiology Reports', icon: FileText, badge: 'Echo/ECG' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onSelectTab('landing')}
              className="flex items-center gap-2.5 text-left group transition"
              title="Return to Cardios Landing Page"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cardio-600 to-rose-500 flex items-center justify-center shadow-md shadow-rose-900/40 group-hover:scale-105 transition">
                <Heart className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-white font-heading">Cardios</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-semibold uppercase">EHR</span>
                </div>
                <div className="text-[10px] text-slate-400 -mt-0.5 font-medium">Cardiology Telemetry & RPM</div>
              </div>
            </button>

            {/* Breadcrumb / active context if any */}
            {selectedPatientName && currentTab === 'patients' && (
              <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-800 text-xs">
                <span className="text-slate-400">Active Patient:</span>
                <span className="font-semibold text-rose-300 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-900/40">
                  {selectedPatientName}
                </span>
              </div>
            )}
          </div>

          {/* Active Navigation Shortcut Buttons */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-900/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-normal ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Doctor Station */}
          <div className="flex items-center gap-3">
            {/* Real-time Active RPM Alerts Indicator */}
            {unacknowledgedCount > 0 && (
              <button
                onClick={onOpenAlertsPanel}
                className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-bold transition animate-pulse"
                title={`${unacknowledgedCount} Critical Active RPM Telemetry Alerts!`}
              >
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span className="hidden sm:inline">RPM Alert</span>
                <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-extrabold">
                  {unacknowledgedCount}
                </span>
              </button>
            )}

            {/* Doctor Profile Pill */}
            <div className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80">
              <div className="w-7 h-7 rounded-lg bg-rose-600/30 text-rose-300 flex items-center justify-center font-bold text-xs">
                KE
              </div>
              <div className="text-left text-xs leading-tight">
                <div className="font-semibold text-slate-200">Dr. Karim El-Sayed</div>
                <div className="text-[10px] text-slate-400">MD, FESC (Cardiology)</div>
              </div>
            </div>

            {/* Landing page link */}
            <button
              onClick={() => onSelectTab('landing')}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Cardios Landing Page"
            >
              <Home className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-800 overflow-x-auto gap-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] whitespace-nowrap font-medium transition ${
                  isActive ? 'bg-rose-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
