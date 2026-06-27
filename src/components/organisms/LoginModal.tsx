import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type LoginFormData = z.infer<typeof loginSchema>;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister?: () => void;
  onForgotPassword?: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSwitchToRegister, onForgotPassword }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, error, clearError } = useAuth();

  const { register, handleSubmit, formState: { errors, isValid }, reset } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur'
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      clearError();
      await login(data.email, data.password);
      reset();
      onClose();
    } catch {
      setIsLoading(false);
    }
  };

  const handleClose = () => { reset(); clearError(); onClose(); };
  const handleSwitchToRegister = () => { reset(); clearError(); onSwitchToRegister?.(); };

  const demoCredentials = [
    { label: 'Admin', email: 'admin@quickbite.com', password: 'admin123', color: 'from-purple-500 to-violet-600' },
    { label: 'Customer', email: 'user@example.com', password: 'user123', color: 'from-primary to-orange-500' },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top decorative gradient bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-orange-400 to-amber-400 flex-shrink-0" />

            {/* Ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/10 blur-3xl pointer-events-none" />

            <div className="p-8 relative overflow-y-auto custom-scrollbar">
              {/* Logo & Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                  className="w-16 h-16 mx-auto mb-5 relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-orange-500 rounded-2xl opacity-20 blur-md" />
                  <img src="/logo.png" alt="QuickBite Pro" className="w-16 h-16 rounded-2xl object-contain relative z-10 shadow-lg" />
                </motion.div>

                <h2 className="text-2xl font-medium text-slate-900 dark:text-white">Welcome Back</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Sign in to your QuickBite Pro account</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center gap-2.5 text-xs font-medium"
                    >
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Demo Quick-fill */}
                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 rounded-2xl p-3 space-y-2">
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Demo Accounts</span>
                  <div className="flex gap-2">
                    {demoCredentials.map((cred) => (
                      <button
                        key={cred.label}
                        type="button"
                        onClick={() => reset({ email: cred.email, password: cred.password })}
                        className={`flex-1 py-2 px-3 rounded-xl bg-gradient-to-r ${cred.color} text-white text-[10px] font-medium transition-all hover:shadow-md hover:-translate-y-0.5`}
                      >
                        {cred.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="your@email.com"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Password</label>
                    <button type="button" onClick={onForgotPassword} className="text-xs text-primary font-medium hover:underline">
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!isValid || isLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-primary to-orange-500 text-white font-medium rounded-2xl hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Signing In...</span>
                  ) : (
                    <span className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> Sign In</span>
                  )}
                </button>
              </form>

              <div className="text-center mt-6 pt-5 border-t border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Don't have an account?{' '}
                  <button onClick={handleSwitchToRegister} className="text-primary font-medium hover:underline">
                    Create one free
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;