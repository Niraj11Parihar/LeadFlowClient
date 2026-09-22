import React from 'react';
import type { LeadStage } from '../../types';
import { clsx } from 'clsx';

interface BadgeProps {
  stage: LeadStage;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ stage, className }) => {
  const styles: Record<LeadStage, string> = {
    NEW: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    CONTACTED: 'bg-brand-50 text-brand-700 border-brand-200',
    QUALIFIED: 'bg-purple-50 text-purple-700 border-purple-200',
    WON: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    LOST: 'bg-rose-50 text-rose-700 border-rose-200',
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
