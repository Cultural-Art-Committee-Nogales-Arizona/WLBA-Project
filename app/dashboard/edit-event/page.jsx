"use client"

import { useState, useEffect } from 'react'
import PageLink from '@components/PageLink'

import styles from './page.module.css'

import EventForm from '@components/forms/EventForm'

export default function EditEventPage() {
  const requestMethod = 'PUT'
  const [eventId, setEventId] = useState('')
  const [events, setEvents] = useState([])
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    date: "",
    /* start_date: "",
    end_date: "", */
    banner: "",
    description: ""
  })

  const handleDropdownChange = (event) => {
    setEventId(event.target.value)
    const foundEvent = events.find(event => event._id === event.target.value)
    setFormData(foundEvent)
  }

  const deleteEvent = async (event) => {
    event.preventDefault()
    const confirmDelete = prompt(`Please confirm deletion of event titled: ${formData.title}\nType "Yes" to confirm`)
    if (confirmDelete !== "Yes") return 
    const response = await fetch(`../api/events/festivals?festivalId=${formData._id}`, { method: 'DELETE' })
      .then(res => res.json())
    console.log(response)
  }

  useEffect(() => {
		async function fetchData() {
			const fetchedData = await fetch('../api/events/festivals', { method: "GET" })
				.then(res => res.json())

			setEvents(fetchedData.data)
			console.log(fetchedData)
		}

		fetchData()
	}, [eventId])

  /* useEffect(() => {
    console.log(formData)
  }, [formData]) */




  return (
    <div className={styles.container}>
      <h1>Edit Existing Event</h1>
      <PageLink href="/dashboard/create-event" className="nav-link" testId="navbar-home">
        <span>Create New Event</span>
      </PageLink>
      <form>
          Select Event: 
          <select value={eventId} onChange={handleDropdownChange} >
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
