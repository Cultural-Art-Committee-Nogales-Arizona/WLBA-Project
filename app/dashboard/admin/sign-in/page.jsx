"use client"

import { useState, useEffect, useContext } from 'react'

import CustomUserContext from '@/components/GlobalUserContext'; 

import Error from '@/components/overlays/Error'
import Success from '@/components/overlays/Success'
import styles from './page.module.css'
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminSignIn() {
  const router = useRouter()
  const { globalUserData, setGlobalUserData } = useContext(CustomUserContext)
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  })

  useEffect(() => {
    if(globalUserData.adminAuthId){
      router.push('/dashboard')
    }
  }, [globalUserData])

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
      let API_STRING = `/api/admin?email=${credentials.email}&password=${credentials.password}&userId=${globalUserData._id}`
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
        setSuccess('Signed in as Admin')
      } else {
        setError(`Request Failed: ${returnedAdmin.errorMessage}`)
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Fetch aborted')
      } else {
        console.error('Error:', err)
        alert('Failed submit credentials')
      }
    } finally {
      console.log("works")
    }
  }

  return (
    <div>
      {error ? <Error params={{error, setError}} /> : null}
      {success ? <Success params={{success, setSuccess}} /> : null}
      <h1>Sign in to use Admin features</h1>
      <form onSubmit={handleSubmit}>
        <div className="formGroup">
          <label htmlFor="email">Email</label>
          <input 
            id="email" 
            type="email" 
            value={credentials.email}
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
      <Link href={'/dashboard/admin/recovery'}>Forgot password?</Link>
    </div>
  )
}