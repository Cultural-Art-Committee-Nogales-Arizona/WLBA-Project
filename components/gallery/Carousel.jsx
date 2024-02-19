"use client"
import { useState, useEffect } from 'react';
import styles from './Carousel.module.css';

import Image from 'next/image'

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevSlide = (event) => {
    event.preventDefault()
    setCurrentIndex(() => currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNextSlide = (event) => {
    event.preventDefault()
    setCurrentIndex(() => currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <div className={styles.carousel}>
      <Image 
        className={styles.image}
        src={images[currentIndex]} 
        alt={`Slide ${currentIndex}`} 
        width={700}  
        height={400}  
      />
      <div className={styles.buttons}>
        <button className={styles.button} onClick={event => goToPrevSlide(event)}>Previous</button>
        <span className={styles.button}>{currentIndex + 1}</span>
        <button className={styles.button} onClick={event => goToNextSlide(event)}>Next</button>
      </div>
    </div>
  );
};

export default Carousel;
