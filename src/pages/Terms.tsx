import React from 'react';
import { Heading, Text } from '@/components/atoms';
import { CheckCircle, AlertTriangle, Scale, Clock } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 py-16 px-4">
      <div className="container mx-auto max-w-4xl space-y-10 text-left">
        <div className="text-center space-y-3">
          <Heading as="h1" size="lg" className="text-slate-900 dark:text-white font-medium">
            Terms of Service
          </Heading>
          <Text className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Please read these terms carefully before using the QuickBite Pro platform.
          </Text>
        </div>

        <div className="bg-white dark:bg-slate-800/40 p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-primary" />
              <Heading as="h3" size="xs" className="text-slate-900 dark:text-white font-medium">Acceptance of Terms</Heading>
            </div>
            <Text className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-body pl-9">
              By accessing and utilizing the QuickBite Pro ordering platform, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our application.
            </Text>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Scale className="h-6 w-6 text-primary" />
              <Heading as="h3" size="xs" className="text-slate-900 dark:text-white font-medium">Ordering & Payments</Heading>
            </div>
            <Text className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-body pl-9">
              Orders placed must be settled via the chosen payment gateway (JazzCash, EasyPaisa, Bank Transfer) or Cash on Delivery. Prices are subject to change, but you will always be charged the price listed at the time of checkout.
            </Text>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-primary" />
              <Heading as="h3" size="xs" className="text-slate-900 dark:text-white font-medium">Cancellations & Refunds</Heading>
            </div>
            <Text className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-body pl-9">
              Refunds or order cancellations must be requested within 5 minutes of order placement. Once an order's status changes to "Preparing," it cannot be cancelled or refunded.
            </Text>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-primary" />
              <Heading as="h3" size="xs" className="text-slate-900 dark:text-white font-medium">User Conduct</Heading>
            </div>
            <Text className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-body pl-9">
              You agree not to use the platform for any fraudulent activities, false orders, or spam. Accounts flagged for continuous fake orders will be permanently banned.
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
