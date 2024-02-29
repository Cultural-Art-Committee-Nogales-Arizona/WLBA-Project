"use client"
import { useState, useEffect, useContext }  from 'react'
import CustomUserContext from '@/components/GlobalUserContext'

import ManageVendorForm from '@components/forms/ManageVendorForm'

import Loading from '@/components/overlays/Loading'
import Error from '@/components/overlays/Error'
import PageLink from '@components/PageLink'

import styles from './page.module.css'

function VolunteerRequest() {
  const { globalUserData, setGlobalUserData } = useContext(CustomUserContext)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [tableData, setTableData] = useState([])

  const [formData, setFormData] = useState({ 
    subjectLine: "Accepted Vendor Registration", 
    vendors: [],
    message: `You have been approved as a vendor of Cultural Arts Committee of Nogales Arizona as of: 
    ${new Date().toLocaleDateString()}`,
  })

  // Fetch all volunteers
  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    setLoading(true)

    const fetchVendors = async () => {
      try {
        const response = await fetch('/api/vendor', { signal, method: 'GET' })
        const fetchedData = await response.json()
        const filtered = fetchedData.data.filter(vendor => vendor.accepted == false)
        setTableData(filtered)
        setLoading(false)
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching vendors:', error)
          setError(error.message)
        }
      }
    }

    fetchVendors()

    return () => controller.abort()
  }, [])

  return (
    <div className={styles.container}>
      {/* {error ? <Error params={{error, setError}} /> : null} */}
      {/* Display table  */}
      <h1>Incoming Vendors</h1>
      <PageLink href="/dashboard/manage-vendors" className="nav-link" testId="navbar-home">
        <span>Manage Accepted Vendors</span>
      </PageLink>
      { loading ? <Loading /> : 
        <ManageVendorForm params={{tableData, contactRoute: "/api/vendor/accept", formData, setFormData, accept: true}} />
      }
    </div>
  )
}

export default VolunteerRequest
