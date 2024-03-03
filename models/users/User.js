const { connectToUserDB } = require('@/connections/userDB');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = new Schema({
  username: { 
    type: String, 
    required: true
  },
  email: { 
    type: String,
    unique: true,
    required: true
  },
  admin: {
    type: Boolean,
    required: true,
    default: false
  },
  adminAuthId: {
    type: String,
    default: ""
  },
  adminPassword: {
    type: String,
    default: ""
  }
},{
  collection: 'Users',
  timestamps: true
});

let User;

async function initializeUserModel() {
  const userDB = await connectToUserDB();
  User = userDB.model('User', userSchema);
  userDB.once('open', () => {
    console.log('Connected to userDB for Users');
  });
}

initializeUserModel().catch(error => {
  console.error('Error initializing User model:', error);
});

module.exports = User;
