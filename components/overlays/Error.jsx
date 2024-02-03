"use client"

import { useEffect, useState } from 'react'
// import styles from './Error.module.css';
import ErrorPopUp from './ErrorPopUp'

export default function Error({ params }) {
  const { error, setError } = params 
  const handleErrorClose = () => {
    setError(null);
  };

  return (
    <>
      <ErrorPopUp errorMessage={error} onClose={handleErrorClose}/>
    </>
  );
};