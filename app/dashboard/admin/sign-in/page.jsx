"use client"

import { useState, useEffect, useContext } from 'react'

import CustomUserContext from '@/components/GlobalUserContext'; 
import Error from '@/components/overlays/Error'

import styles from './page.module.css'

export default function AdminSignIn() {
  const { globalUserData, setGlobalUserData } = useContext(CustomUserContext)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  })

  const handleInput = (event) => {
    const { id, value } = event.target

    setCredentials(prev => ({
      ...prev,
      [id]: value
    }))
  }
   
  
  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      let API_STRING = `/api/admin?username=${credentials.username}&password=${credentials.password}`
      const response = await fetch(API_STRING, { method: 'GET' })

      const returnedAdmin = await response.json()

      if (returnedAdmin.success) {
        const adminAuthId = returnedAdmin.data.adminAuthId;
        
        // Set adminAuthId to sessionStorage
        sessionStorage.setItem('adminAuthId', adminAuthId);
        
        setGlobalUserData(prev => ({
          ...prev,
          admin: true,
          adminAuthId: adminAuthId
        }))
      } else {
        setError(`Request Failed: ${returnedAdmin.message}`)
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted')
      } else {
        console.error('Error:', error)
        alert('Failed submit credentials')
      }
    } finally {
      console.log("works")
    }
  }

  useEffect(() => {
    console.log(globalUserData)
  }, [globalUserData])

  return (
    <div>
      {error ? <Error params={{error, setError}} /> : null}
      <form onSubmit={handleSubmit}>
        <div className="formGroup">
          <label htmlFor="username">Username</label>
          <input 
            id="username" 
            type="text" 
            value={credentials.username}
            onChange={event => handleInput(event)}
          />
        </div>
        <div className="formGroup">
          <label htmlFor="password">Password</label>
          <input 
            id="password" 
            type="password" 
            value={credentials.password}
            onChange={event => handleInput(event)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}