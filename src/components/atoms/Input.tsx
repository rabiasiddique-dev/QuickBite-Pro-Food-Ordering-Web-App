import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Search } from 'lucide-react';
import type { BaseComponentProps } from '@/types';

// Base Input Props
interface BaseInputProps extends BaseComponentProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

// Text Input Component
interface TextInputProps extends BaseInputProps {
  type?: 'text' | 'email' | 'password' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({
    type = 'text',
    label,
    error,
    helperText,
    required = false,
    disabled = false,
    fullWidth = false,
    placeholder,
    value,
    defaultValue,
    onChange,
    onBlur,
    onFocus,
    icon,
    iconPosition = 'left',
    className = '',
    ...props
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    const inputType = type === 'password' && showPassword ? 'text' : type;

    const baseClasses = 'block w-full rounded-lg border-2 transition-all duration-200 focus-ring';
    const stateClasses = error 
      ? 'border-red-300 focus:border-red-500' 
      : isFocused 
      ? 'border-primary focus:border-primary' 
      : 'border-gray-300 focus:border-primary';
    
    const sizeClasses = 'px-4 py-3 text-base';
    const iconPadding = icon ? (iconPosition === 'left' ? 'pl-12' : 'pr-12') : '';
    const passwordPadding = type === 'password' ? 'pr-12' : '';

    const inputClasses = `
      ${baseClasses}
      ${stateClasses}
      ${sizeClasses}
      ${iconPadding}
      ${passwordPadding}
      ${fullWidth ? 'w-full' : ''}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      ${className}
    `.trim();

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className={`absolute inset-y-0 ${iconPosition === 'left' ? 'left-0' : 'right-0'} pl-3 flex items-center pointer-events-none`}>
              {React.cloneElement(icon as React.ReactElement, {
                className: 'h-5 w-5 text-gray-400',
                'aria-hidden': 'true'
              })}
            </div>
          )}
          <motion.input
            ref={ref}
            type={inputType}
            className={inputClasses}
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            required={required}
            whileFocus={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            {...props}
          />
          {type === 'password' && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          )}
        </div>
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-600"
          >
            {error}
          </motion.p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';

// Number Input Component
interface NumberInputProps extends BaseInputProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({
    label,
    error,
    helperText,
    required = false,
    disabled = false,
    fullWidth = false,
    value,
    defaultValue,
    min,
    max,
    step = 1,
    onChange,
    onBlur,
    placeholder,
    className = '',
    ...props
  }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value === '' ? 0 : parseFloat(e.target.value);
      onChange?.(newValue);
    };

    return (
      <TextInput
        ref={ref}
        type="number"
        label={label}
        error={error}
        helperText={helperText}
        required={required}
        disabled={disabled}
        fullWidth={fullWidth}
        placeholder={placeholder}
        value={value?.toString()}
        defaultValue={defaultValue?.toString()}
        onChange={handleChange}
        onBlur={onBlur}
        className={`font-numbers ${className}`}
        min={min}
        max={max}
        step={step}
        {...props}
      />
    );
  }
);

NumberInput.displayName = 'NumberInput';

// Search Input Component
interface SearchInputProps extends BaseInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  showClearButton?: boolean;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({
    placeholder = 'Search...',
    value,
    onChange,
    onSearch,
    onClear,
    showClearButton = true,
    className = '',
    ...props
  }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        e.preventDefault();
        onSearch(value || '');
      }
    };

    return (
      <div className="relative">
        <TextInput
          ref={ref}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          icon={<Search />}
          iconPosition="left"
          className={className}
          {...props}
        />
        {showClearButton && value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

// Text Area Component
interface TextAreaProps extends BaseInputProps {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({
    label,
    error,
    helperText,
    required = false,
    disabled = false,
    fullWidth = false,
    placeholder,
    value,
    defaultValue,
    onChange,
    onBlur,
    rows = 4,
    resize = 'vertical',
    className = '',
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const baseClasses = 'block w-full rounded-lg border-2 transition-all duration-200 focus-ring px-4 py-3 text-base';
    const stateClasses = error 
      ? 'border-red-300 focus:border-red-500' 
      : isFocused 
      ? 'border-primary focus:border-primary' 
      : 'border-gray-300 focus:border-primary';

    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize'
    };

    const textareaClasses = `
      ${baseClasses}
      ${stateClasses}
      ${resizeClasses[resize]}
      ${fullWidth ? 'w-full' : ''}
      ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      ${className}
    `.trim();

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <motion.textarea
          ref={ref}
          className={textareaClasses}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          rows={rows}
          whileFocus={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          {...props}
        />
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-600"
          >
            {error}
          </motion.p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export { TextInput, NumberInput, SearchInput, TextArea };