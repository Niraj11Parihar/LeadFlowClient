import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { XIcon as X, AlertCircleIcon as AlertCircle } from '../../../assets/SVGicons';
import type { Lead, LeadStage } from '../../../types';
import { leadApi } from '../api/leadApi';
import { Select } from '../../../components/common/Select';
import { DateTimePicker } from '../../../components/common/DateTimePicker';
import { Button } from '../../../components/common/Button';

interface CompleteFollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
  scheduledFollowUpId?: string;
  sequenceNumber?: number;
  onSuccess?: () => void;
}

const MEDIUM_SUGGESTIONS = [
  'Phone Call',
  'WhatsApp',
  'Google Meet',
  'Instagram DM',
  'Client Office Meeting',
  'LinkedIn',
  'Email',
];

const STAGE_OPTIONS: { label: string; value: LeadStage }[] = [
  { label: 'New Lead', value: 'NEW' },
  { label: 'Contacted', value: 'CONTACTED' },
  { label: 'Qualified', value: 'QUALIFIED' },
  { label: 'Deal Won 🎉', value: 'WON' },
  { label: 'Deal Lost ❌', value: 'LOST' },
];

export const CompleteFollowUpModal: React.FC<CompleteFollowUpModalProps> = ({
  isOpen,
  onClose,
  lead,
  scheduledFollowUpId,
  sequenceNumber,
  onSuccess,
}) => {
  const [communicationMedium, setCommunicationMedium] = useState('Phone Call');
  const [discussionNote, setDiscussionNote] = useState('');
  const [outcome, setOutcome] = useState('');
  const [stage, setStage] = useState<LeadStage>(lead?.stage || 'NEW');
  const [nextFollowUpAt, setNextFollowUpAt] = useState<string>('');
  const [scheduleNext, setScheduleNext] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discussionNote.trim()) {
      setError('Please enter discussion notes for this follow-up');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (scheduledFollowUpId) {
        await leadApi.completeFollowUp(lead.id, scheduledFollowUpId, {
          communicationMedium,
          discussionNote,
          outcome: outcome.trim() || undefined,
          nextFollowUpAt: scheduleNext && nextFollowUpAt ? nextFollowUpAt : null,
          stage,
        });
      } else {
        await leadApi.completeFollowUp(lead.id, 'latest', {
          communicationMedium,
          discussionNote,
          outcome: outcome.trim() || undefined,
          nextFollowUpAt: scheduleNext && nextFollowUpAt ? nextFollowUpAt : null,
          stage,
        });
      }

      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to complete follow-up');
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Log Follow-up Call / Interaction
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lead.name} {lead.company ? `(${lead.company})` : ''}
              {sequenceNumber ? ` • Follow-up #${sequenceNumber}` : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Medium selection & suggestions */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Communication Medium
            </label>
            <input
              type="text"
              value={communicationMedium}
              onChange={(e) => setCommunicationMedium(e.target.value)}
              placeholder="e.g. Phone Call, WhatsApp, Client Meeting"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {MEDIUM_SUGGESTIONS.map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setCommunicationMedium(m)}
                  className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors ${
                    communicationMedium === m
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 font-medium'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Discussion Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Discussion Notes / Summary <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={discussionNote}
              onChange={(e) => setDiscussionNote(e.target.value)}
              rows={3}
              placeholder="What did you discuss? What were the key takeaways or client feedback?"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>

          {/* Outcome / Result */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Outcome / Key Result (Optional)
            </label>
            <input
              type="text"
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              placeholder="e.g. Interested in demo, Requested proposal, Budget constraint"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Update Stage */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Lead Stage Status
            </label>
            <Select
              options={STAGE_OPTIONS}
              value={stage}
              onChange={(e) => setStage(e.target.value as LeadStage)}
              className="w-full"
            />
          </div>

          {/* Schedule Next Follow-up Section */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={scheduleNext}
                  onChange={(e) => setScheduleNext(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 dark:bg-slate-800 dark:border-slate-700"
                />
                Schedule Next Follow-up
              </label>
            </div>

            {scheduleNext && (
              <DateTimePicker
                value={nextFollowUpAt}
                onChange={setNextFollowUpAt}
                label="Next Follow-up Date & Time"
              />
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Complete & Save
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
