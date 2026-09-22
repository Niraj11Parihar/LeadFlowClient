import React, { useState, useEffect } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { CalendarIcon, ChevronLeftIcon as ChevronLeft, ChevronRightIcon as ChevronRight, ClockIcon as Clock, XIcon as X } from '../../assets/SVGicons';
import { Button } from './Button';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface DateTimePickerProps {
  label?: string;
  value?: string;
  onChange?: (val: string) => void;
  error?: string;
  placeholder?: string;
  className?: string;
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  label,
  value,
  onChange,
  error,
  placeholder = 'Select date & time...',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const initialDate = value ? new Date(value) : new Date();
  const isValidInitial = value && !isNaN(initialDate.getTime());

  const [viewDate, setViewDate] = useState<Date>(isValidInitial ? initialDate : new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(isValidInitial ? initialDate : null);
  const [selectedHour, setSelectedHour] = useState<number>(isValidInitial ? initialDate.getHours() : 10);
  const [selectedMinute, setSelectedMinute] = useState<number>(
    isValidInitial ? Math.floor(initialDate.getMinutes() / 15) * 15 : 0
  );

  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setSelectedDate(d);
        setViewDate(d);
        setSelectedHour(d.getHours());
        setSelectedMinute(Math.floor(d.getMinutes() / 15) * 15);
      }
    }
  }, [value]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const handleSelectDay = (day: number) => {
    const newD = new Date(year, month, day, selectedHour, selectedMinute);
    setSelectedDate(newD);
    emitChange(newD);
  };

  const handleTimeChange = (hour: number, minute: number) => {
    setSelectedHour(hour);
    setSelectedMinute(minute);
    if (selectedDate) {
      const newD = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), hour, minute);
      setSelectedDate(newD);
      emitChange(newD);
    }
  };

  const emitChange = (d: Date) => {
    const pad = (n: number) => (n < 10 ? '0' + n : n);
    const isoString = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    if (onChange) {
      onChange(isoString);
    }
  };

  const handleClear = () => {
    setSelectedDate(null);
    if (onChange) onChange('');
    setIsOpen(false);
  };

  const formatDisplay = (d: Date | null) => {
    if (!d) return '';
    return d.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const hoursList = Array.from({ length: 24 }, (_, i) => i);
  const minutesList = [0, 15, 30, 45];

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-[14px] font-semibold text-slate-700 tracking-normal">
          {label}
        </label>
      )}

      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            className={twMerge(
              clsx(
                'w-full h-11 px-3.5 bg-white text-slate-900 text-[15px] rounded-lg border border-slate-200 flex items-center justify-between transition-all hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 cursor-pointer shadow-xs',
                error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
                className
              )
            )}
          >
            <div className="flex items-center gap-2 truncate">
              <CalendarIcon className="w-4 h-4 text-slate-400 shrink-0" />
              <span className={selectedDate ? 'text-slate-900 font-medium' : 'text-slate-400'}>
                {selectedDate ? formatDisplay(selectedDate) : placeholder}
              </span>
            </div>
            {selectedDate && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-3.5 h-3.5" />
              </span>
            )}
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            sideOffset={6}
            align="start"
            className="z-50 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-dropdown animate-fade-in text-slate-900"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-semibold text-slate-900">
                {monthNames[month]} {year}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center py-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                <span key={d} className="text-[11px] font-semibold text-slate-400 uppercase">
                  {d}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 text-center">
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isSelected =
                  selectedDate &&
                  selectedDate.getDate() === day &&
                  selectedDate.getMonth() === month &&
                  selectedDate.getFullYear() === year;

                const isToday =
                  new Date().getDate() === day &&
                  new Date().getMonth() === month &&
                  new Date().getFullYear() === year;

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleSelectDay(day)}
                    className={clsx(
                      'h-8 w-8 rounded-lg text-xs font-medium transition-colors flex items-center justify-center mx-auto cursor-pointer',
                      isSelected
                        ? 'bg-brand-600 text-white font-semibold shadow-xs'
                        : isToday
                          ? 'bg-brand-50 text-brand-600 font-bold border border-brand-200'
                          : 'text-slate-700 hover:bg-slate-100'
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-slate-600 font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Time:</span>
              </div>

              <div className="flex items-center gap-1">
                <select
                  value={selectedHour}
                  onChange={(e) => handleTimeChange(Number(e.target.value), selectedMinute)}
                  className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-500"
                >
                  {hoursList.map((h) => (
                    <option key={h} value={h}>
                      {h < 10 ? '0' + h : h}:00
                    </option>
                  ))}
                </select>

                <span>:</span>

                <select
                  value={selectedMinute}
                  onChange={(e) => handleTimeChange(selectedHour, Number(e.target.value))}
                  className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-500"
                >
                  {minutesList.map((m) => (
                    <option key={m} value={m}>
                      {m < 10 ? '0' + m : m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium"
              >
                Clear
              </button>
              <Button size="sm" onClick={() => setIsOpen(false)}>
                Done
              </Button>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
    </div>
  );
};
