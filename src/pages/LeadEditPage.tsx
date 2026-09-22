import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadApi } from '../features/leads/api/leadApi';
import { LeadForm } from '../features/leads/components/LeadForm';
import type { LeadFormData } from '../features/leads/components/LeadForm';
import { Card } from '../components/common/Card';
import { Loader } from '../components/common/Loader';
import { PageHeader } from '../components/common/PageHeader';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { ArrowLeftIcon as ArrowLeft, AlertCircleIcon as AlertCircle, EditIcon as Edit2 } from '../assets/SVGicons';

export const LeadEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [pendingData, setPendingData] = useState<LeadFormData | null>(null);

  const { data: lead, isLoading: isFetching } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadApi.getLeadById(id!),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: LeadFormData) => leadApi.updateLead(id!, data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      navigate(`/leads/${id}`);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to update lead');
      setPendingData(null);
    },
  });

  const handleSubmit = (data: LeadFormData) => {
    setError(null);
    setPendingData(data);
  };

  const handleConfirmSave = () => {
    if (pendingData) {
      updateMutation.mutate(pendingData);
    }
  };

  if (isFetching) return <Loader label="Loading lead details..." />;

  if (!lead) {
    return (
      <div className="p-6 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 text-sm font-medium">
        Lead not found or access denied.
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title={`Edit lead — ${lead.name}`}
        subtitle="Update contact info, stage, or follow-up schedule"
        backButton={
          <button
            onClick={() => navigate(`/leads/${id}`)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-white transition-colors border border-slate-200 cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        }
      />

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-sm text-rose-700 font-medium">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Card className="p-6 sm:p-8">
        <LeadForm
          initialData={lead}
          onSubmit={handleSubmit}
          isLoading={false}
          onCancel={() => navigate(`/leads/${id}`)}
        />
      </Card>

      <ConfirmModal
        isOpen={!!pendingData}
        onClose={() => setPendingData(null)}
        onConfirm={handleConfirmSave}
        isLoading={updateMutation.isPending}
        title="Confirm lead update?"
        description={`Are you sure you want to save the changes made to "${lead.name}"?`}
        confirmText="Save changes"
        cancelText="Cancel"
        variant="primary"
        icon={<Edit2 className="w-5 h-5 text-brand-600" />}
      />
    </div>
  );
};
