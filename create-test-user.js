const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// User Schema
const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['ผู้ดูแลระบบ', 'แพทย์', 'พยาบาล', 'เจ้าหน้าที่'],
    default: 'เจ้าหน้าที่'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', UserSchema);

async function createTestUser() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'labflow',
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('📦 MongoDB connected successfully');

    // Delete existing test user if exists
    await User.deleteOne({ username: 'testuser' });
    console.log('🗑️ Deleted existing test user (if any)');

    // Create new test user
    const testUser = new User({
      firstName: 'Test',
      lastName: 'User',
      phone: '0123456789',
      username: 'testuser',
      password: '123456',
      name: 'Test User',
      role: 'เจ้าหน้าที่',
      isActive: true
    });

    await testUser.save();
    console.log('✅ Test user created successfully');
    console.log('Username: testuser');
    console.log('Password: 123456');
    console.log('Role: เจ้าหน้าที่');

    // Verify the user was created
    const createdUser = await User.findOne({ username: 'testuser' });
    if (createdUser) {
      console.log('\n🔍 Verification - User found in database:');
      console.log('ID:', createdUser._id);
      console.log('Username:', createdUser.username);
      console.log('Password:', createdUser.password);
      console.log('Active:', createdUser.isActive);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

createTestUser();
