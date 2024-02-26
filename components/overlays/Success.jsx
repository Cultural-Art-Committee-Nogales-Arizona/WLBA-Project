"use client"

import styles from './Success.module.css';
import { useRouter } from 'next/navigation';

export default function Success({ params }) {
  const router = useRouter()

  const { success, setSuccess, redirect, reload } = params 
  const handleSuccessClose = () => {
    setSuccess(null);
    if (redirect) router.push(redirect)
    if (reload) router.refresh()
    
  }; 

  return (
    <>
      <div className={styles.successContainer}>
        <p>Success: {success}</p>
        <button className={styles.closeButton} onClick={handleSuccessClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </>
  );
};