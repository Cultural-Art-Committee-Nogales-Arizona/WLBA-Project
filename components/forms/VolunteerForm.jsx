"use client"

import { useRef, useEffect, useState, useContext } from 'react'
import flatpickr from "flatpickr"

import styles from './VolunteerForm.module.css'

import Error from '@components/overlays/Error'
import Loading from '@components/overlays/Loading'

import CustomUserContext from '@components/GlobalUserContext'



/* -------------------------------------------------------------------------- */
/*                           flatpickr Documentation                          */
/* ------------ flatPickr docs https://flatpickr.js.org/examples/ ----------- */
/* -------------------------------------------------------------------------- */

/* Commented out all flatpickr implementation incase we want to add an ending date to your volunteer */

export default function VolunteerForm({ params }) {
  const abortControllerRef = useRef(null)

  const {globalUserData, setGlobalUserData} = useContext(CustomUserContext)

  const { formData, setFormData, requestMethod } = params
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const updateForm = (event) => {
    const { id, value } = event.target
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }))
  }
  
  const submitForm = async (event) => {
    event.preventDefault()
    setLoading(true)

    try {
      // We will probably not use this confirmation box 
      /* const confirmEvent = prompt(`
            Confirm information\n
            Name: ${formData.name}\n
            Phone: ${formData.phone}\n
            email: ${formData.email}\n
            Interest: ${formData.interest}\n\n
            Type "Yes" to confirm
        `)
        
      if (confirmEvent !== "Yes") {
        alert("Canceled form submission") 
        return
      }  */
    
      // If there's an existing request in progress, abort it
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      const controller = new AbortController()
      abortControllerRef.current = controller
      const signal = controller.signal
      
      let API_Route = '/api/events/volunteer'
      const response = await fetch(API_Route, {
        signal,
        method: requestMethod,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...formData,
            id: globalUserData?._id
        })
      })
      
      const responseData = await response.json()

      if (responseData.success) {
        setFormData({})
        // I want to make a success component, alert freezes the window 
        alert(`Successfully make volunteer Named: ${responseData.data.name}`)
      } else { 
        setError(`Failed to submit the form ${responseData.errorMessage}`)
        throw new Error(`Event API failed to parse request. Status code: ${response.status}`)
      }

    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted')
      } else {
        console.error('Error:', error)
        // Handle other errors as needed
      }
    } finally {
        setLoading(false)
        // Cleanup: Remove the reference to the abort controller
        abortControllerRef.current = null
    }
  }
  
  return (
    <>
      { error && <Error params={{ error, setError }} /> }
      { loading ? <Loading scale={150} /> 
      :
      <form onSubmit={event => submitForm(event)} className={styles.form}>
        {/* Add your Name */}
        <fieldset className={styles.fieldset}>
          {/* <legend className={styles.legend}>Name</legend> */}
          <div className={styles.formGroup}>
            <label htmlFor="name">Name:</label>
            <input 
              id="name" 
              type="text" 
              value={formData.name || ''} 
              onChange={event => updateForm(event)} 
              placeholder='John Doe' 
              required
            />
          </div>
          <div className={`${styles.formGroup}`}>
            <label htmlFor="phone">Phone:</label>
            <input
              id="phone"
              type='tel'
              value={formData.phone || ''}
              onChange={event => updateForm(event)} 
              placeholder="phone"
              required
            />
          </div>
        </fieldset>
        {/* Additional Information */}
        <fieldset className={styles.fieldset}>
          {/* <legend className={styles.legend}>Additional Information</legend> */}
          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <input 
              id="email" 
              type="email" 
              value={formData.email || ''} 
              onChange={event => updateForm(event)} 
              placeholder='example@gmail.com' 
              required
            />
          </div>
          {/* We might not implement adding images to events */}
          <div className={styles.formGroup}>
            <label htmlFor="interest">Interest:</label>
            <input 
              id="interest" 
              type="text" 
              list="interests"
              value={formData.interest || ''} 
              onChange={event => updateForm(event)} 
              placeholder='cleanup'
            />
            <datalist id="interests">
                <option value="Example">Example</option>
                <option value="Example">Example</option>
                <option value="Example">Example</option>
                <option value="Example">Example</option>
            </datalist>
          </div>
        </fieldset>
        <input type="submit" className={styles.submit} />
      </form> 
      }
    </>
  )
}
