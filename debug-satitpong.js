const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const UserSchema = new mongoose.Schema({}, {
  timestamps: true,
  strict: false
});

const User = mongoose.model('User', UserSchema);

async function debugSatitpong() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'labflow',
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('📦 Connected to MongoDB');

    // Find satitpong user
    const user = await User.findOne({ username: 'satitpong' });
    
    if (user) {
      console.log('\n🔍 Found satitpong user:');
      console.log('Raw data:', JSON.stringify(user, null, 2));
      console.log('\nSpecific fields:');
      console.log('- _id:', user._id);
      console.log('- username:', `"${user.username}"`);
      console.log('- password:', `"${user.password}"`);
      console.log('- firstName:', `"${user.firstName}"`);
      console.log('- lastName:', `"${user.lastName}"`);
      console.log('- phone:', `"${user.phone}"`);
      
      // Check for any hidden characters
      console.log('\nCharacter analysis:');
      console.log('- username length:', user.username?.length);
      console.log('- password length:', user.password?.length);
      console.log('- username bytes:', Buffer.from(user.username || '', 'utf8'));
      console.log('- password bytes:', Buffer.from(user.password || '', 'utf8'));
      
    } else {
      console.log('❌ User "satitpong" not found');
      
      // Show all users to see what's available
      const allUsers = await User.find({});
      console.log('\n📋 All users in database:');
      allUsers.forEach((u, i) => {
        console.log(`${i + 1}. "${u.username}" - "${u.password}"`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected');
  }
}

debugSatitpong();
