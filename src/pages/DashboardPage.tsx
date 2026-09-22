import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { dashboardApi } from '../features/dashboard/api/dashboardApi';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Loader } from '../components/common/Loader';
import { Button } from '../components/common/Button';
import { PageHeader } from '../components/common/PageHeader';
import { useAuth } from '../context/AuthContext';
import {
  UsersIcon as Users,
  UserPlusIcon as UserPlus,
  CheckCircleIcon as CheckCircle2,
  TrophyIcon as Trophy,
  CalendarCheckIcon as CalendarCheck,
  AlertTriangleIcon as AlertTriangle,
  ArrowRightIcon as ArrowRight,
  PlusIcon as Plus,
  ClockIcon as Clock,
} from '../assets/SVGicons';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getStats,
    refetchInterval: 30000,
  });

  if (isLoading) return <Loader label="Loading pipeline dashboard..." />;
  if (error || !stats) {
    return (
      <div className="p-6 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 text-sm font-medium">
        Failed to load dashboard metrics. Please check server connection.
      </div>
    );
  }

  const formatTimeOrDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <PageHeader
        title={`Welcome back, ${user?.name || 'User'} 👋`}
        subtitle="Here is what is happening with your sales lead pipeline today."
        action={
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => navigate('/leads/new')}>
            Add lead
          </Button>
        }
      />

      {/* Primary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Total Leads */}
        <Card className="hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-slate-500">Total leads</span>
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-3">{stats.total}</p>
        </Card>

        {/* New */}
        <Card className="hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-slate-500">New leads</span>
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-3">{stats.stages.new}</p>
        </Card>

        {/* Qualified */}
        <Card className="hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-slate-500">Qualified leads</span>
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-3">{stats.stages.qualified}</p>
        </Card>

        {/* Won Deals */}
        <Card className="hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-semibold text-slate-500">Deals won</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-3">{stats.stages.won}</p>
        </Card>
      </div>

      {/* Follow-ups Widgets (Small semantic icons + subtle tints) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Today's Follow-ups Summary Card */}
        <div
          onClick={() => navigate('/leads?followUp=today')}
          className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:border-slate-300 hover:shadow-card transition-all group shadow-card"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-slate-500">Follow-ups scheduled today</p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">{stats.followUps.today} leads</h3>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all" />
        </div>

        {/* Overdue Follow-ups Summary Card */}
        <div
          onClick={() => navigate('/leads?followUp=overdue')}
          className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:border-slate-300 hover:shadow-card transition-all group shadow-card"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[13px] font-semibold text-slate-500">Overdue follow-ups</p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">{stats.followUps.overdue} action required</h3>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>

      {/* Pipeline Visual Bar & Breakdown */}
      <Card title="Lead pipeline breakdown" subtitle="Current distribution of active leads across sales stages">
        <div className="space-y-4">
          {/* Visual Progress Bar */}
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
            {stats.total > 0 ? (
              <>
                <div style={{ width: `${(stats.stages.new / stats.total) * 100}%` }} className="bg-slate-400" title="New" />
                <div style={{ width: `${(stats.stages.contacted / stats.total) * 100}%` }} className="bg-blue-500" title="Contacted" />
                <div style={{ width: `${(stats.stages.qualified / stats.total) * 100}%` }} className="bg-purple-500" title="Qualified" />
                <div style={{ width: `${(stats.stages.won / stats.total) * 100}%` }} className="bg-emerald-500" title="Won" />
                <div style={{ width: `${(stats.stages.lost / stats.total) * 100}%` }} className="bg-rose-500" title="Lost" />
              </>
            ) : (
              <div className="w-full bg-slate-200" />
            )}
          </div>

          {/* Grid Breakdown List */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3 pt-2">
            <div className="p-3 sm:p-3.5 rounded-lg bg-slate-50 border border-slate-200/60 text-center">
              <span className="text-[12px] sm:text-[13px] text-slate-500 font-medium">New</span>
              <p className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5 sm:mt-1">{stats.stages.new}</p>
            </div>
            <div className="p-3 sm:p-3.5 rounded-lg bg-blue-50/50 border border-blue-100 text-center">
              <span className="text-[12px] sm:text-[13px] text-blue-600 font-medium">Contacted</span>
              <p className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5 sm:mt-1">{stats.stages.contacted}</p>
            </div>
            <div className="p-3 sm:p-3.5 rounded-lg bg-purple-50/50 border border-purple-100 text-center">
              <span className="text-[12px] sm:text-[13px] text-purple-600 font-medium">Qualified</span>
              <p className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5 sm:mt-1">{stats.stages.qualified}</p>
            </div>
            <div className="p-3 sm:p-3.5 rounded-lg bg-emerald-50/50 border border-emerald-100 text-center">
              <span className="text-[12px] sm:text-[13px] text-emerald-600 font-medium">Won</span>
              <p className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5 sm:mt-1">{stats.stages.won}</p>
            </div>
            <div className="p-3 sm:p-3.5 rounded-lg bg-rose-50/50 border border-rose-100 text-center">
              <span className="text-[12px] sm:text-[13px] text-rose-600 font-medium">Lost</span>
              <p className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5 sm:mt-1">{stats.stages.lost}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Two Column Section: Today's Follow-ups & Overdue Follow-ups */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Today's Follow-ups */}
        <Card
          title="Today's scheduled follow-ups"
          subtitle="Leads scheduled for outreach today"
          action={
            <Button variant="ghost" size="sm" onClick={() => navigate('/leads?followUp=today')}>
              View all
            </Button>
          }
        >
          {stats.todayFollowUps.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No follow-ups scheduled for today</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {stats.todayFollowUps.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => navigate(`/leads/${lead.id}`)}
                  className="
      py-3 px-2
      grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_80px_100px]
      items-center gap-2 sm:gap-3
      hover:bg-slate-50 rounded-lg cursor-pointer
      transition-colors
    "
                >
                  {/* Lead Info */}
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-slate-900 truncate">
                      {lead.name}
                    </p>

                    <p className="text-[13px] text-slate-500 truncate">
                      {lead.company || 'Individual'}
                    </p>
                  </div>

                  {/* Time */}
                  <div className="flex sm:justify-center">
                    <div className="
        w-[72px]
        flex items-center justify-center gap-1
        text-xs text-blue-600 font-medium
        bg-blue-50
        px-2 py-0.5
        rounded-md
        tabular-nums
        whitespace-nowrap
      ">
                      <Clock className="w-3 h-3 shrink-0" />

                      <span>
                        {formatTimeOrDate(lead.followUpAt)}
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex sm:justify-end">
                    <div className="w-[90px] flex justify-end">
                      <Badge stage={lead.stage} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Overdue Follow-ups */}
        <Card
          title="Overdue follow-ups"
          subtitle="Leads past scheduled follow-up date"
          action={
            <Button variant="ghost" size="sm" onClick={() => navigate('/leads?followUp=overdue')}>
              View all
            </Button>
          }
        >
          {stats.overdueFollowUps.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No overdue follow-ups</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {stats.overdueFollowUps.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => navigate(`/leads/${lead.id}`)}
                  className="
      py-3 px-2
      grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_80px_100px]
      items-center gap-2 sm:gap-3
      hover:bg-slate-50 rounded-lg cursor-pointer
      transition-colors
    "
                >
                  {/* Lead Info */}
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-slate-900 truncate">
                      {lead.name}
                    </p>

                    <p className="text-[13px] text-slate-500 truncate">
                      {lead.company || 'Individual'}
                    </p>
                  </div>

                  {/* Date */}
                  <div className="flex sm:justify-center">
                    <span className="
        w-[72px]
        text-center
        text-xs text-rose-600 font-semibold
        bg-rose-50
        px-2 py-0.5
        rounded-md
        tabular-nums
        whitespace-nowrap
      ">
                      {formatTimeOrDate(lead.followUpAt)}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="flex sm:justify-end">
                    <div className="w-[90px] flex justify-end">
                      <Badge stage={lead.stage} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
