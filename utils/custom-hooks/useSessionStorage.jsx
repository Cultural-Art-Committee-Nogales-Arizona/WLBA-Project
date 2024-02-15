/* "use client"
import { useState, useEffect } from 'react'

export default function useSessionStorage(key, defaultValue) {
    const [value, setValue] = useState(() => {
        return JSON.parse(sessionStorage.getItem(key) || JSON.stringify(defaultValue))
    })

    useEffect(() => {
        sessionStorage.setItem(key, JSON.stringify(value))
    }, [value, key])

    return [value, setValue]
}

 */
import { useState, useEffect } from "react";

export function getStorageValue(key, defaultValue) {
  // getting stored value
  const saved = localStorage.getItem(key);
  const initial = JSON.parse(saved);
  return initial || defaultValue;
}

export default function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    // storing input name
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};
/* 
import { useState, useEffect } from 'react';

export default function useSessionStorage(key, defaultValue) {
    console.log('useSessionStorage called');
    
    const [value, setValue] = useState(() => {
        const storedValue = sessionStorage.getItem(key);
        console.log('Stored value:', storedValue);
        return storedValue ? JSON.parse(storedValue) : defaultValue;
    });

    useEffect(() => {
        console.log('Setting sessionStorage:', key, value);
        sessionStorage.setItem(key, JSON.stringify(value));
    }, [value, key]);

    return [value, setValue];
}
 
*/

/* import { useState, useEffect } from 'react'
export default function useSessionStorage(key, defaultValue) {
    const [value, setValue] = useState(() => {
        const storedValue = sessionStorage.getItem(key);
        try {
            return storedValue ? JSON.parse(storedValue) : defaultValue;
        } catch (error) {
            console.error(`Error parsing JSON for key '${key}':`, error);
            return defaultValue;
        }
    });

    useEffect(() => {
        sessionStorage.setItem(key, JSON.stringify(value));
    }, [value, key]);

    return [value, setValue];
}
 */