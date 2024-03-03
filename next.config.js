const { connectToEventDB } = require('./connections/eventsDB.js');
const { connectToUserDB } = require('./connections/userDB');
const { connectToVendorDB } = require('./connections/vendorDB');

module.exports = {
  poweredByHeader: false,
  images: {
    domains: ['res.cloudinary.com'],
  },
  experimental: {
    serverActions: true,
  }
};