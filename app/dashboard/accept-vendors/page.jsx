"use client"
import { useState, useEffect, useContext, useMemo } from 'react'
import CustomUserContext from '@/components/GlobalUserContext'

import EmailForm from '@/components/forms/EmailForm'

import Loading from '@/components/overlays/Loading'
import Error from '@/components/overlays/Error'


import styles from './page.module.css'

function VolunteerRequest() {
  const { globalUserData, setGlobalUserData } = useContext(CustomUserContext)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [tableData, setTableData] = useState([])

  const [formData, setFormData] = useState({ 
    subjectLine: "Accepted Vendor Registration", 
    emails: [],
    message: `You have been approved as a vendor of Cultural Arts Committee of Nogales Arizona as of: 
    ${new Date().toLocaleDateString()}`,
  })

  // Fetch all volunteers
  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    setLoading(true)

    const fetchVolunteers = async () => {
      try {
        const response = await fetch('/api/vendor', { signal, method: 'GET' })
        const fetchedData = await response.json()
        setTableData(fetchedData.data)
        setLoading(false)
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching volunteers:', error)
        }
      }
    }

    fetchVolunteers()

    return () => controller.abort()
  }, [])

  return (
    <div>
      {error ? <Error params={{error, setError}} /> : null}
      {/* Display table  */}
      { loading ? <Loading /> : 
        <EmailForm params={{tableData, contactRoute: "/api/contact/volunteers", formData, setFormData}} />
      }
    </div>
  )
}

export default VolunteerRequest
