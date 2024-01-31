//Possibly rename collection to volunteer events or something else to differentiate from volunteers' records.

const mongoose = require("mongoose")
const Schema = mongoose.Schema
const eventsDB = require('@/connections/eventsDB')
require('dotenv').config()

// ! NEEDS UNIQUE DATA TO BE USEFUL

let volunteerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  organizer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Vendor',
    required: true,
  }, 
  date: { 
    type: Date, 
    required: true
  },
},{
  collection: 'Volunteers',
  timestamps: true
})

const Volunteer = eventsDB.model('Volunteer', volunteerSchema)

eventsDB.once('open', () => {
    console.log('Connected to eventsDB for Meetups')
})

module.exports = Volunteer