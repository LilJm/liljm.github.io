import { useState } from 'react';

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function useDailyLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;

      const parsedItem = JSON.parse(item);
      const today = getTodayDateString();

      // If the stored date is today, return the stored value
      if (parsedItem.date === today) {
        return parsedItem.value;
      }
      
      // If the date is not today, return the initial value to reset for the new day
      return initialValue;
    } catch (error) {
      console.error("Error reading from daily local storage", error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage immediately
      const today = getTodayDateString();
      const itemToStore = {
        date: today,
        value: valueToStore,
      };
      window.localStorage.setItem(key, JSON.stringify(itemToStore));
    } catch (error) {
      console.error("Error writing to daily local storage", error);
    }
  };


  return [storedValue, setValue];
}