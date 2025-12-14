import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
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
      return {
        greetings: data.greetings || [],
        unlockedDays: data.unlockedDays || 1,
      };
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
    // Use setDoc without merge to completely replace the document
    // This ensures all data is saved correctly
    await setDoc(docRef, {
      greetings,
      unlockedDays,
      updatedAt: new Date().toISOString(),
    });
    console.log('Successfully saved to Firestore:', { greetings, unlockedDays });
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

// Real-time listener for journey data
export function subscribeToJourneyData(
  callback: (data: { greetings: GreetingData[]; unlockedDays: number } | null) => void
): () => void {
  const docRef = doc(db, COLLECTION_NAME, DOC_ID);
  
  const unsubscribe = onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        callback({
          greetings: data.greetings || [],
          unlockedDays: data.unlockedDays || 1,
        });
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('Error in real-time listener:', error);
      callback(null);
    }
  );

  return unsubscribe;
}
