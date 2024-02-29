'use client';

import { useContext, useState, useEffect, useMemo } from 'react';
import { Row, Col } from 'reactstrap';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';

import Loading from '@components/overlays/Loading';
import ErrorMessage from '@components/overlays/ErrorMessage';
import Highlight from '@/components/Highlight';
import EmailForm from '@/components/forms/EmailForm'

import CustomUserContext from '@components/GlobalUserContext'; 

import styles from './page.module.css';

function Profile() {
  const { globalUserData, setGlobalUserData } = useContext(CustomUserContext)
  const { user, isLoading } = useUser()
  const [ pageData, setPageData ] = useState({
    allEvents: [],
    nextEvent: {}
  })

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    
    const fetchData = async () => {
      try {
        const eventsResponse = await fetch('/api/events/festivals', {
          signal,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: "same-origin"
        })

        const nextEventResponse = await fetch(`/api/events/festivals?nextEvent=${true}`, {
          signal,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: "same-origin"
        })

        const parsedEvents = await eventsResponse.json()
        const parsedNextEvent = await nextEventResponse.json()
        console.log(parsedNextEvent)

        setPageData({
          allEvents: parsedEvents.data,
          nextEvent: parsedNextEvent.data
        })
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching users:', error)
        }
      }
    }

    if(globalUserData.adminAuthId){
      fetchData()
    }

    // Abort fetching if component unmounts
    // This will cancel any ongoing fetch requests
    return () => controller.abort();
  }, [ globalUserData ])

  return (
    <div className='container'>
      {isLoading && <Loading />}
      {/* Temporary link */}
      {user && (
        <div>
          { globalUserData.adminAuthId ? 
            <>
              <h1>Welcome {globalUserData.username}</h1> 
              <img
                src={user.picture}
                alt="Profile"
                className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
                decode="async"
                data-testid="profile-picture"
              />
              <p className="lead" data-testid="profile-email">
                {globalUserData.email}
              </p>
              <hr />
              <h3>Events Information</h3>
              <div>
                {/* display more information about the event, add vendor and volunteer counts */}
                <p>Current Next Event: {pageData.nextEvent.title || "No upcoming events"}</p>
                <p>Registered Events: {pageData.allEvents.length}</p>
              </div>
              <hr />
              <h3>Support Resources</h3>
              <p>
                
                <a target="_blank" href={'https://github.com/Cultural-Art-Committee-Nogales-Arizona/WLBA-Project/blob/main/api-documentation.md'}>API Docs</a>
              </p>
            </>
            : 
            <h3>Not signed in as admin</h3> 
          }
        </div>
      )}
    </div>
  );
}

export default withPageAuthRequired(Profile, {
  onRedirecting: () => <Loading />,
  onError: error => <ErrorMessage>{error.message}</ErrorMessage>
});
