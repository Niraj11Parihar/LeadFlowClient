import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../features/auth/api/authApi';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import {
  ZapIcon as Zap,
  MailIcon as Mail,
  LockIcon as Lock,
  AlertCircleIcon as AlertCircle,
  EyeIcon as Eye,
  EyeOffIcon as EyeOff,
  SparklesIcon as Sparkles,
  CheckCircleIcon as CheckCircle,
  TrendingUpIcon as TrendingUp,
  LayersIcon as Layers,
  ClockIcon as Clock,
} from '../assets/SVGicons';

import { hashPasswordClient } from '../utils/crypto';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [token, navigate]);

  useEffect(() => {
    if (location.state?.registered && location.state?.message) {
      setSuccessMessage(location.state.message);
      if (location.state.email) {
        setEmail(location.state.email);
      }
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const encryptedPassword = await hashPasswordClient(password);
      const data = await authApi.login(email, encryptedPassword);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to sign in. Please check credentials.');
    } finally {
      setPassword('');
      setIsLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail(import.meta.env.VITE_DEMO_EMAIL || 'niraj@example.com');
    setPassword(import.meta.env.VITE_DEMO_PASSWORD || 'password123');
  };

  return (
    <div className="min-h-screen lg:h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-3 sm:p-6 lg:p-6 relative overflow-x-hidden overflow-y-auto lg:overflow-hidden py-6 sm:py-8 lg:py-0">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-5xl bg-slate-900/80 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10 backdrop-blur-xl my-auto">
        <div className="lg:col-span-6 p-5 sm:p-8 lg:p-8 xl:p-10 bg-gradient-to-br from-slate-900 via-brand-950/40 to-purple-950/40 border-b lg:border-b-0 lg:border-r border-slate-800/80 flex flex-col justify-between relative">
          <div>
            <div className="inline-flex items-center gap-2.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-[11px] sm:text-xs font-semibold mb-3 sm:mb-8">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current text-brand-400" />
              <span>LeadFlow CRM Platform</span>
            </div>

            <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Streamline your leads & close deals <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-purple-400 to-pink-400">faster than ever.</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 sm:mt-3 leading-relaxed">
              Designed for modern sales teams to organize pipelines, automate outreach follow-ups, and monitor real-time conversion metrics.
            </p>

            <div className="mt-5 sm:mt-8 space-y-3 sm:space-y-4 hidden sm:block">
              <div className="flex items-start gap-3 sm:gap-3.5 p-2.5 sm:p-3 rounded-xl bg-slate-800/40 border border-slate-800/80 hover:border-slate-700/80 transition-all">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Kanban & Table Pipeline Management</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Seamlessly drag-and-drop deals across customized sales stages.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-3.5 p-2.5 sm:p-3 rounded-xl bg-slate-800/40 border border-slate-800/80 hover:border-slate-700/80 transition-all">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Automated Follow-Up Queue</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Never miss a prospect with overdue alerts and scheduled task queues.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-3.5 p-2.5 sm:p-3 rounded-xl bg-slate-800/40 border border-slate-800/80 hover:border-slate-700/80 transition-all">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Real-Time Revenue Analytics</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Interactive graphs for deal win ratios and stage volume distributions.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-800/80 flex items-end justify-end text-slate-400 text-xs hidden sm:flex">
            <span className="text-[10px] sm:text-[11px] text-slate-500">v1.0.0 Release</span>
          </div>
        </div>

        <div className="lg:col-span-6 p-5 sm:p-8 lg:p-8 xl:p-10 bg-white flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Sign in to LeadFlow</h2>
              <p className="text-xs text-slate-500 mt-1">Enter your credentials to access your sales workspace</p>
            </div>

            {successMessage && (
              <div className="mb-5 sm:mb-6 p-3.5 sm:p-4 bg-emerald-50 border border-emerald-200/90 rounded-xl flex items-start gap-3 text-xs text-emerald-800 font-medium shadow-xs">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-900">Registration Complete!</p>
                  <p className="mt-0.5 text-emerald-700">{successMessage}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-5 sm:mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-700 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <Input
                label="Email address"
                type="email"
                placeholder="niraj@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
                required
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                autoComplete="current-password"
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                required
              />

              <Button type="submit" className="w-full h-11 text-sm font-bold mt-2" isLoading={isLoading}>
                Sign in to Dashboard
              </Button>
            </form>

            <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-slate-100 space-y-4 text-center">
              <button
                onClick={fillDemoAccount}
                type="button"
                className="w-full h-10 px-3 bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Auto-fill Demo Account (Niraj)</span>
              </button>

              <p className="text-xs text-slate-500">
                Don't have an account yet?{' '}
                <Link to="/auth/register" className="font-bold text-brand-600 hover:text-brand-700 hover:underline">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

