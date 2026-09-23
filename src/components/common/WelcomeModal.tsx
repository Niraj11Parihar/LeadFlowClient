import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  SparklesIcon as Sparkles,
  PlusIcon as Plus,
  XIcon as X,
  CheckCircleIcon as CheckCircle,
  ArrowRightIcon as ArrowRight,
} from '../../assets/SVGicons';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  totalLeads: number;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  userName = 'Partner',
  totalLeads,
}) => {
  const navigate = useNavigate();
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isNewUser = totalLeads === 0;

  const handleDismiss = () => {
    if (dontShowAgain) {
      localStorage.setItem('leadflow_dismiss_welcome', 'true');
    }
    onClose();
  };

  const handleAction = () => {
    handleDismiss();
    navigate('/leads/new');
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto transform transition-all animate-scale-up">
        <div className="relative bg-gradient-to-br from-brand-600 via-purple-600 to-indigo-700 p-6 sm:p-8 text-white overflow-hidden">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl pointer-events-none" />

          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4 relative z-10">
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-lg relative overflow-hidden group">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-amber-300 animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2a5 5 0 0 1 5 5v2a5 5 0 0 1-10 0V7a5 5 0 0 1 5-5z" fill="currentColor" fillOpacity="0.2" />
                  <path d="M12 14c-5.33 0-8 2.67-8 8h16c0-5.33-2.67-8-8-8z" fill="currentColor" fillOpacity="0.15" />
                  <circle cx="12" cy="7" r="3" fill="#FCD34D" />
                  <path d="M9 13s1.5 2 3 2 3-2 3-2" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M18 10l3-2m-3 4l4 1" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold shadow-xs">
                ✓
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-amber-200 text-[11px] font-bold mb-1">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>{isNewUser ? 'Welcome Onboard!' : 'Welcome Back!'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Hello, {userName.split(' ')[0]}! 👋
              </h3>
              <p className="text-xs text-brand-100/90 mt-0.5">
                {isNewUser
                  ? 'Your sales journey starts right here today.'
                  : `Your pipeline currently holds ${totalLeads} lead${totalLeads === 1 ? '' : 's'}.`}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
              {isNewUser
                ? 'Ready to build your sales pipeline and win your future clients?'
                : 'Keep your sales momentum moving forward today!'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {isNewUser
                ? 'LeadFlow helps you track deals across stage pipelines, set automated follow-up reminders, and monitor real-time conversion rates. Start by registering your very first lead!'
                : 'Take a quick look at your overdue tasks, scheduled follow-up queue, and deal win statistics to make sure no prospect falls through the cracks.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Interactive Kanban Boards</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <CheckCircle className="w-4 h-4 text-brand-500 shrink-0" />
              <span>Automated Reminders</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <CheckCircle className="w-4 h-4 text-purple-500 shrink-0" />
              <span>Real-Time Win Ratios</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Complete Activity Logs</span>
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <button
              onClick={handleAction}
              type="button"
              className="w-full h-12 bg-gradient-to-r from-brand-600 via-purple-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>{isNewUser ? 'Add Your First Lead Now' : 'Create New Lead'}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-500 hover:text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                />
                <span>Don't show this welcome popup again</span>
              </label>

              <button
                onClick={handleDismiss}
                type="button"
                className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer px-2 py-1"
              >
                Skip for now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
