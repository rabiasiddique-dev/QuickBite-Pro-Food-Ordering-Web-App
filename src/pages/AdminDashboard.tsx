import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ShoppingBag, 
  MessageSquare,
  DollarSign,
  TrendingUp,
  Users,
  Award,
  Trash2,
  Edit3,
  Plus,
  Check,
  X,
  PlusCircle,
  Star
} from 'lucide-react';
import { Heading, Text, Button } from '@/components/atoms';
import { mockCategories } from '@/data/mockData';
import { dbService } from '@/services/dbService';
import type { FoodItem, Order, Review, OrderStatus, FoodCategory } from '@/types';
import { v4 as uuidv4 } from 'uuid';

// Mock chart data
const revenueData = [
  { name: 'Mon', value: 24000 },
  { name: 'Tue', value: 36000 },
  { name: 'Wed', value: 32000 },
  { name: 'Thu', value: 45000 },
  { name: 'Fri', value: 54000 },
  { name: 'Sat', value: 72000 },
  { name: 'Sun', value: 68000 }
];

const customerData = [
  { name: 'New Customers', value: 400 },
  { name: 'Repeat Customers', value: 700 }
];

const COLORS = ['#FF6B35', '#22C55E'];

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'foods' | 'orders' | 'reviews'>('overview');

  // Stored lists
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // Add Food form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState(mockCategories[0].id);

  // Review reply states
  const [replyText, setReplyText] = useState<{ [reviewId: string]: string }>({});

  useEffect(() => {
    const unsubFoods = dbService.listenToFoods(setFoods);
    const unsubOrders = dbService.listenToOrders(setOrders);
    const unsubReviews = dbService.listenToReviews(setReviews);

    return () => {
      unsubFoods();
      unsubOrders();
      unsubReviews();
    };
  }, []);

  // Food Management Actions
  const handleToggleAvailability = async (foodId: string) => {
    const food = foods.find(f => f.id === foodId);
    if (food) {
      await dbService.updateFood(foodId, { availability: !food.availability });
    }
  };

  const handleDeleteFood = async (foodId: string) => {
    if (window.confirm('Delete this dish?')) {
      await dbService.deleteFood(foodId);
    }
  };

  const handleAddFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPrice || !newDesc) return;

    const cat = mockCategories.find(c => c.id === newCategory) || mockCategories[0];

    const newFood: FoodItem = {
      id: `food-${uuidv4().substring(0, 4)}`,
      name: newName,
      price: Number(newPrice),
      description: newDesc,
      category: cat,
      images: [
        { id: uuidv4(), url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80', alt: newName, type: 'main', sortOrder: 1 }
      ],
      ingredients: ['Standard Ingredients'],
      nutritionalInfo: { calories: 350, protein: 15, carbs: 40, fat: 12, fiber: 2, sodium: 500 },
      allergens: [],
      tags: [],
      availability: true,
      preparationTime: 15,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await dbService.addFood(newFood);
    setShowAddForm(false);
    setNewName('');
    setNewPrice('');
    setNewDesc('');
  };

  // Order Management Actions
  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    await dbService.updateOrder(orderId, { status });
  };

  // Review Actions
  const handleApproveReview = async (revId: string) => {
    await dbService.updateReview(revId, { isApproved: true });
  };

  const handleReplyReview = async (revId: string) => {
    const text = replyText[revId];
    if (!text) return;

    await dbService.updateReview(revId, {
      adminResponse: {
        message: text,
        respondedBy: 'QuickBite Admin',
        respondedAt: new Date()
      }
    });

    setReplyText(prev => ({ ...prev, [revId]: '' }));
  };

  // Calculations for overview cards
  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 py-8 px-4">
      <div className="container mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <div className="md:col-span-3 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 p-5 rounded-3xl backdrop-blur-md space-y-4 text-left">
          <Heading as="h2" size="sm" className="font-medium text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-white/5">
            Admin Panel
          </Heading>

          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-3 px-4.5 py-3 rounded-2xl text-xs font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-primary/15 text-primary border border-primary/10'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="h-4.5 w-4.5" />
              Overview
            </button>

            <button
              onClick={() => setActiveTab('foods')}
              className={`flex items-center gap-3 px-4.5 py-3 rounded-2xl text-xs font-medium transition-all ${
                activeTab === 'foods'
                  ? 'bg-primary/15 text-primary border border-primary/10'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <UtensilsCrossed className="h-4.5 w-4.5" />
              Manage Dishes
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-3 px-4.5 py-3 rounded-2xl text-xs font-medium transition-all ${
                activeTab === 'orders'
                  ? 'bg-primary/15 text-primary border border-primary/10'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              Manage Orders
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex items-center gap-3 px-4.5 py-3 rounded-2xl text-xs font-medium transition-all ${
                activeTab === 'reviews'
                  ? 'bg-primary/15 text-primary border border-primary/10'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <MessageSquare className="h-4.5 w-4.5" />
              Reviews Moderation
            </button>
          </nav>
        </div>

        {/* Tab Content Panel */}
        <div className="md:col-span-9 space-y-6">
          <AnimatePresence mode="wait">
            
            {/* OVERVIEW PANEL */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Stats Widgets */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 p-5 rounded-3xl text-left space-y-2 shadow-sm">
                    <div className="p-2.5 bg-primary/10 text-primary w-fit rounded-xl">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Total Sales</span>
                      <span className="text-xl font-medium text-slate-900 dark:text-white font-numbers">Rs. {totalRevenue}</span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 p-5 rounded-3xl text-left space-y-2 shadow-sm">
                    <div className="p-2.5 bg-green-500/10 text-green-500 w-fit rounded-xl">
                      <ShoppingBag className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Total Orders</span>
                      <span className="text-xl font-medium text-slate-900 dark:text-white font-numbers">{orders.length}</span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 p-5 rounded-3xl text-left space-y-2 shadow-sm">
                    <div className="p-2.5 bg-amber-500/10 text-amber-500 w-fit rounded-xl">
                      <UtensilsCrossed className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">Registered Foods</span>
                      <span className="text-xl font-medium text-slate-900 dark:text-white font-numbers">{foods.length}</span>
                    </div>
                  </div>
                </div>

                {/* Recharts Graphs */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Revenue Line Chart */}
                  <div className="lg:col-span-8 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 p-6 rounded-3xl text-left shadow-sm">
                    <Heading as="h4" size="xs" className="font-medium text-slate-900 dark:text-white mb-4">Revenue Trend (Weekly)</Heading>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={revenueData}>
                          <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                          <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                          <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff' }} />
                          <Line type="monotone" dataKey="value" stroke="#FF6B35" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Customer Pie Chart */}
                  <div className="lg:col-span-4 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 p-6 rounded-3xl text-left shadow-sm flex flex-col justify-between">
                    <div>
                      <Heading as="h4" size="xs" className="font-medium text-slate-900 dark:text-white mb-4">Customer Types</Heading>
                      <div className="h-44 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={customerData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={70}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {customerData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    {/* Legend */}
                    <div className="flex justify-center gap-4 text-xs font-medium text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                        <span>New</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                        <span>Repeat</span>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* FOOD MANAGEMENT PANEL */}
            {activeTab === 'foods' && (
              <motion.div
                key="foods"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6 text-left"
              >
                <div className="flex justify-between items-center">
                  <Heading as="h3" size="xs" className="font-medium text-slate-900 dark:text-white">Kitchen Menu List</Heading>
                  <Button
                    onClick={() => setShowAddForm(!showAddForm)}
                    variant="primary"
                    className="flex items-center gap-1.5 py-2 px-4 text-xs font-medium rounded-xl"
                  >
                    <PlusCircle className="h-4 w-4" />
                    New Dish
                  </Button>
                </div>

                {/* Add Food Form Overlay */}
                {showAddForm && (
                  <form onSubmit={handleAddFood} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-white/10 space-y-4 shadow-xl">
                    <span className="text-xs font-medium text-white block">Add New Dish Details</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-medium text-slate-400 uppercase">Dish Name</label>
                        <input
                          type="text"
                          placeholder="Spicy Pepperoni Pizza"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-950 dark:text-white focus:outline-none"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-medium text-slate-400 uppercase">Price (Rs.)</label>
                          <input
                            type="number"
                            placeholder="1450"
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-950 dark:text-white focus:outline-none"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-medium text-slate-400 uppercase">Category</label>
                          <select
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-950 dark:text-white focus:outline-none"
                          >
                            {mockCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-medium text-slate-400 uppercase">Description</label>
                      <textarea
                        placeholder="Describe ingredients, prep style, and portion details..."
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-slate-950 dark:text-white focus:outline-none h-20 resize-none"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" variant="primary" className="py-2.5 px-4 text-xs font-medium">Save Item</Button>
                      <Button type="button" onClick={() => setShowAddForm(false)} variant="outline" className="py-2.5 px-4 text-xs font-medium">Cancel</Button>
                    </div>
                  </form>
                )}

                {/* Table representation */}
                <div className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 p-5 rounded-3xl overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-white/5 text-slate-400 font-medium uppercase">
                        <th className="pb-3 pr-4">Dish</th>
                        <th className="pb-3 pr-4">Category</th>
                        <th className="pb-3 pr-4">Price</th>
                        <th className="pb-3 pr-4">Availability</th>
                        <th className="pb-3 text-right">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {foods.map((food) => (
                        <tr key={food.id} className="border-b border-slate-100 dark:border-white/5 last:border-0 hover:bg-slate-100/50 dark:hover:bg-white/5 transition-colors">
                          <td className="py-3.5 pr-4">
                            <div className="flex items-center gap-3">
                              <img src={food.images[0]?.url} alt="dish" className="w-10 h-10 rounded-lg object-cover" />
                              <span className="font-medium text-slate-900 dark:text-white">{food.name}</span>
                            </div>
                          </td>
                          <td className="py-3.5 pr-4 text-slate-500 font-medium">{food.category.name}</td>
                          <td className="py-3.5 pr-4 font-medium font-numbers text-primary">Rs. {food.price}</td>
                          <td className="py-3.5 pr-4">
                            <button
                              onClick={() => handleToggleAvailability(food.id)}
                              className={`px-3 py-1 rounded-full text-[10px] font-medium transition-all ${
                                food.availability 
                                  ? 'bg-green-500/10 text-green-500' 
                                  : 'bg-red-500/10 text-red-500'
                              }`}
                            >
                              {food.availability ? 'Available' : 'Sold Out'}
                            </button>
                          </td>
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => handleDeleteFood(food.id)}
                              className="p-1.5 text-slate-400 hover:text-red-400 rounded transition-colors"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* ORDER MANAGEMENT PANEL */}
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6 text-left"
              >
                <Heading as="h3" size="xs" className="font-medium text-slate-900 dark:text-white">Active Order Dispatch Desk</Heading>

                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-slate-800/30 border rounded-3xl">
                      <Text className="text-slate-400 text-xs">No active orders placed by consumers.</Text>
                    </div>
                  ) : (
                    orders.map(ord => (
                      <div key={ord.id} className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 p-5 rounded-3xl space-y-4">
                        <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-100 dark:border-white/5 pb-3">
                          <div>
                            <span className="text-[10px] font-medium text-slate-400 block uppercase">Order reference</span>
                            <span className="text-xs font-medium text-slate-950 dark:text-white font-numbers">{ord.id}</span>
                          </div>
                          <div className="flex gap-2">
                            {ord.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleUpdateOrderStatus(ord.id, 'confirmed')}
                                  className="px-3.5 py-1.5 bg-green-500 text-white rounded-lg font-medium text-[10px] flex items-center gap-1"
                                >
                                  <Check className="h-3.5 w-3.5" /> Accept
                                </button>
                                <button
                                  onClick={() => handleUpdateOrderStatus(ord.id, 'cancelled')}
                                  className="px-3.5 py-1.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg font-medium text-[10px] flex items-center gap-1"
                                >
                                  <X className="h-3.5 w-3.5" /> Reject
                                </button>
                              </>
                            )}

                            {ord.status === 'confirmed' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(ord.id, 'preparing')}
                                className="px-3.5 py-1.5 bg-primary text-white rounded-lg font-medium text-[10px]"
                              >
                                Send to Prep Kitchen
                              </button>
                            )}

                            {ord.status === 'preparing' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(ord.id, 'out_for_delivery')}
                                className="px-3.5 py-1.5 bg-blue-500 text-white rounded-lg font-medium text-[10px]"
                              >
                                Dispatch Rider
                              </button>
                            )}

                            {ord.status === 'out_for_delivery' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(ord.id, 'delivered')}
                                className="px-3.5 py-1.5 bg-green-500 text-white rounded-lg font-medium text-[10px]"
                              >
                                Mark as Delivered
                              </button>
                            )}

                            {ord.status === 'delivered' && (
                              <span className="px-3.5 py-1.5 bg-green-500/10 text-green-500 rounded-lg font-medium text-[10px]">
                                Delivered
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Customer & pricing info */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                          <div>
                            <span className="text-[10px] text-slate-400 block font-medium">Bill amount</span>
                            <span className="font-medium text-slate-900 dark:text-white font-numbers">Rs. {ord.total}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-medium">Payment</span>
                            <span className="font-medium text-slate-900 dark:text-white capitalize">{ord.paymentMethod.type.replace(/_/g, ' ')}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-[10px] text-slate-400 block font-medium">Delivery address</span>
                            <span className="font-medium text-slate-900 dark:text-white truncate block">{ord.deliveryAddress.street}, {ord.deliveryAddress.city}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* REVIEWS PANEL */}
            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6 text-left"
              >
                <Heading as="h3" size="xs" className="font-medium text-slate-900 dark:text-white">Customer Reviews Moderation</Heading>

                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-slate-800/30 border rounded-3xl">
                      <Text className="text-slate-400 text-xs">No reviews submitted yet.</Text>
                    </div>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev.id} className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 p-5 rounded-3xl space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="text-xs font-medium text-slate-900 dark:text-white">Customer: {rev.customerName || rev.customerId}</span>
                            <div className="flex text-amber-500 gap-0.5 mt-0.5">
                              {Array.from({ length: rev.rating }).map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-current" />
                              ))}
                            </div>
                          </div>
                          {!rev.isApproved && (
                            <button
                              onClick={() => handleApproveReview(rev.id)}
                              className="px-3.5 py-1 bg-green-500 text-white rounded-lg font-medium text-[10px] flex items-center gap-1"
                            >
                              Approve Review
                            </button>
                          )}
                        </div>

                        {rev.title && <span className="text-xs font-medium text-primary block">{rev.title}</span>}
                        <p className="text-xs text-slate-600 dark:text-slate-300 font-body">{rev.comment}</p>

                        {/* Admin reply log */}
                        {rev.adminResponse ? (
                          <div className="pl-3 border-l-2 border-primary bg-primary/5 p-2 rounded-r-xl">
                            <span className="text-[10px] font-medium text-white block">Response posted:</span>
                            <p className="text-[10px] text-slate-300 font-body">{rev.adminResponse.message}</p>
                          </div>
                        ) : (
                          <div className="flex gap-2 pt-2">
                            <input
                              type="text"
                              placeholder="Write a response..."
                              value={replyText[rev.id] || ''}
                              onChange={(e) => setReplyText(prev => ({ ...prev, [rev.id]: e.target.value }))}
                              className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-950 dark:text-white focus:outline-none"
                            />
                            <button
                              onClick={() => handleReplyReview(rev.id)}
                              className="bg-primary hover:bg-primary/80 text-white text-xs font-medium rounded-xl px-4 py-2 transition-colors"
                            >
                              Reply
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
