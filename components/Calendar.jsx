"use client"

import { useState, useEffect, useRef } from 'react'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import multiMonthPlugin from '@fullcalendar/multimonth'
import timeGridPlugin from '@fullcalendar/timegrid'

import esLocale from '@fullcalendar/core/locales/es';
import enLocale from '@fullcalendar/core/locales/en-gb';

import Loading from '@/components/overlays/Loading';

import styles from './Calendar.module.css'

/* -------------------------------------------------------------------------- */
/*                       Documentation for fullcalendar                       */
/* ---------- Full documentation: https://fullcalendar.io/docs#toc ---------- */
/* ---- Get Events Docs: https://fullcalendar.io/docs/Resource-getEvents ---- */
/* -------------------------------------------------------------------------- */

export default function Calendar() {
	// Language change with buttons
	const [currentLocale, setCurrentLocale] = useState(enLocale);

	const [dayData, setDayData] = useState(null)
	const [events, setEvents] = useState(null)

	/* ----------------------------- Custom buttons ----------------------------- */

	const englishTranslation = {
		text: 'English',
		click: () => setCurrentLocale(enLocale)
	}

	const spanishTranslation = {
		text: 'Spanish',
		click: () => setCurrentLocale(esLocale)
	}

	/* ---------------------------- Calendar toolbars --------------------------- */

	const calendarHeader = {
		left: 'dayGridMonth,timeGridWeek,timeGridDay',
		center: 'title',
		right: 'today prev,next',
	}

	const calendarFooter = {
		start: 'englishTranslation spanishTranslation',
		center: '',
		// ↓ We can change these button to do whatever we want ↓ 
		end: 'dayGridMonth,timeGridWeek,timeGridDay'
	}

	/* -------------------------------------------------------------------------- */

	useEffect(() => {
		const controller = new AbortController();
		const signal = controller.signal;

		async function fetchData() {
		try {
			const fetchedData = await fetch('api/events/festivals', { signal, method: "GET" })
			.then(res => res.json());
			setEvents(fetchedData.data);
		} catch (error) {
			if (error.name === 'AbortError') {
			console.log('Fetch aborted');
			} else {
			console.error('Error fetching data:', error);
			}
		}
		}

		fetchData();

		return () => controller.abort()
	}, []);

	const findData = async (date) => {
		// ! DON'T TOUCH THIS !
		// IT'S WORKING IT TOOK ME OVER 5 HOURS GETTING EVERYTHING WORKING
		// It's not as simple of a problem to debug as it looks, PLEASE! don't break this
		// it was a timezone issue, that I was trying to solve by storing the date as MST in MongoDB.
		// it HAD to be stored as UTC, I should learn to read!
		// It screwed everything up, its done now. !!HALLELUJAH!!
		const clickedDate = new Date(date);
		const currentSelectedEvents = events.filter(festival => {
			const startDate = new Date(festival.start);
			const endDate = new Date(festival.end);
			// Extract the day parts of the dates
			const clickedDay = new Date(clickedDate.getFullYear(), clickedDate.getMonth(), clickedDate.getDate()).getTime();
			const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate()).getTime();
			const endDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate()).getTime();
			// Check if the clickedDate is within the range of the festival's start and end dates
			if (startDay <= clickedDay && clickedDay <= endDay) return true

			return false;
		});

		setDayData(currentSelectedEvents);
		setDayData(currentSelectedEvents);
	};

	return (
		<div className={styles.container}>
			<div className={styles.calendar}>
				{events ?
					<FullCalendar
						plugins={[dayGridPlugin, multiMonthPlugin, interactionPlugin, timeGridPlugin]}
						initialView='dayGridMonth'
						events={events}
						customButtons={{ englishTranslation, spanishTranslation }}
						headerToolbar={calendarHeader}
						footerToolbar={calendarFooter}
						selectable='true'
						select={(start) => findData(start.start)}
						locale={currentLocale}
						// We can change color to whatever we want
						eventColor='#378006'
					/>
					:
					<Loading scale={200} />
				}
			</div>

			{/* Display the data from the event */}
			{/* selectedDay && */
				dayData &&
				dayData.map((event, index) => (
					<div key={event._id}>
						<h1>Event Number: {index + 1}</h1>
						<h4>Document _id:</h4>
						<p>{event._id}</p>
						<h4>Start Date:</h4>
						<p> This event starts on {new Date(event.start).toLocaleString()}</p>
						<h4>End Date:</h4>
						<p> This event ends on {new Date(event.end).toLocaleString()}</p>
						<h4>Title:</h4>
						<p> {event.title}</p>
						<h4>Description:</h4>
						<p> {event.description}</p>
						<h4>Location:</h4>
						<p> {event.location}</p>
						<h4>Banner:</h4>
						<p> {event.banner}</p>
						<hr />
					</div>
				))
			}
		</div>
	)
}