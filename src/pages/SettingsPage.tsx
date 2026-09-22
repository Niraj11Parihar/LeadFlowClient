import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import {
  BuildingIcon as Building,
  UsersIcon as Users,
  LockIcon as Key,
  CheckIcon as Check,
  BellIcon as Bell,
} from '../assets/SVGicons';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'team' | 'api' | 'notifications'>('general');
  const [saved, setSaved] = useState(false);

  const [workspaceName, setWorkspaceName] = useState('LeadFlow Global HQ');
  const [currency, setCurrency] = useState('INR');
  const [timezone, setTimezone] = useState('IST');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">Workspace Settings</h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Manage CRM workspace parameters, team member permissions, and integration keys.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200/80 pb-3">
        {[
          { id: 'general', label: 'General & Currency', icon: <Building className="w-4 h-4" /> },
          { id: 'team', label: 'Team Members', icon: <Users className="w-4 h-4" /> },
          { id: 'api', label: 'API Keys & Webhooks', icon: <Key className="w-4 h-4" /> },
          { id: 'notifications', label: 'Email Notifications', icon: <Bell className="w-4 h-4" /> },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-brand-50 text-brand-700 border border-brand-200/80 shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Settings updated successfully!</span>
        </div>
      )}

      {/* Tab Contents */}
      {activeTab === 'general' && (
        <Card className="p-6 space-y-6">
          <form onSubmit={handleSave} className="space-y-5 max-w-xl">
            <h3 className="text-sm font-bold text-neutral-900 border-b border-neutral-100 pb-2">
              Workspace Profile
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700">Workspace Name</label>
              <Input
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700">Default Currency</label>
                <Select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  options={[
                    { label: 'INR (₹)', value: 'INR' },
                    { label: 'USD ($)', value: 'USD' },
                    { label: 'EUR (€)', value: 'EUR' },
                  ]}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700">Timezone</label>
                <Select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  options={[
                    { label: 'Asia/Kolkata (IST +5:30)', value: 'IST' },
                    { label: 'America/New_York (EST -5:00)', value: 'EST' },
                    { label: 'Europe/London (GMT +0:00)', value: 'GMT' },
                  ]}
                />
              </div>
            </div>

            <Button type="submit" size="sm" className="mt-4">
              Save Changes
            </Button>
          </form>
        </Card>
      )}

      {activeTab === 'team' && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Team Members & Access Control</h3>
              <p className="text-xs text-neutral-500">Manage who has access to your workspace</p>
            </div>
            <Button size="sm" icon={<Users className="w-3.5 h-3.5" />}>
              Invite Member
            </Button>
          </div>

          <div className="divide-y divide-neutral-100 border border-neutral-200/80 rounded-xl overflow-hidden">
            {[
              { name: 'Admin User', email: 'admin@leadflow.io', role: 'Owner', badgeBg: 'bg-brand-50 text-brand-700' },
              { name: 'Sales Rep 1', email: 'rep1@leadflow.io', role: 'Sales Rep', badgeBg: 'bg-neutral-100 text-neutral-700' },
              { name: 'Sales Manager', email: 'manager@leadflow.io', role: 'Manager', badgeBg: 'bg-purple-50 text-purple-700' },
            ].map((member) => (
              <div key={member.email} className="p-3.5 bg-white flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-neutral-900">{member.name}</div>
                  <div className="text-[11px] text-neutral-500">{member.email}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${member.badgeBg}`}>
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'api' && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-neutral-900">Developer API Keys</h3>
              <p className="text-xs text-neutral-500">Keys for programmatic lead ingestion and webhooks</p>
            </div>
            <Button size="sm" variant="outline">
              Generate New Key
            </Button>
          </div>

          <div className="bg-surface-subtle p-3.5 border border-neutral-200/80 rounded-xl font-mono text-xs text-neutral-700 flex items-center justify-between">
            <span>lf_live_9a87f6e5d4c3b2a10987654321</span>
            <span className="text-[11px] text-neutral-400 font-sans">Active (Full Access)</span>
          </div>
        </Card>
      )}

      {activeTab === 'notifications' && (
        <Card className="p-6 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900">Email Alerts & Reminders</h3>
          <div className="space-y-3">
            {[
              { title: 'Daily Follow-up Digest', desc: 'Receive morning email listing tasks due today', defaultChecked: true },
              { title: 'New Lead Ingestion Alerts', desc: 'Instant notification when a lead registers', defaultChecked: true },
              { title: 'Overdue Deal Reminders', desc: 'Notify when follow-ups miss scheduled timeline', defaultChecked: false },
            ].map((item, idx) => (
              <label key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-neutral-200/80 bg-white cursor-pointer hover:bg-neutral-50/50">
                <input type="checkbox" defaultChecked={item.defaultChecked} className="mt-0.5 rounded border-neutral-300 text-brand-600 focus:ring-brand-500" />
                <div>
                  <div className="text-xs font-bold text-neutral-900">{item.title}</div>
                  <div className="text-[11px] text-neutral-500">{item.desc}</div>
                </div>
              </label>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
