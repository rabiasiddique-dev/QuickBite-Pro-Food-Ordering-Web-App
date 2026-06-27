import React, { useState } from 'react';
import { motion as m, AnimatePresence as Ap } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, Percent, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { Button, Heading, Text } from '@/components/atoms';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, updateQuantity, removeItem, applyCoupon, removeCoupon } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    
    const result = applyCoupon(couponInput);
    if (result.success) {
      setCouponSuccess(result.message);
      setCouponError('');
    } else {
      setCouponError(result.message);
      setCouponSuccess('');
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponInput('');
    setCouponSuccess('');
    setCouponError('');
  };

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <Ap>
      {isOpen && (
        <>
          {/* Overlay */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
          />

          {/* Drawer container */}
          <m.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-slate-900/95 text-white shadow-2xl z-50 flex flex-col backdrop-blur-xl border-l border-white/10"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/20 text-primary rounded-xl">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <div>
                  <Heading as="h3" size="sm" className="font-medium text-white">Your Cart</Heading>
                  <Text className="text-xs text-slate-400">{cart.items.length} items selected</Text>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {cart.items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 border border-white/5">
                    <ShoppingBag className="h-10 w-10 text-slate-500" />
                  </div>
                  <Heading as="h4" size="xs" className="text-white font-medium mb-2">Cart is empty</Heading>
                  <Text className="text-sm text-slate-400 max-w-xs mb-6">
                    Browse our premium menu and add your favorite dishes to get started!
                  </Text>
                  <Button onClick={() => { onClose(); navigate('/menu'); }} variant="primary">
                    Browse Menu
                  </Button>
                </div>
              ) : (
                cart.items.map((item) => (
                  <m.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 bg-white/5 rounded-2xl border border-white/10 flex items-start gap-4"
                  >
                    <img
                      src={item.foodItem.images[0]?.url}
                      alt={item.foodItem.name}
                      className="w-16 h-16 rounded-xl object-cover border border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-1">
                        <Heading as="h5" size="xs" className="text-sm font-medium text-white truncate">
                          {item.foodItem.name}
                        </Heading>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 hover:text-red-400 p-1 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Customizations display */}
                      {item.customizations.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1 mb-2">
                          {item.customizations.map((c, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-white/5"
                            >
                              {c.value} (+Rs. {c.price})
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-1 border border-white/5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 hover:bg-slate-700 text-slate-400 hover:text-white rounded transition-colors"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="text-xs font-medium w-6 text-center font-numbers">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 hover:bg-slate-700 text-slate-400 hover:text-white rounded transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-medium text-primary font-numbers">
                            Rs. {item.subtotal}
                          </span>
                        </div>
                      </div>
                    </div>
                  </m.div>
                ))
              )}
            </div>

            {/* Footer / Summary */}
            {cart.items.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-slate-900 space-y-4">
                {/* Coupon Code Input */}
                {!cart.couponCode ? (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="PROMO CODE"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="w-full bg-slate-800 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs font-medium uppercase tracking-wider text-white focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <Button type="submit" variant="outline" className="px-4 py-2 text-xs">
                      Apply
                    </Button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between bg-primary/10 border border-primary/20 p-3 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Percent className="h-4 w-4 text-primary" />
                      <div>
                        <span className="text-xs font-medium text-white block">Coupon: {cart.couponCode}</span>
                        <span className="text-[10px] text-primary">Discount applied</span>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-xs font-medium text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {couponError && <p className="text-xs text-red-400 font-medium">{couponError}</p>}
                {couponSuccess && <p className="text-xs text-green-400 font-medium">{couponSuccess}</p>}

                {/* Pricing Summary */}
                <div className="space-y-2 text-sm text-slate-400 font-medium">
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
                    <span>Delivery Charges</span>
                    <span className="text-white font-numbers">Rs. {cart.deliveryFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (16%)</span>
                    <span className="text-white font-numbers">Rs. {cart.tax}</span>
                  </div>
                  <div className="h-px bg-white/10 my-2" />
                  <div className="flex justify-between text-base font-medium text-white">
                    <span>Total Amount</span>
                    <span className="text-primary font-numbers text-lg">Rs. {cart.total}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full mt-2 bg-gradient-to-r from-primary to-orange-500 text-white rounded-xl py-4 font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </m.div>
        </>
      )}
    </Ap>
  );
};

export default CartDrawer;
