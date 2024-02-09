"use client"
import { useState, useEffect, useMemo } from 'react';

function VolunteerRequest() {
  const [volunteers, setVolunteers] = useState([]);
  const [formData, setFormData] = useState({ 
    subjectLine: "", 
    message: ""
  });

  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    const fetchVolunteers = async () => {
      try {
        const response = await fetch('/api/events/volunteer', { signal, method: 'GET' });
        const fetchedData = await response.json();
        setVolunteers(fetchedData.data);
        console.log(fetchedData);
      } catch (error) {
        console.error('Error fetching volunteers:', error);
      }
    };

    fetchVolunteers();

    return () => controller.abort()
  }, []);

  /* const handleCheckboxChange = (volunteerId) => {
    const updatedVolunteers = volunteers.includes(volunteerId)
      ? volunteers.filter(volunteer => volunteer._id !== volunteerId)
      : [volunteerId];

      setVolunteers((prev) => ({
        ...prev,
        updatedVolunteers 
      }))
  };
 */

  const handleCheckboxChange = (volunteer) => {
    setVolunteers((prev) => ({
      ...prev,
      volunteer
    }))
  }

  const VolunteerCheckbox = ({ volunteer }) => (
    <div>
      <input
        type="checkbox"
        id={volunteer._id}
        checked={volunteers.includes(volunteer._id)}
        onChange={() => handleCheckboxChange(volunteer)}
      />
      <label htmlFor={volunteer._id}>{volunteer.name}</label>
    </div>
  );

  const VolunteerList = () => (
    <div>
      {Array.isArray(volunteers) && volunteers.map(volunteer => (
      <VolunteerCheckbox
        key={volunteer}
        volunteer={volunteer}
      />
    ))}
    </div>
  );

  // Memoize the volunteer list to avoid recalculating it on every render
  const memoizedVolunteerList = useMemo(() => (
    <VolunteerList />
  ), [volunteers, formData]);
  useEffect(() => {
    console.log(volunteers)
  }, [volunteers])

  return (
    <div>
      <h2>Select Volunteers</h2>
      {memoizedVolunteerList}
    </div>
  );
}

export default VolunteerRequest;
