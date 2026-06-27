import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  Check, 
  Phone,
  MessageSquare,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ChefHat,
  Truck,
  PackageCheck
} from 'lucide-react';
import { Heading, Text, Button } from '@/components/atoms';
import { dbService } from '@/services/dbService';
import type { Order, OrderStatus } from '@/types';

// Map OrderStatus to Timeline details
const trackingSteps: { status: OrderStatus; label: string; desc: string; icon: React.FC<any> }[] = [
  { status: 'pending', label: 'Order Received', desc: 'We have received your order request.', icon: ShoppingBag },
  { status: 'confirmed', label: 'Order Confirmed', desc: 'Restaurant has accepted your order.', icon: Check },
  { status: 'preparing', label: 'Preparing', desc: 'Chef is gathering fresh ingredients.', icon: ChefHat },
  { status: 'out_for_delivery', label: 'Out for Delivery', desc: 'Rider has picked up and is on the way.', icon: Truck },
  { status: 'delivered', label: 'Delivered', desc: 'Enjoy your warm premium meal!', icon: PackageCheck }
];

export const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);

  // Load Order Live
  useEffect(() => {
    if (!orderId) return;
    const unsub = dbService.listenToSingleOrder(orderId, (fetchedOrder) => {
      setOrder(fetchedOrder);
    });
    return () => unsub();
  }, [orderId]);

  const getActiveStepIndex = (status: OrderStatus): number => {
    if (status === 'ready' || status === 'preparing') return 2; // preparing
    const idx = trackingSteps.findIndex(step => step.status === status);
    return idx === -1 ? 0 : idx;
  };

  const activeIndex = order ? getActiveStepIndex(order.status) : 0;

  // WhatsApp One Click integration UI
  const handleWhatsAppSend = () => {
    if (!order) return;
    
    const phoneNumber = '923001234567'; // Merchant/Support Number
    const itemsText = order.items.map(item => `- Qty ${item.quantity} (Item ID: ${item.foodId})`).join('%0A');
    const msg = `*QuickBite Pro - Order Receipt* %0A%0A*Order ID:* ${order.id}%0A*Total Amount:* Rs. ${order.total}%0A*Payment Type:* ${order.paymentMethod.type.toUpperCase()}%0A*Address:* ${order.deliveryAddress.street}, ${order.deliveryAddress.city}%0A%0A*Items:*%0A${itemsText}%0A%0A_Sent via QuickBite Pro Platform._`;
    
    window.open(`https://wa.me/${phoneNumber}?text=${msg}`, '_blank');
  };

  if (!order) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white">
        <Heading as="h2" size="sm" className="font-medium mb-2">Order Not Found</Heading>
        <Text className="text-sm text-slate-500 dark:text-slate-400 mb-6">We couldn't locate any order matching this tracker ID.</Text>
        <Button onClick={() => navigate('/menu')} variant="primary">Browse Menu</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 py-10 px-4">
      <div className="container mx-auto max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Live Tracking Timeline */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 p-6 rounded-3xl backdrop-blur-md text-left space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-4">
            <div>
              <span className="text-[10px] uppercase font-medium text-primary tracking-widest font-numbers">TRACKING: {order.id}</span>
              <Heading as="h2" size="sm" className="font-medium text-slate-900 dark:text-white mt-0.5">Live Order Status</Heading>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 p-2 rounded-xl">
              <Clock className="h-4 w-4 text-primary animate-pulse" />
              <span className="font-numbers">25-30 mins left</span>
            </div>
          </div>

          {/* Timeline Nodes */}
          <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 pl-8 space-y-10 py-2">
            {trackingSteps.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = idx <= activeIndex;
              const isActive = idx === activeIndex;

              return (
                <div key={idx} className="relative">
                  {/* Step bullet */}
                  <div className={`absolute left-[-41px] top-1.5 w-7.5 h-7.5 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted 
                      ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                  }`}>
                    {isCompleted && !isActive ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Icon className="h-3.5 w-3.5" />
                    )}
                  </div>

                  <div>
                    <span className={`text-xs font-medium block transition-colors ${
                      isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400'
                    }`}>
                      {step.label}
                    </span>
                    <p className={`text-xs mt-1 transition-colors leading-relaxed font-body ${
                      isActive ? 'text-primary font-medium' : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Panel Side */}
        <div className="lg:col-span-4 space-y-6">
          {/* Order Details box */}
          <div className="bg-slate-900 border border-white/10 p-5 rounded-3xl text-white space-y-4 text-left">
            <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Summary</span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span>Address</span>
                <span className="font-medium text-right max-w-[150px] truncate">{order.deliveryAddress.street}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Amount</span>
                <span className="font-medium text-primary font-numbers">Rs. {order.total}</span>
              </div>
              <div className="flex justify-between">
                <span>Method</span>
                <span className="font-medium uppercase">{order.paymentMethod.type.replace(/_/g, ' ')}</span>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <button
              onClick={handleWhatsAppSend}
              className="w-full mt-4 bg-green-500 hover:bg-green-600 hover:shadow-lg hover:shadow-green-500/20 text-white rounded-xl py-3 font-medium flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer text-xs"
            >
              <MessageSquare className="h-4 w-4 fill-current" />
              WhatsApp Receipt
            </button>
          </div>

          {/* Quick links card */}
          <div className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 p-5 rounded-3xl text-slate-800 dark:text-white space-y-4 text-left">
            <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Help & Support</span>
            <div className="space-y-3">
              <a href="tel:03001234567" className="flex items-center gap-3 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-primary">
                <Phone className="h-4 w-4" />
                Call Delivery Rider
              </a>
              <button 
                onClick={() => navigate('/menu')} 
                className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 py-2.5 rounded-xl text-xs font-medium text-center border border-slate-200 dark:border-white/10 flex items-center justify-center gap-1.5 text-slate-800 dark:text-white"
              >
                Go back to Menu
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderTrackingPage;
