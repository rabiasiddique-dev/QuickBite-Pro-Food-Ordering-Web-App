import React, { useState } from 'react';
import { Heading, Text, Button } from '@/components/atoms';
import { Mail, Phone, MapPin, Check } from 'lucide-react';

export const Contact: React.FC = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
    setEmail('');
    setMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 py-16 px-4">
      <div className="container mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        <div className="space-y-6">
          <Heading as="h1" size="lg" className="text-slate-900 dark:text-white font-medium">Contact Support</Heading>
          <Text className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-body">
            Get in touch with our operations center. We are available 24/7 to solve order discrepancies.
          </Text>

          <div className="space-y-3 font-medium text-slate-600 dark:text-slate-300 text-xs">
            <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-primary" /> support@quickbite.com</div>
            <div className="flex items-center gap-3"><Phone className="h-5 w-5 text-primary" /> +92 (300) 1234567</div>
            <div className="flex items-center gap-3"><MapPin className="h-5 w-5 text-primary" /> Blue Area, Islamabad, Pakistan</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 shadow-xl relative overflow-hidden">
          
          {success && (
            <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 z-10 flex flex-col items-center justify-center text-center p-6 backdrop-blur-md">
              <div className="w-12 h-12 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-3">
                <Check className="h-6 w-6" />
              </div>
              <span className="font-medium text-slate-900 dark:text-white">Message Sent!</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">We'll get back to you shortly.</span>
            </div>
          )}

          <div className="space-y-1 relative z-0">
            <label className="text-[10px] font-medium text-slate-400 uppercase">Your Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-950 dark:text-white focus:outline-none"
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-medium text-slate-400 uppercase">Message</label>
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-950 dark:text-white focus:outline-none h-24 resize-none"
              required
            />
          </div>
          <Button type="submit" variant="primary" className="py-2.5 px-4 text-xs font-medium">Send Feedback</Button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
