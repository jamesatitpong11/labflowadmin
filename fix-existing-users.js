const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Simple User Schema - match existing database structure
const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phone: String,
  username: String,
  password: String
}, {
  timestamps: true,
  strict: false // Allow additional fields from existing data
});

const User = mongoose.model('User', UserSchema);

async function fixExistingUsers() {
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
    console.log(`\n📋 Found ${users.length} users in database`);

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      console.log(`\n--- User ${i + 1}: ${user.username} ---`);
      console.log('Current password:', user.password);
      
      // Check if password is hashed (longer than 20 chars or starts with $)
      if (user.password && (user.password.startsWith('$') || user.password.length > 20)) {
        console.log('🔧 Fixing hashed password...');
        
        // Set plain text password for known users
        let newPassword = '123456'; // default
        if (user.username === 'satitpong') {
          newPassword = 'admin123456';
        }
        
        await User.updateOne({ _id: user._id }, { password: newPassword });
        console.log(`✅ Password updated to: ${newPassword}`);
      } else {
        console.log('✅ Password is already plain text');
      }
    }

    // Show final status
    console.log('\n📊 Final user list:');
    const finalUsers = await User.find({});
    finalUsers.forEach((user, index) => {
      console.log(`${index + 1}. Username: ${user.username} | Password: ${user.password}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

fixExistingUsers();
