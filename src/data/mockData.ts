import type { FoodCategory, FoodItem, Review, Order } from '@/types';

// Mock Categories
export const mockCategories: FoodCategory[] = [
  {
    id: 'cat-pizza',
    name: 'Pizza',
    description: 'Freshly baked artisanal pizzas with premium toppings',
    icon: 'Pizza',
    sortOrder: 1,
    isActive: true
  },
  {
    id: 'cat-burger',
    name: 'Burger',
    description: 'Juicy, flame-grilled gourmet burgers',
    icon: 'Burger',
    sortOrder: 2,
    isActive: true
  },
  {
    id: 'cat-bbq',
    name: 'BBQ',
    description: 'Smoked and grilled traditional Pakistani BBQ delights',
    icon: 'Flame',
    sortOrder: 3,
    isActive: true
  },
  {
    id: 'cat-desserts',
    name: 'Desserts',
    description: 'Sweet treats, pastries, and traditional desserts',
    icon: 'Cake',
    sortOrder: 4,
    isActive: true
  },
  {
    id: 'cat-drinks',
    name: 'Drinks',
    description: 'Refreshing cold mocktails, shakes, and soft drinks',
    icon: 'CupSoda',
    sortOrder: 5,
    isActive: true
  }
];

// Helper to get category by ID
const getCat = (id: string): FoodCategory => mockCategories.find(c => c.id === id) || mockCategories[0];

