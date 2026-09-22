import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadApi } from '../features/leads/api/leadApi';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { Loader } from '../components/common/Loader';
import { ActivityTimeline } from '../features/leads/components/ActivityTimeline';
import { CompleteFollowUpModal } from '../features/leads/components/CompleteFollowUpModal';
import type { LeadStage } from '../types';
import {
  ArrowLeftIcon as ArrowLeft,
  EditIcon as Edit2,
  TrashIcon as Trash2,
  MailIcon as Mail,
  PhoneIcon as Phone,
  BuildingIcon as Building,
  GlobeIcon as Globe,
  CalendarIcon as Calendar,
  ClockIcon as Clock,
  CheckCircleIcon as CheckCircle2,
  PlusIcon as Plus,
} from '../assets/SVGicons';

export const LeadDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [timelineRefreshKey, setTimelineRefreshKey] = useState(0);

  const { data: lead, isLoading, error } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadApi.getLeadById(id!),
    enabled: !!id,
  });

  // Fetch follow-ups to find active scheduled follow-up
  const { data: followUpsRes } = useQuery({
    queryKey: ['follow-ups', id],
    queryFn: () => leadApi.getFollowUps(id!, 1, 10),
    enabled: !!id,
  });

  const activeScheduledFollowUp = followUpsRes?.data.find((f) => f.status === 'SCHEDULED');

  const updateStageMutation = useMutation({
    mutationFn: (newStage: LeadStage) => leadApi.updateLead(id!, { stage: newStage }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
      queryClient.invalidateQueries({ queryKey: ['activities', id] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => leadApi.deleteLead(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      navigate('/leads');
    },
  });
  const handleFollowUpSuccess = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ['activities', id],
      }),

      queryClient.invalidateQueries({
        queryKey: ['follow-ups', id],
      }),

      queryClient.invalidateQueries({
        queryKey: ['lead', id],
      }),

      queryClient.invalidateQueries({
        queryKey: ['leads'],
      }),

      queryClient.invalidateQueries({
        queryKey: ['dashboard'],
      }),
    ]);

    // Forces ActivityTimeline back to page 1
    // and clears old local pagination state
    setTimelineRefreshKey((prev) => prev + 1);
  };

  if (isLoading) return <Loader label="Loading lead profile..." />;

  if (error || !lead) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Button variant="outline" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('/leads')}>
          Back to leads
        </Button>
        <div className="p-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-medium">
          Lead not found or access denied.
        </div>
      </div>
    );
  }

  const stages: LeadStage[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'WON', 'LOST'];

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return 'No follow-up set';
    const date = new Date(dateStr);
    return date.toLocaleString([], {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
        <button
          onClick={() => navigate('/leads')}
          className="flex items-center gap-2 px-3 py-1.5 text-[13px] font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 shadow-xs rounded-lg transition-colors cursor-pointer self-start xs:self-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to leads</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <Button
            variant="primary"
            icon={<CheckCircle2 className="w-4 h-4" />}
            onClick={() => setIsCompleteModalOpen(true)}
          >
            Log / Complete Follow-up
          </Button>

          <Button
            variant="outline"
            icon={<Edit2 className="w-4 h-4" />}
            onClick={() => navigate(`/leads/${lead.id}/edit`)}
          >
            Edit lead
          </Button>

          <Button
            variant="danger"
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* Main Hero Card */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{lead.name}</h1>
              <Badge stage={lead.stage} />
            </div>
            <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">{lead.company || 'Individual / Personal Lead'}</span>
            </p>
          </div>

          {/* Quick Stage Switch Pills */}
          <div className="max-w-full">
            <span className="block text-[13px] font-semibold text-slate-500 mb-1.5">
              Quick stage switch
            </span>
            <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/60 max-w-full overflow-x-auto custom-scrollbar">
              {stages.map((stg) => {
                const isActive = lead.stage === stg;
                return (
                  <button
                    key={stg}
                    onClick={() => updateStageMutation.mutate(stg)}
                    disabled={updateStageMutation.isPending}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${isActive
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                  >
                    {stg.charAt(0) + stg.slice(1).toLowerCase()}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lead Attribute Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 py-6">
          {/* Email */}
          <div>
            <span className="text-[13px] font-semibold text-slate-500 block mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Email address</span>
            </span>
            {lead.email ? (
              <a href={`mailto:${lead.email}`} className="text-[14px] font-semibold text-brand-600 hover:underline truncate block">
                {lead.email}
              </a>
            ) : (
              <span className="text-[14px] text-slate-400">-</span>
            )}
          </div>

          {/* Phone */}
          <div>
            <span className="text-[13px] font-semibold text-slate-500 block mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>Phone number</span>
            </span>
            {lead.phone ? (
              <a href={`tel:${lead.phone}`} className="text-[14px] font-semibold text-slate-800 hover:text-brand-600 block">
                {lead.phone}
              </a>
            ) : (
              <span className="text-[14px] text-slate-400">-</span>
            )}
          </div>

          {/* Source */}
          <div>
            <span className="text-[13px] font-semibold text-slate-500 block mb-1 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>Lead source</span>
            </span>
            <span className="text-[14px] font-medium text-slate-800">{lead.source || 'Direct'}</span>
          </div>

          {/* Scheduled Follow-up */}
          <div>
            <span className="text-[13px] font-semibold text-slate-500 block mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Next follow-up</span>
            </span>
            <div className="flex items-center gap-1.5 text-[14px] font-medium text-slate-800">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>{formatDate(lead.nextFollowUpAt || lead.followUpAt)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Grid Layout: Left column Notes & Details, Right column Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Notes & Summary */}
        <div className="lg:col-span-1 space-y-6">
          <Card title="Notes & background">
            {lead.notes ? (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800 text-[14px] text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {lead.notes}
              </div>
            ) : (
              <p className="text-[14px] text-slate-400 italic">No background notes added for this lead yet.</p>
            )}
          </Card>
        </div>

        {/* Right Column: Activity Timeline & Follow-up History */}
        <div className="lg:col-span-2">
          <Card title="Activity & Follow-up Timeline" subtitle="Permanent chronological record of stage changes, logged discussions, and follow-ups">
            <ActivityTimeline
              key={timelineRefreshKey}
              leadId={lead.id}
            />
          </Card>
        </div>
      </div>

      {/* Complete Follow-up Modal */}
      {isCompleteModalOpen && (
        <CompleteFollowUpModal
          isOpen={isCompleteModalOpen}
          onClose={() => setIsCompleteModalOpen(false)}
          onSuccess={handleFollowUpSuccess}
          lead={lead}
          scheduledFollowUpId={activeScheduledFollowUp?.id}
          sequenceNumber={activeScheduledFollowUp?.sequenceNumber}
        />
      )}

      {/* Confirmation Modal for Delete */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
        isLoading={deleteMutation.isPending}
        title={`Delete Lead "${lead.name}"?`}
        description="Are you sure you want to delete this lead? This action cannot be undone and will permanently remove this lead from your CRM."
        confirmText="Delete lead"
        cancelText="Cancel"
        variant="danger"
        icon={<Trash2 className="w-5 h-5 text-rose-600" />}
      />
    </div>
  );
};
