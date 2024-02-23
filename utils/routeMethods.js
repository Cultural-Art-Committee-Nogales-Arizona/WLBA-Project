/* -------------------------------------------------------------------------- */
/*     All of the commented out function are for if we decide to use them     */
/* -------------------------------------------------------------------------- */

import bcrypt from 'bcryptjs'
import cloudinaryConfig  from '@/connections/cloudinary'
import dotenv from 'dotenv'

dotenv.config()

/* ----------------------------- MongoDB Schemas ---------------------------- */

// import Festival from '../models/events/Festivals'
// import User from '@/models/users/User'
import User from '@/models/users/User'
import jwt from 'jsonwebtoken'

/* ------------------------------- Count votes ------------------------------ */

/* function countVotes(data) {
  let trueVotes = 0
  let falseVotes = 0

  for (const item of data) {
    if (item.vote === true) {
      trueVotes++
    } else if (item.vote === false) {
      falseVotes++
    }
  }

  return trueVotes - falseVotes
} */

/* ------------------------ check for duplicate vote ------------------------ */

/* async function isDuplicate(req, res, id, author) {
  try {
    let updatedDoc
    let { vote } = req.body

    let newVote = { author, vote }

    const existingVoteInPost = await Post.findOne({ _id: id, "votes.author": author })

    const existingVoteInComment = await Comment.findOne({ _id: id, "votes.author": author })

    if (existingVoteInPost) {      
      updatedDoc = await Post.findOneAndUpdate(
        { _id: id, "votes.author": author },
        { $set: { 'votes.$': newVote } },
        { new: true }
      )

      updatedDoc.voteCount = countVotes(updatedDoc.votes)
      await updatedDoc.save()
      
    } else if (existingVoteInComment) {
      updatedDoc = await Comment.findOneAndUpdate(
        { _id: id, "votes.author": author },
        { $set: { 'votes.$': newVote } },
        { new: true }
      )
      updatedDoc.voteCount = countVotes(updatedDoc.votes)
      await updatedDoc.save()
    }

    const existingVote = existingVoteInPost || existingVoteInComment

    if (existingVote) {
      res.status(200).json({
        success: true,
        message: `Vote successfully updated`,
        voteCount: updatedDoc.voteCount
      })
      return true
    }

    return false
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'An error occurred in function isDuplicate',
      errorMessage: err.message,
      error: err
    })
  }
} */

/* ---------------------- Get a users auth with authID ---------------------- */

/* async function getUserWithID(userID) {
  const user = await User.findOne({ userAuthID: userID })
  if (!user) throw new Error(`User with userAuthID: ${userID} has not been found`)
  return user
} */

/* ------------------------ Get a users _id with name ----------------------- */

/* async function getIdWithName(name) {
  const user = await User.findOne({ username: name })
  if (!user) throw new Error(`User with username: ${name} not found`)
  return user._id
} */

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

/* --------------------- Delete an image from Cloudinary -------------------- */

async function deleteImage(imageURL) {
  try {

      const parts = imageURL.split('/');
      // Find the last part of the URL, which contains the filename
      const filename = parts[parts.length - 1];
      // Split the filename by ".", and get the part before ".jpg"
      const publicId = filename.split('.')[0];

      // const encryptKeys = btoa(`${cloudinaryConfig.cloud.api_key}:${cloudinaryConfig.cloud.api_secret}`);
      const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloud.cloud_name}/resources/image/destroy`,
          {
              method: 'POST',
              headers: {
                  'Authorization': `Basic ${cloudinaryConfig.cloud.api_key}:${cloudinaryConfig.cloud.api_secret}`,
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ public_ids: [publicId] })
          }
      );

      if (response.ok) {
          const data = await response.json();
          console.log('Image deleted successfully:', data);
          return data;
      } else {
          console.error('Failed to delete image');
          throw new Error('Failed to delete image');
      }
  } catch (error) {
      console.error('Error occurred while deleting image:', error);
      throw error;
  }
}


/* -------------------------------------------------------------------------- */

// countVotes, 
// isDuplicate, 
// getUserWithID, 
export { generateUserAuthID, isAdmin, hash, generateRecoveryToken, generateExpiryDate, deleteImage }