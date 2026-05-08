const mongoose = require('mongoose');
const dns = require('dns');

// Force Node.js to use IPv4 first — fixes ECONNREFUSED on many networks
dns.setDefaultResultOrder('ipv4first');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,  // 10s timeout instead of 30s default
      socketTimeoutMS: 45000,
      family: 4                         // Force IPv4
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // If SRV lookup fails, suggest the standard connection string
    if (error.message.includes('querySrv') || error.message.includes('ECONNREFUSED')) {
      console.error('💡 Tip: Your DNS may be blocking SRV lookups.');
      console.error('   Try flushing DNS: ipconfig /flushdns');
      console.error('   Or switch to a standard mongodb:// connection string from Atlas.');
    }
    process.exit(1);
  }

  mongoose.connection.on('error', (err) => {
    console.error(`❌ MongoDB runtime error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected');
  });
};

module.exports = connectDB;
