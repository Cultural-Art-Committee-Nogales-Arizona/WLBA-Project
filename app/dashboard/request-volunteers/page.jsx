"use client"
import { useState, useEffect, useContext, useMemo } from 'react';
import CustomUserContext from '@components/GlobalUserContext';
import Loading from '@/components/overlays/Loading'
import Error from '@/components/overlays/Error'
import Success from "@components/overlays/Success"
import styles from './page.module.css'

function VolunteerRequest() {
  const { globalUserData, setGlobalUserData }  = useContext(CustomUserContext)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [allVolunteers, setAllVolunteers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [success, setSuccess] = useState(null)

  const [formData, setFormData] = useState({ 
    subjectLine: "", 
    message: "",
    volunteers: []
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
        setAllVolunteers(fetchedData.data || [])
        setSearchResults(fetchedData.data || [])
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

  const handleCheckboxChange = (volunteerId, volunteerEmail) => {
    setFormData((prevFormData) => {
      // Check if the volunteerEmail is already in the array
      const isVolunteerSelected = prevFormData.volunteers.find(formVolunteer => formVolunteer.id == volunteerId);
  
      // If the volunteerEmail is already selected, remove it from the array
      if (isVolunteerSelected) {
        return {
          ...prevFormData,
          volunteers: prevFormData.volunteers.filter((formVolunteer) => formVolunteer.id !== volunteerId)
        };
      } else {
        // If the volunteerEmail is not selected, add it to the array
        return {
          ...prevFormData,
          vendors: [...prevFormData.vendors, {
            email: volunteerEmail,
            id: volunteerId
          }]
        };
      }
    });
  }  

  const toggleAll = (event) => {
    event.preventDefault()
    // Check if all emails are already selected
    const allSelected = searchResults.every(result => formData.volunteers.some(formVolunteer => formVolunteer.id == result._id));
  
    if (allSelected) {
      // If all emails are selected, deselect all
      setFormData(prev => ({
        ...prev,
        volunteers: []
      }));
    } else {
      // If not all emails are selected, select all
      const allEmails = searchResults.map(result => ({
        id: result._id,
        email: result.email
      }));
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

    if (formData.volunteers.length === 0) {
      setError('You must select at least one recipient')
      return
    }

    // We probably wont use this
    /* const confirmEmail = prompt(`
      Confirm information\n
      Subject: ${formData.subjectLine}\n
      Message: ${formData.message}\n
      Recipients: ${[...formData.emails]}\n\n
      Type "Yes" to confirm
      `)
      
    if (confirmEmail !== "Yes") {
      alert("Canceled form submission") 
      return
    }  */

    setLoading(true)
    try {
      const controller = new AbortController()
      const signal = controller.signal

      const returnedData = await fetch(`/api/contact/volunteers`, { 
        signal, 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "same-origin",
        body: JSON.stringify(formData) 
      })

      const result = await returnedData.json()

      if(result.success){
        setSuccess('Successfully contacted all volunteers')
      } else {
        setError(result.errorMessage)
      }
      console.log(result)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error(error)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    const controller = new AbortController()
    const signal = controller.signal

    try{
        if (formData.vendors.length == 0) return setError('You MUST Select at least one vendor to delete')
        const vendors = formData.vendors.map(formVendor => formVendor.id)
        
        const response = await fetch('/api/vendor', {
            signal,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "same-origin",
            body: JSON.stringify({
                vendors
            })
        })

        const responseData = await response.json()

        if (responseData.success) {
            // router.push('/vendor')
            setSuccess(responseData.message)
        } else {
            setError(`Failed to delete vendors ${responseData.errorMessage}`)
        }
    } catch (err) {
        setError(`Error deleting vendors`)
    } finally {
        setLoading(false)
    }
  }

  return (
    <>
    <div className={styles.container}>
      <h1>Request Volunteers for events</h1>
      {success && <Success params={{success, setSuccess}} />}
      {error ? <Error params={{error, setError}} /> : null}
      { loading ? <Loading /> : 
        <form className={styles.root} action="" onSubmit={handleSubmit}>
          <div className={styles.titleBox}>
            <div className={styles.title}>Search</div>
            <input
              id="search"
              type="text"
              onChange={(event) => searchVolunteers(event.target.value)}
              className={styles.backgroundInput}
            />
          </div>
          <div className={styles.titleBox}>
            <div className={styles.title}>Selected: {formData.emails?.length || 0}</div>
            <div className={styles.title}>Results: {searchResults.length}</div>
          </div>
          <div className={styles.table_container}>
            <table className={styles.email_table}>
              <thead>
                <tr>
                  <th className={styles.toggle}><button onClick={event => toggleAll(event)}>Toggle All</button></th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Interest</th>
                </tr>
              </thead>
              <tbody className={styles.table_body}>
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
                :
                <tr>
                  <td>No matches</td>
                </tr>
              }
              </tbody>
            </table>
          </div>          
          
          <div className={styles.titleBox}>
            <label htmlFor="subjectLine">Subject Line</label>
            <input 
              type="text" 
              id="subjectLine" 
              onChange={(event) => updateFormData(event)}
            />
          </div>
          <div className={styles.titleBox}>
            <div className={styles.title}>Message</div>
            <textarea 
              className={`${styles.backgroundInput} ${styles.textArea}`}  
              type="text" 
              id="message"
              onChange={(event) => updateFormData(event)}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      }
    </div>
    </>
  );
}

export default VolunteerRequest;
