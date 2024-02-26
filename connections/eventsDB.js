const mongoose = require('mongoose');
let eventDB = null;

async function connectToEventDB() {
  if (!eventDB) {
    try {
      const { MONGO_URL_EVENTS } = process.env;
      eventDB = await mongoose.createConnection(MONGO_URL_EVENTS, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to eventDB');
    } catch (error) {
      console.error('Error connecting to eventDB:', error);
    }
  }
  return eventDB;
}

async function closeEventDBConnection() {
  if (eventDB) {
    await eventDB.close();
    console.log('Disconnected from eventDB');
  }
}

process.on('SIGINT', async () => {
  await closeEventDBConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeEventDBConnection();
  process.exit(0);
});

module.exports = { connectToEventDB, mongoose };