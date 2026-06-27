import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  SlidersHorizontal, 
  Star, 
  Heart, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Check, 
  UtensilsCrossed, 
  Eye, 
  Sparkles,
  Flame,
  Scale,
  X
} from 'lucide-react';
import { Button, Heading, Text, Spinner } from '@/components/atoms';
import { mockCategories } from '@/data/mockData';
import { dbService } from '@/services/dbService';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import type { FoodItem, Customization, Review } from '@/types';

// Simple Toast Alert
interface Toast {
  id: string;
  message: string;
}

export const MenuPage: React.FC = () => {
  const { addItem } = useCart();
  const { user } = useAuth();
  
  // State
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(2500);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating' | 'prep-time'>('rating');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const stored = localStorage.getItem('quickbite_favorites');
    return stored ? JSON.parse(stored) : [];
  });
  const [showFavsOnly, setShowFavsOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Detail Modal State
  const [activeFood, setActiveFood] = useState<FoodItem | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedCustomizations, setSelectedCustomizations] = useState<Customization[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  
  // Load data Live
  useEffect(() => {
    const unsubFoods = dbService.listenToFoods((data) => {
      setFoods(data);
      setLoading(false);
    });
    
    const unsubReviews = dbService.listenToReviews((data) => {
      setReviews(data);
    });
    
    return () => {
      unsubFoods();
      unsubReviews();
    };
  }, []);

  // Sync favorites
  useEffect(() => {
    localStorage.setItem('quickbite_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
    showToast(favorites.includes(id) ? 'Removed from favorites' : 'Added to favorites!');
  };

  const showToast = (message: string) => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleAddToCart = (food: FoodItem, customizations: Customization[] = []) => {
    addItem(food, 1, customizations);
    showToast(`${food.name} added to cart! ðŸ”`);
  };

  // Recommendations logic (portfolio booster)
  const getRecommendations = (currentFood: FoodItem) => {
    return foods
      .filter(f => f.id !== currentFood.id && (f.category.id === currentFood.category.id || f.tags.includes('Best Seller')))
      .slice(0, 2);
  };

  // Review Submitting
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFood || !user) return;

    const newReview: Review = {
      id: `rev-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: user.id,
      customerName: user.name,
      foodId: activeFood.id,
      orderId: `ord-${Math.floor(100000 + Math.random() * 900000)}`,
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment,
      isApproved: true, // auto-approve in mock mode
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await dbService.addReview(newReview);

    // Reset fields
    setReviewTitle('');
    setReviewComment('');
    setReviewRating(5);
    showToast('Review submitted successfully!');
  };

  // Filter & Sort Logic
  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          food.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          food.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || food.category.id === selectedCategory;
    const matchesPrice = food.price <= maxPrice;
    const matchesFav = !showFavsOnly || favorites.includes(food.id);
    return matchesSearch && matchesCategory && matchesPrice && matchesFav;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'prep-time') return a.preparationTime - b.preparationTime;
    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 py-8 px-4">
      {/* Toast Feed */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-2xl shadow-2xl border border-white/10 dark:border-slate-200 font-medium text-sm flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <Heading as="h1" size="lg" className="text-slate-900 dark:text-white font-medium">
              Smart Menu
            </Heading>
            <Text className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select and customize premium dishes tailored to your preferences.
            </Text>
          </div>

          {/* Search bar & filter toggles */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-md w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search dish or ingredient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-2xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
              />
            </div>
            <button
              onClick={() => setShowFavsOnly(!showFavsOnly)}
              className={`p-3 rounded-2xl border flex items-center justify-center gap-2 font-medium text-sm transition-all ${
                showFavsOnly 
                  ? 'bg-red-500/10 border-red-500 text-red-500' 
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <Heart className={`h-5 w-5 ${showFavsOnly ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">Favorites</span>
            </button>
          </div>
        </div>

        {/* Sidebar Filters + Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Filters Sidebar */}
          <div className="lg:col-span-3 space-y-6 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 p-6 rounded-3xl backdrop-blur-md h-fit">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-4">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
              <span className="font-medium text-sm text-slate-900 dark:text-white uppercase tracking-wider">Filters</span>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Category</span>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  All Categories
                </button>
                {mockCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-medium text-slate-400">
                <span className="uppercase tracking-wider">Max Price</span>
                <span className="text-primary font-numbers">Rs. {maxPrice}</span>
              </div>
              <input
                type="range"
                min="300"
                max="3000"
                step="50"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-primary bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full cursor-pointer"
              />
            </div>

            {/* Sort options */}
            <div className="space-y-3">
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Sort By</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-primary"
              >
                <option value="rating">Top Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="prep-time">Fastest Preparation</option>
              </select>
            </div>
          </div>

          {/* Food Grid / Skeletons */}
          <div className="lg:col-span-9">
            {loading ? (
              // Skeleton Loaders
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white dark:bg-slate-800/20 border border-slate-200 dark:border-white/10 rounded-3xl p-4 space-y-4 animate-pulse">
                    <div className="h-44 w-full bg-slate-200 dark:bg-slate-700 rounded-2xl" />
                    <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="flex justify-between items-center pt-2">
                      <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
                      <div className="h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredFoods.length === 0 ? (
              <div className="bg-white dark:bg-slate-800/30 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-3xl p-12 text-center">
                <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UtensilsCrossed className="h-8 w-8 text-slate-400" />
                </div>
                <Heading as="h3" size="xs" className="text-slate-900 dark:text-white font-medium mb-2">
                  No Dishes Found
                </Heading>
                <Text className="text-sm text-slate-500 dark:text-slate-400">
                  Try adjusting your keywords, price slider, or select another category filter.
                </Text>
              </div>
            ) : (
              // Real Grid
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredFoods.map((food) => (
                  <div
                    key={food.id}
                    onClick={() => {
                      setActiveFood(food);
                      setSelectedImageIndex(0);
                      setSelectedCustomizations([]);
                    }}
                    className="group bg-white dark:bg-slate-800/40 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-3xl p-4 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    <div>
                      {/* Image container */}
                      <div className="h-44 w-full overflow-hidden rounded-2xl border border-white/5 relative">
                        <img
                          src={food.images[0]?.url}
                          alt={food.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <button
                          onClick={(e) => toggleFavorite(food.id, e)}
                          className="absolute top-3 right-3 p-2 bg-slate-900/60 hover:bg-slate-900/80 text-white rounded-full backdrop-blur-sm transition-colors z-10"
                        >
                          <Heart
                            className={`h-4.5 w-4.5 ${
                              favorites.includes(food.id) ? 'fill-red-500 text-red-500' : 'text-white'
                            }`}
                          />
                        </button>
                        <div className="absolute top-3 left-3 bg-slate-900/70 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-medium text-white tracking-wide flex items-center gap-1 font-numbers">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {food.rating}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="mt-4 text-left">
                        <span className="text-[9px] uppercase font-medium text-primary tracking-wider">
                          {food.category.name}
                        </span>
                        <Heading as="h4" size="xs" className="text-base font-medium text-slate-900 dark:text-white mt-1 group-hover:text-primary transition-colors line-clamp-1">
                          {food.name}
                        </Heading>
                        <Text className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                          {food.description}
                        </Text>
                      </div>
                    </div>

                    {/* Bottom strip */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">Price</span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white font-numbers">
                          Rs. {food.price}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(food);
                        }}
                        className="p-2.5 bg-primary/10 hover:bg-primary border border-primary/20 text-primary hover:text-white rounded-xl transition-all duration-300"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* FOOD DETAILS MODAL */}
      <AnimatePresence>
        {activeFood && (
          <>
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveFood(null)}
              className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="fixed inset-4 md:inset-x-12 md:inset-y-6 lg:inset-x-32 xl:inset-x-64 bg-slate-900 border border-white/10 text-white rounded-3xl shadow-2xl z-50 flex flex-col md:flex-row overflow-hidden backdrop-blur-xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveFood(null)}
                className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/75 rounded-full border border-white/10 text-white transition-colors"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Left Side: Image Gallery */}
              <div className="md:w-1/2 bg-slate-950 flex flex-col justify-between relative p-6">
                <div className="flex-1 flex items-center justify-center overflow-hidden rounded-2xl border border-white/5 relative group">
                  <img
                    src={activeFood.images[selectedImageIndex]?.url}
                    alt={activeFood.name}
                    className="max-h-[350px] w-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute bottom-3 right-3 bg-black/60 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 font-numbers">
                    <Scale className="h-3.5 w-3.5 text-primary" />
                    {activeFood.nutritionalInfo.calories} kcal
                  </div>
                </div>

                {/* Thumbnail list (360 carousel simulation) */}
                <div className="flex gap-2.5 mt-4 overflow-x-auto justify-center">
                  {activeFood.images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImageIndex(i)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImageIndex === i ? 'border-primary scale-105' : 'border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt="Thumb" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Side: Details, Config, Reviews */}
              <div className="md:w-1/2 flex flex-col justify-between h-full bg-slate-900 border-l border-white/10 p-6 overflow-y-auto custom-scrollbar">
                <div className="space-y-5">
                  <div>
                    <span className="text-[10px] uppercase font-medium text-primary tracking-widest">
                      {activeFood.category.name}
                    </span>
                    <Heading as="h2" size="sm" className="font-medium mt-1 text-white leading-snug">
                      {activeFood.name}
                    </Heading>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        <span className="font-medium text-white font-numbers">{activeFood.rating}</span>
                        <span>({activeFood.reviewCount} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                        <span className="font-numbers">{activeFood.preparationTime} mins</span>
                      </div>
                    </div>
                  </div>

                  <Text className="text-xs text-slate-300 leading-relaxed font-body">
                    {activeFood.description}
                  </Text>

                  {/* Nutrition macros */}
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl grid grid-cols-4 gap-2 text-center">
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 block font-medium">Protein</span>
                      <span className="text-xs font-medium text-white font-numbers">{activeFood.nutritionalInfo.protein}g</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 block font-medium">Carbs</span>
                      <span className="text-xs font-medium text-white font-numbers">{activeFood.nutritionalInfo.carbs}g</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 block font-medium">Fat</span>
                      <span className="text-xs font-medium text-white font-numbers">{activeFood.nutritionalInfo.fat}g</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 block font-medium">Fiber</span>
                      <span className="text-xs font-medium text-white font-numbers">{activeFood.nutritionalInfo.fiber}g</span>
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div className="space-y-2">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Ingredients</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeFood.ingredients.map((ing, i) => (
                        <span key={i} className="text-xs px-2.5 py-1 bg-slate-800 text-slate-200 rounded-lg border border-white/5">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Customization options */}
                  <div className="space-y-3">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Customize your meal</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          const size: Customization = { type: 'size', value: 'Double Size', price: 250 };
                          setSelectedCustomizations(prev => 
                            prev.some(c => c.value === size.value) ? prev.filter(c => c.value !== size.value) : [...prev, size]
                          );
                        }}
                        className={`p-3 rounded-xl border text-xs font-medium text-left flex justify-between items-center transition-all ${
                          selectedCustomizations.some(c => c.value === 'Double Size')
                            ? 'bg-primary/20 border-primary text-white'
                            : 'bg-slate-800 border-white/10 text-slate-300'
                        }`}
                      >
                        <span>Upsize meal</span>
                        <span className="text-primary font-numbers">+Rs. 250</span>
                      </button>

                      <button
                        onClick={() => {
                          const addon: Customization = { type: 'addon', value: 'Extra Melted Cheese', price: 150 };
                          setSelectedCustomizations(prev => 
                            prev.some(c => c.value === addon.value) ? prev.filter(c => c.value !== addon.value) : [...prev, addon]
                          );
                        }}
                        className={`p-3 rounded-xl border text-xs font-medium text-left flex justify-between items-center transition-all ${
                          selectedCustomizations.some(c => c.value === 'Extra Melted Cheese')
                            ? 'bg-primary/20 border-primary text-white'
                            : 'bg-slate-800 border-white/10 text-slate-300'
                        }`}
                      >
                        <span>Extra Cheese</span>
                        <span className="text-primary font-numbers">+Rs. 150</span>
                      </button>
                    </div>
                  </div>

                  {/* AI Recommendations */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-1.5 text-primary">
                      <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                      <span className="text-xs font-medium uppercase tracking-wider">AI Recommendations</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {getRecommendations(activeFood).map(rec => (
                        <div
                          key={rec.id}
                          onClick={() => {
                            setActiveFood(rec);
                            setSelectedImageIndex(0);
                            setSelectedCustomizations([]);
                          }}
                          className="p-3 bg-white/5 border border-white/10 hover:border-primary/40 rounded-2xl flex items-center gap-3 cursor-pointer transition-all"
                        >
                          <img src={rec.images[0]?.url} alt={rec.name} className="w-10 h-10 rounded-lg object-cover" />
                          <div className="min-w-0">
                            <span className="text-xs font-medium block truncate">{rec.name}</span>
                            <span className="text-[10px] text-primary font-numbers font-medium">Rs. {rec.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer Reviews listing */}
                  <div className="space-y-4 pt-3 border-t border-white/10">
                    <Heading as="h4" size="xs" className="text-sm font-medium text-white">
                      Reviews & Ratings
                    </Heading>

                    <div className="space-y-3">
                      {reviews.filter(r => r.foodId === activeFood.id).length === 0 ? (
                        <Text className="text-xs text-slate-400 italic">No reviews yet. Be the first to review!</Text>
                      ) : (
                        reviews.filter(r => r.foodId === activeFood.id).map(rev => (
                          <div key={rev.id} className="p-3 bg-white/5 rounded-2xl border border-white/10 text-left space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium text-white">{rev.customerName || 'Anonymous User'}</span>
                              <div className="flex text-amber-500 gap-0.5">
                                {Array.from({ length: rev.rating }).map((_, i) => (
                                  <Star key={i} className="h-3 w-3 fill-current" />
                                ))}
                              </div>
                            </div>
                            {rev.title && <span className="text-xs font-medium text-primary block">{rev.title}</span>}
                            <p className="text-[11px] text-slate-300 leading-relaxed font-body">{rev.comment}</p>
                            {rev.adminResponse && (
                              <div className="mt-2 pl-3 border-l-2 border-primary bg-primary/5 p-2 rounded-r-xl">
                                <span className="text-[10px] font-medium text-white block">Response:</span>
                                <p className="text-[10px] text-slate-300 font-body">{rev.adminResponse.message}</p>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    {/* Review Form */}
                    {user ? (
                      <form onSubmit={handleReviewSubmit} className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                        <span className="text-xs font-medium text-white block">Write a Review</span>
                        
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setReviewRating(star)}
                              className="text-amber-500 hover:scale-110 transition-transform"
                            >
                              <Star className={`h-5 w-5 ${reviewRating >= star ? 'fill-current' : ''}`} />
                            </button>
                          ))}
                        </div>

                        <input
                          type="text"
                          placeholder="Review Title (e.g. Excellent flavor!)"
                          value={reviewTitle}
                          onChange={(e) => setReviewTitle(e.target.value)}
                          className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                          required
                        />

                        <textarea
                          placeholder="Write your comments here..."
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary h-20 resize-none"
                          required
                        />

                        <Button type="submit" variant="primary" className="py-2 px-4 text-xs font-medium">
                          Submit Review
                        </Button>
                      </form>
                    ) : (
                      <div className="text-center p-4 bg-white/5 border border-white/10 rounded-2xl">
                        <Text className="text-xs text-slate-400">Please sign in to write a review.</Text>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sticky Add to Cart panel */}
                <div className="pt-6 mt-6 border-t border-white/10 bg-slate-900 sticky bottom-0 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Total Price</span>
                    <span className="text-xl font-medium text-primary font-numbers">
                      Rs. {activeFood.price + selectedCustomizations.reduce((sum, c) => sum + c.price, 0)}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      handleAddToCart(activeFood, selectedCustomizations);
                      setActiveFood(null);
                    }}
                    className="bg-gradient-to-r from-primary to-orange-500 hover:shadow-lg hover:shadow-primary/30 text-white rounded-xl py-3 px-6 text-sm font-medium flex items-center gap-2 transform active:scale-95 transition-all"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuPage;
