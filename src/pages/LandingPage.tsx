import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Pizza, 
  Flame, 
  Cake, 
  CupSoda, 
  ArrowRight, 
  Star, 
  Play, 
  Plus, 
  Check,
  TrendingUp,
  Users,
  UtensilsCrossed,
  Award,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { Button, Heading, Text } from '@/components/atoms';
import { mockCategories, initialFoodItems, mockTestimonials } from '@/data/mockData';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

// Simple typing effect hook
const useTypingEffect = (words: string[], speed = 100, delay = 2000) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const activeWord = words[currentWordIndex];

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText(activeWord.substring(0, currentText.length - 1));
      }, speed / 2);
    } else {
      timer = setTimeout(() => {
        setCurrentText(activeWord.substring(0, currentText.length + 1));
      }, speed);
    }

    if (!isDeleting && currentText === activeWord) {
      timer = setTimeout(() => setIsDeleting(true), delay);
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, speed, delay]);

  return currentText;
};

// Counter component for Stats
const AnimatedCounter: React.FC<{ targetValue: number; suffix?: string; duration?: number }> = ({ 
  targetValue, 
  suffix = '', 
  duration = 1500 
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = targetValue;
    if (start === end) return;

    const totalMiliseconds = duration;
    const incrementTime = Math.abs(Math.floor(totalMiliseconds / end));

    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, Math.max(incrementTime, 10));

    return () => clearInterval(timer);
  }, [targetValue, duration, isInView]);

  return <span ref={ref} className="font-numbers">{count}{suffix}</span>;
};

// Map of category icon name to Lucide Icon
const categoryIcons: Record<string, React.FC<any>> = {
  Pizza: Pizza,
  Burger: (props: any) => (
    // Custom burger icon since burger is missing in older lucide version, or use Utensils
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 18h20v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2z" />
      <path d="M2 10h20v4H2z" />
      <path d="M3 10a9 9 0 0 1 18 0v0H3v0z" />
      <path d="M6 14v4" />
      <path d="M10 14v4" />
      <path d="M14 14v4" />
      <path d="M18 14v4" />
    </svg>
  ),
  Flame: Flame,
  Cake: Cake,
  CupSoda: CupSoda
};

