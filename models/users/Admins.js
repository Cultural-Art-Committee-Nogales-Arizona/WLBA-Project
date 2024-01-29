const mongoose = require("mongoose")
const Schema = mongoose.Schema
const userDB = require('@/connections/blogDB')
require('dotenv').config()

let adminSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.objectId,
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
  console.log('Connected to blogDB for comments')
})

module.exports = Admin