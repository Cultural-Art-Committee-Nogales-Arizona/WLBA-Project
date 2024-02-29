"use client"
import { useState, useEffect } from 'react';
import styles from './Carousel.module.css';

import Image from 'next/image'

const Carousel = ({ params }) => {
  let { imagePreviews, images, setImages, edit } = params
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images) {
    images = imagePreviews.map(image => ({
      preview: image,
      file: "Uploaded"
    }))
  }
  
  const removeImage = (event, imageName) => {
    event.preventDefault()
    const filteredImages = images.filter(image => image.preview !== imageName)
    if (setImages) setImages(filteredImages)
    setCurrentIndex(prev => {
      if (prev === 0) {
        return prev
      }
      return prev - 1
    })
  }

  const goToPrevSlide = (event) => {
    event.preventDefault()
    setCurrentIndex(() => currentIndex <= 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNextSlide = (event) => {
    event.preventDefault()
    setCurrentIndex(() => currentIndex >= images.length - 1 ? 0 : currentIndex + 1);
  };

  return (
    <div className={styles.carousel}>
      { images[currentIndex] && 
        <Image 
        className={styles.image}
        src={images[currentIndex].preview || "/images/image_not_found.png"} 
        alt={`Slide ${currentIndex}`} 
        width={700}  
        height={400}  
        />
      }
      <div className={styles.buttons}>
        <button className={styles.button} onClick={event => goToPrevSlide(event)}>Previous</button>
        <span className={styles.button}>{currentIndex + 1}</span>
        <button className={styles.button} onClick={event => goToNextSlide(event)}>Next</button>
      </div>
      {
        edit && <button onClick={event => removeImage(event, images[currentIndex].preview)}>Remove Image</button>
      }
    </div>
  );
};

export default Carousel;
