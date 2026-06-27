import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Home, 
  User, 
  ShoppingBag, 
  Heart, 
  Settings, 
  Bell,
  MapPin,
  CreditCard,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { Button, Text, Heading } from '@/components/atoms';
import type { BaseComponentProps, User as UserType } from '@/types';

interface SidebarProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserType;
  navigation: NavItem[];
  activeItem?: string;
  onNavigate?: (item: string) => void;
  onLogout?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href?: string;
  badge?: string | number;
  onClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  user,
  navigation,
  activeItem,
  onNavigate,
  onLogout,
  className = '',
  ...props
}) => {
  const defaultNavigation: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag, badge: '3' },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payments', label: 'Payment Methods', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: '2' },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle }
  ];

  const navItems = navigation.length > 0 ? navigation : defaultNavigation;

  const sidebarVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const overlayVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 }
  };

  const itemVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    closed: {
      opacity: 0,
      x: -20
    }
  };

  const containerVariants = {
    open: {
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    },
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            className={`
              fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-900 z-50
              glass backdrop-blur-lg border-r border-gray-200 dark:border-gray-700
              flex flex-col shadow-2xl
              ${className}
            `.trim()}
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            {...props}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <img src="/logo.png" alt="QuickBite Pro" className="w-10 h-10 rounded-xl object-contain" />
                <span className="font-medium text-lg bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                  QuickBite Pro
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon={<X />}
                onClick={onClose}
                className="p-2"
              />
            </div>

            {/* User Profile Section */}
            {user && (
              <motion.div 
                className="p-6 border-b border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center space-x-4">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-primary/20"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-600 rounded-full flex items-center justify-center ring-4 ring-primary/20">
                      <Text className="text-white font-medium text-2xl">
                        {user.name.charAt(0).toUpperCase()}
                      </Text>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <Heading size="md" weight="semibold" className="truncate">
                      {user.name}
                    </Heading>
                    <Text size="sm" color="muted" className="truncate">
                      {user.email}
                    </Text>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-accent rounded-full"></div>
                        <Text size="xs" color="muted">Online</Text>
                      </div>
                      <Text size="xs" color="muted" className="font-numbers">
                        125 Points
                      </Text>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Navigation */}
            <motion.div 
              className="flex-1 py-4 overflow-y-auto custom-scrollbar"
              variants={containerVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <nav className="space-y-2 px-4">
                {navItems.map((item) => {
                  const isActive = activeItem === item.id;
                  const IconComponent = item.icon;

                  return (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                    >
                      <motion.button
                        onClick={() => {
                          if (item.onClick) {
                            item.onClick();
                          } else if (onNavigate) {
                            onNavigate(item.id);
                          }
                        }}
                        className={`
                          w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                          transition-all duration-200 group relative overflow-hidden
                          ${isActive 
                            ? 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/20' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                          }
                        `.trim()}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {/* Active indicator */}
                        {isActive && (
                          <motion.div
                            className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
                            layoutId="activeIndicator"
                          />
                        )}

                        <IconComponent 
                          size={20} 
                          className={`
                            transition-colors duration-200
                            ${isActive ? 'text-primary' : 'text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'}
                          `}
                        />
                        <Text 
                          size="sm" 
                          weight={isActive ? "medium" : "normal"}
                          className="flex-1 text-left"
                        >
                          {item.label}
                        </Text>
                        
                        {/* Badge */}
                        {item.badge && (
                          <motion.span
                            className="bg-primary text-white text-xs font-medium px-2 py-1 rounded-full"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            {item.badge}
                          </motion.span>
                        )}
                      </motion.button>
                    </motion.div>
                  );
                })}
              </nav>
            </motion.div>

            {/* Footer */}
            {user && (
              <motion.div 
                className="p-4 border-t border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  variant="ghost"
                  fullWidth
                  icon={<LogOut />}
                  iconPosition="left"
                  onClick={onLogout}
                  className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  Sign Out
                </Button>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;