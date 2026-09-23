import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  PlusIcon as Plus,
  SearchIcon as Search,
  FilterIcon as Filter,
  TrashIcon as Trash2,
  EditIcon as Edit,
  EyeIcon as Eye,
  PhoneIcon as Phone,
  MailIcon as Mail,
  BuildingIcon as Building,
  CalendarIcon as Calendar,
  ArrowUpDownIcon as ArrowUpDown,
} from '../assets/SVGicons';
import { leadApi } from '../features/leads/api/leadApi';
import { dashboardApi } from '../features/dashboard/api/dashboardApi';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Badge } from '../components/common/Badge';
import { Loader } from '../components/common/Loader';
import { Pagination } from '../components/common/Pagination';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { DropdownMenu } from '../components/common/DropdownMenu';
import type { Lead, LeadStage, LeadFilters } from '../types';

const FOLLOWUP_FILTER_OPTIONS = [
  { label: 'All Follow-ups', value: '' },
  { label: 'Today', value: 'today' },
  { label: 'Overdue', value: 'overdue' },
  { label: 'Upcoming', value: 'upcoming' },
];

const SORT_OPTIONS = [
  { label: 'Created Date', value: 'createdAt' },
  { label: 'Name', value: 'name' },
  { label: 'Company', value: 'company' },
  { label: 'Stage', value: 'stage' },
  { label: 'Next Follow-up', value: 'nextFollowUpAt' },
  { label: 'Last Activity', value: 'lastActivityAt' },
];

