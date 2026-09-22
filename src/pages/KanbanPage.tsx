import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { PlusIcon as Plus, SearchIcon as Search } from '../assets/SVGicons';
import { leadApi } from '../features/leads/api/leadApi';
import { dashboardApi } from '../features/dashboard/api/dashboardApi';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Loader } from '../components/common/Loader';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { KanbanBoard } from '../features/leads/components/KanbanBoard';
import type { LeadStage } from '../types';

export const KanbanPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [searchInput, setSearchInput] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [deleteLeadId, setDeleteLeadId] = useState<string | null>(null);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearchQuery(searchInput);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ['leads', { limit: 100, search: searchQuery.trim() || undefined }],
    queryFn: () => leadApi.getLeads({ limit: 100, search: searchQuery.trim() || undefined }),
  });

  const { data: stats } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getStats,
  });

  const updateStageMutation = useMutation({
    mutationFn: ({ id, newStage }: { id: string; newStage: LeadStage }) =>
      leadApi.updateLead(id, { stage: newStage }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => leadApi.deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setDeleteLeadId(null);
    },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">Kanban</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Drag and drop deal cards to instantly update lead stages across your pipeline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={() => navigate('/leads/new')} icon={<Plus className="w-4 h-4" />}>
            Add Lead
          </Button>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white border border-neutral-200/80 rounded-xl p-3 shadow-2xs">
          <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">New</div>
          <div className="text-lg font-bold text-neutral-900 mt-1">{stats?.stages.new || 0}</div>
        </div>
        <div className="bg-white border border-neutral-200/80 rounded-xl p-3 shadow-2xs">
          <div className="text-[11px] font-semibold text-brand-600 uppercase tracking-wider">Contacted</div>
          <div className="text-lg font-bold text-brand-700 mt-1">{stats?.stages.contacted || 0}</div>
        </div>
        <div className="bg-white border border-neutral-200/80 rounded-xl p-3 shadow-2xs">
          <div className="text-[11px] font-semibold text-purple-600 uppercase tracking-wider">Qualified</div>
          <div className="text-lg font-bold text-purple-700 mt-1">{stats?.stages.qualified || 0}</div>
        </div>
        <div className="bg-white border border-neutral-200/80 rounded-xl p-3 shadow-2xs">
          <div className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Won Deals</div>
          <div className="text-lg font-bold text-emerald-700 mt-1">{stats?.stages.won || 0}</div>
        </div>
        <div className="bg-white border border-neutral-200/80 rounded-xl p-3 shadow-2xs">
          <div className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider">Lost Deals</div>
          <div className="text-lg font-bold text-rose-700 mt-1">{stats?.stages.lost || 0}</div>
        </div>
      </div>

      {/* Toolbar Search */}
      <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md">
        <div className="flex-1">
          <Input
            placeholder="Filter Kanban cards by lead or company..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <Button type="submit" size="sm" variant="secondary" className="h-9 px-3">
          Search
        </Button>
      </form>

      {/* Board Content */}
      {isLoading ? (
        <Card className="p-12 flex justify-center items-center">
          <Loader label="Loading visual board..." />
        </Card>
      ) : isError ? (
        <Card className="p-6 text-center text-rose-600 bg-rose-50 border-rose-200">
          Failed to load lead pipeline. Please try refreshing.
        </Card>
      ) : (
        <KanbanBoard
          leads={data?.data || []}
          onStageChange={(id, newStage) => updateStageMutation.mutate({ id, newStage })}
          onDeleteLead={(id) => setDeleteLeadId(id)}
        />
      )}

      <ConfirmModal
        isOpen={!!deleteLeadId}
        onClose={() => setDeleteLeadId(null)}
        onConfirm={() => deleteLeadId && deleteMutation.mutate(deleteLeadId)}
        title="Delete Lead"
        description="Are you sure you want to delete this lead from the pipeline?"
        confirmText="Delete"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};
