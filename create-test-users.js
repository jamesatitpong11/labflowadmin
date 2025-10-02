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
    required: true
  },
  role: {
    type: String,
    enum: ['ผู้ดูแลระบบ', 'แพทย์', 'พยาบาล', 'เจ้าหน้าที่'],
    default: 'เจ้าหน้าที่'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'labflow',
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Create test users
const createTestUsers = async () => {
  try {
    await connectDB();

    // Test users data
    const testUsers = [
      {
        firstName: 'สถิตพงษ์',
        lastName: 'แสงอรุณ',
        phone: '0949456579',
        username: 'satitpong',
        password: 'admin123456',
        role: 'ผู้ดูแลระบบ'
      },
      {
        firstName: 'นพ.สมชาย',
        lastName: 'ใจดี',
        phone: '081-234-5678',
        username: 'doctor',
        password: 'doctor123',
        role: 'แพทย์'
      },
      {
        firstName: 'พยาบาล สมหญิง',
        lastName: 'สวยงาม',
        phone: '082-345-6789',
        username: 'nurse',
        password: 'nurse123',
        role: 'พยาบาล'
      },
      {
        firstName: 'ประยุทธ',
        lastName: 'มั่นคง',
        phone: '083-456-7890',
        username: 'staff',
        password: 'staff123',
        role: 'เจ้าหน้าที่'
      }
    ];

    console.log('🔄 Creating test users...');

    // Clear existing users (optional)
    await User.deleteMany({});
    console.log('🗑️ Cleared existing users');

    // Create new users
    for (const userData of testUsers) {
      try {
        const user = new User(userData);
        await user.save();
        console.log(`✅ Created user: ${userData.username} (${userData.role})`);
      } catch (error) {
        if (error.code === 11000) {
          console.log(`⚠️ User ${userData.username} already exists, skipping...`);
        } else {
          console.error(`❌ Error creating user ${userData.username}:`, error.message);
        }
      }
    }

    console.log('🎉 Test users creation completed!');
    console.log('\n📋 Login credentials:');
    testUsers.forEach(user => {
      console.log(`👤 ${user.role}: ${user.username} / ${user.password}`);
    });

    // List all users in database
    console.log('\n📊 Users in database:');
    const allUsers = await User.find({}, 'username firstName lastName role isActive');
    allUsers.forEach(user => {
      console.log(`- ${user.username}: ${user.firstName} ${user.lastName} (${user.role}) - Active: ${user.isActive}`);
    });

  } catch (error) {
    console.error('❌ Error creating test users:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the script
createTestUsers();
