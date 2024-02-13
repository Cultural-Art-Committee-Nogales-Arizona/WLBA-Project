'use client';

import { useState, useEffect } from 'react';
import VolunteerForm from '@components/forms/VolunteerForm';
import Link from 'next/link'

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
      If you're interested in volunteering for one of our cultural celebrations please contact us using the form below:
      <VolunteerForm params={{formData, setFormData, requestMethod}} />
    </>
  );
}