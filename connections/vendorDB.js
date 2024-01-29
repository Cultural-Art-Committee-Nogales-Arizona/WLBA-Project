const mongoose = require('mongoose')
const { MONGO_URL_VENDORS } = process.env

const dataDB = mongoose.createConnection(MONGO_URL_VENDORS);

module.exports = dataDB
