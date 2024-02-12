"use client"
import { useState, useEffect, useRef } from 'react'
import styles from "./page.module.css"

import Error from '@/components/overlays/Error'

export default function Contact() {
  // This will update if the user submits the form, this prevents spamming the submit button
  const abortControllerRef = useRef(null)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    referralSource: '',
    message: ''
  })

  const updateForm = (event) => {
    const { id, value } = event.target

    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }))
  }

  const onSubmit = async (event) => {
    event.preventDefault()

    // If there's an existing request in progress, abort it
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create a new AbortController instance
    const controller = new AbortController()
    abortControllerRef.current = controller
    const signal = controller.signal

    try {
      const response = await fetch('/api/contact/CACNA', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        signal: signal
      })

      if (response.ok) {
        // Change this to the "Success" component
        alert('Email sent successfully!')
      } else {
        setError('Failed to send email. Please try again later.')
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted')
      } else {
        console.error('Error:', error)
        alert('Failed to send email. Please try again later.')
      }
    } finally {
      // Cleanup: Remove the reference to the abort controller
      abortControllerRef.current = null
    }
  }

  return (
    <>
      {error ? <Error error={{error, setError}} /> : null }
      <div className={styles.fatherBox}>
        <form className={styles.mainBox} onSubmit={(event) => onSubmit(event)}>
          <fieldset className={styles.fs}>
            <legend className={styles.Legend}>Contact Us</legend>
            <label htmlFor="name">Name: </label>
            <br />
            <input
              type="text"
              id="name"
              name="Name"
              className={styles.Input}
              onChange={(event) => updateForm(event)}
              placeholder="John Doe"
              required
            />
            <br />
            <label htmlFor="email">Email: </label>
            <br />
            <input
              type="email"
              id="email"
              name="Email"
              className={styles.Input}
              onChange={(event) => updateForm(event)}
              placeholder="example@gmail.com"
              required
            />
            <br />
            <label htmlFor="referralSource">How did you hear about us? </label>
            <br />
            <input
              list="HeardFrom"
              id="referralSource"
              name="HeardFrom"
              className={styles.Input}
              onChange={(event) => updateForm(event)}
              placeholder='The President'
              required
            />
            <br />
            <datalist id="HeardFrom">
              <option value="Family / Friends" />
              <option value="Newsletter" />
              <option value="CACNA Facebook" />
              <option value="Other" />
            </datalist>
            <label htmlFor="message">Comments / Inquiries </label>
            <br />
            <textarea
              name="message"
              id="message"
              rows="5"
              cols="50"
              className={styles.Input}
              onChange={(event) => updateForm(event)}
              placeholder="This website is amazing"
              required
            />
            <br />
            <button className={styles.submit}>Submit</button>
          </fieldset>
        </form>
      </div>
    </>
  )
}