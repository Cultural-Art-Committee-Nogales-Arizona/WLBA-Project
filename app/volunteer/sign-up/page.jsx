'use client';

import { useState, useEffect } from 'react';
import VolunteerForm from '@components/forms/VolunteerForm';

import Loading from '@/components/overlays/Loading'

export default function VolunteerSignUp() {
  const requestMethod = 'POST'
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    interest: ""
  })

  return (
    <>
      Sign up as a Volunteer
      <VolunteerForm params={{formData, setFormData, requestMethod}} />
    </>
  );
}