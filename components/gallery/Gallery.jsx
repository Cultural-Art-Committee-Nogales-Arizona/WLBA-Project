import React from 'react';
import imageExports from "@utils/ImportDirectorInformation";
import GalleryImage from './GalleryImage';
import styles from './Gallery.module.css'

export default function Gallery() {
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
