const mongoose = require('mongoose')
const { MONGO_URL_EVENTS } = process.env

const eventDB = mongoose.createConnection(MONGO_URL_EVENTS);

module.exports = eventDB