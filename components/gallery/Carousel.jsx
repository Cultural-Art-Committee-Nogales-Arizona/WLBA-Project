"use client"
import { useState, useEffect } from 'react';
import styles from './Carousel.module.css';

import Image from 'next/image'

const Carousel = ({ images: initialImages }) => {
  const [images, setImages] = useState(initialImages || []);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setImages(initialImages || []);
  }, [initialImages]);

  const goToPrevSlide = (event) => {
    event.preventDefault()
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNextSlide = (event) => {
    event.preventDefault()
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
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
      <div>
        <button onClick={event => goToPrevSlide(event)}>Previous</button>
        <button onClick={event => goToNextSlide(event)}>Next</button>
      </div>
    </div>
  );
};

export default Carousel;
