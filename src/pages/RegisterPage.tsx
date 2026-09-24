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
import { hashPasswordClient } from '../utils/crypto';

const registerSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter (A-Z)')
    .regex(/[0-9]/, 'Password must contain at least one digit (0-9)')
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Password must contain at least one special character (!@#$%^&*)'),
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
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const validationResult = registerSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        if (field && !errors[field]) {
          errors[field] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      const encryptedPassword = await hashPasswordClient(password);
      await authApi.register(name, email, encryptedPassword);
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
      setPassword('');
      setConfirmPassword('');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-3 sm:p-6 lg:p-6 relative overflow-x-hidden overflow-y-auto lg:overflow-hidden py-6 sm:py-8 lg:py-0">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 right-1/4 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-5xl bg-slate-900/80 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10 backdrop-blur-xl my-auto">
        <div className="lg:col-span-6 p-5 sm:p-8 lg:p-8 xl:p-10 bg-gradient-to-br from-slate-900 via-brand-950/40 to-purple-950/40 border-b lg:border-b-0 lg:border-r border-slate-800/80 flex flex-col justify-between relative">
          <div>
            <div className="inline-flex items-center gap-2.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-400 text-[11px] sm:text-xs font-semibold mb-3 sm:mb-6">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current text-brand-400" />
              <span>Start Free with LeadFlow</span>
            </div>

            <h1 className="text-xl sm:text-3xl lg:text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Turn your prospects into <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-purple-400 to-pink-400">loyal customers.</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 sm:mt-2.5 leading-relaxed">
              Join sales teams who use LeadFlow to track deal stages, schedule client follow-ups, and hit revenue targets.
            </p>

            <div className="mt-4 sm:mt-6 space-y-2.5 sm:space-y-3 hidden sm:block">
              <div className="flex items-start gap-3 sm:gap-3.5 p-2.5 sm:p-3 rounded-xl bg-slate-800/40 border border-slate-800/80 hover:border-slate-700/80 transition-all">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Zero Setup Friction</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Create your workspace in seconds and start adding leads instantly.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-3.5 p-2.5 sm:p-3 rounded-xl bg-slate-800/40 border border-slate-800/80 hover:border-slate-700/80 transition-all">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Visual Sales Pipelines</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Switch between interactive Kanban boards and filterable data tables.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-3.5 p-2.5 sm:p-3 rounded-xl bg-slate-800/40 border border-slate-800/80 hover:border-slate-700/80 transition-all">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Smart Activity Timeline</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Keep a complete historical log of calls, emails, and completed follow-ups.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-800/80 flex items-end justify-end text-slate-400 text-xs hidden sm:flex">
            <span className="text-[10px] sm:text-[11px] text-slate-500">Fast & Confidential</span>
          </div>
        </div>

        <div className="lg:col-span-6 p-5 sm:p-8 lg:p-8 xl:p-10 bg-white flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-4 sm:mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Create your LeadFlow account</h2>
              <p className="text-xs text-slate-500 mt-1">Fill in your details below to register your account</p>
            </div>

            {error && (
              <div className="mb-5 sm:mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-700 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-3 sm:space-y-3.5">
              <Input
                label="Full name"
                placeholder="Niraj Parihar"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }));
                }}
                icon={<User className="w-4 h-4" />}
                error={fieldErrors.name}
              />

              <Input
                label="Email address"
                type="email"
                placeholder="niraj@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }}
                icon={<Mail className="w-4 h-4" />}
                error={fieldErrors.email}
              />

              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Min 8 chars, 1 upper, 1 digit, 1 special"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
                }}
                icon={<Lock className="w-4 h-4" />}
                autoComplete="new-password"
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
                error={fieldErrors.password}
              />

              <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (fieldErrors.confirmPassword) setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                }}
                icon={<Lock className="w-4 h-4" />}
                autoComplete="new-password"
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
                error={fieldErrors.confirmPassword}
              />

              <Button type="submit" className="w-full h-10 sm:h-11 text-sm font-bold mt-1.5" isLoading={isLoading}>
                Create Account & Proceed to Sign In
              </Button>
            </form>

            <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-slate-100 text-center">
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

