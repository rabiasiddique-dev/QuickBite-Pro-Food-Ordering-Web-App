import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Cart, CartItem, FoodItem, Customization, Address, PaymentMethod, Order, OrderItem } from '@/types';
import { mockCoupons } from '@/data/mockData';
import { dbService } from '@/services/dbService';
import { useAuth } from '@/contexts/AuthContext';
import { v4 as uuidv4 } from 'uuid';

interface CartContextValue {
  cart: Cart;
  addItem: (foodItem: FoodItem, quantity: number, customizations?: Customization[]) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  clearCart: () => void;
  placeOrder: (address: Address, paymentMethod: PaymentMethod, specialInstructions?: string) => Promise<Order | null>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const TAX_RATE = 0.16; // 16% GST
const DELIVERY_FEE = 150; // Rs. 150

const initialCartState = (id: string = uuidv4()): Cart => ({
  id,
  items: [],
  subtotal: 0,
  tax: 0,
  deliveryFee: 0,
  discount: 0,
  total: 0,
  couponCode: undefined,
  estimatedDelivery: 30, // 30 mins
  updatedAt: new Date()
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart>(() => {
    const stored = localStorage.getItem('quickbite_cart');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          updatedAt: new Date(parsed.updatedAt)
        };
      } catch (e) {
        return initialCartState();
      }
    }
    return initialCartState();
  });

  useEffect(() => {
    localStorage.setItem('quickbite_cart', JSON.stringify(cart));
  }, [cart]);

  // Recalculate totals based on items and coupon
  const recalculateCart = (items: CartItem[], couponCode?: string): Cart => {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    
    let discount = 0;
    if (couponCode) {
      const coupon = mockCoupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase());
      if (coupon && subtotal >= coupon.minOrder) {
        if (coupon.type === 'percentage') {
          discount = subtotal * (coupon.value / 100);
          // Special cap for WELCOME50
          if (coupon.code === 'WELCOME50' && discount > 250) {
            discount = 250;
          }
        } else {
          discount = coupon.value;
        }
      }
    }

    const deliveryFee = subtotal > 0 ? DELIVERY_FEE : 0;
    const taxableAmount = Math.max(0, subtotal - discount);
    const tax = Math.round(taxableAmount * TAX_RATE);
    const total = Math.max(0, taxableAmount + tax + deliveryFee);

    // Calculate dynamic delivery time based on items count
    const estimatedDelivery = subtotal > 0 ? Math.min(60, 25 + items.length * 5) : 0;

    return {
      ...cart,
      items,
      subtotal,
      tax,
      deliveryFee,
      discount: Math.round(discount),
      total,
      couponCode,
      estimatedDelivery,
      updatedAt: new Date()
    };
  };

  const addItem = (foodItem: FoodItem, quantity: number, customizations: Customization[] = []) => {
    setCart(prevCart => {
      // Find if item with same customizations already exists
      const customizationKey = (cust: Customization[]) => 
        cust.map(c => `${c.type}-${c.value}`).sort().join('|');

      const existingItemIndex = prevCart.items.findIndex(
        item => item.foodItem.id === foodItem.id && 
        customizationKey(item.customizations) === customizationKey(customizations)
      );

      let newItems = [...prevCart.items];

      // Calculate customization extra cost
      const customizationCost = customizations.reduce((sum, c) => sum + c.price, 0);
      const unitPrice = foodItem.price + customizationCost;

      if (existingItemIndex > -1) {
        const existingItem = prevCart.items[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;
        newItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          subtotal: unitPrice * newQuantity
        };
      } else {
        newItems.push({
          id: uuidv4(),
          foodItem,
          quantity,
          customizations,
          subtotal: unitPrice * quantity
        });
      }

      return recalculateCart(newItems, prevCart.couponCode);
    });
  };

  const removeItem = (cartItemId: string) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.id !== cartItemId);
      return recalculateCart(newItems, newItems.length > 0 ? prevCart.couponCode : undefined);
    });
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartItemId);
      return;
    }

    setCart(prevCart => {
      const newItems = prevCart.items.map(item => {
        if (item.id !== cartItemId) return item;
        const customizationCost = item.customizations.reduce((sum, c) => sum + c.price, 0);
        const unitPrice = item.foodItem.price + customizationCost;
        return {
          ...item,
          quantity,
          subtotal: unitPrice * quantity
        };
      });
      return recalculateCart(newItems, prevCart.couponCode);
    });
  };

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const coupon = mockCoupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    
    if (!coupon) {
      return { success: false, message: 'Invalid coupon code' };
    }

    if (cart.subtotal < coupon.minOrder) {
      return { 
        success: false, 
        message: `Minimum order value of Rs. ${coupon.minOrder} required for this coupon` 
      };
    }

    setCart(prevCart => recalculateCart(prevCart.items, coupon.code));
    return { success: true, message: 'Coupon applied successfully!' };
  };

  const removeCoupon = () => {
    setCart(prevCart => recalculateCart(prevCart.items, undefined));
  };

  const clearCart = () => {
    setCart(initialCartState());
  };

  const placeOrder = async (
    address: Address, 
    paymentMethod: PaymentMethod, 
    specialInstructions?: string
  ): Promise<Order | null> => {
    if (cart.items.length === 0) return null;

    const newOrder: Order = {
      id: `ord-${Math.floor(100000 + Math.random() * 900000)}`,
      customerId: user ? user.id : 'guest-user',
      items: cart.items.map(item => ({
        foodId: item.foodItem.id,
        quantity: item.quantity,
        price: item.foodItem.price,
        customizations: item.customizations
      })),
      status: 'pending',
      subtotal: cart.subtotal,
      tax: cart.tax,
      deliveryFee: cart.deliveryFee,
      discount: cart.discount,
      total: cart.total,
      paymentMethod,
      deliveryAddress: address,
      estimatedDelivery: new Date(Date.now() + cart.estimatedDelivery * 60 * 1000),
      specialInstructions,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Store in Firestore
    await dbService.createOrder(newOrder);

    // Clear cart state
    clearCart();

    return newOrder;
  };

  return (
    <CartContext.Provider value={{
      cart,
      addItem,
      removeItem,
      updateQuantity,
      applyCoupon,
      removeCoupon,
      clearCart,
      placeOrder
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
