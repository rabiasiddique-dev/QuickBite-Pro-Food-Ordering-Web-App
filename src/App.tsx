import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/molecules';
import { LoginModal, RegisterModal, CartDrawer } from '@/components/organisms';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { dbService } from '@/services/dbService';
import { Spinner, Text } from '@/components/atoms';
import { 
  LandingPage, 
  MenuPage, 
  CheckoutPage, 
  OrderTrackingPage, 
  CustomerDashboard, 
  AdminDashboard, 
  AboutUs, 
  Careers, 
  FAQs, 
  PrivacyPolicy, 
  Terms, 
  Contact, 
  NotFound 
} from '@/pages';
import { ProtectedRoute } from '@/components/atoms';
import { Phone, MapPin, Award, Mail, Globe, MessageCircle, Link2, ArrowRight, UtensilsCrossed, ShieldCheck, Zap } from 'lucide-react';

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const { user, isLoading, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  React.useEffect(() => {
    dbService.seedDatabaseIfNeeded();
  }, []);

  // Show loading spinner during initial auth check
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading QuickBite Pro...</p>
        </div>
      </div>
    );
  }

  const handleSwitchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  const handleLogout = () => {
    logout().then(() => navigate('/'));
  };

  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Navigation */}
      <Navbar
        user={user}
        cartCount={cartCount}
        onCartOpen={() => setIsCartOpen(true)}
        onAuthModalOpen={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        onProfileClick={() => navigate(user ? `/${user.role}-dashboard` : '/')}
        isScrolled={true}
      />

      {/* Main Content */}
      <main className="flex-grow pt-20">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/menu" element={<MenuPage />} />
          
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-tracking/:orderId" element={<OrderTrackingPage />} />
          
          {/* Protected Dashboards */}
          <Route path="/customer-dashboard" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin-dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Extra pages */}
          <Route path="/about" element={<AboutUs />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="relative bg-slate-950 text-white overflow-hidden">
        
        {/* Decorative top gradient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[60px] bg-primary/10 blur-[40px]" />

        {/* Pre-footer CTA Banner */}
        <div className="border-b border-white/5 py-12 px-4">
          <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-medium text-primary uppercase tracking-widest block mb-1">Ready to Order?</span>
              <h3 className="text-2xl font-medium text-white">Start your premium dining experience today.</h3>
            </div>
            <Link
              to="/menu"
              className="flex items-center gap-2 bg-gradient-to-r from-primary to-orange-500 text-white font-medium px-7 py-3.5 rounded-2xl hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all whitespace-nowrap text-sm"
            >
              Browse Menu
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="py-16 px-4">
          <div className="container mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-12 text-left">

            {/* Brand Column */}
            <div className="md:col-span-4 space-y-6">
              <div>
                <div className="flex items-center gap-2.5 mb-3">
                  <img src="/logo.png" alt="QuickBite Pro" className="w-9 h-9 rounded-xl object-contain" />
                  <span className="text-xl font-medium bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                    QuickBite Pro
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-body max-w-xs">
                  Pakistan's smartest restaurant ordering and kitchen management platform. Order faster, manage smarter, scale beautifully.
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                  <div className="p-1.5 bg-white/5 rounded-lg">
                    <Phone className="h-3.5 w-3.5 text-primary" />
                  </div>
                  +92 (300) 1234567
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                  <div className="p-1.5 bg-white/5 rounded-lg">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                  </div>
                  hello@quickbitepro.pk
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                  <div className="p-1.5 bg-white/5 rounded-lg">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                  </div>
                  Blue Area, Islamabad, Pakistan
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                <a href="#" className="p-2 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/30 rounded-xl text-slate-400 hover:text-primary transition-all">
                  <MessageCircle className="h-4 w-4" />
                </a>
                <a href="#" className="p-2 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/30 rounded-xl text-slate-400 hover:text-primary transition-all">
                  <Link2 className="h-4 w-4" />
                </a>
                <a href="#" className="p-2 bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/30 rounded-xl text-slate-400 hover:text-primary transition-all">
                  <Globe className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Company Links */}
            <div className="md:col-span-2 space-y-5">
              <span className="text-[10px] font-medium text-white uppercase tracking-[0.15em] block">Company</span>
              <div className="flex flex-col gap-3 text-xs text-slate-400 font-medium">
                <Link to="/about" className="hover:text-primary transition-colors hover:translate-x-1 transform inline-block">About Us</Link>
                <Link to="/careers" className="hover:text-primary transition-colors hover:translate-x-1 transform inline-block">Careers</Link>
                <Link to="/contact" className="hover:text-primary transition-colors hover:translate-x-1 transform inline-block">Contact Us</Link>
                <Link to="/faqs" className="hover:text-primary transition-colors hover:translate-x-1 transform inline-block">FAQs</Link>
              </div>
            </div>

            {/* Platform Links */}
            <div className="md:col-span-2 space-y-5">
              <span className="text-[10px] font-medium text-white uppercase tracking-[0.15em] block">Platform</span>
              <div className="flex flex-col gap-3 text-xs text-slate-400 font-medium">
                <Link to="/menu" className="hover:text-primary transition-colors hover:translate-x-1 transform inline-block">Browse Menu</Link>
                <Link to="/checkout" className="hover:text-primary transition-colors hover:translate-x-1 transform inline-block">Order Now</Link>
                <Link to="/admin-dashboard" className="hover:text-primary transition-colors hover:translate-x-1 transform inline-block">Admin Panel</Link>
                <Link to="/customer-dashboard" className="hover:text-primary transition-colors hover:translate-x-1 transform inline-block">My Account</Link>
              </div>
            </div>

            {/* Legal Links + Newsletter */}
            <div className="md:col-span-4 space-y-5">
              <span className="text-[10px] font-medium text-white uppercase tracking-[0.15em] block">Stay Updated</span>
              <p className="text-xs text-slate-400">Get new dish alerts and promotions directly to your inbox.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-primary/50 transition-colors"
                />
                <button className="bg-primary hover:bg-primary/80 text-white rounded-xl px-4 py-2.5 text-xs font-medium transition-colors">
                  Subscribe
                </button>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-2 pt-2">
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-[10px] font-medium text-slate-400">
                  <ShieldCheck className="h-3 w-3 text-green-400" /> Secure Payments
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-[10px] font-medium text-slate-400">
                  <Zap className="h-3 w-3 text-primary" /> Fast Delivery
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-[10px] font-medium text-slate-400">
                  <UtensilsCrossed className="h-3 w-3 text-amber-400" /> Premium Quality
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="border-t border-white/5 py-5 px-4">
          <div className="container mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] text-slate-500 font-medium">
            <span>Â© {new Date().getFullYear()} QuickBite Pro. All Rights Reserved. Built with â¤ï¸ in Pakistan.</span>
            <div className="flex items-center gap-5">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>

      </footer>

      {/* Cart Slider Overlay */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* Authentication Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={handleSwitchToRegister}
        onForgotPassword={() => console.log('Forgot password clicked')}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </div>
  );
}

export default App;