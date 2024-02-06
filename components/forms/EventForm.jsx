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

  /* --------------------------- Date picking logic --------------------------- */
  // flatPickr docs https://flatpickr.js.org/examples/
  // Yes, everything in the lines are JUST for setting the date with flatpickr,
  // I did this VERY poorly but its working so DON'T TOUCH IT. I've already wasted 5 hours on this

  // Start Times
  const [startFlatpickrInstance, setStartFlatpickrInstance] = useState(null);
  const startDatePicker = useRef()
  const displayStartTime = useRef()
  // End Times
  const [endFlatpickrInstance, setEndFlatpickrInstance] = useState(null);
  const endDatePicker = useRef()
  const displayEndTime = useRef()

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
  
  // Update "start" field in formDate from flatpickr
  const onStartDateChange = (selectedDates) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      start: new Date(selectedDates[0]).toISOString()
    }))
  };

  // Update "end" field in formDate from flatpickr
  const onEndDateChange = (selectedDates) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      end: new Date(selectedDates[0]).toISOString()
    }))
  };

  const flatpickrOptions = {
    minDate: 'today',
    dateFormat: 'D Y-m-d',
    enableTime: true,
    timeZone: 'MST',
  }
  
  // Create date & time picking calendar using flatpickr
  useEffect(() => {
    if (startDatePicker.current) {
      if (startFlatpickrInstance) {
        startFlatpickrInstance.setDate(formData.start);
        displayStartTime.current.value = new Date(formData.start).toLocaleTimeString()
      }
      const fp = flatpickr(startDatePicker.current, {
        ...flatpickrOptions, 
        onChange: onStartDateChange,
        onClose: onStartClose
      });
      setStartFlatpickrInstance(fp)
    }

    if (endDatePicker.current) { 
      if (endFlatpickrInstance) {
        endFlatpickrInstance.setDate(formData.end);
        displayEndTime.current.value = new Date(formData.end).toLocaleTimeString()
      }

      const minEndDate = formData.start ? new Date(formData.start) : 'today';

      const fp = flatpickr(endDatePicker.current, {
        ...flatpickrOptions, 
        minDate: minEndDate,
        onChange: onEndDateChange,
        onClose: onEndClose
      });
      setEndFlatpickrInstance(fp)
    }
  }, [formData.start, formData.end, error]);

  /* ------------------------------ REST OF FORM ------------------------------ */

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
      startFlatpickrInstance.input.value = "";
      console.log(startFlatpickrInstance)
    }
    if (endFlatpickrInstance) {
      endFlatpickrInstance.input.value = "";
      console.log(endFlatpickrInstance)
    }
  }
  
  const submitForm = async (event) => {
    event.preventDefault();
    setLoading(true)
    const startDate = new Date(formData.start)
    const endDate = new Date(formData.end)

    try {
      if (startDate >= endDate) {
        setError("Start date must happen before End date")
        return
      }

      const confirmEvent = prompt(`
        Confirm information\n
        Title: ${formData.title}\n
        Description: ${formData.description}\n
        Start Time: ${formData.start}\n
        End Time: ${formData.end}\n
        Location: ${formData.location}\n\n
        Type "Yes" to confirm
        `)
        
      if (confirmEvent !== "Yes") {
        alert("Canceled form submission") 
        return
      } 

      let API_Route = '/api/events/festivals'
      if (eventId) API_Route += `?festivalId=${eventId}`
      const response = await fetch(API_Route, {
        method: requestMethod,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          title: formData.title,
          description: formData.description,
          location: formData.location,
          banner: 'Test banner, will be image URL in future',  // Update this with the actual banner data
          // banner: event.target.banner.files[0],  // Uncomment this line if 'banner' is a file input
        })
      })
      
      const responseData = await response.json();

      if (!responseData.success) {
        setError('Failed to submit the form')
        throw new Error(`Event API failed to parse request code: ${response.status}`);
      } else { 
        resetForm()
      }

    } catch (error) {
      console.error('Error submitting the form:', error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      { error && <Error params={{ error, setError }} /> }
      { loading ? <Loading /> :
      <form onSubmit={event => submitForm(event)} className={styles.form}>
        {/* Start Dates */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Start date</legend>
          <div className={styles.formGroup}>
            <label htmlFor="date">Date:</label>
            <input
              type="text"
              ref={startDatePicker}
              onClick={() => console.log(startDatePicker.current)}
              placeholder="Select Date"
              onChange={(e) => onStartDateChange(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="time">Time:</label>
            <input 
              type="text" 
              ref={displayStartTime} 
              onChange={() => console.log(displayStartTime.current.value)} 
              readOnly="True" 
              required
            />
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
              placeholder="Select Date"
              onChange={(e) => onEndDateChange(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="time">Time:</label>
            <input 
              type="text" 
              ref={displayEndTime} 
              onChange={() => console.log(displayEndTime.current.value)} 
              readOnly="True" 
              required
            />
          </div>
        </fieldset>
        {/* Describe Event */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Describe Event</legend>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title:</label>
            <input 
              id="title" 
              type="text" 
              value={formData.title || ''} 
              onChange={event => updateForm(event)} 
              placeholder='Title' 
              required
            />
          </div>
          <div className={`${styles.formGroup}`}>
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              className={styles.textArea}
              value={formData.description || ''}
              onChange={event => updateForm(event)} 
              placeholder="Description"
              required
            />
          </div>
        </fieldset>
        {/* Additional Information */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Additional Information</legend>
          <div className={styles.formGroup}>
            <label htmlFor="location">Location:</label>
            <input 
              id="location" 
              type="text" 
              value={formData.location || ''} 
              onChange={event => updateForm(event)} 
              placeholder='Location' 
              required
            />
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