export const LeadsPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  const [page, setPage] = useState<number>(Number(searchParams.get('page')) || 1);
  const [searchInput, setSearchInput] = useState<string>(searchParams.get('search') || '');
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('search') || '');
  const [stage, setStage] = useState<LeadStage | ''>((searchParams.get('stage') as LeadStage) || '');
  const [followUp, setFollowUp] = useState<string>(searchParams.get('followUp') || '');
  const [sortBy, setSortBy] = useState<NonNullable<LeadFilters['sortBy']>>(
    (searchParams.get('sortBy') as any) || 'createdAt'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
  );

  const [deleteLeadId, setDeleteLeadId] = useState<string | null>(null);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchQuery(searchInput);
    setPage(1);
  };

  const filters: LeadFilters = {
    page,
    limit: 15,
    search: searchQuery.trim() || undefined,
    stage: stage || undefined,
    followUp: (followUp as any) || undefined,
    sortBy,
    sortOrder,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['leads', filters],
    queryFn: () => leadApi.getLeads(filters),
  });

  const { data: stats } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getStats,
  });


  const deleteMutation = useMutation({
    mutationFn: (id: string) => leadApi.deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setDeleteLeadId(null);
    },
  });

  const handleStageTabClick = (tabValue: LeadStage | '') => {
    setStage(tabValue);
    setPage(1);
  };

  const handleSortChange = (newSortBy: string) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy as any);
      setSortOrder('desc');
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const stageTabs: { label: string; value: LeadStage | ''; count?: number }[] = [
    { label: 'All', value: '', count: stats?.total || 0 },
    { label: 'New', value: 'NEW', count: stats?.stages.new || 0 },
    { label: 'Contacted', value: 'CONTACTED', count: stats?.stages.contacted || 0 },
    { label: 'Qualified', value: 'QUALIFIED', count: stats?.stages.qualified || 0 },
    { label: 'Won', value: 'WON', count: stats?.stages.won || 0 },
    { label: 'Lost', value: 'LOST', count: stats?.stages.lost || 0 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">Leads</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5 flex items-center gap-2">
            <span>{stats?.total || 0} total leads</span>
            <span>·</span>
            <span className="text-purple-600 font-medium">{stats?.stages.qualified || 0} qualified</span>
            <span>·</span>
            <span className="text-emerald-600 font-medium">{stats?.stages.won || 0} won</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => navigate('/leads/new')} icon={<Plus className="w-4 h-4" />}>
            Add Lead
          </Button>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="space-y-4">
        {/* Stage Filter Tabs with Live Item Counts */}
        <div className="flex items-center gap-1.5 border-b border-neutral-200/80 pb-2 overflow-x-auto custom-scrollbar">
          {stageTabs.map((tab) => {
            const isActive = stage === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => handleStageTabClick(tab.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${isActive
                  ? 'bg-brand-50 text-brand-700 border border-brand-200/80 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100/70 border border-transparent'
                  }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 text-[10px] font-bold rounded-md ${isActive ? 'bg-brand-200/60 text-brand-800' : 'bg-neutral-100 text-neutral-500'
                    }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:justify-between">
          <form onSubmit={handleSearchSubmit} className="w-full lg:w-[360px] shrink-0 flex items-center gap-1.5">
            <div className="flex-1">
              <Input
                placeholder="Search leads (Press Enter to search)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <Button type="submit" size="sm" variant="secondary" className="h-9 px-3 shrink-0">
              Search
            </Button>
          </form>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto lg:ml-auto">
            <div className="w-full sm:w-[160px] shrink-0">
              <Select
                options={FOLLOWUP_FILTER_OPTIONS}
                value={followUp}
                onChange={(e) => {
                  setFollowUp(e.target.value);
                  setPage(1);
                }}
                className="w-full text-xs"
              />
            </div>

            <div className="w-full sm:w-[170px] shrink-0">
              <Select
                options={SORT_OPTIONS}
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full text-xs"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              className="h-9 w-9 min-w-9 p-0 flex items-center justify-center shrink-0"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main View Content: Kanban vs Table */}
      {isLoading ? (
        <Card className="p-12 flex justify-center items-center">
          <Loader label="Loading lead pipeline..." />
        </Card>
      ) : isError ? (
        <Card className="p-6 text-center text-rose-600 bg-rose-50 border-rose-200">
          Failed to load leads. Please try refreshing.
        </Card>
      ) : data?.data.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-400 mx-auto flex items-center justify-center">
            <Filter className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-neutral-800">No leads found</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            No leads match your current filter settings. Try adjusting search or stage selection.
          </p>
          <Button variant="outline" size="sm" onClick={() => { setSearchInput(''); setSearchQuery(''); setStage(''); setFollowUp(''); }}>
            Reset Filters
          </Button>
        </Card>
      ) : (
        /* Table View */
        <div className="space-y-4">
          <Card className="overflow-hidden p-0 border border-neutral-200/80 shadow-xs bg-white rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-subtle border-b border-neutral-200/80">
                  <tr>
                    <th className="py-3 px-5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Lead</th>
                    <th className="py-3 px-5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Company</th>
                    <th className="py-3 px-5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Stage</th>
                    <th className="py-3 px-5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Contact Info</th>
                    <th className="py-3 px-5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Next Follow-up</th>
                    <th className="py-3 px-5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 bg-white">
                  {data?.data.map((lead: Lead) => {
                    const initials = lead.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
                    return (
                      <tr
                        key={lead.id}
                        onClick={() => navigate(`/leads/${lead.id}`)}
                        className="hover:bg-neutral-50/80 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 font-bold text-xs shrink-0">
                              {initials}
                            </div>
                            <div>
                              <div className="font-semibold text-neutral-900 text-[13px]">{lead.name}</div>
                              {lead.source && (
                                <span className="text-[11px] text-neutral-400">
                                  Source: {lead.source}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-5">
                          {lead.company ? (
                            <div className="flex items-center gap-1.5 text-xs text-neutral-700 font-medium">
                              <Building className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                              <span>{lead.company}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-neutral-400 italic">Individual</span>
                          )}
                        </td>
                        <td className="py-3 px-5">
                          <Badge stage={lead.stage} />
                        </td>
                        <td className="py-3 px-5 space-y-1">
                          {lead.email && (
                            <div className="flex items-center gap-1.5 text-xs text-neutral-700">
                              <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                              <span className="truncate max-w-[180px]">{lead.email}</span>
                            </div>
                          )}
                          {lead.phone && (
                            <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                              <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                              <span>{lead.phone}</span>
                            </div>
                          )}
                          {!lead.phone && !lead.email && <span className="text-xs text-neutral-400">-</span>}
                        </td>
                        <td className="py-3 px-5">
                          {lead.nextFollowUpAt || lead.followUpAt ? (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                              <span className="text-xs font-semibold text-neutral-700">
                                {formatDate(lead.nextFollowUpAt || lead.followUpAt)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-neutral-400">Not scheduled</span>
                          )}
                        </td>
                        <td className="py-3 px-5 text-right" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu
                            items={[
                              {
                                label: 'View Profile',
                                icon: <Eye className="w-4 h-4" />,
                                onClick: () => navigate(`/leads/${lead.id}`),
                              },
                              {
                                label: 'Edit Lead',
                                icon: <Edit className="w-4 h-4" />,
                                onClick: () => navigate(`/leads/${lead.id}/edit`),
                              },
                              {
                                label: 'Delete Lead',
                                icon: <Trash2 className="w-4 h-4" />,
                                variant: 'danger',
                                onClick: () => setDeleteLeadId(lead.id),
                              },
                            ]}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {data?.pagination && (
              <div className="border-t border-neutral-200/80 bg-white">
                <Pagination
                  currentPage={data.pagination.page}
                  totalPages={data.pagination.totalPages}
                  totalItems={data.pagination.totalItems}
                  itemsPerPage={data.pagination.limit}
                  onPageChange={(newPage) => setPage(newPage)}
                />
              </div>
            )}
          </Card>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteLeadId}
        onClose={() => setDeleteLeadId(null)}
        onConfirm={() => deleteLeadId && deleteMutation.mutate(deleteLeadId)}
        title="Delete Lead"
        description="Are you sure you want to delete this lead? This action cannot be undone and will remove all associated follow-ups and history."
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
