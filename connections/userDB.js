// userDB.js

const mongoose = require('mongoose');
let userDB = null;

async function connectToUserDB() {
  if (!userDB) {
    try {
      const { MONGO_URL_USERS } = process.env;
      userDB = await mongoose.createConnection(MONGO_URL_USERS);
      console.log('Connected to userDB');
    } catch (error) {
      console.error('Error connecting to userDB:', error);
    }
  }
  return userDB;
}

async function closeUserDBConnection() {
  if (userDB) {
    await userDB.close();
    console.log('Disconnected from userDB');
  }
}

process.on('SIGINT', async () => {
  await closeUserDBConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeUserDBConnection();
  process.exit(0);
});

module.exports = { connectToUserDB, mongoose };
