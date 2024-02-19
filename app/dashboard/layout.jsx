"use client"
import styles from './layout.module.css'
import Sidebar from '@/components/Sidebar';

const layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.children}>
        {children}
      </div>
    </div>
  );
};

export default layout;
