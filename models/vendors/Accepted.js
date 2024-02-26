//Similar to the admins collection, this will hold the ID's of all vendors who are approved by an admin. 
const { mongoose, vendorDB } = require('@/connections/vendorDB')
const Schema = mongoose.Schema
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

module.exports = AcceptedVendor