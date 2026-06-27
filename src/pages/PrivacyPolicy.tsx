import React from 'react';
import { Heading, Text } from '@/components/atoms';
import { Shield, Lock, FileText, Eye } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 py-16 px-4">
      <div className="container mx-auto max-w-4xl space-y-10 text-left">
        <div className="text-center space-y-3">
          <Heading as="h1" size="lg" className="text-slate-900 dark:text-white font-medium">
            Privacy Policy
          </Heading>
          <Text className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Your privacy is our priority. Learn how we collect, process, and protect your data.
          </Text>
        </div>

        <div className="bg-white dark:bg-slate-800/40 p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-8">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Eye className="h-6 w-6 text-primary" />
              <Heading as="h3" size="xs" className="text-slate-900 dark:text-white font-medium">Data Collection</Heading>
            </div>
            <Text className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-body pl-9">
              We collect information that you provide directly to us when you create an account, place an order, or contact customer support. This includes your name, email, phone number, delivery address, and basic payment preferences.
            </Text>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <Heading as="h3" size="xs" className="text-slate-900 dark:text-white font-medium">Data Usage</Heading>
            </div>
            <Text className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-body pl-9">
              We use the collected data to process your food orders, send transactional alerts (via WhatsApp or SMS), and improve our app's AI recommendation engine. We do not sell your personal data to third-party data brokers.
            </Text>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Lock className="h-6 w-6 text-primary" />
              <Heading as="h3" size="xs" className="text-slate-900 dark:text-white font-medium">Data Security</Heading>
            </div>
            <Text className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-body pl-9">
              All digital payment transactions (JazzCash, EasyPaisa, Net Banking) are protected under strict 256-bit SSL encryption. Payment details are passed directly to gateways and never stored on our servers.
            </Text>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <Heading as="h3" size="xs" className="text-slate-900 dark:text-white font-medium">Your Rights</Heading>
            </div>
            <Text className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-body pl-9">
              You have the right to request the deletion of your account and associated personal data at any time through your Customer Dashboard. For further inquiries, contact privacy@quickbite.com.
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
