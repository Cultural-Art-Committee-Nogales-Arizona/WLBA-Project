'use client';

import React from 'react';
import Gallery from '@/components/gallery/Gallery';
import styles from './page.module.css'

export default function GalleryPage() {
  // Create a function to import images dynamically
  /* function importAll(r) {
    return r.keys().map(r);
  } */

  // Dynamically import all images from the Images folder
  // const images = importAll(require.context('@/public/Images/', false, /\.(jpg|jpeg|png|gif)$/));

  // Render the images within the Gallery component
  return (
    <>
      <h1>This is the Gallery page</h1>
      <hr />
      <div className={styles.galleryContainer}>
        <Gallery /* images={images}  *//>
      </div>
    </>
  );
}
