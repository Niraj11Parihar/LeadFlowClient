import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  CalendarIcon as Calendar,
  SearchIcon as Search,
  CheckCircleIcon as CheckCircle,
  ClockIcon as Clock,
} from '../assets/SVGicons';
import { leadApi } from '../features/leads/api/leadApi';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Loader } from '../components/common/Loader';
import { Badge } from '../components/common/Badge';

export const TasksPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'overdue' | 'upcoming'>('all');
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['leads', { limit: 100 }],
    queryFn: () => leadApi.getLeads({ limit: 100 }),
  });

  const leadsWithFollowups = (data?.data || []).filter((l) => l.nextFollowUpAt || l.followUpAt);

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const filteredTasks = leadsWithFollowups.filter((lead) => {
    const fDate = lead.nextFollowUpAt || lead.followUpAt;
    if (!fDate) return false;
    const fDateStr = new Date(fDate).toISOString().split('T')[0];

    let matchesTab = true;
    if (activeTab === 'today') {
      matchesTab = fDateStr === todayStr;
    } else if (activeTab === 'overdue') {
      matchesTab = fDateStr < todayStr;
    } else if (activeTab === 'upcoming') {
      matchesTab = fDateStr > todayStr;
    }

    let matchesSearch = true;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      matchesSearch =
        lead.name.toLowerCase().includes(q) ||
        (lead.company ? lead.company.toLowerCase().includes(q) : false) ||
        (lead.notes ? lead.notes.toLowerCase().includes(q) : false);
    }

    return matchesTab && matchesSearch;
  });

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-1 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">Follow-up Tasks</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Central queue to manage all scheduled lead calls, emails, and meetings.
          </p>
        </div>

        <div className="w-full sm:w-[280px]">
          <Input
            placeholder="Search tasks..."
            value={searchInput}
            onChange={(e) => {
              const val = e.target.value;
              setSearchInput(val);
              setSearchQuery(val);
            }}
            icon={<Search className="w-4 h-4" />}
            className="w-full h-10 text-xs"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-neutral-200/80 pb-3 overflow-x-auto custom-scrollbar whitespace-nowrap">
        {[
          { id: 'all', label: 'All Scheduled Tasks' },
          { id: 'today', label: 'Due Today' },
          { id: 'overdue', label: 'Overdue' },
          { id: 'upcoming', label: 'Upcoming' },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${isActive
                ? 'bg-brand-50 text-brand-700 border border-brand-200/80 shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <Card className="p-12 flex justify-center items-center">
          <Loader label="Loading scheduled task queue..." />
        </Card>
      ) : filteredTasks.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-400 mx-auto flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className="text-sm font-bold text-neutral-800">No pending tasks found</h3>
          <p className="text-xs text-neutral-500">You're all caught up for this task filter!</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((lead) => {
            const fDate = lead.nextFollowUpAt || lead.followUpAt;
            const fDateStr = fDate ? new Date(fDate).toISOString().split('T')[0] : '';
            const isOverdue = fDateStr < todayStr;
            const isToday = fDateStr === todayStr;

            return (
              <Card
                key={lead.id}
                onClick={() => navigate(`/leads/${lead.id}`)}
                className="hover:border-neutral-300 transition-all cursor-pointer p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isOverdue
                      ? 'bg-rose-50 text-rose-600 border border-rose-200'
                      : isToday
                        ? 'bg-amber-50 text-amber-600 border border-amber-200'
                        : 'bg-brand-50 text-brand-600 border border-brand-200'
                      }`}
                  >
                    <Clock className="w-4 h-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-neutral-900 text-sm hover:text-brand-600 transition-colors">
                        {lead.name}
                      </h4>
                      <Badge stage={lead.stage} className="scale-90 shrink-0" />
                    </div>

                    <div className="text-xs text-neutral-500 flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                      {lead.company && (
                        <span className="flex items-center gap-1 shrink-0">
                          <span>{lead.company}</span>
                        </span>
                      )}
                      {lead.notes && (
                        <span className="italic text-neutral-400 truncate max-w-full sm:max-w-xs">
                          "{lead.notes}"
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-row items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100 shrink-0">
                  <div className="flex items-center gap-1.5 text-xs font-semibold shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span
                      className={
                        isOverdue
                          ? 'text-rose-600 font-bold'
                          : isToday
                            ? 'text-amber-600 font-bold'
                            : 'text-neutral-700'
                      }
                    >
                      {formatDate(fDate)}
                    </span>
                    {isOverdue && (
                      <span className="px-1.5 py-0.5 text-[10px] bg-rose-100 text-rose-700 rounded-md font-extrabold">
                        Overdue
                      </span>
                    )}
                    {isToday && (
                      <span className="px-1.5 py-0.5 text-[10px] bg-amber-100 text-amber-800 rounded-md font-extrabold">
                        Today
                      </span>
                    )}
                  </div>

                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => navigate(`/leads/${lead.id}`)}
                    className="h-10 px-4 py-2 text-xs font-semibold text-neutral-800 bg-white border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 shadow-2xs rounded-lg transition-all shrink-0 whitespace-nowrap"
                  >
                    Action Lead
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
