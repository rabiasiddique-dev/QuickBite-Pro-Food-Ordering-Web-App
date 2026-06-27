import React from 'react';
import { Heading, Text } from '@/components/atoms';
import { ShieldCheck, Users, Zap, Heart } from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 py-16 px-4">
      <div className="container mx-auto max-w-4xl space-y-12 text-left">
        <div className="text-center space-y-3">
          <Heading as="h1" size="lg" className="text-slate-900 dark:text-white font-medium">
            About QuickBite Pro
          </Heading>
          <Text className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-center leading-relaxed">
            We are redefining online restaurant ordering and management operations for food lovers and merchants alike.
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div className="space-y-4">
            <Heading as="h3" size="xs" className="font-medium text-slate-900 dark:text-white">Our Mission</Heading>
            <Text className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-body">
              Our mission is to bridge the gap between premium culinary experiences and high-tech ordering logistics. We empower local food businesses in Pakistan with high-performance digital tools while giving users the fastest, most reliable checkout experience possible.
            </Text>
          </div>
          <div className="space-y-4">
            <Heading as="h3" size="xs" className="font-medium text-slate-900 dark:text-white">Our Vision</Heading>
            <Text className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-body">
              We envision a fully integrated food delivery ecosystem where AI-driven recommendations, paperless WhatsApp invoice alerts, and custom order tracking come together to form the perfect mealtime companion.
            </Text>
          </div>
        </div>

        {/* Values */}
        <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-white/5">
          <Heading as="h2" size="xs" className="font-medium text-slate-900 dark:text-white text-center">Core Pillars of Excellence</Heading>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 rounded-2xl space-y-2">
              <Zap className="h-6 w-6 text-primary" />
              <span className="font-medium text-sm block text-slate-900 dark:text-white">Super Fast Delivery</span>
              <Text className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Warm, fresh meals delivered straight to your door in 30 minutes flat.</Text>
            </div>
            
            <div className="p-5 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 rounded-2xl space-y-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <span className="font-medium text-sm block text-slate-900 dark:text-white">Hygiene Certified</span>
              <Text className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Partnering only with certified top-grade kitchens that prioritize cleanliness.</Text>
            </div>

            <div className="p-5 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 rounded-2xl space-y-2">
              <Heart className="h-6 w-6 text-primary" />
              <span className="font-medium text-sm block text-slate-900 dark:text-white">Loved by Thousands</span>
              <Text className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">Backed by active positive reviews and return customers nationwide.</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
