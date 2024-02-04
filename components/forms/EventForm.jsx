"use client"

import { useRef, useEffect, useState } from 'react'
import flatpickr from "flatpickr";

import styles from './EventForm.module.css'
// We can change the theme
import 'flatpickr/dist/themes/light.css';
// import 'flatpickr/dist/l10n/default';
import Error from '@components/overlays/Error'
import Loading from '@components/overlays/Loading'


export default function EventForm({ params }) {
  const { formData, setFormData, requestMethod, eventId } = params;
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Date picking data
  const [startFlatpickrInstance, setStartFlatpickrInstance] = useState(null);
  const startDatePicker = useRef()
  const displayStartTime = useRef()

  const [endFlatpickrInstance, setEndFlatpickrInstance] = useState(null);
  const endDatePicker = useRef()
  const displayEndTime = useRef()

  const updateForm = (event) => {
    const { id, value } = event.target;
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const resetForm = () => {
    setFormData({})
    if (startFlatpickrInstance) {
      startFlatpickrInstance.clear();
      console.log(startFlatpickrInstance)
    }
    if (endFlatpickrInstance) {
      endFlatpickrInstance.clear();
      console.log(endFlatpickrInstance)
    }
  }

  // Set time in time field when you close the datePicker
  const onStartClose = (selectedDates) => {
    // Assuming displayTime is the ID of the element where you want to display the time
    const selectedTime = selectedDates.length > 0 ? selectedDates[0].toLocaleTimeString() : ''
    displayStartTime.current.value = selectedTime
  };

  // Set time in time field when you close the datePicker
  const onEndClose = (selectedDates) => {
    // Assuming displayTime is the ID of the element where you want to display the time
    const selectedTime = selectedDates.length > 0 ? selectedDates[0].toLocaleTimeString() : ''
    displayEndTime.current.value = selectedTime
  };
  
  // Create datePicker using flatpickr
  useEffect(() => {
    if (startDatePicker.current) {
      const fp = flatpickr(startDatePicker.current, {
        // minDate: 'today',
        dateFormat: 'D Y-m-d',
        enableTime: true,
        timeZone: 'MST',
        onChange: onStartDateChange,
        onClose: onStartClose,
      });
      setStartFlatpickrInstance(fp)
    }

    if (endDatePicker.current) {
      const fp = flatpickr(endDatePicker.current, {
        // minDate: 'today',
        dateFormat: 'D Y-m-d',
        enableTime: true,
        timeZone: 'MST',
        onChange: onEndDateChange,
        onClose: onEndClose,
      });
      setEndFlatpickrInstance(fp)
    }
  }, []);

  // Update only date field from flatpickr
  const onStartDateChange = (selectedDates) => {
    // console.log(new Date(selectedDates[0]).toISOString());
    setFormData(prevFormData => ({
      ...prevFormData,
      start: new Date(selectedDates[0]).toISOString()
    }))
  };

  // Update only date field from flatpickr
  const onEndDateChange = (selectedDates) => {
    // console.log(new Date(selectedDates[0]).toISOString());
    setFormData(prevFormData => ({
      ...prevFormData,
      end: new Date(selectedDates[0]).toISOString()
    }))
  };
  
  const submitForm = async (event) => {
    event.preventDefault();
    setLoading(true)
    try {
      let API_Route = '/api/events/festivals'
      if (eventId) API_Route += `?festivalId=${eventId}`
      const response = await fetch(API_Route, {
        method: requestMethod,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: formData.date,
          title: formData.title,
          description: formData.description,
          location: formData.location,
          banner: 'Test banner, will be image URL in future',  // Update this with the actual banner data
          // banner: event.target.banner.files[0],  // Uncomment this line if 'banner' is a file input
        })
      });
  
      if (!response.ok) {
        setLoading(false)
        setError('Failed to submit the form')
        throw new Error('Failed to submit the form');
      }
  
      const responseData = await response.json();
      console.log(responseData);
      resetForm()
      setLoading(false)
    } catch (error) {
      console.error('Error submitting the form:', error.message);
    }
  };

  useEffect(() => {
    console.log(startDatePicker)
    console.log(endDatePicker)
  }, [startDatePicker, endDatePicker])
  
  return (
    <>
      { error && <Error params={{ error, setError }} /> }
      { loading ? <Loading /> :
      <form onSubmit={submitForm} className={styles.form}>
        {/* Start Dates */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Start date</legend>
          <div className={styles.formGroup}>
            <label htmlFor="date">Date:</label>
            {/* <input 
              id="date" 
              type="datetime-local" 
              value={formData.date && new Date(formData.date).toISOString().slice(0, 10) || ''} 
              onChange={updateForm} /> */}
            <input
              type="text"
              ref={startDatePicker}
              // value={formData.date ? new Date(formData.date).toISOString().slice(0, 10) : ''}
              onClick={() => console.log(startDatePicker.current)}
              placeholder="Select Date"
              onChange={(e) => onStartDateChange(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="time">Time:</label>
            <input type="text" ref={displayStartTime} onClick={() => console.log(displayStartTime.current.value)} readOnly="True" />
          </div>
        </fieldset>
        {/* End Dates */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>End date</legend>
          <div className={styles.formGroup}>
            <label htmlFor="date">Date:</label>
            <input
              type="text"
              ref={endDatePicker}
              // value={formData.date ? new Date(formData.date).toISOString().slice(0, 10) : ''}
              onClick={() => console.log(endDatePicker.current)}
              placeholder="Select Date"
              onChange={(e) => onEndDateChange(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="time">Time:</label>
            <input type="text" ref={displayEndTime} onClick={() => console.log(displayEndTime.current.value)} readOnly="True" />
          </div>
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
      </form> }
    </>
  )
}
