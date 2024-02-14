import { useState, useEffect } from 'react'
export default function useLocalStorage(key, defaultValue) {
    const [value, setValue] = useState(() => {
        return JSON.parse(localStorage.getItem(key) || JSON.stringify(defaultValue))
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [value, key])
    return [value, setValue]
}
