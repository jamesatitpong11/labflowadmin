const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const UserSchema = new mongoose.Schema({}, {
  timestamps: true,
  strict: false
});

const User = mongoose.model('User', UserSchema);

async function recreateSatitpong() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'labflow',
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('📦 Connected to MongoDB');

    // Delete existing satitpong user
    const deleteResult = await User.deleteOne({ username: 'satitpong' });
    console.log('🗑️ Deleted existing satitpong user:', deleteResult.deletedCount);

    // Create new satitpong user with exact data
    const newUser = new User({
      firstName: 'สถิตพงษ์',
      lastName: 'แสงอรุณ',
      phone: '0949456579',
      username: 'satitpong',
      password: 'admin123456',
      name: 'สถิตพงษ์ แสงอรุณ',
      role: 'ผู้ดูแลระบบ',
      isActive: true
    });

    await newUser.save();
    console.log('✅ Created new satitpong user');

    // Verify the user
    const verifyUser = await User.findOne({ username: 'satitpong' });
    console.log('\n🔍 Verification:');
    console.log('Username:', `"${verifyUser.username}"`);
    console.log('Password:', `"${verifyUser.password}"`);
    console.log('Active:', verifyUser.isActive);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected');
  }
}

recreateSatitpong();
