"use client"

import { useEffect, useState } from 'react'

import styles from './CreateEventForm.module.css'


export default function CreateEventForm() {
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    date: "",
    /* start_date: "",
    end_date: "", */
    banner: "",
    description: ""
  })

  const updateForm = (e) => {
    const { id, value } = e.target;
  
    // Check if the field is a date field
    const isDateField = id.includes('date');
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: isDateField ? new Date(value) : value,
    }));
  };
  
  const submitForm = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('/api/events/festivals', {
        method: 'POST',
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
    <form onSubmit={submitForm} className={styles.form}>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Pick date</legend>
        <div className={styles.formGroup}>
          <label htmlFor="date">Date:</label>
          <input id="date" type="date" onChange={updateForm} />
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
          <input id="title" type="text" onChange={updateForm} placeholder='Title' />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description">Description:</label>
          <input id="description" type="text" onChange={updateForm} placeholder='Description' />
        </div>
      </fieldset>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>Additional Information</legend>
        <div className={styles.formGroup}>
          <label htmlFor="location">Location:</label>
          <input id="location" type="text" onChange={updateForm} placeholder='Location' />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="banner">Banner:</label>
          <input id="banner" type="file" onChange={updateForm} />
        </div>
      </fieldset>
      <input type="submit" className={styles.submit} />
    </form>
  )
}
