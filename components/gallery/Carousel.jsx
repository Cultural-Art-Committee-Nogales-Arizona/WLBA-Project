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
    console.log(imageName)
    const filteredImages = images.filter(image => image.preview !== imageName)
    if (setImages) setImages(filteredImages)
    setCurrentIndex(prev => prev - 1)
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
        src={images[currentIndex].preview || "https://res.cloudinary.com/dvlb9ylqb/image/upload/v1708461361/cld-sample-5.jpg"} 
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
