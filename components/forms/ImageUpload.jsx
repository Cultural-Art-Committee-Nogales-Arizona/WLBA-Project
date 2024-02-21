"use client"
import { useState } from 'react';
// import pLimit from 'p-limit'

export default function ImageUpload({ params }) {
  const { images, setImages } = params;

  const handleFileChange = async (e) => {
    const files = e.target.files;
  
    const previews = await Promise.all(Array.from(files).map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    }));
  
    // Update the images state with both preview and file for each selected file
    setImages(prevImages => [
      ...prevImages,
      ...Array.from(files).map((file, index) => ({
        preview: previews[index],
        file: file
      }))
    ]);
    console.log(images)
  };

  return (
    <input type="file" onChange={handleFileChange} multiple />
  );
}