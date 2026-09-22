import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { Button } from '../../../components/common/Button';
import { DateTimePicker } from '../../../components/common/DateTimePicker';
import type { Lead } from '../../../types';
import {
  UserIcon as User,
  MailIcon as Mail,
  PhoneIcon as Phone,
  BuildingIcon as Building,
  CalendarIcon as Calendar,
  FileTextIcon as FileText,
  LayersIcon as Layers,
} from '../../../assets/SVGicons';

const leadFormSchema = z.object({
  name: z.string().min(1, 'Lead name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().optional(),
  company: z.string().optional(),
  source: z.string().optional(),
  stage: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'WON', 'LOST'] as const),
  followUpAt: z.string().optional(),
  notes: z.string().optional(),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;

interface LeadFormProps {
  initialData?: Lead;
  onSubmit: (data: LeadFormData) => void;
  isLoading?: boolean;
  onCancel: () => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
  onCancel,
}) => {
  const formatInitialDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    const pad = (n: number) => (n < 10 ? '0' + n : n);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      company: initialData?.company || '',
      source: initialData?.source || 'Website',
      stage: initialData?.stage || 'NEW',
      followUpAt: formatInitialDate(initialData?.followUpAt),
      notes: initialData?.notes || '',
    },
  });

  const stageOptions = [
    { value: 'NEW', label: 'New' },
    { value: 'CONTACTED', label: 'Contacted' },
    { value: 'QUALIFIED', label: 'Qualified' },
    { value: 'WON', label: 'Won' },
    { value: 'LOST', label: 'Lost' },
  ];

  const sourceOptions = [
    { value: 'Website', label: 'Website' },
    { value: 'LinkedIn', label: 'LinkedIn' },
    { value: 'Referral', label: 'Referral' },
    { value: 'Cold Outbound', label: 'Cold Outbound' },
    { value: 'Trade Show', label: 'Trade Show' },
    { value: 'Webinar', label: 'Webinar' },
    { value: 'Partner', label: 'Partner' },
    { value: 'Other', label: 'Other' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-600 border border-blue-100 flex items-center justify-center shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Contact information</h3>
            <p className="text-[13px] text-slate-500">Essential contact and organizational details for this lead</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
          <Input
            label="Lead name *"
            placeholder="e.g. Rahul Shah"
            icon={<User className="w-4 h-4" />}
            error={errors.name?.message}
            {...register('name')}
          />

          <Input
            label="Company name"
            placeholder="e.g. ABC Technologies"
            icon={<Building className="w-4 h-4" />}
            error={errors.company?.message}
            {...register('company')}
          />

          <Input
            label="Email address"
            type="email"
            placeholder="rahul@example.com"
            icon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Phone number"
            placeholder="+91 98765 43210"
            icon={<Phone className="w-4 h-4" />}
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Pipeline & stage</h3>
            <p className="text-[13px] text-slate-500">Track deal progress and lead origin</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
          <Controller
            name="stage"
            control={control}
            render={({ field }) => (
              <Select
                label="Lead stage *"
                options={stageOptions}
                value={field.value}
                onValueChange={field.onChange}
                error={errors.stage?.message}
              />
            )}
          />

          <Controller
            name="source"
            control={control}
            render={({ field }) => (
              <Select
                label="Lead source"
                options={sourceOptions}
                value={field.value}
                onValueChange={field.onChange}
                error={errors.source?.message}
              />
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Follow-up schedule</h3>
            <p className="text-[13px] text-slate-500">Set reminder for next interaction or meeting</p>
          </div>
        </div>

        <div className="max-w-md pt-1">
          <Controller
            name="followUpAt"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                label="Follow-up date & time"
                value={field.value}
                onChange={field.onChange}
                error={errors.followUpAt?.message}
              />
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">Additional information</h3>
            <p className="text-[13px] text-slate-500">Contextual notes, requirements, or meeting outcome</p>
          </div>
        </div>

        <div className="pt-1">
          <label className="block text-[14px] font-semibold text-slate-700 tracking-normal mb-1.5">
            Notes & details
          </label>
          <textarea
            rows={4}
            placeholder="Add background notes, meeting discussions, or next action items..."
            className="w-full rounded-lg border border-slate-200 bg-white p-3.5 text-[15px] text-slate-900 transition-all placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 shadow-xs hover:border-slate-300"
            {...register('notes')}
          />
          {errors.notes?.message && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.notes.message}</p>}
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-slate-200">
        <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
          {initialData ? 'Save changes' : 'Create lead'}
        </Button>
      </div>
    </form>
  );
};
