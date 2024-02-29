"use client"

import { useState, useEffect, useRef, useContext } from 'react'
import CustomUserContext from '@/components/GlobalUserContext'; 
import PageLink from '@components/PageLink'

import Loading from '@/components/overlays/Loading'

import styles from './page.module.css'

import EventForm from '@/components/forms/EventForm'

export default function EditEventPage() {
  const { globalUserData, setGlobalUserData } = useContext(CustomUserContext)
  const abortControllerRef = useRef(null)
  const requestMethod = 'PUT'
  const [eventId, setEventId] = useState('')
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState([])
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    start: "",
    end: "",
    description: "",
    images: [],
  })
  const [searchResults, setSearchResults] = useState([])
  const [initialImages, setInitialImages] = useState([])

  const handleEventSelect = (tableEvent) => {
    setEventId(tableEvent)
    const foundEvent = events.find(festival => festival._id === tableEvent)
    setFormData(foundEvent)
}

  const searchTable = (searchParam) => {
    // Create a regex pattern using the search parameter and the 'i' flag for case-insensitive matching
    const regex = new RegExp(searchParam, 'i')

    // Filter the tableData array based on whether the name or email matches the regex pattern
    const filtered = events.filter(tableEvent => {
        return regex.test(tableEvent.title) || regex.test(tableEvent.description) || regex.test(...tableEvent.location)
    })

    // Update the state with the filtered results
    setSearchResults(filtered)
  }

  const deleteEvent = async (event, festivalId) => {
    event.preventDefault()

    // If there's an existing request in progress, abort it
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    const controller = new AbortController()
    abortControllerRef.current = controller
    const signal = controller.signal

    const confirmDelete = prompt(`Please confirm deletion of event titled: ${formData.title}\nType "Yes" to confirm`)
    if (confirmDelete !== "Yes") return

    try {
      setLoading(true)
      const API_STRING = `/api/events/festivals?festivalId=${festivalId}`

      const response = await fetch(API_STRING, { 
        signal, 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: "same-origin"
      })
      const data = await response.json()
      setEventId("")
      setFormData({
        title: "",
        location: "",
        start: "",
        end: "",
        description: "",
        images: [],
      })
      setInitialImages([])
      const removeEvent = searchResults.filter(result => result._id !== festivalId)
      setSearchResults(removeEvent)
      // Handle response data as needed
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch aborted')
      } else {
        console.error('Error:', error)
        // Handle other errors as needed
      }
    } finally {
      // Cleanup: Remove the reference to the abort controller
      abortControllerRef.current = null
      setLoading(false)
    }
  }

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

		async function fetchData() {
			try {
        const fetchedData = await fetch('/api/events/festivals', { signal, method: "GET" })
				.then(res => res.json())

        setEvents(fetchedData.data)
        setSearchResults(fetchedData.data || [])
        setInitialImages(fetchedData.data.images)
        setLoading(false)
      } catch (error) {
        setLoading(false)
        if (error.name === 'AbortError') {
          console.log('Fetch aborted')
        } else {
          setError(error.message)
          console.error('Error:', error)
          // Handle other errors as needed
        }
      }
		}

		fetchData()

    return () => controller.abort()
	}, [eventId])

  return (
    <div className={styles.container}>
      <h1>Edit Existing Event</h1>
      <PageLink href="/dashboard/create-event" className="nav-link" testId="navbar-home">
        <span>Create New Event</span>
      </PageLink>
      <form>
        {loading ? 
        <Loading /> :

          <div className={styles.table_container}>
            <div className={styles.titleBox}>
                    <div className={styles.title}>Search</div>
                    <input className={styles.backgroundInput} onChange={(event) => searchTable(event.target.value)} />
                </div>
                <div className={styles.titleBox}>
                    <div className={styles.title}>Results: {searchResults.length}</div>
                </div>
                    <table className={styles.email_table}>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Date</th>
                                <th>Location</th>
                                <th>Select</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody className={styles.table_body}>
                            {
                                searchResults.length ?
                                searchResults.map(tableEvent => {
                                    return (
                                      <tr key={tableEvent._id}>
                                        <td>
                                          {tableEvent.title}
                                        </td>
                                        <td>
                                          {tableEvent.start}
                                        </td>
                                        <td>
                                          {tableEvent.location}
                                        </td>
                                        <td>
                                          <button type='button' onClick={() => handleEventSelect(tableEvent._id)}>Select</button>
                                        </td>
                                        <td>
                                          <button type='button' onClick={event => deleteEvent(event, tableEvent._id)}>Delete</button>
                                        </td>
                                      </tr>
                                      )
                                    })
                                    :
                                    <tr>
                                        <td>No matches</td>
                                    </tr>
                            }
                  </tbody>
            </table>
          </div>
          }
      </form>


      <EventForm params={{ formData, setFormData, requestMethod, eventId }} />
    </div>
  )
}
