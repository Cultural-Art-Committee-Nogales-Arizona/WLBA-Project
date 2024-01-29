const mongoose = require("mongoose")
const Schema = mongoose.Schema
const eventsDB = require('@/connections/eventsDB')
require('dotenv').config()

// ! NEEDS UNIQUE DATA TO BE USEFUL

let meetupSchema = new Schema({
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
  collection: 'Meetups',
  timestamps: true
})

const Meetup = eventsDB.model('Meetup', meetupSchema)

eventsDB.once('open', () => {
    console.log('Connected to eventsDB for Meetups')
})

module.exports = Meetup