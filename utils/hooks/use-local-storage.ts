import { useState } from 'react';

export default function useLocalStorage(key: string, initialValue: string) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      let item = window.localStorage.getItem(key);

      if (item) {
        const expiration = window.localStorage.getItem(key + 'Expiration');
        const expirationDate = new Date(JSON.parse(expiration));
        if (expirationDate && expirationDate < new Date()) {
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
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: string, expirationDate?: Date) => {
    try {
      // Allow value to be a function so we have same API as useState
      //const valueToStore = value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(value);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(value));
      if (expirationDate) {
        window.localStorage.setItem(key + 'Expiration', JSON.stringify(expirationDate));
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      //console.log(error);
    }
  };
  return [storedValue, setValue];
}
