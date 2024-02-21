"use client"

import { useRef, useEffect, useState, useContext } from 'react'
import flatpickr from "flatpickr"

import styles from './VolunteerForm.module.css'

import Error from '@components/overlays/Error'
import Success from '@components/overlays/Success'
import Loading from '@components/overlays/Loading'

import CustomUserContext from '@components/GlobalUserContext'



/* -------------------------------------------------------------------------- */
/*                           flatpickr Documentation                          */
/* ------------ flatPickr docs https://flatpickr.js.org/examples/ ----------- */
/* -------------------------------------------------------------------------- */

/* Commented out all flatpickr implementation incase we want to add an ending date to your volunteer */

export default function VolunteerForm({ params }) {
  const {globalUserData, setGlobalUserData} = useContext(CustomUserContext)
  const abortControllerRef = useRef(null)

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)
  const { formData, setFormData, requestMethod } = params

  const phoneNumberRegex = /^\d{3}-\d{3}-\d{4}$/;

  const updateForm = (event) => {
    const { id, value } = event.target;
  
    // Check if the input is for the phone number field
    if (id === 'phone') {
      // Remove any non-numeric characters from the input value
      const numericValue = value.replace(/\D/g, '');
  
      // Format the phone number as xxx-xxx-xxxx
      let formattedValue = '';
      if (numericValue.length > 3) {
        formattedValue += numericValue.substring(0, 3) + '-';
        if (numericValue.length > 6) {
          formattedValue += numericValue.substring(3, 6) + '-';
          formattedValue += numericValue.substring(6, 10);
        } else {
          formattedValue += numericValue.substring(3, numericValue.length);
        }
      } else {
        formattedValue = numericValue;
      }
  
      // Update the form data with the formatted phone number
      setFormData((prevFormData) => ({
        ...prevFormData,
        [id]: formattedValue,
      }));
    } else {
      // For other input fields, update the form data as usual
      setFormData((prevFormData) => ({
        ...prevFormData,
        [id]: value,
      }));
    }
  };

  const submitForm = async (event) => {
    event.preventDefault()
    
    if (!phoneNumberRegex.test(formData.phone)) {
      setError('Invalid phone number, needs XXX-XXX-XXXX');
      return;
    }
    
    try {
      setLoading(true)
      // If there's an existing request in progress, abort it
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      const controller = new AbortController()
      abortControllerRef.current = controller
      const signal = controller.signal

      const { name, phone, email, interest } = formData

      let API_Route = '/api/events/volunteer'
      const response = await fetch(API_Route, {
        signal,
        method: requestMethod,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name, 
          phone, 
          email, 
          interest,
          id: globalUserData?._id
        })
      })
      
      const responseData = await response.json()

      if (responseData.success) {
        setFormData({})
        // I want to make a success component, alert freezes the window 
        setSuccess(`Successfully make volunteer Named: ${responseData.data.name}`)
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
      { success && <Success params={{ success, setSuccess }} /> }
      { loading ? <Loading scale={150} /> 
      :
      <form onSubmit={event => submitForm(event)} className={styles.container}>
          <div className={styles.titleBox}>
            <label htmlFor="name" className={styles.title}>Name:</label>
            <input 
              className={styles.backgroundInput}
              id="name" 
              type="text" 
              value={formData.name || ''} 
              onChange={event => updateForm(event)} 
              placeholder='John Doe' 
              required
            />
          </div>
          <div className={styles.titleBox}>
            <label htmlFor="phone" className={styles.title}>Phone:</label>
            <input
              className={styles.backgroundInput}
              id="phone"
              type='tel'
              value={formData.phone || ''}
              onChange={event => updateForm(event)} 
              placeholder="phone"
              required
            />
          </div>
          <div className={styles.titleBox}>
            <label htmlFor="email" className={styles.title}>Email:</label>
            <input 
              className={styles.backgroundInput}
              id="email" 
              type="email" 
              value={formData.email || ''} 
              onChange={event => updateForm(event)} 
              placeholder='example@gmail.com' 
              required
            />
          </div>
          {/* We might not implement adding images to events */}
          <div className={styles.titleBox}>
            <label htmlFor="interest" className={styles.title}>Interest:</label>
            <br /><br />
            <input 
              className={styles.backgroundInput}
              id="interest" 
              type="text" 
              list="interests"
              value={formData.interest || ''} 
              onChange={event => updateForm(event)} 
              placeholder='cleanup'
            />
            <datalist id="interests">
              <option value="Cleanup">Cleanup</option>
              {/* <option value="Security">Security</option> */}
              <option value="Ticketing">Ticketing</option>
              <option value="Information Booth">Information Booth</option>
              <option value="Stage Crew">Stage Crew</option>
              <option value="Food Service">Food Service</option>
              <option value="Merchandise Sales">Merchandise Sales</option>
              <option value="Set-Up">Set-Up</option>
              <option value="Breakdown">Breakdown</option>
              <option value="First Aid">First Aid</option>
              <option value="Parking">Parking</option>
              <option value="Traffic Control">Traffic Control</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Social Media">Social Media</option>
              <option value="Photography">Photography</option>
              <option value="Videography">Videography</option>
              <option value="Event Planning">Event Planning</option>
              <option value="Hospitality">Hospitality</option>
              <option value="Volunteer Coordination">Volunteer Coordination</option>
              <option value="Decoration">Decoration</option>
              <option value="Guest Services">Guest Services</option>
              {/* <option value="Other">Other</option> */}
            </datalist>
          </div>
        <input type="submit" className={styles.submit} value={"Become a volunteer"}/>
      </form> 
      }
    </>
  )
}