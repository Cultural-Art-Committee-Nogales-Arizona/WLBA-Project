import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
dotenv.config()

/* ----------------------------- MongoDB Schemas ---------------------------- */

import User from '@/models/users/User'
import jwt from 'jsonwebtoken'

/* ------------------------ Generate recovery token ----------------------- */

function generateRecoveryToken() {
  const getRandomChar = () => {
    const characters = '0123456789ABCDEF'
    const randomIndex = Math.floor(Math.random() * characters.length)
    return characters[randomIndex]
  }

  let token = ''
  for(let i = 0; i < 8; i++){
    token += getRandomChar()
  }

  return token
}

/* ------------------------ Generate recovery token ----------------------- */

function generateExpiryDate() {
  let expiryDate = new Date()

  expiryDate.setDate(expiryDate.getDate() + 1)

  const dateString = expiryDate.toISOString()

  return dateString
}

/* ------------------- Will throw an error if not an admin ------------------ */

async function isAdmin(token) {
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
  const adminAuthId = decodedToken.adminAuthId
  const userId = decodedToken.adminUserId

  if (!adminAuthId) throw new Error("You must append authorization header")
	if (!userId) throw new Error("You must append user ID header")

  const user = await User.findOne({ _id: userId, admin: true })
  if (!user) throw new Error(`User not an admin and not allowed to preform API call`)

  const adminIdMatch = await bcrypt.compare(user.adminAuthId, adminAuthId)
  if (adminIdMatch) return true
  
  throw new Error(`User not an admin and not allowed to preform API call`)
}

/* ----------------- Generate userAuthID on account creation ---------------- */

function generateUserAuthID() {
  const getRandomChar = () => {
    const characters = '0123456789ABCDEF'
    const randomIndex = Math.floor(Math.random() * characters.length)
    return characters[randomIndex]
  }

  const generateBlock = () => {
    let block = ''
    for (let i = 0; i < 6; i++) {
      block += getRandomChar()
    }
    return block
  }

  return `${generateBlock()}-${generateBlock()}-${generateBlock()}-${generateBlock()}-${generateBlock()}-${generateBlock()}`
}

/* ----------------------- Hash strings with bcryptjs ----------------------- */

async function hash(input) {
  const salt = await bcrypt.genSalt(10)

  // Hash the input using the generated salt
  const hashedOutput = await bcrypt.hash(input, salt)

  return hashedOutput
}

/* ----------------------- Upload Image to Cloudinary ----------------------- */

async function uploadImages(request) {
  const formData = await request.formData()
    
  const imageUpload = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData,
  }); 

  if (!imageUpload.ok) {
    throw new Error(`Failed to upload images to Cloudinary: ${imageUpload.status} - ${imageUpload.statusText}`);
  }

  const imageResponse = await imageUpload.json();
  console.log(imageResponse);
  return imageResponse
}

/* --------------------- Delete an image from Cloudinary -------------------- */

async function deleteImages(imageArray) {
  try {
    const returnedData = []
    const promises = imageArray.map(async image => {
      const response = await fetch(`${process.env.BASE_URL}/api/image/delete`, {
        method: 'POST',
        body: JSON.stringify({ imageUrl: image })
      })

      returnedData.push(await response.json())
    })

    await Promise.all(promises)

    return {
      success: true,
      message: "Deleted all images on event from Cloudinary",
      data: returnedData
    }
  } catch (error) {
    console.error('Error occurred while deleting image:', error);
    throw new Error(error.message)
  }
}


/* -------------------------------------------------------------------------- */

export { generateUserAuthID, isAdmin, hash, generateRecoveryToken, generateExpiryDate, deleteImages, uploadImages }