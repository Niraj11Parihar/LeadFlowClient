import React from 'react';
import type { LeadStage } from '../../types';
import { clsx } from 'clsx';

interface BadgeProps {
  stage: LeadStage;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ stage, className }) => {
  const styles: Record<LeadStage, string> = {
    NEW: 'bg-slate-100 text-slate-700 border-slate-200/80',
    CONTACTED: 'bg-blue-50 text-blue-700 border-blue-200/80',
    QUALIFIED: 'bg-purple-50 text-purple-700 border-purple-200/80',
    WON: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    LOST: 'bg-rose-50 text-rose-700 border-rose-200/80',
  };

  const labels: Record<LeadStage, string> = {
    NEW: 'New',
    CONTACTED: 'Contacted',
    QUALIFIED: 'Qualified',
    WON: 'Won',
    LOST: 'Lost',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-md text-[12px] font-semibold border transition-colors leading-5',
        styles[stage] || styles.NEW,
        className
      )}
    >
      {labels[stage] || stage}
    </span>
  );
};
