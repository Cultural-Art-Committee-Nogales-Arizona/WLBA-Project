const mongoose = require("mongoose");
const Schema = mongoose.Schema
const userDB = require('@/connections/userDB')
require('dotenv').config()


let userSchema = new Schema({
  username: { 
    type: String, 
    unique: true,
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
  adminAuthid: {
    type: String,
    default: `NULL`
  },
  adminPassword: {
    type: String,
    default: `NULL`
  }
},{
  collection: 'Users',
  timestamps: true
})

const User = userDB.model('User', userSchema)

userDB.once('open', () => {
  console.log('Connected to userDB for Users')
})

module.exports = User