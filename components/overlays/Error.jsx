"use client"

import styles from './Error.module.css';

export default function Error({ params }) {
  const { error, setError } = params 
  const handleErrorClose = () => {
    setError(null);
  };

  return (
    <>
      <div className={styles.errorContainer}>
        <p>Error: {error}</p>
        <button className={styles.closeButton} onClick={handleErrorClose}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </>
  );
};