"use client"

import { useRef, useEffect, useState, useContext } from 'react'
import flatpickr from "flatpickr"

import styles from './EventForm.module.css'
// We can change the theme
// import 'flatpickr/dist/themes/dark.css'
import 'flatpickr/dist/themes/light.css'

// Overlays
import Error from '@components/overlays/Error'
import Success from '@components/overlays/Success'
import Loading from '@components/overlays/Loading'

import ImageUpload from '@components/forms/ImageUpload'
import CustomUserContext from '@components/GlobalUserContext'; 
/* 
import dotenv from 'dotenv'
dotenv.config() */
import Carousel from '@/components/gallery/Carousel';

/* -------------------------------------------------------------------------- */
/*                           flatpickr Documentation                          */
/* ------------ flatPickr docs https://flatpickr.js.org/examples/ ----------- */
/* -------------------------------------------------------------------------- */

export default function EventForm({ params }) {
  // Get user to see if they can post to form
  const { globalUserData, setGlobalUserData } = useContext(CustomUserContext)

  const { formData, setFormData, requestMethod, eventId } = params

  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)

  const [images, setImages] = useState([])

  /* -------------------------------------------------------------------------- */
  /*                            flatpickr Date logic                            */
  /* -------------------------------------------------------------------------- */
  // Yes, everything in the comment blocks are JUST for setting the date with flatpickr,
  // I did this VERY poorly but its working so DON'T TOUCH IT. I've already wasted 9 hours on this
  // It works... PLEASE DON'T TOUCH!

  // Start Times
  const [startFlatpickrCalendarInstance, setStartFlatpickrCalendarInstance] = useState(null)
  const [startFlatpickrTimeInstance, setStartFlatpickrTimeInstance] = useState(null)
  const startDatePicker = useRef()
  const startTimePicker = useRef()
  // End Times
  const [endFlatpickrCalendarInstance, setEndFlatpickrCalendarInstance] = useState(null)
  const [endFlatpickrTimeInstance, setEndFlatpickrTimeInstance] = useState(null)
  const endDatePicker = useRef()
  const endTimePicker = useRef()

  // Combine Date and Time into one ISO8061 string to store in event
  function combineDateAndTime(dateInput, timeInput) {
    try {
      // Check if either dateInput or timeInput is undefined
      if (!dateInput || !timeInput) return null
      // Parse date input
      const dateParts = dateInput.split('-')
      const year = parseInt(dateParts[0])
      const month = parseInt(dateParts[1]) - 1 // Months are zero-indexed in JavaScript
      const day = parseInt(dateParts[2])
      
      // Parse time input
      const timeParts = timeInput.split(':')
      const hours = parseInt(timeParts[0])
      const minutes = parseInt(timeParts[1])
      
      // Create a Date object with the combined date and time
      const combinedDateTime = new Date(year, month, day, hours, minutes)
      
      // Format the date and time as ISO8601 string with MST offset
      const isoString = combinedDateTime.toISOString()

      return isoString
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
  }

  // Update "end" field in formDate from flatpickr
  const onEndChange = (dateAndTime) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      end: dateAndTime
    }))
  }

  const flatpickrCalendarOptions = {
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
        startFlatpickrCalendarInstance.setDate(formData.start ? new Date(formData.start) : null, true)
      }
      const fp = flatpickr(startDatePicker.current, {
        ...flatpickrCalendarOptions,
        onChange: () => onStartChange(combineDateAndTime(startDatePicker.current.value, startTimePicker.current.value))
      })
      setStartFlatpickrCalendarInstance(fp)
    }

    // Start time selector
    if (startTimePicker.current) {
      if (startFlatpickrTimeInstance) {
        startFlatpickrTimeInstance.setDate(formData.start ? new Date(formData.start).toLocaleTimeString() : null, true)
      }

      const fp = flatpickr(startTimePicker.current, {
        ...flatpickrTimeOptions, 
        onChange: () => onStartChange(combineDateAndTime(startDatePicker.current.value, startTimePicker.current.value)) 
      })
      setStartFlatpickrTimeInstance(fp)
    }

    // Ending date picker
    if (endDatePicker.current) { 
      if (endFlatpickrCalendarInstance) {
        endFlatpickrCalendarInstance.setDate(formData.end ? new Date(formData.end) : null, true)
      }

      const minEndDate = formData.start ? new Date(formData.start) : null

      const fp = flatpickr(endDatePicker.current, {
        ...flatpickrCalendarOptions, 
        minDate: minEndDate,
        onClose: () => onEndChange(combineDateAndTime(endDatePicker.current.value, endTimePicker.current.value))
      })
      setEndFlatpickrCalendarInstance(fp)
    }

    // End time selector
    if (endTimePicker.current) {
      if (endFlatpickrTimeInstance) {
        endFlatpickrTimeInstance.setDate(formData.end ? new Date(formData.end).toLocaleTimeString() : null, true)
      }

      const fp = flatpickr(endTimePicker.current, { 
        ...flatpickrTimeOptions,
        onClose: () => onEndChange(combineDateAndTime(endDatePicker.current.value, endTimePicker.current.value))
      })
      setEndFlatpickrTimeInstance(fp)
    }

  }, [error, success, loading, eventId])

  /* -------------------------------------------------------------------------- */
  /*                              END OF FLATPICKR                              */
  /* -------------------------------------------------------------------------- */

  const updateForm = (event) => {
    const { id, value } = event.target
  
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }))
  }

  const resetForm = () => {
    if (startFlatpickrTimeInstance) {
      startFlatpickrTimeInstance.input.value = ""
    }
    if (startFlatpickrCalendarInstance) {
      startFlatpickrCalendarInstance.input.value = ""
    }
    if (endFlatpickrCalendarInstance) {
      endFlatpickrCalendarInstance.input.value = ""
    }
    if (endFlatpickrTimeInstance) {
      endFlatpickrTimeInstance.input.value = ""
    }
    setFormData({})
    setImages([])
  }
  
  const submitForm = async (event) => {
    event.preventDefault()
    const startingDate = combineDateAndTime(startDatePicker.current.value, startTimePicker.current.value)
    const endingDate = combineDateAndTime(endDatePicker.current.value, endTimePicker.current.value)

    
    
    // Logic to disallow broken times
    if (!startingDate) {
      setError("Start Date and Start Time must be defined")
      return
    }
    
    if (!endingDate) {
      setError("End Date and End Time must be defined")
      return
    }

    setFormData(prev => ({
      ...prev,
      start: startingDate,
      end: endingDate
    }))

    // eventId ONLY ever is selectEvent when you select the "Select an event" option
    if (eventId === 'selectEvent') {
      setError("Please select an event")
      return
    }

    if (startingDate >= endingDate) {
      setError("Start date must happen before End date")
      return
    }

    setLoading(true)

    try {
      if (requestMethod === 'PUT' && !eventId) {
        setError("You must select an event to edit")
        return
      }

      const controller = new AbortController()
      const signal = controller.signal

      // Upload the images to cloudinary,
      // This is the only way I could figure out how to use the backend API for this
      const returnedImages = []
      const imageData = new FormData()
      images.forEach(image => {
        if (image.file === "Uploaded") {
          returnedImages.push(image.preview)
          return
        }
        imageData.append(`file`, image.file);
      })

      // This api route SUCKS! but it works so I don't care
      // Don't think about it too hard
      const uploadImages = await fetch('/api/image/upload', {
        method: 'POST',
        body: imageData,
        duplex: true 
      })

      // This is dumb, but it work, so me no care
      const imageResponse = await uploadImages.json()
      returnedImages.push(...imageResponse.data)
      
      if (!imageResponse.success) throw new Error(imageResponse.error)

      // Protect the API route from non admins
      let API_Route = `/api/events/festivals`
      if (eventId) API_Route += `?festivalId=${eventId}`
      const response = await fetch(API_Route, {
        signal,
        method: requestMethod,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "same-origin",
        body: JSON.stringify({
          start: startingDate,
          end: endingDate,
          title: formData.title,
          description: formData.description,
          location: formData.location,
          images: returnedImages
        })
      })
      
      const responseData = await response.json()

      if (responseData.success) {
        resetForm()
        setSuccess("submitted form data to event database")
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
    }
  }

  // When someone is editing events then set the images to be in the useState
  useEffect(() => {
    if (formData.images) {
      const formImages = formData.images.map(image => {
        return {
          preview: image,
          file: "Uploaded"
        }
      })

      setImages(prev => [ ...prev, ...formImages ]) 
    }
  }, [formData.images])
  
  return (
    <>
      { error && <Error params={{ error, setError }} /> }
      { success && <Success params={{ success, setSuccess, redirect: '/dashboard' }} /> }
      { loading ? <Loading scale={150} /> :
      <form onSubmit={event => submitForm(event)} className={styles.form}>
        {/* Start Dates */}
        <fieldset className={styles.fieldset}>
          <legend className={`${styles.legend}`}>Event Start</legend>
          <div className={styles.titleBox}>
            <label htmlFor="date" className={styles.title}>Date:</label>
            <input
              type="text"
              ref={startDatePicker}
              placeholder="Select Date"
              className={styles.backgroundInput}
              required
            />
          </div>
          <div className={styles.titleBox}>
            <label htmlFor="time" className={styles.title}>Time:</label>
            <input 
              type="text" 
              ref={startTimePicker} 
              placeholder="Select Time"
              className={styles.backgroundInput}
              required
            />
          </div>
        </fieldset>
        {/* End Dates */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Event End</legend>
          <div className={styles.titleBox}>
            <label htmlFor="date" className={styles.title}>Date:</label>
            <input
              type="text"
              ref={endDatePicker}
              placeholder="Select Date"
              className={styles.backgroundInput}
              required
            />
          </div>
          <div className={styles.titleBox}>
            <label htmlFor="time" className={styles.title}>Time:</label>
            <input 
              type="text" 
              ref={endTimePicker} 
              placeholder="Select Time"
              className={styles.backgroundInput}
              required
            />
          </div>
        </fieldset>
        {/* Describe Event */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Describe Event</legend>
          <div className={styles.titleBox}>
            <label htmlFor="title" className={styles.title}>Title:</label>
            <input 
              id="title" 
              type="text" 
              value={formData.title || ''} 
              onChange={event => updateForm(event)} 
              placeholder='Title' 
              className={styles.backgroundInput}
              required
            />
          </div>
          <div className={`${styles.titleBox}`}>
            <label htmlFor="description" className={styles.title}>Description:</label>
            <textarea
              id="description"
              className={`${styles.textArea} ${styles.backgroundInput}`}
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
          <div className={styles.titleBox}>
            <label htmlFor="location" className={styles.title}>Location:</label>
            <input 
              id="location" 
              type="text" 
              value={formData.location || ''} 
              onChange={event => updateForm(event)} 
              placeholder="123 Main Citytown, Stateville 12345"
              className={styles.backgroundInput}
              required
            />
          </div>
          <div className={styles.titleBox}>
            <label htmlFor="banner" className={styles.title}>Image:</label>
            <div className={styles.backgroundInput}>
              <ImageUpload params={{images, setImages}}/>
            </div>
          </div>
        </fieldset>
        {/* View images */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>{images.length} Images</legend>
          { !loading ?
            (images.length !== 0 ? 
                <Carousel params={{ images, setImages, edit: true }} />
                :
                <div>
                    No images found
                </div>
            )
            :
            <Loading />
          }
        </fieldset>
        <input type="submit" className={styles.submit} value={requestMethod === 'PUT' ? 'Edit Event' : 'Create Event'}/>
      </form> }
    </>
  )
}