export const LandingPage: React.FC = () => {
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const typingText = useTypingEffect(['Gourmet Burgers', 'Artisanal Pizzas', 'Traditional BBQ', 'Sweet Treats', 'Fresh Shakes'], 120, 2500);

  // Parallax mouse hover effect on Hero Image
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const moveX = (clientX - window.innerWidth / 2) / 40;
    const moveY = (clientY - window.innerHeight / 2) / 40;
    setCoords({ x: moveX, y: moveY });
  };

  // Testimonials auto slider
  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIndex(prev => (prev + 1) % mockTestimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handleQuickAdd = (food: typeof initialFoodItems[0], e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    addItem(food, 1);
  };

  const filteredFoods = selectedCategory === 'all' 
    ? initialFoodItems.slice(0, 6)
    : initialFoodItems.filter(f => f.category.id === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300" onMouseMove={handleMouseMove}>
      
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-16 px-4">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 z-0 opacity-40 dark:opacity-30">
          <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/30 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-[100px] animate-pulse" />
        </div>

        <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Hero Content */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 text-primary rounded-full font-medium text-xs tracking-wider uppercase"
            >
              <Zap className="h-4 w-4" />
              Smarter, Faster Delivery in Pakistan
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-4"
            >
              <Heading as="h1" className="text-4xl md:text-[58px] leading-tight md:leading-[68px] font-heading font-medium text-slate-900 dark:text-white">
                Savor the Elite Taste of <br />
                <span className="bg-gradient-to-r from-primary via-orange-500 to-amber-500 bg-clip-text text-transparent">
                  QuickBite Pro
                </span>
              </Heading>
              
              <div className="h-12 mt-2 text-2xl md:text-[32px] font-heading font-medium text-slate-600 dark:text-slate-300 flex items-center justify-center lg:justify-start gap-2 md:gap-3">
                <span>Craving</span>
                <span className="text-[#FF7A30] flex items-center min-w-[180px] md:min-w-[250px]">
                  {typingText}
                  <span className="w-0.5 h-6 md:h-8 bg-[#FF7A30] ml-1 animate-[pulse_1s_infinite]"></span>
                </span>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base md:text-[20px] font-body font-[400] leading-relaxed md:leading-[34px] text-slate-500 dark:text-slate-400 max-w-[550px] mx-auto lg:mx-0 px-4 md:px-0"
            >
              Order from premium local restaurants, track your meals with a live timeline, and manage your kitchen dashboard. Crafted with modern glassmorphism UI for food lovers.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                onClick={() => navigate('/menu')}
                variant="primary"
                className="px-8 py-4 flex items-center justify-center gap-3 bg-gradient-to-r from-primary to-orange-500 text-white rounded-2xl hover:shadow-xl hover:shadow-primary/30 transform hover:-translate-y-0.5 transition-all"
              >
                Order Now
                <ArrowRight className="h-5 w-5" />
              </Button>

              <Button
                onClick={() => navigate(user ? `/${user.role}-dashboard` : '/menu')}
                variant="outline"
                className="px-8 py-4 bg-white/5 border-slate-300 dark:border-white/10 dark:text-white rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
              >
                Manage Kitchen
              </Button>
            </motion.div>
          </div>

          {/* Hero Interactive Floating Image (3D Hamburger style) */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}
              style={{
                x: coords.x,
                y: coords.y,
                rotateX: -coords.y / 2,
                rotateY: coords.x / 2,
                transformStyle: 'preserve-3d'
              }}
              className="relative w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] lg:ml-10 p-4 md:p-6 mx-auto lg:mx-0 mt-8 lg:mt-0"
            >
              {/* Backglow */}
              <div className="absolute inset-0 bg-primary/25 rounded-full blur-[60px] transform -translate-y-5" />

              {/* Floating Burger */}
              <motion.img
                src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&auto=format&fit=crop&q=80"
                alt="Elite burger"
                className="w-full h-full object-cover rounded-3xl shadow-[0_50px_80px_-15px_rgba(0,0,0,0.4)] border border-white/20 relative z-10 floating"
              />

              {/* Floating badge 1 */}
              <div className="absolute -top-4 -left-6 bg-white/20 backdrop-blur-md border border-white/30 p-3 rounded-2xl flex items-center gap-2.5 shadow-xl z-20">
                <div className="p-1.5 bg-green-500 rounded-lg text-white">
                  <Check className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs text-white/70 block font-medium">Fast Delivery</span>
                  <span className="text-xs font-medium text-white">25-30 Mins</span>
                </div>
              </div>

              {/* Floating badge 2 */}
              <div className="absolute -bottom-6 -right-6 bg-white/20 backdrop-blur-md border border-white/30 p-3.5 rounded-2xl flex items-center gap-3 shadow-xl z-20">
                <div className="flex -space-x-2.5">
                  <img className="w-7 h-7 rounded-full border-2 border-white/20 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80" alt="Avatar" />
                  <img className="w-7 h-7 rounded-full border-2 border-white/20 object-cover" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&auto=format&fit=crop&q=80" alt="Avatar" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    <span className="text-xs font-medium text-white font-numbers">4.9</span>
                  </div>
                  <span className="text-[10px] text-white/70 font-medium block">Customer Rated</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-16 px-4 bg-slate-100/50 dark:bg-slate-900/50">
        <div className="container mx-auto max-w-7xl text-center space-y-10">
          <div className="space-y-3">
            <Heading as="h2" size="md" className="text-slate-900 dark:text-white font-medium">
              Explore Popular Categories
            </Heading>
            <Text className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Find exactly what your taste buds crave with our fast-filtering smart category grid.
            </Text>
          </div>

          {/* Interactive filter buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3.5 rounded-2xl font-medium flex items-center gap-2.5 border transition-all duration-300 ${
                selectedCategory === 'all'
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/25'
                  : 'bg-white/5 border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <UtensilsCrossed className="h-5 w-5" />
              All Dishes
            </button>
            {mockCategories.map((cat) => {
              const Icon = categoryIcons[cat.icon] || Pizza;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-6 py-3.5 rounded-2xl font-medium flex items-center gap-2.5 border transition-all duration-300 ${
                    selectedCategory === cat.id
                      ? 'bg-primary border-primary text-white shadow-lg shadow-primary/25'
                      : 'bg-white/5 border-slate-300 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Grid of Dishes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            <AnimatePresence mode="popLayout">
              {filteredFoods.map((food) => (
                <motion.div
                  key={food.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group bg-white dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-3xl p-4 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer"
                  onClick={() => navigate('/menu')}
                >
                  <div>
                    {/* Food Image Container */}
                    <div className="h-48 w-full overflow-hidden rounded-2xl border border-white/5 relative">
                      <img
                        src={food.images[0].url}
                        alt={food.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-medium text-white tracking-wide uppercase flex items-center gap-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="font-numbers">{food.rating}</span>
                      </div>
                      
                      {food.tags.includes('Best Seller') && (
                        <div className="absolute top-3 left-3 bg-primary text-white px-2.5 py-1 rounded-full text-[9px] font-medium uppercase tracking-wider">
                          Best Seller
                        </div>
                      )}
                    </div>

                    {/* Food Content */}
                    <div className="mt-4 text-left">
                      <span className="text-[10px] uppercase font-medium text-primary tracking-wider font-body">
                        {food.category.name}
                      </span>
                      <Heading as="h4" size="xs" className="text-base font-medium text-slate-900 dark:text-white mt-1 group-hover:text-primary transition-colors line-clamp-1">
                        {food.name}
                      </Heading>
                      <Text className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {food.description}
                      </Text>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">Price</span>
                      <span className="text-base font-medium text-slate-900 dark:text-white font-numbers">
                        Rs. {food.price}
                      </span>
                    </div>
                    
                    <button
                      onClick={(e) => handleQuickAdd(food, e)}
                      className="p-2.5 bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white rounded-xl transition-all duration-300"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="pt-6">
            <Button
              onClick={() => navigate('/menu')}
              variant="outline"
              className="px-8 py-3.5 border-primary text-primary font-medium hover:bg-primary hover:text-white transition-all rounded-2xl"
            >
              See Full Premium Menu
            </Button>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-16 px-4 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,107,53,0.1),transparent_70%)] z-0" />
        <div className="container mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-medium text-primary">
              <AnimatedCounter targetValue={50} suffix="K+" />
            </div>
            <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Orders Delivered</span>
          </div>

          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-medium text-primary">
              <AnimatedCounter targetValue={10} suffix="K+" />
            </div>
            <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Happy Customers</span>
          </div>

          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-medium text-primary">
              <AnimatedCounter targetValue={150} suffix="+" />
            </div>
            <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Elite Restaurants</span>
          </div>

          <div className="space-y-2">
            <div className="text-4xl md:text-5xl font-medium text-primary">
              <AnimatedCounter targetValue={99} suffix="%" />
            </div>
            <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">Satisfaction Rate</span>
          </div>
        </div>
      </section>

      {/* STORY / TIMELINE SECTION */}
      <section className="py-20 px-4 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto max-w-5xl space-y-16">
          <div className="text-center space-y-3">
            <Heading as="h2" size="md" className="text-slate-900 dark:text-white font-medium">
              The Restaurant Journey
            </Heading>
            <Text className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              How we built a smart kitchen and dining ecosystem step by step.
            </Text>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Center vertical line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/0 via-primary/30 to-primary/0 -translate-x-1/2" />

            <div className="space-y-12">

              {/* Item 1 - LEFT */}
              <div className="relative flex flex-col md:flex-row items-start gap-6">
                <div className="md:w-1/2 md:text-right md:pr-16">
                  <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow text-left md:text-right">
                    <span className="text-sm font-medium text-primary font-numbers block mb-1">2024 - Foundation</span>
                    <Heading as="h4" size="md" className="font-medium text-slate-900 dark:text-white">First Smart Terminal</Heading>
                    <Text className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      We launched our pilot restaurant management software in Islamabad, helping local diners automate billing and recipes.
                    </Text>
                  </div>
                </div>
                {/* Center dot */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-primary border-4 border-slate-50 dark:border-slate-950 shadow-lg shadow-primary/30 z-10 top-5" />
                <div className="md:w-1/2 md:pl-16 hidden md:block" />
              </div>

              {/* Item 2 - RIGHT */}
              <div className="relative flex flex-col md:flex-row items-start gap-6">
                <div className="md:w-1/2 md:pr-16 hidden md:block" />
                {/* Center dot */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-primary border-4 border-slate-50 dark:border-slate-950 shadow-lg shadow-primary/30 z-10 top-5" />
                <div className="md:w-1/2 md:pl-16">
                  <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                    <span className="text-sm font-medium text-primary font-numbers block mb-1">2025 - Scale</span>
                    <Heading as="h4" size="md" className="font-medium text-slate-900 dark:text-white">Elite Logistics</Heading>
                    <Text className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      Partnered with 100+ restaurants and integrated smart delivery networks with hot-insulated bags and location tracking.
                    </Text>
                  </div>
                </div>
              </div>

              {/* Item 3 - LEFT */}
              <div className="relative flex flex-col md:flex-row items-start gap-6">
                <div className="md:w-1/2 md:text-right md:pr-16">
                  <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow text-left md:text-right">
                    <span className="text-sm font-medium text-primary font-numbers block mb-1">2026 - Present</span>
                    <Heading as="h4" size="md" className="font-medium text-slate-900 dark:text-white">AI & WhatsApp Automation</Heading>
                    <Text className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                      Launched QuickBite Pro with intelligent recommendation nodes, WhatsApp automated receipts, and instant JazzCash checkout.
                    </Text>
                  </div>
                </div>
                {/* Center dot */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-primary border-4 border-slate-50 dark:border-slate-950 shadow-lg shadow-primary/30 z-10 top-5" />
                <div className="md:w-1/2 md:pl-16 hidden md:block" />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="py-16 px-4 bg-slate-100/50 dark:bg-slate-900/50">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <div className="space-y-3">
            <Heading as="h2" size="md" className="text-slate-900 dark:text-white font-medium">
              What Foodies Say
            </Heading>
          </div>

          <div className="relative bg-white dark:bg-slate-800/30 backdrop-blur-md border border-slate-200 dark:border-white/10 p-8 rounded-3xl min-h-[200px] flex flex-col justify-center shadow-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <Text className="text-base italic text-slate-700 dark:text-slate-300 leading-relaxed font-body">
                  "{mockTestimonials[testimonialIndex].comment}"
                </Text>

                <div className="flex items-center justify-center gap-1.5 text-amber-500">
                  {Array.from({ length: mockTestimonials[testimonialIndex].rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>

                <div className="flex items-center justify-center gap-4">
                  <img
                    src={mockTestimonials[testimonialIndex].avatar}
                    alt={mockTestimonials[testimonialIndex].name}
                    className="w-12 h-12 rounded-full border-2 border-primary object-cover"
                  />
                  <div className="text-left">
                    <span className="font-medium text-slate-900 dark:text-white block">
                      {mockTestimonials[testimonialIndex].name}
                    </span>
                    <span className="text-xs text-slate-400 font-medium block">
                      {mockTestimonials[testimonialIndex].role}
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {mockTestimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIndex(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    testimonialIndex === i ? 'w-6 bg-primary' : 'w-2.5 bg-slate-300 dark:bg-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* APP DOWNLOAD SECTION */}
      <section className="py-20 px-4 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,107,53,0.15),transparent_60%)] z-0" />
        <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <Heading as="h2" size="md" className="font-medium leading-tight text-white">
              Get the Premium <br />
              <span className="text-primary">QuickBite Pro Mobile App</span>
            </Heading>
            <Text className="text-sm text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed font-body">
              Never wait in queues again. Unlock exclusive mobile app coupon codes, claim 500 reward points on signup, and manage orders with instant notifications.
            </Text>

            {/* Fake App Store / Play Store UI */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
              <a href="#" className="flex items-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 px-5 py-3 rounded-2xl transition-all hover:-translate-y-0.5">
                {/* Simple Apple Icon SVG */}
                <svg className="h-6 w-6 fill-white" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.63.73-1.18 1.87-1.03 2.98.12.01.24.02.36.02.94 0 2.1-.63 2.62-1.44z"/>
                </svg>
                <div className="text-left">
                  <span className="text-[9px] text-slate-400 font-medium block uppercase">Download on the</span>
                  <span className="text-sm font-medium text-white block">App Store</span>
                </div>
              </a>

              <a href="#" className="flex items-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 px-5 py-3 rounded-2xl transition-all hover:-translate-y-0.5">
                {/* Play Store Icon SVG */}
                <svg className="h-6 w-6 fill-white" viewBox="0 0 24 24">
                  <path d="M5.25 3.001c-.13 0-.25.035-.357.098L12.438 10.63l4.316-4.316-11.147-3.216A.947.947 0 0 0 5.25 3.001zM4.098 4.257A.933.933 0 0 0 4 4.75v14.5c0 .185.036.353.098.493L11.536 12.33 4.098 4.257zm12.656 4.305l-4.316 4.316 7.545 7.545a.94.94 0 0 0 .357-.098l3.147-11.147-6.733-.616zm3.504-2.93l-3.216 11.147a.933.933 0 0 0-.098.357v.143l3.314-3.314-11.455-11.455 11.455 11.455z"/>
                </svg>
                <div className="text-left">
                  <span className="text-[9px] text-slate-400 font-medium block uppercase">Get it on</span>
                  <span className="text-sm font-medium text-white block">Google Play</span>
                </div>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6 flex justify-center">
            {/* Fake App Mockup Mock */}
            <div className="w-64 h-[500px] bg-slate-900 border-[8px] border-slate-800 rounded-[40px] shadow-[0_50px_80px_rgba(0,0,0,0.5)] overflow-hidden relative">
              {/* Speaker */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-800 rounded-full z-20" />
              
              {/* Screen Content */}
              <div className="p-4 pt-10 h-full flex flex-col justify-between bg-gradient-to-b from-slate-900 to-slate-950 relative">
                  <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <img src="/logo.png" alt="QuickBite" className="w-5 h-5 rounded object-contain" />
                      <span className="text-xs font-medium text-white uppercase tracking-wider">QuickBite</span>
                    </div>
                    <span className="text-xs text-primary font-medium font-numbers">9:41 AM</span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                    <div className="h-3.5 w-2/3 bg-slate-700 rounded-full" />
                    <div className="h-2.5 w-full bg-slate-800 rounded-full" />
                    <div className="h-2 w-1/2 bg-slate-800 rounded-full" />
                  </div>
                  <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-primary">Coupon Claimed!</span>
                    <span className="text-[9px] bg-primary text-white px-2 py-0.5 rounded font-medium uppercase">Rs. 250</span>
                  </div>
                </div>

                <div className="p-4 bg-primary rounded-3xl text-center text-white font-medium text-sm shadow-lg shadow-primary/30">
                  Ready to Deliver
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default LandingPage;
