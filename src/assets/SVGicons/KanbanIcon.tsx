import React from 'react';
import type { IconProps } from './EyeIcon';

export const KanbanIcon: React.FC<IconProps> = ({ size = 18, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M6 3v18" />
    <path d="M12 3v18" />
    <path d="M18 3v18" />
    <rect x="4" y="6" width="4" height="5" rx="1" />
    <rect x="10" y="6" width="4" height="9" rx="1" />
    <rect x="16" y="6" width="4" height="4" rx="1" />
  </svg>
);
