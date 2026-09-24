import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { leadApi } from '../../features/leads/api/leadApi';
import {
  SearchIcon as Search,
  XIcon as X,
  PlusIcon as Plus,
  LayoutDashboardIcon as LayoutDashboard,
  UsersIcon as Users,
  BuildingIcon as Building,
} from '../../assets/SVGicons';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');

  const { data: leadsData, isFetching } = useQuery({
    queryKey: ['command-palette-leads', submittedQuery],
    queryFn: () => leadApi.getLeads({ search: submittedQuery, limit: 5 }),
    enabled: isOpen && submittedQuery.trim().length > 0,
  });

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSubmittedQuery(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    setSubmittedQuery('');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) onClose();
        else handleClear();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions = [
    {
      id: 'action-create',
      title: 'Create new lead',
      icon: <Plus className="w-4 h-4 text-brand-600" />,
      action: () => {
        onClose();
        navigate('/leads/new');
      },
    },
    {
      id: 'action-leads',
      title: 'View all leads',
      icon: <Users className="w-4 h-4 text-purple-600" />,
      action: () => {
        onClose();
        navigate('/leads');
      },
    },
    {
      id: 'action-dashboard',
      title: 'Go to Dashboard',
      icon: <LayoutDashboard className="w-4 h-4 text-emerald-600" />,
      action: () => {
        onClose();
        navigate('/dashboard');
      },
    },
  ];

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-neutral-900/40 backdrop-blur-xs p-4 animate-fade-in"
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-popover border border-neutral-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center px-4 border-b border-neutral-200/80 bg-surface-subtle">
          <div className="p-1 text-neutral-400 mr-2 shrink-0">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              const val = e.target.value;
              setQuery(val);
              setSubmittedQuery(val);
            }}
            placeholder="Type to search leads..."
            className="w-full py-3.5 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-none ring-0"
            autoFocus
          />
          {query ? (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 hover:bg-neutral-200/60 cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-semibold text-neutral-400 bg-neutral-100 border border-neutral-200 rounded-md shrink-0">
              ESC
            </kbd>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto custom-scrollbar p-2 space-y-4">
          {/* Quick Actions */}
          <div>
            <span className="px-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
              Quick Actions
            </span>
            <div className="space-y-0.5">
              {quickActions.map((act) => (
                <button
                  key={act.id}
                  onClick={act.action}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100/80 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-md bg-neutral-100 border border-neutral-200/60 shrink-0">
                      {act.icon}
                    </div>
                    <span>{act.title}</span>
                  </div>
                  <span className="text-[11px] font-medium text-neutral-400">Action</span>
                </button>
              ))}
            </div>
          </div>

          {/* Search Results */}
          {submittedQuery.trim().length > 0 && (
            <div>
              <span className="px-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-400 block mb-1">
                Matching Leads ({isFetching ? 'Searching...' : leadsData?.data.length || 0})
              </span>
              {leadsData?.data && leadsData.data.length > 0 ? (
                <div className="space-y-0.5">
                  {leadsData.data.map((lead) => (
                    <button
                      key={lead.id}
                      onClick={() => {
                        onClose();
                        navigate(`/leads/${lead.id}`);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-neutral-700 hover:bg-neutral-100/80 transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-brand-50 border border-brand-200/80 flex items-center justify-center text-brand-700 font-bold text-[11px] shrink-0">
                          {lead.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-neutral-900">{lead.name}</div>
                          <div className="text-[11px] text-neutral-500 flex items-center gap-1.5">
                            <Building className="w-3 h-3 text-neutral-400" />
                            <span>{lead.company || 'Individual'}</span>
                          </div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-neutral-100 text-neutral-600 border border-neutral-200">
                        {lead.stage}
                      </span>
                    </button>
                  ))}
                </div>
              ) : !isFetching ? (
                <div className="py-6 text-center text-xs text-neutral-400 italic">
                  No leads found matching "{submittedQuery}"
                </div>
              ) : null}
            </div>
          )}
        </div>

        <div className="px-4 py-2 bg-surface-subtle border-t border-neutral-200/80 text-[11px] text-neutral-400 flex items-center justify-between">
          <span>Type to search leads across LeadFlow</span>
          <span className="flex items-center gap-1 font-semibold text-neutral-500">
            LeadFlow QuickSearch
          </span>
        </div>
      </div>
    </div>
  );
};
