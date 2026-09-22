import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { leadApi } from '../api/leadApi';
import type { LeadActivity } from '../../../types';
import {
  ArrowRightIcon as ArrowRight,
  CalendarIcon as Calendar,
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
          const existingIds = new Set(prev.map((a) => a.id));
          const newItems = res.data.filter((a) => !existingIds.has(a.id));
          return [...prev, ...newItems];
        });
      }
      return res;
    },
  });

  const paginationMeta = response?.pagination;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading && page === 1) {
    return (
      <div className="py-8 text-center text-neutral-500 flex items-center justify-center gap-2 text-xs font-semibold">
        <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
        <span>Loading activity stream...</span>
      </div>
    );
  }

  if (allActivities.length === 0) {
    return (
      <div className="p-6 text-center bg-surface-subtle rounded-xl border border-dashed border-neutral-200">
        <History className="w-6 h-6 text-neutral-400 mx-auto mb-1.5" />
        <h4 className="text-xs font-bold text-neutral-800">No activity logged yet</h4>
        <p className="text-[11px] text-neutral-500 mt-0.5">
          Interaction history and stage transitions will appear here chronologically.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        {allActivities.map((act) => {
          const meta = act.metadata || {};

          return (
            <div
              key={act.id}
              className="bg-white rounded-xl border border-neutral-200/80 p-3.5 sm:p-4 shadow-2xs hover:border-neutral-300 transition-all flex flex-col sm:flex-row sm:items-start gap-3.5"
            >
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-neutral-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-neutral-900">
                      {act.description || act.type.replace(/_/g, ' ')}
                    </span>
                    {meta.sequenceNumber && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-neutral-100 text-neutral-600 border border-neutral-200">
                        #{meta.sequenceNumber}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-neutral-400 shrink-0">
                    {formatDate(act.createdAt)}
                  </span>
                </div>

                {act.type === 'STAGE_CHANGED' && meta.oldStage && meta.newStage && (
                  <div className="mt-2 text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200/80 inline-flex items-center gap-1.5">
                    <span>{meta.oldStage}</span>
                    <ArrowRight className="w-3 h-3" />
                    <span>{meta.newStage}</span>
                  </div>
                )}

                {act.type === 'FOLLOWUP_COMPLETED' && (
                  <div className="mt-2.5 space-y-2">
                    <div className="flex flex-wrap items-center gap-1.5 text-xs">
                      {meta.communicationMedium && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold text-[11px] border border-emerald-200">
                          <MessageSquare className="w-3 h-3 text-emerald-600" />
                          <span>{meta.communicationMedium}</span>
                        </span>
                      )}
                      {meta.outcome && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-800 font-semibold text-[11px] border border-neutral-200">
                          <Tag className="w-3 h-3 text-neutral-500" />
                          <span>Outcome: {meta.outcome}</span>
                        </span>
                      )}
                    </div>
                    {meta.discussionNote && (
                      <p className="p-2.5 bg-surface-subtle rounded-lg text-xs text-neutral-700 whitespace-pre-wrap leading-relaxed border border-neutral-100">
                        {meta.discussionNote}
                      </p>
                    )}
                  </div>
                )}

                {(act.type === 'FOLLOWUP_SCHEDULED' || act.type === 'FOLLOWUP_RESCHEDULED') && (
                  <div className="mt-2 text-xs text-neutral-600 flex flex-wrap items-center gap-2">
                    {meta.scheduledAt && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 font-semibold text-[11px] border border-amber-200">
                        <Calendar className="w-3 h-3 text-amber-600" />
                        <span>Scheduled: {formatDate(meta.scheduledAt)}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {paginationMeta && paginationMeta.hasNextPage && (
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            disabled={isFetching}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {isFetching ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <span>Load older activity</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
