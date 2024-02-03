// ErrorPopUp.js

import React from 'react';
import styles from './ErrorPopUp.module.css';

export default function ErrorPopUp({ errorMessage, onClose }) {
  return (
    <div className={styles.errorContainer}>
      <p>Error: {errorMessage}</p>
      <button className={styles.closeButton} onClick={onClose}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};