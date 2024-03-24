import mongoose from 'mongoose';
const Schema = mongoose.Schema
import userDB from '@/connections/userDB'
require('dotenv').config()


let userSchema = new Schema({
  username: { 
    type: String, 
    required: true
  },
  email: { 
    type: String,
    unique: true,
    required: true
  },
  admin: {
    type: Boolean,
    required: true,
    default: false
  },
  adminAuthId: {
    type: String,
    default: ""
  },
  adminPassword: {
    type: String,
    default: ""
  }
},{
  collection: 'Users',
  timestamps: true
})

const User = userDB.model('User', userSchema)

userDB.once('open', () => {
  console.log('Connected to userDB for Users')
})

export default User