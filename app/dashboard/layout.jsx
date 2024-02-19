"use client"
import styles from './DashboardLayout.css'
import Sidebar from '@/components/Sidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      {children}
    </div>
  );
};

export default DashboardLayout;
