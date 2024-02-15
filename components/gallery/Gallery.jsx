import React from 'react';
import imageExports from "@/utils/ImportGalleryImages";
import GalleryImage from './GalleryImage';
import styles from './Gallery.module.css'

export default function Gallery() {
  imageExports.map((image) => {
    console.log(image)
  })
  return (
    <div className={styles.galleryContainer}>
      {
        imageExports.map(image => {
          return <GalleryImage image={image.src}/>
        })
      }
    </div>
  )
}
