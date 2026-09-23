import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../features/auth/api/authApi';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import {
  ZapIcon as Zap,
  UserIcon as User,
  MailIcon as Mail,
  LockIcon as Lock,
  AlertCircleIcon as AlertCircle,
  EyeIcon as Eye,
  EyeOffIcon as EyeOff,
  LayersIcon as Layers,
  ClockIcon as Clock,
  CheckCircleIcon as CheckCircle,
} from '../assets/SVGicons';

const registerSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ['confirmPassword'],
});

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [token, navigate]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationResult = registerSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0]?.message || 'Invalid registration details';
      setError(firstError);
      return;
    }

    setIsLoading(true);

    try {
      await authApi.register(name, email, password);
      navigate('/auth/login', {
        state: {
          registered: true,
          email,
          message: 'Your account was created successfully! Please sign in with your password to continue.',
        },
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl bg-slate-900/80 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10 backdrop-blur-xl">
        <div className="lg:col-span-6 p-6 sm:p-8 lg:p-12 bg-gradient-to-br from-slate-900 via-brand-950/40 to-purple-950/40 border-b lg:border-b-0 lg:border-r border-slate-800/80 flex flex-col justify-between relative">
          <div>
            <div className="inline-flex items-center gap-2.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-[11px] sm:text-xs font-semibold mb-4 sm:mb-8">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current text-brand-400" />
              <span>Start Free with LeadFlow</span>
            </div>

            <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Turn your prospects into <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-purple-400 to-pink-400">loyal customers.</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 sm:mt-3 leading-relaxed">
              Join sales teams who use LeadFlow to track deal stages, schedule client follow-ups, and hit revenue targets.
            </p>

            <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3 sm:gap-3.5 p-2.5 sm:p-3 rounded-xl bg-slate-800/40 border border-slate-800/80 hover:border-slate-700/80 transition-all">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Zero Setup Friction</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 hidden sm:block">Create your workspace in seconds and start adding leads instantly.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-3.5 p-2.5 sm:p-3 rounded-xl bg-slate-800/40 border border-slate-800/80 hover:border-slate-700/80 transition-all">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Visual Sales Pipelines</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 hidden sm:block">Switch between interactive Kanban boards and filterable data tables.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-3.5 p-2.5 sm:p-3 rounded-xl bg-slate-800/40 border border-slate-800/80 hover:border-slate-700/80 transition-all">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Smart Activity Timeline</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 hidden sm:block">Keep a complete historical log of calls, emails, and completed follow-ups.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-800/80 flex items-center justify-between text-slate-400 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="font-semibold text-slate-300 text-[11px] sm:text-xs">Secure JWT Authentication</span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-slate-500">Fast & Confidential</span>
          </div>
        </div>

        <div className="lg:col-span-6 p-6 sm:p-10 lg:p-12 bg-white flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Create your LeadFlow account</h2>
              <p className="text-xs text-slate-500 mt-1">Fill in your details below to register your account</p>
            </div>

            {error && (
              <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-700 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Full name"
                placeholder="Niraj Parihar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<User className="w-4 h-4" />}
                required
              />

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
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
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
                minLength={6}
              />

              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none transition-colors cursor-pointer"
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                required
                minLength={6}
              />

              <Button type="submit" className="w-full h-11 text-sm font-bold mt-2" isLoading={isLoading}>
                Create Account & Proceed to Sign In
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Already have an account?{' '}
                <Link to="/auth/login" className="font-bold text-brand-600 hover:text-brand-700 hover:underline">
                  Sign in instead
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

