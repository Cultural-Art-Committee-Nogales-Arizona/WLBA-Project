"use client"
import styles from './layout.module.css'
import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute'

const layout = ({ children }) => {
  return (
    <ProtectedRoute>
      <div className={styles.layout}>
        <Sidebar />
        <div className={styles.children}>
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default layout;
