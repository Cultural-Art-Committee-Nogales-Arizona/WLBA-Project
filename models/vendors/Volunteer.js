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
        unique: true,
        required: true,
    },
    email: {
        type: String,
    },
    event: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Volunteer',
        required: true,
    }
},{
    collection: 'Volunteers',
    timestamps: true,
})

const Volunteer = vendorDB.model('volunteer', volunteerSchema)

userDB.once('open', () => {
    console.log('Connected to registryDB for post')
})

module.exports = Volunteer