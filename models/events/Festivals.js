const mongoose = require("mongoose")
const Schema = mongoose.Schema
const eventsDB = require('@/connections/eventsDB')
require('dotenv').config()

let festivalSchema = new Schema({
  title: {
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
  date: { 
    type: String, 
    required: true
  },
  banner: {
    type: String,
    required: true,
  }
},{
  collection: 'Festivals',
  timestamps: true
})

const Festival = eventsDB.model('Festival', festivalSchema)

eventsDB.once('open', () => {
    console.log('Connected to eventsDB for Festivals')
})

module.exports = Festival