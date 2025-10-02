const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function testConnection() {
  console.log('🔄 Testing MongoDB connection...');
  console.log('📍 MongoDB URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
  
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in environment variables');
    process.exit(1);
  }

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'labflow',
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000,
    });

    console.log('✅ MongoDB connected successfully!');
    console.log('📊 Connection details:');
    console.log('  - Database:', mongoose.connection.db.databaseName);
    console.log('  - Host:', mongoose.connection.host);
    console.log('  - Port:', mongoose.connection.port);
    console.log('  - Ready state:', mongoose.connection.readyState);

    // Test creating a simple document
    const TestSchema = new mongoose.Schema({
      message: String,
      timestamp: { type: Date, default: Date.now }
    });
    
    const TestModel = mongoose.model('Test', TestSchema);
    
    const testDoc = new TestModel({
      message: 'Connection test successful'
    });
    
    await testDoc.save();
    console.log('✅ Test document created successfully');
    
    // Clean up test document
    await TestModel.deleteOne({ _id: testDoc._id });
    console.log('🧹 Test document cleaned up');

  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('  Error:', error.message);
    
    if (error.name === 'MongoServerSelectionError') {
      console.error('  Possible causes:');
      console.error('  - Network connectivity issues');
      console.error('  - Incorrect connection string');
      console.error('  - MongoDB Atlas IP whitelist restrictions');
      console.error('  - Database credentials are incorrect');
    }
    
    process.exit(1);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
    process.exit(0);
  }
}

// Run the test
testConnection();
