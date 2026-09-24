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
import type { Lead, LeadStage } from '../types';

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

  const leadsQueryKey = ['leads', { limit: 100, search: searchQuery.trim() || undefined }];

  const { data, isLoading, isError } = useQuery({
    queryKey: leadsQueryKey,
    queryFn: () => leadApi.getLeads({ limit: 100, search: searchQuery.trim() || undefined }),
  });

  const { data: stats } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getStats,
  });

  const updateStageMutation = useMutation({
    mutationFn: ({ id, newStage }: { id: string; newStage: LeadStage }) =>
      leadApi.updateLead(id, { stage: newStage }),
    onMutate: async ({ id, newStage }) => {
      await queryClient.cancelQueries({ queryKey: ['leads'] });

      const previousLeadsData = queryClient.getQueryData<any>(leadsQueryKey);
      const previousStats = queryClient.getQueryData<any>(['dashboard']);

      if (previousLeadsData) {
        queryClient.setQueryData<any>(leadsQueryKey, (old: any) => {
          if (!old || !old.data) return old;
          return {
            ...old,
            data: old.data.map((lead: Lead) =>
              lead.id === id ? { ...lead, stage: newStage } : lead
            ),
          };
        });
      }

      if (previousStats && previousLeadsData?.data) {
        const targetLead = previousLeadsData.data.find((l: Lead) => l.id === id);
        if (targetLead && targetLead.stage !== newStage) {
          const oldStageKey = targetLead.stage.toLowerCase() as keyof typeof previousStats.stages;
          const newStageKey = newStage.toLowerCase() as keyof typeof previousStats.stages;
          queryClient.setQueryData<any>(['dashboard'], (old: any) => {
            if (!old) return old;
            return {
              ...old,
              stages: {
                ...old.stages,
                [oldStageKey]: Math.max(0, (old.stages[oldStageKey] || 1) - 1),
                [newStageKey]: (old.stages[newStageKey] || 0) + 1,
              },
            };
          });
        }
      }

      return { previousLeadsData, previousStats };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousLeadsData) {
        queryClient.setQueryData(leadsQueryKey, context.previousLeadsData);
      }
      if (context?.previousStats) {
        queryClient.setQueryData(['dashboard'], context.previousStats);
      }
    },
    onSettled: () => {
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
      <div className="w-full sm:w-[320px]">
        <Input
          placeholder="Filter Kanban cards..."
          value={searchInput}
          onChange={(e) => {
            const val = e.target.value;
            setSearchInput(val);
            setSearchQuery(val);
          }}
          icon={<Search className="w-4 h-4" />}
          className="h-10 text-xs"
        />
      </div>

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
