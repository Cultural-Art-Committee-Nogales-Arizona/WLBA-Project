const mongoose = require("mongoose")
const Schema = mongoose.Schema
const userDB = require('@/connections/userDB')
require('dotenv').config()

let adminSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  userAuthId: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    unique: true,
    required: true
  },
},{
  collection: 'Admins',
  timestamps: true
})

const Admin = userDB.model('Admin', adminSchema)

userDB.once('open', () => {
  console.log('Connected to userDB for Admins')
})

module.exports = Admin