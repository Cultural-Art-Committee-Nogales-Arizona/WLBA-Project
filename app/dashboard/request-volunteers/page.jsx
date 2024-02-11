"use client"
import { useState, useEffect, useMemo } from 'react';
import Loading from '@/components/overlays/Loading'
import Error from '@/components/overlays/Error'
import styles from './page.module.css'

function VolunteerRequest() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [allVolunteers, setAllVolunteers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [formData, setFormData] = useState({ 
    subjectLine: "", 
    message: "",
    emails: []
  });

  // Fetch all volunteers
  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal
    setLoading(true)

    const fetchVolunteers = async () => {
      try {
        const response = await fetch('/api/events/volunteer', { signal, method: 'GET' });
        const fetchedData = await response.json();
        setAllVolunteers(fetchedData.data);
        setSearchResults(fetchedData.data)
        setLoading(false)
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted')
        } else {
          console.error('Error fetching volunteers:', error);
        }
        setLoading(false)
      }
    };

    fetchVolunteers();

    return () => controller.abort()
  }, []);

  /* ------------------------ Handle volunteer changes ------------------------ */

  const handleCheckboxChange = (volunteerEmail) => {
    setFormData((prevFormData) => {
      // Check if the volunteerEmail is already in the array
      const isVolunteerSelected = prevFormData.emails.includes(volunteerEmail);
  
      // If the volunteerEmail is already selected, remove it from the array
      if (isVolunteerSelected) {
        return {
          ...prevFormData,
          emails: prevFormData.emails.filter((v) => v !== volunteerEmail)
        };
      } else {
        // If the volunteerEmail is not selected, add it to the array
        return {
          ...prevFormData,
          emails: [...prevFormData.emails, volunteerEmail]
        };
      }
    });
  }  

  const toggleAll = () => {
    // Check if all emails are already selected
    const allSelected = searchResults.every(result => formData.emails.includes(result.email));
  
    if (allSelected) {
      // If all emails are selected, deselect all
      setFormData(prev => ({
        ...prev,
        emails: []
      }));
    } else {
      // If not all emails are selected, select all
      const allEmails = searchResults.map(result => result.email);
      setFormData(prev => ({
        ...prev,
        emails: allEmails
      }));
    }
  };
  

  const updateFormData = (event) => {
    const { id, value } = event.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  /* -------------------------------------------------------------------------- */

  const searchVolunteers = (searchParam) => {
    // Create a regex pattern using the search parameter and the 'i' flag for case-insensitive matching
    const regex = new RegExp(searchParam, 'i');
    
    // Filter the allVolunteers array based on whether the name or email matches the regex pattern
    const filtered = allVolunteers.filter(volunteer => {
      return regex.test(volunteer.name) || regex.test(volunteer.email) || regex.test(volunteer.interest)
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
      const returnedData = await fetch(`/api/contact/volunteers`/* ?adminId=${adminId} */, { 
        signal, 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData) 
      })

      const result = await returnedData.json()
      console.log(result)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error(error)
    }
  }

  /* useEffect(() => {
    console.log(formData)
  }, [formData.message]) */

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
          onChange={(event) => searchVolunteers(event.target.value)}
        />
      </div>
      <h2>Selected Volunteers: {formData.emails.length}</h2>
      <table className={styles.volunteer_table}>
        <thead>
          <tr>
            <th><button onClick={toggleAll}>Toggle All</button></th>
            <th>Name</th>
            <th>Email</th>
            <th>Interest</th>
          </tr>
        </thead>
        <tbody>
        {
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
                  <label htmlFor={volunteer._id}>{volunteer.name}</label>
                </td>
                <td>
                  <p>{volunteer.email}</p>
                </td>
                <td>
                  <p>{volunteer.interest}</p>
                </td>
              </tr>
            )
          })
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
          />
        </div>
        <div className="formGroup">
          <label htmlFor="message">Message</label>
          <textarea 
            type="text" 
            id="message"
            onChange={(event) => updateFormData(event)}
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
