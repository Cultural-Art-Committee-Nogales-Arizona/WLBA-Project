import mongoose from 'mongoose'
const { MONGO_URL_USERS } = process.env

const userDB = mongoose.createConnection(MONGO_URL_USERS);

export default userDB
