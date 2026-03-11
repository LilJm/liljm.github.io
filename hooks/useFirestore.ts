import { useState, useEffect, useRef } from 'react';
import { FirestoreError, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';

export interface FirestoreStateError {
  code: string;
  message: string;
  operation: 'read' | 'write';
}

type SetFirestoreValue<T> = (value: T | ((currentValue: T) => T)) => Promise<boolean>;

const getFirestoreError = (error: FirestoreError, operation: 'read' | 'write'): FirestoreStateError => {
  switch (error.code) {
    case 'permission-denied':
      return {
        code: error.code,
        message: 'Seu acesso a estes dados foi negado. Faça login novamente ou revise as regras do Firestore.',
        operation,
      };
    case 'unavailable':
      return {
        code: error.code,
        message: 'O Firestore está indisponível no momento. Tente novamente em instantes.',
        operation,
      };
    default:
      return {
        code: error.code,
        message: operation === 'read' ? 'Não foi possível carregar seus dados agora.' : 'Não foi possível salvar sua alteração agora.',
        operation,
      };
  }
};

export function useFirestore<T>(userId: string, key: string, initialValue: T): [T, SetFirestoreValue<T>, boolean, FirestoreStateError | null] {
  const initialValueRef = useRef(initialValue);
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreStateError | null>(null);

  useEffect(() => {
    initialValueRef.current = initialValue;
  }, [initialValue]);

  useEffect(() => {
    if (!userId) {
      setStoredValue(initialValueRef.current);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const docRef = doc(db, 'users', userId, 'data', key);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setStoredValue(docSnap.data().value as T);
      } else {
        setStoredValue(initialValueRef.current);
      }
      setError(null);
      setLoading(false);
    }, (error) => {
      console.error('Erro ao buscar dados:', error);
      setError(getFirestoreError(error, 'read'));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [key, userId]);

  const setValue: SetFirestoreValue<T> = async (value) => {
    const previousValue = storedValue;

    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setError(null);
      setStoredValue(valueToStore);
      
      if (userId) {
        const docRef = doc(db, 'users', userId, 'data', key);
        await setDoc(docRef, { value: valueToStore });
      }
      return true;
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      setStoredValue(previousValue);
      if (error instanceof FirestoreError) {
        setError(getFirestoreError(error, 'write'));
      }
      return false;
    }
  };

  return [storedValue, setValue, loading, error];
}
