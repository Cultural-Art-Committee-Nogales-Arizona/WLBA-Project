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
    start: "",
    end: "",
    banner: "",
    description: ""
  })

  const handleDropdownChange = (event) => {
    if (event.target.value === "") return
    setEventId(event.target.value)
    const foundEvent = events.find(festival => festival._id === event.target.value)
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
  
  function returnUnfinishedEvents(events) {
    return events.filter(event => {
      const rightNow = new Date()

      const startDate = new Date(event.start)
      const endDate = new Date(event.end)

      return endDate > rightNow
    })
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

  return (
    <div className={styles.container}>
      <h1>Edit Existing Event</h1>
      <PageLink href="/dashboard/create-event" className="nav-link" testId="navbar-home">
        <span>Create New Event</span>
      </PageLink>
      <form>
          Select Event: 
          <select value={eventId} onChange={(event) => handleDropdownChange(event)}>
            <option value="">Select an event</option>
            {returnUnfinishedEvents(events).map((event) => (
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
