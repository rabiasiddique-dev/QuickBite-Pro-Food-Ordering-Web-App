import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { initialFoodItems, initialReviews } from '@/data/mockData';
import type { FoodItem, Order, Review } from '@/types';

class DbService {
  /**
   * Seed Firestore with initial mock data if empty
   */
  async seedDatabaseIfNeeded() {
    try {
      const foodsSnap = await getDocs(collection(db, 'foods'));
      if (foodsSnap.empty) {
        console.log('Seeding foods collection...');
        for (const food of initialFoodItems) {
          const docRef = doc(db, 'foods', food.id);
          await setDoc(docRef, {
            ...food,
            createdAt: food.createdAt.toISOString(),
            updatedAt: food.updatedAt.toISOString()
          });
        }
      }

      const reviewsSnap = await getDocs(collection(db, 'reviews'));
      if (reviewsSnap.empty) {
        console.log('Seeding reviews collection...');
        for (const rev of initialReviews) {
          const docRef = doc(db, 'reviews', rev.id);
          await setDoc(docRef, {
            ...rev,
            createdAt: rev.createdAt.toISOString(),
            updatedAt: rev.updatedAt.toISOString(),
            adminResponse: rev.adminResponse ? {
              ...rev.adminResponse,
              respondedAt: rev.adminResponse.respondedAt.toISOString()
            } : null
          });
        }
      }
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  }

  // ===================== FOODS =====================

  async getFoods(): Promise<FoodItem[]> {
    const q = query(collection(db, 'foods'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt)
      } as FoodItem;
    });
  }

  listenToFoods(callback: (foods: FoodItem[]) => void) {
    const q = query(collection(db, 'foods'));
    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt)
        } as FoodItem;
      });
      callback(items);
    });
  }

  async addFood(food: FoodItem): Promise<void> {
    const docRef = doc(db, 'foods', food.id);
    await setDoc(docRef, {
      ...food,
      createdAt: food.createdAt.toISOString(),
      updatedAt: food.updatedAt.toISOString()
    });
  }

  async updateFood(foodId: string, data: Partial<FoodItem>): Promise<void> {
    const docRef = doc(db, 'foods', foodId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  }

  async deleteFood(foodId: string): Promise<void> {
    const docRef = doc(db, 'foods', foodId);
    await deleteDoc(docRef);
  }

  // ===================== ORDERS =====================

  async createOrder(order: Order): Promise<void> {
    const docRef = doc(db, 'orders', order.id);
    await setDoc(docRef, {
      ...order,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      estimatedDelivery: order.estimatedDelivery.toISOString(),
      actualDelivery: order.actualDelivery ? order.actualDelivery.toISOString() : null
    });
  }

  async updateOrder(orderId: string, data: Partial<Order>): Promise<void> {
    const docRef = doc(db, 'orders', orderId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  }

  listenToOrders(callback: (orders: Order[]) => void, customerId?: string) {
    let q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    if (customerId) {
      q = query(collection(db, 'orders'), where('customerId', '==', customerId), orderBy('createdAt', 'desc'));
    }

    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
          estimatedDelivery: new Date(data.estimatedDelivery),
          actualDelivery: data.actualDelivery ? new Date(data.actualDelivery) : undefined
        } as Order;
      });
      callback(items);
    });
  }

  listenToSingleOrder(orderId: string, callback: (order: Order | null) => void) {
    const docRef = doc(db, 'orders', orderId);
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        callback({
          ...data,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
          estimatedDelivery: new Date(data.estimatedDelivery),
          actualDelivery: data.actualDelivery ? new Date(data.actualDelivery) : undefined
        } as Order);
      } else {
        callback(null);
      }
    });
  }

  // ===================== REVIEWS =====================

  async addReview(review: Review): Promise<void> {
    const docRef = doc(db, 'reviews', review.id);
    await setDoc(docRef, {
      ...review,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
      adminResponse: review.adminResponse ? {
        ...review.adminResponse,
        respondedAt: review.adminResponse.respondedAt.toISOString()
      } : null
    });
  }

  async updateReview(reviewId: string, data: Partial<Review>): Promise<void> {
    const docRef = doc(db, 'reviews', reviewId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
  }

  listenToReviews(callback: (reviews: Review[]) => void, foodId?: string) {
    let q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    if (foodId) {
      q = query(collection(db, 'reviews'), where('foodId', '==', foodId), orderBy('createdAt', 'desc'));
    }

    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt),
          adminResponse: data.adminResponse ? {
            ...data.adminResponse,
            respondedAt: new Date(data.adminResponse.respondedAt)
          } : undefined
        } as Review;
      });
      callback(items);
    });
  }
}

export const dbService = new DbService();
export default dbService;
