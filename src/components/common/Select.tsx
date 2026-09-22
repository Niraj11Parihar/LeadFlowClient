import { forwardRef } from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import { ChevronDownIcon as ChevronDown, CheckIcon as Check } from '../../assets/SVGicons';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (e: { target: { name?: string; value: string } }) => void;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  name?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      label,
      options,
      value,
      defaultValue,
      onChange,
      onValueChange,
      placeholder = 'Select option...',
      error,
      name,
      disabled = false,
      className,
      id,
    },
    ref
  ) => {
    const handleValueChange = (val: string) => {
      if (onValueChange) {
        onValueChange(val);
      }
      if (onChange) {
        onChange({ target: { name, value: val } });
      }
    };

    const currentValue = value !== undefined ? value : defaultValue;
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-[14px] font-semibold text-slate-700 tracking-normal">
            {label}
          </label>
        )}
        <RadixSelect.Root
          value={currentValue}
          onValueChange={handleValueChange}
          disabled={disabled}
        >
          <RadixSelect.Trigger
            id={selectId}
            ref={ref}
            className={twMerge(
              clsx(
                'w-full h-11 px-3.5 bg-white text-slate-900 text-[15px] rounded-lg border border-slate-200 flex items-center justify-between transition-all focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed cursor-pointer shadow-xs hover:border-slate-300',
                error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
                className
              )
            )}
          >
            <RadixSelect.Value placeholder={placeholder} />
            <RadixSelect.Icon className="text-slate-400 shrink-0 ml-2">
              <ChevronDown className="w-4 h-4" />
            </RadixSelect.Icon>
          </RadixSelect.Trigger>

          <RadixSelect.Portal>
            <RadixSelect.Content
              position="popper"
              sideOffset={6}
              className="z-50 w-[var(--radix-select-trigger-width)] max-h-64 overflow-hidden rounded-xl border border-slate-200 bg-white text-slate-900 shadow-dropdown animate-fade-in"
            >
              <RadixSelect.Viewport className="p-1.5">
                {options.map((option) => (
                  <RadixSelect.Item
                    key={option.value}
                    value={option.value}
                    className="relative flex w-full cursor-pointer select-none items-center rounded-md py-2.5 pl-9 pr-3 text-[14px] text-slate-800 outline-none hover:bg-slate-100 hover:text-slate-900 data-[highlighted]:bg-slate-100 data-[highlighted]:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors"
                  >
                    <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                    <RadixSelect.ItemIndicator className="absolute left-2.5 flex items-center justify-center text-brand-600">
                      <Check className="w-4 h-4" />
                    </RadixSelect.ItemIndicator>
                  </RadixSelect.Item>
                ))}
              </RadixSelect.Viewport>
            </RadixSelect.Content>
          </RadixSelect.Portal>
        </RadixSelect.Root>
        {error && <p className="text-[12px] text-rose-600 font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
