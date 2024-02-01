const mongoose = require("mongoose");
const Schema = mongoose.Schema
const vendorDB = require('@/connections/vendorDB')
require('dotenv').config()

let vendorSchema = new Schema({
  name: { 
    type: String,
    unique: true,
    required: true
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: String,
    required: true,
  },
  email: { 
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true 
  },
},{
  collection: 'Users',
  timestamps: true
})

const Vendor = vendorDB.model('User', vendorSchema)

vendorDB.once('open', () => {
    console.log('Connected to blogDB for post')
})


module.exports = Vendor