import { NextResponse } from "next/server";

// I am SO sorry for making this.
// Lord, please forgive me.
export const POST = async (request) => {
  try {
    const getAllFormDataValues = (formData, key) => {
      const values = [];
      for (const [formDataKey, formDataValue] of formData.entries()) {
        if (formDataKey === key) {
          values.push(formDataValue);
        }
      }
      return values;
    };
  
    const formData = await request.formData()

    const files = getAllFormDataValues(formData, 'file');
    
    // Array to hold FormData objects for each file
    const formDataArray = [];

    // Loop through each file
    Array.from(files).forEach(file => {
      // Create a new FormData object
      const formData = new FormData();
      
      // Append the file to the FormData object with the key 'file'
      formData.append('file', file);
      
      // Append any additional data as needed
      formData.append('upload_preset', 'Event_Images');
      
      // Add the FormData object to the array
      formDataArray.push(formData);
    });

    
    async function getImageUrls(formDataArray) {
      const imageFiles = [];
      
      // Map over the formDataArray and create an array of promises for each fetch operation
      const promises = formDataArray.map(async formData => {
        try {
          const imageUpload = await fetch(`https://api.cloudinary.com/v1_1/dvlb9ylqb/image/destroy`, {
            method: 'POST',
            // body: formData,
            body: "",
            /* headers: {
              'Content-Type': 'multipart/form-data' // Set Content-Type header
            } */
          }); 
            
          const imageResponse = await imageUpload.json();
          imageFiles.push(imageResponse.secure_url);
        } catch (error) {
          throw new Error('Image failed to upload');
        }
      });
      
      // Wait for all promises to resolve
      await Promise.all(promises);
      
      return imageFiles;
    }
      
    const imageUrls = await getImageUrls(formDataArray);

    return NextResponse.json({
      success: true,
      message: `Uploaded images to Cloudinary`,
      data: imageUrls
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: `Failed to upload images to Cloudinary: ${error.message}`,
      error: error.message
    }, {
      status: 500
    });
  }
};