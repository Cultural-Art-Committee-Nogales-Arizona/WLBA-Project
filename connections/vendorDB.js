//Repurpose as a registry database? For vendors, volunteers, and other

const mongoose = require('mongoose');
let vendorDB = null;

async function connectToVendorDB() {
  if (!vendorDB) {
    try {
      const { MONGO_URL_VENDORS } = process.env;
      vendorDB = await mongoose.createConnection(MONGO_URL_VENDORS, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Connected to vendorDB');
    } catch (error) {
      console.error('Error connecting to vendorDB:', error);
    }
  }
  return vendorDB;
}

async function closeVendorDBConnection() {
  if (eventDB) {
    await eventDB.close();
    console.log('Disconnected from eventDB');
  }
}

process.on('SIGINT', async () => {
  await closeVendorDBConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeVendorDBConnection();
  process.exit(0);
});

module.exports = { connectToVendorDB, mongoose };