const mongoose = require('mongoose')
const { MONGO_URL_USERS } = process.env

const userDB = mongoose.createConnection(MONGO_URL_USERS);

module.exports = userDB
