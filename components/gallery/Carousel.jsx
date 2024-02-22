"use client"
import { useState, useEffect } from 'react';
import styles from './Carousel.module.css';

import Image from 'next/image'

const Carousel = ({ params }) => {
  const { imagePreviews, images, setImages, edit } = params
  const [currentIndex, setCurrentIndex] = useState(0);

  const removeImage = (event, imageName) => {
    event.preventDefault()
    console.log(imageName)
    const filteredImages = imagePreviews.filter(image => image.file.name !== imageName)
    if (setImages) setImages(filteredImages)
  }

  const goToPrevSlide = (event) => {
    event.preventDefault()
    setCurrentIndex(() => currentIndex === 0 ? imagePreviews.length - 1 : currentIndex - 1);
  };

  const goToNextSlide = (event) => {
    event.preventDefault()
    setCurrentIndex(() => currentIndex === imagePreviews.length - 1 ? 0 : currentIndex + 1);
  };

  useEffect(() => {
    console.log(images[0])
  }, [images])

  return (
    <div className={styles.carousel}>
      <Image 
        className={styles.image}
        src={imagePreviews[currentIndex]} 
        alt={`Slide ${currentIndex}`} 
        width={700}  
        height={400}  
      />
      <div className={styles.buttons}>
        <button className={styles.button} onClick={event => goToPrevSlide(event)}>Previous</button>
        <span className={styles.button}>{currentIndex + 1}</span>
        <button className={styles.button} onClick={event => goToNextSlide(event)}>Next</button>
      </div>
      {
        edit && <button onClick={event => removeImage(event, /* images[currentIndex].file.name */)}>Remove Image</button>
      }
    </div>
  );
};

export default Carousel;
