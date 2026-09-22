import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { leadApi } from '../features/leads/api/leadApi';
import { LeadForm } from '../features/leads/components/LeadForm';
import type { LeadFormData } from '../features/leads/components/LeadForm';
import { Card } from '../components/common/Card';
import { PageHeader } from '../components/common/PageHeader';
import { ArrowLeftIcon as ArrowLeft, AlertCircleIcon as AlertCircle } from '../assets/SVGicons';

export const LeadCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: (data: LeadFormData) => leadApi.createLead(data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      navigate('/leads');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'Failed to create lead. Please check inputs.');
    },
  });

  const handleSubmit = (data: LeadFormData) => {
    setError(null);
    createMutation.mutate(data);
  };

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Create new lead"
        subtitle="Fill in the contact information, pipeline details, and follow-up schedule"
        backButton={
          <button
            onClick={() => navigate('/leads')}
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
          onSubmit={handleSubmit}
          isLoading={createMutation.isPending}
          onCancel={() => navigate('/leads')}
        />
      </Card>
    </div>
  );
};
