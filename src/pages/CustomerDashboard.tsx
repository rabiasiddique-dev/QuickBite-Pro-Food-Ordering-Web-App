import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  ShoppingBag, 
  Wallet, 
  Award, 
  Heart, 
  Settings, 
  Bell, 
  Lock, 
  LogOut, 
  Camera, 
  Check, 
  Sparkles,
  MapPin,
  Eye,
  ChevronRight,
  TrendingUp,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Heading, Text, Button } from '@/components/atoms';
import { dbService } from '@/services/dbService';
import { useNavigate } from 'react-router-dom';
import type { Order } from '@/types';

export const CustomerDashboard: React.FC = () => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Navigation state
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'notifications'>('overview');

  // Stats / Dashboard data
  const [orders, setOrders] = useState<Order[]>([]);
  const [favCount, setFavCount] = useState(0);
  
  // Profile Form States
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileAvatar, setProfileAvatar] = useState(user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80');

  // Password States
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Notifications feed
  const [alerts, setAlerts] = useState<string[]>([
    'Your order from Crown Crust Pizza has been prepared!',
    'Claim 50% discount on first order using coupon WELCOME50.',
    'Bonus reward points (100 pts) added to your account.'
  ]);

  // Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (user) {
      const unsub = dbService.listenToOrders(setOrders, user.id);

      const favs = localStorage.getItem('quickbite_favorites');
      const parsedFavs = favs ? JSON.parse(favs) : [];
      setFavCount(parsedFavs.length);

      return () => unsub();
    }
  }, [user]);

  const handleUpdateDetails = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name: profileName, phone: profilePhone, avatar: profileAvatar })
      .then(() => showToast('Profile updated successfully!', 'success'))
      .catch((err) => showToast(err.message || 'Update failed', 'error'));
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    changePassword(oldPassword, newPassword)
      .then(() => {
        showToast('Password changed successfully!', 'success');
        setOldPassword('');
        setNewPassword('');
      })
      .catch((err) => showToast(err.message || 'Change failed', 'error'));
  };

  const handleAvatarUpload = () => {
    // Simulated upload
    const mockAvatars = [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80'
    ];
    const newAv = mockAvatars[Math.floor(Math.random() * mockAvatars.length)];
    setProfileAvatar(newAv);
  };

  const handleLogout = () => {
    logout().then(() => navigate('/'));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 py-8 px-4">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl font-medium text-sm flex items-center gap-2 ${
              toast.type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}
          >
            {toast.type === 'success' ? <Check className="h-4.5 w-4.5" /> : <Settings className="h-4.5 w-4.5" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Glassmorphic Sidebar */}
        <div className="md:col-span-3 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 p-5 rounded-3xl backdrop-blur-md space-y-6 text-left">
          
          {/* User profile brief */}
          <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100 dark:border-white/5">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
              <img src={profileAvatar} alt="avatar" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <span className="font-medium text-sm text-slate-900 dark:text-white block truncate">{user?.name}</span>
              <span className="text-[10px] text-slate-400 font-medium block uppercase">{user?.role}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-3.5 px-4.5 py-3 rounded-2xl text-xs font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-primary/15 text-primary border border-primary/10'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              Overview
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-3.5 px-4.5 py-3 rounded-2xl text-xs font-medium transition-all ${
                activeTab === 'profile'
                  ? 'bg-primary/15 text-primary border border-primary/10'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <Settings className="h-4.5 w-4.5" />
              Profile Details
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center justify-between px-4.5 py-3 rounded-2xl text-xs font-medium transition-all ${
                activeTab === 'notifications'
                  ? 'bg-primary/15 text-primary border border-primary/10'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <Bell className="h-4.5 w-4.5" />
                Notifications
              </div>
              {alerts.length > 0 && (
                <span className="bg-primary text-white text-[10px] px-1.5 py-0.5 rounded-full font-medium font-numbers">
                  {alerts.length}
                </span>
              )}
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3.5 px-4.5 py-3 rounded-2xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
            >
              {resolvedTheme === 'dark' ? (
                <>
                  <Sun className="h-4.5 w-4.5 text-amber-500" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="h-4.5 w-4.5 text-blue-500" />
                  Dark Mode
                </>
              )}
            </button>

            <div className="h-px bg-slate-100 dark:bg-white/5 my-2" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-3.5 px-4.5 py-3 rounded-2xl text-xs font-medium text-red-500 hover:bg-red-500/10 transition-all text-left"
            >
              <LogOut className="h-4.5 w-4.5" />
              Logout
            </button>
          </nav>
        </div>

        {/* Right Side: Tab content */}
        <div className="md:col-span-9 space-y-6">
          <AnimatePresence mode="wait">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Widgets Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* Total Orders Widget */}
                  <div className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 p-5 rounded-3xl text-left space-y-2 relative overflow-hidden shadow-sm">
                    <div className="p-2.5 bg-primary/10 text-primary w-fit rounded-xl">
                      <ShoppingBag className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Total Orders</span>
                      <span className="text-xl font-medium text-slate-900 dark:text-white font-numbers">{orders.length}</span>
                    </div>
                  </div>

                  {/* Wallet Balance Widget */}
                  <div className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 p-5 rounded-3xl text-left space-y-2 relative overflow-hidden shadow-sm">
                    <div className="p-2.5 bg-green-500/10 text-green-500 w-fit rounded-xl">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Wallet Balance</span>
                      <span className="text-xl font-medium text-slate-900 dark:text-white font-numbers">Rs. 2,500</span>
                    </div>
                  </div>

                  {/* Reward Points Widget */}
                  <div className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 p-5 rounded-3xl text-left space-y-2 relative overflow-hidden shadow-sm">
                    <div className="p-2.5 bg-amber-500/10 text-amber-500 w-fit rounded-xl">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Reward Points</span>
                      <span className="text-xl font-medium text-slate-900 dark:text-white font-numbers">125 pts</span>
                    </div>
                  </div>

                  {/* Favorites Widget */}
                  <div className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 p-5 rounded-3xl text-left space-y-2 relative overflow-hidden shadow-sm">
                    <div className="p-2.5 bg-red-500/10 text-red-500 w-fit rounded-xl">
                      <Heart className="h-5 w-5 fill-current" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Favorites</span>
                      <span className="text-xl font-medium text-slate-900 dark:text-white font-numbers">{favCount}</span>
                    </div>
                  </div>
                </div>

                {/* Recent Orders Table */}
                <div className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 p-6 rounded-3xl text-left space-y-4">
                  <Heading as="h3" size="xs" className="font-medium text-slate-900 dark:text-white">Recent Orders</Heading>
                  
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Text className="text-slate-400 text-xs">No orders placed yet.</Text>
                      <Button onClick={() => navigate('/menu')} variant="primary" className="mt-4 px-4 py-2 text-xs">Browse Menu</Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 font-medium uppercase tracking-wider">
                            <th className="pb-3 pr-4">Order ID</th>
                            <th className="pb-3 pr-4">Date</th>
                            <th className="pb-3 pr-4">Total Price</th>
                            <th className="pb-3 pr-4">Status</th>
                            <th className="pb-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((ord) => (
                            <tr key={ord.id} className="border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-100/50 dark:hover:bg-white/5 transition-colors">
                              <td className="py-3.5 pr-4 font-medium font-numbers">{ord.id}</td>
                              <td className="py-3.5 pr-4 text-slate-500">{new Date(ord.createdAt).toLocaleDateString()}</td>
                              <td className="py-3.5 pr-4 font-medium font-numbers text-primary">Rs. {ord.total}</td>
                              <td className="py-3.5 pr-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium capitalize ${
                                  ord.status === 'delivered' 
                                    ? 'bg-green-500/10 text-green-500' 
                                    : ord.status === 'pending'
                                    ? 'bg-yellow-500/10 text-yellow-600'
                                    : 'bg-primary/10 text-primary'
                                }`}>
                                  {ord.status.replace(/_/g, ' ')}
                                </span>
                              </td>
                              <td className="py-3.5 text-right">
                                <button
                                  onClick={() => navigate(`/order-tracking/${ord.id}`)}
                                  className="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-colors"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left"
              >
                {/* Details Form */}
                <div className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 p-6 rounded-3xl space-y-4">
                  <Heading as="h3" size="xs" className="font-medium text-slate-900 dark:text-white">Profile Information</Heading>
                  
                  {/* Avatar upload representation */}
                  <div className="flex items-center gap-4 py-2">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
                      <img src={profileAvatar} alt="avatar" className="w-full h-full object-cover" />
                      <button
                        onClick={handleAvatarUpload}
                        className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-slate-900 dark:text-white block">Avatar Photo</span>
                      <button type="button" onClick={handleAvatarUpload} className="text-[10px] text-primary font-medium underline mt-1">Change Random Photo</button>
                    </div>
                  </div>

                  <form onSubmit={handleUpdateDetails} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Full Name</label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-950 dark:text-white focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Phone Number</label>
                      <input
                        type="text"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-950 dark:text-white focus:outline-none"
                        required
                      />
                    </div>

                    <Button type="submit" variant="primary" className="py-2.5 px-4 text-xs font-medium mt-2">
                      Update Profile
                    </Button>
                  </form>
                </div>

                {/* Password Form */}
                <div className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 p-6 rounded-3xl space-y-4">
                  <Heading as="h3" size="xs" className="font-medium text-slate-900 dark:text-white">Security Settings</Heading>
                  
                  <form onSubmit={handleChangePassword} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Old Password</label>
                      <input
                        type="password"
                        placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-950 dark:text-white focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">New Password</label>
                      <input
                        type="password"
                        placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-950 dark:text-white focus:outline-none"
                        required
                      />
                    </div>

                    <Button type="submit" variant="primary" className="py-2.5 px-4 text-xs font-medium mt-2">
                      Change Password
                    </Button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 p-6 rounded-3xl text-left space-y-4"
              >
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-white/5 pb-3">
                  <Heading as="h3" size="xs" className="font-medium text-slate-900 dark:text-white">Inbox Alerts</Heading>
                  {alerts.length > 0 && (
                    <button onClick={() => setAlerts([])} className="text-xs text-slate-400 hover:text-slate-100 underline">Clear All</button>
                  )}
                </div>

                {alerts.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs">No alerts found.</div>
                ) : (
                  <div className="space-y-3">
                    {alerts.map((al, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/5 rounded-2xl flex items-start gap-3">
                        <div className="p-1.5 bg-primary/10 text-primary rounded-lg mt-0.5">
                          <Bell className="h-4 w-4" />
                        </div>
                        <Text className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed font-body">{al}</Text>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default CustomerDashboard;
