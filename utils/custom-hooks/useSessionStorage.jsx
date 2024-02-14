import { useState, useEffect } from 'react'
export default function useSessionStorage(key, defaultValue) {
    const [value, setValue] = useState(() => {
        return JSON.parse(sessionStorage.getItem(key) || JSON.stringify(defaultValue))
    })

    useEffect(() => {
        sessionStorage.setItem(key, JSON.stringify(value))
    }, [value])
    return [value, setValue]
}
