import { NextResponse } from "next/server";
import sha1 from 'sha1'
import dotenv from 'dotenv'
dotenv.config()

// I am SO sorry for making this.
// Lord, please forgive me.
export const POST = async (request) => {
  try {
    function PublicIdFromUrl(url) {
      // Split the URL by '/'
      const parts = url.split('/');
      // Get the index of "upload" in the URL
      const uploadIndex = parts.indexOf("upload");
      // Get the parts of the URL after "upload"
      const uploadParts = parts.slice(uploadIndex + 2);
      // Join the remaining parts to form the public ID
      let publicId = uploadParts.join('/');
      if (publicId.includes(".")) {
        publicId = publicId.split(".")[0];
      }
      return publicId;
    }

    // Signature parameters
    const API_KEY = process.env.API_KEY
    const API_SECRET = process.env.API_SECRET
    const currentTime = Date.now()
    const { imageUrl } = await request.json()
    const publicId = PublicIdFromUrl(imageUrl)
    
    const signatureString = `public_id=${publicId}&timestamp=${currentTime}${API_SECRET}`
    const hashedSignature = sha1(signatureString)
    console.log(hashedSignature)

    const queryParams = `?signature=${hashedSignature}&public_id=${publicId}&timestamp=${currentTime}&api_key=${API_KEY}`
    const imageUpload = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/image/destroy${queryParams}`, {
      method: 'POST',
    }); 
    
    
    const imageResponse = await imageUpload.json()
    console.log(imageResponse)

    if (imageResponse.result == "ok") {
      return NextResponse.json({
        success: true,
        message: `Deleted image from Cloudinary`,
        data: imageResponse
      });
    } else {
      throw new Error("Image failed to delete")
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: `Failed to delete image from Cloudinary: ${error.message}`,
      error: error
    }, {
      status: 500
    });
  }
};