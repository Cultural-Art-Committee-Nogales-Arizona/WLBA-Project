'use client';

import { useState, useEffect } from 'react';
import VolunteerForm from '@components/forms/VolunteerForm';

import { globalUserData, setCustomUserData } from '@/components/GlobalUserContext'

import Loading from '@/components/overlays/Loading'

export default function VolunteerUpdate({ params }) {
  const { name, id } = params
  const requestMethod = 'PUT'
  // console.log(globalUserData)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    interest: ""
  })

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    async function fetchUser() {
      try {
        const fetchedData = await fetch('api/events/volunteer'/* add query for specific user */, { signal, method: "GET" })
          .then(res => res.json());
        setFormData(fetchedData.data);
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error('Error fetching data:', error);
        }
      }
    }

    fetchUser();

    return () => controller.abort()
  }, []);



  return (
    <>
      Update a Volunteer
      <VolunteerForm params={{formData, setFormData, requestMethod}} />
    </>
  );
}