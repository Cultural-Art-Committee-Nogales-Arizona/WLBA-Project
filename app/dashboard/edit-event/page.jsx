"use client"

import { useState, useEffect } from 'react'

import styles from './page.module.css'

import EventForm from '@components/forms/EventForm'

export default function EditEventPage() {
  const method = 'PUT'
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

  const handleDropdownChange = (e) => {
    setEventId(e.target.value);
  };
  
  const submitForm = (e) => {
    e.preventDefault()
    const foundEvent = events.find(event => event._id === eventId)
    setFormData(foundEvent)
  }

  const deleteEvent = async () => {
    const confirmDelete = prompt(`Please confirm deletion of event titled: ${formData.title}\nType "Yes" to confirm`)
    if (confirmDelete !== "Yes") return 
    const response = await fetch(`../api/events/festivals?festivalId=${formData._id}`, { method: 'DELETE' })
      .then(res => res.json())
    
  }

  useEffect(() => {
		async function fetchData() {
			const fetchedData = await fetch('../api/events/festivals', { method: "GET" })
				.then(res => res.json())

			setEvents(fetchedData.data)
			console.log(fetchedData)
		}

		fetchData()
	}, [])

  /* useEffect(() => {
    console.log(formData)
  }, [formData]) */




  return (
    <div className={styles.container}>
      <h1>Edit Event</h1>
      <form onSubmit={submitForm}>
        <label>
          Select Event:
          <select value={eventId} onChange={handleDropdownChange} >
            <option value="">Select an event</option>
            {events.map((event) => (
              <option key={event._id} value={event._id}>
                {event.title}
              </option>
            ))}
          </select>
        </label>

        <button type="submit">Select Event</button>
        <button onClick={deleteEvent}>Delete Event</button>
      </form>
      <EventForm params={{ formData, setFormData, method, eventId }} />
    </div>
  )
}
