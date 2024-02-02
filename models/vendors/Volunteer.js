const mongoose = require("mongoose");
const Schema = mongoose.Schema
const vendorDB = require('@/connections/vendorDB')
require('dotenv').config()

let volunteerSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    event: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Volunteerable-Events',
        required: true,
    }
},{
    collection: 'Volunteers',
    timestamps: true,
})

const Volunteer = vendorDB.model('volunteer', volunteerSchema)

vendorDB.once('open', () => {
    console.log('Connected to vendorDB for Volunteers')
})

module.exports = Volunteer