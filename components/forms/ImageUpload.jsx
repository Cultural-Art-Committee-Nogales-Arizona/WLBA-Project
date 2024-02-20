"use client"
import { useState, useEffect } from 'react';
import cloudinaryConfig from '@/connections/cloudinary.js';

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
                // I don't know why cloudinaryConfig can't access env variables?
                // `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloud.cloud_name}/image/upload`,
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

    return (
        <input type="file" onChange={handleFileChange} multiple></input>
    );
}
