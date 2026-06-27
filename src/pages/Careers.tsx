import React from 'react';
import { Heading, Text } from '@/components/atoms';
import { Briefcase, MapPin, Clock } from 'lucide-react';

export const Careers: React.FC = () => {
  const jobs = [
    { title: 'Senior Frontend Developer (React)', department: 'Engineering', type: 'Full-time', location: 'Islamabad (Hybrid)' },
    { title: 'Logistics Operations Lead', department: 'Operations', type: 'Full-time', location: 'Lahore (On-site)' },
    { title: 'Merchant Relationship Executive', department: 'Sales', type: 'Full-time', location: 'Karachi (On-site)' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 py-16 px-4">
      <div className="container mx-auto max-w-4xl space-y-8 text-left">
        <div className="text-center space-y-3">
          <Heading as="h1" size="lg" className="text-slate-900 dark:text-white font-medium">
            Join the QuickBite Pro Team
          </Heading>
          <Text className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-center leading-relaxed">
            Help us build the next generation of smart dining and logistics networks.
          </Text>
        </div>

        <div className="space-y-4 mt-6">
          <Heading as="h2" size="xs" className="font-medium text-slate-900 dark:text-white">Open Opportunities</Heading>
          <div className="grid grid-cols-1 gap-4">
            {jobs.map((job, i) => (
              <div key={i} className="p-5 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-primary/50 transition-colors">
                <div className="space-y-1">
                  <span className="font-medium text-sm block text-slate-900 dark:text-white">{job.title}</span>
                  <div className="flex gap-4 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {job.department}</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                  </div>
                </div>
                <button className="bg-primary hover:bg-orange-600 text-white rounded-xl px-4 py-2 text-xs font-medium transition-colors">
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Careers;
