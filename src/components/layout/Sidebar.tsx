import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboardIcon as LayoutDashboard, UsersIcon as Users, LogOutIcon as LogOut, XIcon as X } from '../../assets/SVGicons';
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
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Leads', path: '/leads', icon: Users },
  ];

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full w-full bg-slate-900 text-slate-300 select-none">
      {/* Brand Logo Header */}
      <div className="h-[72px] flex items-center justify-between px-6 border-b border-slate-800/80 shrink-0">
        <div className="flex items-center gap-3">
          <img src={logoImg} alt="LeadFlow Logo" className="h-9 w-auto object-contain shrink-0" />
          <span className="text-xl font-bold tracking-tight text-white mt-0.5">
            Lead<span className="text-brand-500">Flow</span>
          </span>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-slate-800 text-white font-semibold border-l-2 border-brand-500 pl-2.5'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                )
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom User Profile & Logout */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/60 shrink-0 space-y-2">
        <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-slate-800/50 border border-slate-800">
          <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-semibold text-xs border border-brand-500/30 shrink-0">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.name || 'User'}</p>
            <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={() => {
            if (onClose) onClose();
            setIsLogoutModalOpen(true);
          }}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign out</span>
        </button>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={logout}
        title="Log Out of LeadFlow?"
        description="Are you sure you want to log out? You will need to sign back in to access your CRM leads."
        confirmText="Log Out"
        cancelText="Cancel"
        variant="warning"
        icon={<LogOut className="w-5 h-5 text-amber-600" />}
      />
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (fixed static left panel) */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-slate-800/80 h-full overflow-hidden bg-slate-900 z-10">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (visible on mobile when isOpen is true) */}
      <div
        className={clsx(
          'fixed inset-0 z-50 flex lg:hidden transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Backdrop overlay */}
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />
        {/* Sliding Panel */}
        <div
          className={clsx(
            'relative w-64 max-w-[85vw] h-full shadow-2xl transition-transform duration-300 transform',
            isOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {sidebarContent}
        </div>
      </div>
    </>
  );
};
