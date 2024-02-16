const mongoose = require("mongoose");
const Schema = mongoose.Schema
const userDB = require('@/connections/userDB')
require('dotenv').config()

let recoverySchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true 
    },
    token: {
        type: String,
        required: true
    },
    expires: {
        type: Date,
        required: true
    }
},{
    collection: 'Tokens',
    timestamps: true
})

const Token = userDB.model('Token', recoverySchema)

userDB.once('open', () => {
    console.log('Connected to userDB for recovery')
})

module.exports = Token