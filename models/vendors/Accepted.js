//Similar to the admins collection, this will hold the ID's of all vendors who are approved by an admin. 

import mongoose from 'mongoose';
const Schema = mongoose.Schema
import vendorDB from '@/connections/vendorDB'
require('dotenv').config()

let acceptedVendorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{
    collection: 'AcceptedVendors',
    timestamps: true
})

const AcceptedVendor = vendorDB.model('AcceptedVendor', acceptedVendorSchema)

vendorDB.once('open', () => {
    console.log('Connected to vendorDB for acceptedVendors')
})

export default AcceptedVendor