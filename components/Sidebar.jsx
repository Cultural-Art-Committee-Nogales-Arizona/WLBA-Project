import styles from './Sidebar.module.css'
import PageLink from '@/components/PageLink'

export default function Sidebar() {
  return (
    <div className={styles.sidebarContainer}>
      <PageLink href="/dashboard/create-event" className="nav-link" testId="navbar-home">
        <span>Create Event Form</span>
      </PageLink>
      <PageLink href="/dashboard/edit-event" className="nav-link" testId="navbar-home">
        <span>Edit Event Form</span>
      </PageLink>
      <PageLink href="/dashboard/request-volunteers" className="nav-link" testId="navbar-home">
        <span>Request Volunteers Form</span>
      </PageLink>
      <PageLink href="/dashboard/accept-vendors" className="nav-link" testId="navbar-home">
        <span>Accept Vendors Form</span>
      </PageLink>
      <PageLink href="/dashboard/admin/manage" className="nav-link" testId="navbar-home">
        <span>Manage Administrators</span>
      </PageLink>
    </div>
  )
}