import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Lead, LeadStage } from '../../../types';
import { DropdownMenu } from '../../../components/common/DropdownMenu';
import {
  BuildingIcon as Building,
  CalendarIcon as Calendar,
  EyeIcon as Eye,
  EditIcon as Edit,
  TrashIcon as Trash2,
} from '../../../assets/SVGicons';

interface KanbanBoardProps {
  leads: Lead[];
  onStageChange: (leadId: string, newStage: LeadStage) => void;
  onDeleteLead: (leadId: string) => void;
}

const STAGES: { stage: LeadStage; label: string; headerBg: string; borderAccent: string }[] = [
  { stage: 'NEW', label: 'New Leads', headerBg: 'bg-neutral-100 text-neutral-800', borderAccent: 'border-neutral-300' },
  { stage: 'CONTACTED', label: 'Contacted', headerBg: 'bg-brand-50 text-brand-800', borderAccent: 'border-brand-300' },
  { stage: 'QUALIFIED', label: 'Qualified', headerBg: 'bg-purple-50 text-purple-800', borderAccent: 'border-purple-300' },
  { stage: 'WON', label: 'Won Deals', headerBg: 'bg-emerald-50 text-emerald-800', borderAccent: 'border-emerald-300' },
  { stage: 'LOST', label: 'Lost Deals', headerBg: 'bg-rose-50 text-rose-800', borderAccent: 'border-rose-300' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ leads, onStageChange, onDeleteLead }) => {
  const navigate = useNavigate();
  const [draggedOverStage, setDraggedOverStage] = useState<LeadStage | null>(null);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('text/plain', leadId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, stage: LeadStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (draggedOverStage !== stage) {
      setDraggedOverStage(stage);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedOverStage(null);
  };

  const handleDrop = (e: React.DragEvent, targetStage: LeadStage) => {
    e.preventDefault();
    setDraggedOverStage(null);
    const leadId = e.dataTransfer.getData('text/plain');
    if (leadId) {
      onStageChange(leadId, targetStage);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start min-h-[600px] overflow-x-auto pb-4 custom-scrollbar">
      {STAGES.map(({ stage, label, headerBg, borderAccent }) => {
        const columnLeads = leads.filter((l) => l.stage === stage);
        const isTarget = draggedOverStage === stage;

        return (
          <div
            key={stage}
            onDragOver={(e) => handleDragOver(e, stage)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage)}
            className={`flex flex-col rounded-2xl bg-surface-subtle border ${isTarget ? 'border-brand-500 ring-2 ring-brand-500/20 bg-brand-50/20' : 'border-neutral-200/80'
              } p-3 transition-all min-h-[500px] shadow-xs`}
          >
            {/* Column Header */}
            <div className={`flex items-center justify-between px-3 py-2 rounded-xl ${headerBg} border ${borderAccent} mb-3 shrink-0`}>
              <span className="text-xs font-bold tracking-tight">{label}</span>
              <span className="px-2 py-0.5 text-[11px] font-extrabold rounded-md bg-white/80 text-neutral-800 shadow-2xs">
                {columnLeads.length}
              </span>
            </div>

            {/* Cards List */}
            <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-0.5">
              {columnLeads.length === 0 ? (
                <div className="h-32 rounded-xl border border-dashed border-neutral-200 flex items-center justify-center text-[11px] text-neutral-400 font-medium text-center px-4">
                  Drag leads here
                </div>
              ) : (
                columnLeads.map((lead) => {
                  const initials = lead.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
                  const formattedNextDate = formatDate(lead.nextFollowUpAt || lead.followUpAt);

                  return (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      onClick={() => navigate(`/leads/${lead.id}`)}
                      className="bg-white rounded-xl border border-neutral-200/90 p-3.5 shadow-xs hover:shadow-card hover:border-neutral-300 transition-all cursor-grab active:cursor-grabbing space-y-3 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 font-extrabold text-[10px] shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-neutral-900 truncate group-hover:text-brand-600 transition-colors">
                              {lead.name}
                            </h4>
                            <p className="text-[11px] font-medium text-neutral-500 truncate flex items-center gap-1">
                              <Building className="w-3 h-3 text-neutral-400 shrink-0" />
                              <span>{lead.company || 'Individual'}</span>
                            </p>
                          </div>
                        </div>

                        <div onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu
                            items={[
                              {
                                label: 'View Profile',
                                icon: <Eye className="w-3.5 h-3.5" />,
                                onClick: () => navigate(`/leads/${lead.id}`),
                              },
                              {
                                label: 'Edit Lead',
                                icon: <Edit className="w-3.5 h-3.5" />,
                                onClick: () => navigate(`/leads/${lead.id}/edit`),
                              },
                              {
                                label: 'Delete Lead',
                                icon: <Trash2 className="w-3.5 h-3.5" />,
                                variant: 'danger',
                                onClick: () => onDeleteLead(lead.id),
                              },
                            ]}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-[11px]">
                        {formattedNextDate ? (
                          <div className="flex items-center gap-1 text-brand-700 font-semibold bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200/60">
                            <Calendar className="w-3 h-3 text-brand-600" />
                            <span>{formattedNextDate}</span>
                          </div>
                        ) : (
                          <span className="text-neutral-400 italic">No schedule</span>
                        )}

                        {lead.source && (
                          <span className="text-[10px] font-semibold text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded-md">
                            {lead.source}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