// Premium Food Items Mock
export const initialFoodItems: FoodItem[] = [
  // Pizza Category
  {
    id: 'food-p1',
    name: 'Crown Crust Signature Pizza',
    description: 'Delicious pizza with a crown crust filled with cream cheese, topped with spicy chicken tandoori, onions, bell peppers, and signature garlic dip sauce.',
    price: 1850,
    category: getCat('cat-pizza'),
    images: [
      { id: 'img-p1-1', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80', alt: 'Crown Crust Pizza', type: 'main', sortOrder: 1 },
      { id: 'img-p1-2', url: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=800&auto=format&fit=crop&q=80', alt: 'Slice view', type: 'gallery', sortOrder: 2 },
      { id: 'img-p1-3', url: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=80', alt: 'Oven fresh', type: 'gallery', sortOrder: 3 }
    ],
    ingredients: ['Mozzarella Cheese', 'Cream Cheese', 'Tandoori Chicken Chunks', 'Onions', 'Bell Peppers', 'Garlic Ranch Sauce'],
    nutritionalInfo: { calories: 340, protein: 18, carbs: 36, fat: 14, fiber: 2, sodium: 580 },
    allergens: ['Gluten', 'Dairy'],
    tags: ['Best Seller', 'Spicy', 'Chef Special'],
    availability: true,
    preparationTime: 20,
    rating: 4.8,
    reviewCount: 124,
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-06-10')
  },
  {
    id: 'food-p2',
    name: 'Truffle Mushroom Artisan Pizza',
    description: 'White base gourmet pizza with wild truffles, sautéed portobello mushrooms, fresh rocket leaves, and a drizzle of premium extra virgin olive oil.',
    price: 2200,
    category: getCat('cat-pizza'),
    images: [
      { id: 'img-p2-1', url: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?w=800&auto=format&fit=crop&q=80', alt: 'Truffle Mushroom Pizza', type: 'main', sortOrder: 1 }
    ],
    ingredients: ['Truffle Oil', 'Wild Mushrooms', 'Rocket Leaves', 'Parmesan Cheese', 'Mozzarella', 'White Garlic Base'],
    nutritionalInfo: { calories: 290, protein: 12, carbs: 32, fat: 12, fiber: 3, sodium: 450 },
    allergens: ['Dairy', 'Gluten'],
    tags: ['Gourmet', 'Vegetarian'],
    availability: true,
    preparationTime: 18,
    rating: 4.6,
    reviewCount: 42,
    createdAt: new Date('2026-02-10'),
    updatedAt: new Date('2026-06-01')
  },
  // Burgers
  {
    id: 'food-b1',
    name: 'Smokehouse Double Stack Burger',
    description: 'Double flame-grilled smash beef patties, melted sharp cheddar, crispy beef bacon, fried onion rings, and our signature hickory BBQ smoke sauce on a toasted brioche bun.',
    price: 990,
    category: getCat('cat-burger'),
    images: [
      { id: 'img-b1-1', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80', alt: 'Smokehouse Burger', type: 'main', sortOrder: 1 },
      { id: 'img-b1-2', url: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800&auto=format&fit=crop&q=80', alt: 'Inside view', type: 'gallery', sortOrder: 2 }
    ],
    ingredients: ['Premium Beef Smash Patties', 'Sharp Cheddar', 'Beef Bacon', 'Onion Rings', 'Hickory BBQ Sauce', 'Brioche Bun'],
    nutritionalInfo: { calories: 720, protein: 42, carbs: 48, fat: 38, fiber: 2, sodium: 980 },
    allergens: ['Gluten', 'Dairy', 'Eggs'],
    tags: ['Best Seller', 'Premium', 'Double Patty'],
    availability: true,
    preparationTime: 15,
    rating: 4.9,
    reviewCount: 238,
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-06-12')
  },
  {
    id: 'food-b2',
    name: 'Spicy Zinger Extreme Burger',
    description: 'Crispy deep-fried golden breast fillet coated in spicy hot batter, iceberg lettuce, jalapeño slices, and spicy habanero mayo sauce.',
    price: 650,
    category: getCat('cat-burger'),
    images: [
      { id: 'img-b2-1', url: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?w=800&auto=format&fit=crop&q=80', alt: 'Zinger Burger', type: 'main', sortOrder: 1 }
    ],
    ingredients: ['Spicy Crispy Chicken Fillet', 'Jalapeños', 'Iceberg Lettuce', 'Habanero Mayo', 'Artisanal Bun'],
    nutritionalInfo: { calories: 590, protein: 32, carbs: 44, fat: 28, fiber: 1, sodium: 850 },
    allergens: ['Gluten', 'Eggs'],
    tags: ['Spicy', 'Crispy'],
    availability: true,
    preparationTime: 12,
    rating: 4.7,
    reviewCount: 310,
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-06-14')
  },
  // BBQ
  {
    id: 'food-q1',
    name: 'Kasturi Chicken Boti',
    description: 'Tender boneless chicken cubes marinated in creamy saffron-infused yoghurt paste, mild spices, and char-grilled over natural charcoal embers.',
    price: 1100,
    category: getCat('cat-bbq'),
    images: [
      { id: 'img-q1-1', url: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&auto=format&fit=crop&q=80', alt: 'Chicken Boti', type: 'main', sortOrder: 1 }
    ],
    ingredients: ['Boneless Chicken', 'Saffron Yoghurt Marination', 'Cream', 'Traditional Spices', 'Mint Raita'],
    nutritionalInfo: { calories: 420, protein: 38, carbs: 6, fat: 24, fiber: 1, sodium: 620 },
    allergens: ['Dairy'],
    tags: ['Pakistani Favorite', 'Char-grilled'],
    availability: true,
    preparationTime: 25,
    rating: 4.8,
    reviewCount: 88,
    createdAt: new Date('2026-03-01'),
    updatedAt: new Date('2026-06-08')
  },
  {
    id: 'food-q2',
    name: 'Mutton Seekh Kabab Melt',
    description: 'Juicy minced mutton kababs mixed with chopped herbs, coriander, fresh green chillies, grilled to perfection and served with a hot cheese splash on a sizzler plate.',
    price: 1550,
    category: getCat('cat-bbq'),
    images: [
      { id: 'img-q2-1', url: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&auto=format&fit=crop&q=80', alt: 'Seekh Kabab', type: 'main', sortOrder: 1 }
    ],
    ingredients: ['Minced Mutton', 'Fresh Herbs', 'Green Chillies', 'Butter', 'Melted Mozzarella Overlay'],
    nutritionalInfo: { calories: 510, protein: 44, carbs: 4, fat: 34, fiber: 1, sodium: 740 },
    allergens: ['Dairy'],
    tags: ['Trending', 'Spicy'],
    availability: true,
    preparationTime: 22,
    rating: 4.9,
    reviewCount: 95,
    createdAt: new Date('2026-03-15'),
    updatedAt: new Date('2026-06-05')
  },
  // Desserts
  {
    id: 'food-d1',
    name: 'Luxury Lotus Biscoff Lava Cake',
    description: 'Hot molten Belgian chocolate lava cake filled with pure Lotus Biscoff spread, served alongside a scoop of gourmet vanilla bean ice cream.',
    price: 680,
    category: getCat('cat-desserts'),
    images: [
      { id: 'img-d1-1', url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80', alt: 'Lava Cake', type: 'main', sortOrder: 1 }
    ],
    ingredients: ['Belgian Chocolate', 'Lotus Biscoff Spread', 'Flour', 'Butter', 'Vanilla Bean Gelato'],
    nutritionalInfo: { calories: 480, protein: 6, carbs: 54, fat: 26, fiber: 2, sodium: 290 },
    allergens: ['Gluten', 'Dairy', 'Eggs', 'Soy'],
    tags: ['Sweet Tooth', 'Hot & Cold'],
    availability: true,
    preparationTime: 10,
    rating: 4.9,
    reviewCount: 182,
    createdAt: new Date('2026-02-15'),
    updatedAt: new Date('2026-06-13')
  },
  {
    id: 'food-d2',
    name: 'Saffron Gulab Jamun Sundae',
    description: 'Traditional hot gulab jamun soaked in saffron sugar syrup, layered with sweet rabri, pistachio chunks, and edible gold leaf.',
    price: 520,
    category: getCat('cat-desserts'),
    images: [
      { id: 'img-d2-1', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80', alt: 'Gulab Jamun Sundae', type: 'main', sortOrder: 1 }
    ],
    ingredients: ['Gulab Jamun', 'Sweet Rabri Cream', 'Pistachios', 'Saffron Syrup', 'Edible Gold Leaf'],
    nutritionalInfo: { calories: 380, protein: 7, carbs: 59, fat: 14, fiber: 1, sodium: 180 },
    allergens: ['Dairy', 'Gluten', 'Nuts'],
    tags: ['Traditional', 'Royal'],
    availability: true,
    preparationTime: 8,
    rating: 4.7,
    reviewCount: 74,
    createdAt: new Date('2026-04-01'),
    updatedAt: new Date('2026-06-04')
  },
  // Drinks
  {
    id: 'food-dr1',
    name: 'Wild Berry Mint Mojito',
    description: 'Crushed blueberries, raspberries, and fresh garden mint leaves, muddled with fresh lime juice, topped with sparkling tonic water and ice rocks.',
    price: 450,
    category: getCat('cat-drinks'),
    images: [
      { id: 'img-dr1-1', url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80', alt: 'Wild Berry Mojito', type: 'main', sortOrder: 1 }
    ],
    ingredients: ['Muddled Wild Berries', 'Mint Leaves', 'Lime Juice', 'Soda Water', 'Crushed Ice'],
    nutritionalInfo: { calories: 120, protein: 0, carbs: 28, fat: 0, fiber: 1, sodium: 15 },
    allergens: [],
    tags: ['Refreshing', 'Organic'],
    availability: true,
    preparationTime: 5,
    rating: 4.8,
    reviewCount: 145,
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date('2026-06-11')
  },
  {
    id: 'food-dr2',
    name: 'Caramel Crunch Shake',
    description: 'Creamy high-fat shake blended with house-made salted caramel sauce, toffee crunch pieces, topped with white whipping cream and caramel drizzle.',
    price: 550,
    category: getCat('cat-drinks'),
    images: [
      { id: 'img-dr2-1', url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80', alt: 'Caramel Shake', type: 'main', sortOrder: 1 }
    ],
    ingredients: ['Vanilla Ice Cream', 'Whole Milk', 'Salted Caramel Sauce', 'Toffee Toppings', 'Whipping Cream'],
    nutritionalInfo: { calories: 450, protein: 8, carbs: 49, fat: 24, fiber: 0, sodium: 320 },
    allergens: ['Dairy'],
    tags: ['Sweet Shakes'],
    availability: true,
    preparationTime: 7,
    rating: 4.6,
    reviewCount: 92,
    createdAt: new Date('2026-02-28'),
    updatedAt: new Date('2026-06-07')
  }
];

// Testimonials Mock
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  comment: string;
  rating: number;
}

export const mockTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Hassan Raza',
    role: 'Top Food Critic, Islamabad',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    comment: 'The user interface is exceptionally slick! Ordering took less than 30 seconds, and the live tracking was so precise. QuickBite Pro has raised the bar for online delivery platforms in Pakistan.',
    rating: 5
  },
  {
    id: 'test-2',
    name: 'Ayesha Khan',
    role: 'Gourmet Baker & Food Blogger',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    comment: 'I love the Truffle Mushroom Pizza. The packaging, delivery speed, and overall digital checkout experience were premium and luxurious. Absolute 5-stars!',
    rating: 5
  },
  {
    id: 'test-3',
    name: 'Dr. Shahzad Malik',
    role: 'Frequent Family Diner',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    comment: 'We order the Kasturi Chicken Boti and Seekh Kababs almost every weekend. The taste is remarkably authentic, and their customer service wallet cashback keeps us hooked!',
    rating: 5
  }
];

// Initial Reviews Mock
export const initialReviews: Review[] = [
  {
    id: 'rev-1',
    customerId: 'cust-1',
    foodId: 'food-p1',
    orderId: 'ord-100',
    rating: 5,
    title: 'Outstanding taste!',
    comment: 'The Crown Crust Signature Pizza was absolutely divine! The cream cheese filling in the crust is a game-changer.',
    isApproved: true,
    adminResponse: {
      message: 'Thank you Hassan! Glad you loved our signature crown crust. More delicious flavors coming soon!',
      respondedBy: 'QuickBite Team',
      respondedAt: new Date('2026-06-11')
    },
    createdAt: new Date('2026-06-10'),
    updatedAt: new Date('2026-06-11')
  },
  {
    id: 'rev-2',
    customerId: 'cust-2',
    foodId: 'food-b1',
    orderId: 'ord-101',
    rating: 5,
    title: 'Double beef double fun',
    comment: 'Amazing smoky flavor. Beef patties were incredibly juicy. Best burger in town hands down.',
    isApproved: true,
    createdAt: new Date('2026-06-12'),
    updatedAt: new Date('2026-06-12')
  }
];

// Initial Promo Coupons
export interface PromoCoupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  description: string;
}

export const mockCoupons: PromoCoupon[] = [
  { code: 'QUICKBITE20', type: 'percentage', value: 20, minOrder: 1000, description: '20% off on orders above Rs. 1,000' },
  { code: 'ROYALFREE', type: 'fixed', value: 300, minOrder: 1500, description: 'Rs. 300 flat discount for elite orders' },
  { code: 'WELCOME50', type: 'percentage', value: 50, minOrder: 500, description: '50% off for first-time orders (capped at Rs. 250)' }
];

// --- Local Storage Functions to support CRUD ---

const STORAGE_FOODS = 'quickbite_foods';
const STORAGE_ORDERS = 'quickbite_orders';
const STORAGE_REVIEWS = 'quickbite_reviews';

export const getStoredFoodItems = (): FoodItem[] => {
  const stored = localStorage.getItem(STORAGE_FOODS);
  if (!stored) {
    localStorage.setItem(STORAGE_FOODS, JSON.stringify(initialFoodItems));
    return initialFoodItems;
  }
  try {
    return JSON.parse(stored).map((item: any) => ({
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt)
    }));
  } catch (e) {
    return initialFoodItems;
  }
};

export const saveFoodItems = (items: FoodItem[]): void => {
  localStorage.setItem(STORAGE_FOODS, JSON.stringify(items));
};

export const getStoredOrders = (): Order[] => {
  const stored = localStorage.getItem(STORAGE_ORDERS);
  if (!stored) return [];
  try {
    return JSON.parse(stored).map((order: any) => ({
      ...order,
      estimatedDelivery: new Date(order.estimatedDelivery),
      actualDelivery: order.actualDelivery ? new Date(order.actualDelivery) : undefined,
      createdAt: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt)
    }));
  } catch (e) {
    return [];
  }
};

export const saveOrders = (orders: Order[]): void => {
  localStorage.setItem(STORAGE_ORDERS, JSON.stringify(orders));
};

export const getStoredReviews = (): Review[] => {
  const stored = localStorage.getItem(STORAGE_REVIEWS);
  if (!stored) {
    localStorage.setItem(STORAGE_REVIEWS, JSON.stringify(initialReviews));
    return initialReviews;
  }
  try {
    return JSON.parse(stored).map((rev: any) => ({
      ...rev,
      createdAt: new Date(rev.createdAt),
      updatedAt: new Date(rev.updatedAt),
      adminResponse: rev.adminResponse ? {
        ...rev.adminResponse,
        respondedAt: new Date(rev.adminResponse.respondedAt)
      } : undefined
    }));
  } catch (e) {
    return initialReviews;
  }
};

export const saveReviews = (reviews: Review[]): void => {
  localStorage.setItem(STORAGE_REVIEWS, JSON.stringify(reviews));
};
