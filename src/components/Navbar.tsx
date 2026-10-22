import React from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Heart, 
  Users, 
  Calendar as CalendarIcon, 
  Smartphone, 
  Pill, 
  FileText, 
  AlertTriangle, 
  Home,
  Shield,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { RPMAlert } from '../types';
import { CardiosUser, hasPermission, ROLE_LABELS } from '../types/auth';
import { LanguageSwitcher } from './LanguageSwitcher';

export type NavigationTab = 'patients' | 'calendar' | 'portal' | 'prescription' | 'reports' | 'landing' | 'admin';

interface NavbarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  activeAlerts: RPMAlert[];
  onOpenAlertsPanel?: () => void;
  selectedPatientName?: string;
  user?: CardiosUser | null;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  activeAlerts,
  onOpenAlertsPanel,
  selectedPatientName,
  user,
  onSignOut
}) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language?.startsWith('ar');
  const unacknowledgedCount = activeAlerts.filter(a => !a.acknowledged).length;

  // Build nav items based on user role
  const role = user?.role || 'doctor';
  const allNavItems = [
    { id: 'patients' as const, label: t('nav.patients'), icon: Users, badge: null, permission: 'view_patients' },
    { id: 'calendar' as const, label: t('nav.calendar'), icon: CalendarIcon, badge: t('nav.badgeToday'), permission: 'view_appointments' },
    { id: 'portal' as const, label: t('nav.portal'), icon: Smartphone, badge: t('nav.badgeMobileRpm'), permission: 'view_portal' },
    { id: 'prescription' as const, label: t('nav.prescription'), icon: Pill, badge: null, permission: 'manage_prescriptions' },
    { id: 'reports' as const, label: t('nav.reports'), icon: FileText, badge: t('nav.badgeEcho'), permission: 'view_reports' },
    { id: 'admin' as const, label: t('nav.admin', 'Admin'), icon: Shield, badge: null, permission: 'view_admin_panel' },
  ];

  // Filter nav items by role permissions (doctors & admins see everything they have access to)
  const navItems = allNavItems.filter(item => {
    if (role === 'admin') return true; // Admin sees all
    return hasPermission(role, item.permission);
  });

  const roleMeta = ROLE_LABELS[role];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => onSelectTab('landing')}
              className="flex items-center gap-2.5 text-left rtl:text-right group transition"
              title={t('nav.landing')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cardio-600 to-rose-500 flex items-center justify-center shadow-md shadow-rose-900/40 group-hover:scale-105 transition shrink-0">
                <Heart className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-white font-heading">{t('nav.brand')}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-semibold uppercase">{t('nav.badgeEhr')}</span>
                </div>
                <div className="text-[10px] text-slate-400 -mt-0.5 font-medium">{t('nav.subtitle')}</div>
              </div>
            </button>

            {/* Breadcrumb / active context if any */}
            {selectedPatientName && currentTab === 'patients' && (
              <div className="hidden lg:flex items-center gap-2 ltr:pl-4 ltr:border-l rtl:pr-4 rtl:border-r border-slate-800 text-xs">
                <span className="text-slate-400">{t('nav.activePatient')}</span>
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
                      ? item.id === 'admin' 
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30'
                        : 'bg-rose-600 text-white shadow-md shadow-rose-900/30'
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

          {/* Right Action Icons & User Profile */}
          <div className="flex items-center gap-2.5">
            {/* Language Switcher */}
            <LanguageSwitcher variant="navbar" />

            {/* Real-time Active RPM Alerts Indicator */}
            {unacknowledgedCount > 0 && hasPermission(role, 'view_rpm_alerts') && (
              <button
                onClick={onOpenAlertsPanel}
                className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-bold transition animate-pulse"
                title={`${unacknowledgedCount} Critical Active RPM Telemetry Alerts!`}
              >
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span className="hidden sm:inline">{t('nav.rpmAlert')}</span>
                <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[11px] font-extrabold">
                  {unacknowledgedCount}
                </span>
              </button>
            )}

            {/* User Profile Pill */}
            {user ? (
              <div className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-7 h-7 rounded-lg object-cover border border-slate-600"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-rose-600/30 text-rose-300 flex items-center justify-center font-bold text-xs">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-left rtl:text-right text-xs leading-tight">
                  <div className="font-semibold text-slate-200">{user.displayName}</div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <span>{roleMeta.icon}</span>
                    <span>{isRtl ? roleMeta.ar : roleMeta.en}</span>
                  </div>
                </div>
                {onSignOut && (
                  <button
                    onClick={onSignOut}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-700/50 transition"
                    title={t('auth.signOut', 'Sign out')}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80">
                <div className="w-7 h-7 rounded-lg bg-rose-600/30 text-rose-300 flex items-center justify-center font-bold text-xs">
                  KE
                </div>
                <div className="text-left rtl:text-right text-xs leading-tight">
                  <div className="font-semibold text-slate-200">{t('nav.doctorName')}</div>
                  <div className="text-[10px] text-slate-400">{t('nav.doctorTitle')}</div>
                </div>
              </div>
            )}

            {/* Landing page link */}
            <button
              onClick={() => onSelectTab('landing')}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title={t('nav.landing')}
            >
              <Home className="w-4 h-4" />
            </button>

            {/* Mobile Sign Out */}
            {user && onSignOut && (
              <button
                onClick={onSignOut}
                className="xl:hidden p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                title={t('auth.signOut', 'Sign out')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
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
