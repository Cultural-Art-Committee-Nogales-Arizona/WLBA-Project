//Repurpose as a registry database? For vendors, volunteers, and other

const mongoose = require('mongoose')
const { MONGO_URL_VENDORS } = process.env

const vendorDB = mongoose.createConnection(MONGO_URL_VENDORS);

module.exports = vendorDB
