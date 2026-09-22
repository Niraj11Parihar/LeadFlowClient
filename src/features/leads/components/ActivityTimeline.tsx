import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { leadApi } from '../api/leadApi';
import type { LeadActivity } from '../../../types';
import {
  UserPlusIcon as UserPlus,
  Edit3Icon as Edit3,
  ArrowRightIcon as ArrowRight,
  CalendarIcon as Calendar,
  CheckCircleIcon as CheckCircle2,
  ClockIcon as Clock,
  XCircleIcon as XCircle,
  MessageSquareIcon as MessageSquare,
  TagIcon as Tag,
  LoaderIcon as Loader2,
  HistoryIcon as History,
} from '../../../assets/SVGicons';

interface ActivityTimelineProps {
  leadId: string;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ leadId }) => {
  const [page, setPage] = useState(1);
  const [allActivities, setAllActivities] = useState<LeadActivity[]>([]);

  const { data: response, isLoading, isFetching } = useQuery({
    queryKey: ['activities', leadId, page],
    queryFn: async () => {
      const res = await leadApi.getActivities(leadId, page, 15);
      if (page === 1) {
        setAllActivities(res.data);
      } else {
        setAllActivities((prev) => {
          // Filter out duplicates
          const existingIds = new Set(prev.map((a) => a.id));
          const newItems = res.data.filter((a) => !existingIds.has(a.id));
          return [...prev, ...newItems];
        });
      }
      return res;
    },
  });

  const paginationMeta = response?.pagination;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'LEAD_CREATED':
        return <UserPlus className="w-4 h-4 text-blue-600" />;
      case 'LEAD_UPDATED':
        return <Edit3 className="w-4 h-4 text-slate-600" />;
      case 'STAGE_CHANGED':
        return <ArrowRight className="w-4 h-4 text-purple-600" />;
      case 'FOLLOWUP_SCHEDULED':
        return <Calendar className="w-4 h-4 text-amber-600" />;
      case 'FOLLOWUP_COMPLETED':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'FOLLOWUP_RESCHEDULED':
        return <Clock className="w-4 h-4 text-indigo-600" />;
      case 'FOLLOWUP_CANCELLED':
        return <XCircle className="w-4 h-4 text-rose-600" />;
      default:
        return <History className="w-4 h-4 text-slate-600" />;
    }
  };

  const getActivityBadgeBg = (type: string) => {
    switch (type) {
      case 'LEAD_CREATED':
        return 'bg-blue-50 border-blue-200';
      case 'LEAD_UPDATED':
        return 'bg-slate-100 border-slate-200';
      case 'STAGE_CHANGED':
        return 'bg-purple-50 border-purple-200';
      case 'FOLLOWUP_SCHEDULED':
        return 'bg-amber-50 border-amber-200';
      case 'FOLLOWUP_COMPLETED':
        return 'bg-emerald-50 border-emerald-200';
      case 'FOLLOWUP_RESCHEDULED':
        return 'bg-indigo-50 border-indigo-200';
      case 'FOLLOWUP_CANCELLED':
        return 'bg-rose-50 border-rose-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading && page === 1) {
    return (
      <div className="py-12 text-center text-slate-500 flex items-center justify-center gap-2 text-sm font-medium">
        <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
        <span>Loading activity history...</span>
      </div>
    );
  }

  if (allActivities.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
        <History className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <h4 className="text-sm font-semibold text-slate-800">No activity history yet</h4>
        <p className="text-xs text-slate-500 mt-1">
          Activity events and logged follow-up discussions will appear here chronologically.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Timeline List */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {allActivities.map((act) => {
          const meta = act.metadata || {};

          return (
            <div key={act.id} className="relative group">
              {/* Timeline Icon Node */}
              <div
                className={`absolute -left-[30px] top-0 w-7 h-7 rounded-full border flex items-center justify-center bg-white shadow-xs ${getActivityBadgeBg(
                  act.type
                )}`}
              >
                {getActivityIcon(act.type)}
              </div>

              {/* Main Activity Content */}
              <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs hover:border-slate-300 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-slate-900">
                      {act.description || act.type.replace(/_/g, ' ')}
                    </span>
                    {meta.sequenceNumber && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                        Follow-up #{meta.sequenceNumber}
                      </span>
                    )}
                  </div>
                  <span className="text-[12px] font-medium text-slate-400">
                    {formatDate(act.createdAt)}
                  </span>
                </div>

                {/* Specific Details based on activity type */}

                {/* 1. Stage Changed */}
                {act.type === 'STAGE_CHANGED' && meta.oldStage && meta.newStage && (
                  <div className="mt-2 text-xs font-semibold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100 inline-flex items-center gap-2">
                    <span>{meta.oldStage}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>{meta.newStage}</span>
                  </div>
                )}

                {/* 2. Followup Completed Card */}
                {act.type === 'FOLLOWUP_COMPLETED' && (
                  <div className="mt-3 space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {meta.communicationMedium && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{meta.communicationMedium}</span>
                        </span>
                      )}
                      {meta.outcome && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                          <Tag className="w-3 h-3 text-slate-500" />
                          <span>Outcome: {meta.outcome}</span>
                        </span>
                      )}
                    </div>

                    {meta.discussionNote && (
                      <div className="p-3 bg-slate-50 rounded-lg text-[13px] text-slate-700 whitespace-pre-wrap leading-relaxed border border-slate-100">
                        {meta.discussionNote}
                      </div>
                    )}
                  </div>
                )}

                {/* 3. Followup Scheduled / Rescheduled */}
                {(act.type === 'FOLLOWUP_SCHEDULED' || act.type === 'FOLLOWUP_RESCHEDULED') && (
                  <div className="mt-2 text-xs text-slate-600 flex flex-wrap items-center gap-2">
                    {meta.scheduledAt && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                        <Calendar className="w-3 h-3 text-amber-600" />
                        <span>Scheduled: {formatDate(meta.scheduledAt)}</span>
                      </span>
                    )}
                    {meta.previousScheduledAt && meta.newScheduledAt && (
                      <span className="text-[12px] text-slate-500">
                        (Rescheduled from {formatDate(meta.previousScheduledAt)} to {formatDate(meta.newScheduledAt)})
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      {paginationMeta && paginationMeta.hasNextPage && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {isFetching ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Loading more...</span>
              </>
            ) : (
              <span>Load older activities</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
