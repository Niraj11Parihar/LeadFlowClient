import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadApi } from '../features/leads/api/leadApi';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { Loader } from '../components/common/Loader';
import { DropdownMenu } from '../components/common/DropdownMenu';
import { ActivityTimeline } from '../features/leads/components/ActivityTimeline';
import { CompleteFollowUpModal } from '../features/leads/components/CompleteFollowUpModal';
import { useAuth } from '../context/AuthContext';
import type { LeadStage } from '../types';
import {
  ArrowLeftIcon as ArrowLeft,
  EditIcon as Edit,
  TrashIcon as Trash2,
  BuildingIcon as Building,
  ClockIcon as Clock,
  CheckCircleIcon as CheckCircle,
} from '../assets/SVGicons';

export const LeadDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [timelineRefreshKey, setTimelineRefreshKey] = useState(0);

  const { data: lead, isLoading, error } = useQuery({
    queryKey: ['lead', id],
    queryFn: () => leadApi.getLeadById(id!),
    enabled: !!id,
  });

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
      queryClient.invalidateQueries({ queryKey: ['activities', id] }),
      queryClient.invalidateQueries({ queryKey: ['follow-ups', id] }),
      queryClient.invalidateQueries({ queryKey: ['lead', id] }),
      queryClient.invalidateQueries({ queryKey: ['leads'] }),
      queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
    ]);
    setTimelineRefreshKey((prev) => prev + 1);
  };

  if (isLoading) return <Loader label="Loading lead record..." />;

  if (error || !lead) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Button variant="outline" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate(-1)}>
          Back
        </Button>
        <div className="p-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-semibold">
          Lead record not found or access denied.
        </div>
      </div>
    );
  }

  const stages: LeadStage[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'WON', 'LOST'];
  const initials = lead.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return 'Not scheduled';
    const date = new Date(dateStr);
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="w-full space-y-5 max-w-7xl mx-auto">
      {/* Top Breadcrumb Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 bg-white border border-neutral-200 shadow-xs rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        {/* Primary Action Controls with Overflow Menu */}
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={<CheckCircle className="w-4 h-4" />}
            onClick={() => setIsCompleteModalOpen(true)}
          >
            Log / Complete Follow-up
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={<Edit className="w-4 h-4" />}
            onClick={() => navigate(`/leads/${lead.id}/edit`)}
          >
            Edit
          </Button>

          {/* Discreet Overflow Menu for Delete */}
          <DropdownMenu
            items={[
              {
                label: 'Duplicate Lead Profile',
                onClick: () => navigate('/leads/new'),
              },
              {
                label: 'Delete Lead',
                icon: <Trash2 className="w-4 h-4" />,
                variant: 'danger',
                onClick: () => setIsDeleteModalOpen(true),
              },
            ]}
          />
        </div>
      </div>

      {/* Two-Column CRM Record Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Main Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Record Header */}
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-700 font-extrabold text-base shrink-0 shadow-xs">
                  {initials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">{lead.name}</h1>
                    <Badge stage={lead.stage} />
                  </div>
                  <p className="text-xs font-semibold text-neutral-500 mt-0.5 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>{lead.company || 'Individual / Personal Lead'}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stage Selector Bar */}
            <div className="pt-4">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Pipeline Stage Switcher
              </span>
              <div className="flex flex-wrap items-center gap-1 bg-surface-subtle p-1 rounded-xl border border-neutral-200/80">
                {stages.map((stg) => {
                  const isActive = lead.stage === stg;
                  return (
                    <button
                      key={stg}
                      onClick={() => updateStageMutation.mutate(stg)}
                      disabled={updateStageMutation.isPending}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${isActive
                          ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200 font-bold'
                          : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/60'
                        }`}
                    >
                      {stg.charAt(0) + stg.slice(1).toLowerCase()}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Lead Background Notes */}
          <Card title="Notes & Context" subtitle="Important background information for sales context">
            {lead.notes ? (
              <div className="flex gap-3 bg-surface-subtle p-3.5 rounded-xl border border-neutral-100">
                <div className="w-1 shrink-0 rounded-full bg-brand-500 self-stretch" />
                <p className="text-xs text-neutral-700 leading-relaxed whitespace-pre-wrap font-medium">
                  {lead.notes}
                </p>
              </div>
            ) : (
              <p className="text-xs text-neutral-400 italic py-2">No notes added for this lead yet.</p>
            )}
          </Card>

          {/* Activity Feed Timeline */}
          <Card title="Activity Stream" subtitle="Chronological timeline of follow-ups, notes, and pipeline changes">
            <ActivityTimeline key={timelineRefreshKey} leadId={lead.id} />
          </Card>
        </div>

        {/* Right Sidebar Column (1 col) - Lead Details Panel */}
        <div className="space-y-6">
          <Card title="Lead Details" className="sticky top-4">
            <div className="space-y-4 text-xs">
              {/* Email */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Email Address
                </span>
                {lead.email ? (
                  <a href={`mailto:${lead.email}`} className="font-semibold text-brand-600 hover:underline break-all block">
                    {lead.email}
                  </a>
                ) : (
                  <span className="text-neutral-400 italic">Not provided</span>
                )}
              </div>

              {/* Phone */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Phone Number
                </span>
                {lead.phone ? (
                  <a href={`tel:${lead.phone}`} className="font-semibold text-neutral-800 hover:text-brand-600 block">
                    {lead.phone}
                  </a>
                ) : (
                  <span className="text-neutral-400 italic">Not provided</span>
                )}
              </div>

              {/* Lead Source */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Acquisition Source
                </span>
                <span className="font-semibold text-neutral-800">{lead.source || 'Direct Prospect'}</span>
              </div>

              {/* Account Owner */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Account Owner
                </span>
                <div className="flex items-center gap-2 font-semibold text-neutral-800">
                  <div className="w-5 h-5 rounded-full bg-brand-600 text-white font-bold text-[10px] flex items-center justify-center">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span>{user?.name || 'Workspace Admin'}</span>
                </div>
              </div>

              {/* Next Follow-Up Schedule */}
              <div className="pt-2 border-t border-neutral-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Next Scheduled Follow-up
                </span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-brand-700 bg-brand-50 p-2.5 rounded-lg border border-brand-200/80">
                  <Clock className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>{formatDate(lead.nextFollowUpAt || lead.followUpAt)}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Complete Follow-Up Modal */}
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

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
        isLoading={deleteMutation.isPending}
        title={`Delete Lead "${lead.name}"?`}
        description="Are you sure you want to delete this lead? This action cannot be undone and will permanently remove this lead profile."
        confirmText="Delete lead"
        cancelText="Cancel"
        variant="danger"
        icon={<Trash2 className="w-5 h-5 text-rose-600" />}
      />
    </div>
  );
};
