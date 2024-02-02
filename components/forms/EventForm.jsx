"use client"

import { useEffect, useState } from 'react'

import styles from './EventForm.module.css'
import Error from '@components/overlays/Error'


export default function EventForm({ params }) {
  const { formData, setFormData, method, eventId } = params;
  const [error, setError] = useState(null)

  const updateForm = (e) => {
    const { id, value } = e.target;
  
    // Check if the field is a date field
    const isDateField = id.includes('date');
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: isDateField ? new Date(value) : value,
    }));
  };

  useEffect(() => {
    console.log(formData)
  }, [formData])
  
  const submitForm = async (e) => {
    e.preventDefault();
  
    try {
      let API_Route = '/api/events/festivals'
      if (eventId) API_Route += `?festivalId=${eventId}`
      const response = await fetch(API_Route, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: formData.date,
          title: formData.title,
          description: formData.description,
          location: formData.location,
          banner: 'Test banner, will be image URL in future',  // Update this with the actual banner data
          // banner: e.target.banner.files[0],  // Uncomment this line if 'banner' is a file input
        })
      });
  
      if (!response.ok) {
        setError('Failed to submit the form')
        throw new Error('Failed to submit the form');
      }
  
      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error('Error submitting the form:', error.message);
    }
  };

  return (
    <>
      {error && <Error params={{ error, setError }} />}
      <form onSubmit={submitForm} className={styles.form}>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Pick date</legend>
          <div className={styles.formGroup}>
            <label htmlFor="date">Date:</label>
            <input 
              id="date" 
              type="date" 
              value={formData.date && new Date(formData.date).toISOString().slice(0, 10) || ''} 
              onChange={updateForm} />
          </div>
          {/* We may add these */}
          {/* <div className={styles.formGroup}>
            <label htmlFor="startDate">Start Date:</label>
            <input id="startDate" type="date" onChange={updateForm} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="endDate">End Date:</label>
            <input id="endDate" type="date" onChange={updateForm} />
          </div> */}
        </fieldset>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Describe Event</legend>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title:</label>
            <input 
              id="title" 
              type="text" 
              value={formData.title || ''} 
              onChange={updateForm} 
              placeholder='Title' />
          </div>
          <div className={`${styles.formGroup}`}>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              className={styles.textArea}
              value={formData.description || ''}
              onChange={updateForm}
              placeholder="Description"
            />
          </div>
        </fieldset>
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Additional Information</legend>
          <div className={styles.formGroup}>
            <label htmlFor="location">Location:</label>
            <input 
              id="location" 
              type="text" 
              value={formData.location || ''} 
              onChange={updateForm} 
              placeholder='Location' />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="banner">Banner:</label>
            <p>will add later</p>
            {/* <input 
              id="banner" 
              type="file" 
              value={formData.file || ''} 
              onChange={updateForm} 
              /> */}
          </div>
        </fieldset>
        <input type="submit" className={styles.submit} />
      </form>
    </>
  )
}
