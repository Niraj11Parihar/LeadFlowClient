import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../features/auth/api/authApi';
import { hashPasswordClient } from '../utils/crypto';
import {
  UsersIcon as Users,
  CheckIcon as Check,
  BellIcon as Bell,
  UserIcon as User,
  AlertCircleIcon as AlertCircle,
  EyeIcon as Eye,
  EyeOffIcon as EyeOff,
} from '../assets/SVGicons';

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Please enter your current password'),
  newPassword: z.string()
    .min(8, 'New password must be at least 8 characters long')
    .regex(/[A-Z]/, 'New password must contain at least one uppercase letter (A-Z)')
    .regex(/[0-9]/, 'New password must contain at least one digit (0-9)')
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'New password must contain at least one special character (!@#$%^&*)'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords do not match",
  path: ['confirmPassword'],
});

export const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'team' | 'notifications'>('profile');

  // Profile Name state
  const [name, setName] = useState(user?.name || '');
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(null);
    setProfileError(null);

    if (!name.trim() || name.trim().length < 2) {
      setProfileError('Name must be at least 2 characters');
      return;
    }

    setIsUpdatingName(true);
    try {
      const updatedUser = await authApi.updateProfile(name.trim());
      updateUser(updatedUser);
      setProfileSuccess('Your profile name has been updated successfully!');
    } catch (err: any) {
      setProfileError(err.response?.data?.message || 'Failed to update profile name');
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(null);
    setPasswordError(null);

    const validationResult = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0]?.message || 'Invalid password details';
      setPasswordError(firstError);
      return;
    }

    setIsChangingPassword(true);
    try {
      const encryptedCurrent = await hashPasswordClient(currentPassword);
      const encryptedNew = await hashPasswordClient(newPassword);

      const res = await authApi.changePassword(encryptedCurrent, encryptedNew);
      setPasswordSuccess(res.message || 'Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.response?.data?.message || 'Failed to change password. Please check your current password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight">Account & Settings</h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
          Manage your personal profile, update security credentials, and configure notifications.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-neutral-200/80 pb-3">
        {[
          { id: 'profile', label: 'My Profile & Security', icon: <User className="w-4 h-4" /> },
          { id: 'team', label: 'Team Members', icon: <Users className="w-4 h-4" /> },
          { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${isActive
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

      {/* Profile & Security Tab */}
      {activeTab === 'profile' && (
        <div className="space-y-6 max-w-2xl">
          {/* Update Name Form Card */}
          <Card className="p-6 space-y-5">
            <div className="border-b border-neutral-100 pb-3">
              <h3 className="text-sm font-bold text-neutral-900">Personal Information</h3>
              <p className="text-xs text-neutral-500">Update your account name displayed across the workspace</p>
            </div>

            {profileSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateName} className="space-y-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<User className="w-4 h-4" />}
                required
              />

              <div className="space-y-1.5">
                <label className="block text-[14px] font-semibold text-slate-700 tracking-normal">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full h-11 px-3.5 bg-slate-50 text-slate-500 text-[15px] rounded-lg border border-slate-200 cursor-not-allowed"
                />
                <p className="text-[11px] text-slate-400">Email address cannot be changed directly.</p>
              </div>

              <Button type="submit" size="sm" isLoading={isUpdatingName}>
                Save Profile Name
              </Button>
            </form>
          </Card>

          {/* Change Password Form Card */}
          <Card className="p-6 space-y-5">
            <div className="border-b border-neutral-100 pb-3">
              <h3 className="text-sm font-bold text-neutral-900">Change Password</h3>
              <p className="text-xs text-neutral-500">Update your security password for dashboard access</p>
            </div>

            {passwordSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} noValidate className="space-y-4">
              <Input
                label="Current Password"
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                autoComplete="current-password"
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                required
              />

              <Input
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 8 chars, 1 upper, 1 digit, 1 special"
                autoComplete="new-password"
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                required
                minLength={8}
              />

              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                autoComplete="new-password"
                required
                minLength={6}
              />

              <Button type="submit" size="sm" isLoading={isChangingPassword}>
                Update Password
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* Team Tab */}
      {activeTab === 'team' && (
        <Card className="p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200/80 text-brand-600 mx-auto flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <span className="px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800 rounded-full inline-block">
            Coming Soon
          </span>
          <h3 className="text-base font-bold text-neutral-900">Team Collaboration & Access Control</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
            Multi-user team management, custom role permissions, and lead assignment rules will be available in an upcoming release!
          </p>
        </Card>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <Card className="p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200/80 text-purple-600 mx-auto flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
          <span className="px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800 rounded-full inline-block">
            Coming Soon
          </span>
          <h3 className="text-base font-bold text-neutral-900">Email Alerts & Follow-up Digests</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
            Automated morning task summaries, web push notifications, and overdue deal reminders will be available in an upcoming release!
          </p>
        </Card>
      )}
    </div>
  );
};
