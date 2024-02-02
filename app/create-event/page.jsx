"use client"

import styles from './page.module.css'

import CreateEventForm from '@components/CreateEventForm'

export default function CreateEventPage() {


  return (
    <div className={styles.container}>
      <CreateEventForm />
    </div>
  )
}
