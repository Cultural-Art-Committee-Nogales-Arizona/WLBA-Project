"use client"

import { useState, useEffect, useRef } from 'react'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import multiMonthPlugin from '@fullcalendar/multimonth'
import timeGridPlugin from '@fullcalendar/timegrid'

import esLocale from '@fullcalendar/core/locales/es';
import enLocale from '@fullcalendar/core/locales/en-nz';

import Loading from '@/components/overlays/Loading';

import Carousel from '@/components/gallery/Carousel';

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
		text: 'Español',
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
				if (events === null) {
					await findData(new Date)
				}
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
		if (!events) return
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
	};

	return (
		<div className={styles.container}>
			<div className={styles.calendar}>
				{events ?
					<FullCalendar
						// className="notranslate"
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
						<br /> <br /><br />
						<h1>Title: {event.title}</h1>
						<div className={styles.eventDetails}>
							<h5><span className={styles.key}>Start Date:</span> {new Date(event.start).toLocaleString()}</h5>
							<h5><span className={styles.key}>End Date:</span> {new Date(event.end).toLocaleString()}</h5>
							<h5><span className={styles.key}>Description:</span> {event.description}</h5>
							<h5><span className={styles.key}>Location:</span> {event.location}</h5>
							<h5><span className={styles.key}>{event.images.length} Images:</span><Carousel params={{ imagePreviews: event.images }} /></h5>
						</div>
						<hr />
					</div>
				))
			}
		</div>
	)
}