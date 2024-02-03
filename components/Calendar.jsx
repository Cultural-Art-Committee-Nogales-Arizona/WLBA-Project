"use client"

import { useState, useEffect } from 'react'

import FullCalendar from '@fullcalendar/react'
import { formatRange } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import multiMonthPlugin from '@fullcalendar/multimonth'

import Loading from '@/components/overlays/Loading';

import styles from './Calendar.module.css'

export default function Calendar() {
	const [selectedDay, setSelectedDay] = useState(null)
	const [dayData, setDayData] = useState(null)
	const [events, setEvents] = useState(null)

	// go to https://fullcalendar.io/docs/formatRange for docs
	/* let str = formatRange('2018-09-01', '2018-09-15', {
		month: 'long',
		year: 'numeric',
		day: 'numeric',
		separator: ' to ',
		locale: 'es'
	  }) */

	useEffect(() => {
		async function fetchData() {
			const fetchedData = await fetch('api/events/festivals', { method: "GET" })
				.then(res => res.json())


			setEvents(fetchedData.data)
			console.log(fetchedData)
		}

		fetchData()
	}, [])

	const findData = async (date) => {
		const currentSelectedEvent = events.find(event => {
			const newDate = new Date(event.date);
			if (newDate.toISOString().slice(0, 10) === date) {
					// Update the "date" property with the new value
					event.date = newDate.toISOString();
					return true  // If the date matches, return true to indicate the event is found
			}
			return false  // If the date doesn't match, return false
		})

		// This is just for demonstration, it will not be displayed like this
		const splitDate = date.split("-")
		const stringDate = `Year: ${splitDate[0]}, Month: ${splitDate[1]}, Day: ${splitDate[2]}`
		const updatedDate = {
			...currentSelectedEvent,
			date: stringDate
		}

		const returnedData = currentSelectedEvent ? updatedDate : null

		setDayData(returnedData)
	}

	const handleDateClick = (arg) => {
		setSelectedDay(arg.dateStr)
		findData(arg.dateStr)
	}

	return (
		<div className={styles.container}>
			<div className={styles.calendar}>
				{ events ? 
					<FullCalendar
						plugins={[dayGridPlugin, multiMonthPlugin, interactionPlugin]}
						initialView="dayGridMonth"
						// events={holidays}
						events={events}
						dateClick={handleDateClick}
					/> : <Loading />
				}
			</div>
			{/* Display the data from the event */}
			{selectedDay && dayData && 
				<div>
					<h4>Document _id:</h4><p>{dayData._id}</p>
					<h4>Date:</h4><p> This event takes place {dayData.date}</p>
					<h4>Title:</h4><p> {dayData.title}</p>
					<h4>Description:</h4><p> {dayData.description}</p>
					<h4>Banner:</h4><p> {dayData.banner}</p>
					<h4>Location:</h4><p> {dayData.location}</p>
				</div>
			}
		</div>
	)
}