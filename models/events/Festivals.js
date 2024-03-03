// festivalModel.js

const { connectToEventDB } = require('@/connections/eventsDB');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Festival;

async function initializeFestivalModel() {
  const eventDB = await connectToEventDB();
  
  const festivalSchema = new Schema({
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
  });

  Festival = eventDB.model('Festival', festivalSchema);
  eventDB.once('open', () => {
    console.log('Connected to eventsDB for Festivals');
  });

  // Export Festival after it's initialized
  module.exports = Festival;
}

// Initialize the Festival model asynchronously
initializeFestivalModel().catch(error => {
  console.error('Error initializing Festival model:', error);
});
