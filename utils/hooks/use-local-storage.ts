import { SetStateAction, useState, Dispatch, useEffect } from 'react';

// Create a custom event name for localStorage changes
const LOCAL_STORAGE_CHANGE_EVENT = 'localStorageChange';

// Custom event interface
interface LocalStorageChangeEvent {
  key: string;
  value: any;
  secondaryKey?: string;
}

// Dispatch a custom event when localStorage changes
const dispatchStorageEvent = (key: string, value: any, secondaryKey?: string) => {
  const event = new CustomEvent<LocalStorageChangeEvent>(LOCAL_STORAGE_CHANGE_EVENT, {
    detail: { key, value, secondaryKey },
  });
  window.dispatchEvent(event);
};

export default function useLocalStorage<T>(
  key: string,
  initialValue: T,
  secondaryKey?: string,
): [T, (value: T | ((value?: T) => T), expirationDate?: Date) => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      // Get from local storage by key
      let item = window.localStorage.getItem(key);
      if (secondaryKey && !item) {
        const secondaryItem = window.localStorage.getItem(secondaryKey);
        if (secondaryItem) item = secondaryItem;
      }

      if (item) {
        const expiration = window.localStorage.getItem(key + 'Expiration');
        const parsedExpiration = expiration ? JSON.parse(expiration) : null;
        const expirationDate = parsedExpiration ? new Date(parsedExpiration) : null;
        if (parsedExpiration && expirationDate && expirationDate < new Date()) {
          item = null;
          window.localStorage.removeItem(key);
          window.localStorage.removeItem(key + 'Expiration');
        }
      }
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      //console.log(error);
      return initialValue;
    }
  });

  // Listen for changes to this localStorage key from other components
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorageChange = (e: CustomEvent<LocalStorageChangeEvent>) => {
      if (e.detail.key === key || e.detail.secondaryKey === key) {
        setStoredValue(e.detail.value);
      }
    };

    // Add event listener
    window.addEventListener(LOCAL_STORAGE_CHANGE_EVENT, handleStorageChange as EventListener);

    // Clean up
    return () => {
      window.removeEventListener(LOCAL_STORAGE_CHANGE_EVENT, handleStorageChange as EventListener);
    };
  }, [key]);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((value?: T) => T), expirationDate?: Date) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        if (!valueToStore && secondaryKey) {
          window.localStorage.setItem(secondaryKey, JSON.stringify(valueToStore));
        }
        if (expirationDate) {
          window.localStorage.setItem(key + 'Expiration', JSON.stringify(expirationDate));
        }

        // Broadcast the change to other components
        dispatchStorageEvent(key, valueToStore, secondaryKey);
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      //console.log(error);
    }
  };

  return [storedValue, setValue];
}
