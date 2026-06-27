import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updatePassword, 
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { User } from '@/types';

class AuthService {
  /**
   * Login with email and password
   */
  async login({ email, password }: { email: string; password: string }): Promise<{ user: User }> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userProfile = await this.getUserProfile(userCredential.user.uid);
      if (!userProfile) {
        throw new Error('User profile not found in database.');
      }
      return { user: userProfile };
    } catch (error: any) {
      throw new Error(error.message || 'Login failed. Please check your credentials.');
    }
  }

  /**
   * Register new user
   */
  async register({ name, email, password, phone }: { name: string; email: string; password: string; phone?: string }): Promise<{ user: User }> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      const newUser: User = {
        id: userCredential.user.uid,
        email,
        name,
        phone,
        role: 'customer',
        preferences: {
          theme: 'system',
          notifications: { email: true, push: true, sms: false, whatsapp: true, orderUpdates: true, promotions: true },
          dietary: { restrictions: [], allergies: [], preferences: [] },
          language: 'en'
        },
        addresses: [],
        paymentMethods: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Save to Firestore
      await setDoc(doc(db, 'users', newUser.id), {
        ...newUser,
        createdAt: newUser.createdAt.toISOString(),
        updatedAt: newUser.updatedAt.toISOString()
      });

      return { user: newUser };
    } catch (error: any) {
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.warn('Logout failed:', error);
    }
  }

  /**
   * Get user profile from Firestore
   */
  async getUserProfile(uid: string): Promise<User | null> {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          ...data,
          createdAt: new Date(data.createdAt),
          updatedAt: new Date(data.updatedAt)
        } as User;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('Not authenticated');

    try {
      const docRef = doc(db, 'users', currentUser.uid);
      const updatePayload = {
        ...data,
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(docRef, updatePayload);
      
      const updatedProfile = await this.getUserProfile(currentUser.uid);
      if (!updatedProfile) throw new Error('Failed to retrieve updated profile');
      return updatedProfile;
    } catch (error: any) {
      throw new Error(error.message || 'Profile update failed.');
    }
  }

  /**
   * Change password
   */
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error('Not authenticated');
    
    try {
      await updatePassword(currentUser, newPassword);
    } catch (error: any) {
      throw new Error(error.message || 'Password change failed.');
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(error.message || 'Password reset request failed.');
    }
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await this.getUserProfile(firebaseUser.uid);
        callback(profile);
      } else {
        callback(null);
      }
    });
  }
}

export const authService = new AuthService();
export default authService;