import styles from './Sidebar.module.css'
import PageLink from '@/components/PageLink'

export default function Sidebar() {
  return (
    <div className={styles.sidebarContainer}>
      <a href="/dashboard" className={styles.nav_link}>Dashboard</a>
      <h2>Events</h2>
      <a href="/dashboard/create-event" className={styles.nav_link}>Create Event</a>
      <a href="/dashboard/edit-event" className={styles.nav_link}>Edit Event</a>
      <hr />
      <h2>Vendors</h2>
      <a href="/dashboard/accept-vendors" className={styles.nav_link}>Incoming Vendors</a>
      <a href="/dashboard/manage-vendors" className={styles.nav_link}>Manage Accepted Vendors</a>
      <hr />
      <h2>Volunteers</h2>
      <a href="/dashboard/request-volunteers" className={styles.nav_link}>Request</a>
      <hr />
      <h2>Admins</h2> 
      <a href="/dashboard/admin/manage" className={styles.nav_link}>Manage Admins</a>
    </div>
  )
}