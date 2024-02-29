"use client"

import { useState, useEffect, useContext } from 'react'

import CustomUserContext from '@/components/GlobalUserContext'; 

// Overlays
import Error from '@/components/overlays/Error'
import Success from '@/components/overlays/Success'
import Loading from '@/components/overlays/Loading'

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
      setLoading(true)
      let API_STRING = `/api/admin?email=${credentials.email}&password=${credentials.password}&userId=${globalUserData._id}`
      const response = await fetch(API_STRING, { method: 'GET' })

      const returnedAdmin = await response.json()

      if (returnedAdmin.success) {        
        setGlobalUserData(prev => ({
          ...prev,
          admin: true,
          adminAuthId: true
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
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
      {error ? <Error params={{error, setError}} /> : null}
      {success ? <Success params={{success, setSuccess}} /> : null}
      <h1 className={styles.formHeading}>Sign in to use Admin features</h1>
      { loading ? 
        <Loading /> : 
        <>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label  className={styles.formLabel} htmlFor="email">Email</label>
              <input 
              className={styles.formInput}
                id="email" 
                type="email" 
                value={credentials.email}
                onChange={event => handleInput(event)}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password"  className={styles.formLabel}>Password</label>
              <input 
                className={styles.formInput}
              id="password" 
                type="password" 
                value={credentials.password}
                onChange={event => handleInput(event)}
              />
            </div>
            
            <button className={styles.formButton} type="submit">Submit</button>
          </form>
          <div className={styles.formLink}>
              <Link href={'/dashboard/admin/recovery'}>Forgot password?</Link>
          </div>
        </> 
      }
      </div>
    </div>
  )
}