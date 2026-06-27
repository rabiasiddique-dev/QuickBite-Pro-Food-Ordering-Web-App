import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  phone: z.string().optional().refine((val) => {
    if (!val) return true;
    return /^\+?[1-9]\d{1,14}$/.test(val.replace(/\s|-/g, ''));
  }, 'Invalid phone number'),
  password: z.string().min(8, 'Min 8 characters').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Must include upper, lower & number'),
  confirmPassword: z.string()
}).refine((d) => d.password === d.confirmPassword, { message: "Passwords don't match", path: ['confirmPassword'] });

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser, error, clearError } = useAuth();

  const { register, handleSubmit, formState: { errors, isValid }, reset, watch } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur'
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      clearError();
      await registerUser(data.name, data.email, data.password, data.phone);
      reset();
      onClose();
    } catch {
      setIsLoading(false);
    }
  };

  const handleClose = () => { reset(); clearError(); onClose(); };
  const handleSwitchToLogin = () => { reset(); clearError(); onSwitchToLogin?.(); };

  // Password strength
  const getStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: '', color: '' };
    const checks = {
      length: pwd.length >= 8,
      lower: /[a-z]/.test(pwd),
      upper: /[A-Z]/.test(pwd),
      number: /\d/.test(pwd),
      special: /[!@#$%^&*]/.test(pwd)
    };
    const score = Object.values(checks).filter(Boolean).length;
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];
    const textColors = ['', 'text-red-500', 'text-orange-500', 'text-yellow-500', 'text-green-500', 'text-emerald-500'];
    return { score, label: labels[score], barColor: colors[score], textColor: textColors[score], checks };
  };
  const strength = getStrength(password || '');

  const inputClass = "w-full py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/10 transition-all";

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
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-white/10 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top gradient bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-orange-400 to-amber-400 flex-shrink-0" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/8 blur-3xl pointer-events-none" />

            <div className="p-8 relative overflow-y-auto custom-scrollbar">
              {/* Logo & Header */}
              <div className="text-center mb-7">
                <motion.div
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                  className="w-16 h-16 mx-auto mb-4 relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-orange-500 rounded-2xl opacity-20 blur-md" />
                  <img src="/logo.png" alt="QuickBite Pro" className="w-16 h-16 rounded-2xl object-contain relative z-10 shadow-lg" />
                </motion.div>
                <h2 className="text-2xl font-medium text-slate-900 dark:text-white">Create Account</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Join QuickBite Pro and start ordering</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center gap-2.5 text-xs font-medium">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />{error}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input {...register('name')} type="text" placeholder="Ali Hassan" className={`${inputClass} pl-10`} />
                  </div>
                  {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input {...register('email')} type="email" placeholder="your@email.com" className={`${inputClass} pl-10`} />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Phone <span className="text-slate-300 normal-case font-normal">(optional)</span></label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input {...register('phone')} type="tel" placeholder="+92 300 1234567" className={`${inputClass} pl-10`} />
                  </div>
                  {errors.phone && <p className="text-xs text-red-500 font-medium">{errors.phone.message}</p>}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input {...register('password')} type={showPassword ? 'text' : 'password'} placeholder="Create a strong password" className={`${inputClass} pl-10 pr-12`} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>}

                  {/* Strength bars */}
                  {password && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-medium text-slate-400 uppercase">Strength</span>
                        <span className={`text-[10px] font-medium ${strength.textColor}`}>{strength.label}</span>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < strength.score ? strength.barColor : 'bg-slate-200 dark:bg-slate-700'}`} />
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {Object.entries(strength.checks || {}).map(([key, ok]) => (
                          <div key={key} className="flex items-center gap-1.5">
                            {ok ? <CheckCircle className="h-3 w-3 text-green-500" /> : <div className="h-3 w-3 rounded-full border-2 border-slate-300 dark:border-slate-600" />}
                            <span className={`text-[10px] font-medium ${ok ? 'text-green-600 dark:text-green-400' : 'text-slate-400'}`}>
                              {key === 'length' ? '8+ chars' : key === 'lower' ? 'Lowercase' : key === 'upper' ? 'Uppercase' : key === 'number' ? 'Number' : 'Special char'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input {...register('confirmPassword')} type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm your password" className={`${inputClass} pl-10 pr-12`} />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-500 font-medium">{errors.confirmPassword.message}</p>}
                </div>

                {/* Terms */}
                <p className="text-xs text-slate-400 text-center leading-relaxed">
                  By creating an account you agree to our{' '}
                  <a href="/terms" className="text-primary font-medium hover:underline">Terms</a> and{' '}
                  <a href="/privacy" className="text-primary font-medium hover:underline">Privacy Policy</a>.
                </p>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!isValid || isLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-primary to-orange-500 text-white font-medium rounded-2xl hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Creating Account...</>
                  ) : (
                    <><Sparkles className="h-4 w-4" /> Create My Account</>
                  )}
                </button>
              </form>

              <div className="text-center mt-5 pt-5 border-t border-slate-100 dark:border-white/5">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Already have an account?{' '}
                  <button onClick={handleSwitchToLogin} className="text-primary font-medium hover:underline">Sign in</button>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RegisterModal;