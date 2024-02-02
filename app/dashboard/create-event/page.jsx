"use client"

import { useState, useEffect } from 'react'

import styles from './page.module.css'

import EventForm from '@components/EventForm'

export default function CreateEventPage() {
  const method = 'POST'
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    date: "",
    /* start_date: "",
    end_date: "", */
    banner: "",
    description: ""
  })

  return (
    <div className={styles.container}>
      <h1>Create Event</h1>
      <EventForm params={{ formData, setFormData, method }} />
    </div>
  )
}
