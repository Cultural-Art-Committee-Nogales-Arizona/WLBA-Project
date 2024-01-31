"use client"

import { useState, useEffect } from 'react'

import styles from './Calendar.module.css'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import multiMonthPlugin from '@fullcalendar/multimonth'

export default function Calendar() {
  const [selectedDay, setSelectedDay] = useState(null)
  const [dayData, setDayData] = useState(null)
  const [events, setEvents] = useState(null)

  useEffect(() => {
    async function fetchData() {
      const fetchedData = await fetch('api/events/festivals', { method: "GET" })
        .then(res => res.json())


      setEvents(fetchedData.data)
      console.log(fetchedData)
    }

    fetchData()
  }, [selectedDay])

  const findData = async (date) => {
    setDayData(events.find(day => day.date == date))
  }

  const handleDateClick = (arg) => {
    setSelectedDay(arg.dateStr)
    // findData(arg.dateStr)
  }

  return (
    <div className={styles.container}>
      <div className={styles.calendar}>
        <FullCalendar
          plugins={[ dayGridPlugin, multiMonthPlugin, interactionPlugin ]}
          initialView="multiMonthYear"
          // events={holidays}
          events={events}
          dateClick={handleDateClick}
        />
      </div>
      {/* Display the data from the event */}
      {selectedDay && dayData && <div>{dayData.title}</div>}
    </div>
  )
}