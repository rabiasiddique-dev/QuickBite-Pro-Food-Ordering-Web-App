// Core Data Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  role: 'customer' | 'admin';
  preferences: UserPreferences;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationSettings;
  dietary: DietaryPreferences;
  language: string;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  whatsapp: boolean;
  orderUpdates: boolean;
  promotions: boolean;
}

export interface DietaryPreferences {
  restrictions: string[];
  allergies: string[];
  preferences: string[];
}

export interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  street: string;
  city: string;
  postalCode: string;
  coordinates?: { lat: number; lng: number };
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'jazzcash' | 'easypaisa' | 'bank_transfer' | 'cash_on_delivery';
  details: PaymentMethodDetails;
  isDefault: boolean;
}

export interface PaymentMethodDetails {
  accountNumber?: string;
  accountTitle?: string;
  bankName?: string;
  phoneNumber?: string;
}

// Food and Menu Types
export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: FoodCategory;
  images: FoodImage[];
  ingredients: string[];
  nutritionalInfo: NutritionalInfo;
  allergens: string[];
  tags: string[];
  availability: boolean;
  preparationTime: number;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FoodCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
}

export interface FoodImage {
  id: string;
  url: string;
  alt: string;
  type: 'main' | 'gallery' | 'ingredient';
  sortOrder: number;
}

export interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
}

// Order Management Types
export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  deliveryAddress: Address;
  estimatedDelivery: Date;
  actualDelivery?: Date;
  specialInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  foodId: string;
  quantity: number;
  price: number;
  customizations?: Customization[];
  specialRequests?: string;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface Customization {
  type: 'size' | 'addon' | 'removal' | 'spice_level';
  value: string;
  price: number;
}

// Cart Types
export interface Cart {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  total: number;
  couponCode?: string;
  estimatedDelivery: number;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  foodItem: FoodItem;
  quantity: number;
  customizations: Customization[];
  subtotal: number;
}

export interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  maxDiscount?: number;
  expiryDate: Date;
  usageLimit: number;
  usedCount: number;
}

// Review and Rating Types
export interface Review {
  id: string;
  customerId: string;
  foodId: string;
  orderId: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
  isApproved: boolean;
  adminResponse?: AdminResponse;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminResponse {
  message: string;
  respondedBy: string;
  respondedAt: Date;
}

export interface Rating {
  foodId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

// Analytics Types
export interface DashboardMetrics {
  revenue: RevenueMetrics;
  orders: OrderMetrics;
  customers: CustomerMetrics;
  products: ProductMetrics;
  timeRange: DateRange;
}

export interface RevenueMetrics {
  total: number;
  growth: number;
  dailyRevenue: ChartData[];
  topPaymentMethods: PaymentMethodStats[];
}

export interface OrderMetrics {
  total: number;
  completed: number;
  cancelled: number;
  averageValue: number;
  peakHours: HourlyData[];
}

export interface CustomerMetrics {
  total: number;
  new: number;
  returning: number;
  retention: number;
  topCustomers: CustomerStats[];
}

export interface ProductMetrics {
  totalProducts: number;
  topSelling: FoodItem[];
  categoryPerformance: CategoryStats[];
}

// Utility Types
export interface DateRange {
  start: Date;
  end: Date;
}

export interface ChartData {
  date: string;
  value: number;
  label?: string;
}

export interface PaymentMethodStats {
  method: string;
  count: number;
  percentage: number;
}

export interface HourlyData {
  hour: number;
  count: number;
}

export interface CustomerStats {
  id: string;
  name: string;
  orderCount: number;
  totalSpent: number;
}

export interface CategoryStats {
  categoryId: string;
  name: string;
  orderCount: number;
  revenue: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

// Theme Types
export interface ThemeContextValue {
  theme: 'light' | 'dark' | 'system';
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
}