import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Heart, 
  Bell, 
  Settings,
  LogOut,
  MapPin
} from 'lucide-react';
import { Button, Text } from '@/components/atoms';
import type { BaseComponentProps, User as UserType } from '@/types';

interface NavbarProps extends BaseComponentProps {
  user?: UserType;
  cartCount: number;
  onCartOpen: () => void;
  onAuthModalOpen: () => void;
  onProfileClick?: () => void;
  onLogout?: () => void;
  isScrolled?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  user,
  cartCount,
  onCartOpen,
  onAuthModalOpen,
  onProfileClick,
  onLogout,
  isScrolled = false,
  className = '',
  ...props
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Menu', href: '/menu' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ];

  const profileMenuItems = [
    { icon: User, label: 'Profile', onClick: onProfileClick },
    { icon: Heart, label: 'Favorites', onClick: () => {} },
    { icon: Bell, label: 'Notifications', onClick: () => {} },
    { icon: Settings, label: 'Settings', onClick: () => {} },
    { icon: LogOut, label: 'Sign Out', onClick: onLogout }
  ];

  return (
    <motion.nav
      className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled ? 'glass backdrop-blur-md shadow-lg' : 'bg-transparent'}
        ${className}
      `.trim()}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <motion.a 
            href="/"
            className="flex items-center gap-2.5"
            whileHover={{ scale: 1.04 }}
          >
            <img 
              src="/logo.png" 
              alt="QuickBite Pro Logo" 
              className="w-10 h-10 rounded-xl object-contain"
            />
            <span className="font-heading font-medium text-[20px] bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent tracking-tight hidden sm:block">
              QuickBite Pro
            </span>
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors duration-200 font-heading text-[18px] font-[500] tracking-[0.2px]"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                {item.label}
              </motion.a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Location */}
            <motion.div 
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400"
              whileHover={{ scale: 1.05 }}
            >
              <MapPin size={16} />
              <Text size="sm">Delivery to Home</Text>
            </motion.div>

            {/* Cart */}
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                icon={<ShoppingCart />}
                onClick={onCartOpen}
                className="relative p-3"
              />
              {cartCount > 0 && (
                <motion.span
                  className="absolute -top-2 -right-2 bg-primary text-white text-xs font-medium rounded-full h-6 w-6 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={cartCount}
                >
                  {cartCount > 99 ? '99+' : cartCount}
                </motion.span>
              )}
            </motion.div>

            {/* User Actions */}
            {user ? (
              <div className="relative">
                <motion.button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <Text className="text-white font-medium text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </Text>
                    </div>
                  )}
                  <Text size="sm" weight="medium" className="hidden lg:block">
                    {user.name}
                  </Text>
                </motion.button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 glass rounded-lg shadow-lg py-2 z-50"
                    >
                      {profileMenuItems.map((item, index) => (
                        <motion.button
                          key={item.label}
                          onClick={item.onClick}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          whileHover={{ x: 5 }}
                        >
                          <item.icon size={16} className="text-gray-500" />
                          <Text size="sm">{item.label}</Text>
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Button onClick={onAuthModalOpen}>
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Cart */}
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="sm"
                icon={<ShoppingCart />}
                onClick={onCartOpen}
                className="p-2"
              />
              {cartCount > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 bg-primary text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={cartCount}
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </motion.span>
              )}
            </motion.div>

            {/* Hamburger Menu */}
            <Button
              variant="ghost"
              size="sm"
              icon={isMobileMenuOpen ? <X /> : <Menu />}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Navigation */}
              {navItems.map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary transition-colors font-medium"
                  whileHover={{ x: 10 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </motion.a>
              ))}

              {/* Mobile Location */}
              <div className="flex items-center space-x-2 py-2 text-gray-600 dark:text-gray-400">
                <MapPin size={16} />
                <Text size="sm">Delivery to Home</Text>
              </div>

              {/* Mobile User Actions */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 pb-3">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <Text className="text-white font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </Text>
                        </div>
                      )}
                      <Text weight="medium">{user.name}</Text>
                    </div>
                    {profileMenuItems.map((item) => (
                      <motion.button
                        key={item.label}
                        onClick={item.onClick}
                        className="w-full flex items-center space-x-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-lg px-2"
                        whileHover={{ x: 5 }}
                      >
                        <item.icon size={16} className="text-gray-500" />
                        <Text size="sm">{item.label}</Text>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <Button 
                    fullWidth 
                    onClick={onAuthModalOpen}
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;