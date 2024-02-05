'use client';

import { useEffect, useState } from 'react';

import Hero from '@/components/Hero';
import Content from '@/components/Content';
import Footer from '@/components/Footer';
import Loading from '@/components/overlays/Loading';

export default function Index() {
  const [nextEvent, setNextEvent] = useState(null)
  
  useEffect(() => {
		async function fetchData() {
			const eventCall = await fetch('./api/events/festivals?nextEvent=true', { method: "GET" })
			
      const fetchedData = await eventCall.json()

      const startDate = new Date(fetchedData.data.start)
      const endDate = new Date(fetchedData.data.end)
      
      const returnedEvent = {
        ...fetchedData.data,
        start: startDate.toLocaleDateString(),
        end: endDate.toLocaleDateString()
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
          <h4>Start Date:</h4><p> The next event starts on {nextEvent.start}</p>
          <h4>End Date:</h4><p> The next event ends on {nextEvent.end}</p>
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
      {/* <Content /> */}
      {/* <Footer /> */}
    </>
  );
}
