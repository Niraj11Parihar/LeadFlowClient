import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const Card: React.FC<CardProps> = ({ children, className, title, subtitle, action, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={twMerge(
        clsx(
          'bg-white rounded-xl border border-neutral-200/80 shadow-xs p-5 transition-all',
          className
        )
      )}
    >
      {(title || action) && (
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-100">
          <div>
            {title && <h3 className="text-[15px] font-semibold text-neutral-900 tracking-tight">{title}</h3>}
            {subtitle && <p className="text-[12px] text-neutral-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
