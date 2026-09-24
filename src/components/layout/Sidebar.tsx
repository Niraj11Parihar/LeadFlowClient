import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboardIcon as LayoutDashboard,
  UsersIcon as Users,
  KanbanIcon,
  BuildingIcon as Building,
  CalendarIcon as Calendar,
  ClockIcon as Clock,
  XIcon as X,
  LogOutIcon as LogOut,
} from '../../assets/SVGicons';
import { clsx } from 'clsx';
import { useAuth } from '../../context/AuthContext';
import { ConfirmModal } from '../common/ConfirmModal';
import logoImg from '../../assets/logo1.png';

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const navSections = [
    {
      title: 'WORKSPACE',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Leads Table', path: '/leads', icon: Users },
        { label: 'Kanban', path: '/kanban', icon: KanbanIcon },
        { label: 'Companies', path: '/companies', icon: Building },
      ],
    },
    {
      title: 'WORKFLOW',
      items: [
        { label: 'Follow-up Tasks', path: '/tasks', icon: Calendar },
        { label: 'Activity Stream', path: '/activities', icon: Clock },
      ],
    },
  ];

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full w-full bg-[#0F172A] text-slate-300 select-none">
      {/* Brand Header */}
      <div className="h-[60px] flex items-center justify-between px-5 border-b border-slate-800/80 shrink-0">
        <div className="flex items-center gap-2.5">
          <img src={logoImg} alt="LeadFlow Logo" className="h-8 w-auto object-contain shrink-0" />
          <span className="text-lg font-bold tracking-tight text-white mt-0.5">
            Lead<span className="text-brand-500">Flow</span>
          </span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-4 overflow-y-auto custom-scrollbar">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              {section.title}
            </span>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleNavClick}
                  className={clsx(
                    'flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors',
                    isActive
                      ? 'bg-slate-800 text-white font-bold border-l-2 border-brand-500 pl-2.5 shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  )}
                >
                  <Icon className={clsx('w-4 h-4 shrink-0', isActive ? 'text-brand-400' : 'text-slate-400')} />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom User Profile */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/60 shrink-0">
        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-800 transition-colors text-left group cursor-pointer"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-brand-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] font-medium text-slate-400 truncate">Workspace Admin</p>
            </div>
          </div>
          <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-400 shrink-0 transition-colors ml-1" />
        </button>
      </div>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={logout}
        title="Log Out of LeadFlow?"
        description="Are you sure you want to log out?"
        confirmText="Log Out"
        cancelText="Cancel"
        variant="warning"
        icon={<LogOut className="w-5 h-5 text-amber-600" />}
      />
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-slate-800/80 h-full overflow-hidden bg-[#0F172A] z-10">
        {sidebarContent}
      </aside>

      <div
        className={clsx(
          'fixed inset-0 z-50 flex lg:hidden transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
        <div
          className={clsx(
            'relative w-60 max-w-[85vw] h-full shadow-2xl transition-transform duration-300 transform',
            isOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {sidebarContent}
        </div>
      </div>
    </>
  );
};
