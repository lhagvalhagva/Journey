import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface GreetingData {
  day: number;
  emoji: string;
  title: string;
  greeting: string;
  message: string;
  decorativeEmojis: string[];
}

const COLLECTION_NAME = 'journeyData';
const DOC_ID = 'main';

export async function getJourneyData(): Promise<{
  greetings: GreetingData[];
  unlockedDays: number;
} | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOC_ID);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      const greetings = data.greetings;
      const unlockedDays = data.unlockedDays;
      
      // Хэрэв greetings байгаа бөгөөд хоосон биш бол буцаах
      if (greetings && Array.isArray(greetings) && greetings.length > 0) {
        return {
          greetings,
          unlockedDays: unlockedDays || 1,
        };
      }
      // Хэрэв greetings хоосон эсвэл байхгүй бол null буцаах (default ашиглахгүй)
      return null;
    }
    return null;
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      console.warn('Firestore permissions denied. Please check security rules.');
    } else {
      console.error('Error getting journey data:', error);
    }
    return null;
  }
}

export async function saveJourneyData(
  greetings: GreetingData[],
  unlockedDays: number
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOC_ID);
    await setDoc(docRef, {
      greetings,
      unlockedDays,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error: any) {
    if (error.code === 'permission-denied') {
      console.error('Firestore permissions denied. Please check security rules and ensure you are logged in.');
      throw new Error('Permissions denied. Нэвтрэх шаардлагатай.');
    }
    console.error('Error saving journey data:', error);
    throw error;
  }
}

export async function updateUnlockedDays(unlockedDays: number): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOC_ID);
    await updateDoc(docRef, {
      unlockedDays,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating unlocked days:', error);
    throw error;
  }
}
