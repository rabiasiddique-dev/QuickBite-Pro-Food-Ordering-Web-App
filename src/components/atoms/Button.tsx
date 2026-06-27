import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import type { BaseComponentProps } from '@/types';

interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  fullWidth = false,
  className = '',
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-heading font-medium rounded-lg transition-all duration-200 focus-ring btn-magnetic disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary to-primary-600 text-white hover:shadow-lg hover:shadow-primary/25 active:scale-95',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 hover:shadow-lg active:scale-95',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white hover:shadow-lg active:scale-95',
    ghost: 'text-primary hover:bg-primary/10 hover:text-primary-700 active:scale-95'
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-[14px] gap-2',
    md: 'px-6 py-3.5 text-[18px] gap-2',
    lg: 'px-8 py-4 text-[20px] gap-3'
  };

  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim();

  const iconElement = loading ? (
    <Loader2 className="animate-spin" size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18} />
  ) : icon ? (
    <span className="inline-flex">
      {React.cloneElement(icon as React.ReactElement, {
        size: size === 'sm' ? 16 : size === 'lg' ? 20 : 18
      })}
    </span>
  ) : null;

  return (
    <motion.button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { y: -2 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      {...props}
    >
      {iconPosition === 'left' && iconElement}
      {children}
      {iconPosition === 'right' && iconElement}
    </motion.button>
  );
};

export default Button;