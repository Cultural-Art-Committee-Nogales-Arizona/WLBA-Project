const { mongoose, eventsDB } = require('@/connections/eventsDB')
const Schema = mongoose.Schema
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
  start: { 
    type: Date, 
    required: true
  },
  end: { 
    type: Date, 
    required: true
  },
  images: {
    type: Array,
    required: false
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