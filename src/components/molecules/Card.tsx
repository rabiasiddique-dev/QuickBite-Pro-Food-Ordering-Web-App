import React from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Clock, 
  Heart, 
  Plus, 
  Eye,
  TrendingUp,
  Users,
  DollarSign
} from 'lucide-react';
import { Button, Text, Heading } from '@/components/atoms';
import type { BaseComponentProps, FoodItem, Order } from '@/types';

// Base Card Component
interface BaseCardProps extends BaseComponentProps {
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  rounded?: 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
  glass?: boolean;
}

const BaseCard: React.FC<BaseCardProps> = ({
  hover = true,
  padding = 'md',
  rounded = 'lg',
  shadow = 'md',
  glass = false,
  className = '',
  children,
  ...props
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const roundedClasses = {
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  };

  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  return (
    <motion.div
      className={`
        ${glass ? 'glass' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'}
        ${paddingClasses[padding]}
        ${roundedClasses[rounded]}
        ${shadowClasses[shadow]}
        ${hover ? 'card-hover' : ''}
        transition-all duration-300
        ${className}
      `.trim()}
      whileHover={hover ? { y: -4, scale: 1.02 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Food Card Component
interface FoodCardProps extends BaseComponentProps {
  food: FoodItem;
  onAddToCart?: (food: FoodItem) => void;
  onToggleFavorite?: (food: FoodItem) => void;
  onViewDetails?: (food: FoodItem) => void;
  isFavorite?: boolean;
  showQuickAdd?: boolean;
  orientation?: 'vertical' | 'horizontal';
}

const FoodCard: React.FC<FoodCardProps> = ({
  food,
  onAddToCart,
  onToggleFavorite,
  onViewDetails,
  isFavorite = false,
  showQuickAdd = true,
  orientation = 'vertical',
  className = '',
  ...props
}) => {
  const renderRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={`${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  if (orientation === 'horizontal') {
    return (
      <BaseCard className={`flex space-x-4 ${className}`} {...props}>
        {/* Image */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <img
            src={food.images[0]?.url}
            alt={food.name}
            className="w-full h-full object-cover rounded-lg image-zoom"
          />
          {!food.availability && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <Text size="xs" className="text-white font-medium">Out of Stock</Text>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <Heading size="md" weight="semibold" className="truncate">
                {food.name}
              </Heading>
              <Text size="sm" color="muted" className="line-clamp-2">
                {food.description}
              </Text>
              
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center space-x-1">
                  {renderRatingStars(food.rating)}
                </div>
                <Text size="sm" color="muted">({food.reviewCount})</Text>
                <div className="flex items-center space-x-1">
                  <Clock size={12} className="text-gray-400" />
                  <Text size="sm" color="muted">{food.preparationTime} min</Text>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end space-y-2 ml-4">
              <Text size="lg" weight="bold" className="text-primary font-numbers">
                Rs. {food.price}
              </Text>
              {showQuickAdd && food.availability && (
                <Button
                  size="sm"
                  icon={<Plus />}
                  onClick={() => onAddToCart?.(food)}
                >
                  Add
                </Button>
              )}
            </div>
          </div>
        </div>
      </BaseCard>
    );
  }

  return (
    <BaseCard className={className} {...props}>
      {/* Image */}
      <div className="relative mb-4">
        <img
          src={food.images[0]?.url}
          alt={food.name}
          className="w-full h-48 object-cover rounded-lg image-zoom cursor-pointer"
          onClick={() => onViewDetails?.(food)}
        />
        
        {/* Favorite Button */}
        <motion.button
          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-md"
          onClick={() => onToggleFavorite?.(food)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart 
            size={16} 
            className={isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'} 
          />
        </motion.button>

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-primary text-white px-2 py-1 rounded-full">
          <Text size="xs" className="font-medium">{food.category.name}</Text>
        </div>

        {/* Availability Overlay */}
        {!food.availability && (
          <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
            <Text size="sm" className="text-white font-medium">Out of Stock</Text>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div>
          <Heading size="md" weight="semibold" className="line-clamp-1">
            {food.name}
          </Heading>
          <Text size="sm" color="muted" className="line-clamp-2">
            {food.description}
          </Text>
        </div>

        {/* Rating and Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {renderRatingStars(food.rating)}
            </div>
            <Text size="sm" color="muted">({food.reviewCount})</Text>
          </div>
          <div className="flex items-center space-x-1">
            <Clock size={12} className="text-gray-400" />
            <Text size="sm" color="muted">{food.preparationTime} min</Text>
          </div>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <Text size="lg" weight="bold" className="text-primary font-numbers">
            Rs. {food.price}
          </Text>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              icon={<Eye />}
              onClick={() => onViewDetails?.(food)}
            />
            {showQuickAdd && food.availability && (
              <Button
                size="sm"
                icon={<Plus />}
                onClick={() => onAddToCart?.(food)}
              >
                Add
              </Button>
            )}
          </div>
        </div>
      </div>
    </BaseCard>
  );
};

// Dashboard Card Component
interface DashboardCardProps extends BaseComponentProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'danger';
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'primary',
  className = '',
  ...props
}) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-green-500/10 text-green-600',
    warning: 'bg-yellow-500/10 text-yellow-600',
    danger: 'bg-red-500/10 text-red-600'
  };

  return (
    <BaseCard glass className={className} {...props}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Text size="sm" color="muted" className="font-medium">
            {title}
          </Text>
          <Heading size="2xl" weight="bold" className="mt-2 font-numbers">
            {value}
          </Heading>
          {subtitle && (
            <Text size="sm" color="muted" className="mt-1">
              {subtitle}
            </Text>
          )}
          {trend && (
            <div className="flex items-center space-x-1 mt-2">
              <TrendingUp 
                size={14} 
                className={trend.isPositive ? 'text-green-500' : 'text-red-500 rotate-180'} 
              />
              <Text 
                size="sm" 
                className={trend.isPositive ? 'text-green-600' : 'text-red-600'}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </Text>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            {React.cloneElement(icon as React.ReactElement, { size: 24 })}
          </div>
        )}
      </div>
    </BaseCard>
  );
};

// Order Card Component
interface OrderCardProps extends BaseComponentProps {
  order: Order;
  onViewDetails?: (order: Order) => void;
  onReorder?: (order: Order) => void;
  showActions?: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  onViewDetails,
  onReorder,
  showActions = true,
  className = '',
  ...props
}) => {
  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      confirmed: 'text-blue-600 bg-blue-100',
      preparing: 'text-orange-600 bg-orange-100',
      ready: 'text-purple-600 bg-purple-100',
      out_for_delivery: 'text-indigo-600 bg-indigo-100',
      delivered: 'text-green-600 bg-green-100',
      cancelled: 'text-red-600 bg-red-100'
    };
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-100';
  };

  return (
    <BaseCard className={className} {...props}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <Text size="sm" color="muted">Order #{order.id.slice(-8)}</Text>
            <Text size="sm" color="muted">
              {new Date(order.createdAt).toLocaleDateString()}
            </Text>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
            {order.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        {/* Items */}
        <div>
          <Text size="sm" weight="medium" className="mb-2">
            {order.items.length} item(s)
          </Text>
          <div className="space-y-1">
            {order.items.slice(0, 3).map((item, index) => (
              <Text key={index} size="sm" color="muted">
                {item.quantity}x {item.foodId} {/* In real app, this would be food name */}
              </Text>
            ))}
            {order.items.length > 3 && (
              <Text size="sm" color="muted">
                +{order.items.length - 3} more items
              </Text>
            )}
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <Text size="lg" weight="bold" className="font-numbers">
            Rs. {order.total}
          </Text>
          {showActions && (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewDetails?.(order)}
              >
                View
              </Button>
              {order.status === 'delivered' && (
                <Button
                  size="sm"
                  onClick={() => onReorder?.(order)}
                >
                  Reorder
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </BaseCard>
  );
};

export { BaseCard, FoodCard, DashboardCard, OrderCard };