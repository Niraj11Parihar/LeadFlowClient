import React from 'react';
import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu';
import { MoreVerticalIcon as MoreVertical } from '../../assets/SVGicons';
import { clsx } from 'clsx';

export interface DropdownMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

export interface DropdownMenuProps {
  items: DropdownMenuItem[];
  trigger?: React.ReactNode;
  align?: 'start' | 'center' | 'end';
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  trigger,
  align = 'end',
}) => {
  return (
    <RadixDropdownMenu.Root>
      <RadixDropdownMenu.Trigger asChild>
        {trigger || (
          <button
            type="button"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
            title="More actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        )}
      </RadixDropdownMenu.Trigger>

      <RadixDropdownMenu.Portal>
        <RadixDropdownMenu.Content
          align={align}
          sideOffset={6}
          className="z-50 min-w-[180px] overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 text-slate-900 shadow-dropdown animate-fade-in"
        >
          {items.map((item, idx) => (
            <RadixDropdownMenu.Item
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                item.onClick();
              }}
              className={clsx(
                'flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium cursor-pointer outline-none transition-colors',
                item.variant === 'danger'
                  ? 'text-rose-600 hover:bg-rose-50 data-[highlighted]:bg-rose-50'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 data-[highlighted]:bg-slate-100'
              )}
            >
              {item.icon && <span className="shrink-0 w-4 h-4">{item.icon}</span>}
              <span>{item.label}</span>
            </RadixDropdownMenu.Item>
          ))}
        </RadixDropdownMenu.Content>
      </RadixDropdownMenu.Portal>
    </RadixDropdownMenu.Root>
  );
};
