import React, { useState } from 'react';
import { Heading, Text } from '@/components/atoms';
import { ChevronDown, ChevronUp } from 'lucide-react';

export const FAQs: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs = [
    { q: 'How long does delivery usually take?', a: 'Typically between 25 to 35 minutes depending on the preparation time of the items in your cart and your location relative to the restaurant.' },
    { q: 'What payment methods do you support?', a: 'We fully support JazzCash, EasyPaisa, standard bank transfers, and Cash on Delivery for maximum convenience.' },
    { q: 'Can I customize my meals?', a: 'Yes! When you click on a menu item, the details modal allows you to upsize or add extras like cheese with automated pricing updates.' },
    { q: 'How can I track my order?', a: 'Once your order is placed, you will be redirected to a live tracking page where you can monitor the status from "Pending" to "Delivered".' },
    { q: 'Do you offer refunds if the food is cold?', a: 'Customer satisfaction is our priority. If you experience significant delays resulting in cold food, please contact support within 20 minutes of delivery for a partial or full refund credit.' },
    { q: 'How do I apply a discount coupon?', a: 'You can enter your promotional code on the cart sidebar or during checkout. The discount will automatically apply if the code is valid.' },
    { q: 'Can I order for a future date or time?', a: 'Currently, QuickBite Pro focuses on immediate, on-demand deliveries. Scheduled orders will be introduced in our next major update.' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 py-16 px-4">
      <div className="container mx-auto max-w-3xl space-y-10 text-left">
        <div className="text-center space-y-3">
          <Heading as="h1" size="lg" className="text-slate-900 dark:text-white font-medium">
            Frequently Asked Questions
          </Heading>
          <Text className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Find answers to common questions about orders, delivery, and payments.
          </Text>
        </div>

        <div className="space-y-4 mt-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm transition-all">
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full p-5 flex justify-between items-center text-sm font-medium text-slate-800 dark:text-white hover:bg-slate-100/50 dark:hover:bg-white/5 transition-colors text-left gap-4"
              >
                <span>{faq.q}</span>
                {openIdx === idx ? <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" /> : <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />}
              </button>
              {openIdx === idx && (
                <div className="p-5 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-slate-900/30">
                  <Text className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-body">{faq.a}</Text>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQs;
