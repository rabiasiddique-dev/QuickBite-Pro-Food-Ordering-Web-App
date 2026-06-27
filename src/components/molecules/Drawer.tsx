import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button, Heading } from '@/components/atoms';
import type { BaseComponentProps } from '@/types';

interface DrawerProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  position?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'full';
  title?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  footer?: React.ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  position = 'right',
  size = 'md',
  title,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  footer,
  className = '',
  children,
  ...props
}) => {
  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const getSizeClasses = () => {
    if (position === 'left' || position === 'right') {
      const widths = {
        sm: 'w-80',
        md: 'w-96',
        lg: 'w-[500px]',
        full: 'w-full'
      };
      return `${widths[size]} h-full`;
    } else {
      const heights = {
        sm: 'h-80',
        md: 'h-96',
        lg: 'h-[500px]',
        full: 'h-full'
      };
      return `${heights[size]} w-full`;
    }
  };

  const getPositionClasses = () => {
    const positions = {
      left: 'top-0 left-0',
      right: 'top-0 right-0',
      top: 'top-0 left-0',
      bottom: 'bottom-0 left-0'
    };
    return positions[position];
  };

  const getAnimationVariants = () => {
    const variants = {
      left: {
        hidden: { x: '-100%' },
        visible: { x: 0 },
        exit: { x: '-100%' }
      },
      right: {
        hidden: { x: '100%' },
        visible: { x: 0 },
        exit: { x: '100%' }
      },
      top: {
        hidden: { y: '-100%' },
        visible: { y: 0 },
        exit: { y: '-100%' }
      },
      bottom: {
        hidden: { y: '100%' },
        visible: { y: 0 },
        exit: { y: '100%' }
      }
    };
    return variants[position];
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  const drawerVariants = getAnimationVariants();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeOnOverlayClick ? onClose : undefined}
          />

          {/* Drawer */}
          <motion.div
            className={`
              fixed ${getPositionClasses()} ${getSizeClasses()}
              bg-white dark:bg-gray-900 shadow-2xl
              glass backdrop-blur-md border border-gray-200 dark:border-gray-700
              ${position === 'left' ? 'border-r' : ''}
              ${position === 'right' ? 'border-l' : ''}
              ${position === 'top' ? 'border-b rounded-b-2xl' : ''}
              ${position === 'bottom' ? 'border-t rounded-t-2xl' : ''}
              flex flex-col
              ${className}
            `.trim()}
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            {...props}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                {title && (
                  <Heading size="lg" weight="semibold">
                    {title}
                  </Heading>
                )}
                {showCloseButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<X />}
                    onClick={onClose}
                    className="p-2 ml-auto"
                  />
                )}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="p-6">
                {children}
              </div>
            </div>

            {/* Footer */}
            {footer && (
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Drawer;