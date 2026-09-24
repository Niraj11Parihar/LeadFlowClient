import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  BuildingIcon as Building,
  SearchIcon as Search,
  UsersIcon as Users,
} from '../assets/SVGicons';
import { leadApi } from '../features/leads/api/leadApi';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Loader } from '../components/common/Loader';
import { Badge } from '../components/common/Badge';

export const CompaniesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['leads', { limit: 100 }],
    queryFn: () => leadApi.getLeads({ limit: 100 }),
  });

  // Group leads by company name
  const companiesMap = (data?.data || []).reduce((acc, lead) => {
    const compName = lead.company?.trim() || 'Individual Accounts';
    if (!acc[compName]) {
      acc[compName] = {
        name: compName,
        isIndividual: compName === 'Individual Accounts',
        leads: [],
      };
    }
    acc[compName].leads.push(lead);
    return acc;
  }, {} as Record<string, { name: string; isIndividual: boolean; leads: typeof data.data }>);

  let companiesList = Object.values(companiesMap);

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    companiesList = companiesList.filter((c) =>
      c.name.toLowerCase().includes(q) || c.leads.some((l) => l.name.toLowerCase().includes(q))
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">Companies & Accounts</h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Overview of client organizations and associated lead contacts.
          </p>
        </div>

        <div className="w-full sm:w-[280px]">
          <Input
            placeholder="Search companies..."
            value={searchInput}
            onChange={(e) => {
              const val = e.target.value;
              setSearchInput(val);
              setSearchQuery(val);
            }}
            icon={<Search className="w-4 h-4" />}
            className="w-full h-10 text-xs"
          />
        </div>
      </div>

      {isLoading ? (
        <Card className="p-12 flex justify-center items-center">
          <Loader label="Aggregating accounts..." />
        </Card>
      ) : companiesList.length === 0 ? (
        <Card className="p-12 text-center text-neutral-500 text-sm">
          No companies found matching your search.
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companiesList.map((comp) => {
            const totalLeads = comp.leads.length;
            const wonLeads = comp.leads.filter((l) => l.stage === 'WON').length;

            return (
              <Card
                key={comp.name}
                className="hover:border-neutral-300 transition-all cursor-pointer flex flex-col justify-between p-5 space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${comp.isIndividual ? 'bg-neutral-100 text-neutral-600' : 'bg-brand-50 text-brand-700 border border-brand-200/60'}`}>
                        {comp.isIndividual ? <Users className="w-5 h-5" /> : <Building className="w-5 h-5" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-neutral-900 text-sm hover:text-brand-600 transition-colors">
                          {comp.name}
                        </h3>
                        <p className="text-[11px] text-neutral-500 flex items-center gap-1.5 mt-0.5">
                          <span>{totalLeads} contact{totalLeads !== 1 ? 's' : ''}</span>
                          {wonLeads > 0 && (
                            <>
                              <span>·</span>
                              <span className="text-emerald-600 font-semibold">{wonLeads} won</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contacts preview */}
                  <div className="mt-4 pt-3 border-t border-neutral-100 space-y-2">
                    <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                      Lead Contacts ({comp.leads.length})
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                      {comp.leads.map((lead) => (
                        <div
                          key={lead.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/leads/${lead.id}`);
                          }}
                          className="flex items-center justify-between p-2 rounded-lg bg-surface-subtle hover:bg-neutral-100 transition-colors"
                        >
                          <div className="min-w-0 pr-2">
                            <div className="text-xs font-semibold text-neutral-800 truncate">{lead.name}</div>
                            <div className="text-[10px] text-neutral-400 flex items-center gap-2">
                              {lead.email && <span className="truncate max-w-[120px]">{lead.email}</span>}
                            </div>
                          </div>
                          <Badge stage={lead.stage} className="shrink-0 scale-90" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
