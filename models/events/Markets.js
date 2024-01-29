const mongoose = require("mongoose")
const Schema = mongoose.Schema
const eventsDB = require('@/connections/eventsDB')
require('dotenv').config()

// ! NEEDS UNIQUE DATA TO BE USEFUL

let marketSchema = new Schema({
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
  collection: 'Markets',
  timestamps: true
})

const Market = eventsDB.model('Market', marketSchema)

eventsDB.once('open', () => {
    console.log('Connected to eventsDB for Markets')
})

module.exports = Market