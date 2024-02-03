const mongoose = require("mongoose")
const Schema = mongoose.Schema
const eventsDB = require('@/connections/eventsDB')
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

const Volunteer = eventsDB.model('Volunteer', volunteerSchema)

eventsDB.once('open', () => {
    console.log('Connected to eventsDB for Volunteers')
})

module.exports = Volunteer