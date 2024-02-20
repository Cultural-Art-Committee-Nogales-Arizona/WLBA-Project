import React from 'react';
import Image from "next/image";
// import testImage from '@/public/Images/IMG_3888.jpg';
import styles from './GalleryImage.module.css'

export default function GalleryImage({ image }) {

  return (
    <div className={styles.imageContainer} data-testid="hero">
      <Image
        className={styles.image}
        width={530}
        height={530}
        src={image}
        alt={"image"}
      />
    </div>
  )
}
