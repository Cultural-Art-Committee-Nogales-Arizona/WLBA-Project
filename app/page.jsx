'use client'
import { useEffect, useState } from 'react'
import Hero from '@/components/Hero'
import Loading from '@/components/overlays/Loading'
import styles from './page.module.css'

export default function Index() {
  const [nextEvent, setNextEvent] = useState(null)
  
  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

		async function fetchData() {
			try {
        const eventCall = await fetch('./api/events/festivals?nextEvent=true', { signal, method: "GET" })
        const fetchedData = await eventCall.json()
        
        const startDate = new Date(fetchedData.data.start)
        const endDate = new Date(fetchedData.data.end)
        
        const returnedEvent = {
          ...fetchedData.data,
          // You can change these Date methods to whatever format you want
          start: startDate.toLocaleDateString(),
          end: endDate.toLocaleDateString()
        }
        
        console.log(returnedEvent)
        setNextEvent(returnedEvent)
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted')
        } else {
          console.error('Error fetching data:', error)
        }
      }
		}

		fetchData()

    return () => controller.abort()
	}, [])

  return (
      <div>
        <Hero />

        {/* <h1>Next Event</h1>
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
          <Loading scale={200} />
        } */}
      </div>
  )
}