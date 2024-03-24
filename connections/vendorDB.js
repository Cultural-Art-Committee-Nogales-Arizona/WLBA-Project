//Repurpose as a registry database? For vendors, volunteers, and other

import mongoose from 'mongoose'
const { MONGO_URL_VENDORS } = process.env

const vendorDB = mongoose.createConnection(MONGO_URL_VENDORS);

export default vendorDB
