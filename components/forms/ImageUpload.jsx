"use client"
import { useState, useEffect } from 'react';
import cloudinaryConfig from '@/connections/cloudinary.js';
import Image from 'next/image';

export default function ImageUpload({ params }) {
    const { images, setImages } = params

    const handleFileChange = async (e) => {
        const files = e.target.files;
        const formDataArray = Array.from(files).map((file) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'EventImage');
            return formData;
        });

        const uploadedImages = await Promise.all(formDataArray.map(async (formData) => {
            const response = await fetch(
                // `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
                `https://api.cloudinary.com/v1_1/dhh4hjypo/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );
            const data = await response.json();
            return data.secure_url;
        }));

        setImages([...images, ...uploadedImages]);
    };

    useEffect(() => {
        console.log(images);
    }, [images]);

    return (
        <input type="file" onChange={handleFileChange} multiple></input>
    );
}
