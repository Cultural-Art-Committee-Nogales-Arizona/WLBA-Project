'use client';

import { useEffect, useState } from 'react';

import Hero from '@/components/Hero';
import Content from '@/components/Content';
import Loading from '@/components/overlays/Loading';

export default function Index() {
  const [nextEvent, setNextEvent] = useState(null)
  useEffect(() => {
		async function fetchData() {
			const fetchedData = await fetch('api/events/festivals?nextEvent=true', { method: "GET" })
				.then(res => res.json())

      const newDate = new Date(fetchedData.data.date)

      const returnedEvent = {
        ...fetchedData.data,
        date: newDate.toISOString().slice(0, 10)
      }

			console.log(returnedEvent)
			setNextEvent(returnedEvent)
		}

		fetchData()
	}, [])

  return (
    <>
      <h1>Next Event</h1>
      <hr />
      { nextEvent ? 
        <div>
          <h4>Date:</h4><p> The next event takes place on {nextEvent.date}</p>
					<h4>Title:</h4><p> {nextEvent.title}</p>
					<h4>Description:</h4><p> {nextEvent.description}</p>
					<h4>Banner:</h4><p> {nextEvent.banner}</p>
					<h4>Location:</h4><p> {nextEvent.location}</p>
        </div> 
        : 
        <Loading />
      }
      <hr />
      <Hero />
      <Content />
    </>
  );
}
