/* -------------------------------------------------------------------------- */
/*     All of the commented out function are for if we decide to use them     */
/* -------------------------------------------------------------------------- */

import bcrypt from 'bcryptjs'

/* ----------------------------- MongoDB Schemas ---------------------------- */

// import Festival from '../models/events/Festivals'
// import User from '@/models/users/User'
import User from '@/models/users/User'

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

/* ------------------- Will throw an error if not an admin ------------------ */

async function isAdmin(adminAuthId) {
  const user = await User.findOne({ adminAuthId: adminAuthId })
  if (!user) throw new Error(`User not an admin and not allowed to preform API call`)
  return true
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

/* -------------------- Hash password on account creation ------------------- */

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10)

  // Hash the password using the generated salt
  const hashedPassword = await bcrypt.hash(password, salt)

  return hashedPassword
}

/* -------------------------------------------------------------------------- */

// countVotes, 
// isDuplicate, 
// getUserWithID, 
export { generateUserAuthID, isAdmin, hashPassword }