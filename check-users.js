const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// User Schema (same as in auth.js)
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

async function checkUsers() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'labflow',
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('📦 MongoDB connected successfully');

    // Find all users
    const users = await User.find({});
    console.log('\n📋 Users in database:');
    console.log('Total users:', users.length);
    
    users.forEach((user, index) => {
      console.log(`\n--- User ${index + 1} ---`);
      console.log('ID:', user._id);
      console.log('Username:', user.username);
      console.log('Password:', user.password);
      console.log('FirstName:', user.firstName);
      console.log('LastName:', user.lastName);
      console.log('Phone:', user.phone);
      console.log('Role:', user.role);
      console.log('Active:', user.isActive);
    });

    // Try to find the specific user
    const satitpongUser = await User.findOne({ username: 'satitpong' });
    if (satitpongUser) {
      console.log('\n🔍 Found satitpong user:');
      console.log('Username:', satitpongUser.username);
      console.log('Password:', satitpongUser.password);
      console.log('Active:', satitpongUser.isActive);
    } else {
      console.log('\n❌ User "satitpong" not found in database');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

checkUsers();
