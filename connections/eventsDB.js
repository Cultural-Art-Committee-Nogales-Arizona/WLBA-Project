import mongoose from 'mongoose'
const { MONGO_URL_EVENTS } = process.env

const eventDB = mongoose.createConnection(MONGO_URL_EVENTS);

export default eventDB