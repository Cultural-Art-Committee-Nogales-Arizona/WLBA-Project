const { connectToEventDB } = require('./connections/eventsDB.js');
const { connectToUserDB } = require('./connections/userDB');
const { connectToVendorDB } = require('./connections/vendorDB');

module.exports = {
  poweredByHeader: false,
  images: {
    domains: ['res.cloudinary.com'],
  },
  onDemandEntries: {
    async serverMiddleware() {
      // Run initialization logic here
      try {
        await connectToEventDB();
        console.log('MongoDB connected');

        await connectToUserDB();
        console.log('MongoDB connected');

        await connectToVendorDB();
        console.log('MongoDB connected');

        // You can perform other initialization tasks here
      } catch (error) {
        console.error('Error connecting to MongoDB:', error);
      }
    },
  },
  experimental: {
    serverActions: true,
  }
};