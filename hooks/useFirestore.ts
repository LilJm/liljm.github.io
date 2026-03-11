import { useState, useEffect } from 'react';
import { collection, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';

export function useFirestore<T>(userId: string, key: string, initialValue: T): [T, (value: T) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'users', userId, 'data', key);
    
    // Sincronização em tempo real
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setStoredValue(docSnap.data().value as T);
      } else {
        setStoredValue(initialValue);
      }
      setLoading(false);
    }, (error) => {
      console.error('Erro ao buscar dados:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, key]);

  const setValue = async (value: T) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      if (userId) {
        const docRef = doc(db, 'users', userId, 'data', key);
        await setDoc(docRef, { value: valueToStore });
      }
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  };

  return [storedValue, setValue, loading];
}
