import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  CreditCard, 
  CheckCircle, 
  ChevronRight, 
  ArrowLeft, 
  ShoppingBag,
  ShieldCheck,
  Smartphone,
  Banknote,
  AlertCircle
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Heading, Text, Button } from '@/components/atoms';
import type { Address, PaymentMethod, PaymentMethodDetails } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const CheckoutPage: React.FC = () => {
  const { cart, placeOrder } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Address State
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('Islamabad');
  const [phone, setPhone] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [addressType, setAddressType] = useState<'home' | 'work' | 'other'>('home');

  // Step 2: Payment State
  const [paymentType, setPaymentType] = useState<'jazzcash' | 'easypaisa' | 'bank_transfer' | 'cash_on_delivery'>('cash_on_delivery');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountTitle, setAccountTitle] = useState('');
  const [bankName, setBankName] = useState('');

  // Handle Next Steps
  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!name || !street || !phone || !postalCode) {
        setError('Please fill out all address details.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (paymentType !== 'cash_on_delivery') {
        if (!accountNumber || !accountTitle) {
          setError('Please enter your account details.');
          return;
        }
        if (paymentType === 'bank_transfer' && !bankName) {
          setError('Please enter the bank name.');
          return;
        }
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/menu');
    }
  };

  // Place Order
  const handlePlaceOrder = () => {
    setLoading(true);
    
    const address: Address = {
      id: uuidv4(),
      type: addressType,
      street,
      city,
      postalCode,
      isDefault: true
    };

    const details: PaymentMethodDetails = {
      accountNumber: accountNumber || undefined,
      accountTitle: accountTitle || undefined,
      bankName: bankName || undefined,
      phoneNumber: phone
    };

    const paymentMethod: PaymentMethod = {
      id: uuidv4(),
      type: paymentType,
      details,
      isDefault: true
    };

    // Simulate Network Latency
    setTimeout(async () => {
      try {
        const order = await placeOrder(address, paymentMethod, 'Deliver near the main gate please.');
        setLoading(false);
        if (order) {
          navigate(`/order-tracking/${order.id}`);
        } else {
          setError('Could not place order. Cart is empty.');
        }
      } catch (err: any) {
        setLoading(false);
        setError('Failed to place order: ' + err.message);
      }
    }, 1500);
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white">
        <ShoppingBag className="h-16 w-16 text-slate-400 mb-4" />
        <Heading as="h2" size="sm" className="font-medium mb-2">Your Cart is Empty</Heading>
        <Text className="text-sm text-slate-500 dark:text-slate-400 mb-6">You need to add items to your cart before checking out.</Text>
        <Button onClick={() => navigate('/menu')} variant="primary">Browse Menu</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 py-10 px-4">
      <div className="container mx-auto max-w-4xl">
        
        {/* Progress Bar Header */}
        <div className="mb-10 text-center">
          <Heading as="h1" size="md" className="text-slate-900 dark:text-white font-medium">
            Checkout Details
          </Heading>
          
          <div className="flex items-center justify-center gap-4 mt-6 max-w-md mx-auto relative">
            {/* Horizontal progress line */}
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 dark:bg-slate-800 z-0" />
            
            {/* Step 1 node */}
            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-medium text-xs border-2 transition-all ${
                step >= 1 
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-white/10 text-slate-400'
              }`}>
                1
              </div>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase mt-2">Delivery</span>
            </div>

            {/* Step 2 node */}
            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-medium text-xs border-2 transition-all ${
                step >= 2 
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-white/10 text-slate-400'
              }`}>
                2
              </div>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase mt-2">Payment</span>
            </div>

            {/* Step 3 node */}
            <div className="relative z-10 flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-medium text-xs border-2 transition-all ${
                step >= 3 
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-white/10 text-slate-400'
              }`}>
                3
              </div>
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase mt-2">Confirm</span>
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Form Fields */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 p-6 rounded-3xl backdrop-blur-md">
            
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center gap-3 font-medium text-sm"
                >
                  <AlertCircle className="h-5 w-5" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {/* STEP 1: Address Details */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="space-y-4 text-left"
                >
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-3 mb-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <Heading as="h3" size="xs" className="font-medium text-slate-900 dark:text-white">Delivery Address</Heading>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Recipient Name</label>
                      <input
                        type="text"
                        placeholder="Hassan Raza"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-950 dark:text-white focus:outline-none focus:border-primary transition-all"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Mobile Number</label>
                      <input
                        type="tel"
                        placeholder="03001234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-950 dark:text-white focus:outline-none focus:border-primary transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Street Address</label>
                    <input
                      type="text"
                      placeholder="House No. 12, Street 3, Sector F-10/2"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-950 dark:text-white focus:outline-none focus:border-primary transition-all"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block">City</label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-950 dark:text-white focus:outline-none focus:border-primary transition-all"
                      >
                        <option>Islamabad</option>
                        <option>Rawalpindi</option>
                        <option>Lahore</option>
                        <option>Karachi</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Postal Code</label>
                      <input
                        type="text"
                        placeholder="44000"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-950 dark:text-white focus:outline-none focus:border-primary transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Address Label</label>
                    <div className="flex gap-2">
                      {['home', 'work', 'other'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setAddressType(type as any)}
                          className={`flex-1 py-2 rounded-xl text-xs font-medium capitalize border transition-all ${
                            addressType === type 
                              ? 'bg-primary/15 border-primary text-primary' 
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Payment Details */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="space-y-5 text-left"
                >
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-3 mb-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <Heading as="h3" size="xs" className="font-medium text-slate-900 dark:text-white">Payment Method</Heading>
                  </div>

                  {/* Payment Methods Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* COD */}
                    <button
                      type="button"
                      onClick={() => setPaymentType('cash_on_delivery')}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-24 transition-all ${
                        paymentType === 'cash_on_delivery'
                          ? 'bg-primary/10 border-primary text-white'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-400'
                      }`}
                    >
                      <Banknote className="h-5 w-5 text-slate-400" />
                      <div>
                        <span className="text-xs font-medium block text-slate-900 dark:text-white">Cash on Delivery</span>
                        <span className="text-[10px] text-slate-400 font-medium">Pay at your doorstep</span>
                      </div>
                    </button>

                    {/* JazzCash */}
                    <button
                      type="button"
                      onClick={() => setPaymentType('jazzcash')}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-24 transition-all ${
                        paymentType === 'jazzcash'
                          ? 'bg-primary/10 border-primary text-white'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-400'
                      }`}
                    >
                      <Smartphone className="h-5 w-5 text-amber-500" />
                      <div>
                        <span className="text-xs font-medium block text-slate-900 dark:text-white">JazzCash</span>
                        <span className="text-[10px] text-slate-400 font-medium">Instant Mobile Wallet</span>
                      </div>
                    </button>

                    {/* EasyPaisa */}
                    <button
                      type="button"
                      onClick={() => setPaymentType('easypaisa')}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-24 transition-all ${
                        paymentType === 'easypaisa'
                          ? 'bg-primary/10 border-primary text-white'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-400'
                      }`}
                    >
                      <Smartphone className="h-5 w-5 text-green-500" />
                      <div>
                        <span className="text-xs font-medium block text-slate-900 dark:text-white">EasyPaisa</span>
                        <span className="text-[10px] text-slate-400 font-medium">Easy transfer wallet</span>
                      </div>
                    </button>

                    {/* Bank Transfer */}
                    <button
                      type="button"
                      onClick={() => setPaymentType('bank_transfer')}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-24 transition-all ${
                        paymentType === 'bank_transfer'
                          ? 'bg-primary/10 border-primary text-white'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-400'
                      }`}
                    >
                      <CreditCard className="h-5 w-5 text-blue-500" />
                      <div>
                        <span className="text-xs font-medium block text-slate-900 dark:text-white">Bank Transfer</span>
                        <span className="text-[10px] text-slate-400 font-medium">Standard Net Banking</span>
                      </div>
                    </button>
                  </div>

                  {/* Account Inputs if digital */}
                  {paymentType !== 'cash_on_delivery' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-white/5 space-y-3 mt-4"
                    >
                      <Heading as="h4" size="xs" className="text-xs font-medium uppercase text-slate-950 dark:text-white tracking-wider">
                        {paymentType.replace(/_/g, ' ').toUpperCase()} details
                      </Heading>

                      {paymentType === 'bank_transfer' && (
                        <div className="space-y-1">
                          <label className="text-[10px] font-medium text-slate-400 uppercase">Bank Name</label>
                          <input
                            type="text"
                            placeholder="Meezan Bank Ltd."
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-950 dark:text-white focus:outline-none"
                            required
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-medium text-slate-400 uppercase">Account / Phone Number</label>
                          <input
                            type="text"
                            placeholder="03001234567"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-950 dark:text-white focus:outline-none"
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-medium text-slate-400 uppercase">Account Title</label>
                          <input
                            type="text"
                            placeholder="Hassan Raza"
                            value={accountTitle}
                            onChange={(e) => setAccountTitle(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-950 dark:text-white focus:outline-none"
                            required
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* STEP 3: Order Summary & Placement */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-5 text-center py-6"
                >
                  <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/10">
                    <CheckCircle className="h-8 w-8" />
                  </div>

                  <Heading as="h3" size="xs" className="font-medium text-slate-900 dark:text-white">Review & Confirm Order</Heading>
                  <Text className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed font-body">
                    We will send a copy of your receipt to your WhatsApp phone number. Please check the order totals, address, and method below.
                  </Text>

                  {/* Summary Details Box */}
                  <div className="text-left bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-white/5 space-y-3 text-xs text-slate-600 dark:text-slate-300 font-medium">
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-400 block uppercase">Deliver to:</span>
                      <span className="text-slate-950 dark:text-white text-right font-medium">{name} <br /> {street}, {city}</span>
                    </div>
                    <div className="h-px bg-slate-200 dark:bg-slate-700/50 my-1" />
                    <div className="flex justify-between">
                      <span className="font-medium text-slate-400 block uppercase">Payment Method:</span>
                      <span className="text-slate-950 dark:text-white font-medium capitalize">{paymentType.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Back/Next Buttons */}
            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
              <button
                onClick={handleBack}
                disabled={loading}
                className="flex items-center gap-2 py-2 px-4 border border-slate-300 dark:border-white/10 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all font-medium text-xs"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>

              {step < 3 ? (
                <button
                  onClick={handleNext}
                  className="bg-primary text-white rounded-xl py-3 px-6 text-xs font-medium flex items-center gap-1.5 hover:shadow-lg hover:shadow-primary/30 transition-all"
                >
                  Continue
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="bg-gradient-to-r from-primary to-orange-500 hover:shadow-lg hover:shadow-primary/30 text-white rounded-xl py-3 px-8 text-xs font-medium flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      Placing Order...
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </>
                  ) : (
                    <>
                      Confirm & Pay
                      <CheckCircle className="h-4.5 w-4.5" />
                    </>
                  )}
                </button>
              )}
            </div>

          </div>

          {/* Cart Sidebar Recap */}
          <div className="lg:col-span-4 bg-slate-900 border border-white/10 p-5 rounded-3xl text-white space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <Heading as="h4" size="xs" className="font-medium text-white">Order Items</Heading>
            </div>

            {/* Mini list */}
            <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
              {cart.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs">
                  <div className="min-w-0 flex-1 pr-2">
                    <span className="font-medium truncate block">{item.foodItem.name}</span>
                    <span className="text-[10px] text-slate-400 block font-numbers">Qty: {item.quantity}</span>
                  </div>
                  <span className="font-medium text-primary font-numbers">Rs. {item.subtotal}</span>
                </div>
              ))}
            </div>

            <div className="h-px bg-white/10" />

            {/* Pricing break downs */}
            <div className="space-y-2 text-xs text-slate-400 font-medium">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-numbers">Rs. {cart.subtotal}</span>
              </div>
              {cart.discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Discount</span>
                  <span className="font-numbers">-Rs. {cart.discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="text-white font-numbers">Rs. {cart.deliveryFee}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (16%)</span>
                <span className="text-white font-numbers">Rs. {cart.tax}</span>
              </div>
              <div className="h-px bg-white/10 my-1" />
              <div className="flex justify-between text-sm font-medium text-white">
                <span>Total</span>
                <span className="text-primary font-numbers text-base">Rs. {cart.total}</span>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-3 rounded-2xl flex items-center gap-2.5">
              <Clock className="h-4.5 w-4.5 text-primary" />
              <div className="text-left">
                <span className="text-[10px] text-slate-400 block font-medium">Estimated Delivery</span>
                <span className="text-xs font-medium text-white font-numbers">{cart.estimatedDelivery} Mins</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
