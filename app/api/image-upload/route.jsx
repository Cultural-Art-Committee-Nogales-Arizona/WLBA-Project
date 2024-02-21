import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    const formData = await request.formData()
    console.log(formData)
    // return
    const imageUpload = await fetch(`https://api.cloudinary.com/v1_1/dvlb9ylqb/image/upload`, {
        method: 'POST',
        /* headers: {
          'Content-Type': 'multipart/form-data' // Set Content-Type header
        }, */
        body: formData,
    }); 

    if (!imageUpload.ok) {
      throw new Error(`Failed to upload images to Cloudinary: ${imageUpload.status} - ${imageUpload.statusText}`);
    }

    const imageResponse = await imageUpload.json();
    console.log(imageResponse);
    const imageUrls = imageResponse.map(image => image.secureUrl)

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