import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  MenuIcon as Menu,
  SearchIcon as Search,
  LogOutIcon as LogOut,
  ChevronDownIcon as ChevronDown,
  SettingsIcon,
} from '../../assets/SVGicons';
import { useAuth } from '../../context/AuthContext';
import { CommandPalette } from '../common/CommandPalette';
import { ConfirmModal } from '../common/ConfirmModal';

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'Dashboard';
    if (path.startsWith('/settings')) return 'Account & Settings';
    if (path.startsWith('/kanban')) return 'Kanban Board';
    if (path.startsWith('/companies')) return 'Companies & Accounts';
    if (path.startsWith('/tasks')) return 'Follow-up Tasks';
    if (path.startsWith('/activities')) return 'Activity Stream';
    if (path === '/leads/new') return 'Leads / New Lead';
    if (path.startsWith('/leads/')) {
      if (path.endsWith('/edit')) return 'Leads / Edit Lead';
      return 'Leads / Lead Profile';
    }
    if (path.startsWith('/leads')) return 'Leads Table';
    return 'Dashboard';
  };

  const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);

  return (
    <header className="h-[60px] bg-white border-b border-neutral-200/80 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20 shadow-xs">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden p-1.5 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
            title="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-neutral-400">LeadFlow</span>
          <span className="text-neutral-300">/</span>
          <span className="text-neutral-900 tracking-tight">{getBreadcrumb()}</span>
        </div>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 bg-neutral-100/70 hover:bg-neutral-100 border border-neutral-200/80 rounded-lg transition-all cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-neutral-400" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-400 bg-white border border-neutral-200 rounded-md">
            {isMac ? '⌘K' : 'Ctrl+K'}
          </kbd>
        </button>

        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-lg text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-brand-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="hidden md:inline text-neutral-900 font-semibold">{user?.name || 'Account'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </button>

          {isUserMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsUserMenuOpen(false)}
              />
              <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-xl shadow-popover border border-neutral-200/80 py-1.5 z-40 text-xs animate-fade-in">
                <div className="px-3.5 py-2 border-b border-neutral-100">
                  <p className="font-semibold text-neutral-900 truncate">{user?.name || 'User'}</p>
                  <p className="text-[11px] text-neutral-500 truncate">{user?.email}</p>
                </div>
                <div className="py-1 border-b border-neutral-100">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full text-left px-3.5 py-1.5 font-semibold text-neutral-700 hover:bg-neutral-100 cursor-pointer flex items-center gap-2"
                  >
                    <SettingsIcon className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Account & Settings</span>
                  </button>
                </div>
                <div className="pt-1">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsLogoutModalOpen(true);
                    }}
                    className="w-full text-left px-3.5 py-1.5 font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={logout}
        title="Log Out of LeadFlow?"
        description="Are you sure you want to log out?"
        confirmText="Log Out"
        cancelText="Cancel"
        variant="warning"
      />
    </header>
  );
};
