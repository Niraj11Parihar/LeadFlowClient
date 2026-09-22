import React from 'react';
import { CalendarIcon as Calendar, MenuIcon as Menu } from '../../assets/SVGicons';

interface HeaderProps {
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="h-[72px] bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between shrink-0 z-10 shadow-xs">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-[15px] font-bold text-slate-900 tracking-tight truncate">
          LeadFlow Workspace
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-50 border border-slate-200/80 text-slate-600 text-xs font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{todayDate}</span>
        </div>
      </div>
    </header>
  );
};
