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
  BuildingIcon as Building2,
  CalendarIcon as Calendar,
  ArrowUpDownIcon as ArrowUpDown,
} from '../assets/SVGicons';
import { leadApi } from '../features/leads/api/leadApi';
import { PageHeader } from '../components/common/PageHeader';
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


const STAGE_TABS: { label: string; value: LeadStage | '' }[] = [
  { label: 'All Leads', value: '' },
  { label: 'New', value: 'NEW' },
  { label: 'Contacted', value: 'CONTACTED' },
  { label: 'Qualified', value: 'QUALIFIED' },
  { label: 'Won', value: 'WON' },
  { label: 'Lost', value: 'LOST' },
];

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
  const [search, setSearch] = useState<string>(searchParams.get('search') || '');
  const [stage, setStage] = useState<LeadStage | ''>((searchParams.get('stage') as LeadStage) || '');
  const [followUp, setFollowUp] = useState<string>(searchParams.get('followUp') || '');
  const [sortBy, setSortBy] = useState<NonNullable<LeadFilters['sortBy']>>(
    (searchParams.get('sortBy') as any) || 'createdAt'
  );
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(
    (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
  );

  const [deleteLeadId, setDeleteLeadId] = useState<string | null>(null);

  const filters: LeadFilters = {
    page,
    limit: 15,
    search: search.trim() || undefined,
    stage: stage || undefined,
    followUp: (followUp as any) || undefined,
    sortBy,
    sortOrder,
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['leads', filters],
    queryFn: () => leadApi.getLeads(filters),
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <PageHeader
        title="Leads"
        subtitle="Manage and track your lead pipeline efficiently"
        action={
          <Button onClick={() => navigate('/leads/new')} icon={<Plus className="w-4 h-4" />}>
            Add Lead
          </Button>
        }
      />

      {/* Filter and Tab Section */}
      <div className="space-y-4">
        {/* Stage Filter Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
          {STAGE_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleStageTabClick(tab.value)}
              className={`px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${stage === tab.value
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search and Filters Bar */}
        {/* Search and Filters Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 lg:justify-between">
          {/* Search */}
          <div className="w-full lg:w-[360px] shrink-0">
            <Input
              placeholder="Search by name, email, phone, company..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto lg:ml-auto">
            {/* Follow-up Filter */}
            <div className="w-full sm:w-[170px] shrink-0">
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

            {/* Sort Filter */}
            <div className="w-full sm:w-[180px] shrink-0">
              <Select
                options={SORT_OPTIONS}
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full text-xs"
              />
            </div>

            {/* Sort Direction */}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
              }
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'
                }`}
              className="h-10 w-10 min-w-10 p-0 flex items-center justify-center shrink-0"
            >
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Leads Content */}

      {isLoading ? (
        <Card className="p-12 flex justify-center items-center">
          <Loader label="Loading leads..." />
        </Card>
      ) : isError ? (
        <Card className="p-6 text-center text-rose-600 bg-rose-50 dark:bg-rose-950/30 border-rose-200">
          Failed to load leads. Please try refreshing.
        </Card>
      ) : data?.data.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">No leads found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No leads match your current filter settings. Try adjusting search or filters.
          </p>
          <Button variant="outline" size="sm" onClick={() => { setSearch(''); setStage(''); setFollowUp(''); }}>
            Reset Filters
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="overflow-hidden p-0 border border-slate-200 shadow-sm bg-white rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-6 text-[11px] font-bold text-slate-600 uppercase tracking-wider">Lead Name</th>
                    <th className="py-3.5 px-6 text-[11px] font-bold text-slate-600 uppercase tracking-wider">Company</th>
                    <th className="py-3.5 px-6 text-[11px] font-bold text-slate-600 uppercase tracking-wider">Stage</th>
                    <th className="py-3.5 px-6 text-[11px] font-bold text-slate-600 uppercase tracking-wider">Contact Info</th>
                    <th className="py-3.5 px-6 text-[11px] font-bold text-slate-600 uppercase tracking-wider">Next Follow-up</th>
                    <th className="py-3.5 px-6 text-[11px] font-bold text-slate-600 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {data?.data.map((lead: Lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => navigate(`/leads/${lead.id}`)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="py-4 px-6 font-medium text-slate-900">
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{lead.name}</div>
                          {lead.source && (
                            <span className="text-[11px] text-slate-400 font-medium">
                              Source: {lead.source}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-700 font-medium text-xs">
                        {lead.company ? (
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{lead.company}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <Badge stage={lead.stage} />
                      </td>
                      <td className="py-4 px-6 text-slate-600 space-y-1">
                        {lead.email && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[180px]">{lead.email}</span>
                          </div>
                        )}
                        {lead.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                        {!lead.phone && !lead.email && <span className="text-slate-400">-</span>}
                      </td>
                      <td className="py-4 px-6 text-slate-700 font-medium text-xs">
                        {lead.nextFollowUpAt || lead.followUpAt ? (
                          <div className="flex items-center gap-1.5 text-xs">
                            <Calendar className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                            <span className="font-semibold text-slate-700">
                              {formatDate(lead.nextFollowUpAt || lead.followUpAt)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs font-normal">Not scheduled</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu
                          items={[
                            {
                              label: 'View Details',
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
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {data?.pagination && (
              <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
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

      {/* Delete Confirmation Modal */}
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
