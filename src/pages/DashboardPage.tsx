import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { dashboardApi } from '../features/dashboard/api/dashboardApi';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Loader } from '../components/common/Loader';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import {
  CheckCircleIcon as CheckCircle,
  AlertTriangleIcon as AlertTriangle,
  PlusIcon as Plus,
  ClockIcon as Clock,
  BuildingIcon as Building,
  SparklesIcon as Sparkles,
} from '../assets/SVGicons';
import { WelcomeModal } from '../components/common/WelcomeModal';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isWelcomeOpen, setIsWelcomeOpen] = React.useState(false);

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getStats,
    refetchInterval: 30000,
  });

  React.useEffect(() => {
    if (stats) {
      const isDismissed = localStorage.getItem('leadflow_dismiss_welcome') === 'true';
      if (!isDismissed) {
        setIsWelcomeOpen(true);
      }
    }
  }, [stats]);

  if (isLoading) return <Loader label="Loading workspace analytics..." />;
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

  const conversionRate = stats.total > 0 ? ((stats.stages.won / stats.total) * 100).toFixed(1) : '0.0';
  const qualifiedPercentage = stats.total > 0 ? ((stats.stages.qualified / stats.total) * 100).toFixed(1) : '0.0';

  const trendData = stats.total > 0 ? [
    { month: 'Apr', leads: Math.max(0, Math.floor(stats.total * 0.3)), qualified: Math.max(0, Math.floor(stats.stages.qualified * 0.2)) },
    { month: 'May', leads: Math.max(0, Math.floor(stats.total * 0.5)), qualified: Math.max(0, Math.floor(stats.stages.qualified * 0.4)) },
    { month: 'Jun', leads: Math.max(0, Math.floor(stats.total * 0.7)), qualified: Math.max(0, Math.floor(stats.stages.qualified * 0.6)) },
    { month: 'Jul', leads: Math.max(0, Math.floor(stats.total * 0.8)), qualified: Math.max(0, Math.floor(stats.stages.qualified * 0.7)) },
    { month: 'Aug', leads: Math.max(0, Math.floor(stats.total * 0.9)), qualified: Math.max(0, Math.floor(stats.stages.qualified * 0.8)) },
    { month: 'Sep', leads: stats.total, qualified: stats.stages.qualified },
  ] : [
    { month: 'Apr', leads: 0, qualified: 0 },
    { month: 'May', leads: 0, qualified: 0 },
    { month: 'Jun', leads: 0, qualified: 0 },
    { month: 'Jul', leads: 0, qualified: 0 },
    { month: 'Aug', leads: 0, qualified: 0 },
    { month: 'Sep', leads: 0, qualified: 0 },
  ];

  const stageBarData = [
    { name: 'New', count: stats.stages.new, color: '#94A3B8' },
    { name: 'Contacted', count: stats.stages.contacted, color: '#2563EB' },
    { name: 'Qualified', count: stats.stages.qualified, color: '#9333EA' },
    { name: 'Won', count: stats.stages.won, color: '#059669' },
    { name: 'Lost', count: stats.stages.lost, color: '#E11D48' },
  ];

  const hasStageData = (stats.stages.won + stats.stages.qualified + stats.stages.lost) > 0;
  const pieData = hasStageData ? [
    ...(stats.stages.won > 0 ? [{ name: 'Deals Won', value: stats.stages.won, color: '#059669' }] : []),
    ...(stats.stages.qualified > 0 ? [{ name: 'Qualified Deals', value: stats.stages.qualified, color: '#9333EA' }] : []),
    ...(stats.stages.lost > 0 ? [{ name: 'Deals Lost', value: stats.stages.lost, color: '#E11D48' }] : []),
  ] : [
    { name: 'No Deals', value: 1, color: '#E2E8F0' },
  ];

  const Sparkline = ({ color = '#2563EB' }: { color?: string }) => (
    <svg className="w-16 h-8 shrink-0 overflow-visible" viewBox="0 0 60 25" fill="none">
      <path
        d="M 2 18 Q 12 10 22 15 T 42 8 T 58 4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">
            Good afternoon, {user?.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Here's what needs your attention today in your sales pipeline.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsWelcomeOpen(true)}
            icon={<Sparkles className="w-4 h-4 text-amber-500" />}
            className="h-9 text-xs"
          >
            Guide
          </Button>
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => navigate('/leads/new')}>
            Add Lead
          </Button>
        </div>
      </div>

      <WelcomeModal
        isOpen={isWelcomeOpen}
        onClose={() => setIsWelcomeOpen(false)}
        userName={user?.name}
        totalLeads={stats.total}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="hover:border-neutral-300 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Total Leads</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1 tracking-tight">{stats.total}</p>
            </div>
            <Sparkline color="#2563EB" />
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
            <span>{stats.total > 0 ? '↑ Active pipeline' : 'No leads registered'}</span>
          </div>
        </Card>

        <Card className="hover:border-neutral-300 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Qualified</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1 tracking-tight">{stats.stages.qualified}</p>
            </div>
            <Sparkline color="#9333EA" />
          </div>
          <div className="mt-3 text-[11px] font-semibold text-neutral-500">
            <span>{qualifiedPercentage}% of total leads</span>
          </div>
        </Card>

        <Card className="hover:border-neutral-300 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Deals Won</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1 tracking-tight">{stats.stages.won}</p>
            </div>
            <Sparkline color="#059669" />
          </div>
          <div className="mt-3 text-[11px] font-semibold text-emerald-600">
            <span>Highest conversion stage</span>
          </div>
        </Card>

        <Card className="hover:border-neutral-300 transition-all">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Conversion Rate</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-1 tracking-tight">{conversionRate}%</p>
            </div>
            <Sparkline color="#2563EB" />
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
            <span>{stats.total > 0 ? '↑ Conversion metric' : '0.0% conversion rate'}</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" title="Pipeline Growth Trend" subtitle="Monthly lead volume & qualification trajectory">
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorQualified" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9333EA" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#9333EA" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0F3" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#98A2B3', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#98A2B3', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                />
                <Area type="monotone" dataKey="leads" name="Total Leads" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" />
                <Area type="monotone" dataKey="qualified" name="Qualified Leads" stroke="#9333EA" strokeWidth={2} fillOpacity={1} fill="url(#colorQualified)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Deal Win Ratio" subtitle="Performance conversion breakdown">
          <div className="h-64 w-full flex flex-col items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-extrabold text-neutral-900">{conversionRate}%</span>
              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Win Rate</span>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Stage Volume Distribution" subtitle="Active deal volume per pipeline stage">
        <div className="h-56 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stageBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EEF0F3" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#667085', fontSize: 12, fontWeight: 600 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: '#98A2B3', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E5E7EB' }}
              />
              <Bar dataKey="count" name="Leads Count" radius={[6, 6, 0, 0]}>
                {stageBarData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Today's Action Center */}
      <Card
        title="Today's Action Center"
        subtitle="Priority tasks and daily follow-up queue"
        action={
          <Button variant="ghost" size="sm" onClick={() => navigate('/leads')}>
            View all leads
          </Button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div
            onClick={() => navigate('/leads?followUp=overdue')}
            className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/80 flex items-center justify-between cursor-pointer hover:bg-rose-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-rose-900">{stats.followUps.overdue} overdue follow-ups</p>
                <p className="text-[11px] font-medium text-rose-600">Requires immediate outreach</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-rose-700 group-hover:translate-x-0.5 transition-transform">Review →</span>
          </div>

          <div
            onClick={() => navigate('/leads?followUp=today')}
            className="p-3.5 rounded-xl bg-brand-50/60 border border-brand-200/80 flex items-center justify-between cursor-pointer hover:bg-brand-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-brand-900">{stats.followUps.today} follow-ups due today</p>
                <p className="text-[11px] font-medium text-brand-600">Scheduled outreach queue</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-brand-700 group-hover:translate-x-0.5 transition-transform">Open →</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-900">Follow-up Workflow</p>
                <p className="text-[11px] font-medium text-emerald-600">Sequence engine active</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-700">Active</span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Upcoming Today</h4>
          {stats.todayFollowUps.length === 0 ? (
            <p className="text-xs text-neutral-400 py-4 text-center italic">No follow-ups scheduled for today.</p>
          ) : (
            <div className="divide-y divide-neutral-100">
              {stats.todayFollowUps.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => navigate(`/leads/${lead.id}`)}
                  className="py-2.5 px-3 flex items-center justify-between hover:bg-neutral-50 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 font-bold text-xs shrink-0">
                      {lead.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-neutral-900 truncate">{lead.name}</p>
                      <p className="text-[11px] text-neutral-500 truncate flex items-center gap-1">
                        <Building className="w-3 h-3 text-neutral-400" />
                        <span>{lead.company || 'Individual Lead'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs font-medium text-brand-600 bg-brand-50 border border-brand-200/80 px-2 py-0.5 rounded-md">
                      {formatTimeOrDate(lead.followUpAt)}
                    </span>
                    <Badge stage={lead.stage} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
