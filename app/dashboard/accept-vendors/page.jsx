"use client"
import { useState, useEffect, useMemo } from 'react'
import Loading from '@/components/overlays/Loading'
import Error from '@/components/overlays/Error'
import styles from './page.module.css'

function VolunteerRequest() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [allVendors, setAllVendors] = useState([])
  const [searchResults, setSearchResults] = useState([])

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

    const fetchVolunteers = async () => {
      try {
        const response = await fetch('/api/vendor', { signal, method: 'GET' })
        const fetchedData = await response.json()
        setAllVendors(fetchedData.data)
        setSearchResults(fetchedData.data)
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

  /* -------------------------- Handle vendor changes ------------------------- */
  
  const handleCheckboxChange = (vendor) => {
    /* -------------------------------------------------------------------------- */
    // I am aware that this function is a Tower Of Terror but its working fine.
    // We shouldn't have to touch it.

    // if you want a short way way of writing this, this function does the same thing.
    // But it is very hard to read
    /* 
      const handleCheckboxChange = (vendor) => {
        setFormData(prevFormData => ({
          ...prevFormData,
          vendors: prevFormData.vendors.some(v => v.id === vendor._id) ?
            prevFormData.vendors.filter(v => v.id !== vendor._id) :
            [...prevFormData.vendors, { name: vendor.name, email: vendor.email, id: vendor._id }]
        }))
      } 
    */
    /* -------------------------------------------------------------------------- */
  
    setFormData(prevFormData => {
      // Check if the vendor is already in the array
      const isVendorSelected = prevFormData.vendors.some(v => v.id === vendor._id)
  
      if (isVendorSelected) {
        // If the vendor is already selected, remove it from the array
        return {
          ...prevFormData,
          vendors: prevFormData.vendors.filter(v => v.id !== vendor._id)
        }
      } else {
        // If the vendor is not selected, add it to the array
        return {
          ...prevFormData,
          vendors: [
            ...prevFormData.vendors,
            {
              name: vendor.name,
              email: vendor.email,
              id: vendor._id
            }
          ]
        }
      }
    })
  }

  const toggleAll = () => {
    // Check if all vendors are already selected
    const allSelected = searchResults.every(result => {
      // This is cringe, why is this what works?
      return formData.vendors.some(vendor => vendor.email === result.email)
    })

    if (allSelected) {
      // If all vendors are selected, deselect all
      setFormData(prev => ({
        ...prev,
        vendors: []
      }))
    } else {
      // If not all vendors are selected, select all
      const allVendors = searchResults.map(result => {
        return {
          email: result.email,
          id: result._id,
          name: result.name
        }
      })
      setFormData(prev => ({
        ...prev,
        vendors: allVendors
      }))
    }
  }

  const updateFormData = (event) => {
    const { id, value } = event.target

    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  /* -------------------------------------------------------------------------- */

  const searchVendors = (searchParam) => {
    // Create a regex pattern using the search parameter and the 'i' flag for case-insensitive matching
    const regex = new RegExp(searchParam, 'i')
    
    // Filter the allVendors array based on whether the name or email matches the regex pattern
    const filtered = allVendors.filter(vendor => {
      return regex.test(vendor.name) || regex.test(vendor.email) || regex.test(vendor.description) || regex.test(...vendor.tags)
    })
    
    // Update the state with the filtered results
    setSearchResults(filtered)
  }
  

  const handleSubmit = async (event) => {
    event.preventDefault()  

    if (formData.vendors.length === 0) {
      setError('You must select at least one vendor')
      return
    }

    const allEmails = formData.vendors.map((vendor) => vendor.email)

    const confirmEmail = prompt(`
        Confirm information\n
        Subject: ${formData.subjectLine}\n
        Message: ${formData.message}\n
        Recipients: ${[...allEmails]}\n\n
        Type "Yes" to confirm
        `)
        
      if (confirmEmail !== "Yes") {
        alert("Canceled form submission") 
        return
      } 

    setLoading(true)
    
    try {
      // ! CHANGE TO BE THE ONE FROM globalUserData
      // const adminId = ""

      const controller = new AbortController()
      const signal = controller.signal
      const returnedData = await fetch(`/api/vendor/accept`/* ?adminId=${adminId} */, { 
        signal, 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData) 
      })

      const result = await returnedData.json()
      console.log(result)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Dev logs
  /* useEffect(() => {
    console.log(formData)
  }, [formData]) */

  return (
    <>
    {error ? <Error params={{error, setError}} /> : null}
    {/* Display table  */}
    { loading ? <Loading /> : 
    <div className={styles.container}>
      <div className="formGroup">
        <label htmlFor="search">Search</label>
        <input
          id="search"
          type="text"
          onChange={(event) => searchVendors(event.target.value)}
        />
      </div>
      <h2>Selected Vendors: {formData.vendors.length}</h2>
      {/* Start of table */}
      <table className={styles.volunteer_table}>
        <thead>
          <tr>
            <th><button onClick={toggleAll}>Toggle All</button></th>
            <th>Name</th>
            <th>Email</th>
            <th>Description</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
        {
          searchResults.length ?
          searchResults.map(vendor => {
            return (
              <tr key={vendor._id}>
                <td>
                  <input
                    type="checkbox"
                    id={vendor._id}
                    checked={formData.vendors.some(v => v.id === vendor._id)}
                    onChange={() => handleCheckboxChange(vendor)}
                  />
                </td>
                <td>
                  <p>{vendor.name}</p>
                </td>
                <td>
                  <p>{vendor.email}</p>
                </td>
                <td>
                  <p>{vendor.description}</p>
                </td>
                <td>
                  <p>{vendor.tags.join(", ")}</p>
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
      {/* Start of form input */}
      <form action="" onSubmit={handleSubmit}>
        <div className="formGroup">
          <label htmlFor="subjectLine">Subject Line</label>
          <input 
            type="text" 
            id="subjectLine" 
            className={styles.subject}
            onChange={(event) => updateFormData(event)}
            value={formData.subjectLine}
          />
        </div>
        <div className="formGroup">
          <label htmlFor="message">Message</label>
          <textarea 
            type="text" 
            id="message"
            className={styles.message}
            onChange={(event) => updateFormData(event)}
            value={formData.message}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
    }
    </>
  )
}

export default VolunteerRequest
