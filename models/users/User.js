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
},{
  collection: 'Users',
  timestamps: true
})

const User = userDB.model('User', userSchema)

userDB.once('open', () => {
    console.log('Connected to blogDB for post')
})


module.exports = User