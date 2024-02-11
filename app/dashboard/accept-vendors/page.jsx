"use client"
import { useState, useEffect, useMemo } from 'react';
import Loading from '@/components/overlays/Loading'
import Error from '@/components/overlays/Error'
import styles from './page.module.css'

function VolunteerRequest() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [allVendors, setAllVendors] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [formData, setFormData] = useState({ 
    subjectLine: "Accepted Vendor Registration", 
    emails: [],
    message: `You have been approved as a vendor of Cultural Arts Committee of Nogales Arizona as of: 
    ${new Date().toLocaleDateString()}`,
  });

  // Fetch all volunteers
  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    setLoading(true)

    const fetchVolunteers = async () => {
      try {
        const response = await fetch('/api/vendor', { signal, method: 'GET' });
        const fetchedData = await response.json();
        setAllVendors(fetchedData.data);
        setSearchResults(fetchedData.data)
        setLoading(false)
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted')
        } else {
          console.error('Error fetching volunteers:', error);
        }
      } finally {
        // setLoading(false)
      }
    };

    fetchVolunteers();

    return () => controller.abort()
  }, []);

  /* -------------------------- Handle vendor changes ------------------------- */

  const handleCheckboxChange = (vendorEmail) => {
    setFormData((prevFormData) => {
      // Check if the vendorEmail is already in the array
      const isVendorSelected = prevFormData.emails.includes(vendorEmail);
  
      // If the vendorEmail is already selected, remove it from the array
      if (isVendorSelected) {
        return {
          ...prevFormData,
          emails: prevFormData.emails.filter((v) => v !== vendorEmail)
        };
      } else {
        // If the vendorEmail is not selected, add it to the array
        return {
          ...prevFormData,
          emails: [...prevFormData.emails, vendorEmail]
        };
      }
    });
  }  

  const handleSelectAll = () => {
    const allEmails = searchResults.map(result =>  result.email)
    setFormData((prev) => ({
      ...prev,
      emails: allEmails
    }))
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
    const regex = new RegExp(searchParam, 'i');
    
    // Filter the allVendors array based on whether the name or email matches the regex pattern
    const filtered = allVendors.filter(vendor => {
      return regex.test(vendor.name) || regex.test(vendor.email) || regex.test(vendor.interest)
    });
    
    // Update the state with the filtered results
    setSearchResults(filtered);
  };
  

  const handleSubmit = async (event) => {
    event.preventDefault()  

    if (formData.emails.length === 0) {
      setError('You must select at least one recipient')
      return
    }

    const confirmEmail = prompt(`
        Confirm information\n
        Subject: ${formData.subjectLine}\n
        Message: ${formData.message}\n
        Recipients: ${[...formData.emails]}\n\n
        Type "Yes" to confirm
        `)
        
      if (confirmEmail !== "Yes") {
        alert("Canceled form submission") 
        return
      } 

    setLoading(true)
    try {
      // ! CHANGE TO BE THE ONE FROM ADMIN LOGIN
      // const adminId = ""

      const controller = new AbortController()
      const signal = controller.signal
      const returnedData = await fetch(`/api/contact/vendors`/* ?adminId=${adminId} */, { 
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

  useEffect(() => {
    console.log(formData)
  }, [formData.message])

  return (
    <>
    {error ? <Error params={{error, setError}} /> : null}
    { loading ? <Loading /> : 
    <div>
      <div className="formGroup">
        <label htmlFor="search">Search</label>
        <input
          id="search"
          type="text"
          onChange={(event) => searchVendors(event.target.value)}
        />
      </div>
      <h2>Selected Vendors: {formData.emails.length}</h2>
      <table className={styles.volunteer_table}>
        <thead>
          <tr>
            <th><button onClick={handleSelectAll}>Select All</button></th>
            <th>Name</th>
            <th>Email</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
        {
          searchResults.length ?
          searchResults.map(volunteer => {
            return (
              <tr key={volunteer._id}>
                <td>
                  <input
                    type="checkbox"
                    id={volunteer._id}
                    checked={formData.emails.includes(volunteer.email)}
                    onChange={() => handleCheckboxChange(volunteer.email)}
                  />
                </td>
                <td>
                  {/* <label htmlFor={volunteer._id}>{volunteer.name}</label> */}
                  <p>{volunteer.name}</p>
                </td>
                <td>
                  <p>{volunteer.email}</p>
                </td>
                <td>
                  <p>{volunteer.description}</p>
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
      <form action="" onSubmit={handleSubmit}>
        <div className="formGroup">
          <label htmlFor="subjectLine">Subject Line</label>
          <input 
            type="text" 
            id="subjectLine" 
            onChange={(event) => updateFormData(event)}
            value={formData.subjectLine}
          />
        </div>
        <div className="formGroup">
          <label htmlFor="message">Message</label>
          <textarea 
            type="text" 
            id="message"
            onChange={(event) => updateFormData(event)}
            value={formData.message}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
    }
    </>
  );
}

export default VolunteerRequest;
