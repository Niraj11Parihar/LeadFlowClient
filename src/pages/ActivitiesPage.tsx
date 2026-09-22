import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  ClockIcon as Clock,
  PlusIcon as Plus,
  EditIcon as Edit,
  CalendarIcon as Calendar,
  BuildingIcon as Building,
  SearchIcon as Search,
} from '../assets/SVGicons';
import { leadApi } from '../features/leads/api/leadApi';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Loader } from '../components/common/Loader';
import { Badge } from '../components/common/Badge';

export const ActivitiesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['leads', { limit: 100 }],
    queryFn: () => leadApi.getLeads({ limit: 100 }),
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
  };

  const leads = data?.data || [];

  // Transform leads into simulated audit stream entries (e.g. Lead creation, Stage updates, Follow-ups)
  const activities = leads.flatMap((lead) => {
    const items = [];

    // Created event
    items.push({
      id: `create-${lead.id}`,
      leadId: lead.id,
      leadName: lead.name,
      company: lead.company,
      stage: lead.stage,
      type: 'CREATED',
      title: `Lead "${lead.name}" created`,
      description: `New lead added via ${lead.source || 'Direct Entry'}`,
      timestamp: lead.createdAt,
      icon: <Plus className="w-4.5 h-4.5 text-emerald-600" />,
      badgeBg: 'bg-emerald-50 border-emerald-200/80',
    });

    // Stage activity event
    if (lead.stage !== 'NEW') {
      items.push({
        id: `stage-${lead.id}`,
        leadId: lead.id,
        leadName: lead.name,
        company: lead.company,
        stage: lead.stage,
        type: 'STAGE_CHANGE',
        title: `Stage updated to ${lead.stage}`,
        description: `Lead moved forward in sales pipeline`,
        timestamp: lead.updatedAt || lead.createdAt,
        icon: <Edit className="w-4.5 h-4.5 text-brand-600" />,
        badgeBg: 'bg-brand-50 border-brand-200/80',
      });
    }

    // Follow-up scheduled event
    if (lead.nextFollowUpAt || lead.followUpAt) {
      items.push({
        id: `followup-${lead.id}`,
        leadId: lead.id,
        leadName: lead.name,
        company: lead.company,
        stage: lead.stage,
        type: 'FOLLOW_UP',
        title: `Follow-up task scheduled`,
        description: lead.notes || 'Scheduled client call/email',
        timestamp: lead.nextFollowUpAt || lead.followUpAt,
        icon: <Calendar className="w-4.5 h-4.5 text-purple-600" />,
        badgeBg: 'bg-purple-50 border-purple-200/80',
      });
    }

    return items;
  }).sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime());

  let filteredActivities = activities;
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filteredActivities = activities.filter(
      (a) =>
        a.leadName.toLowerCase().includes(q) ||
        (a.company && a.company.toLowerCase().includes(q)) ||
        a.title.toLowerCase().includes(q)
    );
  }

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'Recently';
    return new Date(dateStr).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-1 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">Global Activity Stream</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Real-time audit log of all deal movements, status updates, and logged touchpoints.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex-1 sm:w-[240px]">
            <Input
              placeholder="Search activity stream..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              icon={<Search className="w-4 h-4" />}
              className="w-full"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm" className="h-9 px-3 shrink-0">
            Filter
          </Button>
        </form>
      </div>

      {isLoading ? (
        <Card className="p-12 flex justify-center items-center">
          <Loader label="Loading audit log..." />
        </Card>
      ) : filteredActivities.length === 0 ? (
        <Card className="p-12 text-center text-neutral-500 text-sm">
          No activities found matching your query.
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredActivities.slice(0, 30).map((act) => (
            <Card
              key={act.id}
              onClick={() => navigate(`/leads/${act.leadId}`)}
              className="hover:border-neutral-300 transition-all cursor-pointer p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                <div className={`w-10 h-10 rounded-xl border ${act.badgeBg} flex items-center justify-center shrink-0 shadow-2xs`}>
                  {act.icon}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-xs sm:text-sm text-neutral-900">{act.title}</span>
                    <Badge stage={act.stage} className="scale-90 shrink-0" />
                  </div>
                  <p className="text-xs text-neutral-600 line-clamp-2">{act.description}</p>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-400 pt-0.5">
                    <span className="font-medium text-neutral-700">{act.leadName}</span>
                    {act.company && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          <span>{act.company}</span>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-row items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100 shrink-0">
                <div className="flex items-center gap-1 text-[11px] text-neutral-400 font-medium shrink-0">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(act.timestamp)}</span>
                </div>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/leads/${act.leadId}`);
                  }}
                  className="h-10 px-4 py-2 text-xs font-semibold text-neutral-800 bg-white border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 shadow-2xs rounded-lg transition-all shrink-0 whitespace-nowrap"
                >
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
