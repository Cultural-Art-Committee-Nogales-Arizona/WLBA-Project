import mongoose from 'mongoose';
const Schema = mongoose.Schema
import vendorDB from '@/connections/vendorDB'
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
    type: Array,
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
  collection: 'Vendors',
  timestamps: true
})

const Vendor = vendorDB.model('Vendor', vendorSchema)

vendorDB.once('open', () => {
    console.log('Connected to vendorDB for Vendors')
})


export default Vendor