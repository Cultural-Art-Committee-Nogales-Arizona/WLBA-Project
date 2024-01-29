const mongoose = require("mongoose")
const Schema = mongoose.Schema
const eventsDB = require('@/connections/eventsDB')
require('dotenv').config()

let festivalSchema = new Schema({
  name: {
    type: String,
    required: true,
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
  collection: 'Festivals',
  timestamps: true
})

const Festival = eventsDB.model('Festival', festivalSchema)

eventsDB.once('open', () => {
    console.log('Connected to eventsDB for Festivals')
})

module.exports = Festival