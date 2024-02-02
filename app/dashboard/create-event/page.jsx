"use client"

import { useState, useEffect } from 'react'
import PageLink from '@components/PageLink'

import styles from './page.module.css'

import EventForm from '@components/forms/EventForm'

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
      <h1>Create New Event</h1>
      <PageLink href="/dashboard/edit-event" className="nav-link" testId="navbar-home">
        <span>Edit Existing Event</span>
      </PageLink>
      <EventForm params={{ formData, setFormData, method }} />
    </div>
  )
}
