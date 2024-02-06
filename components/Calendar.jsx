"use client"

import { useState, useEffect } from 'react'

import FullCalendar from '@fullcalendar/react'
import { formatRange } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import multiMonthPlugin from '@fullcalendar/multimonth'
import esLocale from '@fullcalendar/core/locales/es';


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
		}

		fetchData()
	}, [])

	const findData = async (date) => {
		const clickedDate = new Date(date).toLocaleString('en-US', { timeZone: 'America/Denver', timeZoneName: 'short' });
		const currentSelectedEvent = events.filter(festival => {
			const startDate = new Date(festival.start).toLocaleString('en-US', { timeZone: 'America/Denver', timeZoneName: 'short' });
			const endDate = new Date(festival.end).toLocaleString('en-US', { timeZone: 'America/Denver', timeZoneName: 'short' });
			console.log(`Clicked Date: ${clickedDate}\nStart Date: ${startDate}\nEnd Date: ${endDate}` )
			
			// Check if the clickedDate is within the range of the festival's start and end dates
			if (startDate <= clickedDate && clickedDate <= endDate) {
				const updatedDate = {
					...festival,
					start: startDate,
					end: endDate,
				};
				return updatedDate;
			}

			return false
		})
		
		// console.table(currentSelectedEvent)
		setDayData(currentSelectedEvent)
	}

	const handleDateClick = async (arg) => {
		setSelectedDay(arg.dateStr)
		await findData(arg.dateStr)
	}

	useEffect(() => {
		console.log(dayData)
	}, [dayData])

	return (
		<div className={styles.container}>
			<div className={styles.calendar}>
				{ events ? 
					<FullCalendar
						plugins={[dayGridPlugin, multiMonthPlugin, interactionPlugin]}
						initialView="dayGridMonth"
						timeZone='MST'
						events={events}
						dateClick={handleDateClick}
					/> : <Loading />
				}
			</div>
			{/* Display the data from the event */}
			{selectedDay &&
				dayData &&
				dayData.map((event) => (
					<div key={event._id}>
						<h4>Document _id:</h4>
						<p>{event._id}</p>
						<h4>Start Date:</h4>
						<p> This event starts on {event.start}</p>
						<h4>End Date:</h4>
						<p> This event ends on {event.end}</p>
						<h4>Title:</h4>
						<p> {event.title}</p>
						<h4>Description:</h4>
						<p> {event.description}</p>
						<h4>Banner:</h4>
						<p> {event.banner}</p>
						<h4>Location:</h4>
						<p> {event.location}</p>
					</div>
				))
			}

		</div>
	)
}