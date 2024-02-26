'use client';

import { useState, useEffect } from 'react';
import VolunteerForm from '@/components/forms/VolunteerForm';
import styles from './page.module.css'

import heroImage from '@/public/Images/volunteerHero.JPG'
import Hero from '@/components/Hero'

// Overlays
import Loading from '@/components/overlays/Loading'

// Load custom font
import localFont from 'next/font/local'
const artesaniaFont = localFont({
  src: '../../public/fonts/ARTESANIA.ttf',
  display: 'swap',
})

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
      <Hero params={{ heroImage }} />
      <div className={`${styles.headText} ${artesaniaFont.className}`}>
        <div>
          <h1>Volunteer</h1>
        </div>
        <div className={styles.buttonContainer}>
          <a className={styles.callToAction} href="#volunteer">Sign up</a>
        </div>
      </div>
      <div className={styles.mainDiv}>
        <h4>
          If you're interested in volunteering for one of our cultural celebrations
          please contact us using the form below:
        </h4>
        <br  id="volunteer" />
        <VolunteerForm params={{ formData, setFormData, requestMethod }} />
      </div>
    </>
  );
}