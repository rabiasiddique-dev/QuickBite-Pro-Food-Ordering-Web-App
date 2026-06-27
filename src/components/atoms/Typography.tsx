import React from 'react';
import type { BaseComponentProps } from '@/types';

// Heading Components
interface HeadingProps extends BaseComponentProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  color?: 'primary' | 'secondary' | 'accent' | 'muted' | 'white' | 'gradient';
}

const Heading: React.FC<HeadingProps> = ({
  as: Component = 'h1',
  size = 'lg',
  weight = 'bold',
  color = 'primary',
  className = '',
  children,
  ...props
}) => {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl md:text-4xl lg:text-5xl',
    '4xl': 'text-4xl md:text-5xl lg:text-6xl xl:text-7xl'
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-medium',
    bold: 'font-medium',
    extrabold: 'font-medium'
  };

  const colorClasses = {
    primary: 'text-gray-900 dark:text-gray-100',
    secondary: 'text-gray-700 dark:text-gray-300',
    accent: 'text-accent',
    muted: 'text-gray-500 dark:text-gray-400',
    white: 'text-white',
    gradient: 'text-gradient'
  };

  const combinedClasses = `
    font-heading
    ${sizeClasses[size]}
    ${weightClasses[weight]}
    ${colorClasses[color]}
    ${className}
  `.trim();

  return (
    <Component className={combinedClasses} {...props}>
      {children}
    </Component>
  );
};

// Text Component â€” renamed internally to BodyText to avoid collision with browser's window.Text DOM API
interface TextProps extends BaseComponentProps {
  as?: 'p' | 'span' | 'div';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'muted' | 'white' | 'accent';
  align?: 'left' | 'center' | 'right' | 'justify';
}

const BodyText: React.FC<TextProps> = ({
  as: Component = 'p',
  size = 'md',
  weight = 'normal',
  color = 'primary',
  align = 'left',
  className = '',
  children,
  ...props
}) => {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-medium',
    bold: 'font-medium'
  };

  const colorClasses = {
    primary: 'text-gray-900 dark:text-gray-100',
    secondary: 'text-gray-700 dark:text-gray-300',
    muted: 'text-gray-500 dark:text-gray-400',
    white: 'text-white',
    accent: 'text-accent'
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  };

  const combinedClasses = `
    font-body
    ${sizeClasses[size]}
    ${weightClasses[weight]}
    ${colorClasses[color]}
    ${alignClasses[align]}
    ${className}
  `.trim();

  return (
    <Component className={combinedClasses} {...props}>
      {children}
    </Component>
  );
};

// Display Component for Hero Text
interface DisplayProps extends BaseComponentProps {
  size?: '1' | '2' | '3' | '4';
  gradient?: boolean;
}

const Display: React.FC<DisplayProps> = ({
  size = '2',
  gradient = false,
  className = '',
  children,
  ...props
}) => {
  const sizeClasses = {
    '1': 'text-5xl md:text-6xl lg:text-7xl xl:text-8xl',
    '2': 'text-4xl md:text-5xl lg:text-6xl xl:text-7xl',
    '3': 'text-3xl md:text-4xl lg:text-5xl xl:text-6xl',
    '4': 'text-2xl md:text-3xl lg:text-4xl xl:text-5xl'
  };

  const combinedClasses = `
    font-heading font-medium leading-tight tracking-tight
    ${sizeClasses[size]}
    ${gradient ? 'text-gradient' : 'text-gray-900 dark:text-gray-100'}
    ${className}
  `.trim();

  return (
    <h1 className={combinedClasses} {...props}>
      {children}
    </h1>
  );
};

// Export BodyText as Text to preserve public API
export { Heading, BodyText as Text, Display };