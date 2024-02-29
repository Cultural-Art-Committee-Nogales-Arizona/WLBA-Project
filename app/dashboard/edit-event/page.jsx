"use client"

import { useState, useEffect, useRef, useContext } from 'react'
import CustomUserContext from '@/components/GlobalUserContext'; 
import PageLink from '@components/PageLink'

import styles from './page.module.css'

import EventForm from '@/components/forms/EventForm'

export default function EditEventPage() {
  const { globalUserData, setGlobalUserData } = useContext(CustomUserContext)
  const abortControllerRef = useRef(null)
  const requestMethod = 'PUT'
  const [eventId, setEventId] = useState('')
  const [events, setEvents] = useState([])
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    start: "",
    end: "",
    description: "",
    images: [],
  })
  const [initialImages, setInitialImages] = useState([])

  const handleEventChange = (event) => {
    if (event.target.value === "") {
      setEventId("selectEvent")
      setFormData({
        title: "",
        location: "",
        start: "",
        end: "",
        description: "",
        images: [],
      })
      return 
    }
    setEventId(event.target.value)
    const foundEvent = events.find(festival => festival._id === event.target.value)
    setFormData(foundEvent)
  }

  const deleteEvent = async (event) => {
    event.preventDefault()

    // If there's an existing request in progress, abort it
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller
    const signal = controller.signal

    const confirmDelete = prompt(`Please confirm deletion of event titled: ${formData.title}\nType "Yes" to confirm`)
    if (confirmDelete !== "Yes") return

    try {
      const API_STRING = `/api/events/festivals?festivalId=${formData._id}`

      const response = await fetch(API_STRING, { 
        signal, 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "same-origin"
      })
      const data = await response.json()
      setEventId("")
      setFormData({
        title: "",
        location: "",
        start: "",
        end: "",
        description: "",
        images: [],
      })
      setInitialImages([])
      // Handle response data as needed
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted')
      } else {
        console.error('Error:', error)
        // Handle other errors as needed
      }
    } finally {
      // Cleanup: Remove the reference to the abort controller
      abortControllerRef.current = null
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

		async function fetchData() {
			try {
        const fetchedData = await fetch('/api/events/festivals', { signal, method: "GET" })
				.then(res => res.json())

        setEvents(fetchedData.data)
        setInitialImages(fetchedData.data.images)
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted')
        } else {
          console.error('Error:', error)
          // Handle other errors as needed
        }
      }
		}

		fetchData()

    return () => controller.abort()
	}, [eventId])

  return (
    <div className={styles.container}>
      <h1>Edit Existing Event</h1>
      <PageLink href="/dashboard/create-event" className="nav-link" testId="navbar-home">
        <span>Create New Event</span>
      </PageLink>
      <form>
          Select Event: 
          <select value={eventId} onChange={(event) => handleEventChange(event)}>
            <option value="">Select an event</option>
            {events.map((event) => (
              <option key={event._id} value={event._id}>
                {event.title}
              </option>
            ))}
          </select>
        <button onClick={deleteEvent}>Delete Event</button>
      </form>
      <EventForm params={{ formData, setFormData, requestMethod, eventId }} />
    </div>
  )
}
