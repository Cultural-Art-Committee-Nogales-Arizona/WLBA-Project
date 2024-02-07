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
  // I did this VERY poorly but its working so DON'T TOUCH IT. I've already wasted 9 hours on this
  // It works... PLEASE DON'T TOUCH!

  // Start Times
  const [startFlatpickrCalendarInstance, setStartFlatpickrCalendarInstance] = useState(null);
  const [startFlatpickrTimeInstance, setStartFlatpickrTimeInstance] = useState(null);
  const startDatePicker = useRef()
  const startTimePicker = useRef()
  // End Times
  const [endFlatpickrCalendarInstance, setEndFlatpickrCalendarInstance] = useState(null);
  const [endFlatpickrTimeInstance, setEndFlatpickrTimeInstance] = useState(null);
  const endDatePicker = useRef()
  const endTimePicker = useRef()

  // Combine Date and Time into one ISO8061 string to store in event
  function combineDateAndTime(dateInput, timeInput) {
    try {
      // Check if either dateInput or timeInput is undefined
      if (!dateInput || !timeInput) return null; // Return null if either input is undefined
      // Parse date input
      const dateParts = dateInput.split('-');
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1; // Months are zero-indexed in JavaScript
      const day = parseInt(dateParts[2]);
      
      // Parse time input
      const timeParts = timeInput.split(':');
      const hours = parseInt(timeParts[0]);
      const minutes = parseInt(timeParts[1]);
      
      // Create a Date object with the combined date and time
      const combinedDateTime = new Date(year, month, day, hours, minutes);
      
      // Format the date and time as ISO8601 string with MST offset
      const isoString = combinedDateTime.toISOString()

      return isoString;
    } catch (err) {
      setError(err.message)
    }
  }
  
  // Update "start" field in formDate from flatpickr
  const onStartChange = (dateAndTime) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      start: dateAndTime
    }))
  };

  // Update "end" field in formDate from flatpickr
  const onEndChange = (dateAndTime) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      end: dateAndTime
    }))
  };

  const flatpickrCalendarOptions = {
    minDate: 'today',
    dateFormat: 'Y-m-d',
    timeZone: 'MST',
  }

  const flatpickrTimeOptions = {
    enableTime: true,
    noCalendar: true,
    time_24hr: true
  }
  
  // Create date & time picking calendar using flatpickr
  useEffect(() => {
    // Starting date picker
    if (startDatePicker.current) {
      if (startFlatpickrCalendarInstance) {
        startFlatpickrCalendarInstance.setDate(formData.start, true);
      }
      const fp = flatpickr(startDatePicker.current, flatpickrCalendarOptions);
      setStartFlatpickrCalendarInstance(fp)
    }

    // Start time selector
    if (startTimePicker.current) {
      if (startFlatpickrTimeInstance) {
        startTimePicker.current.value = formData.start ? new Date(formData.start).toLocaleTimeString() : null
      }

      const fp = flatpickr(startTimePicker.current, {
        ...flatpickrTimeOptions, 
        onClose: onStartChange(combineDateAndTime(startDatePicker.current.value, startTimePicker.current.value)) 
      });
      setStartFlatpickrTimeInstance(fp)
    }

    // Ending date picker
    if (endDatePicker.current) { 
      if (endFlatpickrCalendarInstance) {
        endFlatpickrCalendarInstance.setDate(formData.end, true);
      }

      const minEndDate = formData.start ? new Date(formData.start) : 'today';

      const fp = flatpickr(endDatePicker.current, {
        ...flatpickrCalendarOptions, 
        minDate: minEndDate,
        onClose: onEndChange(combineDateAndTime(endDatePicker.current.value, endTimePicker.current.value))
      });
      setEndFlatpickrCalendarInstance(fp)
    }

    // End time selector
    if (endTimePicker.current) {
      if (endFlatpickrTimeInstance) {
        endTimePicker.current.value = formData.end ? new Date(formData.end).toLocaleTimeString() : null
      }

      const fp = flatpickr(endTimePicker.current, { 
        ...flatpickrTimeOptions,
        onClose: onEndChange(combineDateAndTime(endDatePicker.current.value, endTimePicker.current.value))
      });
      setEndFlatpickrTimeInstance(fp)
    }

    console.table(formData)
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
    if (startFlatpickrCalendarInstance) {
      startFlatpickrCalendarInstance.input.value = "";
    }
    if (endFlatpickrCalendarInstance) {
      endFlatpickrCalendarInstance.input.value = "";
    }
    if (startFlatpickrTimeInstance) {
      startFlatpickrTimeInstance.input.value = "";
    }
    if (endFlatpickrTimeInstance) {
      endFlatpickrTimeInstance.input.value = "";
    }
  }
  
  const submitForm = async (event) => {
    event.preventDefault();
    setLoading(true)
    const startingDate = combineDateAndTime(startDatePicker.current.value, startTimePicker.current.value)
    const endingDate = combineDateAndTime(endDatePicker.current.value, endTimePicker.current.value)

    try {
      if (startingDate >= endingDate) {
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
          start: startingDate,
          end: endingDate,
          title: formData.title,
          description: formData.description,
          location: formData.location,
          banner: 'Test banner, will be image URL in future',  // Update this with the actual banner data
          // banner: event.target.banner.files[0],  // Uncomment this line if 'banner' is a file input
        })
      })
      
      const responseData = await response.json();

      if (responseData.success) {
        resetForm()
      } else { 
        setError('Failed to submit the form')
        throw new Error(`Event API failed to parse request code: ${response.status}`);
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
              onClick={() => console.log(startDatePicker.current.value)}
              placeholder="Select Date"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="time">Time:</label>
            <input 
              type="text" 
              ref={startTimePicker} 
              placeholder="Select Time"
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
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="time">Time:</label>
            <input 
              type="text" 
              ref={endTimePicker} 
              placeholder="Select Time"
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
